#!/usr/bin/env bash
# Detect changes in git repository
# Usage: detect-changes.sh

set -euo pipefail

if git diff --quiet; then
  echo "has_changes=false" >> $GITHUB_OUTPUT
  echo "No changes detected"
else
  echo "has_changes=true" >> $GITHUB_OUTPUT
  echo "Changes detected"
  git diff --stat
fi
