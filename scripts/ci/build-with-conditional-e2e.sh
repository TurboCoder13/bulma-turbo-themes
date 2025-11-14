#!/usr/bin/env bash
# Build the site with conditional E2E test support.
# Usage: build-with-conditional-e2e.sh [EVENT_NAME] [RUN_E2E_TESTS]
# - EVENT_NAME: GitHub event name (e.g., "push", "workflow_dispatch")
# - RUN_E2E_TESTS: "true" or "false" (used for workflow_dispatch)
# Behaviour:
#   - For push events (e.g. merge to main), always run full build INCLUDING E2E tests,
#     so that the deployed Jekyll site exposes coverage, Lighthouse and Playwright reports.
#   - For workflow_dispatch, RUN_E2E_TESTS controls whether E2E tests run.

set -euo pipefail

EVENT_NAME="${1:-push}"
RUN_E2E_TESTS="${2:-false}"

if [ "$EVENT_NAME" = "push" ]; then
  echo "Building site with E2E tests for push event..."
  npm run build:prod -- --no-serve
elif [ "$RUN_E2E_TESTS" = "true" ]; then
  echo "Building site with E2E tests (workflow_dispatch override)..."
  npm run build:prod -- --no-serve
else
  echo "Building site without E2E tests (workflow_dispatch, run-e2e-tests=false)..."
  npm run build:prod -- --no-serve --skip-e2e
fi

echo "✅ Site build completed successfully"

