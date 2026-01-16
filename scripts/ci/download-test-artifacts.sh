#!/usr/bin/env bash
# Download test report artifacts from all test workflows for a given commit SHA
# Usage: download-test-artifacts.sh [COMMIT_SHA]
# - COMMIT_SHA: Git commit SHA to find workflows for (default: current HEAD)
#
# Downloads artifacts from:
# - Quality Check - CI Pipeline → coverage-html
# - Quality Check - E2E Tests → playwright-report
# - Reporting - Lighthouse CI → lighthouse-reports
# - Quality Check - Examples → examples-playwright-report
# - Quality Check - Multi-Language Coverage → coverage-python-html, coverage-ruby-html, coverage-swift-html
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
# Args: workflow_name, commit_sha, [require_success]
# If require_success is "false", includes runs with conclusion "success" or "failure" (excludes cancelled)
find_workflow_run() {
  local workflow_name="$1"
  local commit_sha="$2"
  local require_success="${3:-true}"

  local jq_filter
  if [ "${require_success}" = "false" ]; then
    # Include both success and failure (artifacts upload with if: always())
    jq_filter=".workflow_runs[] | select(.name == \"${workflow_name}\" and (.conclusion == \"success\" or .conclusion == \"failure\")) | .id"
  else
    jq_filter=".workflow_runs[] | select(.name == \"${workflow_name}\" and .conclusion == \"success\") | .id"
  fi

  # Use head_sha query parameter for efficient filtering (avoids pagination issues)
  gh api "repos/${GITHUB_REPOSITORY}/actions/runs?head_sha=${commit_sha}&per_page=100" \
    --jq "${jq_filter}" \
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

# Download Examples Playwright reports
download_examples_playwright() {
  log_info "Looking for Examples Playwright reports..."
  local run_id
  run_id=$(find_workflow_run "Quality Check - Examples" "${COMMIT_SHA}")

  if [ -z "${run_id}" ]; then
    log_warning "No successful Quality Check - Examples run found for commit ${COMMIT_SHA}"
    return 0
  fi

  log_info "Found Examples run: ${run_id}"
  local artifact_id
  artifact_id=$(get_artifact_id "${run_id}" "examples-playwright-report")

  if [ -z "${artifact_id}" ]; then
    log_warning "No examples-playwright-report artifact found in run ${run_id}"
    return 0
  fi

  if download_artifact "${artifact_id}" "examples-playwright-report"; then
    log_success "Examples Playwright reports downloaded"
  else
    log_warning "Failed to download Examples Playwright reports"
  fi
}

# Download multi-language coverage reports (Python, Ruby, Swift)
# Note: Uses require_success=false since artifacts upload with if: always()
download_multi_language_coverage() {
  log_info "Looking for multi-language coverage reports..."
  local run_id
  # Allow failed runs since coverage artifacts upload with if: always()
  run_id=$(find_workflow_run "Quality Check - Multi-Language Coverage" "${COMMIT_SHA}" "false")

  if [ -z "${run_id}" ]; then
    log_warning "No Quality Check - Multi-Language Coverage run found for commit ${COMMIT_SHA}"
    return 0
  fi

  log_info "Found Multi-Language Coverage run: ${run_id}"

  # Download each language's coverage artifact
  local languages=("python" "ruby" "swift")
  for lang in "${languages[@]}"; do
    local artifact_name="coverage-${lang}-html"
    local dest_dir="coverage-${lang}-html"
    local artifact_id
    artifact_id=$(get_artifact_id "${run_id}" "${artifact_name}")

    if [ -z "${artifact_id}" ]; then
      log_warning "No ${artifact_name} artifact found in run ${run_id}"
      continue
    fi

    if download_artifact "${artifact_id}" "${dest_dir}"; then
      log_success "${lang^} coverage reports downloaded"
    else
      log_warning "Failed to download ${lang} coverage reports"
    fi
  done
}

# Copy reports into apps/site/dist directory
copy_reports_to_site_dist() {
  log_info "Copying reports into apps/site/dist directory..."
  
  # Coverage
  if [ -d "coverage" ] && [ -n "$(ls -A coverage 2>/dev/null)" ]; then
    log_info "Copying coverage reports..."
    mkdir -p apps/site/dist/coverage
    cp -r coverage/* apps/site/dist/coverage/ || true
    log_success "Coverage reports copied to apps/site/dist/coverage/"
  fi
  
  # Playwright (needs to be copied to playwright/ via simplify_urls.rb pattern)
  if [ -d "playwright-report" ] && [ -n "$(ls -A playwright-report 2>/dev/null)" ]; then
    log_info "Copying Playwright reports..."
    mkdir -p apps/site/dist/playwright
    cp -r playwright-report/* apps/site/dist/playwright/ || true
    log_success "Playwright reports copied to apps/site/dist/playwright/"
  fi
  
  # Lighthouse
  if [ -d "lighthouse-reports" ] && [ -n "$(ls -A lighthouse-reports 2>/dev/null)" ]; then
    log_info "Copying Lighthouse reports..."
    mkdir -p apps/site/dist/lighthouse
    cp -r lighthouse-reports/* apps/site/dist/lighthouse/ || true
    log_success "Lighthouse reports copied to apps/site/dist/lighthouse/"
  fi

  # Examples Playwright (nav link expects /playwright-examples/)
  if [ -d "examples-playwright-report" ] && [ -n "$(ls -A examples-playwright-report 2>/dev/null)" ]; then
    log_info "Copying Examples Playwright reports..."
    mkdir -p apps/site/dist/playwright-examples
    cp -r examples-playwright-report/* apps/site/dist/playwright-examples/ || true
    log_success "Examples Playwright reports copied to apps/site/dist/playwright-examples/"
  fi

  # Python coverage (nav link expects /coverage-python/)
  if [ -d "coverage-python-html" ] && [ -n "$(ls -A coverage-python-html 2>/dev/null)" ]; then
    log_info "Copying Python coverage reports..."
    mkdir -p apps/site/dist/coverage-python
    cp -r coverage-python-html/* apps/site/dist/coverage-python/ || true
    log_success "Python coverage reports copied to apps/site/dist/coverage-python/"
  fi

  # Ruby coverage (nav link expects /coverage-ruby/)
  if [ -d "coverage-ruby-html" ] && [ -n "$(ls -A coverage-ruby-html 2>/dev/null)" ]; then
    log_info "Copying Ruby coverage reports..."
    mkdir -p apps/site/dist/coverage-ruby
    cp -r coverage-ruby-html/* apps/site/dist/coverage-ruby/ || true
    log_success "Ruby coverage reports copied to apps/site/dist/coverage-ruby/"
  fi

  # Swift coverage (nav link expects /coverage-swift/)
  if [ -d "coverage-swift-html" ] && [ -n "$(ls -A coverage-swift-html 2>/dev/null)" ]; then
    log_info "Copying Swift coverage reports..."
    mkdir -p apps/site/dist/coverage-swift
    cp -r coverage-swift-html/* apps/site/dist/coverage-swift/ || true
    log_success "Swift coverage reports copied to apps/site/dist/coverage-swift/"
  fi
}

# Main execution
main() {
  log_info "Starting artifact download for commit ${COMMIT_SHA}"

  download_coverage
  download_playwright
  download_lighthouse
  download_examples_playwright
  download_multi_language_coverage

  copy_reports_to_site_dist

  log_success "Artifact download completed"
}

main "$@"

