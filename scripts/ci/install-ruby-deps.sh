#!/usr/bin/env bash
# Install Ruby dependencies from Gemfile.lock
# Usage: install-ruby-deps.sh

set -euo pipefail

echo "Installing Ruby dependencies from Gemfile.lock..."
bundle install --frozen
echo "✅ Ruby dependencies installed successfully"
