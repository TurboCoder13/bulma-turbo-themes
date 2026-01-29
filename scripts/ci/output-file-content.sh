#!/usr/bin/env bash
# Output file content as multi-line GitHub output
# Usage: output-file-content.sh <output-name> <file-path>

set -euo pipefail

OUTPUT_NAME="${1:?Output name is required}"
FILE_PATH="${2:?File path is required}"

if [ ! -f "$FILE_PATH" ]; then
  echo "Error: File not found: $FILE_PATH" >&2
  exit 1
fi

{
  echo "$OUTPUT_NAME<<EOF"
  cat "$FILE_PATH"
  echo "EOF"
} >>"$GITHUB_OUTPUT"

echo "✅ File content output to $OUTPUT_NAME"
