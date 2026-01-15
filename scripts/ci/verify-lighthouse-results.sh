#!/usr/bin/env bash
set -euo pipefail

# Verify Lighthouse CI results
# Usage: verify-lighthouse-results.sh

if [ ! -d "lighthouse-reports" ] || [ -z "$(ls -A lighthouse-reports 2>/dev/null)" ]; then
  echo "❌ Lighthouse CI failed - no results generated"
  echo "This indicates Lighthouse could not run properly"
  echo "Check the build logs above for network or other errors"
  exit 1
else
  echo "✅ Lighthouse CI completed successfully"
  echo "Results found in lighthouse-reports directory:"
  ls -la lighthouse-reports/
fi