#!/usr/bin/env bash

# Prepare Lighthouse report artifacts for GitHub Pages deployment

set -euo pipefail

mkdir -p apps/site/dist/lighthouse-reports
if [ -d lighthouse-reports ] && find lighthouse-reports -mindepth 1 -print -quit >/dev/null; then
  cp -r lighthouse-reports/* apps/site/dist/lighthouse-reports/
fi
echo "✅ Lighthouse reports prepared for deployment"
ls -la apps/site/dist/lighthouse-reports/
