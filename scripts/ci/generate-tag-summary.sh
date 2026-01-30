#!/usr/bin/env bash
# Generate tag creation summary
# Usage: generate-tag-summary.sh <version> <prerelease>

set -euo pipefail

VERSION="$1"
PRERELEASE="$2"

{
  echo "## 🏷️ Tag Created Successfully"
  echo ""
  echo "**Version:** $VERSION"
  echo "**Pre-release:** $PRERELEASE"
  echo ""
  echo "This tag will trigger the publish workflow automatically."
  echo ""
  echo "🔗 [View tag on GitHub](https://github.com/${GITHUB_REPOSITORY}/releases/tag/$VERSION)"
} >>"$GITHUB_STEP_SUMMARY"
