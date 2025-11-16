#!/usr/bin/env bash
set -euo pipefail

# Generate SHA256 checksum for gem file
# Args: $1 - path to gem file

if [ $# -ne 1 ]; then
  echo "Usage: $0 <gem-file>"
  exit 1
fi

GEM_FILE="$1"

if [ ! -f "$GEM_FILE" ]; then
  echo "❌ Gem file not found: $GEM_FILE"
  exit 1
fi

CHECKSUM=$(sha256sum "$GEM_FILE" | cut -d' ' -f1)
echo "sha256=$CHECKSUM" >> "$GITHUB_OUTPUT"
echo "📋 SHA256: $CHECKSUM"

