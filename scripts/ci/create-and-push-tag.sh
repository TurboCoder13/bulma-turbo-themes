#!/usr/bin/env bash
# Create and push git tag
# Usage: create-and-push-tag.sh <version> <prerelease>

set -euo pipefail

VERSION="$1"
PRERELEASE="$2"

git config user.name "github-actions[bot]"
git config user.email "github-actions[bot]@users.noreply.github.com"

MESSAGE="Release $VERSION"
if [ "$PRERELEASE" = "true" ]; then
  MESSAGE="Pre-release $VERSION"
fi

git tag -a "$VERSION" -m "$MESSAGE"
git push origin "$VERSION"

echo "✅ Successfully created and pushed tag: $VERSION"
