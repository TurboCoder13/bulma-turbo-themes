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
CHANGED_FILES=$(git status --porcelain | grep -v '^$' || true)

if [[ -n "$CHANGED_FILES" ]]; then
  # Check if the only changes are timestamps in tokens.json files
  REAL_CHANGES=$(git diff --unified=0 | grep -v '^\+\+\+' | grep -v '^---' | grep -v '^@@' | grep '^[+-]' | grep -v '"\$generated"' || true)

  if [[ -n "$REAL_CHANGES" ]]; then
    echo 'Non-deterministic theme sync detected:'
    git status --porcelain
    git --no-pager diff | cat
    exit 1
  else
    echo 'Only timestamp changes detected (expected) - resetting files'
    git checkout -- .
  fi
fi
