#!/usr/bin/env bash
set -euo pipefail

# Prepare coverage artifacts for GitHub Pages deployment
mkdir -p apps/site/dist/coverage
cp -r coverage/* apps/site/dist/coverage/
