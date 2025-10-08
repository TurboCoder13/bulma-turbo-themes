#!/usr/bin/env bash
# SPDX-License-Identifier: MIT
# Purpose: Build project for local development
#
# Usage: local-build.sh [OPTIONS]
#
# Options:
#   --with-tests    Run tests after build
#   --skip-checks   Skip linting and formatting checks
#   --help, -h      Show this help message

set -e

# Source shared utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -f "$SCRIPT_DIR/../utils/utils.sh" ]; then
    source "$SCRIPT_DIR/../utils/utils.sh"
fi

# Show help if requested
if [ "${1:-}" = "--help" ] || [ "${1:-}" = "-h" ]; then
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Build project for local development"
    echo ""
    echo "Options:"
    echo "  --with-tests    Run tests after build"
    echo "  --skip-checks   Skip linting and formatting checks"
    echo "  --help, -h      Show this help message"
    echo ""
    exit 0
fi

# Parse options
RUN_TESTS=false
SKIP_CHECKS=false

for arg in "$@"; do
    case "$arg" in
        --with-tests)
            RUN_TESTS=true
            ;;
        --skip-checks)
            SKIP_CHECKS=true
            ;;
        *)
            log_error "Unknown option: $arg"
            exit 1
            ;;
    esac
done

log_info "🔨 Building project..."

# Change to project root
cd "$(git rev-parse --show-toplevel 2>/dev/null || echo ".")"

# Check if npm is available
require_command npm

# Run linting and formatting checks unless skipped
if [ "$SKIP_CHECKS" = false ]; then
    log_info "🔍 Running linting checks..."
    
    if npm run lint >/dev/null 2>&1; then
        log_success "✅ Linting passed"
    else
        log_warn "⚠️  Linting issues found"
    fi
    
    log_info "🎨 Checking code formatting..."
    
    if npm run format >/dev/null 2>&1; then
        log_success "✅ Formatting check passed"
    else
        log_warn "⚠️  Formatting issues found (run: npm run format:write)"
    fi
    
    echo ""
fi

# Build TypeScript
log_info "⚡ Building TypeScript..."
npm run build

log_success "✅ Build completed!"

# Display build artifacts
if [ -d "dist" ]; then
    echo ""
    log_info "📦 Build artifacts:"
    ls -lh dist/ | tail -n +2 | awk '{print "  " $9 " (" $5 ")"}'
fi

# Run tests if requested
if [ "$RUN_TESTS" = true ]; then
    echo ""
    log_info "🧪 Running tests..."
    npm test
    log_success "✅ Tests passed!"
fi

echo ""
log_success "🎉 Build process completed successfully!"
