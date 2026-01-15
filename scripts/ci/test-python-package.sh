#!/usr/bin/env bash
# SPDX-License-Identifier: MIT
# Purpose: Test Python package imports and basic functionality
#
# Usage: ./test-python-package.sh [--working-dir DIR]
#
# Options:
#   --working-dir DIR    Directory containing Python package (default: python)
#
# This script runs basic import and functionality tests for the Python package.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/../utils/utils.sh"

WORKING_DIR="python"

parse_args() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            --working-dir)
                WORKING_DIR="$2"
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

    log_info "Testing Python package..."

    # Validate working directory
    if [[ ! -d "$WORKING_DIR" ]]; then
        log_error "Working directory not found: $WORKING_DIR"
        exit 1
    fi

    cd "$WORKING_DIR"

    # Run Python tests
    python3 -c "
import sys
sys.path.insert(0, 'src')

# Run tests manually since pytest may not be available
try:
    from turbo_themes.manager import ThemeManager
    manager = ThemeManager()
    print('✅ ThemeManager creation')

    manager.set_theme('github-light')
    print('✅ Theme switching')

    variables = manager.apply_theme_to_css_variables()
    print(f'✅ CSS variables generation ({len(variables)} vars)')

    json_data = manager.export_theme_json('catppuccin-latte')
    print('✅ JSON export')

    print('✅ All Python tests passed!')

except Exception as e:
    print(f'❌ Python test failed: {e}')
    import traceback
    traceback.print_exc()
    sys.exit(1)
"

    log_success "Python package tests passed"
}

main "$@"
