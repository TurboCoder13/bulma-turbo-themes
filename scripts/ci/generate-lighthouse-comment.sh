#!/bin/bash
# Generate Lighthouse PR comment
# Usage: generate-lighthouse-comment.sh

set -euo pipefail

echo "## 📊 Lighthouse CI Report" > lighthouse-comment.md
echo "" >> lighthouse-comment.md
echo "Lighthouse performance analysis completed." >> lighthouse-comment.md
