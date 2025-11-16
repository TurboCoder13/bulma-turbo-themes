#!/usr/bin/env bash
# Download test report artifacts from all 3 test workflows for a given commit SHA
# Usage: download-test-artifacts.sh [COMMIT_SHA]
# - COMMIT_SHA: Git commit SHA to find workflows for (default: current HEAD)
#
# Downloads artifacts from:
# - Quality Check - CI Pipeline → coverage-html
# - Quality Check - E2E Tests → playwright-report
# - Reporting - Lighthouse CI → lighthouse-reports
#
# Environment Variables:
#   GITHUB_REPOSITORY: GitHub repository in owner/repo format
#   GITHUB_TOKEN: GitHub token for API access (if not using gh CLI auth)

set -euo pipefail

readonly COMMIT_SHA="${1:-$(git rev-parse HEAD 2>/dev/null || echo '')}"
readonly MAX_RUNS=10

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

log_error() {
  echo "❌ $*" >&2
}

# Check if gh CLI is available
if ! command -v gh >/dev/null 2>&1; then
  log_error "GitHub CLI (gh) is required but not installed"
  exit 1
fi

# Check if GITHUB_REPOSITORY is set
if [ -z "${GITHUB_REPOSITORY:-}" ]; then
  log_error "GITHUB_REPOSITORY environment variable is not set"
  exit 1
fi

# Authenticate gh CLI if GITHUB_TOKEN is provided
if [ -n "${GITHUB_TOKEN:-}" ]; then
  echo "${GITHUB_TOKEN}" | gh auth login --with-token 2>/dev/null || true
fi

if [ -z "${COMMIT_SHA}" ]; then
  log_error "Commit SHA is required"
  exit 1
fi

log_info "Downloading test artifacts for commit: ${COMMIT_SHA}"

# Function to find workflow run by name and commit SHA
find_workflow_run() {
  local workflow_name="$1"
  local commit_sha="$2"
  
  # Use head_sha query parameter for efficient filtering (avoids pagination issues)
  gh api "repos/${GITHUB_REPOSITORY}/actions/runs?head_sha=${commit_sha}&per_page=100" \
    --jq ".workflow_runs[] | select(.name == \"${workflow_name}\" and .conclusion == \"success\") | .id" \
    | head -1
}

# Function to get artifact ID from a workflow run
get_artifact_id() {
  local run_id="$1"
  local artifact_name="$2"
  
  if [ -z "${run_id}" ]; then
    echo ""
    return
  fi
  
  gh api repos/"${GITHUB_REPOSITORY}"/actions/runs/"${run_id}"/artifacts \
    --jq ".artifacts[] | select(.name == \"${artifact_name}\") | .id" 2>/dev/null || echo ""
}

# Function to download artifact by ID
download_artifact() {
  local artifact_id="$1"
  local dest_dir="$2"
  local temp_zip="${dest_dir}.zip"
  
  if [ -z "${artifact_id}" ]; then
    return 1
  fi
  
  log_info "Downloading artifact ${artifact_id} to ${dest_dir}..."
  
  gh api repos/"${GITHUB_REPOSITORY}"/actions/artifacts/"${artifact_id}"/zip \
    > "${temp_zip}"
  
  mkdir -p "${dest_dir}"
  unzip -o -q "${temp_zip}" -d "${dest_dir}/" || true
  rm -f "${temp_zip}"
  
  return 0
}

# Download coverage reports
download_coverage() {
  log_info "Looking for coverage reports..."
  local run_id
  run_id=$(find_workflow_run "Quality Check - CI Pipeline" "${COMMIT_SHA}")
  
  if [ -z "${run_id}" ]; then
    log_warning "No successful Quality Check - CI Pipeline run found for commit ${COMMIT_SHA}"
    return 0
  fi
  
  log_info "Found CI Pipeline run: ${run_id}"
  local artifact_id
  artifact_id=$(get_artifact_id "${run_id}" "coverage-html")
  
  if [ -z "${artifact_id}" ]; then
    log_warning "No coverage-html artifact found in run ${run_id}"
    return 0
  fi
  
  if download_artifact "${artifact_id}" "coverage"; then
    log_success "Coverage reports downloaded"
  else
    log_warning "Failed to download coverage reports"
  fi
}

# Download Playwright reports
download_playwright() {
  log_info "Looking for Playwright reports..."
  local run_id
  run_id=$(find_workflow_run "Quality Check - E2E Tests" "${COMMIT_SHA}")
  
  if [ -z "${run_id}" ]; then
    log_warning "No successful Quality Check - E2E Tests run found for commit ${COMMIT_SHA}"
    return 0
  fi
  
  log_info "Found E2E Tests run: ${run_id}"
  local artifact_id
  artifact_id=$(get_artifact_id "${run_id}" "playwright-report")
  
  if [ -z "${artifact_id}" ]; then
    log_warning "No playwright-report artifact found in run ${run_id}"
    return 0
  fi
  
  if download_artifact "${artifact_id}" "playwright-report"; then
    log_success "Playwright reports downloaded"
  else
    log_warning "Failed to download Playwright reports"
  fi
}

# Download Lighthouse reports
download_lighthouse() {
  log_info "Looking for Lighthouse reports..."
  local run_id
  run_id=$(find_workflow_run "Reporting - Lighthouse CI" "${COMMIT_SHA}")
  
  if [ -z "${run_id}" ]; then
    log_warning "No successful Reporting - Lighthouse CI run found for commit ${COMMIT_SHA}"
    return 0
  fi
  
  log_info "Found Lighthouse CI run: ${run_id}"
  local artifact_id
  artifact_id=$(get_artifact_id "${run_id}" "lighthouse-reports")
  
  if [ -z "${artifact_id}" ]; then
    log_warning "No lighthouse-reports artifact found in run ${run_id}"
    return 0
  fi
  
  if download_artifact "${artifact_id}" "lighthouse-reports"; then
    log_success "Lighthouse reports downloaded"
  else
    log_warning "Failed to download Lighthouse reports"
  fi
}

# Copy reports into _site directory
copy_reports_to_site() {
  log_info "Copying reports into _site directory..."
  
  # Coverage
  if [ -d "coverage" ] && [ -n "$(ls -A coverage 2>/dev/null)" ]; then
    log_info "Copying coverage reports..."
    mkdir -p _site/coverage
    cp -r coverage/* _site/coverage/ || true
    log_success "Coverage reports copied to _site/coverage/"
  fi
  
  # Playwright (needs to be copied to playwright/ via simplify_urls.rb pattern)
  if [ -d "playwright-report" ] && [ -n "$(ls -A playwright-report 2>/dev/null)" ]; then
    log_info "Copying Playwright reports..."
    mkdir -p _site/playwright
    cp -r playwright-report/* _site/playwright/ || true
    log_success "Playwright reports copied to _site/playwright/"
  fi
  
  # Lighthouse
  if [ -d "lighthouse-reports" ] && [ -n "$(ls -A lighthouse-reports 2>/dev/null)" ]; then
    log_info "Copying Lighthouse reports..."
    mkdir -p _site/lighthouse
    cp -r lighthouse-reports/* _site/lighthouse/ || true
    log_success "Lighthouse reports copied to _site/lighthouse/"
  fi
}

# Main execution
main() {
  log_info "Starting artifact download for commit ${COMMIT_SHA}"
  
  download_coverage
  download_playwright
  download_lighthouse
  
  copy_reports_to_site
  
  log_success "Artifact download completed"
}

main "$@"

