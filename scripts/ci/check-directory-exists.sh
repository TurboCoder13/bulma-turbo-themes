#!/usr/bin/env bash
# Check if directory exists and contains files
# Sets output: exists=true|false
# Usage: check-directory-exists.sh <directory-path>

set -euo pipefail

DIRECTORY="${1:?Directory path is required}"

if [ -d "$DIRECTORY" ] && [ -n "$(ls -A "$DIRECTORY" 2>/dev/null)" ]; then
  echo "exists=true" >>"$GITHUB_OUTPUT"
  echo "✅ Directory found: $DIRECTORY"
  find "$DIRECTORY" -type f || true
else
  echo "exists=false" >>"$GITHUB_OUTPUT"
  echo "⚠️ Directory not found or empty: $DIRECTORY"
fi
