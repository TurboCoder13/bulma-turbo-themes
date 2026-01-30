#!/usr/bin/env bash
# SPDX-License-Identifier: MIT
# Purpose: Run shellcheck on all shell scripts in the repository
#
# Usage: ./run-shellcheck.sh [--strict]
#
# Options:
#   --strict    Exit with error on any shellcheck findings (default: non-blocking)
#
# This script installs shellcheck if needed and runs it on all .sh files.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/../utils/utils.sh"

STRICT_MODE=false

parse_args() {
  while [[ $# -gt 0 ]]; do
    case $1 in
    --strict)
      STRICT_MODE=true
      shift
      ;;
    *)
      log_error "Unknown option: $1"
      exit 2
      ;;
    esac
  done
}

install_shellcheck() {
  if command_exists shellcheck; then
    log_info "shellcheck already installed: $(shellcheck --version | head -1)"
    return 0
  fi

  log_info "Installing shellcheck..."
  if command_exists sudo; then
    sudo apt-get update && sudo apt-get install -y shellcheck
  else
    log_warn "sudo not available; attempting shellcheck without install"
    return 1
  fi
}

main() {
  parse_args "$@"

  log_info "Running shellcheck on shell scripts..."

  # Try to install shellcheck
  if ! install_shellcheck; then
    log_warn "Could not install shellcheck, skipping"
    exit 0
  fi

  # Find all shell scripts using array for safe handling
  local -a files=()
  while IFS= read -r file; do
    [[ -n "$file" ]] && files+=("$file")
  done < <(git ls-files '*.sh' 2>/dev/null || true)

  if [[ ${#files[@]} -eq 0 ]]; then
    log_info "No shell scripts found"
    exit 0
  fi

  log_info "Found ${#files[@]} shell scripts"

  # Run shellcheck with array expansion (safe for filenames with spaces)
  local exit_code=0
  if shellcheck -S style -x "${files[@]}"; then
    log_success "shellcheck passed with no issues"
  else
    exit_code=$?
    if [[ "$STRICT_MODE" == "true" ]]; then
      log_error "shellcheck found issues (strict mode)"
    else
      log_warn "shellcheck found issues (non-blocking)"
      exit_code=0
    fi
  fi

  exit $exit_code
}

main "$@"
