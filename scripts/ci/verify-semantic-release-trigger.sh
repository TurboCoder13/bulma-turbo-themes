#!/bin/bash
# Verify that commit messages will trigger semantic release
# Usage: verify-semantic-release-trigger.sh [base_ref] [head_ref]

set -euo pipefail

BASE_REF="${1:-origin/HEAD}"
HEAD_REF="${2:-HEAD}"

echo "🔍 Checking if commits will trigger semantic release between $BASE_REF and $HEAD_REF"

# Prefer event SHAs for PRs to avoid shallow clone issues
if [ -n "${GITHUB_EVENT_PATH:-}" ] && command -v jq >/dev/null 2>&1; then
  PR_BASE_SHA=$(jq -r '.pull_request.base.sha // empty' "${GITHUB_EVENT_PATH}" 2>/dev/null || echo "")
  PR_HEAD_SHA=$(jq -r '.pull_request.head.sha // empty' "${GITHUB_EVENT_PATH}" 2>/dev/null || echo "")
  PR_BASE_REFNAME=$(jq -r '.pull_request.base.ref // empty' "${GITHUB_EVENT_PATH}" 2>/dev/null || echo "")
  if [ -n "$PR_BASE_SHA" ] && [ -n "$PR_HEAD_SHA" ]; then
    BASE_REF="$PR_BASE_SHA"
    HEAD_REF="$PR_HEAD_SHA"
  fi
fi

# Ensure base commit exists locally; attempt targeted fetch on shallow clones
if [ -n "$BASE_REF" ] && ! git cat-file -e "${BASE_REF}^{commit}" >/dev/null 2>&1; then
  echo "⚠️  Base commit $BASE_REF not present locally; attempting fetch"
  if [ -n "${PR_BASE_REFNAME:-}" ]; then
    git fetch --no-tags --depth=50 origin "$PR_BASE_REFNAME:$PR_BASE_REFNAME" >/dev/null 2>&1 || true
    if git rev-parse --verify "$PR_BASE_REFNAME" >/dev/null 2>&1; then
      BASE_REF="$PR_BASE_REFNAME"
    fi
  fi
  if ! git cat-file -e "${BASE_REF}^{commit}" >/dev/null 2>&1; then
    git fetch --no-tags --deepen=1000 origin >/dev/null 2>&1 || true
  fi
fi

# Get commit messages between base and head; fallback to HEAD-only if needed
if [ -n "$BASE_REF" ] && git rev-parse --verify "$BASE_REF" >/dev/null 2>&1; then
  if git merge-base --is-ancestor "$BASE_REF" "$HEAD_REF" >/dev/null 2>&1; then
    COMMITS=$(git log --pretty=format:"%s" "$BASE_REF..$HEAD_REF")
  else
    echo "⚠️  Base $BASE_REF is not an ancestor of $HEAD_REF; analyzing HEAD only"
    if git rev-parse --verify "$HEAD_REF" >/dev/null 2>&1; then
      COMMITS=$(git log --pretty=format:"%s" -1 "$HEAD_REF")
    else
      echo "⚠️  Head ref $HEAD_REF not found; analyzing literal HEAD"
      COMMITS=$(git log --pretty=format:"%s" -1 HEAD)
    fi
  fi
else
  if git rev-parse --verify "$HEAD_REF" >/dev/null 2>&1; then
    COMMITS=$(git log --pretty=format:"%s" -1 "$HEAD_REF")
  else
    echo "⚠️  Head ref $HEAD_REF not found; analyzing literal HEAD"
    COMMITS=$(git log --pretty=format:"%s" -1 HEAD)
  fi
fi

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
