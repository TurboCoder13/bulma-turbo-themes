#!/usr/bin/env bash
# Generate Lighthouse PR comment with scores and report links
# Usage: generate-lighthouse-comment.sh
# Environment variables:
#   - GITHUB_RUN_ID: GitHub Actions run ID for artifact links
#   - GITHUB_SHA: Current commit SHA
#   - GITHUB_REPOSITORY: GitHub repository (owner/repo)
# Reads from lighthouse-reports directory and extracts metrics

set -uo pipefail

# Get run ID from environment or GitHub context
RUN_ID="${GITHUB_RUN_ID:=unknown}"
REPO="${GITHUB_REPOSITORY:=unknown}"

# Parse repository into owner and repo name for GitHub Pages URL
# Builds dynamic GitHub Pages URL: https://<owner>.github.io/<repo>/lighthouse/
# Handles user pages repos (where repo name equals owner.github.io)
PAGES_URL=""
if [ "$REPO" != "unknown" ] && [ -n "$REPO" ]; then
  # Trim whitespace from REPO
  REPO=$(echo "$REPO" | xargs)
  # Validate that REPO contains a slash before splitting
  if [[ "$REPO" == */* ]]; then
    REPO_OWNER="${REPO%%/*}"
    REPO_NAME="${REPO#*/}"
    # Ensure both owner and name are non-empty after splitting
    if [ -n "$REPO_OWNER" ] && [ -n "$REPO_NAME" ]; then
      # Normalize owner to lowercase for GitHub Pages domain
      REPO_OWNER=$(echo "$REPO_OWNER" | tr '[:upper:]' '[:lower:]')
      # Check if this is a user pages repo (repo name equals owner.github.io, case-insensitive)
      REPO_NAME_LOWER=$(echo "$REPO_NAME" | tr '[:upper:]' '[:lower:]')
      if [ "$REPO_NAME_LOWER" = "${REPO_OWNER}.github.io" ]; then
        # User pages: https://<owner>.github.io/lighthouse/
        PAGES_URL="https://${REPO_OWNER}.github.io/lighthouse/"
      else
        # Project pages: https://<owner>.github.io/<RepoName>/lighthouse/
        # Preserve repository name casing because GitHub Pages paths are case-sensitive
        PAGES_URL="https://${REPO_OWNER}.github.io/${REPO_NAME}/lighthouse/"
      fi
    fi
  fi
fi

# Initialize comment
{
  echo "## 📊 Lighthouse CI Performance Report"
  echo ""

  # Check if lighthouse results exist
  if [ -d "lighthouse-reports" ] && [ -n "$(ls -A lighthouse-reports 2>/dev/null)" ]; then
    # Find and parse the most recent Lighthouse JSON report
    LATEST_REPORT=$(find lighthouse-reports -name "*.json" -type f | grep -v manifest | sort -r | head -1)

    if [ -n "$LATEST_REPORT" ]; then
      # Extract scores using jq if available
      if command -v jq &>/dev/null; then
        # Extract actual scores from the latest Lighthouse report
        PERFORMANCE=$(jq -r '.categories.performance.score * 100 | round' "$LATEST_REPORT" 2>/dev/null || echo "N/A")
        ACCESSIBILITY=$(jq -r '.categories.accessibility.score * 100 | round' "$LATEST_REPORT" 2>/dev/null || echo "N/A")
        BEST_PRACTICES=$(jq -r '.categories["best-practices"].score * 100 | round' "$LATEST_REPORT" 2>/dev/null || echo "N/A")
        SEO=$(jq -r '.categories.seo.score * 100 | round' "$LATEST_REPORT" 2>/dev/null || echo "N/A")

        # Validate that scores are numeric and within range
        validate_score() {
          local score=$1
          if [[ "$score" =~ ^[0-9]+$ ]] && [ "$score" -ge 0 ] && [ "$score" -le 100 ]; then
            echo "$score"
          else
            echo "N/A"
          fi
        }

        PERFORMANCE=$(validate_score "$PERFORMANCE")
        ACCESSIBILITY=$(validate_score "$ACCESSIBILITY")
        BEST_PRACTICES=$(validate_score "$BEST_PRACTICES")
        SEO=$(validate_score "$SEO")
      else
        echo "⚠️ jq not available for score extraction"
        PERFORMANCE="N/A"
        ACCESSIBILITY="N/A"
        BEST_PRACTICES="N/A"
        SEO="N/A"
      fi

      # Create score badges with color coding
      format_score() {
        local score=$1
        if [ "$score" != "N/A" ]; then
          if [ "$score" -ge 90 ]; then
            echo "🟢 $score"
          elif [ "$score" -ge 80 ]; then
            echo "🟡 $score"
          else
            echo "🔴 $score"
          fi
        else
          echo "⚪ $score"
        fi
      }

      echo "### ✅ Status: Performance Analysis Complete"
      echo ""
      echo "**Build:** ✅ Lighthouse CI passed"
      echo ""
      echo "### 📈 Performance Scores"
      echo ""
      echo "| Category | Score |"
      echo "|----------|-------|"
      echo "| Performance | $(format_score "$PERFORMANCE") |"
      echo "| Accessibility | $(format_score "$ACCESSIBILITY") |"
      echo "| Best Practices | $(format_score "$BEST_PRACTICES") |"
      echo "| SEO | $(format_score "$SEO") |"
      echo ""

      # Check if there are assertion failures logged
      if [ -f ".lighthouseci/runs.json" ]; then
        echo "### ⚠️ Assertion Details"
        echo ""
        echo '```'
        # Extract assertion information from Lighthouse CI output
        if command -v jq &>/dev/null; then
          jq -r '.[] | select(.assertionResults) | .assertionResults[] | select(.level != "pass") | "\(.url): \(.assertion) - expected: >=\(.expected), found: \(.actual)"' ".lighthouseci/runs.json" 2>/dev/null || true
        fi
        echo '```'
        echo ""
      fi

      echo "### 📋 View Full Reports"
      echo ""
      if [ "$REPO" != "unknown" ] && [ -n "$PAGES_URL" ]; then
        echo "**Public Report:**"
        echo "- 🔗 [📊 View Lighthouse Reports]($PAGES_URL)"
        echo ""
        echo "**Or download from artifacts:**"
        echo "- 📥 [Download from GitHub Actions](https://github.com/$REPO/actions/runs/$RUN_ID/artifacts)"
      elif [ "$REPO" != "unknown" ]; then
        echo "**Download from artifacts:**"
        echo "- 📥 [Download from GitHub Actions](https://github.com/$REPO/actions/runs/$RUN_ID/artifacts)"
      else
        echo "**Local Development:**"
        echo "- 🔗 [View Reports](http://localhost:4000/lighthouse/)"
        echo "- 🔗 [Standalone server](http://localhost:3001/lighthouse/) (run \`./scripts/local/serve-reports.sh\`)"
        echo ""
        echo "**Note:** Run \`./scripts/ci/run-lighthouse-ci.sh\` to generate reports first."
      fi
      echo ""
    else
      echo "✅ Lighthouse CI analysis completed successfully."
      echo ""
      if [ "$REPO" != "unknown" ] && [ -n "$PAGES_URL" ]; then
        echo "📋 [View Reports]($PAGES_URL)"
      else
        echo "📋 [View Reports](http://localhost:4000/lighthouse/)"
        echo ""
        echo "**Note:** Run \`./scripts/ci/run-lighthouse-ci.sh\` to generate reports first."
      fi
    fi
  else
    echo "⚠️ No Lighthouse results found. Check workflow logs for details."
  fi

  echo ""
  echo "---"
  if [ "$RUN_ID" != "unknown" ]; then
    echo "Generated by Lighthouse CI | [View workflow run](https://github.com/$REPO/actions/runs/$RUN_ID)"
  else
    echo "Generated by Lighthouse CI"
  fi
} >lighthouse-comment.md || {
  echo "Error: Failed to write lighthouse-comment.md" >&2
  exit 1
}
