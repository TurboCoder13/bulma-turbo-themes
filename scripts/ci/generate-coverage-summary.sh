#!/usr/bin/env bash
# Generate coverage summary for PR comment
# Usage: generate-coverage-summary.sh

set -euo pipefail

COVERAGE_SUMMARY=$(cat coverage/coverage-summary.json | jq -r '.total | "**Coverage Report**\n\n| Metric | Coverage | \n|--------|----------|\n| Lines | \(.lines.pct)% |\n| Statements | \(.statements.pct)% |\n| Functions | \(.functions.pct)% |\n| Branches | \(.branches.pct)% |"')
echo "$COVERAGE_SUMMARY" > coverage-comment.md
echo "" >> coverage-comment.md

# Append Codecov link for PRs when context is available
REPO="${GITHUB_REPOSITORY:-}"
PR_NUMBER=""
if [ -n "${GITHUB_EVENT_PATH:-}" ] && command -v jq >/dev/null 2>&1; then
  PR_NUMBER=$(jq -r '.pull_request.number // empty' "${GITHUB_EVENT_PATH}" 2>/dev/null || echo "")
fi

if [ -n "$REPO" ] && [ -n "$PR_NUMBER" ]; then
  echo "📊 [View full coverage report on Codecov](https://codecov.io/gh/${REPO}/pull/${PR_NUMBER})" >> coverage-comment.md
fi
