#!/bin/bash
# SPDX-License-Identifier: MIT
# Purpose: Build script for CI/CD workflows
#
# Usage: ./build.sh [--no-serve]

set -e

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Call the local build script with the same arguments
exec "$SCRIPT_DIR/scripts/local/build.sh" "$@"
