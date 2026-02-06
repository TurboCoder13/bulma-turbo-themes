#!/usr/bin/env bash

# Build script for turbo-themes Ruby gem
# This script copies assets from Bun build output to gem structure
# Usage: ./scripts/build-gem.sh

set -euo pipefail # Exit on error/undefined var; fail pipelines

command -v bun >/dev/null 2>&1 || {
  echo "bun is required (see CONTRIBUTING.md)"
  exit 1
}

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

print_status "$BLUE" "🔨 Building turbo-themes gem..."

# Step 1: Ensure Bun build has been run
print_status "$YELLOW" "  Checking if Bun build has been run..."
if [ ! -d "dist" ] || [ ! -f "dist/index.js" ]; then
  print_status "$YELLOW" "  Bun build not found, running bun run build..."
  bun run build
fi

# Step 2: Sync version from package.json to gem version file
print_status "$YELLOW" "  Syncing version from package.json..."
# Use bun for consistency with primary toolchain
VERSION=$(bun -p "require('./package.json').version")
VERSION_FILE="lib/turbo-themes/version.rb"
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
  # Fix sourceMappingURL to match the renamed file
  sed -i '' 's|//# sourceMappingURL=index.js.map|//# sourceMappingURL=theme-selector.js.map|' assets/js/theme-selector.js
  if [ -f "dist/index.js.map" ]; then
    cp -f dist/index.js.map assets/js/theme-selector.js.map
  fi
  print_status "$GREEN" "  ✅ JavaScript bundle copied to assets/js/theme-selector.js"
else
  print_status "$RED" "  ❌ JavaScript bundle not found: dist/index.js"
  exit 1
fi

# Step 4: Copy Jekyll theme files to root for gem packaging
print_status "$YELLOW" "  Copying Jekyll theme files to root..."
if [ -d "apps/site/_layouts" ]; then
  cp -r apps/site/_layouts .
  print_status "$GREEN" "  ✅ _layouts copied"
fi
if [ -d "apps/site/_includes" ]; then
  cp -r apps/site/_includes .
  print_status "$GREEN" "  ✅ _includes copied"
fi
if [ -d "apps/site/_data" ]; then
  cp -r apps/site/_data .
  print_status "$GREEN" "  ✅ _data copied"
fi

# Step 5: Verify assets are in place
print_status "$YELLOW" "  Verifying assets..."
if [ ! -d "assets/css/themes" ]; then
  print_status "$RED" "  ❌ CSS themes directory not found"
  exit 1
fi
if [ ! -d "assets/img" ]; then
  print_status "$YELLOW" "  ⚠️  Images directory not found, but continuing..."
fi
print_status "$GREEN" "  ✅ Assets verified"

# Step 6: Build the gem
print_status "$YELLOW" "  Building gem..."
if command -v gem >/dev/null 2>&1; then
  gem build turbo-themes.gemspec
  print_status "$GREEN" "  ✅ Gem built successfully"

  # Show gem file info
  GEM_FILE="turbo-themes-${VERSION}.gem"
  if [ -f "$GEM_FILE" ]; then
    print_status "$GREEN" "  📦 Gem file: $GEM_FILE"
    ls -lh "$GEM_FILE"
  fi
else
  print_status "$YELLOW" "  ⚠️  gem command not found, skipping gem build"
  print_status "$YELLOW" "  Gem structure prepared, but gem file not built"
fi

# Step 7: Clean up temporary Jekyll files
print_status "$YELLOW" "  Cleaning up temporary Jekyll files..."
[ -d "_layouts" ] && rm -rf _layouts
[ -d "_includes" ] && rm -rf _includes
[ -d "_data" ] && rm -rf _data
print_status "$GREEN" "  ✅ Cleanup complete"

print_status "$GREEN" "✅ Gem build complete!"
