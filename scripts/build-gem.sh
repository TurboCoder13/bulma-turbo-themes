#!/bin/bash

# Build script for bulma-turbo-themes Ruby gem
# This script copies assets from npm build output to gem structure
# Usage: ./scripts/build-gem.sh

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

# Get the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$PROJECT_ROOT"

print_status "$BLUE" "🔨 Building bulma-turbo-themes gem..."

# Step 1: Ensure npm build has been run
print_status "$YELLOW" "  Checking if npm build has been run..."
if [ ! -d "dist" ] || [ ! -f "dist/index.js" ]; then
    print_status "$YELLOW" "  npm build not found, running npm run build..."
    npm run build
fi

# Step 2: Sync version from package.json to gem version file
print_status "$YELLOW" "  Syncing version from package.json..."
VERSION=$(node -p "require('./package.json').version")
VERSION_FILE="lib/bulma-turbo-themes/version.rb"
if [ -f "$VERSION_FILE" ]; then
    # Update version in version.rb (portable sed for macOS/Linux)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s/VERSION = \".*\"/VERSION = \"$VERSION\"/" "$VERSION_FILE"
    else
        sed -i "s/VERSION = \".*\"/VERSION = \"$VERSION\"/" "$VERSION_FILE"
    fi
    print_status "$GREEN" "  ✅ Version synced to $VERSION"
else
    print_status "$RED" "  ❌ Version file not found: $VERSION_FILE"
    exit 1
fi

# Step 3: Copy JavaScript bundle to assets/js for gem
print_status "$YELLOW" "  Copying JavaScript bundle to assets/js..."
mkdir -p assets/js
if [ -f "dist/index.js" ]; then
    cp -f dist/index.js assets/js/theme-selector.js
    print_status "$GREEN" "  ✅ JavaScript bundle copied to assets/js/theme-selector.js"
else
    print_status "$RED" "  ❌ JavaScript bundle not found: dist/index.js"
    exit 1
fi

# Step 4: Verify assets are in place
print_status "$YELLOW" "  Verifying assets..."
if [ ! -d "assets/css/themes" ]; then
    print_status "$RED" "  ❌ CSS themes directory not found: assets/css/themes"
    exit 1
fi
if [ ! -d "assets/img" ]; then
    print_status "$YELLOW" "  ⚠️  Images directory not found, but continuing..."
fi
print_status "$GREEN" "  ✅ Assets verified"

# Step 5: Build the gem
print_status "$YELLOW" "  Building gem..."
if command -v gem >/dev/null 2>&1; then
    gem build bulma-turbo-themes.gemspec
    print_status "$GREEN" "  ✅ Gem built successfully"
    
    # Show gem file info
    GEM_FILE="bulma-turbo-themes-${VERSION}.gem"
    if [ -f "$GEM_FILE" ]; then
        print_status "$GREEN" "  📦 Gem file: $GEM_FILE"
        ls -lh "$GEM_FILE"
    fi
else
    print_status "$YELLOW" "  ⚠️  gem command not found, skipping gem build"
    print_status "$YELLOW" "  Gem structure prepared, but gem file not built"
fi

print_status "$GREEN" "✅ Gem build complete!"

