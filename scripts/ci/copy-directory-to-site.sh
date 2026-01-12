#!/usr/bin/env bash
# Copy a directory into apps/site/dist with validation
# Usage: copy-directory-to-site.sh <source-dir> <dest-subpath>

set -euo pipefail

SOURCE_DIR="${1:?Source directory is required}"
DEST_SUBPATH="${2:?Destination subpath is required}"

if [ ! -d "$SOURCE_DIR" ]; then
  echo "❌ Error: Source directory '$SOURCE_DIR' not found"
  exit 1
fi

DEST_PATH="apps/site/dist/$DEST_SUBPATH"

echo "Preparing artifacts for upload..."
mkdir -p "$DEST_PATH"
cp -r "$SOURCE_DIR"/* "$DEST_PATH/" || {
  echo "❌ Error: Failed to copy $SOURCE_DIR to $DEST_PATH"
  exit 1
}

echo "✅ Artifacts prepared for deployment"
ls -la "$DEST_PATH/"

