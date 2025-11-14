#!/usr/bin/env bash
# Generate auto-tag workflow summary
# Uses environment variables:
# - VERSION_INPUT: Manual version input (if provided)
# - CURRENT_VERSION: Current version from version-check
# - VERSION_CHANGED: Whether version changed
# - TAG_EXISTS: Whether tag already exists
# - PRERELEASE: Whether this is a prerelease

set -euo pipefail

{
  echo "## Auto Tag Summary"
  
  if [ -n "${VERSION_INPUT:-}" ]; then
    echo "🔧 **Manual Dispatch**"
    echo "- Version: ${CURRENT_VERSION:-unknown}"
    echo "- Prerelease: ${PRERELEASE:-false}"
  fi
  
  if [ "${VERSION_CHANGED:-false}" = "false" ]; then
    echo "ℹ️ Version unchanged, no tag needed"
  elif [ "${TAG_EXISTS:-false}" = "true" ]; then
    TAG="v${CURRENT_VERSION:-unknown}"
    echo "ℹ️ Tag $TAG already exists"
  else
    TAG="v${CURRENT_VERSION:-unknown}"
    echo "✅ Created tag $TAG"
    echo "🚀 This will trigger the release-publish-pr workflow"
  fi
} >> "$GITHUB_STEP_SUMMARY"

echo "✅ Auto tag summary generated"
