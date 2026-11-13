#!/usr/bin/env bash
# Keeps the Supabase project from being paused for inactivity.
#
# Supabase pauses free projects after ~7 days with no activity. This runs one
# trivial REST query, which counts as activity.
#
# It talks to Supabase DIRECTLY (not through the site), so it still works when
# the Next.js app is down. The primary keepalive is the GitHub Actions workflow
# (.github/workflows/keepalive.yml) because it survives the VPS being offline;
# this script is the local fallback.
#
# Install as a systemd user timer (the box has no crontab; hic.service is a user
# unit too):
#
#   cp deploy/hic-keepalive.{service,timer} ~/.config/systemd/user/
#   systemctl --user daemon-reload
#   systemctl --user enable --now hic-keepalive.timer
#   systemctl --user list-timers hic-keepalive.timer
#
# Manual run:  systemctl --user start hic-keepalive.service
# Logs:        journalctl --user -u hic-keepalive.service -n 20
set -euo pipefail

ENV_FILE="${HIC_ENV_FILE:-/home/lerraf/hic.env}"

if [ -f "$ENV_FILE" ]; then
  set -a
  # shellcheck disable=SC1090
  . "$ENV_FILE"
  set +a
fi

URL="${SUPABASE_URL:-${NEXT_PUBLIC_SUPABASE_URL:-}}"
KEY="${SUPABASE_ANON_KEY:-${NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:-}}"

if [ -z "$URL" ] || [ -z "$KEY" ]; then
  echo "$(date -Is) ERROR: SUPABASE_URL / publishable key not found in $ENV_FILE"
  exit 1
fi

code=$(curl -sS -o /tmp/hic-keepalive.json -w '%{http_code}' --max-time 20 \
  "${URL%/}/rest/v1/site_settings?select=id&limit=1" \
  -H "apikey: $KEY" \
  -H "Authorization: Bearer $KEY")

echo "$(date -Is) HTTP $code $(cat /tmp/hic-keepalive.json 2>/dev/null || true)"

[ "$code" = "200" ]
