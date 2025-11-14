#!/usr/bin/env bash
# Verify Playwright artifact structure and integrity
# Usage: verify-playwright-artifact.sh [artifact-path]

set -euo pipefail

ARTIFACT_PATH="${1:-playwright-report}"

echo "Verifying Playwright artifact: $ARTIFACT_PATH"

# Check if directory exists
if [ ! -d "$ARTIFACT_PATH" ]; then
  echo "❌ Error: Artifact directory '$ARTIFACT_PATH' does not exist"
  exit 1
fi

# Check if directory is not empty
if [ -z "$(ls -A "$ARTIFACT_PATH" 2>/dev/null)" ]; then
  echo "❌ Error: Artifact directory '$ARTIFACT_PATH' is empty"
  exit 1
fi

# Check file count and size
FILE_COUNT=$(find "$ARTIFACT_PATH" -type f | wc -l)
TOTAL_SIZE=$(du -sb "$ARTIFACT_PATH" | cut -f1)

if [ "$FILE_COUNT" -eq 0 ]; then
  echo "❌ Error: No files found in artifact directory '$ARTIFACT_PATH'"
  exit 1
fi

if [ "$TOTAL_SIZE" -eq 0 ]; then
  echo "❌ Error: Artifact directory '$ARTIFACT_PATH' has zero total size"
  exit 1
fi

# Validate expected structure
if [ ! -f "$ARTIFACT_PATH/index.html" ]; then
  echo "❌ Error: $ARTIFACT_PATH/index.html not found"
  echo "Artifact structure validation failed. Expected: $ARTIFACT_PATH/index.html"
  exit 1
fi

if [ ! -d "$ARTIFACT_PATH/_assets" ]; then
  echo "❌ Error: $ARTIFACT_PATH/_assets directory not found"
  exit 1
fi

echo "✅ Artifact verification passed:"
echo "   - Directory exists: $ARTIFACT_PATH"
echo "   - File count: $FILE_COUNT"
echo "   - Total size: $TOTAL_SIZE bytes"
echo "   - Structure: Valid (index.html + _assets found)"
