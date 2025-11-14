#!/usr/bin/env bash
# Write content to GitHub Step Summary
# Usage: write-summary.sh <content>

set -euo pipefail

CONTENT="${1:?Content is required}"

echo -e "$CONTENT" >> "$GITHUB_STEP_SUMMARY"

