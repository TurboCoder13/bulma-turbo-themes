#!/bin/bash
# Validate version format
# Usage: validate-version-format.sh <version>

set -euo pipefail

VERSION="$1"
if [[ ! "$VERSION" =~ ^v[0-9]+\.[0-9]+\.[0-9]+(-[a-zA-Z0-9.]+)?$ ]]; then
  echo "❌ Error: Invalid version format. Expected format: v1.2.3 or v1.2.3-beta.1"
  exit 1
fi
echo "✅ Version format is valid: $VERSION"
