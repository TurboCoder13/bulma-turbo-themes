#!/usr/bin/env bash
# Generate semantic release summary
# Usage: generate-semantic-release-summary.sh

set -euo pipefail

{
  echo "## 🚀 Semantic Release Complete"
  echo ""
  echo "The release process has completed."
  echo ""
  echo "If a new version was released:"
  echo "- 📝 CHANGELOG.md has been updated"
  echo "- 📦 package.json version has been bumped"
  echo "- 🏷️ Git tag has been created"
  echo "- 🎉 GitHub release has been published"
  echo "- 📮 npm package has been published"
} >>"$GITHUB_STEP_SUMMARY"
