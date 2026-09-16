#!/usr/bin/env bash
set -euo pipefail

HOST=103.169.186.163
PORT=25567
USER=lerraf
APP=/home/lerraf/hic
PORT_APP=3100

cd "$(dirname "$0")"

if [ -n "$(git status --porcelain)" ]; then
  echo "WARNING: uncommitted local changes exist; deploy uses git HEAD only"
fi

WORK="$(mktemp -d)"
TARBALL="$WORK/hic-deploy.tar.gz"
REMOTE_SH="$WORK/hic-remote.sh"

echo "==> 1/4 archiving git HEAD"
git archive --format=tar.gz -o "$TARBALL" HEAD

echo "==> 2/4 uploading source"
scp -q -P "$PORT" "$TARBALL" "$USER@$HOST:/home/lerraf/hic-deploy.tar.gz"

cat > "$REMOTE_SH" <<EOF
set -e
APP=$APP
rm -rf "\$APP.old"
[ -d "\$APP" ] && mv "\$APP" "\$APP.old"
mkdir -p "\$APP"
tar -xzf /home/lerraf/hic-deploy.tar.gz -C "\$APP"
cd "\$APP"
npm ci --no-audit --no-fund
npm run build
systemctl --user restart hic.service
sleep 5
curl -sf --retry 5 --retry-delay 2 -o /dev/null http://127.0.0.1:$PORT_APP/ && echo "=> app responded 200 on :$PORT_APP"
EOF

echo "==> 3/4 running remote deploy"
scp -q -P "$PORT" "$REMOTE_SH" "$USER@$HOST:/tmp/hic-deploy.sh"
ssh -o BatchMode=yes -p "$PORT" "$USER@$HOST" "sh /tmp/hic-deploy.sh"

echo "==> 4/4 cleanup"
ssh -o BatchMode=yes -p "$PORT" "$USER@$HOST" "rm -f /tmp/hic-deploy.sh /home/lerraf/hic-deploy.tar.gz && rm -rf $APP.old"
rm -rf "$WORK"

echo "==> deploy complete: https://hic.faeest.my.id"