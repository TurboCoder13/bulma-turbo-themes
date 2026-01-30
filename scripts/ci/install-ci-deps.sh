#!/usr/bin/env bash
# Install shared CI dependencies (CLI tools etc.)
# Currently installs:
#   - actionlint (GitHub Actions workflow linter)
#   - hadolint (Dockerfile linter used by lintro)
#
# This script is intended to be the single entry point from CI workflows for
# installing auxiliary tools needed by linting/quality checks. Individual tools
# should have their own installer scripts which are invoked from here.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "📦 Installing shared CI dependencies..."

# Install actionlint via its dedicated installer
"${SCRIPT_DIR}/install-actionlint.sh"

# Install hadolint via its dedicated installer
"${SCRIPT_DIR}/install-hadolint.sh"

echo "✅ Shared CI dependencies installation completed"
