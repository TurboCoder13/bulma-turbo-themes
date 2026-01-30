#!/usr/bin/env bash
# SPDX-License-Identifier: MIT
# Purpose: Prepare comment body for PR comments
#
# Usage: ./prepare-comment-body.sh <output-var> [--file FILE | --body TEXT]
#
# Arguments:
#   output-var    Name of the output variable (e.g., "body")
#
# Options:
#   --file FILE   Read comment body from file
#   --body TEXT   Use provided text as comment body
#
# This script outputs the comment body in GitHub Actions output format.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/../utils/utils.sh"

show_usage() {
  cat <<'EOF'
Usage: ./prepare-comment-body.sh <output-var> [--file FILE | --body TEXT]

Arguments:
  output-var    Name of the output variable (e.g., "body")

Options:
  --file FILE   Read comment body from file
  --body TEXT   Use provided text as comment body
EOF
}

main() {
  if [[ $# -lt 1 ]]; then
    log_error "Missing output variable name"
    show_usage
    exit 2
  fi

  local output_var="$1"
  shift

  local source_file=""
  local body_text=""

  while [[ $# -gt 0 ]]; do
    case $1 in
    --file)
      if [[ $# -lt 2 ]] || [[ "$2" == -* ]] || [[ -z "$2" ]]; then
        log_error "--file requires a non-empty file path argument"
        show_usage
        exit 2
      fi
      source_file="$2"
      shift 2
      ;;
    --body)
      # Note: Don't check for -* prefix since body text may start with - (e.g., markdown lists)
      if [[ $# -lt 2 ]] || [[ -z "$2" ]]; then
        log_error "--body requires a non-empty text argument"
        show_usage
        exit 2
      fi
      body_text="$2"
      shift 2
      ;;
    *)
      log_error "Unknown option: $1"
      show_usage
      exit 2
      ;;
    esac
  done

  # Determine body content
  local body=""
  if [[ -n "$source_file" ]]; then
    if [[ -f "$source_file" ]]; then
      body=$(cat "$source_file")
    else
      log_warn "File not found: $source_file, using empty body"
      body=""
    fi
  elif [[ -n "$body_text" ]]; then
    body="$body_text"
  else
    log_error "Must provide either --file or --body"
    exit 2
  fi

  # Output in GitHub Actions format
  if [[ -n "${GITHUB_OUTPUT:-}" ]]; then
    # Use unique delimiter to avoid collision with body content
    local delimiter
    delimiter="EOF_${$}_$(date +%s)"
    {
      echo "${output_var}<<${delimiter}"
      echo "$body"
      echo "${delimiter}"
    } >>"$GITHUB_OUTPUT"
  else
    echo "${output_var}=$body"
  fi
}

main "$@"
