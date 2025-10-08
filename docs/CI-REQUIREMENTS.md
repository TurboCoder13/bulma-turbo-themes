# CI Requirements and Local Testing Guide

This document outlines the CI requirements and how to test them locally to ensure CI passes.

## 🚀 Quick Start

### Run Full CI Locally

```bash
# Full CI pipeline (includes Lighthouse)
npm run ci:full

# Quick CI (skips cleanup and Lighthouse)
npm run ci:quick

# Individual CI steps
npm run ci
```

## 📋 CI Workflow Requirements

### 1. Quality Check - CI Pipeline (`quality-ci-main.yml`)

**Required Steps:**

- ✅ ESLint linting (`npm run lint`)
- ✅ Prettier formatting (`npm run format`)
- ✅ Markdown linting (`npm run mdlint`)
- ✅ CSS linting (`npm run stylelint`)
- ✅ TypeScript build (`npm run build`)
- ✅ Tests with coverage (`npm test`)
- ✅ CSS budget check (`npm run css:budget`)
- ✅ Jekyll build (`bundle exec jekyll build`)
- ✅ HTMLProofer validation (`bundle exec htmlproofer`)

**Local Testing:**

```bash
npm run ci:quick
# or
./scripts/local/build.sh --quick
```

### 2. Theme Sync Determinism (`quality-theme-sync.yml`)

**Required Steps:**

- ✅ Theme synchronization (`npm run theme:sync`)
- ✅ Check for unstaged changes
- ✅ Quick test suite

**Dependencies:**

- `@catppuccin/palette` package
- `src/themes/packs/` directory
- `src/themes/types.ts` type definitions

**Local Testing:**

```bash
npm run theme:sync
git status --porcelain  # Should be empty
npm test --silent
```

### 3. Lighthouse Performance Analysis (`reporting-lighthouse-ci.yml`)

**Required Steps:**

- ✅ Build site (`./build.sh --no-serve`)
- ✅ Run Lighthouse CI (`npx @lhci/cli autorun`)

**Dependencies:**

- `build.sh` script in root
- `lighthouserc.json` configuration
- `@lhci/cli` package

**Local Testing:**

```bash
./build.sh --no-serve
npx @lhci/cli autorun --config=./lighthouserc.json --collect.numberOfRuns=1
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
npm run build
```

## 🔧 Required Dependencies

### npm Packages

```json
{
  "@catppuccin/palette": "^1.0.0",
  "@lhci/cli": "^0.14.0"
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
build.sh                      # Root build script
lighthouserc.json             # Lighthouse configuration
```

## 🧪 Testing Strategy

### Before Committing

```bash
# Run pre-commit hooks (automatic)
git commit -m "your message"

# Or run manually
npm run ci:quick
```

### Before Pushing

```bash
# Run full CI pipeline
npm run ci:full
```

### Before Release

```bash
# Run all checks including Lighthouse
npm run ci:full
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

**Cause:** Missing `build.sh` script
**Fix:** Create root-level build.sh that calls scripts/local/build.sh

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
npm run lint
npm run format
npm run theme:sync
npm run build
npm test
./build.sh --no-serve
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

1. **Always run `npm run ci:quick` before committing**
2. **Run `npm run ci:full` before pushing**
3. **Keep CI and local scripts in sync**
4. **Document all CI dependencies**
5. **Use pre-commit hooks for basic checks**
6. **Test theme sync determinism**
7. **Monitor coverage thresholds**
8. **Keep Lighthouse performance scores high**
