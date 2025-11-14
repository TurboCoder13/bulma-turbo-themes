#!/bin/bash
# Verify SBOM signatures
# Usage: verify-sbom-signatures.sh

set -euo pipefail

echo "🔍 Verifying SBOM signatures..."

# Check if sbom directory exists
if [ ! -d "sbom" ]; then
  echo "Error: sbom directory does not exist"
  exit 1
fi

# Find and verify each SBOM file
verified_count=0
shopt -s nullglob  # Don't treat unmatched globs as errors
for sbom_file in sbom/*.json sbom/*.xml; do
  if [ -f "$sbom_file" ]; then
    bundle_file="${sbom_file}.bundle"

    if [ ! -f "$bundle_file" ]; then
      echo "Error: Missing signature bundle for $sbom_file"
      exit 1
    fi

    echo "Verifying: $sbom_file"
    cosign verify-blob "$sbom_file" \
      --bundle="$bundle_file" \
      --certificate-identity-regexp=".*" \
      --certificate-oidc-issuer-regexp=".*"
    echo "✅ Verified: $sbom_file"
    ((verified_count++)) || true
  fi
done
shopt -u nullglob  # Restore default behavior

if [ "$verified_count" -eq 0 ]; then
  echo "Error: No SBOM files found to verify"
  exit 1
fi

echo "✅ All SBOM signatures verified successfully ($verified_count files)"
