#!/usr/bin/env bash
# Install Ruby dependencies from Gemfile.lock
# Usage: install-ruby-deps.sh

set -euo pipefail

echo "Installing Ruby dependencies from Gemfile.lock..."
bundle config set --local frozen true
bundle install
echo "✅ Ruby dependencies installed successfully"
