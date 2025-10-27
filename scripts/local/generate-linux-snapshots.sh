#!/usr/bin/env bash
# SPDX-License-Identifier: MIT
# Purpose: Generate Linux snapshots locally using Docker for CI compatibility
#
# This script runs Playwright visual tests in a Linux container to generate
# snapshots that match CI environment. This allows strict tolerance testing.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

cd "$REPO_ROOT"

echo "🐧 Generating Linux snapshots using Docker..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "❌ Error: Docker is not running"
  echo "Please start Docker Desktop and try again"
  exit 1
fi

# Build the CI image if it doesn't exist
if ! docker image inspect bulma-turbo-themes-ci > /dev/null 2>&1; then
  echo "📦 Building Docker image..."
  docker build -t bulma-turbo-themes-ci . > /dev/null 2>&1
fi

# Run visual tests in Linux container with update-snapshots flag
echo "🎭 Running visual tests in Linux container..."
docker run --rm \
  -v "$REPO_ROOT:/work" \
  -w /work \
  -e CI=1 \
  bulma-turbo-themes-ci \
  bash -c "npx playwright test --grep @visual --update-snapshots"

echo ""
echo "✅ Linux snapshots generated successfully!"
echo "📁 Snapshots stored in: e2e/homepage-theme-snapshots/linux/"

