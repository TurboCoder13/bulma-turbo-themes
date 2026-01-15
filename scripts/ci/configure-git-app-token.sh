#!/usr/bin/env bash
# SPDX-License-Identifier: MIT
# Purpose: Configure git with GitHub App token for authenticated operations
#
# Usage: ./configure-git-app-token.sh <token> <repository>
#
# Arguments:
#   token       GitHub App installation token
#   repository  Repository in format 'owner/repo'
#
# This script configures git to use a GitHub App token for pushing commits/tags.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/../utils/utils.sh"

show_usage() {
    echo "Usage: $0 <token> <repository>"
    echo ""
    echo "Arguments:"
    echo "  token       GitHub App installation token"
    echo "  repository  Repository in format 'owner/repo'"
}

main() {
    if [[ $# -lt 2 ]]; then
        log_error "Missing required arguments"
        show_usage
        exit 2
    fi

    local token="$1"
    local repository="$2"

    # Validate inputs are not empty
    if [[ -z "$token" ]]; then
        log_error "Token cannot be empty"
        exit 2
    fi

    if [[ -z "$repository" ]]; then
        log_error "Repository cannot be empty"
        exit 2
    fi

    # Validate repository format (owner/repo)
    if [[ ! "$repository" =~ ^[a-zA-Z0-9_.-]+/[a-zA-Z0-9_.-]+$ ]]; then
        log_error "Repository must be in format 'owner/repo'"
        exit 2
    fi

    log_info "Configuring git with app token..."

    # Set git user for the app
    git config --global user.name "turbo-themes-release-bot[bot]"
    git config --global user.email "turbo-themes-release-bot[bot]@users.noreply.github.com"

    # Configure remote URL with token
    git remote set-url origin "https://x-access-token:${token}@github.com/${repository}.git"

    log_success "Git configured with app token"
}

main "$@"
