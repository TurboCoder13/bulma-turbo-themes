#!/usr/bin/env bash
# Parse link check results and set output status
# Usage: parse-link-check-results.sh [output-file]

set -euo pipefail

OUTPUT_FILE="${1:-link-check-output.txt}"

if [ ! -f "$OUTPUT_FILE" ]; then
  echo "Error: Output file not found: $OUTPUT_FILE" >&2
  exit 1
fi

set_github_output() {
  if [[ -n "${GITHUB_OUTPUT:-}" ]]; then
    echo "$1" >> "$GITHUB_OUTPUT"
  fi
}

if grep -q "HTML-Proofer finished successfully" "$OUTPUT_FILE"; then
  set_github_output "status=success"
  echo "✅ External links validated successfully"
else
  set_github_output "status=warning"
  echo "⚠️ Some external links may have issues (see full log)"
fi

