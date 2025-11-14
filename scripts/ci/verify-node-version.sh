#!/usr/bin/env bash
# Verify Node.js version matches the requested version
# Usage: verify-node-version.sh [EXPECTED_VERSION]

set -euo pipefail

EXPECTED_VERSION="${1:-22}"

echo "Requested Node.js version: $EXPECTED_VERSION"
echo "Actual Node.js version: $(node --version)"
echo "NPM version: $(npm --version)"

# Ensure major version match
if ! node --version | grep -q "^v$EXPECTED_VERSION\."; then
  echo "Error: Node.js major version mismatch. Expected v$EXPECTED_VERSION.x, got $(node --version)"
  exit 1
fi

echo "✅ Node.js version verified successfully"
