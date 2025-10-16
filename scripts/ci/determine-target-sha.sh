#!/bin/bash
# Determine target SHA for internal reference updates
# Usage: determine-target-sha.sh
# Environment variables:
#   - EVENT_NAME: GitHub event name (workflow_dispatch or push)
#   - INPUT_SHA: Provided SHA from workflow_dispatch input
#   - GITHUB_SHA: Current commit SHA from GitHub Actions

set -euo pipefail

if [ "${EVENT_NAME}" == "workflow_dispatch" ]; then
  if [ -z "${INPUT_SHA:-}" ]; then
    echo "Error: INPUT_SHA is required for workflow_dispatch" >&2
    exit 1
  fi
  echo "sha=${INPUT_SHA}" >> "$GITHUB_OUTPUT"
else
  if [ -z "${GITHUB_SHA:-}" ]; then
    echo "Error: GITHUB_SHA is not set" >&2
    exit 1
  fi
  echo "sha=${GITHUB_SHA}" >> "$GITHUB_OUTPUT"
fi
