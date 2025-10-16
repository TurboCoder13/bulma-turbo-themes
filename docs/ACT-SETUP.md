# Local GitHub Actions Testing with act

## Overview

This guide helps you test GitHub Actions workflows locally using `act` before pushing to the repository. This is particularly useful for validating CI configuration changes without waiting for actual GitHub runs.

## Prerequisites

### Required Tools

- `act` (GitHub Actions local runner) - v0.2.82+
  - Install: `brew install act`
- `docker` (acts as the container runtime)
- `git` (for repository operations)

### Verify Installation

```bash
act --version  # Should show v0.2.82 or later
docker ps     # Should connect successfully
```

## Quick Start

### Test the Main CI Workflow

For Apple M-series Macs:

```bash
# List available workflows
act --list --container-architecture linux/arm64

# Run main CI workflow (quality-ci-main.yml)
act -W .github/workflows/quality-ci-main.yml --container-architecture linux/arm64 -j build
```

For Intel Macs or Linux:

```bash
act --list
act -W .github/workflows/quality-ci-main.yml -j build
```

## Configuration

### Apple M-Series Workaround

The warning about M-series chip architecture is normal. Use the flag to avoid issues:

```bash
--container-architecture linux/arm64
```

This ensures container images run correctly on Apple Silicon.

### Container Image

The workflow uses Ubuntu 24.04. If act can't find a suitable image, specify it:

```bash
act -P ubuntu-24.04=ghcr.io/catthehacker/ubuntu:act-latest
```

## Workflow Behavior

### Steps That Skip in act Environment

The following workflow steps automatically skip when running under `act` due to `if: ${{ !env.ACT }}` conditions:

1. **Harden Runner** - Network security step (not needed locally)
2. **Upload coverage to Codecov** - External service upload
3. **Post coverage comment on PR** - GitHub-only feature
4. **Upload coverage HTML for Pages** - Artifact upload to Pages
5. **Upload coverage badges** - Artifact upload
6. **Upload JS dist artifact** - Artifact upload
7. **Upload built site artifact** - Artifact upload
8. **Upload SBOM artifact** - Artifact upload

### Steps That Run Locally

All core quality checks run in the act environment:

- ✅ Checkout code
- ✅ Setup environment (Node, Ruby, dependencies)
- ✅ Validate commit messages (if pull_request event)
- ✅ Run CI pipeline (lint, format, build, test, etc.)
- ✅ Generate coverage badges
- ✅ Generate SBOM (if installed)

## Matrix Testing with act

Your workflow tests against multiple Node and Ruby versions:

- Node: 18, 20, 22
- Ruby: 3.3, 3.4

**Note:** act may have limited support for matrix expansion. For thorough testing, use the local scripts instead:

```bash
# Run CI pipeline locally without matrix
npm run ci:quick

# Or run full CI
npm run ci:full
```

## Comparison: Local Scripts vs act

| Task          | Local Scripts | act                        |
| ------------- | ------------- | -------------------------- |
| Speed         | Fast          | Slower (Docker overhead)   |
| Accuracy      | Exact match   | Close approximation        |
| Environment   | Your system   | Ubuntu 24.04 container     |
| Node versions | Single        | Multiple (if matrix works) |
| Ruby versions | Single        | Multiple (if matrix works) |
| Harden Runner | Skipped       | Skipped                    |
| Artifacts     | Not uploaded  | Skipped upload steps       |
| Best use      | Daily testing | Workflow syntax validation |

## Recommended Workflow

### For Development

Use local scripts for faster feedback:

```bash
# Before committing
npm run ci:quick

# Before pushing
npm run ci:full
```

### Before Changing CI Workflows

Use act to validate changes:

```bash
# Edit .github/workflows/quality-ci-main.yml
# Then test locally:
act -W .github/workflows/quality-ci-main.yml --container-architecture linux/arm64 -j build
```

### Full Environment Testing

Use Docker for exact CI environment match:

```bash
npm run ci:docker
```

## Troubleshooting

### Docker Not Running

```bash
# macOS: Start Docker Desktop first
# Or use Colima as a Docker alternative:
colima start
```

### Container Image Not Found

```bash
# Specify image explicitly
act -P ubuntu-24.04=ghcr.io/catthehacker/ubuntu:act-latest
```

### Workflow Hangs

This can happen with matrix testing when act tries to expand all combinations. Options:

1. Run local scripts instead: `npm run ci:quick`
2. Test individual steps manually
3. Use GitHub Codespaces for exact CI environment

### Build Failures in act

If tests pass locally but fail in act:

1. Check Node/Ruby version differences
2. Run with exact versions: `node --version`, `ruby --version`
3. Use `npm run ci:docker` for Ubuntu 24.04 environment

## Local Test Results

All core CI checks currently pass locally:

```
✅ ESLint linting - 0 warnings
✅ Prettier formatting - All files conform
✅ Markdown linting - All files pass
✅ CSS linting - All styles pass
✅ TypeScript build - Compilation successful
✅ Tests with coverage - 34 tests pass
   - Lines: 88.55% (threshold: 85%)
   - Functions: 100% (threshold: 85%)
   - Branches: 86.66% (threshold: 85%)
   - Statements: 88.55% (threshold: 85%)
✅ CSS budget - 43.00 kB
✅ Jekyll build - Site generated successfully
✅ HTMLProofer - HTML validation passed
✅ Theme sync determinism - No unstaged changes
```

## Resources

- [act Documentation](https://nektosact.com/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Our CI Requirements](./CI-REQUIREMENTS.md)
- [Local CI Setup](./LOCAL-CI-SETUP.md)
