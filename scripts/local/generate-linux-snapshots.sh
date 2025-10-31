#!/usr/bin/env bash
# SPDX-License-Identifier: MIT
# Purpose: Generate Linux snapshots for Playwright E2E tests in Docker
#
# This script runs tests in Docker (Linux environment) and updates the Linux snapshots,
# then copies them back to the host machine.
#
# Usage: ./scripts/local/generate-linux-snapshots.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

cd "$REPO_ROOT"

IMAGE_NAME="bulma-turbo-themes-ci"
CONTAINER_WORK_DIR="/work"

echo "🐳 Building Docker image for snapshot generation..."
docker build -t "$IMAGE_NAME" .

echo "📸 Running Playwright E2E tests in Linux container to generate snapshots..."
docker run --rm \
  -e CI=0 \
  -v "$REPO_ROOT":"$CONTAINER_WORK_DIR" \
  -w "$CONTAINER_WORK_DIR" \
  "$IMAGE_NAME" \
  /bin/bash -lc "
    echo '📦 Installing dependencies...'
    npm install > /dev/null 2>&1
    bundle install > /dev/null 2>&1
    
    echo '🏗️  Building site...'
    npm run e2e:prep > /dev/null 2>&1
    
    echo '🖼️  Generating Linux snapshots...'
    npm run e2e -- --update-snapshots
  "

echo "✅ Linux snapshots have been updated in $REPO_ROOT/e2e/homepage-theme-snapshots/linux/"
echo ""
echo "📋 Next steps:"
echo "  1. Review the snapshot changes"
echo "  2. Commit the updates with: git add e2e/homepage-theme-snapshots/ && git commit -m 'test: update linux and macos e2e snapshots'"
echo "  3. Push to your branch"

