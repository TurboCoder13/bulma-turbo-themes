#!/usr/bin/env bash
set -euo pipefail

# Verify gem package is valid
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

gem specification "$GEM_FILE" --ruby
echo "✅ Gem package is valid"
