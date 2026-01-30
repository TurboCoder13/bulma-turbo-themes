#!/usr/bin/env bash
# Sign SBOM files with Cosign
# Usage: sign-sbom.sh

set -euo pipefail

echo "🔐 Signing SBOM files with keyless signing..."

# Check if sbom directory exists
if [ ! -d "sbom" ]; then
  echo "Error: sbom directory does not exist"
  exit 1
fi

# Find and sign each SBOM file
signed_count=0
shopt -s nullglob # Don't treat unmatched globs as errors
for sbom_file in sbom/*.json sbom/*.xml; do
  if [ -f "$sbom_file" ]; then
    echo "Signing: $sbom_file"
    cosign sign-blob "$sbom_file" \
      --bundle="${sbom_file}.bundle" \
      --yes
    echo "✅ Signed: $sbom_file"
    ((signed_count++)) || true
  fi
done
shopt -u nullglob # Restore default behavior

if [ "$signed_count" -eq 0 ]; then
  echo "Error: No SBOM files found to sign"
  exit 1
fi

echo "✅ All SBOM files signed successfully ($signed_count files)"
