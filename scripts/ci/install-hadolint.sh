#!/usr/bin/env bash
# Install hadolint (Dockerfile linter)
# Usage: install-hadolint.sh
#
# This script installs a pinned hadolint binary into a local .bin directory
# using GitHub Releases. When running in GitHub Actions, it appends that
# directory to GITHUB_PATH so that hadolint is available on PATH for
# subsequent steps.
#
# The install pattern mirrors install-actionlint.sh and matches the
# conventions used in the py-lintro project.

set -euo pipefail

INSTALL_DIR="${INSTALL_DIR:-./.bin}"
HADOLINT_VERSION="${HADOLINT_VERSION:-2.14.0}"

mkdir -p "${INSTALL_DIR}"

echo "📦 Installing hadolint v${HADOLINT_VERSION} into '${INSTALL_DIR}'..."

OS="$(uname -s)"
ARCH="$(uname -m)"

case "${OS}" in
Linux | Darwin)
  os="$(echo "${OS}" | tr '[:upper:]' '[:lower:]')"
  ;;
*)
  echo "❌ Unsupported OS for hadolint: ${OS}"
  exit 1
  ;;
esac

case "${ARCH}" in
x86_64 | amd64)
  arch="x86_64"
  ;;
arm64 | aarch64)
  arch="arm64"
  ;;
*)
  echo "❌ Unsupported architecture for hadolint: ${ARCH}"
  exit 1
  ;;
esac

BIN_NAME="hadolint-${os}-${arch}"
URL="https://github.com/hadolint/hadolint/releases/download/v${HADOLINT_VERSION}/${BIN_NAME}"

TMP_DIR="$(mktemp -d)"
trap 'rm -rf "${TMP_DIR}"' EXIT

echo "  Downloading hadolint from ${URL}..."
curl -sSfL "${URL}" -o "${TMP_DIR}/${BIN_NAME}"

CHECKSUM_URL="${URL}.sha256"
echo "  Downloading checksum from ${CHECKSUM_URL}..."
curl -sSfL "${CHECKSUM_URL}" -o "${TMP_DIR}/${BIN_NAME}.sha256"

echo "  Verifying checksum..."
EXPECTED_CHECKSUM="$(cut -d' ' -f1 "${TMP_DIR}/${BIN_NAME}.sha256")"
ACTUAL_CHECKSUM="$(sha256sum "${TMP_DIR}/${BIN_NAME}" | cut -d' ' -f1)"

if [ "${EXPECTED_CHECKSUM}" != "${ACTUAL_CHECKSUM}" ]; then
  echo "❌ Checksum verification failed!"
  echo "  Expected: ${EXPECTED_CHECKSUM}"
  echo "  Actual:   ${ACTUAL_CHECKSUM}"
  exit 1
fi
echo "  Checksum verified successfully"

HADOLINT_BIN="${INSTALL_DIR%/}/hadolint"
cp "${TMP_DIR}/${BIN_NAME}" "${HADOLINT_BIN}"
chmod +x "${HADOLINT_BIN}"

if [ ! -x "${HADOLINT_BIN}" ]; then
  echo "❌ hadolint binary not found or not executable at '${HADOLINT_BIN}' after installation"
  exit 1
fi

echo "✅ hadolint installed at '${HADOLINT_BIN}'"

# When running in GitHub Actions, ensure the install directory is added to PATH
if [ -n "${GITHUB_PATH:-}" ]; then
  REPO_BIN_PATH="$(pwd)/${INSTALL_DIR#./}"
  echo "${REPO_BIN_PATH}" >>"${GITHUB_PATH}"
  echo "🛣️  Added '${REPO_BIN_PATH}' to GITHUB_PATH"
fi
