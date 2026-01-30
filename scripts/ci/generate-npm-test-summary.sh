#!/usr/bin/env bash
# Generate npm test publish summary
# Usage: generate-npm-test-summary.sh <tag>

set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: $(basename "$0") <tag>" >&2
  exit 2
fi

: "${GITHUB_STEP_SUMMARY:?GITHUB_STEP_SUMMARY must be set by GitHub Actions}"

TAG="$1"
PACKAGE_NAME="@lgtm-hq/turbo-themes"

echo "## 📦 Test Publish Complete" >>"$GITHUB_STEP_SUMMARY"
echo "" >>"$GITHUB_STEP_SUMMARY"
echo "**Package:** $PACKAGE_NAME" >>"$GITHUB_STEP_SUMMARY"
echo "**npm tag:** $TAG" >>"$GITHUB_STEP_SUMMARY"
echo "" >>"$GITHUB_STEP_SUMMARY"
echo "### Installation" >>"$GITHUB_STEP_SUMMARY"
echo "\`\`\`bash" >>"$GITHUB_STEP_SUMMARY"
echo "npm install ${PACKAGE_NAME}@${TAG}" >>"$GITHUB_STEP_SUMMARY"
echo "\`\`\`" >>"$GITHUB_STEP_SUMMARY"
echo "" >>"$GITHUB_STEP_SUMMARY"
echo "🔗 [View on npm](https://www.npmjs.com/package/${PACKAGE_NAME})" >>"$GITHUB_STEP_SUMMARY"
