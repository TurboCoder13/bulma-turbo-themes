#!/bin/bash
set -euo pipefail

# Run Lighthouse CI with proper error handling and debugging
# Usage: run-lighthouse-ci.sh

echo "🚀 Starting full CI pipeline with Lighthouse..."

# Run the full build pipeline
./scripts/local/build.sh --full

echo "🔍 Checking if Lighthouse reports were generated..."
if [ -d "lighthouse-reports" ]; then
  echo "✅ lighthouse-reports directory exists"
  ls -la lighthouse-reports/
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
