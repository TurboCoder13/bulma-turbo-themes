#!/bin/bash
# Generate SBOM (CycloneDX JSON)
# Usage: generate-sbom.sh

set -euo pipefail

syft dir:. -o cyclonedx-json > sbom.cyclonedx.json
