#!/usr/bin/env bash
# Generate version PR workflow summary
# Uses environment variables:
# - PR_EXISTS: Whether version PR already exists (true/false)
# - PR_NUMBER: The PR number if it exists

set -euo pipefail

{
  echo "## Release Version PR Status"

  if [ "${PR_EXISTS:-false}" = "true" ]; then
    echo "ℹ️ Version PR already exists: #${PR_NUMBER:-unknown}"
  else
    echo "✅ Version PR creation attempted"
    echo "📋 Check the logs above for details"
  fi
} >>"$GITHUB_STEP_SUMMARY"

echo "✅ Version PR summary generated"
