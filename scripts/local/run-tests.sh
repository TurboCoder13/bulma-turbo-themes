#!/usr/bin/env bash
# SPDX-License-Identifier: MIT
# Purpose: Run tests with coverage for local development
#
# Usage: run-tests.sh [OPTIONS]
#
# Options:
#   --watch         Run tests in watch mode
#   --no-coverage   Skip coverage reporting
#   --help, -h      Show this help message

set -e

# Source shared utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -f "$SCRIPT_DIR/../utils/utils.sh" ]; then
  source "$SCRIPT_DIR/../utils/utils.sh"
fi

# Show help if requested
if [ "${1:-}" = "--help" ] || [ "${1:-}" = "-h" ]; then
  echo "Usage: $0 [OPTIONS]"
  echo ""
  echo "Run tests with coverage for local development"
  echo ""
  echo "Options:"
  echo "  --watch         Run tests in watch mode"
  echo "  --no-coverage   Skip coverage reporting"
  echo "  --help, -h      Show this help message"
  echo ""
  exit 0
fi

# Parse options
WATCH_MODE=false
SKIP_COVERAGE=false

for arg in "$@"; do
  case "$arg" in
  --watch)
    WATCH_MODE=true
    ;;
  --no-coverage)
    SKIP_COVERAGE=true
    ;;
  *)
    log_error "Unknown option: $arg"
    exit 1
    ;;
  esac
done

log_info "🧪 Running tests..."

# Change to project root
cd "$(git rev-parse --show-toplevel 2>/dev/null || echo ".")"

# Detect package manager (prefer bun, fall back to npm)
if command_exists bun; then
  PKG_RUN="bun run"
elif command_exists npm; then
  PKG_RUN="npm run"
else
  die "No package manager found! Install bun (https://bun.sh) or npm"
fi

# Run tests
if [ "$WATCH_MODE" = true ]; then
  log_info "Running tests in watch mode..."
  $PKG_RUN test -- --watch
elif [ "$SKIP_COVERAGE" = true ]; then
  log_info "Running tests without coverage..."
  $PKG_RUN test -- --run
else
  log_info "Running tests with coverage..."
  $PKG_RUN test

  # Display coverage summary if available
  if [ -f "coverage/coverage-summary.json" ]; then
    log_success "✅ Tests completed!"
    echo ""
    log_info "📊 Coverage Summary:"

    if command -v jq &>/dev/null; then
      echo ""
      jq -r '.total | "  Lines:      \(.lines.pct)%\n  Statements: \(.statements.pct)%\n  Functions:  \(.functions.pct)%\n  Branches:   \(.branches.pct)%"' coverage/coverage-summary.json
      echo ""

      # Check if coverage meets threshold
      COVERAGE_PCT=$(jq -r '.total.lines.pct' coverage/coverage-summary.json)
      if (($(echo "$COVERAGE_PCT >= 80" | bc -l 2>/dev/null || echo 0))); then
        log_success "✅ Coverage meets threshold (≥80%)"
      else
        log_warn "⚠️  Coverage below threshold (<80%)"
      fi
    else
      log_warn "jq not found; install jq to see formatted coverage summary"
      cat coverage/coverage-summary.json
    fi

    echo ""
    log_info "📁 View detailed HTML report: open coverage/index.html"
  else
    log_success "✅ Tests completed!"
  fi
fi
