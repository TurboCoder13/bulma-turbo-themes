#!/bin/bash
# Verify SBOM signatures
# Usage: verify-sbom-signatures.sh

set -euo pipefail

echo "🔍 Verifying SBOM signatures..."

for sbom_file in sbom/*.json sbom/*.xml; do
  if [ -f "$sbom_file" ]; then
    echo "Verifying: $sbom_file"
    cosign verify-blob "$sbom_file" \
      --signature="${sbom_file}.sig" \
      --certificate="${sbom_file}.cert" \
      --certificate-identity-regexp=".*" \
      --certificate-oidc-issuer-regexp=".*"
    echo "✅ Verified: $sbom_file"
  fi
done

echo "✅ All SBOM signatures verified successfully"
