#!/usr/bin/env bash
# SPDX-License-Identifier: MIT
# Purpose: Publish Python package to PyPI using uv
#
# Usage: ./publish-python.sh [--working-dir DIR] [--dry-run]
#
# Options:
#   --working-dir DIR    Directory containing Python package (default: python)
#   --dry-run           Show what would be published without actually publishing
#
# Environment:
#   UV_PUBLISH_TOKEN    PyPI token for authentication (if not using trusted publishing)
#
# This script publishes the Python package to PyPI using uv publish.
# In GitHub Actions, it uses trusted publishing (OIDC) for authentication.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/../utils/utils.sh"

WORKING_DIR="python"
DRY_RUN=false

parse_args() {
  while [[ $# -gt 0 ]]; do
    case $1 in
    --working-dir)
      if [[ $# -lt 2 ]] || [[ "$2" == -* ]] || [[ -z "$2" ]]; then
        log_error "--working-dir requires a directory path argument"
        exit 2
      fi
      WORKING_DIR="$2"
      shift 2
      ;;
    --dry-run)
      DRY_RUN=true
      shift
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

  log_info "Publishing Python package to PyPI..."

  # Check for uv
  require_command uv

  # Validate working directory
  if [[ ! -d "$WORKING_DIR" ]]; then
    log_error "Working directory not found: $WORKING_DIR"
    exit 1
  fi

  cd "$WORKING_DIR"

  # Check for dist directory
  if [[ ! -d "dist" ]]; then
    log_error "dist/ directory not found. Run build-python-package.sh first."
    exit 1
  fi

  # Show what will be published
  log_info "Packages to publish:"
  ls -la dist/

  if [[ "$DRY_RUN" == "true" ]]; then
    log_info "[DRY RUN] Would publish packages in dist/"
    exit 0
  fi

  # Publish to PyPI
  log_info "Running uv publish..."
  uv publish

  log_success "Python package published to PyPI"
}

main "$@"
