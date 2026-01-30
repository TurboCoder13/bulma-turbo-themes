#!/usr/bin/env bash
# SPDX-License-Identifier: MIT
# Purpose: Shared utility functions for scripts
#
# This file provides common functions used across multiple scripts
# Source this file in other scripts with:
#   source "${SCRIPT_DIR}/../utils/utils.sh"

# Color codes for terminal output
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly NC='\033[0m' # No Color

# Logging functions
log_info() {
  echo -e "${BLUE}[INFO]${NC} $*" >&2
}

log_success() {
  echo -e "${GREEN}[SUCCESS]${NC} $*" >&2
}

log_warn() {
  echo -e "${YELLOW}[WARN]${NC} $*" >&2
}

log_error() {
  echo -e "${RED}[ERROR]${NC} $*" >&2
}

# Check if command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Check if running in CI environment
is_ci() {
  [[ -n "${CI:-}" ]] || [[ -n "${GITHUB_ACTIONS:-}" ]]
}

# Git helper functions
get_git_root() {
  git rev-parse --show-toplevel 2>/dev/null
}

get_current_branch() {
  git rev-parse --abbrev-ref HEAD 2>/dev/null
}

get_commit_sha() {
  git rev-parse HEAD 2>/dev/null
}

get_short_sha() {
  git rev-parse --short HEAD 2>/dev/null
}

# File system helpers
ensure_directory() {
  local dir="$1"
  if [[ ! -d "$dir" ]]; then
    log_info "Creating directory: $dir"
    mkdir -p "$dir"
  fi
}

# Error handling
die() {
  log_error "$@"
  exit 1
}

# Require command to exist
require_command() {
  local cmd="$1"
  if ! command_exists "$cmd"; then
    die "Required command not found: $cmd"
  fi
}

# Check if file exists
require_file() {
  local file="$1"
  if [[ ! -f "$file" ]]; then
    die "Required file not found: $file"
  fi
}

# Port availability check (simplified, portable)
port_available() {
  local port="$1"
  if command_exists lsof; then
    ! lsof -Pi :"$port" -sTCP:LISTEN -t >/dev/null 2>&1
  elif command_exists nc; then
    ! nc -z 127.0.0.1 "$port" 2>/dev/null
  elif command_exists ss; then
    ! ss -ltn 2>/dev/null | awk '{print $4}' | grep -qE "(:|])${port}$"
  else
    return 0 # Assume available if no tools found
  fi
}

# Wait for port to become available
wait_for_port() {
  local port="${1:-4000}"
  local timeout="${2:-5}"
  local interval="${3:-0.5}"
  local elapsed=0

  log_info "Waiting for port $port to be released (timeout: ${timeout}s)..."

  while ! port_available "$port"; do
    if awk "BEGIN {exit !($elapsed >= $timeout)}"; then
      log_warn "Port $port still in use after ${timeout}s, continuing anyway..."
      return 0
    fi
    sleep "$interval"
    elapsed=$(awk "BEGIN {print $elapsed + $interval}")
  done

  log_success "Port $port is now free"
  return 0
}

# Run HTMLProofer with standard options
run_htmlproofer() {
  local site_dir="${1:-./_site}"
  local extra_ignore="${2:-}"

  local ignore_urls="/lighthouse/,/playwright/"
  [[ -n "$extra_ignore" ]] && ignore_urls="${ignore_urls},${extra_ignore}"

  bundle exec htmlproofer \
    --disable-external \
    --assume-extension \
    --allow-hash-href \
    --allow-missing-href \
    --no-enforce-https \
    --ignore-urls "$ignore_urls" \
    "$site_dir"
}

# Run Python tests with uv/pytest
run_python_tests() {
  local python_dir="${1:-python}"
  if [[ -d "$python_dir" ]]; then
    log_info "Running Python tests..."
    cd "$python_dir" && uv sync --extra dev && uv run pytest tests/ -v
  else
    log_warn "Python directory not found: $python_dir"
    return 0
  fi
}

# Export functions for use in other scripts
export -f log_info log_success log_warn log_error
export -f command_exists is_ci
export -f get_git_root get_current_branch get_commit_sha get_short_sha
export -f ensure_directory die require_command require_file
export -f port_available wait_for_port run_htmlproofer run_python_tests
