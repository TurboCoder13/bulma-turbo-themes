#!/bin/bash
# Determine target SHA for internal reference updates
# Usage: determine-target-sha.sh

set -euo pipefail

if [ "${{ github.event_name }}" == "workflow_dispatch" ]; then
  echo "sha=${{ inputs.sha }}" >> $GITHUB_OUTPUT
else
  echo "sha=${{ github.sha }}" >> $GITHUB_OUTPUT
fi
