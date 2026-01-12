#!/usr/bin/env bash
set -euo pipefail

# Download Lighthouse reports from recent CI runs
# This script queries the GitHub API to find recent successful Lighthouse CI runs
# and downloads their artifacts to the lighthouse-reports directory.
#
# Environment Variables:
#   GITHUB_REPOSITORY: GitHub repository in owner/repo format
#
# Exit codes:
#   0: Success (reports found or gracefully skipped)
#   1: Error during execution

readonly REPORTS_DIR="lighthouse-reports"
readonly TEMP_ZIP="lighthouse-reports.zip"
readonly MAX_RUNS=5

# Helper function for logging
log_info() {
  echo "ℹ️  $*"
}

log_success() {
  echo "✓ $*"
}

log_warning() {
  echo "⚠️  $*"
}

# Query for recent successful Lighthouse CI workflow runs
query_recent_runs() {
  gh api repos/"${GITHUB_REPOSITORY}"/actions/runs \
    --jq ".workflow_runs[] | select(.name == \"Reporting - Lighthouse CI\" and .conclusion == \"success\") | .id" \
    | head -"${MAX_RUNS}"
}

# Check if artifacts exist for a given run
check_artifacts_for_run() {
  local run_id=$1
  gh api repos/"${GITHUB_REPOSITORY}"/actions/runs/"${run_id}"/artifacts \
    --jq ".artifacts[] | select(.name == \"lighthouse-reports\") | .id" 2>/dev/null || echo ""
}

# Download artifacts from a specific artifact ID
download_artifacts() {
  local artifact_id=$1
  
  gh api repos/"${GITHUB_REPOSITORY}"/actions/artifacts/"${artifact_id}"/zip \
    > "${TEMP_ZIP}"
  
  unzip -o -q "${TEMP_ZIP}" -d "${REPORTS_DIR}/" || true
  rm -f "${TEMP_ZIP}"
}

# Main logic
main() {
  log_info "Checking for Lighthouse reports..."
  
  local recent_runs
  recent_runs=$(query_recent_runs)
  
  if [ -z "${recent_runs}" ]; then
    log_warning "No recent Lighthouse CI runs found"
    return 0
  fi
  
  while IFS= read -r run_id; do
    [ -z "${run_id}" ] && continue
    
    log_info "Checking run ${run_id}..."
    
    local artifact_id
    artifact_id=$(check_artifacts_for_run "${run_id}")
    
    if [ -n "${artifact_id}" ]; then
      log_success "Found Lighthouse reports in run ${run_id} (artifact ${artifact_id})"
      download_artifacts "${artifact_id}"
      break
    fi
  done <<< "${recent_runs}"
  
  # Copy reports to site if they exist
  if [ -d "${REPORTS_DIR}" ] && [ -n "$(ls -A "${REPORTS_DIR}" 2>/dev/null)" ]; then
    log_success "Including Lighthouse reports in site deployment"
    mkdir -p apps/site/dist/lighthouse-reports/
    cp -r "${REPORTS_DIR}"/* apps/site/dist/lighthouse-reports/
    ls -la apps/site/dist/lighthouse-reports/
  else
    log_warning "No Lighthouse reports found, skipping"
  fi
}

main "$@"
