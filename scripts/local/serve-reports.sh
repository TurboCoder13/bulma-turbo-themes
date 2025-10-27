#!/usr/bin/env bash
# SPDX-License-Identifier: MIT
# Purpose: Serve test reports locally for development
#
# This script starts servers to view generated test reports:
# - Playwright HTML Report: http://localhost:9323
# - Lighthouse Reports (if generated): http://localhost:3001
# - Jekyll Site: http://localhost:4000
#
# Usage: ./scripts/local/serve-reports.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

cd "$REPO_ROOT"

echo "📊 Test Report Servers"
echo "====================="
echo ""

# Check for Playwright report
if [ -d "playwright-report" ] || [ -L "playwright" ]; then
  echo "✅ Playwright HTML Report found"
  echo "   📍 View at: http://localhost:4000/playwright/"
  echo "   📍 Or standalone: http://localhost:9323"
  echo ""
else
  echo "⚠️  Playwright HTML Report not found"
  echo "   Run: npm run e2e"
  echo ""
fi

# Check for Lighthouse reports
if [ -d "lighthouse-reports" ] || [ -L "lighthouse" ]; then
  echo "✅ Lighthouse Reports found"
  echo "   📍 View at: http://localhost:4000/lighthouse/"
  echo "   📍 Or standalone: http://localhost:3001/lighthouse/"
  echo ""
else
  echo "⚠️  Lighthouse Reports not found"
  echo "   Run: ./scripts/ci/run-lighthouse-ci.sh"
  echo ""
fi

echo "Jekyll Site: http://localhost:4000"
echo ""
echo "Starting report servers..."
echo ""

# Start Playwright report server
if [ -d "playwright-report" ]; then
  npx http-server playwright-report -p 9323 --silent &
  PW_PID=$!
  echo "✅ Playwright server started (PID: $PW_PID)"
fi

# Start Lighthouse report server
if [ -d "lighthouse-reports" ]; then
  npx http-server . -p 3001 --silent &
  LH_PID=$!
  echo "✅ Lighthouse server started (PID: $LH_PID)"
fi

echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Wait for interrupt
wait
