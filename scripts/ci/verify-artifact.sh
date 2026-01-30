#!/usr/bin/env bash
set -euo pipefail

# Verify downloaded artifact integrity

GEM_COUNT=$(find . -maxdepth 1 -name "*.gem" -type f | wc -l)

if [ "$GEM_COUNT" -eq 0 ]; then
  echo "❌ No gem files found"
  exit 1
fi

if [ "$GEM_COUNT" -gt 1 ]; then
  echo "⚠️  Multiple gem files found:"
  ls -lh ./*.gem
else
  ls -lh ./*.gem
fi

echo "✅ Artifact downloaded successfully"
