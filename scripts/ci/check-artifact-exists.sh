#!/usr/bin/env bash
# Check if an artifact directory exists and is not empty
# Sets output: exists=true|false

set -euo pipefail

ARTIFACT_PATH="${1:?Error: Artifact path not provided}"
ARTIFACT_NAME="${2:?Error: Artifact name not provided}"

if [ -d "$ARTIFACT_PATH" ] && [ -n "$(ls -A "$ARTIFACT_PATH" 2>/dev/null)" ]; then
  echo "exists=true" >>"$GITHUB_OUTPUT"
  echo "✅ $ARTIFACT_NAME found"
  find "$ARTIFACT_PATH" -type f -print
else
  echo "exists=false" >>"$GITHUB_OUTPUT"
  echo "⚠️ No $ARTIFACT_NAME found, skipping deployment"
fi
