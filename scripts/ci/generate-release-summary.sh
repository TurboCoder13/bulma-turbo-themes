#!/usr/bin/env bash
# SPDX-License-Identifier: MIT
# Purpose: Generate GitHub release summary for GITHUB_STEP_SUMMARY
#
# Usage: ./generate-release-summary.sh [version]
#
# Arguments:
#   version    Release version (default: from GITHUB_REF_NAME env var)
#
# Environment:
#   GITHUB_REF_NAME    Git ref name (used if version not provided)
#   GITHUB_STEP_SUMMARY    GitHub Actions step summary file
#
# This script generates a summary of the release for the GitHub Actions UI.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/../utils/utils.sh"

main() {
    local version="${1:-${GITHUB_REF_NAME:-unknown}}"

    log_info "Generating release summary for $version..."

    # Check if we're in GitHub Actions
    if [[ -z "${GITHUB_STEP_SUMMARY:-}" ]]; then
        log_warn "GITHUB_STEP_SUMMARY not set, outputting to stdout"
        echo "## GitHub Release Summary"
        echo "✅ Release $version published and released"
        return 0
    fi

    # Write to GitHub step summary
    {
        echo "## GitHub Release Summary"
        echo "✅ Release $version published and released"
    } >> "$GITHUB_STEP_SUMMARY"

    log_success "Release summary generated"
}

main "$@"
