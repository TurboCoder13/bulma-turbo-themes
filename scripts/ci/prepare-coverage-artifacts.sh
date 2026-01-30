#!/usr/bin/env bash
set -euo pipefail

# Prepare coverage artifacts for GitHub Pages deployment
# Guard: only copy if coverage directory exists and has content
if [ -d "coverage" ] && [ -n "$(ls -A coverage 2>/dev/null)" ]; then
  mkdir -p apps/site/dist/coverage
  cp -r coverage/* apps/site/dist/coverage/
else
  echo "No coverage directory found or it is empty, skipping..."
fi
