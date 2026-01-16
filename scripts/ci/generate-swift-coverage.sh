#!/usr/bin/env bash
set -euo pipefail

# generate-swift-coverage.sh
# Generates HTML coverage report from Swift test results
# Falls back to text report if HTML generation fails (Xcode 16+ compatibility)

if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
  cat <<'EOF'
Generate Swift coverage report from test profdata.

Usage:
  scripts/ci/generate-swift-coverage.sh [working_dir]

Arguments:
  working_dir  Directory containing .build folder (default: current directory)

Outputs:
  htmlcov/index.html  Coverage report (HTML or text fallback)

Exit codes:
  0  Success (report generated)
  0  No profdata found (warning only, not an error)
EOF
  exit 0
fi

WORKING_DIR="${1:-.}"
cd "${WORKING_DIR}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEMPLATES_DIR="${SCRIPT_DIR}/templates"

rm -rf htmlcov && mkdir -p htmlcov

# Find profdata file
PROFDATA=$(find .build -name "default.profdata" -type f 2>/dev/null | head -1)

if [ -z "${PROFDATA}" ]; then
  echo "⚠️ Could not find profdata file"
  find .build -name "*.profdata" -o -name "*.profraw" 2>/dev/null || true
  exit 0
fi

echo "Found profdata: ${PROFDATA}"

# Find the test binary
TEST_BINARY=""
for pattern in \
  ".build/*/debug/TurboThemesPackageTests.xctest/Contents/MacOS/TurboThemesPackageTests" \
  ".build/*/debug/TurboThemesPackageTests"; do
  TEST_BINARY=$(find .build -path "${pattern}" -type f 2>/dev/null | head -1)
  [ -n "${TEST_BINARY}" ] && break
done

if [ -z "${TEST_BINARY}" ]; then
  echo "⚠️ Could not find test binary"
  find .build -type f -perm +111 -name "*Tests*" 2>/dev/null || true
  exit 0
fi

echo "Found test binary: ${TEST_BINARY}"

# Try to generate HTML coverage report
if xcrun llvm-cov show \
  "${TEST_BINARY}" \
  -instr-profile="${PROFDATA}" \
  -format=html \
  -output-dir=htmlcov \
  -show-branches=count \
  -ignore-filename-regex='.*Tests.*' \
  -ignore-filename-regex='.*/.build/.*' 2>&1; then
  echo "✅ Swift coverage report generated with llvm-cov"
else
  echo "⚠️ llvm-cov HTML generation failed, trying text report..."

  # Generate text report as fallback
  if xcrun llvm-cov report \
    "${TEST_BINARY}" \
    -instr-profile="${PROFDATA}" \
    -ignore-filename-regex='.*Tests.*' \
    -ignore-filename-regex='.*/.build/.*' > htmlcov/coverage-report.txt 2>&1; then
    cp "${TEMPLATES_DIR}/swift-coverage-text.html" htmlcov/index.html
    echo "✅ Swift coverage text report generated"
  else
    echo "⚠️ Could not generate any coverage report"
    cp "${TEMPLATES_DIR}/swift-coverage-unavailable.html" htmlcov/index.html
  fi
fi

[ -f "htmlcov/index.html" ] && ls -la htmlcov/
