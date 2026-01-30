#!/usr/bin/env bash
# SPDX-License-Identifier: MIT
# Purpose: Generate Playwright E2E PR comment with test results and report links
#
# Usage: generate-playwright-comment.sh
#
# Environment variables:
#   - GITHUB_RUN_ID: GitHub Actions run ID for artifact links
#   - GITHUB_SHA: Current commit SHA
#   - GITHUB_REPOSITORY: GitHub repository (owner/repo) - REQUIRED for CI
#   - PLAYWRIGHT_REPORT_URL: Optional custom URL for Playwright HTML report
#     (defaults to https://{owner}.github.io/{repo}/playwright/ if not set)
#   - COMMENT_MARKER: Optional marker for PR comment (defaults to playwright-e2e-comment)
#   - COMMENT_FILE: Optional output file for comment (defaults to playwright-comment.md)
#
# Reads from playwright-report directory and extracts test results

set -euo pipefail

# Get run ID from environment or GitHub context
RUN_ID="${GITHUB_RUN_ID:=unknown}"
COMMIT_SHA="${GITHUB_SHA:=unknown}"
COMMENT_MARKER="${COMMENT_MARKER:=playwright-e2e-comment}"
COMMENT_FILE="${COMMENT_FILE:=playwright-comment.md}"

# Validate and set repository from environment variable
# Use GITHUB_REPOSITORY if available, otherwise fall back to unknown for local dev
if [ -z "${GITHUB_REPOSITORY:-}" ]; then
  REPO="unknown"
  if [ -n "${CI:-}" ]; then
    echo "Warning: GITHUB_REPOSITORY environment variable is not set in CI environment" >&2
  fi
else
  REPO="$GITHUB_REPOSITORY"
fi

# Determine Playwright report URL
# Prefer PLAYWRIGHT_REPORT_URL env var, otherwise generate from REPO
if [ -n "${PLAYWRIGHT_REPORT_URL:-}" ]; then
  PAGES_URL="$PLAYWRIGHT_REPORT_URL"
elif [ -n "$REPO" ] && [ "$REPO" != "unknown" ]; then
  # Parse repository into owner and repo name for GitHub Pages URL
  REPO_OWNER=$(echo "$REPO" | cut -d'/' -f1)
  REPO_NAME=$(echo "$REPO" | cut -d'/' -f2)
  # Validate that we successfully parsed owner and repo name
  if [ -z "$REPO_OWNER" ] || [ -z "$REPO_NAME" ]; then
    echo "Error: Failed to parse repository owner/name from GITHUB_REPOSITORY: $REPO" >&2
    REPO="unknown"
    PAGES_URL=""
  else
    PAGES_URL="https://${REPO_OWNER}.github.io/${REPO_NAME}/playwright/"
  fi
else
  PAGES_URL=""
fi

# Initialize comment
{
  echo "## 🎭 Playwright E2E Test Report"
  echo ""

  # Centralized artifact detection: check for playwright-report directory and files
  # Use find to both test directory presence and detect matching artifacts
  # Short-circuit with -print -quit to efficiently check existence
  HAS_PLAYWRIGHT_REPORT=0
  if [ -n "$(find playwright-report -maxdepth 1 -type f \( -name "*.html" -o -name "*.json" \) -print -quit 2>/dev/null)" ] || [ -f "playwright-report/index.html" ]; then
    HAS_PLAYWRIGHT_REPORT=1
  fi

  # Centralized test-results artifact detection
  # Short-circuit check: if directory exists and contains artifacts, then count all
  TEST_ARTIFACT_COUNT=0
  HAS_TEST_RESULTS=0
  if [ -n "$(find test-results -maxdepth 1 -type f \( -name "*.png" -o -name "*.webm" \) -print -quit 2>/dev/null)" ]; then
    # Directory exists and has artifacts; count all artifacts (not just maxdepth 1)
    TEST_ARTIFACT_COUNT=$(find test-results -type f \( -name "*.png" -o -name "*.webm" \) 2>/dev/null | wc -l | tr -d ' ')
    if [ "$TEST_ARTIFACT_COUNT" -gt 0 ]; then
      HAS_TEST_RESULTS=1
    fi
  fi

  # Check if playwright report exists
  if [ "$HAS_PLAYWRIGHT_REPORT" -eq 1 ]; then
    # Try to extract test results from playwright report
    if [ -f "playwright-report/index.html" ]; then
      # Parse basic test statistics from the HTML report if possible
      # This is a simple approach - could be enhanced with JSON results

      echo "### ✅ Test Execution Completed"
      echo ""

      if [ "$HAS_TEST_RESULTS" -eq 1 ]; then
        echo "📸 **Test artifacts**: $TEST_ARTIFACT_COUNT screenshots/videos captured"
        echo ""
      fi

      echo "### 📋 View Full Reports"
      echo ""

      if [ -n "$REPO" ] && [ "$REPO" != "unknown" ]; then
        echo "**Public Report (after merge to main):**"
        echo "- 🔗 [📊 View Playwright HTML Report](${PAGES_URL})"
        echo ""
        echo "**Or download from artifacts:**"
        WORKFLOW_URL="https://github.com/${REPO}/actions/runs/${RUN_ID}/artifacts"
        echo "- 📥 [Download Playwright Report](${WORKFLOW_URL})"
        if [ "$HAS_TEST_RESULTS" -eq 1 ]; then
          echo "- 📥 [Download Test Results (screenshots/videos)](${WORKFLOW_URL})"
        fi
      else
        echo "**Local Development:**"
        echo "- 🔗 [View Report](http://localhost:4000/playwright/)"
        echo "- 🔗 [Standalone server](http://localhost:9323) (run \`./scripts/local/serve-reports.sh\`)"
        echo ""
        echo "**Note:** If Jekyll server is running, the report is already available."
      fi
      echo ""

    else
      echo "⚠️ No Playwright HTML report found, but report directory exists."
      echo ""
    fi
  else
    echo "⚠️ No Playwright results found. Check workflow logs for details."
    echo ""
    if [ -n "$REPO" ] && [ "$REPO" != "unknown" ]; then
      if [ "$RUN_ID" != "unknown" ]; then
        WORKFLOW_RUN_URL="https://github.com/${REPO}/actions/runs/${RUN_ID}"
        echo "- 📥 [View workflow run](${WORKFLOW_RUN_URL})"
      fi
    else
      echo "- View workflow logs in GitHub Actions"
    fi
  fi

  echo ""
  echo "---"
  if [ "$RUN_ID" != "unknown" ] && [ -n "$REPO" ] && [ "$REPO" != "unknown" ]; then
    WORKFLOW_RUN_URL="https://github.com/${REPO}/actions/runs/${RUN_ID}"
    echo "*Generated by Playwright E2E Tests* | [View workflow run](${WORKFLOW_RUN_URL})"
  else
    echo "*Generated by Playwright E2E Tests (Local)*"
  fi
  echo ""
  echo "<!-- ${COMMENT_MARKER} -->"
} >"$COMMENT_FILE"
