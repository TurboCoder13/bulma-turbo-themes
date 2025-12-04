#!/usr/bin/env bash
# SPDX-License-Identifier: MIT
# Purpose: Serve test reports locally for development
#
# This script starts servers to view generated test reports:
# - Playwright HTML Report: http://localhost:9323
# - Lighthouse Reports (if generated): http://localhost:3001
#
# Usage: ./scripts/local/serve-reports.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

cd "$REPO_ROOT"

echo "📊 Test Report Servers"
echo "====================="
echo ""

# Check for Playwright report
if [ -d "playwright-report" ] || [ -L "playwright-report" ] || [ -d "playwright" ] || [ -L "playwright" ]; then
  echo "✅ Playwright HTML Report found"
  echo "   📍 View at: http://localhost:9323"
  echo ""
else
  echo "⚠️  Playwright HTML Report not found"
  echo "   Run: bun run e2e (or npm run e2e)"
  echo ""
fi

# Check for Lighthouse reports
if [ -d "lighthouse-reports" ] || [ -L "lighthouse-reports" ] || [ -d "lighthouse" ] || [ -L "lighthouse" ]; then
  echo "✅ Lighthouse Reports found"
  echo "   📍 View at: http://localhost:3001"
  echo ""
else
  echo "⚠️  Lighthouse Reports not found"
  echo "   Run: ./scripts/ci/run-lighthouse-ci.sh"
  echo ""
fi

echo "Starting report servers..."
echo ""

# Detect package executor (prefer bunx, fall back to npx)
if command -v bunx &> /dev/null; then
  PKG_EXEC="bunx --bun"
elif command -v npx &> /dev/null; then
  PKG_EXEC="npx --yes"
else
  echo "❌ Error: No package executor found"
  echo "   Please install Bun (https://bun.sh) or Node.js/npm"
  exit 1
fi

# Function to check if a port is free
# Return semantics:
#   Returns 0 when a listener/port is found (port is in use)
#   Returns 1 when no listener is found (port is free)
check_port() {
  local port=$1
  if command -v lsof &> /dev/null; then
    lsof -i ":$port" &> /dev/null
  elif command -v nc &> /dev/null; then
    nc -z localhost "$port" &> /dev/null
  elif command -v ss &> /dev/null; then
    ss -lntu | grep -q ":$port " &> /dev/null
  else
    # No port checking tools available; assume port is free (return 1) to proceed on minimal systems without port checking tools.
    return 1
  fi
}

# Helper function to validate and resolve a single path
# Usage: validate_and_resolve_path <path>
# Returns: 0 if path is valid and resolved, 1 otherwise
# Outputs: resolved path on success
validate_and_resolve_path() {
  local path=$1
  local resolved_path=""
  
  # Check if path exists (directory or symlink)
  if [ ! -d "$path" ] && [ ! -L "$path" ]; then
    return 1
  fi
  
  # If it's a symlink, resolve it
  if [ -L "$path" ]; then
    if command -v realpath &> /dev/null; then
      resolved_path=$(realpath "$path" 2>/dev/null || echo "")
    else
      resolved_path=$(readlink "$path" 2>/dev/null || echo "")
    fi
    
    # Validate resolved path is a directory and non-empty
    if [ -n "$resolved_path" ] && [ -d "$resolved_path" ] && [ -n "$(ls -A "$resolved_path" 2>/dev/null)" ]; then
      echo "$resolved_path"
      return 0
    fi
  else
    # It's a regular directory, validate it's non-empty
    if [ -n "$(ls -A "$path" 2>/dev/null)" ]; then
      echo "$path"
      return 0
    fi
  fi
  
  return 1
}

# Function to resolve report path portably (handles both symlinks and directories)
# Usage: resolve_report_path <primary_path> <secondary_path> <fallback>
# Returns: existing directory/symlink path or fallback
resolve_report_path() {
  local primary=$1
  local secondary=$2
  local fallback=$3
  local resolved_path=""
  
  # Try primary path first
  if resolved_path=$(validate_and_resolve_path "$primary"); then
    echo "$resolved_path"
    return 0
  fi
  
  # Try secondary path if primary didn't work
  if resolved_path=$(validate_and_resolve_path "$secondary"); then
    echo "$resolved_path"
    return 0
  fi
  
  # Return fallback if resolution failed
  echo "$fallback"
  return 0
}

# Function to start a server with verification
start_server() {
  local name=$1
  local port=$2
  local path=$3
  local log_file="$REPO_ROOT/.${name}-server.log"
  
  # Validate path before attempting to start server
  if [ ! -d "$path" ]; then
    echo "❌ Error: $name path is invalid or empty: $path"
    return 1
  fi
  
  # Ensure path is readable and not empty
  if ! ls -A "$path" >/dev/null 2>&1; then
    echo "❌ Error: $name path is invalid or empty: $path"
    return 1
  fi
  
  # Check if port is already in use
  if check_port "$port"; then
    echo "❌ Error: Port $port is already in use"
    echo "   Please stop the service using port $port or choose a different port"
    return 1
  fi
  
  # Start server and redirect output to log file
  $PKG_EXEC http-server "$path" -p "$port" -a 127.0.0.1 -c-1 > "$log_file" 2>&1 &
  local server_pid=$!
  
  # Wait briefly for server to start
  sleep 2
  
  # Verify server is running and listening on the port
  if ! kill -0 "$server_pid" 2>/dev/null; then
    echo "❌ Error: $name server failed to start (PID: $server_pid)"
    echo "   Check log file: $log_file"
    return 1
  fi
  
  # Verify port is now in use (server is listening)
  if ! check_port "$port"; then
    echo "❌ Error: $name server started but is not listening on port $port"
    echo "   Check log file: $log_file"
    # Still output PID for potential cleanup, but return failure
    echo "$server_pid"
    return 1
  fi
  
  echo "$server_pid"
  return 0
}

# Start Playwright report server
if [ -d "playwright-report" ] || [ -L "playwright-report" ] || [ -d "playwright" ] || [ -L "playwright" ]; then
  SERVER_PATH=$(resolve_report_path "playwright-report" "playwright" "playwright-report")
  
  PW_PID=$(start_server "playwright" 9323 "$SERVER_PATH")
  start_exit_code=$?
  if [ $start_exit_code -eq 0 ] && [ -n "$PW_PID" ]; then
    echo "✅ Playwright server started (PID: $PW_PID)"
  else
    echo "❌ Failed to start Playwright server"
    # PID may still be set for cleanup even if start failed (e.g., process running but not listening)
  fi
fi

# Start Lighthouse report server
if [ -d "lighthouse-reports" ] || [ -L "lighthouse-reports" ] || [ -d "lighthouse" ] || [ -L "lighthouse" ]; then
  SERVER_PATH=$(resolve_report_path "lighthouse-reports" "lighthouse" "lighthouse-reports")
  
  LH_PID=$(start_server "lighthouse" 3001 "$SERVER_PATH")
  start_exit_code=$?
  if [ $start_exit_code -eq 0 ] && [ -n "$LH_PID" ]; then
    echo "✅ Lighthouse server started (PID: $LH_PID)"
  else
    echo "❌ Failed to start Lighthouse server"
    # PID may still be set for cleanup even if start failed (e.g., process running but not listening)
  fi
fi

# Validate that at least one server started successfully
if { [ -z "${PW_PID:-}" ] || [ "$PW_PID" = "" ] || [ "$PW_PID" = "0" ]; } && \
   { [ -z "${LH_PID:-}" ] || [ "$LH_PID" = "" ] || [ "$LH_PID" = "0" ]; }; then
  echo ""
  echo "❌ Error: No servers started successfully"
  echo "   Please ensure at least one report directory exists and is accessible"
  exit 1
fi

# Cleanup function to kill background servers
cleanup() {
  echo ""
  echo "🛑 Stopping servers..."
  
  if [ -n "${PW_PID:-}" ] && [ "$PW_PID" != "" ]; then
    if kill -0 "$PW_PID" 2>/dev/null; then
      echo "   Stopping Playwright server (PID: $PW_PID)..."
      kill -TERM "$PW_PID" 2>/dev/null || true
      sleep 1
      if kill -0 "$PW_PID" 2>/dev/null; then
        kill -KILL "$PW_PID" 2>/dev/null || true
      fi
      wait "$PW_PID" 2>/dev/null || true
    fi
  fi
  
  if [ -n "${LH_PID:-}" ] && [ "$LH_PID" != "" ]; then
    if kill -0 "$LH_PID" 2>/dev/null; then
      echo "   Stopping Lighthouse server (PID: $LH_PID)..."
      kill -TERM "$LH_PID" 2>/dev/null || true
      sleep 1
      if kill -0 "$LH_PID" 2>/dev/null; then
        kill -KILL "$LH_PID" 2>/dev/null || true
      fi
      wait "$LH_PID" 2>/dev/null || true
    fi
  fi
  
  echo "✅ All servers stopped"
  exit 0
}

# Register cleanup handlers
trap cleanup EXIT INT TERM

echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Wait for interrupt
wait
