#!/usr/bin/env bash
# Build the site with conditional E2E test support
# Usage: build-with-conditional-e2e.sh [EVENT_NAME] [RUN_E2E_TESTS]

set -euo pipefail

EVENT_NAME="${1:-push}"
RUN_E2E_TESTS="${2:-false}"

if [ "$EVENT_NAME" = "push" ] || [ "$RUN_E2E_TESTS" != "true" ]; then
  echo "Building site without E2E tests..."
  npm run build:prod -- --no-serve --skip-e2e
else
  echo "Building site with E2E tests..."
  npm run build:prod -- --no-serve
fi

echo "✅ Site build completed successfully"

