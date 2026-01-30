#!/usr/bin/env bash
# Install Node.js dependencies with Bun, with retry logic for transient failures.
#
# This script wraps `bun install --frozen-lockfile` with exponential backoff
# retry logic to handle transient npm registry failures (HTTP 500 errors,
# connection timeouts, etc.).
#
# Configuration:
#   MAX_RETRIES: Maximum number of retry attempts (default: 3)
#   INITIAL_DELAY: Initial delay in seconds before first retry (default: 5)
#   BACKOFF_MULTIPLIER: Multiplier for exponential backoff (default: 2)

set -euo pipefail

MAX_RETRIES="${MAX_RETRIES:-3}"
INITIAL_DELAY="${INITIAL_DELAY:-5}"
BACKOFF_MULTIPLIER="${BACKOFF_MULTIPLIER:-2}"

attempt=1
delay="${INITIAL_DELAY}"

echo "📦 Installing Node.js dependencies with Bun..."

while true; do
  if bun install --frozen-lockfile; then
    echo "✅ Dependencies installed successfully"
    exit 0
  fi

  if [[ ${attempt} -ge ${MAX_RETRIES} ]]; then
    echo "❌ Failed to install dependencies after ${MAX_RETRIES} attempts"
    exit 1
  fi

  echo "⚠️  Attempt ${attempt}/${MAX_RETRIES} failed. Retrying in ${delay}s..."
  sleep "${delay}"

  attempt=$((attempt + 1))
  delay=$((delay * BACKOFF_MULTIPLIER))
done
