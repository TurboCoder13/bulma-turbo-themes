#!/usr/bin/env bash
# SPDX-License-Identifier: MIT
# Purpose: Post or update PR comments via GitHub API
#
# Usage: post-pr-comment.sh COMMENT_FILE [MARKER]
#
# This script posts comments to PRs using the GitHub CLI or API.
# It supports marker-based comment updates for merge-update behavior.

set -e

# Show help if requested
if [ "${1:-}" = "--help" ] || [ "${1:-}" = "-h" ]; then
    echo "Usage: $0 COMMENT_FILE [MARKER]"
    echo ""
    echo "Post or update PR comments via GitHub API"
    echo ""
    echo "Arguments:"
    echo "  COMMENT_FILE    Path to comment file (required)"
    echo "  MARKER          Optional marker for comment identification"
    echo ""
    echo "Environment Variables:"
    echo "  GITHUB_TOKEN    GitHub token for authentication (required)"
    echo "  PR_NUMBER       Pull request number (required)"
    echo "  GITHUB_REPOSITORY  Repository in format owner/repo (required)"
    echo ""
    exit 0
fi

# Source shared utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -f "$SCRIPT_DIR/../utils/utils.sh" ]; then
    source "$SCRIPT_DIR/../utils/utils.sh"
fi

# Check if we're in a PR context
if [ -z "${PR_NUMBER:-}" ] || [ -z "${GITHUB_TOKEN:-}" ]; then
    log_info "Not in a PR context (missing PR_NUMBER or GITHUB_TOKEN), skipping comment posting"
    exit 0
fi

# Get the comment file from argument
COMMENT_FILE="${1:-}"
if [ -z "$COMMENT_FILE" ]; then
    log_error "Comment file path is required"
    exit 1
fi

if [ ! -f "$COMMENT_FILE" ]; then
    log_error "Comment file $COMMENT_FILE not found"
    exit 1
fi

# Optional marker for merge-update behavior
MARKER="${2:-${MARKER:-}}"

log_info "Preparing PR comment from $COMMENT_FILE"

# If a marker is provided, attempt to find and update existing comment
if [ -n "$MARKER" ]; then
    log_info "Marker provided: $MARKER"
    log_info "Checking for existing comment with marker..."
    
    # Use GitHub CLI to find existing comment
    if command -v gh &>/dev/null; then
        EXISTING_COMMENT_ID=$(gh api "repos/$GITHUB_REPOSITORY/issues/$PR_NUMBER/comments" \
            --jq ".[] | select(.body | contains(\"<!-- $MARKER -->\")) | .id" | head -n1)
        
        if [ -n "$EXISTING_COMMENT_ID" ]; then
            log_info "Found existing comment (ID: $EXISTING_COMMENT_ID); updating it"
            gh api "repos/$GITHUB_REPOSITORY/issues/comments/$EXISTING_COMMENT_ID" \
                -X PATCH \
                -f body="$(cat "$COMMENT_FILE")" >/dev/null
            log_success "PR comment updated successfully"
            exit 0
        else
            log_info "No existing comment with marker found; will create new one"
        fi
    fi
fi

log_info "Posting PR comment"

# Post PR comment using GitHub CLI if available, otherwise fallback to curl
if command -v gh &>/dev/null; then
    gh pr comment "$PR_NUMBER" --body-file "$COMMENT_FILE" >/dev/null 2>&1
    log_success "PR comment posted successfully via gh"
else
    log_info "gh not found, using curl to post PR comment"
    
    # Escape quotes and newlines for JSON
    COMMENT_BODY=$(jq -Rs . < "$COMMENT_FILE")
    
    curl -sS -H "Authorization: Bearer $GITHUB_TOKEN" \
         -H "Accept: application/vnd.github+json" \
         -H "X-GitHub-Api-Version: 2022-11-28" \
         -X POST \
         -d "{\"body\": $COMMENT_BODY}" \
         "https://api.github.com/repos/$GITHUB_REPOSITORY/issues/$PR_NUMBER/comments" >/dev/null
    log_success "PR comment posted successfully via curl"
fi
