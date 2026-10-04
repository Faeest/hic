#!/usr/bin/env bash
set -euo pipefail

HOST=103.169.186.163
PORT=25567
USER=lerraf
APP=/home/lerraf/hic
ENV_FILE=/home/lerraf/hic.env
PORT_APP=3100

cd "$(dirname "$0")"

if [ -n "$(git status --porcelain)" ]; then
  echo "WARNING: uncommitted local changes exist; deploy uses git HEAD only"
fi

WORK="$(mktemp -d)"
TARBALL="$WORK/hic-deploy.tar.gz"
REMOTE_SH="$WORK/hic-remote.sh"

echo "==> 0/4 checking server env file"
ssh -o BatchMode=yes -p "$PORT" "$USER@$HOST" "test -f $ENV_FILE" || {
  echo "ERROR: $ENV_FILE missing on server."
  echo "Create it with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY."
  exit 1
}

echo "==> 1/4 archiving git HEAD"
git archive --format=tar.gz -o "$TARBALL" HEAD

echo "==> 2/4 uploading source"
scp -q -P "$PORT" "$TARBALL" "$USER@$HOST:/home/lerraf/hic-deploy.tar.gz"

cat > "$REMOTE_SH" <<EOF
set -e
APP=$APP
ENV_FILE=$ENV_FILE
SUCCESS=0
rollback() {
  if [ "\$SUCCESS" = "0" ] && [ -d "\$APP.old" ]; then
    rm -rf "\$APP.failed"
    mv "\$APP" "\$APP.failed" 2>/dev/null || true
    mv "\$APP.old" "\$APP"
    systemctl --user restart hic.service || true
    echo "!! deploy failed - rolled back to the previous version"
  fi
}
trap rollback EXIT
rm -rf "\$APP.old"
[ -d "\$APP" ] && mv "\$APP" "\$APP.old"
mkdir -p "\$APP"
tar -xzf /home/lerraf/hic-deploy.tar.gz -C "\$APP"
cd "\$APP"
# The build fetches content from Supabase, so the env must be present here too.
cp "\$ENV_FILE" "\$APP/.env.local"
npm ci --no-audit --no-fund
npm run build
systemctl --user restart hic.service
sleep 5
curl -sf --retry 5 --retry-delay 2 -o /dev/null http://127.0.0.1:$PORT_APP/ && echo "=> app responded 200 on :$PORT_APP"
SUCCESS=1
EOF

echo "==> 3/4 running remote deploy"
scp -q -P "$PORT" "$REMOTE_SH" "$USER@$HOST:/tmp/hic-deploy.sh"
ssh -o BatchMode=yes -p "$PORT" "$USER@$HOST" "sh /tmp/hic-deploy.sh"

echo "==> 4/4 cleanup"
ssh -o BatchMode=yes -p "$PORT" "$USER@$HOST" "rm -f /tmp/hic-deploy.sh /home/lerraf/hic-deploy.tar.gz && rm -rf $APP.old"
rm -rf "$WORK"

echo "==> deploy complete: https://hic.faeest.my.id"
