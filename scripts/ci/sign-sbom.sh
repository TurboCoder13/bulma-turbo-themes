#!/bin/bash
# Sign SBOM files with Cosign
# Usage: sign-sbom.sh

set -euo pipefail

echo "🔐 Signing SBOM files with keyless signing..."

# Sign each SBOM file
for sbom_file in sbom/*.json sbom/*.xml; do
  if [ -f "$sbom_file" ]; then
    echo "Signing: $sbom_file"
    cosign sign-blob "$sbom_file" \
      --output-signature="${sbom_file}.sig" \
      --output-certificate="${sbom_file}.cert" \
      --yes
    echo "✅ Signed: $sbom_file"
  fi
done

echo "✅ All SBOM files signed successfully"
