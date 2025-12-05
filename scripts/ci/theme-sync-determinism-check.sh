#!/bin/bash
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
if [[ -n "$(git status --porcelain)" ]]; then
  echo 'Non-deterministic theme sync detected:'
  git status --porcelain
  git --no-pager diff | cat
  exit 1
fi
