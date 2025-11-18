# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog and this project adheres to SemVer.

## [Unreleased]

### Added

- TBD

## [0.8.2] - 2025-11-18

### 🐛 Fixed

- correct JavaScript reference in gem layout (#106)

### 🔧 Changed

- update actions/setup-node digest to 2028fbc (#108)

## [0.8.2] - 2025-11-16

### 🐛 Fixed

- correct JavaScript reference in gem layout (#106)

## [0.8.1] - 2025-11-16

### 🐛 Fixed

- update OpenSSF badge to Best Practices (#104)

## [0.8.0] - 2025-11-16

### ✨ Added

- include layouts and data files in gem

## [0.7.4] - 2025-11-16

### 🐛 Fixed

- add missing RubyGems endpoints to build job egress policy

## [0.7.3] - 2025-11-16

### 🐛 Fixed

- allow bundler download cdn

## [0.7.2] - 2025-11-16

### 🐛 Fixed

- allow release assets for gem publish

## [0.7.1] - 2025-11-16

### 🐛 Fixed

- add cache.ruby-lang.org to publish job egress policy

## [0.7.0] - 2025-11-16

### ✨ Added

- implement enterprise-level build/publish separation

## [0.6.5] - 2025-11-16

### 🐛 Fixed

- add Rakefile and build-gem.sh documentation
- improve Rakefile with best practices
- add Rakefile and use release-gem action for trusted publishing

## [0.6.4] - 2025-11-16

### 🐛 Fixed

- use configure-rubygems-credentials for OIDC auth

## [0.6.3] - 2025-11-16

### 🐛 Fixed

- use OIDC trusted publisher for RubyGems release

### 🔧 Changed

- resolve workflow failures in gem publishing and release creation

## [0.6.2] - 2025-11-16

### 🐛 Fixed

- add missing network endpoints for publish workflows
- Lighthouse reports not appearing on site and deploy-pages Ruby version

## [0.6.2] - 2025-11-16

### 🐛 Fixed

- add missing network endpoints for publish workflows
- Lighthouse reports not appearing on site and deploy-pages Ruby version

## [0.6.1] - 2025-11-16

### 🐛 Fixed

- add missing id-token permission and correct Ruby version

## [0.6.0] - 2025-11-16

### ✨ Added

- use GitHub App for release automation matching py-lintro pattern

### 🐛 Fixed

- prevent version PR infinite loop and add download retry logic

## [0.5.2] - 2025-11-15

### 🐛 Fixed

- handle existing PR gracefully in version bump workflow
- add actions:write permission for workflow_dispatch triggers

## [0.5.2] - 2025-11-15

### 🐛 Fixed

- add actions:write permission for workflow_dispatch triggers

## [0.5.2] - 2025-11-15

### 🐛 Fixed

- trigger publish workflows directly after tag creation

## [0.5.1] - 2025-11-15

### 🐛 Fixed

- trigger publish workflows directly after tag creation

## [0.5.0] - 2025-11-15

### ✨ Added

- implement Jekyll gem wrapper for bulma-turbo-themes (#80)
- add comprehensive Playwright E2E test suite with accessibility checks (#44)
- implement PR-based release workflow system (#31)

### 🐛 Fixed

- skip pre-commit hooks in automated version PR creation
- optimize complete release train workflow pipeline (#86)
- separate CI build script from local development build (#84)
- fix version PR branch checkout failure (#85)
- add CI environment detection and explicit --no-serve flag (#82)
- add checkout step to deployment workflows (#81)
- add Playwright browser caching and skip E2E tests in build workflow (#79)
- resolve hadolint binary naming and checksum verification issues (#78)
- remove monitoring uptime workflow (#30)

### 🔧 Changed

- update dependency ruby to v3.4.7 (#83)
- update ossf/scorecard-action digest to 4eaacf0 (#72)
- update softprops/action-gh-release digest to 5be0e66 (#76)
- update turbocoder13/py-lintro digest to b3fb40d (#77)
- update actions/download-artifact digest (#71)
- update actions/checkout digest to 08c6903 (#70)
- update dependency ruby (#68)
- update dependency jsdom to v27.1.0 (#67)
- update dependency eslint to v9.39.1 (#65)
- update dependency html-proofer to v5.1.0 (#66)
- update dependency happy-dom to v20.0.10 (#57)
- update softprops/action-gh-release digest to 00362be (#55)
- update github artifact actions (#60)
- update turbocoder13/py-lintro digest to 1e25709 (#56)
- update actions/setup-node action to v6 (#58)
- update actions/upload-pages-artifact action to v4 (#59)
- update github/codeql-action digest to 71d0a56 (#61)
- update peter-evans/create-or-update-comment action to v5 (#62)
- update peter-evans/find-comment action to v4 (#63)
- update sigstore/cosign-installer action to v4 (#64)
- update ruby/setup-ruby digest to d5126b9 (#54)
- update ossf/scorecard-action digest to ee561a8 (#53)
- update actions/checkout digest to ff7abcd (#45)
- update actions/github-script digest to ed59741 (#48)
- update actions/upload-artifact digest to 330a01c (#52)
- update actions/setup-node digest to dda4788 (#51)
- update github/codeql-action digest to ae78991 (#50)
- update actions/download-artifact digest to 018cc2c (#49)
- update actions/github-script action to v8 (#47)
- update actions/checkout action to v5 (#46)
- update sigstore/cosign-installer action to v3.10.1 (#43)
- update dependency happy-dom to v20.0.8 (#42)
- update codecov/codecov-action action to v5.5.1 (#41)
- update actions/upload-artifact action to v4.6.2 (#40)
- update actions/setup-node action to v4.4.0 (#39)
- update actions/upload-artifact digest to 2848b2c (#38)
- check for existing remote branch before creating local one (#36)
- update actions/github-script digest to ed59741 (#33)
- update actions/checkout digest to ff7abcd (#32)
- update dependency stylelint-config-standard to v39 (#29)
- update dependency lint-staged to v16 (#28)
- update typescript-eslint monorepo to v8.46.1 (#27)
- update dependency ruby to v3.4.7 (#26)
- update dependency eslint to v9.38.0 (#25)

## [0.4.0] - 2025-10-21

### ✨ Added

- implement PR-based release workflow system (#31)

### 🐛 Fixed

- remove monitoring uptime workflow (#30)

### 🔧 Changed

- update actions/setup-node action to v4.4.0 (#39)
- update actions/upload-artifact digest to 2848b2c (#38)
- check for existing remote branch before creating local one (#36)
- update actions/github-script digest to ed59741 (#33)
- update actions/checkout digest to ff7abcd (#32)
- update dependency stylelint-config-standard to v39 (#29)
- update dependency lint-staged to v16 (#28)
- update typescript-eslint monorepo to v8.46.1 (#27)
- update dependency ruby to v3.4.7 (#26)
- update dependency eslint to v9.38.0 (#25)

## [0.4.0] - 2025-10-21

### ✨ Added

- implement PR-based release workflow system (#31)

### 🐛 Fixed

- remove monitoring uptime workflow (#30)

### 🔧 Changed

- update actions/upload-artifact digest to 2848b2c (#38)
- check for existing remote branch before creating local one (#36)
- update actions/github-script digest to ed59741 (#33)
- update actions/checkout digest to ff7abcd (#32)
- update dependency stylelint-config-standard to v39 (#29)
- update dependency lint-staged to v16 (#28)
- update typescript-eslint monorepo to v8.46.1 (#27)
- update dependency ruby to v3.4.7 (#26)
- update dependency eslint to v9.38.0 (#25)

## [0.4.0] - 2025-10-19

### ✨ Added

- implement PR-based release workflow system (#31)

### 🐛 Fixed

- remove monitoring uptime workflow (#30)

### 🔧 Changed

- check for existing remote branch before creating local one (#36)
- update actions/github-script digest to ed59741 (#33)
- update actions/checkout digest to ff7abcd (#32)
- update dependency stylelint-config-standard to v39 (#29)
- update dependency lint-staged to v16 (#28)
- update typescript-eslint monorepo to v8.46.1 (#27)
- update dependency ruby to v3.4.7 (#26)
- update dependency eslint to v9.38.0 (#25)

## [0.4.0] - 2025-10-19

### ✨ Added

- implement PR-based release workflow system (#31)

### 🐛 Fixed

- remove monitoring uptime workflow (#30)

### 🔧 Changed

- update actions/github-script digest to ed59741 (#33)
- update actions/checkout digest to ff7abcd (#32)
- update dependency stylelint-config-standard to v39 (#29)
- update dependency lint-staged to v16 (#28)
- update typescript-eslint monorepo to v8.46.1 (#27)
- update dependency ruby to v3.4.7 (#26)
- update dependency eslint to v9.38.0 (#25)

## [0.3.0] - 2025-10-19

### ✨ Added

- implement PR-based release workflow system (#31)

### 🐛 Fixed

- remove monitoring uptime workflow (#30)

### 🔧 Changed

- update actions/github-script digest to ed59741 (#33)
- update actions/checkout digest to ff7abcd (#32)
- update dependency stylelint-config-standard to v39 (#29)
- update dependency lint-staged to v16 (#28)
- update typescript-eslint monorepo to v8.46.1 (#27)
- update dependency ruby to v3.4.7 (#26)
- update dependency eslint to v9.38.0 (#25)

## [0.2.0] - 2025-10-19

### ✨ Added

- implement PR-based release workflow system (#31)

### 🐛 Fixed

- remove monitoring uptime workflow (#30)

### 🔧 Changed

- update actions/github-script digest to ed59741 (#33)
- update actions/checkout digest to ff7abcd (#32)
- update dependency stylelint-config-standard to v39 (#29)
- update dependency lint-staged to v16 (#28)
- update typescript-eslint monorepo to v8.46.1 (#27)
- update dependency ruby to v3.4.7 (#26)
- update dependency eslint to v9.38.0 (#25)

## [0.1.0] - 2025-10-04

### Added

- Initial project setup, demo site, themes, and selector
