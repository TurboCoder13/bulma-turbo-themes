#!/usr/bin/env bash
# Generate tag creation summary
# Usage: generate-tag-summary.sh <version> <prerelease>

set -euo pipefail

VERSION="$1"
PRERELEASE="$2"

echo "## 🏷️ Tag Created Successfully" >> $GITHUB_STEP_SUMMARY
echo "" >> $GITHUB_STEP_SUMMARY
echo "**Version:** $VERSION" >> $GITHUB_STEP_SUMMARY
echo "**Pre-release:** $PRERELEASE" >> $GITHUB_STEP_SUMMARY
echo "" >> $GITHUB_STEP_SUMMARY
echo "This tag will trigger the publish workflow automatically." >> $GITHUB_STEP_SUMMARY
echo "" >> $GITHUB_STEP_SUMMARY
echo "🔗 [View tag on GitHub](https://github.com/${{ github.repository }}/releases/tag/$VERSION)" >> $GITHUB_STEP_SUMMARY
