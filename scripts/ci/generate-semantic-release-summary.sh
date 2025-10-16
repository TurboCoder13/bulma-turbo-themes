#!/bin/bash
# Generate semantic release summary
# Usage: generate-semantic-release-summary.sh

set -euo pipefail

echo "## 🚀 Semantic Release Complete" >> $GITHUB_STEP_SUMMARY
echo "" >> $GITHUB_STEP_SUMMARY
echo "The release process has completed." >> $GITHUB_STEP_SUMMARY
echo "" >> $GITHUB_STEP_SUMMARY
echo "If a new version was released:" >> $GITHUB_STEP_SUMMARY
echo "- 📝 CHANGELOG.md has been updated" >> $GITHUB_STEP_SUMMARY
echo "- 📦 package.json version has been bumped" >> $GITHUB_STEP_SUMMARY
echo "- 🏷️ Git tag has been created" >> $GITHUB_STEP_SUMMARY
echo "- 🎉 GitHub release has been published" >> $GITHUB_STEP_SUMMARY
echo "- 📮 npm package has been published" >> $GITHUB_STEP_SUMMARY
