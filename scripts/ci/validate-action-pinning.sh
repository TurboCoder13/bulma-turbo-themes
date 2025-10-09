#!/bin/bash
# Validate all actions are pinned to SHA
# Usage: validate-action-pinning.sh

set -euo pipefail

echo "Checking for non-SHA pinned actions..."
EXIT_CODE=0

# Check workflow files
for file in .github/workflows/*.yml .github/workflows/*.yaml; do
  if [[ -f "$file" ]]; then
    # Look for uses: not followed by @<40-char-sha>
    if grep -E 'uses:.*@(?![a-f0-9]{40}($| ))' "$file"; then
      echo "❌ ERROR: Non-SHA action in $file"
      EXIT_CODE=1
    fi
  fi
done

# Check composite action files
for file in .github/actions/*/action.yml \
             .github/actions/*/action.yaml; do
  if [[ -f "$file" ]]; then
    if grep -E 'uses:.*@(?![a-f0-9]{40}($| ))' "$file"; then
      echo "❌ ERROR: Non-SHA action in $file"
      EXIT_CODE=1
    fi
  fi
done

if [[ $EXIT_CODE -eq 0 ]]; then
  echo "✅ All actions are properly pinned to SHA"
fi

exit $EXIT_CODE
