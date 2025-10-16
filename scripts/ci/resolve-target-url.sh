#!/bin/bash
# Resolve target URL for uptime check
# Usage: resolve-target-url.sh

set -euo pipefail

URL_INPUT="${{ github.event.inputs.url }}"
if [ -n "$URL_INPUT" ]; then 
  echo "url=$URL_INPUT" >> $GITHUB_OUTPUT
  exit 0
fi
echo "url=${TARGET_URL:-http://localhost:4000}" >> $GITHUB_OUTPUT
