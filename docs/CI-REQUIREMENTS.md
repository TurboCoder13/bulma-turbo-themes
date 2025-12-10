# CI Requirements and Local Testing Guide

This document outlines the CI requirements and how to test them locally to ensure CI passes.

## 🚀 Quick Start

### Run Full CI Locally

```bash
# Full CI pipeline (includes Lighthouse)
bun run ci:full

# Quick CI (skips cleanup and Lighthouse)
bun run ci:quick

# Individual CI steps
bun run ci
```

## 📋 CI Workflow Requirements

### 1. Quality Check - CI Pipeline (`quality-ci-main.yml`)

**Required Steps:**

- ✅ ESLint linting (`bun run lint`)
- ✅ Lintro formatting (`uv run lintro fmt`)
- ✅ Lintro linting (`uv run lintro chk`)
- ✅ Markdown linting (`bun run mdlint`)
- ✅ CSS linting (`bun run stylelint`)
- ✅ TypeScript build (`bun run build`)
- ✅ Tests with coverage (`npm test`)
- ✅ CSS budget check (`bun run css:budget`)
- ✅ Jekyll build (`bundle exec jekyll build`)
- ✅ HTMLProofer validation (`bundle exec htmlproofer`)

**Local Testing:**

```bash
bun run ci:quick
# or
./scripts/local/build.sh --quick
```

### 2. Theme Sync Determinism (`quality-theme-sync.yml`)

**Required Steps:**

- ✅ Theme synchronization (`bun run theme:sync`)
- ✅ Check for unstaged changes
- ✅ Quick test suite

**Dependencies:**

- `@catppuccin/palette` package
- `src/themes/packs/` directory
- `src/themes/types.ts` type definitions

**Local Testing:**

```bash
bun run theme:sync
git status --porcelain  # Should be empty
npm test --silent
```

### 3. Lighthouse Performance Analysis (`reporting-lighthouse-ci.yml`)

**Required Steps:**

- ✅ Build site (`./scripts/local/build.sh --no-serve`)
- ✅ Run Lighthouse CI (`npx @lhci/cli@latest autorun`)

**Dependencies:**

- `scripts/local/build.sh` script
- `lighthouserc.json` configuration
- `npx @lhci/cli@latest` available in environment

**Local Testing:**

```bash
./scripts/local/build.sh --no-serve
npx @lhci/cli@latest autorun --config=./lighthouserc.json --collect.numberOfRuns=1
```

### 4. CodeQL Security Analysis (`security-codeql.yml`)

**Required Steps:**

- ✅ CodeQL initialization
- ✅ Auto-build
- ✅ Analysis

**Dependencies:**

- TypeScript/JavaScript code
- Proper build process

**Local Testing:**

```bash
# CodeQL requires GitHub Actions environment
# Test TypeScript compilation instead:
bun run build
```

### 5. External Link Monitoring (`reporting-link-monitoring.yml`)

#### Strategy: Tiered Link Validation

External link validation is separated from the main CI pipeline to maintain fast feedback loops while ensuring comprehensive link health monitoring:

#### Tier 1: Local/Quick Builds (Internal Links Only)

- **Mode**: `--disable-external`
- **Speed**: ~0.05 seconds
- **Validates**: Internal links, anchors, images
- **Network**: No external calls
- **Failure Impact**: ✅ Blocks build (critical)

#### Tier 2: Full CI Builds (Internal + External with Retries)

- **Mode**: External links with timeouts and retries
- **Speed**: ~10-30 seconds
- **Validates**: All links with proper error handling
- **Network**: Full external link validation
- **Failure Impact**: ❌ Non-blocking (reports only)

#### Tier 3: Nightly Monitoring (Separate Workflow)

- **Schedule**: Daily at 2 AM UTC
- **Validates**: External links with 30-second timeouts
- **Retries**: Up to 2 automatic retries per link
- **Reporting**: Creates GitHub issues for persistent failures
- **Non-blocking**: Never fails the build
- **Artifacts**: Upload validation reports for investigation

**Why This Approach:**

- 🚀 **Fast Feedback**: Developers get instant feedback on internal link validity
- 🌐 **Resilient**: External services are monitored separately with retry logic
- 📊 **Transparent**: Separate issue tracking for external link problems
- 🏢 **Enterprise-Ready**: Follows industry standards for link validation

**Configuration Details:**

```bash
# Local/Quick builds
htmlproofer --disable-external \
  --assume-extension \
  --allow-hash-href \
  --allow-missing-href \
  --no-enforce-https \
  ./_site

# Full CI builds
htmlproofer \
  --assume-extension \
  --allow-hash-href \
  --allow-missing-href \
  --no-enforce-https \
  --typhoeus '{"timeout": 30, "max_redirects": 5}' \
  ./_site

# Nightly monitoring
htmlproofer \
  --typhoeus '{"timeout": 30, "max_redirects": 5, "retry": {"max_retries": 2}}' \
  ./_site
```

**Local Testing:**

```bash
# Test internal link validation only
./scripts/local/build.sh --quick

# Test full validation (includes external links)
./scripts/local/build.sh --full
```

## 🔧 Required Dependencies

### npm Packages

```json
{
  "@catppuccin/palette": "^1.0.0"
}
```

### Ruby Gems

```ruby
gem "jekyll", "~> 4.3"
gem "html-proofer", "~> 5.0"
```

### Required Scripts

```json
{
  "theme:sync": "node scripts/sync-catppuccin.mjs",
  "ci": "./scripts/local/ci.sh",
  "ci:quick": "./scripts/local/ci.sh --skip-cleanup --skip-lighthouse",
  "ci:full": "./scripts/local/ci.sh"
}
```

## 📁 Required Directory Structure

```
src/
├── themes/
│   ├── types.ts              # Theme type definitions
│   └── packs/
│       └── catppuccin.synced.ts  # Generated theme file
scripts/
├── local/
│   ├── ci.sh                 # Local CI script
│   ├── build.sh             # Build script
│   └── clean.sh              # Cleanup script
└── sync-catppuccin.mjs       # Theme sync script
lighthouserc.json             # Lighthouse configuration
```

## 🧪 Testing Strategy

### Before Committing

```bash
# Run pre-commit hooks (automatic)
git commit -m "your message"

# Or run manually
bun run ci:quick
```

### Before Pushing

```bash
# Run full CI pipeline
bun run ci:full
```

### Before Release

```bash
# Run all checks including Lighthouse
bun run ci:full
npm audit
```

## 🚨 Common CI Failures and Fixes

### 1. HTMLProofer Failures

**Cause:** Empty `href=""` or invalid links
**Fix:** Replace with valid URLs or `href="#"`

### 2. Theme Sync Failures

**Cause:** Missing `theme:sync` script or dependencies
**Fix:** Add script to package.json and install `@catppuccin/palette`

### 3. Coverage Threshold Failures

**Cause:** Generated files included in coverage
**Fix:** Exclude `src/themes/packs/**/*.synced.ts` in vitest.config.ts

### 4. Lighthouse Failures

**Cause:** Missing `scripts/local/build.sh` script
**Fix:** Ensure `scripts/local/build.sh` exists and is executable

### 5. TypeScript Compilation Failures

**Cause:** Missing type definitions
**Fix:** Create `src/themes/types.ts` with required interfaces

## 🔍 Debugging CI Issues

### Check CI Status

```bash
# View recent CI runs
gh run list

# View specific run
gh run view <run-id>
```

### Local Debugging

```bash
# Run individual CI steps
bun run lint
bun run format
bun run theme:sync
bun run build
npm test
./scripts/local/build.sh --no-serve
```

### Environment Differences

- **CI:** Ubuntu 24.04, Node 18/20/22, Ruby 3.3/3.4
- **Local:** Your OS, Node version, Ruby version
- **Solution:** Use Docker or GitHub Codespaces for exact CI environment

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Lighthouse CI Documentation](https://github.com/GoogleChrome/lighthouse-ci)
- [HTMLProofer Documentation](https://github.com/gjtorikian/html-proofer)
- [Jekyll Documentation](https://jekyllrb.com/docs/)

## 🎯 Best Practices

1. **Always run `bun run ci:quick` before committing**
2. **Run `bun run ci:full` before pushing**
3. **Keep CI and local scripts in sync**
4. **Document all CI dependencies**
5. **Use pre-commit hooks for basic checks**
6. **Test theme sync determinism**
7. **Monitor coverage thresholds**
8. **Keep Lighthouse performance scores high**
