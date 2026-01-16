#!/usr/bin/env bash
set -euo pipefail

# Run Lighthouse CI with proper error handling and debugging
# Usage: run-lighthouse-ci.sh
#
# This script uses a streamlined build process that skips tests
# (tests run in separate workflows to avoid duplication)

echo "🚀 Starting Lighthouse build pipeline..."

# Run the lighthouse-specific build pipeline (skips tests)
./scripts/ci/build-for-lighthouse.sh

echo "🔦 Running Lighthouse CI..."
# Lighthouse CI will start the http-server automatically based on lighthouserc.json
npx @lhci/cli@0.15.x autorun

echo "🔍 Checking if Lighthouse reports were generated..."
if [ -d "lighthouse-reports" ]; then
  echo "✅ lighthouse-reports directory exists"
  ls -la lighthouse-reports/

  echo "📄 Generating index.html for Lighthouse reports..."
  node scripts/ci/generate-lighthouse-index.mjs lighthouse-reports
else
  echo "❌ lighthouse-reports directory not found"
  echo "Checking for .lighthouse directory..."
  if [ -d ".lighthouse" ]; then
    echo "Found .lighthouse directory:"
    ls -la .lighthouse/
  else
    echo "No .lighthouse directory found either"
  fi
fi
