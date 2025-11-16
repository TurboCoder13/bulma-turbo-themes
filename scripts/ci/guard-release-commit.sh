#!/usr/bin/env bash
set -euo pipefail

# guard-release-commit.sh
# Set ok=true in GITHUB_OUTPUT if last commit subject starts with 'chore(release):'
# This prevents the version PR workflow from running after merging a version PR

if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
  cat <<'EOF'
Guard that last commit message is a release bump.

Usage:
  scripts/ci/guard-release-commit.sh

Writes ok=true|false to $GITHUB_OUTPUT.
Returns exit code 0 if it's a release commit, 1 otherwise.
EOF
  exit 0
fi

msg=$(git log -1 --pretty=%s)
echo "Last commit: $msg"

ok=false
if echo "$msg" | grep -Eq '^chore\(release\):'; then
  ok=true
  echo "✅ This is a release commit - version PR workflow will be skipped"
else
  echo "📝 Not a release commit - version PR workflow will proceed"
fi

if [[ -n "${GITHUB_OUTPUT:-}" ]]; then
  echo "ok=$ok" >> "$GITHUB_OUTPUT"
else
  echo "ok=$ok"
fi

# Exit with appropriate code for conditional steps
if [[ "$ok" == "true" ]]; then
  exit 0
else
  exit 1
fi

