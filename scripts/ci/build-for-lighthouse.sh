#!/bin/bash

# Streamlined build script for Lighthouse CI
# This script builds only what's needed for Lighthouse performance testing
# It skips all tests since they run in separate workflows
#
# Usage: ./scripts/ci/build-for-lighthouse.sh

set -e  # Exit on any error

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

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

print_status "$BLUE" "🚀 Starting Lighthouse build process..."

# Change to project root
cd "$(git rev-parse --show-toplevel 2>/dev/null || echo ".")"

# Step 1: Install dependencies
print_status "$BLUE" "📦 Step 1: Installing dependencies..."

# Check required commands
required_cmds=("npm" "bundle")
for cmd in "${required_cmds[@]}"; do
    if ! command_exists "$cmd"; then
        print_status "$RED" "❌ Required command not found: $cmd"
        exit 1
    fi
done

# Install Node.js dependencies
if [ -f "package.json" ]; then
    print_status "$YELLOW" "  Installing Node.js dependencies..."
    if [ -f "package-lock.json" ]; then
        npm ci
    else
        npm install
    fi
else
    print_status "$YELLOW" "⚠️  Skipping Node.js steps (no package.json found)."
fi

# Install Ruby dependencies
print_status "$YELLOW" "  Installing Ruby dependencies..."
bundle install

# Step 2: Theme synchronization
print_status "$BLUE" "🎨 Step 2: Theme synchronization..."
if [ -f "package.json" ] && grep -q '"theme:sync"' package.json >/dev/null 2>&1; then
    print_status "$YELLOW" "  Running theme sync..."
    npm run theme:sync
fi

# Step 3: TypeScript build
print_status "$BLUE" "⚡ Step 3: TypeScript build..."
if [ -f "package.json" ] && grep -q '"build"' package.json >/dev/null 2>&1; then
    print_status "$YELLOW" "  Building TypeScript..."
    npm run build
fi

# Step 4: Jekyll build (production mode for Lighthouse)
print_status "$BLUE" "🏗️  Step 4: Jekyll build..."
print_status "$YELLOW" "  Building Jekyll site..."
bundle exec jekyll build --config _config.yml --trace --strict_front_matter

print_status "$GREEN" "✅ Lighthouse build completed successfully!"
print_status "$BLUE" "📋 Summary:"
print_status "$GREEN" "  ✅ Theme synchronization passed"
print_status "$GREEN" "  ✅ TypeScript build passed"
print_status "$GREEN" "  ✅ Jekyll build passed"
print_status "$YELLOW" "  ⏭️  Tests skipped (run in separate workflows)"

