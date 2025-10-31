# Scripts Directory

This directory contains automation scripts for the bulma-turbo-themes project, organized by purpose.

## 📁 Directory Structure

```
scripts/
├── README.md          # This file
├── ci/                # CI/CD automation scripts
├── local/             # Local development scripts
├── utils/             # Shared utility functions
├── generate-css.mjs   # Generate CSS theme files
└── sync-catppuccin.mjs # Sync Catppuccin themes
```

## 🤖 CI Scripts (`ci/`)

Scripts intended to run in CI/CD pipelines:

### `coverage-badges.mjs`

Generate coverage badges from test results.

**Usage:**

```bash
node scripts/ci/coverage-badges.mjs
```

**Environment:**

- Requires: Node.js
- Inputs: Coverage data from test execution
- Outputs: Coverage badge files

### `css-budget.mjs`

Check CSS file sizes against budget thresholds.

**Usage:**

```bash
node scripts/ci/css-budget.mjs
```

**Environment:**

- Requires: Node.js
- Checks: CSS files in `assets/css/themes/`
- Exits: Non-zero on budget violation

### `post-pr-comment.sh`

Post or update PR comments via GitHub API.

**Usage:**

```bash
./scripts/ci/post-pr-comment.sh COMMENT_FILE [MARKER]
```

**Environment:**

- Requires: `gh` CLI or `curl`
- Variables: `GITHUB_TOKEN`, `PR_NUMBER`, `GITHUB_REPOSITORY`
- Supports: Marker-based comment updates

### `coverage-pr-comment.sh`

Generate and post coverage report comments to PRs.

**Usage:**

```bash
./scripts/ci/coverage-pr-comment.sh
```

**Environment:**

- Requires: `jq`, `bc`, `gh` CLI or `curl`
- Inputs: `coverage/coverage-summary.json`
- Variables: `GITHUB_TOKEN`, `PR_NUMBER`, `GITHUB_REPOSITORY`

### `generate-playwright-comment.sh`

Generate Playwright E2E test report comments for PRs.

**Usage:**

```bash
./scripts/ci/generate-playwright-comment.sh
```

**Environment:**

- Inputs: `playwright-report/` directory, `test-results/` directory
- Variables: `GITHUB_RUN_ID`, `GITHUB_SHA`, `GITHUB_REPOSITORY`
- Outputs: `playwright-comment.md` file
- Features: Auto-detects local vs CI environment and generates appropriate report URLs

## 🛠️ Local Development Scripts (`local/`)

Scripts for local development workflows:

### `bootstrap-env.sh`

Bootstrap the development environment.

**Usage:**

```bash
./scripts/local/bootstrap-env.sh [--skip-git-hooks]
```

**Features:**

- Checks for required tools (node, npm, ruby, bundle)
- Installs Node.js and Ruby dependencies
- Sets up git hooks (husky)
- Displays setup summary

### `build.sh`

Full build process including cleanup, dependencies, tests, and Jekyll site.

**Usage:**

```bash
./scripts/local/build.sh [--serve|--no-serve]
```

**Features:**

- Runs cleanup script first
- Installs dependencies
- Runs tests with coverage
- Builds TypeScript
- Builds Jekyll site
- Optional: Serves site locally

### `clean.sh`

Clean all build artifacts and temporary files.

**Usage:**

```bash
./scripts/local/clean.sh [--remove-locks]
```

**Features:**

- Removes build directories (\_site, dist, coverage)
- Cleans cache directories
- Removes node_modules
- Optional: Remove lockfiles

### `local-build.sh`

Build project for local development.

**Usage:**

```bash
./scripts/local/local-build.sh [--with-tests] [--skip-checks]
```

**Features:**

- Runs linting and formatting checks
- Builds TypeScript
- Optional: Run tests after build
- Displays build artifacts

### `run-tests.sh`

Run tests with coverage.

**Usage:**

```bash
./scripts/local/run-tests.sh [--watch] [--no-coverage]
```

**Features:**

- Runs vitest with coverage
- Displays coverage summary
- Optional: Watch mode
- Optional: Skip coverage

### `serve.sh`

Quick serve script for the Jekyll site.

**Usage:**

```bash
./scripts/local/serve.sh [--no-build] [--no-ts-watch]
```

**Features:**

- Serves existing Jekyll site
- Auto-builds if \_site missing
- Live reload enabled
- Optional: TypeScript watch mode

## 📦 Utilities (`utils/`)

Shared functions and utilities used by other scripts.

### `utils.sh`

Common bash functions for all scripts.

**Usage:**

```bash
# Source in other scripts
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../utils/utils.sh"
```

**Functions:**

- **Logging:** `log_info`, `log_success`, `log_warn`, `log_error`
- **Environment checks:** `is_ci`, `command_exists`
- **Git helpers:** `get_git_root`, `get_current_branch`, `get_commit_sha`
- **File system:** `ensure_directory`, `require_file`
- **Error handling:** `die`, `require_command`

## 🎨 Root-Level Scripts

### `generate-css.mjs`

Generate theme CSS files from source.

**Usage:**

```bash
node scripts/generate-css.mjs
```

**Environment:**

- Requires: Node.js
- Inputs: Theme source files
- Outputs: Generated CSS in `assets/css/themes/`

### `sync-catppuccin.mjs`

Synchronize Catppuccin theme files.

**Usage:**

```bash
node scripts/sync-catppuccin.mjs
```

**Environment:**

- Requires: Node.js
- Syncs: Catppuccin theme variants
- Updates: Theme files in `assets/css/themes/`

## 🔧 Adding New Scripts

When adding scripts, follow these guidelines:

### File Naming

- Use kebab-case: `my-new-script.sh`
- Extensions: `.sh` (bash), `.mjs` (JavaScript modules), `.py` (Python)

### Script Headers

**Bash scripts:**

```bash
#!/usr/bin/env bash
# SPDX-License-Identifier: MIT
# Purpose: Brief description of what this script does
#
# Usage: ./script-name.sh [options]

set -euo pipefail
```

**JavaScript/Node scripts:**

```javascript
#!/usr/bin/env node
// SPDX-License-Identifier: MIT
// Purpose: Brief description of what this script does
//
// Usage: node script-name.mjs [options]
```

### Location Guidelines

| Script Purpose    | Directory | Example                            |
| ----------------- | --------- | ---------------------------------- |
| CI/CD automation  | `ci/`     | Coverage reports, badge generation |
| Local development | `local/`  | Test runners, build helpers        |
| Shared utilities  | `utils/`  | Common functions, helpers          |
| Theme generation  | Root      | Theme-specific tooling             |

## 📚 Best Practices

1. **Documentation:** Include usage instructions and requirements
2. **Error Handling:** Exit with non-zero codes on failure
3. **Logging:** Use clear, structured log messages
4. **Dependencies:** Document all required tools/packages
5. **Testing:** Test locally before committing

## 🔗 Related Documentation

- [CONTRIBUTING.md](../CONTRIBUTING.md) - Contribution guidelines
- [.github/workflows/README.md](../.github/workflows/README.md) - Workflow documentation
- [.github/actions/README.md](../.github/actions/README.md) - Composite actions

## 📞 Support

For questions about scripts:

1. Check inline documentation in the script file
2. Review this README
3. Create an issue for clarification

---

**Last Updated:** 2025-10-05  
**Maintained by:** @eiteldagnin
