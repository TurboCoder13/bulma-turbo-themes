#!/usr/bin/env bash
# SPDX-License-Identifier: MIT
# Purpose: Bootstrap development environment
#
# Usage: bootstrap-env.sh [OPTIONS]
#
# Options:
#   --skip-git-hooks  Skip git hooks setup
#   --help, -h        Show this help message

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
    echo "Bootstrap development environment"
    echo ""
    echo "This script will:"
    echo "  - Check for required tools (bun, node, ruby, bundle)"
    echo "  - Install dependencies with Bun (npm fallback if Bun not available)"
    echo "  - Install Ruby dependencies"
    echo "  - Set up git hooks (husky)"
    echo ""
    echo "Options:"
    echo "  --skip-git-hooks  Skip git hooks setup"
    echo "  --help, -h        Show this help message"
    echo ""
    exit 0
fi

# Parse options
SKIP_GIT_HOOKS=false

for arg in "$@"; do
    case "$arg" in
        --skip-git-hooks)
            SKIP_GIT_HOOKS=true
            ;;
        *)
            log_error "Unknown option: $arg"
            exit 1
            ;;
    esac
done

log_info "🚀 Bootstrapping development environment..."

# Change to project root
cd "$(git rev-parse --show-toplevel 2>/dev/null || echo ".")"

echo ""
log_info "✓ Checking required tools..."

# Check for required tools and detect package manager
MISSING_TOOLS=()

# Detect package manager (prefer bun, fall back to npm)
if command_exists bun; then
    PKG_MGR="bun"
    PKG_RUN="bun run"
    BUN_VERSION=$(bun --version)
    log_success "  ✓ bun $BUN_VERSION (primary package manager)"
elif command_exists npm; then
    PKG_MGR="npm"
    PKG_RUN="npm run"
    NPM_VERSION=$(npm --version)
    log_success "  ✓ npm $NPM_VERSION"
    log_warn "  ⚠ bun not found (install for faster builds: https://bun.sh)"
else
    MISSING_TOOLS+=("bun or npm")
    log_error "  ✗ No package manager found"
fi

if ! command_exists node; then
    if [ "$PKG_MGR" != "bun" ]; then
        MISSING_TOOLS+=("node")
        log_error "  ✗ node not found"
    else
        log_warn "  ⚠ node not found (optional, bun provides Node.js compatibility)"
    fi
else
    NODE_VERSION=$(node --version)
    log_success "  ✓ node $NODE_VERSION"
fi

if ! command_exists ruby; then
    log_warn "  ⚠ ruby not found (optional for Jekyll demo site)"
else
    RUBY_VERSION=$(ruby --version | cut -d' ' -f2)
    log_success "  ✓ ruby $RUBY_VERSION"
fi

if ! command_exists bundle; then
    log_warn "  ⚠ bundle not found (optional for Jekyll demo site)"
else
    BUNDLE_VERSION=$(bundle --version | cut -d' ' -f3)
    log_success "  ✓ bundle $BUNDLE_VERSION"
fi

if [ ${#MISSING_TOOLS[@]} -gt 0 ]; then
    echo ""
    log_error "Missing required tools: ${MISSING_TOOLS[*]}"
    log_error "Please install the missing tools and try again"
    exit 1
fi

echo ""
log_info "📦 Installing dependencies with $PKG_MGR..."

if [ "$PKG_MGR" = "bun" ]; then
    if [ -f "bun.lock" ]; then
        bun install --frozen-lockfile
    else
        bun install
    fi
else
    if [ -f "package-lock.json" ]; then
        npm ci
    else
        npm install
    fi
fi

log_success "✅ Dependencies installed with $PKG_MGR"

# Install Ruby dependencies if Gemfile exists
if [ -f "Gemfile" ] && command_exists bundle; then
    echo ""
    log_info "💎 Installing Ruby dependencies..."
    bundle install
    log_success "✅ Ruby dependencies installed"
fi

# Set up git hooks unless skipped
if [ "$SKIP_GIT_HOOKS" = false ] && [ -d ".git" ]; then
    echo ""
    log_info "🪝 Setting up git hooks..."
    
    if grep -q '"prepare"' package.json 2>/dev/null; then
        $PKG_RUN prepare >/dev/null 2>&1 || true
        log_success "✅ Git hooks configured"
    else
        log_warn "⚠️  No prepare script found; skipping git hooks setup"
    fi
fi

# Display setup summary
echo ""
log_success "🎉 Development environment is ready!"
echo ""
log_info "📋 Next steps:"
echo "  1. Build the project:  ./scripts/local/build.sh"
echo "  2. Run tests:          ./scripts/local/run-tests.sh"
echo "  3. Start development:  ./scripts/local/serve.sh"
echo ""
log_info "📚 For more information, see CONTRIBUTING.md"
