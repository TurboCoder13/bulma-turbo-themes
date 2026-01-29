#!/usr/bin/env bash
# SPDX-License-Identifier: MIT
# Purpose: Build Python package using uv
#
# Usage: ./build-python-package.sh [--working-dir DIR]
#
# Options:
#   --working-dir DIR    Directory containing Python package (default: python)
#
# This script builds the Python package wheel and sdist using uv.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/../utils/utils.sh"

WORKING_DIR="python"

parse_args() {
  while [[ $# -gt 0 ]]; do
    case $1 in
    --working-dir)
      WORKING_DIR="$2"
      shift 2
      ;;
    *)
      log_error "Unknown option: $1"
      exit 2
      ;;
    esac
  done
}

main() {
  parse_args "$@"

  log_info "Building Python package..."

  # Check for uv
  require_command uv

  # Validate working directory
  if [[ ! -d "$WORKING_DIR" ]]; then
    log_error "Working directory not found: $WORKING_DIR"
    exit 1
  fi

  cd "$WORKING_DIR"

  # Build package
  log_info "Running uv build..."
  uv build

  # Show build artifacts
  if [[ -d "dist" ]]; then
    log_info "Build artifacts:"
    ls -la dist/
  fi

  log_success "Python package build completed"
}

main "$@"
