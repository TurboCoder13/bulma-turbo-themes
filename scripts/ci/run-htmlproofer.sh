#!/usr/bin/env bash
# SPDX-License-Identifier: MIT
# Purpose: Run htmlproofer link validation on built site
#
# Usage: ./run-htmlproofer.sh [--site-dir DIR] [--output FILE]
#
# Options:
#   --site-dir DIR    Directory containing built site (default: apps/site/dist)
#   --output FILE     Output file for results (default: link-check-output.txt)
#
# This script runs htmlproofer to validate external links in the built site.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/../utils/utils.sh"

SITE_DIR="apps/site/dist"
OUTPUT_FILE="link-check-output.txt"

parse_args() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            --site-dir)
                SITE_DIR="$2"
                shift 2
                ;;
            --output)
                OUTPUT_FILE="$2"
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

    log_info "Running htmlproofer link validation..."

    # Validate site directory
    if [[ ! -d "$SITE_DIR" ]]; then
        log_error "Site directory not found: $SITE_DIR"
        exit 1
    fi

    # Run htmlproofer with appropriate options
    # Note: Uses 'true' at end to capture output regardless of exit code
    bundle exec htmlproofer \
        --assume-extension \
        --allow-hash-href \
        --allow-missing-href \
        --no-enforce-https \
        --typhoeus '{"timeout": 30, "max_redirects": 5, "retry": {"max_retries": 2}}' \
        --report-missing-doctype false \
        --report-sce false \
        "$SITE_DIR" 2>&1 | tee "$OUTPUT_FILE" || true

    log_info "Results written to: $OUTPUT_FILE"

    # Check if there were actual failures
    if grep -q "HTML-Proofer found" "$OUTPUT_FILE"; then
        log_warn "htmlproofer found issues (see $OUTPUT_FILE)"
    else
        log_success "htmlproofer completed with no issues"
    fi
}

main "$@"
