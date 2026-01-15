#!/usr/bin/env bash
set -euo pipefail

# Configure Git for GitHub Actions
# This script sets up Git user configuration for automated commits and tags

echo "🔧 Configuring Git for GitHub Actions..."

git config --global user.email "41898282+github-actions[bot]@users.noreply.github.com"
git config --global user.name "github-actions[bot]"

echo "✅ Git configuration complete"
