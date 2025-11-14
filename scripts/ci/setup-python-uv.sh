#!/usr/bin/env bash
# Setup Python environment using uv and sync dependencies
# Usage: setup-python-uv.sh

set -euo pipefail

PYTHON_VERSION="${1:-3.13}"

echo "Setting up Python $PYTHON_VERSION via uv..."
uv python install "$PYTHON_VERSION"
echo "UV_PYTHON=$PYTHON_VERSION" >> "$GITHUB_ENV"

echo "Syncing Python dependencies with uv..."
uv sync

echo "✅ Python environment setup completed successfully"
