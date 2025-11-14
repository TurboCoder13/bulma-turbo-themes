#!/bin/bash
# Validate all actions are pinned to SHA
# Usage: validate-action-pinning.sh [--strict]
#
# This script validates:
# 1. All actions use SHA-pinned versions (not tags or branches)
# 2. All SHAs are exactly 40 hex characters (format validation)
#
# With --strict: Format validation failures cause exit code 1
#
# NOTE: SHA validity can only be verified by GitHub Actions runtime
# (which tests them during workflow execution). This script validates
# format only; deeper validation is handled by validate-action-shas.sh.

set -euo pipefail

STRICT_MODE=false

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

echo "🔒 Validating GitHub Action pinning compliance..."
echo ""

if [[ "$STRICT_MODE" == true ]]; then
  echo "🔴 Strict mode enabled: validation failures will cause exit code 1"
  echo ""
fi

EXIT_CODE=0

# Check workflow files
check_files() {
  local file_pattern="$1"
  
  for file in $file_pattern; do
    if [[ -f "$file" ]]; then
      # Look for uses: not followed by @<40-char-sha> (ignore inline comments)
      # Three checks:
      # 1. Non-hex characters after @ (e.g., @v1, @main)
      # 2. Too few hex chars (< 40)
      # 3. Too many hex chars (> 40) - catches duplicated SHAs
      if grep -E 'uses:.*@[^a-f0-9]' "$file" 2>/dev/null || \
         grep -E 'uses:.*@[a-f0-9]{1,39}([[:space:]]|$)' "$file" 2>/dev/null || \
         grep -E 'uses:.*@[a-f0-9]{41,}' "$file" 2>/dev/null; then
        if [[ "$STRICT_MODE" == true ]]; then
          echo "❌ ERROR: Non-SHA pinned action found in $file"
          EXIT_CODE=1
        else
          echo "⚠️  WARNING: Non-SHA pinned action found in $file"
        fi
      fi
    fi
  done
}

echo "📋 Checking workflow files..."
check_files ".github/workflows/*.yml .github/workflows/*.yaml"

echo "📋 Checking composite action files..."
check_files ".github/actions/*/action.yml .github/actions/*/action.yaml"

if [[ $EXIT_CODE -eq 0 ]]; then
  echo "✅ All actions are properly pinned to 40-character SHAs"
  echo ""
  echo "📝 Validation Details:"
  echo "  ✓ No tag-based pins (e.g., @v1, @latest)"
  echo "  ✓ No branch-based pins (e.g., @main)"
  echo "  ✓ No incomplete SHAs (< 40 chars)"
  echo "  ✓ No duplicated/malformed SHAs (> 40 chars)"
  echo ""
  echo "⚠️  NOTE: This validates SHA format only."
  echo "  GitHub Actions runtime validates SHA existence in action repos."
else
  echo ""
  echo "❌ Action pinning validation failed!"
  echo ""
  echo "Common issues:"
  echo "  • Using version tags instead of SHAs (e.g., @v5.0.0)"
  echo "  • Using branch names instead of SHAs (e.g., @main)"
  echo "  • SHAs with incorrect length"
  echo "  • Duplicate/concatenated SHAs"
fi

exit $EXIT_CODE
