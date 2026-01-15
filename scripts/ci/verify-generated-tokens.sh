#!/usr/bin/env bash
# SPDX-License-Identifier: MIT
# Purpose: Verify generated tokens (CSS, Python, Swift) are committed
#
# Usage: ./verify-generated-tokens.sh
#
# This script checks that auto-generated token files have no uncommitted changes.
# Used in CI to ensure developers commit generated files after running build:tokens.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/../utils/utils.sh"

# Token paths to check (generated files from Style Dictionary)
TOKEN_PATHS=(
    # Style Dictionary outputs
    'assets/css/turbo-core.css'
    'assets/scss/_tokens.scss'
    'packages/core/src/themes/generated/tokens.js'
    'python/src/turbo_themes/generated/tokens.py'
    'swift/Sources/TurboThemes/Generated/Tokens.swift'
    # Copied tokens.json files
    'packages/core/src/themes/tokens.json'
    'python/src/turbo_themes/tokens.json'
    'swift/Sources/TurboThemes/Resources/tokens.json'
    # Theme registry files (still manually maintained)
    'python/src/turbo_themes/themes.py'
    'swift/Sources/TurboThemes/ThemeLoader.swift'
)

main() {
    log_info "Verifying generated tokens are committed..."

    # Show current git status
    git status --porcelain

    # Check only token-related paths
    local has_changes=false
    for path in "${TOKEN_PATHS[@]}"; do
        if ! git diff --quiet --exit-code -- "$path" 2>/dev/null; then
            has_changes=true
            break
        fi
    done

    if [[ "$has_changes" == "false" ]]; then
        log_success "All generated tokens are committed"
        exit 0
    else
        log_error "Generated tokens have uncommitted changes"
        echo ""
        log_info "Changed files:"
        for path in "${TOKEN_PATHS[@]}"; do
            git diff -- "$path" 2>/dev/null || true
        done
        echo ""
        log_error "Please run 'bun run build:tokens' and commit the changes"
        exit 1
    fi
}

main "$@"
