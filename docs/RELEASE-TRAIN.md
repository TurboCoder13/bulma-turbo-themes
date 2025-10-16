# Release Train Documentation

This document describes the complete release train process for bulma-turbo-themes, ensuring consistent and automated releases.

## 🚂 Release Train Flow

The release train follows this sequence:

1. **Semantic PR Title** → 2. **Commit Message** → 3. **Tag Creation** → 4. **Release**

### 1. Semantic PR Title Validation

**Workflow:** `quality-semantic-pr-title.yml`  
**Trigger:** Pull request events (opened, edited, synchronize, reopened, ready_for_review)

**Purpose:** Ensures PR titles follow Conventional Commits format

**Allowed Types:**

- `chore` - Maintenance tasks
- `ci` - CI/CD changes
- `docs` - Documentation updates
- `feat` - New features
- `fix` - Bug fixes
- `perf` - Performance improvements
- `refactor` - Code refactoring
- `revert` - Revert previous changes
- `style` - Code style changes
- `test` - Test updates

**Format:** `type(scope): description`

**Examples:**

- ✅ `feat: add dark mode theme`
- ✅ `fix(auth): resolve login issue`
- ✅ `docs: update installation guide`
- ❌ `Add new feature` (missing type)
- ❌ `feat add dark mode` (missing colon)

### 2. Commit Message Validation

**Workflow:** `quality-ci-main.yml`  
**Trigger:** Pull request events

**Purpose:** Validates that commit messages match PR titles and follow Conventional Commits

**Validation Process:**

1. Extracts commit messages between base branch and PR head
2. Validates each commit against Conventional Commits pattern
3. Ensures consistency with PR title validation rules
4. Reports validation results in CI logs

**Script:** `scripts/ci/validate-commit-messages.sh`

### 3. Semantic Release Trigger Verification

**Workflow:** `quality-ci-main.yml`  
**Trigger:** Pull request events

**Purpose:** Analyzes if commits will trigger a semantic release

**Release Rules:**

- `feat:` → **Minor** version bump
- `fix:` → **Patch** version bump
- `perf:` → **Patch** version bump
- `refactor:` → **Patch** version bump
- `revert:` → **Patch** version bump
- `build:` → **Patch** version bump
- `BREAKING CHANGE` → **Major** version bump
- `docs:`, `style:`, `test:`, `ci:`, `chore:` → **No release**

**Script:** `scripts/ci/verify-semantic-release-trigger.sh`

### 4. Automatic Tag Creation & Release

**Workflow:** `release-semantic-release.yml`  
**Trigger:** Push to `main` branch

**Purpose:** Automatically creates releases based on commit analysis

**Process:**

1. **Quality Gate** - Runs linting, formatting, and tests
2. **Build** - Compiles TypeScript and builds Jekyll site
3. **SBOM Generation** - Creates Software Bill of Materials
4. **Semantic Release** - Analyzes commits and determines version
5. **Tag Creation** - Creates git tag (e.g., `v1.2.3`)
6. **CHANGELOG** - Updates CHANGELOG.md
7. **npm Publish** - Publishes to npm registry
8. **GitHub Release** - Creates GitHub release with SBOM artifacts

**Configuration:** `.releaserc.json`

### 5. Tag-Triggered Publishing

**Workflow:** `publish-npm-on-tag.yml`  
**Trigger:** Tag push (`v*.*.*`)

**Purpose:** Publishes to npm and creates GitHub releases

**Process:**

1. **Quality Gate** - Re-runs quality checks
2. **Build** - Rebuilds artifacts
3. **SBOM Generation** - Recreates SBOM files
4. **npm Publish** - Publishes with provenance
5. **GitHub Release** - Creates release with signed SBOM artifacts

## 🔧 Configuration Files

### `.releaserc.json`

Semantic Release configuration defining:

- Release rules for commit types
- CHANGELOG generation
- npm publishing settings
- GitHub release assets

### `.github/workflows/quality-semantic-pr-title.yml`

PR title validation using `TurboCoder13/py-lintro` action

### `.github/workflows/quality-ci-main.yml`

Main CI pipeline with commit validation and release trigger verification

### `.github/workflows/release-semantic-release.yml`

Automatic semantic release workflow

### `.github/workflows/publish-npm-on-tag.yml`

Tag-triggered publishing workflow

## 📋 Release Types

### Major Release (`v2.0.0`)

Triggered by:

- `BREAKING CHANGE:` in commit message
- `feat!:` with breaking change description

### Minor Release (`v1.2.0`)

Triggered by:

- `feat:` commits

### Patch Release (`v1.1.1`)

Triggered by:

- `fix:` commits
- `perf:` commits
- `refactor:` commits
- `revert:` commits
- `build:` commits

### No Release

These commit types do not trigger releases:

- `docs:` - Documentation updates
- `style:` - Code style changes
- `test:` - Test updates
- `ci:` - CI/CD changes
- `chore:` - Maintenance tasks

## 🚨 Validation Failures

### PR Title Validation Failure

- PR cannot be merged
- Comment posted explaining the issue
- Must fix title to continue

### Commit Message Validation Failure

- CI pipeline fails
- Must fix commit messages
- Use `git rebase -i` to amend commit messages

### Release Trigger Verification

- Informational only
- Shows whether commits will trigger a release
- Does not block PR merging

## 🔍 Troubleshooting

### Commit Messages Don't Match PR Title

1. Ensure commit messages follow same format as PR title
2. Use `git rebase -i` to amend commit messages
3. Force push to update PR

### Release Not Triggered

1. Check commit types against release rules
2. Ensure commits are on `main` branch
3. Verify semantic release workflow ran successfully

### Tag Created But No Release

1. Check `publish-npm-on-tag.yml` workflow
2. Verify npm token permissions
3. Check GitHub release creation

## 📚 Best Practices

### For Contributors

1. **Use Conventional Commits** - Follow the format strictly
2. **Match PR Title to Commits** - Ensure consistency
3. **Test Locally** - Run `npm run ci:quick` before pushing
4. **Review Release Impact** - Understand what your changes will trigger

### For Maintainers

1. **Monitor Release Workflows** - Ensure they run successfully
2. **Review SBOM Signatures** - Verify security artifacts
3. **Check npm Publishing** - Verify package availability
4. **Update Documentation** - Keep this guide current

## 🔗 Related Documentation

- [CONTRIBUTING.md](../CONTRIBUTING.md) - Contribution guidelines
- [CI-REQUIREMENTS.md](../docs/CI-REQUIREMENTS.md) - CI pipeline details
- [LOCAL-CI-SETUP.md](../docs/LOCAL-CI-SETUP.md) - Local development setup
- [Workflows README](../.github/workflows/README.md) - Workflow documentation
