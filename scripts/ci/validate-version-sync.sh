#!/usr/bin/env bash
# Validate version sync across all platform packages
# Usage: validate-version-sync.sh
#
# This script ensures all platform-specific version files are in sync
# with the canonical VERSION file. Run this in CI to catch version
# mismatches before publishing.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Source of truth
VERSION_FILE="$ROOT_DIR/VERSION"
if [[ ! -f "$VERSION_FILE" ]]; then
  echo "❌ Error: VERSION file not found at $VERSION_FILE"
  exit 1
fi
EXPECTED_VERSION=$(tr -d '[:space:]' <"$VERSION_FILE")

echo "🔍 Validating version sync (expected: $EXPECTED_VERSION)"
echo ""

ERRORS=0

# Extract version from package.json
extract_npm_version() {
  sed -n 's/.*"version": "\([^"]*\)".*/\1/p' "$1" | head -1
}

# Extract version from Ruby version.rb
extract_ruby_version() {
  sed -n 's/.*VERSION = "\([^"]*\)".*/\1/p' "$1" | head -1
}

# Extract version from Gemfile.lock (handles prerelease versions like 1.2.3.pre.1)
extract_gemlock_version() {
  sed -n 's/.*turbo-themes (\([^)]*\)).*/\1/p' "$1" | head -1
}

# Extract version from pyproject.toml
extract_python_toml_version() {
  sed -n 's/^version = "\([^"]*\)".*/\1/p' "$1" | head -1
}

# Extract version from Python __init__.py
extract_python_init_version() {
  sed -n 's/.*__version__ = "\([^"]*\)".*/\1/p' "$1" | head -1
}

# Extract version from Swift Version.swift
extract_swift_version() {
  sed -n 's/.*string = "\([^"]*\)".*/\1/p' "$1" | head -1
}

# Helper function to check version
check_version() {
  local file="$1"
  local extract_func="$2"
  local description="$3"

  if [[ ! -f "$file" ]]; then
    echo "⚠️  Skipping $description (file not found)"
    return
  fi

  local actual_version
  actual_version=$($extract_func "$file")

  if [[ -z "$actual_version" ]]; then
    echo "❌ $description: Could not extract version"
    ERRORS=$((ERRORS + 1))
    return
  fi

  if [[ "$actual_version" == "$EXPECTED_VERSION" ]]; then
    echo "✅ $description: $actual_version"
  else
    echo "❌ $description: $actual_version (expected: $EXPECTED_VERSION)"
    ERRORS=$((ERRORS + 1))
  fi
}

# Check all platform versions
check_version "$ROOT_DIR/package.json" extract_npm_version "npm (package.json)"
check_version "$ROOT_DIR/lib/turbo-themes/version.rb" extract_ruby_version "Ruby (version.rb)"
check_version "$ROOT_DIR/Gemfile.lock" extract_gemlock_version "Ruby (Gemfile.lock)"
check_version "$ROOT_DIR/python/pyproject.toml" extract_python_toml_version "Python (pyproject.toml)"
check_version "$ROOT_DIR/python/src/turbo_themes/__init__.py" extract_python_init_version "Python (__init__.py)"
check_version "$ROOT_DIR/swift/Sources/TurboThemes/Version.swift" extract_swift_version "Swift (Version.swift)"

echo ""

if [[ $ERRORS -gt 0 ]]; then
  echo "❌ Version sync validation failed with $ERRORS error(s)"
  echo ""
  echo "To fix this, run: bun run scripts/sync-version.mjs"
  exit 1
else
  echo "✅ All versions are in sync!"
fi
