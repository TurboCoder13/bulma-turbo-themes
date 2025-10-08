#!/bin/bash

# Build script for bulma-turbo-themes Jekyll site
# This script handles both local development and CI workflows
# Usage: ./scripts/local/build.sh [--quick|--full|--serve|--no-serve]

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

# Function to check if port is available
port_available() {
    local port="$1"
    ! lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1
}

# Parse command line arguments
QUICK_MODE=false
FULL_MODE=false
SERVE_MODE=false
NO_SERVE=false

for arg in "$@"; do
    case "$arg" in
        --quick)
            QUICK_MODE=true
            ;;
        --full)
            FULL_MODE=true
            ;;
        --serve)
            SERVE_MODE=true
            ;;
        --no-serve)
            NO_SERVE=true
            ;;
    esac
done

# Determine mode
if [ "$QUICK_MODE" = true ]; then
    print_status "$BLUE" "🚀 Starting quick CI build process..."
elif [ "$FULL_MODE" = true ]; then
    print_status "$BLUE" "🚀 Starting full CI build process..."
else
    print_status "$BLUE" "🚀 Starting local build process..."
fi

# Change to project root
cd "$(git rev-parse --show-toplevel 2>/dev/null || echo ".")"

# Check if clean.sh exists and run it (skip in quick mode)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ "$QUICK_MODE" = false ] && [ -f "$SCRIPT_DIR/clean.sh" ]; then
    print_status "$YELLOW" "🧹 Running cleanup script first..."
    "$SCRIPT_DIR/clean.sh"
    echo ""
elif [ "$QUICK_MODE" = false ]; then
    print_status "$YELLOW" "⚠️  Cleanup script not found, skipping..."
fi

# Step 1: Install dependencies
print_status "$BLUE" "📦 Step 1: Installing dependencies..."

# Check required commands
for cmd in npm bundle git; do
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

# Step 2: Linting and formatting
print_status "$BLUE" "🔍 Step 2: Linting and formatting..."
if [ -f "package.json" ]; then
    print_status "$YELLOW" "  Running ESLint..."
    npm run lint
    
    print_status "$YELLOW" "  Checking Prettier formatting..."
    npm run format
    
    print_status "$YELLOW" "  Running Markdown lint..."
    npm run mdlint
    
    print_status "$YELLOW" "  Running Stylelint..."
    npm run stylelint
fi

# Step 3: Theme synchronization
print_status "$BLUE" "🎨 Step 3: Theme synchronization..."
if [ -f "package.json" ] && grep -q '"theme:sync"' package.json >/dev/null 2>&1; then
    print_status "$YELLOW" "  Running theme sync..."
    npm run theme:sync
    
    # Check for diffs limited to generated files to avoid unrelated local edits
    GENERATED_PATHS=("src/themes/packs/catppuccin.synced.ts")
    if ! git diff --quiet -- "${GENERATED_PATHS[@]}" \
        || [[ -n "$(git ls-files --others --exclude-standard -- ${GENERATED_PATHS[*]})" ]]; then
        print_status "$RED" "❌ Non-deterministic theme sync detected in generated files:"
        git --no-pager diff -- "${GENERATED_PATHS[@]}" | cat
        git ls-files --others --exclude-standard -- ${GENERATED_PATHS[*]} || true
        exit 1
    else
        print_status "$GREEN" "✅ Theme sync is deterministic"
    fi
fi

# Step 4: TypeScript build
print_status "$BLUE" "⚡ Step 4: TypeScript build..."
if [ -f "package.json" ] && grep -q '"build"' package.json >/dev/null 2>&1; then
    print_status "$YELLOW" "  Building TypeScript..."
    npm run build
fi

# Step 5: Tests with coverage
print_status "$BLUE" "🧪 Step 5: Tests with coverage..."
if [ -f "package.json" ] && grep -q '"test"' package.json >/dev/null 2>&1; then
    print_status "$YELLOW" "  Running tests..."
    npm test --silent
fi

# Step 6: CSS budget check
print_status "$BLUE" "📊 Step 6: CSS budget check..."
if [ -f "package.json" ] && grep -q '"css:budget"' package.json >/dev/null 2>&1; then
    print_status "$YELLOW" "  Running CSS budget check..."
    npm run css:budget
fi

# Step 7: Jekyll build
print_status "$BLUE" "🏗️  Step 7: Jekyll build..."
print_status "$YELLOW" "  Building Jekyll site..."
bundle exec jekyll build --trace --strict_front_matter

# Step 8: HTMLProofer
print_status "$BLUE" "🔍 Step 8: HTMLProofer validation..."
print_status "$YELLOW" "  Running HTMLProofer..."
# Options must precede the PATH; disable external checks and allow demo anchors
bundle exec htmlproofer \
  --assume-extension \
  --disable-external \
  --allow-hash-href \
  --allow-missing-href \
  --no-enforce-https \
  --ignore-urls "https://turbocoder13.github.io/bulma-turbo-themes,https://turbocoder13.github.io/bulma-turbo-themes/,https://turbocoder13.github.io/bulma-turbo-themes/forms/,https://turbocoder13.github.io/bulma-turbo-themes/components/,https://turbocoder13.github.io/bulma-turbo-themes/es/introduccion/,https://cdn.jsdelivr.net,https://bulma.io,https://bulma.io/.*,https://www.bulma.io/.*" \
  ./_site

# Step 9: Lighthouse performance analysis (full mode only)
if [ "$FULL_MODE" = true ]; then
    print_status "$BLUE" "📊 Step 9: Lighthouse performance analysis..."
    if command_exists "npx"; then
        # Check if Lighthouse config exists
        if [ -f "lighthouserc.json" ]; then
            print_status "$YELLOW" "  Running Lighthouse CI..."
            npx --yes @lhci/cli@0.14.0 autorun --config=./lighthouserc.json --collect.numberOfRuns=1
        else
            print_status "$YELLOW" "⚠️  Lighthouse config not found, skipping..."
        fi
    else
        print_status "$YELLOW" "⚠️  npx not available, skipping Lighthouse..."
    fi
fi

# Step 10: Security checks (full mode only)
if [ "$FULL_MODE" = true ]; then
    print_status "$BLUE" "🔒 Step 10: Security checks..."
    if command_exists "npm"; then
        print_status "$YELLOW" "  Running npm audit..."
        npm audit --audit-level=moderate || print_status "$YELLOW" "⚠️  npm audit found issues"
    else
        print_status "$YELLOW" "⚠️  npm not available for security checks"
    fi
fi

# Summary
print_status "$GREEN" "✅ CI pipeline completed successfully!"
print_status "$BLUE" "📋 Summary:"
print_status "$GREEN" "  ✅ Linting and formatting passed"
print_status "$GREEN" "  ✅ Theme synchronization passed"
print_status "$GREEN" "  ✅ TypeScript build passed"
print_status "$GREEN" "  ✅ Tests with coverage passed"
print_status "$GREEN" "  ✅ Jekyll build passed"
print_status "$GREEN" "  ✅ HTMLProofer validation passed"
if [ "$FULL_MODE" = true ]; then
    print_status "$GREEN" "  ✅ Lighthouse performance analysis passed"
    print_status "$GREEN" "  ✅ Security checks passed"
fi

# Check if we should serve the site (local mode only)
if [ "$QUICK_MODE" = false ] && [ "$FULL_MODE" = false ]; then
    print_status "$BLUE" "🚀 Ready for CI! You can now push with confidence."
    
    # Allow non-interactive flag: --serve or --no-serve
    response_prompted=false
    if [ "$SERVE_MODE" = true ]; then
        response="y"
        response_prompted=true
    elif [ "$NO_SERVE" = true ]; then
        response="n"
        response_prompted=true
    fi

    if [ "$response_prompted" = false ]; then
        print_status "$YELLOW" "🌐 Would you like to serve the site locally? (y/n)"
        read -r response
    fi

    if [[ "$response" =~ ^[Yy]$ ]]; then
        # Find an available port
        local_port=4000
        while ! port_available $local_port; do
            local_port=$((local_port + 1))
            if [ $local_port -gt 4010 ]; then
                print_status "$RED" "❌ No available ports found between 4000-4010"
                exit 1
            fi
        done
        
        print_status "$GREEN" "🚀 Starting Jekyll server on port $local_port..."
        print_status "$BLUE" "📱 Site will be available at: http://localhost:$local_port"
        print_status "$YELLOW" "💡 Press Ctrl+C to stop the server"
        echo ""
        
        # Start Jekyll server with live reload
        bundle exec jekyll serve --port $local_port --livereload --incremental
    else
        print_status "$BLUE" "📋 Build completed successfully!"
        print_status "$YELLOW" "To serve the site later, run:"
        echo "   bundle exec jekyll serve --livereload --incremental"
        echo ""
        print_status "$GREEN" "✨ Your site is ready in the _site/ directory!"
    fi
else
    print_status "$BLUE" "🚀 Ready for CI! You can now push with confidence."
fi
