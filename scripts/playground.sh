#!/usr/bin/env bash

set -euo pipefail

usage() {
  cat <<'USAGE'
Usage: ./scripts/playground.sh [html|jekyll|swift|tailwind|bootstrap|python]

Launches the corresponding playground:
  html       - Opens examples/html-vanilla/index.html
  jekyll     - Serves examples/jekyll with live reload (bundle exec jekyll serve)
  swift      - Opens SwiftUI preview package in Xcode
  tailwind   - Runs Vite dev server for Tailwind demo
  bootstrap  - Placeholder for future Bootstrap demo
  python     - Placeholder for future Python report demo
USAGE
}

if [[ $# -lt 1 ]]; then
  usage
  exit 1
fi

target="$1"
root_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

case "$target" in
  html)
    open "$root_dir/examples/html-vanilla/index.html"
    ;;
  jekyll)
    cd "$root_dir/examples/jekyll"
    bundle exec jekyll serve --livereload
    ;;
  swift)
    open "$root_dir/examples/swift-swiftui/Package.swift"
    ;;
  tailwind)
    cd "$root_dir/examples/tailwind"
    bun install
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

