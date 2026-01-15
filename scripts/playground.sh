#!/usr/bin/env bash

set -euo pipefail

usage() {
  cat <<'USAGE'
Usage: ./scripts/playground.sh [html|jekyll|swift|tailwind|bootstrap|python]

Launches the corresponding example:
  html       - Opens examples/html-vanilla/index.html
  jekyll     - Serves examples/jekyll with live reload (bundle exec jekyll serve)
  swift      - Opens SwiftUI preview package in Xcode
  tailwind   - Runs Vite dev server for Tailwind example
  bootstrap  - Placeholder for future Bootstrap example
  python     - Placeholder for future Python example
USAGE
}

if [[ $# -lt 1 ]]; then
  usage
  exit 1
fi

target="$1"
root_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Helper to open files cross-platform
open_file() {
  local file="$1"
  if command -v xdg-open >/dev/null 2>&1; then
    xdg-open "$file"
  elif command -v open >/dev/null 2>&1; then
    open "$file"
  else
    echo "Please open $file manually"
  fi
}

case "$target" in
  html)
    open_file "$root_dir/examples/html-vanilla/index.html"
    ;;
  jekyll)
    if ! command -v bundle >/dev/null 2>&1; then
      echo "Error: 'bundle' not found. Install with: gem install bundler"
      exit 1
    fi
    cd "$root_dir/examples/jekyll"
    # Install gems if needed
    if [ ! -d "vendor/bundle" ]; then
      bundle install --path vendor/bundle
    fi
    bundle exec jekyll serve --livereload
    ;;
  swift)
    open_file "$root_dir/examples/swift-swiftui/Package.swift"
    ;;
  tailwind)
    if ! command -v bun >/dev/null 2>&1; then
      echo "Error: 'bun' not found. Install from: https://bun.sh"
      exit 1
    fi
    cd "$root_dir/examples/tailwind"
    # Only install if node_modules is missing or outdated
    if [ ! -d "node_modules" ] || [ "package.json" -nt "node_modules" ]; then
      bun install
    fi
    bun run dev
    ;;
  bootstrap)
    echo "Bootstrap demo placeholder - add implementation in examples/bootstrap/"
    ;;
  python)
    echo "Python report demo placeholder - add implementation in examples/python-report/"
    ;;
  *)
    usage
    exit 1
    ;;
esac

