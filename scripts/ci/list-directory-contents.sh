#!/usr/bin/env bash
# List directory contents for debugging
# Usage: list-directory-contents.sh [DIRECTORY]

set -euo pipefail

DIRECTORY="${1:-.}"

echo "Contents of $DIRECTORY:"
ls -la "$DIRECTORY"

if [ -d "$DIRECTORY" ]; then
  echo ""
  echo "Finding all files in $DIRECTORY:"
  find "$DIRECTORY" -type f || true
fi
