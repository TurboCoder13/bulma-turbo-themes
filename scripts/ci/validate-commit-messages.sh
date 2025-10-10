#!/bin/bash
# Validate commit messages against Conventional Commits
# Usage: validate-commit-messages.sh [base_ref] [head_ref]

set -euo pipefail

BASE_REF="${1:-origin/HEAD}"
HEAD_REF="${2:-HEAD}"

# If running in GitHub Actions for a PR, prefer event payload SHAs to avoid
# shallow clone issues where HEAD~1 or origin/HEAD may be unavailable.
if [ -n "${GITHUB_EVENT_PATH:-}" ] && command -v jq >/dev/null 2>&1; then
  PR_BASE_SHA=$(jq -r '.pull_request.base.sha // empty' "${GITHUB_EVENT_PATH}" 2>/dev/null || echo "")
  PR_HEAD_SHA=$(jq -r '.pull_request.head.sha // empty' "${GITHUB_EVENT_PATH}" 2>/dev/null || echo "")
  PR_BASE_REFNAME=$(jq -r '.pull_request.base.ref // empty' "${GITHUB_EVENT_PATH}" 2>/dev/null || echo "")
  if [ -n "$PR_BASE_SHA" ] && [ -n "$PR_HEAD_SHA" ]; then
    BASE_REF="$PR_BASE_SHA"
    HEAD_REF="$PR_HEAD_SHA"
  fi
fi

# Ensure the base commit exists locally in shallow clones; attempt a targeted fetch
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

echo "🔍 Validating commit messages between $BASE_REF and $HEAD_REF"

# Check if base ref exists, fallback to HEAD~1 if not
if ! git rev-parse --verify "$BASE_REF" >/dev/null 2>&1; then
  echo "⚠️  Base ref $BASE_REF not found, attempting HEAD~1"
  if git rev-parse --verify "HEAD~1" >/dev/null 2>&1; then
    BASE_REF="HEAD~1"
  else
    echo "⚠️  HEAD~1 not available; will validate only the latest commit"
    BASE_REF=""
  fi
fi

# Get commit messages between base and head
if [ -n "$BASE_REF" ] && git rev-parse --verify "$BASE_REF" >/dev/null 2>&1; then
  if git log -1 "$HEAD_REF" >/dev/null 2>&1; then
    if git merge-base --is-ancestor "$BASE_REF" "$HEAD_REF" >/dev/null 2>&1; then
      COMMITS=$(git log --pretty=format:"%s" "$BASE_REF..$HEAD_REF")
    else
      echo "⚠️  Base $BASE_REF is not an ancestor of $HEAD_REF; validating HEAD only"
      COMMITS=$(git log --pretty=format:"%s" -1 "$HEAD_REF")
    fi
  else
    COMMITS=$(git log --pretty=format:"%s" -1)
  fi
else
  COMMITS=$(git log --pretty=format:"%s" -1 "$HEAD_REF")
fi

if [ -z "$COMMITS" ]; then
  echo "✅ No commits to validate"
  exit 0
fi

# Conventional Commits pattern
PATTERN="^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\(.+\))?: .+"

# Allowed types (same as PR title validation)
ALLOWED_TYPES="feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert"

EXIT_CODE=0
COMMIT_COUNT=0
INVALID_COUNT=0

while IFS= read -r commit_msg; do
  COMMIT_COUNT=$((COMMIT_COUNT + 1))
  
  # Skip merge commits
  if [[ "$commit_msg" =~ ^Merge ]]; then
    echo "⏭️  Skipping merge commit: $commit_msg"
    continue
  fi
  
  # Check if commit message matches Conventional Commits pattern
  if [[ ! "$commit_msg" =~ $PATTERN ]]; then
    echo "❌ Invalid commit message: $commit_msg"
    echo "   Expected format: type(scope): description"
    echo "   Allowed types: $ALLOWED_TYPES"
    INVALID_COUNT=$((INVALID_COUNT + 1))
    EXIT_CODE=1
  else
    echo "✅ Valid commit: $commit_msg"
  fi
done <<< "$COMMITS"

echo ""
echo "📊 Commit validation summary:"
echo "   Total commits: $COMMIT_COUNT"
echo "   Invalid commits: $INVALID_COUNT"

if [ $EXIT_CODE -eq 0 ]; then
  echo "✅ All commit messages are valid"
else
  echo "❌ Found $INVALID_COUNT invalid commit messages"
  echo ""
  echo "💡 Commit message format:"
  echo "   type(scope): description"
  echo ""
  echo "   Examples:"
  echo "   feat: add new feature"
  echo "   fix: resolve bug"
  echo "   docs: update documentation"
  echo "   feat(auth): add login functionality"
  echo "   fix(ui): correct button styling"
fi

exit $EXIT_CODE
