#!/bin/bash
# Generate coverage summary for PR comment
# Usage: generate-coverage-summary.sh

set -euo pipefail

COVERAGE_SUMMARY=$(cat coverage/coverage-summary.json | jq -r '.total | "**Coverage Report**\n\n| Metric | Coverage | \n|--------|----------|\n| Lines | \(.lines.pct)% |\n| Statements | \(.statements.pct)% |\n| Functions | \(.functions.pct)% |\n| Branches | \(.branches.pct)% |"')
echo "$COVERAGE_SUMMARY" > coverage-comment.md
echo "" >> coverage-comment.md
echo "📊 [View full coverage report on Codecov](https://codecov.io/gh/${{ github.repository }}/pull/${{ github.event.pull_request.number }})" >> coverage-comment.md
