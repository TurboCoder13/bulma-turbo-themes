#!/usr/bin/env bash
# Verify Ruby, Gem, and Bundler setup and installation
# Usage: verify-ruby-setup.sh

set -euo pipefail

echo "Ruby version: $(ruby --version)"
echo "Ruby path: $(which ruby)"
echo "Gem version: $(gem --version)"
echo "Gem path: $(which gem)"
echo "PATH: $PATH"
echo "GEM_HOME: ${GEM_HOME:-not set}"
echo "GEM_PATH: ${GEM_PATH:-not set}"

# Check if bundle command is available
if ! command -v bundle &>/dev/null; then
  echo "Bundle command not found, installing bundler..."
  gem install bundler -v 2.3.26
fi

echo "Bundler version: $(bundler --version)"
echo "Bundler path: $(which bundler)"
echo "Bundle version: $(bundle --version)"
echo "Bundle path: $(which bundle)"

# Verify bundler is executable
bundle --version

echo "✅ Ruby setup verified successfully"
