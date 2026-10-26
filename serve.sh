#!/usr/bin/env bash
# Serve the site on every network interface so other devices can open it.
set -euo pipefail
cd "$(dirname "$0")"

PORT="${1:-8080}"

if command -v python3 >/dev/null 2>&1; then
  PY=python3
elif command -v python >/dev/null 2>&1; then
  PY=python
else
  echo "Python 3 is required to run the local server." >&2
  exit 1
fi

echo "Serving: $(pwd)"
echo "  Local:   http://localhost:${PORT}"

if command -v hostname >/dev/null 2>&1; then
  hostname -I 2>/dev/null | tr ' ' '\n' | grep -E '^[0-9]+\.' | grep -v '^127\.' | while read -r ip; do
    echo "  Network: http://${ip}:${PORT}"
  done
fi

if command -v firewall-cmd >/dev/null 2>&1 && firewall-cmd --state >/dev/null 2>&1; then
  if ! firewall-cmd --query-port="${PORT}/tcp" >/dev/null 2>&1; then
    echo
    echo "If another device cannot connect, open the port on Fedora:"
    echo "  sudo firewall-cmd --add-port=${PORT}/tcp --permanent && sudo firewall-cmd --reload"
  fi
fi

echo
echo "Press Ctrl+C to stop."
exec "$PY" -m http.server "${PORT}" --bind 0.0.0.0
