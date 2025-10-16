#!/bin/bash
# Verify Lighthouse CI results
# Usage: verify-lighthouse-results.sh

set -euo pipefail

if [ ! -d ".lighthouse" ] || [ -z "$(ls -A .lighthouse 2>/dev/null)" ]; then
  echo "❌ Lighthouse CI failed - no results generated"
  echo "This indicates Lighthouse could not run properly"
  echo "Check the build logs above for network or other errors"
  exit 1
else
  echo "✅ Lighthouse CI completed successfully"
  echo "Results found in .lighthouse directory:"
  ls -la .lighthouse/
fi
