---
title: Release Process
description: How Turbo Themes versions and releases are managed.
category: contributing
order: 4
prev: contributing/testing
---

# Release Process

This document describes how Turbo Themes versions and releases are managed.

## Versioning

Turbo Themes follows [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.0.0 → 2.0.0): Breaking changes
- **MINOR** (1.0.0 → 1.1.0): New features, backward compatible
- **PATCH** (1.0.0 → 1.0.1): Bug fixes, backward compatible

## Release Schedule

- **Patch releases**: As needed for bug fixes
- **Minor releases**: Monthly for new features
- **Major releases**: Annually or for significant changes

## Release Channels

| Channel | Purpose             | npm Tag  |
| ------- | ------------------- | -------- |
| Stable  | Production-ready    | `latest` |
| Beta    | Pre-release testing | `beta`   |
| Canary  | Bleeding edge       | `canary` |

## For Maintainers

### Creating a Release

1. **Ensure tests pass**

   ```bash
   bun run test
   bun run lint
   ```

2. **Update version**

   ```bash
   bun run version:patch  # or :minor or :major
   ```

3. **Update changelog**

   Edit `CHANGELOG.md` with the new version's changes.

4. **Create release commit**

   ```bash
   git add .
   git commit -m "chore: release v1.2.3"
   ```

5. **Tag the release**

   ```bash
   git tag v1.2.3
   git push origin main --tags
   ```

6. **Publish packages**

   The CI/CD pipeline handles publishing when tags are pushed:
   - npm package
   - RubyGems gem
   - PyPI package
   - Swift Package (GitHub release)

### Changelog Format

```markdown
## [1.2.3] - 2024-01-15

### Added

- New Catppuccin Mocha variant (#123)

### Changed

- Improved contrast ratio in Dracula theme (#124)

### Fixed

- Fixed FOUC in Safari (#125)

### Deprecated

- Legacy storage key migration (will be removed in v2.0)
```

### Hotfix Process

For critical bug fixes:

1. Create branch from latest tag: `git checkout -b hotfix/1.2.4 v1.2.3`
2. Apply fix
3. Bump patch version
4. Create PR to main
5. After merge, tag and release

## Package Distribution

### npm (JavaScript/TypeScript)

```bash
npm publish
```

Published to: https://www.npmjs.com/package/turbo-themes

### RubyGems (Jekyll)

```bash
gem build turbo-themes.gemspec
gem push turbo-themes-1.2.3.gem
```

Published to: https://rubygems.org/gems/turbo-themes

### PyPI (Python)

```bash
cd python
python -m build
twine upload dist/*
```

Published to: https://pypi.org/project/turbo-themes/

### Swift Package

Swift packages are distributed via GitHub releases. The package manifest
(`Package.swift`) points to the repository.

## Breaking Changes

When introducing breaking changes:

1. Document in CHANGELOG with migration guide
2. Add deprecation warnings in previous minor version
3. Update documentation
4. Consider providing codemods for automated migration

### Example Migration Guide

````markdown
## Migrating from v1.x to v2.0

### Token Renames

The following tokens have been renamed:

| Old Name             | New Name               |
| -------------------- | ---------------------- |
| `--turbo-bg-primary` | `--turbo-bg-base`      |
| `--turbo-fg-primary` | `--turbo-text-primary` |

### Storage Key Change

The localStorage key changed from `bulma-theme-flavor` to `turbo-theme`. Migration is
automatic, but you can manually migrate:

```js
const old = localStorage.getItem('bulma-theme-flavor');
if (old) {
  localStorage.setItem('turbo-theme', old);
  localStorage.removeItem('bulma-theme-flavor');
}
```
````

````

## Pre-release Testing

### Beta Release

```bash
bun run version:prerelease --preid=beta
npm publish --tag beta
````

Install with:

```bash
npm install turbo-themes@beta
```

### Canary Release

Canary releases are automatic from main branch commits.

Install with:

```bash
npm install turbo-themes@canary
```

## Rollback Procedure

If a release has critical issues:

1. **Unpublish** (within 72 hours on npm):

   ```bash
   npm unpublish turbo-themes@1.2.3
   ```

2. **Or publish a fixed patch**:

   ```bash
   bun run version:patch
   npm publish
   ```

3. **Deprecate** (if can't unpublish):

   ```bash
   npm deprecate turbo-themes@1.2.3 "Critical bug, please upgrade to 1.2.4"
   ```

## Release Checklist

- [ ] All tests passing
- [ ] Changelog updated
- [ ] Version bumped
- [ ] Documentation updated
- [ ] Breaking changes documented
- [ ] Migration guide (if needed)
- [ ] Release notes written
- [ ] Tagged and pushed
- [ ] Packages published
- [ ] GitHub release created
- [ ] Announcement posted

## Questions?

If you have questions about the release process, open an issue or discussion on GitHub.
