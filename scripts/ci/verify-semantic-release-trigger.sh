#!/usr/bin/env bash
# Verify that commit messages will trigger semantic release
#
# This script checks if commits between a base and head reference contain
# conventional commit messages that would trigger a semantic release.
#
# USAGE:
#   verify-semantic-release-trigger.sh [base_ref] [head_ref]
#
# ENVIRONMENT VARIABLES:
#   GITHUB_EVENT_PATH       - Path to GitHub Actions event payload (auto-populated in CI)
#   DEBUG_MODE              - Enable verbose debugging output (set to 1 or true)
#
# KNOWN LIMITATIONS:
#   - In shallow clones (fetch-depth < 1000), may not have full history
#   - Requires git >= 2.7.0
#   - In PRs: attempt to use event SHAs first, then fetch if needed
#
# EXIT CODES:
#   0 - Script completed successfully (regardless of whether release will trigger)
#   1 - Script failed due to git errors or invalid input
#
# EXAMPLES (Local Testing):
#   # Test against previous commit
#   ./verify-semantic-release-trigger.sh HEAD~1 HEAD
#
#   # Test against main branch
#   ./verify-semantic-release-trigger.sh origin/main HEAD
#
#   # Enable debug output
#   DEBUG_MODE=1 ./verify-semantic-release-trigger.sh HEAD~1 HEAD

set -euo pipefail

# ============================================================================
# CONFIGURATION
# ============================================================================

DEBUG_MODE="${DEBUG_MODE:-0}"
BASE_REF="${1:-HEAD~1}"
HEAD_REF="${2:-HEAD}"

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

# Print debug message if DEBUG_MODE is enabled
debug() {
  if [ "$DEBUG_MODE" = "1" ] || [ "$DEBUG_MODE" = "true" ]; then
    echo "🔧 [DEBUG] $*" >&2
  fi
}

# Print error message and exit
error() {
  echo "❌ ERROR: $*" >&2
  exit 1
}

# Print warning message
warn() {
  echo "⚠️  $*"
}

# Check if a git object exists in the object database
# Returns 0 if object exists, 1 if not
object_exists() {
  local object_sha="$1"
  git cat-file -e "$object_sha^{commit}" >/dev/null 2>&1 && return 0 || return 1
}

# Validate commit SHA format (basic check)
is_valid_sha() {
  local sha="$1"
  # Accept 7+ hex characters (abbreviated SHA) or 40 hex chars (full SHA)
  if [[ "$sha" =~ ^[0-9a-f]{7,40}$ ]]; then
    return 0
  else
    return 1
  fi
}

# Print current git state for debugging
print_git_state() {
  debug "Git State Information:"
  debug "  Current branch: $(git rev-parse --abbrev-ref HEAD)"
  debug "  HEAD SHA: $(git rev-parse HEAD)"
  debug "  Shallow clone: $([ -f .git/shallow ] && echo 'yes' || echo 'no')"
  if [ -f .git/shallow ]; then
    debug "  Shallow refs count: $(wc -l <.git/shallow || echo 'unknown')"
  fi
  debug "  Available refs: $(git rev-parse --all | wc -l)"
}

# Safely get commit log, handling shallow clone issues
# Returns commits on success, empty string on failure
get_commit_log() {
  local from_ref="$1"
  local to_ref="$2"

  if [ -n "$from_ref" ] && git rev-parse --verify "$from_ref" >/dev/null 2>&1; then
    if [ -n "$to_ref" ] && git rev-parse --verify "$to_ref" >/dev/null 2>&1; then
      if git merge-base --is-ancestor "$from_ref" "$to_ref" >/dev/null 2>&1; then
        debug "Getting commits: git log --pretty=format:%s $from_ref..$to_ref"
        git log --pretty=format:"%s" "$from_ref..$to_ref" 2>/dev/null || echo ""
      else
        debug "Base is not an ancestor of head"
        return 1
      fi
    fi
  fi
  return 1
}

# Get commits from ref, with error handling
# Tries object verification first, then attempts log
get_commits_safe() {
  local ref="$1"

  debug "Attempting to get commits from: $ref"

  # First, verify the ref exists as a valid git reference
  if ! git rev-parse --verify "$ref" >/dev/null 2>&1; then
    debug "  - ref-parse failed for $ref"
    return 1
  fi

  # Try to get the SHA
  local sha
  sha=$(git rev-parse "$ref" 2>/dev/null) || {
    debug "  - Could not resolve $ref to SHA"
    return 1
  }

  debug "  - Resolved $ref to SHA: $sha"

  # Check if the commit object actually exists in the object database
  if ! object_exists "$sha"; then
    debug "  - Object $sha not found in ODB (shallow clone issue?)"
    return 1
  fi

  debug "  - Object exists in ODB, attempting git log"

  # Try to get the commit message
  if ! git log --pretty=format:"%s" -1 "$sha" 2>/dev/null; then
    debug "  - git log failed for $sha"
    return 1
  fi

  return 0
}

# ============================================================================
# MAIN LOGIC
# ============================================================================

echo "🔍 Checking if commits will trigger semantic release between $BASE_REF and $HEAD_REF"

if [ "$DEBUG_MODE" = "1" ] || [ "$DEBUG_MODE" = "true" ]; then
  print_git_state
fi

# Prefer event SHAs for PRs to avoid shallow clone issues
if [ -n "${GITHUB_EVENT_PATH:-}" ] && command -v jq >/dev/null 2>&1; then
  PR_BASE_SHA=$(jq -r '.pull_request.base.sha // empty' "${GITHUB_EVENT_PATH}" 2>/dev/null || echo "")
  PR_HEAD_SHA=$(jq -r '.pull_request.head.sha // empty' "${GITHUB_EVENT_PATH}" 2>/dev/null || echo "")
  PR_BASE_REFNAME=$(jq -r '.pull_request.base.ref // empty' "${GITHUB_EVENT_PATH}" 2>/dev/null || echo "")

  if [ -n "$PR_BASE_SHA" ] && [ -n "$PR_HEAD_SHA" ]; then
    debug "Using SHAs from GitHub event payload"
    BASE_REF="$PR_BASE_SHA"
    HEAD_REF="$PR_HEAD_SHA"
  fi
fi

# Ensure base commit exists locally; attempt targeted fetch on shallow clones
if [ -n "$BASE_REF" ] && ! object_exists "$BASE_REF"; then
  warn "Base commit $BASE_REF not present locally; attempting fetch"
  if [ -n "${PR_BASE_REFNAME:-}" ]; then
    debug "Attempting to fetch PR base branch: $PR_BASE_REFNAME"
    git fetch --no-tags --depth=50 origin "$PR_BASE_REFNAME:$PR_BASE_REFNAME" >/dev/null 2>&1 || true
    if git rev-parse --verify "$PR_BASE_REFNAME" >/dev/null 2>&1; then
      BASE_REF="$PR_BASE_REFNAME"
      debug "Successfully fetched base branch, using: $BASE_REF"
    fi
  fi
  if ! object_exists "$BASE_REF"; then
    debug "Base commit still missing, attempting deeper fetch"
    git fetch --no-tags --deepen=1000 origin >/dev/null 2>&1 || true
  fi
fi

# Get commit messages between base and head; fallback to HEAD-only if needed
COMMITS=""

if [ -n "$BASE_REF" ] && git rev-parse --verify "$BASE_REF" >/dev/null 2>&1; then
  if git merge-base --is-ancestor "$BASE_REF" "$HEAD_REF" >/dev/null 2>&1; then
    debug "Base is ancestor of head, getting commits in range"
    COMMITS=$(git log --pretty=format:"%s" "$BASE_REF..$HEAD_REF" 2>/dev/null || echo "")
  else
    warn "Base $BASE_REF is not an ancestor of $HEAD_REF; analyzing HEAD only"

    # Try to get commits from HEAD_REF
    if COMMITS=$(get_commits_safe "$HEAD_REF" 2>/dev/null); then
      debug "Successfully retrieved commits from $HEAD_REF"
    else
      # Fallback to literal HEAD
      warn "Head ref $HEAD_REF not fully accessible; analyzing literal HEAD"
      if COMMITS=$(get_commits_safe "HEAD" 2>/dev/null); then
        debug "Successfully retrieved commits from literal HEAD"
      else
        error "Could not retrieve commits from $HEAD_REF or HEAD. This may indicate a shallow clone issue or corrupted repository state."
      fi
    fi
  fi
else
  # Base ref is missing or invalid, try HEAD_REF
  if COMMITS=$(get_commits_safe "$HEAD_REF" 2>/dev/null); then
    debug "Base ref invalid/missing, retrieved commits from $HEAD_REF"
  else
    # Fallback to literal HEAD
    warn "Head ref $HEAD_REF not fully accessible; analyzing literal HEAD"
    if COMMITS=$(get_commits_safe "HEAD" 2>/dev/null); then
      debug "Retrieved commits from literal HEAD"
    else
      error "Could not retrieve any commits. Repository may be in an inconsistent state."
    fi
  fi
fi

if [ -z "$COMMITS" ]; then
  echo "✅ No commits to analyze"
  exit 0
fi

# ============================================================================
# SEMANTIC RELEASE ANALYSIS
# ============================================================================

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
done <<<"$COMMITS"

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
