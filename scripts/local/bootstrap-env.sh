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
    echo "  - Check for required tools (node, npm, ruby, bundle)"
    echo "  - Install Node.js dependencies"
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

# Check for required tools
MISSING_TOOLS=()

if ! command_exists node; then
    MISSING_TOOLS+=("node")
    log_error "  ✗ node not found"
else
    NODE_VERSION=$(node --version)
    log_success "  ✓ node $NODE_VERSION"
fi

if ! command_exists npm; then
    MISSING_TOOLS+=("npm")
    log_error "  ✗ npm not found"
else
    NPM_VERSION=$(npm --version)
    log_success "  ✓ npm $NPM_VERSION"
fi

if ! command_exists ruby; then
    MISSING_TOOLS+=("ruby")
    log_warn "  ⚠ ruby not found (optional for Jekyll demo site)"
else
    RUBY_VERSION=$(ruby --version | cut -d' ' -f2)
    log_success "  ✓ ruby $RUBY_VERSION"
fi

if ! command_exists bundle; then
    MISSING_TOOLS+=("bundle")
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
log_info "📦 Installing Node.js dependencies..."

if [ -f "package-lock.json" ]; then
    npm ci
else
    npm install
fi

log_success "✅ Node.js dependencies installed"

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
        npm run prepare >/dev/null 2>&1 || true
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
echo "  1. Build the project:  ./scripts/local/local-build.sh"
echo "  2. Run tests:          ./scripts/local/run-tests.sh"
echo "  3. Start development:  ./scripts/local/serve.sh"
echo ""
log_info "📚 For more information, see CONTRIBUTING.md"
