#!/usr/bin/env bash
set -euo pipefail

# Generate build summary for GitHub Actions
# Args: $1 - gem name, $2 - version, $3 - sha256

if [ $# -ne 3 ]; then
  echo "Usage: $0 <gem-name> <version> <sha256>"
  exit 1
fi

GEM_NAME="$1"
VERSION="$2"
SHA256="$3"

{
  echo "## 🔨 Build Complete"
  echo ""
  echo "| Property | Value |"
  echo "|----------|-------|"
  echo "| **Gem** | \`$GEM_NAME\` |"
  echo "| **Version** | \`$VERSION\` |"
  echo "| **SHA256** | \`$SHA256\` |"
  echo "| **Tests** | ✅ Passed |"
  echo ""
  echo "Artifact uploaded for publishing step."
} >> "$GITHUB_STEP_SUMMARY"

