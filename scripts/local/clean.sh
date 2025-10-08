#!/bin/bash

# Clean script for bulma-turbo-themes Jekyll site
# This script removes all build artifacts, temporary files, and cached content
# to allow for a fresh rebuild from scratch.

set -e  # Exit on any error

echo "🧹 Starting cleanup of bulma-turbo-themes project..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to safely remove directories/files
safe_remove() {
    local target="$1"
    local description="$2"
    
    if [ -e "$target" ]; then
        echo -e "${BLUE}🗑️  Removing $description: $target${NC}"
        rm -rf "$target"
    else
        echo -e "${YELLOW}⚠️  $description not found: $target${NC}"
    fi
}

# Function to safely remove files
safe_remove_file() {
    local target="$1"
    local description="$2"
    
    if [ -f "$target" ]; then
        echo -e "${BLUE}🗑️  Removing $description: $target${NC}"
        rm "$target"
    else
        echo -e "${YELLOW}⚠️  $description not found: $target${NC}"
    fi
}

echo -e "${BLUE}📁 Cleaning build directories...${NC}"

# Remove Jekyll build output
safe_remove "_site" "Jekyll build output"

# Remove Jekyll cache
safe_remove ".jekyll-cache" "Jekyll cache"

# Remove TypeScript build output
safe_remove "dist" "TypeScript build output"

# Remove test coverage reports
safe_remove "coverage" "Test coverage reports"

# Remove bundle cache
safe_remove ".bundle" "Ruby bundle cache"

# Remove vendor directory (if it contains build artifacts)
safe_remove "vendor" "Vendor build artifacts"

echo -e "${BLUE}📦 Cleaning package manager files...${NC}"

# Flags: keep lockfiles by default; allow opt-in removal with --remove-locks
remove_locks=false
for arg in "$@"; do
  case "$arg" in
    --remove-locks)
      remove_locks=true
      ;;
  esac
done

# Remove node_modules (will be reinstalled)
safe_remove "node_modules" "Node.js dependencies"

# Optionally remove lockfiles if requested
if [ "$remove_locks" = true ]; then
  safe_remove_file "package-lock.json" "Package lock file"
  safe_remove_file "Gemfile.lock" "Gemfile lock file"
else
  echo -e "${YELLOW}⚠️  Keeping lockfiles (use --remove-locks to delete)${NC}"
fi

echo -e "${BLUE}🔧 Cleaning generated files...${NC}"

# Remove service worker files (will be regenerated)
safe_remove_file "sw-theme-cache.js" "Service worker cache file"

# Remove offline.html (will be regenerated)
safe_remove_file "offline.html" "Offline page"

# Remove any .DS_Store files (macOS)
find . -name ".DS_Store" -type f -delete 2>/dev/null || true

# Remove any temporary files
find . -name "*.tmp" -type f -delete 2>/dev/null || true
find . -name "*.temp" -type f -delete 2>/dev/null || true

echo -e "${BLUE}🧪 Cleaning test artifacts...${NC}"

# Remove any test output files
find . -name "test-results" -type d -exec rm -rf {} + 2>/dev/null || true
find . -name "*.test.log" -type f -delete 2>/dev/null || true

echo -e "${BLUE}📋 Summary of cleanup...${NC}"

# Show what's left
echo -e "${GREEN}✅ Cleanup complete! The following directories/files were removed:${NC}"
echo "   • _site/ (Jekyll build output)"
echo "   • .jekyll-cache/ (Jekyll cache)"
echo "   • dist/ (TypeScript build output)"
echo "   • coverage/ (Test coverage reports)"
echo "   • .bundle/ (Ruby bundle cache)"
echo "   • vendor/ (Vendor build artifacts)"
echo "   • node_modules/ (Node.js dependencies)"
if [ "$remove_locks" = true ]; then
  echo "   • package-lock.json (Package lock file)"
  echo "   • Gemfile.lock (Gemfile lock file)"
else
  echo "   • (lockfiles kept)"
fi
echo "   • sw-theme-cache.js (Service worker cache)"
echo "   • offline.html (Offline page)"
echo "   • .DS_Store files (macOS system files)"
echo "   • Temporary and test artifact files"

echo ""
echo -e "${YELLOW}🔄 To rebuild from scratch, run:${NC}"
if [ -f "package.json" ]; then
  echo "   npm install          # Install Node.js dependencies"
  echo "   npm run ts:build     # Build TypeScript"
else
  echo "   # (Node.js steps skipped - no package.json)"
fi
echo "   bundle install       # Install Ruby dependencies"
echo "   bundle exec jekyll build  # Build Jekyll site"
echo ""
echo -e "${YELLOW}🚀 To serve the site locally:${NC}"
echo "   bundle exec jekyll serve  # Serve with live reload"
echo "   # or"
echo "   bundle exec jekyll serve --livereload --incremental"

echo ""
echo -e "${GREEN}✨ Your project is now clean and ready for a fresh rebuild!${NC}"
