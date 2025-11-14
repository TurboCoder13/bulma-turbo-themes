#!/usr/bin/env bash
# SPDX-License-Identifier: MIT
# Purpose: Test all GitHub Actions workflows locally using ACT
#
# Usage:
#   ./scripts/local/test-workflows-act.sh [--quick] [--single WORKFLOW] [--verbose]
#
# Options:
#   --quick      Test only quality workflows (faster)
#   --single     Test a specific workflow file
#   --verbose    Show detailed output from ACT
#   --help       Show this help message

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$REPO_ROOT"

# Source utility functions
source "${SCRIPT_DIR}/../utils/utils.sh"

# Note: Colors are already defined in utils.sh, so we don't redeclare them here

# Configuration
QUICK_MODE=false
SINGLE_WORKFLOW=""
VERBOSE=false
ACT_ARCH_FLAGS=()

# Workflows that are always testable even without standard triggers
WORKFLOWS_ALWAYS_TESTABLE=("reporting-link-monitoring.yml" "publish-npm-test.yml")

# Check if a workflow is always testable
is_workflow_always_testable() {
  local workflow_name="$1"
  for allowed_workflow in "${WORKFLOWS_ALWAYS_TESTABLE[@]}"; do
    if [[ "$workflow_name" == "$allowed_workflow" ]]; then
      return 0
    fi
  done
  return 1
}

# Parse arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
    --quick)
      QUICK_MODE=true
      shift
      ;;
    --single)
      SINGLE_WORKFLOW="$2"
      shift 2
      ;;
    --verbose)
      VERBOSE=true
      shift
      ;;
    --help|-h)
      cat <<EOF
Test GitHub Actions workflows locally using ACT.

Usage: $0 [OPTIONS]

Options:
  --quick              Test only quality workflows (faster)
  --single WORKFLOW    Test a specific workflow file (e.g., quality-ci-main.yml)
  --verbose            Show detailed output from ACT
  --help, -h           Show this help message

Examples:
  $0                              # Test all testable workflows
  $0 --quick                      # Test only quality workflows
  $0 --single quality-ci-main.yml # Test specific workflow
EOF
      exit 0
      ;;
    *)
      log_error "Unknown option: $1"
      echo "Use --help for usage information"
      exit 1
      ;;
  esac
done

# Check prerequisites
require_command act
require_command docker

# Check if Docker is running
if ! docker ps >/dev/null 2>&1; then
  die "Docker is not running. Please start Docker and try again."
fi

# Detect architecture
detect_architecture() {
  local arch
  arch=$(uname -m)
  case "$arch" in
    arm64|aarch64)
      ACT_ARCH_FLAGS=("--container-architecture" "linux/arm64")
      log_info "Detected Apple Silicon architecture, using linux/arm64 containers"
      ;;
    *)
      ACT_ARCH_FLAGS=()
      log_info "Detected architecture: $arch"
      ;;
  esac
}

# Check if workflow is testable
is_workflow_testable() {
  local workflow_file="$1"
  local workflow_name
  workflow_name=$(basename "$workflow_file")

  # Skip reusable workflows (they're called by other workflows)
  if [[ "$workflow_name" == reusable-*.yml ]] || [[ "$workflow_name" == reusable-*.yaml ]]; then
    return 1
  fi

  # Skip documentation files
  if [[ "$workflow_name" == README.md ]] || [[ "$workflow_name" == TRIGGERS.md ]] || [[ "$workflow_name" == EGRESS-POLICIES.md ]]; then
    return 1
  fi

  # Check if workflow has push or pull_request triggers
  if grep -qE "^\s*(push|pull_request):" "$workflow_file" 2>/dev/null; then
    return 0
  fi

  # Check for workflow_call (reusable workflows)
  if grep -qE "^\s*workflow_call:" "$workflow_file" 2>/dev/null; then
    return 1
  fi

  return 1
}

# Determine event type for workflow
get_workflow_event_type() {
  local workflow_file="$1"
  
  # Prefer push over pull_request for testing (simpler, doesn't need PR event data)
  # Check if it has push trigger
  if grep -qE "^\s*push:" "$workflow_file" 2>/dev/null; then
    echo "push"
  # Check if it has pull_request trigger
  elif grep -qE "^\s*pull_request:" "$workflow_file" 2>/dev/null; then
    echo "pull_request"
  else
    echo "unknown"
  fi
}

# Get main job name from workflow
get_main_job_name() {
  local workflow_file="$1"
  
  # Try to find job names under the "jobs:" section
  # Look for lines that are indented after "jobs:" but not other top-level keys
  local in_jobs=false
  local job_name=""
  
  while IFS= read -r line; do
    # Check if we've entered the jobs section
    if [[ "$line" =~ ^jobs: ]]; then
      in_jobs=true
      continue
    fi
    
    # If we're in jobs section, look for job definitions
    if [[ "$in_jobs" == true ]]; then
      # Job names are at the top level of jobs (usually 2 spaces indent)
      if [[ "$line" =~ ^\s+[a-zA-Z0-9_-]+: ]] && [[ ! "$line" =~ ^\s+(name|runs-on|timeout|strategy|steps|if|uses|with|run|env|permissions|concurrency|needs|outputs|services|container): ]]; then
        job_name=$(echo "$line" | sed 's/[[:space:]]*\([^:]*\):.*/\1/' | tr -d '[:space:]')
        break
      fi
    fi
  done < "$workflow_file"
  
  if [[ -n "$job_name" ]]; then
    echo "$job_name"
  else
    # Default job names based on workflow type
    local workflow_name
    workflow_name=$(basename "$workflow_file" .yml)
    workflow_name=$(basename "$workflow_name" .yaml)
    
    case "$workflow_name" in
      quality-ci-main)
        echo "build"
        ;;
      quality-e2e)
        echo "e2e"
        ;;
      quality-theme-sync)
        echo "check-determinism"
        ;;
      quality-semantic-pr-title)
        echo "check"
        ;;
      quality-validate-action-pinning)
        echo "check-pinning"
        ;;
      reporting-lighthouse-ci)
        echo "lhci"
        ;;
      reporting-link-monitoring)
        echo "validate-external-links"
        ;;
      publish-npm-test)
        echo "publish"
        ;;
      security-sbom)
        echo "sbom"
        ;;
      security-codeql|security-scorecards)
        echo "analyze"
        ;;
      *)
        echo "build"
        ;;
    esac
  fi
}

# Check if workflow should be skipped
should_skip_workflow() {
  local workflow_file="$1"
  local workflow_name
  workflow_name=$(basename "$workflow_file")

  # List of workflows that require GitHub-specific features
  local skip_patterns=(
    "security-codeql.yml"           # Requires GitHub CodeQL API
    "security-dependency-review.yml" # Requires GitHub API
    "security-scorecards.yml"        # Requires GitHub API
    "deploy-pages.yml"               # Requires GitHub Pages API
    "deploy-coverage-pages.yml"      # Requires GitHub Pages API
    "deploy-lighthouse-pages.yml"    # Requires GitHub Pages API
    "deploy-playwright-pages.yml"    # Requires GitHub Pages API
    "release-auto-tag.yml"            # Manual trigger only
    "release-version-pr.yml"         # Requires GitHub API
    "release-publish-pr.yml"          # Requires GitHub API
    "maintenance-renovate.yml"        # Schedule only
    "maintenance-auto-bump-refs.yml"  # Schedule only
    "maintenance-pr-comment-cleanup.yml" # Manual trigger only
  )

  for pattern in "${skip_patterns[@]}"; do
    if [[ "$workflow_name" == "$pattern" ]]; then
      return 0
    fi
  done

  return 1
}

# Test a single workflow
test_workflow() {
  local workflow_file="$1"
  local workflow_name
  workflow_name=$(basename "$workflow_file")
  
  log_info "Testing workflow: $workflow_name"

  # Check if workflow should be skipped
  if should_skip_workflow "$workflow_file"; then
    log_warn "Skipping $workflow_name (requires GitHub-specific features)"
    return 2
  fi

  # Check if workflow is testable
  if ! is_workflow_testable "$workflow_file"; then
    # For test-related workflows, allow manual testing even without push/pull_request triggers
    if is_workflow_always_testable "$workflow_name"; then
      log_info "Allowing manual test of $workflow_name"
    else
      log_warn "Skipping $workflow_name (not directly testable)"
      return 2
    fi
  fi

  # Get event type
  local event_type
  event_type=$(get_workflow_event_type "$workflow_file")

  if [[ "$event_type" == "unknown" ]]; then
    # For manually allowed workflows, default to push event
    if is_workflow_always_testable "$workflow_name"; then
      event_type="push"
      log_info "Using push event for $workflow_name"
    else
      log_warn "Skipping $workflow_name (unknown event type)"
      return 2
    fi
  fi

  # Get main job name
  local job_name
  job_name=$(get_main_job_name "$workflow_file")

  # Build ACT command as array
  local act_cmd_array=("act")

  # Add architecture flags if set
  if [[ ${#ACT_ARCH_FLAGS[@]} -gt 0 ]]; then
    act_cmd_array+=("${ACT_ARCH_FLAGS[@]}")
  fi

  # Add event type
  if [[ "$event_type" == "pull_request" ]]; then
    act_cmd_array+=("pull_request")
  else
    # Use "push" as event name (ACT will generate mock event)
    act_cmd_array+=("push")
  fi

  # Add workflow file
  act_cmd_array+=("-W" "$workflow_file")

  # Add job name
  act_cmd_array+=("-j" "$job_name")

  # Add verbose flag if requested
  if [[ "$VERBOSE" == true ]]; then
    act_cmd_array+=("--verbose")
  else
    act_cmd_array+=("--quiet")
  fi

  # Set ACT environment variable
  export ACT=true

  # Run ACT
  log_info "Running: ${act_cmd_array[*]}"
  if [[ "$VERBOSE" == true ]]; then
    # Show full output when verbose
    if "${act_cmd_array[@]}"; then
      log_success "✓ $workflow_name passed"
      return 0
    else
      log_error "✗ $workflow_name failed"
      return 1
    fi
  else
    # Suppress output when not verbose, but capture exit code
    local act_exit_code=0
    "${act_cmd_array[@]}" >/dev/null 2>&1 || act_exit_code=$?
    if [[ $act_exit_code -eq 0 ]]; then
      log_success "✓ $workflow_name passed"
      return 0
    else
      log_error "✗ $workflow_name failed"
      log_info "Run with --verbose to see detailed output"
      return 1
    fi
  fi
}

# Main execution
main() {
  detect_architecture

  log_info "Starting ACT workflow testing..."
  echo ""

  # Counters
  local passed=0
  local failed=0
  local skipped=0

  # Get workflow files
  local workflow_files=()
  
  if [[ -n "$SINGLE_WORKFLOW" ]]; then
    # Single workflow mode
    local workflow_path=".github/workflows/$SINGLE_WORKFLOW"
    if [[ ! -f "$workflow_path" ]]; then
      die "Workflow file not found: $workflow_path"
    fi
    workflow_files=("$workflow_path")
  else
    # Find all workflow files
    local found_files
    found_files=$(find .github/workflows -name "*.yml" -o -name "*.yaml" 2>/dev/null | grep -vE "(README|TRIGGERS|EGRESS)" | sort || true)
    if [[ -n "$found_files" ]]; then
      while IFS= read -r file; do
        [[ -n "$file" ]] && workflow_files+=("$file")
      done <<< "$found_files"
    fi
  fi

  # Filter for quick mode
  if [[ "$QUICK_MODE" == true ]]; then
    local quick_workflows=()
    for workflow_file in "${workflow_files[@]}"; do
      local workflow_name
      workflow_name=$(basename "$workflow_file")
      if [[ "$workflow_name" =~ ^quality- ]]; then
        quick_workflows+=("$workflow_file")
      fi
    done
    if [[ ${#quick_workflows[@]} -gt 0 ]]; then
      workflow_files=("${quick_workflows[@]}")
    else
      workflow_files=()
    fi
    log_info "Quick mode: Testing only quality workflows"
  fi

  if [[ ${#workflow_files[@]} -eq 0 ]]; then
    log_warn "No workflows found to test"
    exit 0
  fi

  log_info "Found ${#workflow_files[@]} workflow(s) to test"
  echo ""

  # Test each workflow
  for workflow_file in "${workflow_files[@]}"; do
    local result=0
    # Temporarily disable exit on error to continue testing other workflows
    set +e
    test_workflow "$workflow_file"
    result=$?
    set -e
    
    case $result in
      0)
        ((passed++))
        ;;
      1)
        ((failed++))
        ;;
      2)
        ((skipped++))
        ;;
    esac
    echo ""
  done

  # Print summary
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  log_info "Test Summary:"
  echo ""
  echo -e "  ${GREEN}✓ Passed:${NC}  $passed"
  echo -e "  ${RED}✗ Failed:${NC}  $failed"
  echo -e "  ${YELLOW}⊘ Skipped:${NC} $skipped"
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  # Exit with error if any tests failed
  if [[ $failed -gt 0 ]]; then
    exit 1
  fi
}

# Run main function
main "$@"

