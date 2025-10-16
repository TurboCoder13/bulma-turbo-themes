#!/bin/bash
# Perform uptime check
# Usage: uptime-check.sh <url>

set -euo pipefail

URL="$1"
echo "Checking $URL"
code=$(curl -s -o /dev/null -w "%{http_code}" -I "$URL" || echo 000)
echo "HTTP $code"
if [ "$code" -ge 400 ] || [ "$code" -lt 200 ]; then
  echo "Uptime check failed for $URL with status $code" >&2
  exit 1
fi
