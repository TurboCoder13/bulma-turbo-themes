#!/usr/bin/env bash
set -euo pipefail

# guard-release-commit.sh
# Set is_release=true in GITHUB_OUTPUT if last commit subject starts with 'chore(release):'
# This prevents the version PR workflow from running after merging a version PR

if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
  cat <<'EOF'
Guard that last commit message is a release bump.

Usage:
  scripts/ci/guard-release-commit.sh

Writes is_release=true|false to $GITHUB_OUTPUT.
Always exits 0 (use output variable for conditional logic).
EOF
  exit 0
fi

msg=$(git log -1 --pretty=%s)
echo "Last commit: $msg"

is_release=false
if echo "$msg" | grep -Eq '^chore\(release\):'; then
  is_release=true
  echo "✅ This is a release commit - version PR workflow will be skipped"
else
  echo "📝 Not a release commit - version PR workflow will proceed"
fi

if [[ -n "${GITHUB_OUTPUT:-}" ]]; then
  echo "is_release=$is_release" >> "$GITHUB_OUTPUT"
else
  echo "is_release=$is_release"
fi

# Always exit 0 - use output variable for conditional logic in workflow
exit 0

