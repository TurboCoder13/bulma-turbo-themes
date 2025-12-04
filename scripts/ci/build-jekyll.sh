#!/usr/bin/env bash
# Minimal CI build script for Jekyll site
# This script only performs essential build steps needed for CI workflows:
# - Theme synchronization (if needed for TypeScript)
# - Jekyll build with production config
#
# Usage: ./scripts/ci/build-jekyll.sh
#
# This script is designed for CI workflows that handle:
# - Dependency installation separately (via setup-env action)
# - TypeScript build separately (already done before calling this)
# - Quality checks separately (linting, tests, HTMLProofer, etc.)
# - Deployment separately

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    local color="$1"
    local message="$2"
    echo -e "${color}${message}${NC}"
}

# Change to project root
cd "$(git rev-parse --show-toplevel 2>/dev/null || echo ".")"

print_status "$BLUE" "🏗️  Starting CI Jekyll build..."

# Detect package manager (prefer bun, fall back to npm)
if command -v bun >/dev/null 2>&1; then
    PKG_RUN="bun run"
elif command -v npm >/dev/null 2>&1; then
    PKG_RUN="npm run"
else
    print_status "$RED" "❌ No package manager found!"
    exit 1
fi

# Step 1: Theme synchronization (if needed)
print_status "$BLUE" "🎨 Step 1: Theme synchronization..."
if [ -f "package.json" ] && grep -q '"theme:sync"' package.json >/dev/null 2>&1; then
    print_status "$YELLOW" "  Running theme sync..."
    $PKG_RUN theme:sync
    print_status "$GREEN" "  ✅ Theme sync completed"
else
    print_status "$YELLOW" "  ⏭️  Skipping theme sync (not configured)"
fi

# Step 2: Jekyll build with production config
print_status "$BLUE" "🏗️  Step 2: Jekyll build..."
print_status "$YELLOW" "  Building Jekyll site with production config..."
JEKYLL_CONFIG="_config.yml,_config.prod.yml"
bundle exec jekyll build --config "$JEKYLL_CONFIG" --trace --strict_front_matter

print_status "$GREEN" "✅ CI Jekyll build completed successfully!"
print_status "$BLUE" "📋 Summary:"
print_status "$GREEN" "  ✅ Theme synchronization completed"
print_status "$GREEN" "  ✅ Jekyll build completed"

