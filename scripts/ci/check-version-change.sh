#!/usr/bin/env bash
set -euo pipefail

# Check version change and determine if tag should be created
# This script handles both automatic and manual version detection

MANUAL_VERSION="${1:-}"
CURRENT_VERSION=""
PREVIOUS_VERSION=""
VERSION_CHANGED="false"
TAG_EXISTS="false"

echo "🔍 Checking version change..."

# Get current version
if [ -n "$MANUAL_VERSION" ]; then
  # Use manual input version (remove 'v' prefix if present)
  CURRENT_VERSION="$MANUAL_VERSION"
  CURRENT_VERSION="${CURRENT_VERSION#v}"
  echo "✅ Using manual version: $CURRENT_VERSION"
else
  # Use package.json version
  CURRENT_VERSION=$(node -p "require('./package.json').version")
  echo "✅ Using package.json version: $CURRENT_VERSION"
fi

# Get previous version
PREVIOUS_VERSION=$(git show HEAD~1:package.json 2>/dev/null | node -p "try { JSON.parse(require('fs').readFileSync(0, 'utf8')).version } catch { '' }" 2>/dev/null || echo "")

# Check version change
if [ -n "$MANUAL_VERSION" ]; then
  # Manual dispatch - always create tag
  VERSION_CHANGED="true"
  echo "✅ Manual dispatch - will create tag for version: $CURRENT_VERSION"
elif [ "$CURRENT_VERSION" = "$PREVIOUS_VERSION" ]; then
  VERSION_CHANGED="false"
  echo "ℹ️ Version unchanged: $CURRENT_VERSION"
else
  VERSION_CHANGED="true"
  echo "✅ Version changed: $PREVIOUS_VERSION → $CURRENT_VERSION"
fi

# Check if tag exists
if git rev-parse "v$CURRENT_VERSION" >/dev/null 2>&1; then
  TAG_EXISTS="true"
  echo "ℹ️ Tag v$CURRENT_VERSION already exists"
else
  TAG_EXISTS="false"
  echo "✅ Tag v$CURRENT_VERSION needs to be created"
fi

# Output results for GitHub Actions
echo "current_version=$CURRENT_VERSION" >>"$GITHUB_OUTPUT"
echo "previous_version=$PREVIOUS_VERSION" >>"$GITHUB_OUTPUT"
echo "version_changed=$VERSION_CHANGED" >>"$GITHUB_OUTPUT"
echo "tag_exists=$TAG_EXISTS" >>"$GITHUB_OUTPUT"

echo "✅ Version check complete"
