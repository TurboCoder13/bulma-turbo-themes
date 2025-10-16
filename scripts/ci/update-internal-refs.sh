#!/bin/bash
# Update internal references to target SHA
# Usage: update-internal-refs.sh <target_sha>

set -euo pipefail

TARGET_SHA="$1"
echo "Updating internal references to SHA: $TARGET_SHA"

# Update composite action references in workflows
find .github/workflows -name "*.yml" -type f -exec sed -i '' \
  's|uses: \./\.github/actions/\([^@]*\)@[a-f0-9]\{40\}|uses: ./.github/actions/\1@'"${TARGET_SHA}"'|g' {} \;

# Update reusable workflow references
find .github/workflows -name "*.yml" -type f -exec sed -i '' \
  's|uses: .*/.github/workflows/reusable-\([^@]*\)@[a-f0-9]\{40\}|uses: ${{ github.repository }}/.github/workflows/reusable-\1@'"${TARGET_SHA}"'|g' {} \;
