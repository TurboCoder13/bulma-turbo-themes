#!/usr/bin/env bash
# Run theme sync determinism check
# Usage: theme-sync-determinism-check.sh

set -euo pipefail

# Detect package manager (prefer bun, fall back to npm)
if command -v bun >/dev/null 2>&1; then
  PKG_RUN="bun run"
elif command -v npm >/dev/null 2>&1; then
  PKG_RUN="npm run"
else
  echo "❌ No package manager found!"
  exit 1
fi

$PKG_RUN theme:sync

# Check for changes, excluding timestamp-only differences in tokens.json
# The $generated field updates on each run, which is expected and not a real change
STATUS_OUTPUT=$(git status --porcelain || true)

if [[ -n "$STATUS_OUTPUT" ]]; then
  # Check for untracked files (entries starting with "??") - these are always real changes
  UNTRACKED_FILES=$(echo "$STATUS_OUTPUT" | grep '^??' || true)
  if [[ -n "$UNTRACKED_FILES" ]]; then
    echo 'Non-deterministic theme sync detected (untracked files created):'
    git status --porcelain
    exit 1
  fi

  # Check if the only changes are timestamps in tokens.json files
  REAL_CHANGES=$(git diff --unified=0 | grep -v '^\+\+\+' | grep -v '^---' | grep -v '^@@' | grep '^[+-]' | grep -v '"\$generated"' || true)

  if [[ -n "$REAL_CHANGES" ]]; then
    echo 'Non-deterministic theme sync detected:'
    git status --porcelain
    git --no-pager diff | cat
    exit 1
  else
    echo 'Only timestamp changes detected (expected) - resetting token files'
    # Only reset the specific token files that have timestamp-only changes
    git checkout -- '**/tokens.json' 2>/dev/null || true
    git checkout -- 'packages/core/src/themes/tokens.json' 2>/dev/null || true
    git checkout -- 'python/src/turbo_themes/tokens.json' 2>/dev/null || true
    git checkout -- 'swift/Sources/TurboThemes/Resources/tokens.json' 2>/dev/null || true
  fi
fi
