#!/usr/bin/env bash
# Install Syft (SBOM generator)
# Usage: install-syft.sh

set -euo pipefail

mkdir -p .bin
curl -sSfL https://raw.githubusercontent.com/anchore/syft/main/install.sh | sh -s -- -b ./.bin
echo "$(pwd)/.bin" >> $GITHUB_PATH
