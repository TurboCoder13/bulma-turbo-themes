#!/bin/bash
# SPDX-License-Identifier: MIT
# Purpose: Build script for CI/CD workflows
#
# Usage: ./build.sh --dev|--prod [--no-serve]

set -e

# Check if environment flag is provided
if [[ ! " $@ " =~ " --dev " ]] && [[ ! " $@ " =~ " --prod " ]]; then
  echo "Error: Environment flag is required"
  echo "Usage: ./build.sh --dev|--prod [--no-serve]"
  echo ""
  echo "Examples:"
  echo "  ./build.sh --dev               # Local development build"
  echo "  ./build.sh --prod              # Production build"
  echo "  ./build.sh --dev --no-serve    # Dev build without serving"
  echo "  ./build.sh --prod --no-serve   # Prod build without serving"
  exit 1
fi

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Call the local build script with the same arguments
exec "$SCRIPT_DIR/scripts/local/build.sh" "$@"
