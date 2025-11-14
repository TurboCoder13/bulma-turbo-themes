#!/bin/bash

# Prepare coverage artifacts for GitHub Pages deployment

set -euo pipefail

mkdir -p _site/coverage
if [ -d coverage ] && compgen -G "coverage/*" >/dev/null; then
  cp -r coverage/* _site/coverage/
fi

echo "✅ Coverage artifacts prepared for deployment"

