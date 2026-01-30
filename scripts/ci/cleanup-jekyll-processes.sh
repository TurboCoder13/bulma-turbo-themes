#!/bin/bash

# Clean up Jekyll processes and ensure port 4000 is free
# Usage: cleanup-jekyll-processes.sh
# This script must not interfere with GitHub Actions execution
# Improved robustness: handles signals, timeouts, and command failures gracefully

# Allow script to continue even if individual commands fail
set +e
# Exit on undefined variables and pipe failures (but continue on individual command failures due to set +e)
set -o pipefail 2>/dev/null || true

# Script state
CLEANUP_COMPLETE=0

# Signal handler for graceful shutdown
cleanup_on_signal() {
  local signal=$1
  echo "⚠️ Received signal $signal during cleanup"
  CLEANUP_COMPLETE=1
  # Continue with the script - don't exit abruptly
}

# Set up signal handlers
trap 'cleanup_on_signal SIGTERM' SIGTERM
trap 'cleanup_on_signal SIGINT' SIGINT

echo "🧹 Cleaning up Jekyll processes..."

# Function to safely kill processes
safe_kill_processes() {
  local pattern=$1
  local description=$2

  # Use pgrep with timeout and basic error handling
  if command -v pgrep &>/dev/null; then
    local pids
    # Exclude this script's PID ($$) to avoid killing ourselves
    pids=$(pgrep -f "$pattern" 2>/dev/null | grep -v "^$$" 2>/dev/null || true)

    if [ -n "$pids" ]; then
      echo "  Killing $description processes: $pids"
      echo "$pids" | xargs -r timeout 2 kill -9 2>/dev/null || true
    fi
  fi
}

# Kill Jekyll processes (more aggressive)
safe_kill_processes "jekyll" "Jekyll"
# Also kill any processes containing "serve" that might be Jekyll
safe_kill_processes "serve.*port.*4000" "Jekyll serve on port 4000"

# Wait for cleanup to take effect
sleep 1

# Function to free port
free_port() {
  local port=$1

  # Try ss first (modern and preferred)
  if command -v ss &>/dev/null; then
    echo "  Using ss to check port $port..."
    # Use timeout to prevent hanging
    local pids
    pids=$(timeout 3 ss -tlnp 2>/dev/null | grep ":$port " 2>/dev/null | awk '{print $NF}' | cut -d'=' -f2 | sort -u || true)

    if [ -n "$pids" ]; then
      echo "  Killing processes using port $port: $pids"
      echo "$pids" | xargs -r timeout 2 kill -9 2>/dev/null || true
    fi
  # Fallback to lsof
  elif command -v lsof &>/dev/null; then
    echo "  Using lsof to check port $port..."
    local pids
    pids=$(timeout 3 lsof -ti:"$port" 2>/dev/null || true)

    if [ -n "$pids" ]; then
      echo "  Killing processes using port $port: $pids"
      echo "$pids" | xargs -r timeout 2 kill -9 2>/dev/null || true
    fi
  else
    echo "  Warning: Neither ss nor lsof available for port cleanup"
  fi
}

# Free port 4000
free_port 4000

# Extra aggressive cleanup - try to kill any remaining processes on port 4000
if command -v lsof &>/dev/null; then
  pids=$(lsof -ti:4000 2>/dev/null || true)
  if [ -n "$pids" ]; then
    echo "  Extra cleanup: Killing remaining processes on port 4000: $pids"
    echo "$pids" | xargs -r kill -9 2>/dev/null || true
    sleep 1
  fi
fi

# Wait for processes to fully terminate
sleep 2

# Verify cleanup success (non-blocking verification)
verify_port_free() {
  local port=$1
  local max_attempts=2
  local attempt=0

  while [ $attempt -lt $max_attempts ]; do
    if command -v lsof &>/dev/null; then
      if ! timeout 2 lsof -ti:"$port" >/dev/null 2>&1; then
        # Port is free
        return 0
      fi
    elif command -v ss &>/dev/null; then
      if ! timeout 2 ss -tlnp 2>/dev/null | grep -q ":$port "; then
        # Port is free
        return 0
      fi
    else
      # Can't verify, assume it's fine
      return 0
    fi

    attempt=$((attempt + 1))
    if [ $attempt -lt $max_attempts ]; then
      echo "  Port $port still in use, retrying cleanup..."
      sleep 1
    fi
  done

  # If we get here, port might still be in use but we're not failing
  echo "⚠️ Port $port status could not be fully verified, but continuing anyway"
  return 0
}

verify_port_free 4000

echo "✅ Cleanup complete - ready to start Jekyll"

# Exit with success to avoid blocking the workflow
exit 0
