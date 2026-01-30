#!/usr/bin/env bash
# Validate SBOM files
# Usage: validate-sbom.sh [cyclonedx|spdx]

set -euo pipefail

SBOM_TYPE="${1:-cyclonedx}"

case "$SBOM_TYPE" in
cyclonedx)
  if [ ! -s sbom/sbom.cyclonedx.json ]; then
    echo "Error: CycloneDX SBOM is empty"
    exit 1
  fi
  echo "✅ CycloneDX SBOM validation passed"
  ;;
spdx)
  if [ ! -s sbom/sbom.spdx.json ]; then
    echo "Error: SPDX SBOM is empty"
    exit 1
  fi
  echo "✅ SPDX SBOM validation passed"
  ;;
*)
  echo "Usage: validate-sbom.sh [cyclonedx|spdx]"
  exit 1
  ;;
esac
