#!/bin/bash

# Prepare Playwright report artifacts for GitHub Pages deployment
# Validates artifact structure and copies to deployment directory

set -euo pipefail

ARTIFACT_PATH="${1:?Error: Artifact path not provided}"

# Validate artifact structure: expect playwright-report/ to contain index.html and _assets/
if [ ! -d "$ARTIFACT_PATH" ]; then
  echo "❌ Error: $ARTIFACT_PATH directory not found" >&2
  exit 1
fi

if [ ! -f "$ARTIFACT_PATH/index.html" ]; then
  echo "❌ Error: $ARTIFACT_PATH/index.html not found" >&2
  echo "Artifact structure validation failed. Expected: $ARTIFACT_PATH/index.html" >&2
  exit 1
fi

if [ ! -d "$ARTIFACT_PATH/_assets" ]; then
  echo "❌ Error: $ARTIFACT_PATH/_assets directory not found" >&2
  exit 1
fi

echo "✅ Artifact structure validated"
mkdir -p _site/playwright
cp -r "$ARTIFACT_PATH"/* _site/playwright/ || {
  echo "❌ Error: Failed to copy Playwright report" >&2
  exit 1
}

echo "✅ Playwright reports prepared for deployment"
ls -la _site/playwright/

