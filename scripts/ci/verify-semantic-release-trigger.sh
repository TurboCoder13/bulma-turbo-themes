#!/bin/bash
# Verify that commit messages will trigger semantic release
# Usage: verify-semantic-release-trigger.sh [base_ref] [head_ref]

set -euo pipefail

BASE_REF="${1:-origin/main}"
HEAD_REF="${2:-HEAD}"

echo "🔍 Checking if commits will trigger semantic release between $BASE_REF and $HEAD_REF"

# Get commit messages between base and head
COMMITS=$(git log --pretty=format:"%s" "$BASE_REF..$HEAD_REF")

if [ -z "$COMMITS" ]; then
  echo "✅ No commits to analyze"
  exit 0
fi

# Semantic release rules from .releaserc.json
# Types that trigger releases:
# - feat: minor
# - fix: patch  
# - perf: patch
# - refactor: patch
# - revert: patch
# - build: patch
# - BREAKING CHANGE: major

RELEASE_TYPES="feat|fix|perf|refactor|revert|build"
BREAKING_PATTERN="BREAKING CHANGE"

WILL_RELEASE=false
RELEASE_TYPE=""
COMMIT_COUNT=0

while IFS= read -r commit_msg; do
  COMMIT_COUNT=$((COMMIT_COUNT + 1))
  
  # Skip merge commits
  if [[ "$commit_msg" =~ ^Merge ]]; then
    echo "⏭️  Skipping merge commit: $commit_msg"
    continue
  fi
  
  # Check for breaking changes
  if [[ "$commit_msg" =~ $BREAKING_PATTERN ]]; then
    echo "🚨 Breaking change detected: $commit_msg"
    WILL_RELEASE=true
    RELEASE_TYPE="major"
    break
  fi
  
  # Check for release-triggering types
  if [[ "$commit_msg" =~ ^($RELEASE_TYPES)(\(.+\))?: ]]; then
    echo "📦 Release-triggering commit: $commit_msg"
    WILL_RELEASE=true
    
    # Determine release type
    if [[ "$commit_msg" =~ ^feat ]]; then
      RELEASE_TYPE="minor"
    else
      RELEASE_TYPE="patch"
    fi
  else
    echo "⏭️  Non-release commit: $commit_msg"
  fi
done <<< "$COMMITS"

echo ""
echo "📊 Semantic release analysis:"
echo "   Total commits: $COMMIT_COUNT"

if [ "$WILL_RELEASE" = true ]; then
  echo "✅ Will trigger semantic release"
  echo "   Release type: $RELEASE_TYPE"
  echo ""
  echo "🎯 This will:"
  echo "   - Create a new git tag (v*.*.*)"
  echo "   - Generate CHANGELOG.md"
  echo "   - Publish to npm"
  echo "   - Create GitHub release"
else
  echo "⏭️  Will NOT trigger semantic release"
  echo ""
  echo "💡 To trigger a release, include commits with:"
  echo "   - feat: (minor version)"
  echo "   - fix:, perf:, refactor:, revert:, build: (patch version)"
  echo "   - BREAKING CHANGE: (major version)"
fi

# Exit with success regardless - this is informational
exit 0
