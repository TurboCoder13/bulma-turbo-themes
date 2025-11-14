#!/bin/bash

# Prepare Lighthouse report artifacts for GitHub Pages deployment

set -euo pipefail

mkdir -p _site/lighthouse-reports
if [ -d lighthouse-reports ] && find lighthouse-reports -mindepth 1 -print -quit >/dev/null; then
  cp -r lighthouse-reports/* _site/lighthouse-reports/
fi
echo "✅ Lighthouse reports prepared for deployment"
ls -la _site/lighthouse-reports/

