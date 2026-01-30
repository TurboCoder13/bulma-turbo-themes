#!/usr/bin/env bash
# Generate publish release summary for GitHub Actions

set -euo pipefail

RELEASE_VERSION="${1:?Error: release_version not provided}"

echo "## GitHub Release Summary" >>"$GITHUB_STEP_SUMMARY"
echo "✅ Release $RELEASE_VERSION published and released" >>"$GITHUB_STEP_SUMMARY"
