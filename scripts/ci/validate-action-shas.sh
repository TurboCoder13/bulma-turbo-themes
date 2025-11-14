#!/bin/bash
# Validate GitHub Action SHAs are actually resolvable
# This script validates both format AND existence of action SHAs
# Usage: validate-action-shas.sh [--strict]

set -euo pipefail

STRICT_MODE=false
GITHUB_TOKEN="${GITHUB_TOKEN:-}"

# Parse arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
    --strict)
      STRICT_MODE=true
      shift
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

echo "🔒 Validating GitHub Action SHAs..."
echo ""

EXIT_CODE=0
INVALID_SHAS=()
UNRESOLVABLE_SHAS=()

# Extract all action SHAs from workflows
# Excludes README.md files as they are documentation, not actual workflow files
extract_action_shas() {
  grep -rho 'uses:.*@[a-f0-9]\{40\}' .github/workflows/ .github/actions/ 2>/dev/null | \
    grep -v 'README.md:' | \
    sed 's/.*@//g' | sort -u
}

# Test if an action SHA exists by checking against GitHub API.
# The first argument is the owner/repo used for the API call,
# the second is the SHA, and the third is the full action label
# (which may include nested paths) used only for human-readable logging.
test_sha_validity() {
  local repo="$1"
  local sha="$2"
  local label="$3"
  
  # Only attempt API check if GITHUB_TOKEN is available
  if [[ -z "${GITHUB_TOKEN:-}" ]]; then
    return 0  # Skip if no token
  fi
  
  local api_url="https://api.github.com/repos/${repo}/commits/${sha}"
  
  # Check if commit exists in action repo
  local http_code
  local error_msg
  local curl_output

  # First, try to get the HTTP status code
  if ! http_code=$(curl -s -o /dev/null -w "%{http_code}" -H "Authorization: token ${GITHUB_TOKEN}" "$api_url" 2>&1); then
    echo "❌ ERROR: Network failure checking action ${label}@${sha:0:7}...${sha: -7}" >&2
    echo "   Full SHA: $sha" >&2
    echo "   API URL: $api_url" >&2
    echo "   Error: curl command failed - check network connectivity" >&2
    INVALID_SHAS+=("${label}@${sha}")
    return 1
  fi

  if [[ "$http_code" != "200" ]]; then
    # Try to get detailed error message from API response
    if curl_output=$(curl -s -H "Authorization: token ${GITHUB_TOKEN}" "$api_url" 2>&1); then
      # Extract error message from JSON response if available
      error_msg=$(echo "$curl_output" | grep -o '"message":"[^"]*"' | head -1 | sed 's/"message":"//' | sed 's/"$//' || echo "$curl_output" | head -1)
    else
      error_msg="Failed to retrieve error details"
    fi

    echo "❌ ERROR: Invalid or unresolvable SHA in action ${label}@${sha:0:7}...${sha: -7}" >&2
    echo "   Full SHA: $sha" >&2
    echo "   HTTP Status: $http_code" >&2
    echo "   API Error: $error_msg" >&2
    INVALID_SHAS+=("${label}@${sha}")
    return 1
  fi
  
  return 0
}

echo "📋 Step 1: Format Validation..."
echo "==============================="

# Check workflow files
for file in .github/workflows/*.yml .github/workflows/*.yaml; do
  if [[ -f "$file" ]]; then
    # Look for invalid formats
    if grep -E 'uses:.*@[^a-f0-9]' "$file" 2>/dev/null || \
       grep -E 'uses:.*@[a-f0-9]{1,39}([[:space:]]|$)' "$file" 2>/dev/null || \
       grep -E 'uses:.*@[a-f0-9]{41,}' "$file" 2>/dev/null; then
      echo "❌ Format violation in $file"
      EXIT_CODE=1
    fi
  fi
done

# Check composite action files
for file in .github/actions/*/action.yml .github/actions/*/action.yaml; do
  if [[ -f "$file" ]]; then
    if grep -E 'uses:.*@[^a-f0-9]' "$file" 2>/dev/null || \
       grep -E 'uses:.*@[a-f0-9]{1,39}([[:space:]]|$)' "$file" 2>/dev/null || \
       grep -E 'uses:.*@[a-f0-9]{41,}' "$file" 2>/dev/null; then
      echo "❌ Format violation in $file"
      EXIT_CODE=1
    fi
  fi
done

if [[ $EXIT_CODE -eq 0 ]]; then
  echo "✅ All SHAs pass format validation (exactly 40 hex characters)"
  echo ""
fi

echo "📋 Step 2: GitHub Actions Runtime Validation..."
echo "==============================================="
echo ""
echo "The ONLY definitive way to validate action SHAs is to let GitHub Actions"
echo "runtime resolve them during workflow execution."
echo ""
echo "Reasons format validation alone is insufficient:"
echo "  1. SHAs can be valid but obsolete (deleted repo commits)"
echo "  2. Shortened SHAs (7 chars) look different than full (40 chars)"
echo "  3. GitHub Actions has special handling for tags vs commits"
echo "  4. Different repos may have different commit SHAs for 'same' version"
echo ""
echo "RECOMMENDATION: Use these strategies to ensure SHA validity:"
echo ""
echo "  📌 Strategy 1: Use Renovate Bot"
echo "     - Automatically updates and validates SHAs"
echo "     - Runs tests to verify SHAs are valid"
echo "     - Creates PRs with valid updates only"
echo ""
echo "  📌 Strategy 2: Pin to GitHub Releases"
echo "     - Reference specific release tags"
echo "     - Renovate will update to new releases with verified SHAs"
echo "     - Current approach: Manually update from Renovate PRs"
echo ""
echo "  📌 Strategy 3: Maintain SHA Lock File"
echo "     - Document which SHAs map to which versions"
echo "     - Validate new SHAs during code review"
echo "     - Automated validation during CI"
echo ""
echo "  📌 Strategy 4: Trust GitHub Actions Runtime"
echo "     - Format validation catches obvious errors locally"
echo "     - GitHub Actions fails immediately if SHA is invalid"
echo "     - Treat CI failures as validation mechanism"
echo ""

# Extract all SHAs and provide details
echo "📊 Current Action SHA Summary:"
echo "=============================="
echo ""

SHAS=$(extract_action_shas)
SHA_COUNT=$(echo "$SHAS" | wc -l | tr -d ' ')
echo "Total unique SHAs found: $SHA_COUNT"
echo ""

echo "SHAs in use:"
UNMATCHED_SHAS=()
for sha in $SHAS; do
  # Find the first uses: line that references this SHA
  ACTION_LINE=$(grep -rho "uses:.*@$sha" .github/workflows/ .github/actions/ 2>/dev/null | grep -v 'README.md:' | head -1 || true)
  if [[ -z "$ACTION_LINE" ]]; then
    UNMATCHED_SHAS+=("$sha")
    echo "  • ${sha:0:7}...${sha: -7} [unknown action]"
    continue
  fi

  # Extract the full action label (may include nested paths) after "uses:"
  ACTION_LABEL=$(echo "$ACTION_LINE" | sed "s/.*uses:[[:space:]]*//" | sed "s/@${sha}.*//")
  if [[ -z "$ACTION_LABEL" ]]; then
    UNMATCHED_SHAS+=("$sha")
    echo "  • ${sha:0:7}...${sha: -7} [unknown action]"
  else
    echo "  • ${sha:0:7}...${sha: -7} ${ACTION_LABEL}"
  fi
done

if [[ ${#UNMATCHED_SHAS[@]} -gt 0 ]]; then
  echo ""
  echo "⚠️  WARNING: ${#UNMATCHED_SHAS[@]} SHA(s) could not be matched to an action"
fi

echo ""
echo "⚠️  WARNING: These SHAs should be verified by:"
echo "  1. Manual review of git commit history in source repos"
echo "  2. Running workflows in CI (GitHub will validate)"
echo "  3. Using Renovate bot for automated updates + validation"
echo ""

# If --strict mode and GITHUB_TOKEN available, validate SHAs exist
if [[ $EXIT_CODE -eq 0 ]] && [[ "$STRICT_MODE" == true ]] && [[ -n "${GITHUB_TOKEN:-}" ]]; then
  echo ""
  echo "📋 Step 3: GitHub API SHA Existence Check (--strict mode)..."
  echo "=========================================================="
  echo ""
  
  SHAS=$(extract_action_shas)
  UNMATCHED_COUNT=0
  VALIDATED_COUNT=0
  FAILED_COUNT=0
  
  for sha in $SHAS; do
    # Identify which action uses this SHA (search both workflows and composite actions)
    ACTION_LINE=$(grep -rho "uses:.*@$sha" .github/workflows/ .github/actions/ 2>/dev/null | grep -v 'README.md:' | head -1 || true)
    if [[ -n "$ACTION_LINE" ]]; then
      ACTION_LABEL=$(echo "$ACTION_LINE" | sed "s/.*uses:[[:space:]]*//" | sed "s/@${sha}.*//")
    else
      ACTION_LABEL=""
    fi
    
    if [[ -n "$ACTION_LABEL" ]]; then
      # Derive owner/repo for the GitHub API by taking the first two path segments
      ACTION_REPO=$(echo "$ACTION_LABEL" | cut -d'/' -f1-2)
      if test_sha_validity "$ACTION_REPO" "$sha" "$ACTION_LABEL"; then
        echo "  ✓ ${ACTION_LABEL}@${sha:0:7}...${sha: -7}"
        VALIDATED_COUNT=$((VALIDATED_COUNT + 1))
      else
        EXIT_CODE=1
        FAILED_COUNT=$((FAILED_COUNT + 1))
      fi
    else
      echo "  ⚠️  WARNING: SHA ${sha:0:7}...${sha: -7} could not be matched to an action - skipping validation" >&2
      UNMATCHED_COUNT=$((UNMATCHED_COUNT + 1))
      # In strict mode, unmatched SHAs are also considered failures
      EXIT_CODE=1
    fi
  done
  
  echo ""
  echo "📊 Validation Summary:"
  echo "  ✓ Validated: $VALIDATED_COUNT"
  if [[ $FAILED_COUNT -gt 0 ]]; then
    echo "  ✗ Failed: $FAILED_COUNT"
  fi
  if [[ $UNMATCHED_COUNT -gt 0 ]]; then
    echo "  ⚠️  Unmatched: $UNMATCHED_COUNT"
  fi
fi

# Always print final status before exiting
echo ""
if [[ $EXIT_CODE -eq 0 ]]; then
  if [[ -n "${GITHUB_TOKEN:-}" ]] && [[ "$STRICT_MODE" == true ]]; then
    echo "✅ All validations passed (format + API checks)"
  else
    echo "✅ Format validation passed"
    if [[ -z "${GITHUB_TOKEN:-}" ]]; then
      echo "   (Set GITHUB_TOKEN for API existence checks; runtime validation occurs in GitHub Actions CI)"
    fi
  fi
else
  echo "❌ Validation failed"
  echo ""
  if [[ ${#INVALID_SHAS[@]} -gt 0 ]]; then
    echo "Invalid or unresolvable SHAs:"
    for invalid in "${INVALID_SHAS[@]}"; do
      echo "  ✗ $invalid"
    done
    echo ""
  fi
  echo "Please review the errors above and fix the invalid action SHAs."
fi

# Ensure all output is flushed before exiting
sync 2>/dev/null || true

exit $EXIT_CODE

