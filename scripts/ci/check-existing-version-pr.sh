#!/usr/bin/env bash
# Check for existing version PR in open state
# Sets outputs: pr_exists=true|false, pr_number=<number>

set -e

existing_pr=$(gh pr list --state=open --search "chore(release): version" --json number --jq ".[0].number // empty" 2>/dev/null || echo "")

if [ -n "$existing_pr" ]; then
  echo "pr_exists=true" >>"$GITHUB_OUTPUT"
  echo "pr_number=$existing_pr" >>"$GITHUB_OUTPUT"
  echo "ℹ️ Found existing version PR: #$existing_pr"
else
  echo "pr_exists=false" >>"$GITHUB_OUTPUT"
  echo "ℹ️ No existing version PR found"
fi
