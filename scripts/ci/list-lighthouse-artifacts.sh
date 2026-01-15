#!/usr/bin/env bash
# SPDX-License-Identifier: MIT
# Purpose: List lighthouse artifacts for debugging CI issues
#
# Usage: ./list-lighthouse-artifacts.sh [--dir DIR]
#
# Options:
#   --dir DIR    Directory to check (default: current directory)
#
# This script lists the contents of directories relevant to lighthouse reports.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/../utils/utils.sh"

CHECK_DIR="."

parse_args() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            --dir)
                CHECK_DIR="$2"
                shift 2
                ;;
            *)
                log_error "Unknown option: $1"
                exit 2
                ;;
        esac
    done
}

main() {
    parse_args "$@"

    log_info "Listing artifacts for debugging..."

    echo ""
    echo "Contents of ${CHECK_DIR}:"
    ./scripts/ci/list-directory-contents.sh "$CHECK_DIR"

    echo ""
    echo "Checking for lighthouse-reports directory:"
    if [[ -d "lighthouse-reports" ]]; then
        log_success "lighthouse-reports directory exists"
        find lighthouse-reports -type f
    else
        log_warn "lighthouse-reports directory not found"
    fi

    echo ""
    log_info "Artifact listing complete"
}

main "$@"
