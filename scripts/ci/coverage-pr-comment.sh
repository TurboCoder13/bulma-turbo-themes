#!/usr/bin/env bash
# SPDX-License-Identifier: MIT
# Purpose: Generate and post coverage report comments to PRs
#
# Usage: coverage-pr-comment.sh
#
# This script generates a formatted coverage report comment from
# coverage-summary.json and posts it to the PR.

set -e

# Show help if requested
if [ "${1:-}" = "--help" ] || [ "${1:-}" = "-h" ]; then
    echo "Usage: $0 [--help|-h]"
    echo ""
    echo "Coverage PR Comment Script"
    echo "Generates a PR comment with coverage info from coverage-summary.json"
    echo ""
    echo "This script is intended for CI and will no-op outside pull_request events."
    echo ""
    echo "Environment Variables:"
    echo "  GITHUB_TOKEN       GitHub token for authentication"
    echo "  PR_NUMBER          Pull request number"
    echo "  GITHUB_REPOSITORY  Repository in format owner/repo"
    echo "  GITHUB_RUN_ID      GitHub Actions run ID"
    echo "  GITHUB_SHA         Commit SHA"
    echo ""
    exit 0
fi

# Source shared utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -f "$SCRIPT_DIR/../utils/utils.sh" ]; then
    source "$SCRIPT_DIR/../utils/utils.sh"
fi

# Check if we're in a PR context
if [ -z "${PR_NUMBER:-}" ] || [ "${GITHUB_EVENT_NAME:-}" != "pull_request" ]; then
    log_info "Not in a PR context, skipping coverage comment generation"
    exit 0
fi

# Check if coverage-summary.json exists
if [ ! -f "coverage/coverage-summary.json" ]; then
    log_error "coverage/coverage-summary.json not found"
    exit 1
fi

log_info "Generating coverage PR comment from coverage-summary.json"

# Generate coverage summary using jq
COVERAGE_SUMMARY=$(cat coverage/coverage-summary.json | jq -r '.total | "**Coverage Report**\n\n| Metric | Coverage | \n|--------|----------|\n| Lines | \(.lines.pct)% |\n| Statements | \(.statements.pct)% |\n| Functions | \(.functions.pct)% |\n| Branches | \(.branches.pct)% |"')

# Get overall coverage percentage for badge/status
COVERAGE_PCT=$(cat coverage/coverage-summary.json | jq -r '.total.lines.pct')

# Determine status
if (( $(echo "$COVERAGE_PCT >= 80" | bc -l 2>/dev/null || echo 0) )); then
    STATUS_EMOJI="✅"
    STATUS_TEXT="Target met (≥80%)"
else
    STATUS_EMOJI="⚠️"
    STATUS_TEXT="Below target (<80%)"
fi

# Create the comment file with marker
cat > coverage-comment.md << EOF
<!-- coverage-report -->

## 📊 Code Coverage Report

$COVERAGE_SUMMARY

**Overall Status:** $STATUS_EMOJI $STATUS_TEXT

### 📁 View Detailed Report

- 📊 [View full coverage report on Codecov](https://codecov.io/gh/${GITHUB_REPOSITORY}/pull/${PR_NUMBER})
- 📦 [Download coverage artifacts](https://github.com/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID})

---
*Coverage generated from commit [\`${GITHUB_SHA:0:7}\`](https://github.com/${GITHUB_REPOSITORY}/commit/${GITHUB_SHA})*
EOF

log_success "Coverage comment generated successfully"

# Post the comment using post-pr-comment.sh if available
if [ -f "$SCRIPT_DIR/post-pr-comment.sh" ]; then
    log_info "Posting coverage comment to PR #$PR_NUMBER"
    "$SCRIPT_DIR/post-pr-comment.sh" coverage-comment.md "coverage-report"
else
    log_warn "post-pr-comment.sh not found; comment file saved as coverage-comment.md"
fi
