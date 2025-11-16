#!/usr/bin/env bash
set -euo pipefail

# Publish gem to RubyGems.org
# Requires: RubyGems credentials to be configured (via OIDC or API key)

GEM_FILE=$(find . -maxdepth 1 -name "*.gem" -type f | head -1)

if [ -z "$GEM_FILE" ]; then
  echo "❌ No gem file found"
  exit 1
fi

echo "📦 Publishing: $GEM_FILE"
gem push "$GEM_FILE"
echo "✅ Published successfully"

