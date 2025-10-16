#!/bin/bash
# Run theme sync determinism check
# Usage: theme-sync-determinism-check.sh

set -euo pipefail

npm run theme:sync
if [[ -n "$(git status --porcelain)" ]]; then
  echo 'Non-deterministic theme sync detected:'
  git status --porcelain
  git --no-pager diff | cat
  exit 1
fi
