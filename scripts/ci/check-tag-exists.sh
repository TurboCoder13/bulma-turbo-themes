#!/usr/bin/env bash
# Check if tag already exists
# Usage: check-tag-exists.sh <version>

set -euo pipefail

VERSION="$1"
if git rev-parse "$VERSION" >/dev/null 2>&1; then
  echo "❌ Error: Tag $VERSION already exists"
  exit 1
fi
echo "✅ Tag $VERSION does not exist yet"
