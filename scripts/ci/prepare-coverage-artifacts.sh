#!/bin/bash
set -euo pipefail

# Prepare coverage artifacts for GitHub Pages deployment
mkdir -p _site/coverage
cp -r coverage/* _site/coverage/
