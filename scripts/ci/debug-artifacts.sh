#!/bin/bash

"""
Debug script to list and verify artifact contents
"""

set -e

ARTIFACT_PATH="${1:?Error: Artifact path not provided}"
ARTIFACT_NAME="${2:-Artifact}"

echo "Contents of current directory:"
ls -la
echo ""
echo "Checking for $ARTIFACT_NAME directory:"

if [ -d "$ARTIFACT_PATH" ]; then
  echo "✅ $ARTIFACT_NAME directory exists"
  find "$ARTIFACT_PATH" -type f
else
  echo "❌ $ARTIFACT_NAME directory not found"
fi

