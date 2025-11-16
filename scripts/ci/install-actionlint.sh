#!/usr/bin/env bash
# Install actionlint (GitHub Actions workflow linter)
# Usage: install-actionlint.sh
#
# This script installs a pinned actionlint binary into a local .bin directory
# using GitHub Releases (no dependency on raw.githubusercontent.com). When
# running in GitHub Actions, it appends that directory to GITHUB_PATH so that
# actionlint is available on PATH for subsequent steps.

set -euo pipefail

INSTALL_DIR="${INSTALL_DIR:-./.bin}"
ACTIONLINT_VERSION="${ACTIONLINT_VERSION:-1.7.8}"

mkdir -p "${INSTALL_DIR}"

echo "📦 Installing actionlint v${ACTIONLINT_VERSION} into '${INSTALL_DIR}'..."

OS="$(uname -s)"
ARCH="$(uname -m)"

case "${OS}" in
  Linux) os="linux" ;;
  Darwin) os="darwin" ;;
  *)
    echo "❌ Unsupported OS for actionlint: ${OS}"
    exit 1
    ;;
esac

case "${ARCH}" in
  x86_64|amd64) arch="amd64" ;;
  arm64|aarch64) arch="arm64" ;;
  *)
    echo "❌ Unsupported architecture for actionlint: ${ARCH}"
    exit 1
    ;;
esac

TAR_NAME="actionlint_${ACTIONLINT_VERSION}_${os}_${arch}.tar.gz"
URL="https://github.com/rhysd/actionlint/releases/download/v${ACTIONLINT_VERSION}/${TAR_NAME}"

TMP_DIR="$(mktemp -d)"
trap 'rm -rf "${TMP_DIR}"' EXIT

echo "  Downloading actionlint from ${URL}..."

# Retry logic for rate limits (429) or transient failures
MAX_RETRIES=3
RETRY_DELAY=5

for attempt in $(seq 1 ${MAX_RETRIES}); do
  if curl -sSfL "${URL}" -o "${TMP_DIR}/${TAR_NAME}"; then
    echo "  ✅ Download successful"
    break
  else
    EXIT_CODE=$?
    if [ ${attempt} -lt ${MAX_RETRIES} ]; then
      echo "  ⚠️  Download failed (attempt ${attempt}/${MAX_RETRIES}), retrying in ${RETRY_DELAY}s..."
      sleep ${RETRY_DELAY}
      RETRY_DELAY=$((RETRY_DELAY * 2))  # Exponential backoff
    else
      echo "  ❌ Download failed after ${MAX_RETRIES} attempts"
      exit ${EXIT_CODE}
    fi
  fi
done

tar -xzf "${TMP_DIR}/${TAR_NAME}" -C "${INSTALL_DIR}"

ACTIONLINT_BIN="${INSTALL_DIR%/}/actionlint"

if [ ! -x "${ACTIONLINT_BIN}" ]; then
  echo "❌ actionlint binary not found at '${ACTIONLINT_BIN}' after installation"
  exit 1
fi

echo "✅ actionlint installed at '${ACTIONLINT_BIN}'"

# When running in GitHub Actions, ensure the install directory is added to PATH
if [ -n "${GITHUB_PATH:-}" ]; then
  REPO_BIN_PATH="$(pwd)/${INSTALL_DIR#./}"
  echo "${REPO_BIN_PATH}" >> "${GITHUB_PATH}"
  echo "🛣️  Added '${REPO_BIN_PATH}' to GITHUB_PATH"
fi


