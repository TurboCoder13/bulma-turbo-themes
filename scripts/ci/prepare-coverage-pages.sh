#!/usr/bin/env bash

# Prepare coverage artifacts for GitHub Pages deployment

set -euo pipefail

mkdir -p apps/site/dist/coverage
if [ -d coverage ] && compgen -G "coverage/*" >/dev/null; then
  cp -r coverage/* apps/site/dist/coverage/
fi

echo "✅ Coverage artifacts prepared for deployment"
