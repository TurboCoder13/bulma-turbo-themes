#!/bin/bash
set -euo pipefail

# Create release tag
# This script creates and pushes a Git tag for a release

VERSION="${1:-}"
PRERELEASE="${2:-false}"

if [ -z "$VERSION" ]; then
    echo "❌ Error: Version is required"
    exit 1
fi

echo "🏷️ Creating release tag for version: $VERSION"

# Create annotated tag
TAG="v$VERSION"
git tag -a "$TAG" -m "Release $TAG"

# Push tag to remote
git push origin "$TAG"

echo "✅ Created and pushed tag $TAG"

# Generate summary for GitHub Actions
echo "## Auto Tag Summary" >> "$GITHUB_STEP_SUMMARY"
if [ -n "${GITHUB_EVENT_INPUTS_VERSION:-}" ]; then
    echo "🔧 **Manual Dispatch**" >> "$GITHUB_STEP_SUMMARY"
    echo "- Version: $VERSION" >> "$GITHUB_STEP_SUMMARY"
    echo "- Prerelease: $PRERELEASE" >> "$GITHUB_STEP_SUMMARY"
fi
echo "✅ Created tag v$VERSION" >> "$GITHUB_STEP_SUMMARY"
echo "🚀 Tag push will automatically trigger:" >> "$GITHUB_STEP_SUMMARY"
echo "  - 📦 npm publish workflow (release-publish-pr.yml)" >> "$GITHUB_STEP_SUMMARY"
echo "  - 💎 RubyGem publish workflow (publish-gem.yml)" >> "$GITHUB_STEP_SUMMARY"
