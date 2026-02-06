# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog and this project adheres to SemVer.

## [Unreleased]

### Added

- TBD

## [0.16.0] - 2026-02-06

### ✨ Added

- add Solarized theme pack with light and dark variants (#333)
- add Nord arctic color palette theme (#330)
- add Rosé Pine theme pack with auto-sync (#328)
- rebrand from bulma-turbo-themes to turbo-themes with multi-platform support (#182)
- add full theming solution with context and hooks (#151)
- migrate theme system to SASS (#143)
- include layouts and data files in gem
- implement enterprise-level build/publish separation
- use GitHub App for release automation matching py-lintro pattern
- implement Jekyll gem wrapper for bulma-turbo-themes (#80)
- add comprehensive Playwright E2E test suite with accessibility checks (#44)
- implement PR-based release workflow system (#31)
- deploy coverage and lighthouse reports to GitHub Pages (#24)
- fix navbar theme icon display and add Bulma logos
- add themes package source

### 🐛 Fixed

- restructure CODEOWNERS to match py-lintro pattern
- emit component CSS variables for all themes, not just those with components (#334)
- update dependency bun to v1.3.8 (#313)
- sync tokens.json version during release (#315)
- inline internal package dependencies with Vite (#312)
- add missing endpoints to Scorecard workflow (#309)
- update renovatebot/github-action action to v44.2.6 (#294)
- update step-security/harden-runner action to v2.14.1 (#295)
- update actions/setup-node action to v6.2.0 (#296)
- update peter-evans/create-pull-request action to v8.1.0 (#297)
- update ruby/setup-ruby action to v1.287.0 (#298)
- update react monorepo (#293)
- include packages/core/dist in npm package files (#299)
- apply shfmt and shellcheck fixes across scripts (#300)
- update turbocoder13/py-lintro digest to c2a95e1 (#210)
- use GitHub-hosted runner for npm publish provenance (#289)
- migrate workflows to Blacksmith runners (#286)
- update dependency lintro to v0.38.0 (#259)
- update dependency @playwright/test to v1.58.0 (#257)
- pin Ruby to 4.0.0 for GitHub Actions (#283)
- improve Lighthouse report generation resilience (#282)
- update dependency ruby to v4.0.1 (#241)
- update dependency happy-dom to v20.3.9 (#249)
- correct scroll drift assertion boundary condition (#279)
- update dependency lightningcss to v1.31.1 (#251)
- add artifact fallback and fix docs navigation links (#263)
- update vitest monorepo to v4.0.18 (#261)
- update github/codeql-action action to v4.31.11 (#260)
- update dependency style-dictionary to v5.2.0 (#250)
- update dependency sass to v1.97.3 (#255)
- update actions/checkout action to v6.0.2 (#254)
- update renovatebot/github-action action to v44.2.5 (#253)
- update dependency @types/react to v19.2.9 (#252)
- update oven-sh/setup-bun action to v2.1.2 (#247)
- update dependency @testing-library/react to v16.3.2 (#246)
- update dependency concurrently to v9.2.1 (#242)
- update actions/cache action to v5.0.2 (#239)
- update actions/setup-node digest to 6044e13 (#238)
- update dependency ruby to v4 (#199)
- update dependency bun to v1.3.6 (#220)
- modernize for multi-platform focus (#233)
- restore Node 24 for npm publish with OIDC provenance (#231)
- resolve version sync and build failures (#229)
- resolve OIDC publishing and version sync issues (#227)
- use OIDC for npm and remove duplicate publish job (#225)
- exclude Jekyll test dir and skip Ruby in Python publish (#223)
- generate Lighthouse index.html and improve Swift coverage (#221)
- fix search and add multi-language coverage reports (#219)
- lock file maintenance (#171)
- use baseUrl for all internal navigation links
- update docs and workflows for universal package focus (#218)
- add workflow for generating E2E snapshots (#215)
- update github/codeql-action action to v4.31.10 (#217)
- update dependency bun to v1.3.6 (#216)
- update softprops/action-gh-release digest to 78237c5 (#214)
- update ruby/setup-ruby action to v1.281.0 (#213)
- update ruby/setup-ruby action to v1.280.0 (#212)
- update astral-sh/setup-uv action to v7.2.0 (#211)
- update actions/github-script digest to 450193c (#209)
- update ruby/setup-ruby action to v1.279.0 (#208)
- update renovatebot/github-action action to v44.2.3 (#206)
- update oven-sh/setup-bun action to v2.1.0 (#205)
- update turbocoder13/py-lintro digest to 05d996c (#204)
- update ruby/setup-ruby action to v1.278.0 (#203)
- update renovatebot/github-action action to v44.2.2 (#202)
- update ruby/setup-ruby action to v1.276.0 (#201)
- update turbocoder13/py-lintro digest to 0376ea5 (#200)
- update renovatebot/github-action action to v44.2.1 (#198)
- update turbocoder13/py-lintro digest to 0304bb5 (#197)
- update ruby/setup-ruby action to v1.275.0 (#196)
- update softprops/action-gh-release digest to 5122b4e (#195)
- update peter-evans/create-pull-request action to v8 (#194)
- update actions/setup-node digest (#193)
- update github artifact actions (#192)
- update dependency bun to v1.3.5 (#191)
- update actions/cache action to v5 (#189)
- update github/codeql-action action to v4.31.9 (#190)
- update turbocoder13/py-lintro digest to 12e0051 (#185)
- update renovatebot/github-action action to v44.2.0 (#188)
- update step-security/harden-runner action to v2.14.0 (#186)
- update ruby/setup-ruby action to v1.270.0 (#181)
- update astral-sh/setup-uv action to v7.1.6 (#184)
- update actions/download-artifact digest to 37930b1 (#183)
- update github/codeql-action action to v4.31.8 (#180)
- update dependency bun to v1.3.4 (#179)
- update codecov/codecov-action action to v5.5.2 (#178)
- update actions/setup-node action to v6.1.0 (#176)
- update turbocoder13/py-lintro digest to d2f79fd (#175)
- update astral-sh/setup-uv action to v7.1.5 (#174)
- update softprops/action-gh-release digest to 60cfd9a (#172)
- update renovatebot/github-action action to v44.0.5 (#173)
- update oven-sh/setup-bun action to v2.0.2 (#168)
- update actions/create-github-app-token action to v2.2.1 (#169)
- update github/codeql-action action to v4.31.7 (#167)
- update react monorepo to v19 (#165)
- update renovatebot/github-action digest to 4ebebab (#141)
- update actions/create-github-app-token action to v2 (#162)
- update actions/checkout action to v6 (#160)
- update softprops/action-gh-release digest to a06a81a (#142)
- update actions/checkout action to v5.0.1 (#144)
- update astral-sh/setup-uv action to v7.1.4 (#145)
- update actions/create-github-app-token action to v1.12.0 (#153)
- recognize scoped conventional commits in version bump (#154)
- update peter-evans/create-pull-request action to v7.0.11 (#148)
- add missing egress endpoints for Bun CDN downloads
- add missing egress endpoints for Bun download (#149)
- enable platformCommit for Renovate to sign commits
- update actions/setup-node digest to 633bb92 (#110)
- update peter-evans/create-pull-request digest to 271a8d0 (#109)
- update actions/setup-node digest to 2028fbc (#108)
- correct JavaScript reference in gem layout (#106)
- update OpenSSF badge to Best Practices (#104)
- add missing RubyGems endpoints to build job egress policy
- allow bundler download cdn
- allow release assets for gem publish
- add cache.ruby-lang.org to publish job egress policy
- add Rakefile and build-gem.sh documentation
- improve Rakefile with best practices
- add Rakefile and use release-gem action for trusted publishing
- use configure-rubygems-credentials for OIDC auth
- use OIDC trusted publisher for RubyGems release
- resolve workflow failures in gem publishing and release creation
- add missing network endpoints for publish workflows
- Lighthouse reports not appearing on site and deploy-pages Ruby version
- add missing id-token permission and correct Ruby version
- prevent version PR infinite loop and add download retry logic
- handle existing PR gracefully in version bump workflow
- add actions:write permission for workflow_dispatch triggers
- trigger publish workflows directly after tag creation
- skip pre-commit hooks in automated version PR creation
- optimize complete release train workflow pipeline (#86)
- separate CI build script from local development build (#84)
- fix version PR branch checkout failure (#85)
- add CI environment detection and explicit --no-serve flag (#82)
- update dependency ruby to v3.4.7 (#83)
- add checkout step to deployment workflows (#81)
- add Playwright browser caching and skip E2E tests in build workflow (#79)
- resolve hadolint binary naming and checksum verification issues (#78)
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
- remove monitoring uptime workflow (#30)
- update dependency stylelint-config-standard to v39 (#29)
- update dependency lint-staged to v16 (#28)
- update typescript-eslint monorepo to v8.46.1 (#27)
- update dependency ruby to v3.4.7 (#26)
- update dependency eslint to v9.38.0 (#25)
- make Node.js cache failure non-blocking and handle missing SBOM artifacts (#23)
- correct npm flag syntax in GitHub Actions workflows (#22)
- update actions/github-script action to v7.1.0 (#21)
- resolve theme selector baseurl handling in production deployment (#19)
- update turbocoder13/py-lintro digest to 7e4e498 (#20)
- resolve HTMLProofer CI failures and implement tiered link validation (#18)
- resolve HTMLProofer failures due to network timeouts in CI (#17)
- enhance Lighthouse CI reporting and fix GitHub Pages deployment (#15)
- resolve HTMLProofer CI failures and Jekyll site issues (#3)
- update dependency markdownlint-cli to ^0.45.0 (#8)
- update dependency happy-dom to v20 [security] (#6)
- update ruby docker tag to v3.4 (#11)
- update typescript-eslint monorepo to v8.46.1 (#14)
- update actions/download-artifact action to v4.3.0 (#13)
- update actions/checkout action to v4.3.0 (#12)
- update turbocoder13/py-lintro digest to 2d31e19 (#10)
- update step-security/harden-runner digest to 92c522a (#9)
- update ossf/scorecard-action digest to 2a21071 (#5)
- update github/codeql-action digest to 17783bf (#4)
- update softprops/action-gh-release digest to 7b4da11 (#7)
- update .gitignore rules
- update README
- add static site sources
- add community and governance docs

### 🔧 Changed

- switch from Blacksmith to GitHub runners (#317)
- enforce 85% coverage and expand unit tests
- add unit tests

## [0.15.1] - 2026-02-06

### 🐛 Fixed

- emit component CSS variables for all themes, not just those with components (#334)

## [0.15.0] - 2026-02-06

### ✨ Added

- add Solarized theme pack with light and dark variants (#333)

## [0.14.0] - 2026-02-05

### ✨ Added

- add Nord arctic color palette theme (#330)

## [0.13.0] - 2026-02-05

### ✨ Added

- add Rosé Pine theme pack with auto-sync (#328)

### 🔧 Changed

- switch from Blacksmith to GitHub runners (#317)

## [0.12.33] - 2026-02-02

### 🐛 Fixed

- update dependency bun to v1.3.8 (#313)

## [0.12.32] - 2026-02-02

### 🐛 Fixed

- sync tokens.json version during release (#315)

## [0.12.32] - 2026-02-02

### 🐛 Fixed

- regenerate tokens.json for v0.12.31

## [0.12.31] - 2026-01-30

### 🐛 Fixed

- use bun instead of npm for pack tests
- inline internal package dependencies with Vite

## [0.12.30] - 2026-01-30

### 🐛 Fixed

- add missing endpoints to Scorecard workflow (#309)

## [0.12.29] - 2026-01-30

### 🐛 Fixed

- update renovatebot/github-action action to v44.2.6 (#294)

## [0.12.28] - 2026-01-30

### 🐛 Fixed

- update step-security/harden-runner action to v2.14.1 (#295)

## [0.12.27] - 2026-01-30

### 🐛 Fixed

- update actions/setup-node action to v6.2.0 (#296)

## [0.12.26] - 2026-01-30

### 🐛 Fixed

- update peter-evans/create-pull-request action to v8.1.0 (#297)

## [0.12.25] - 2026-01-30

### 🐛 Fixed

- update ruby/setup-ruby action to v1.287.0 (#298)

## [0.12.24] - 2026-01-30

### 🐛 Fixed

- update react monorepo (#293)

## [0.12.23] - 2026-01-30

### 🐛 Fixed

- apply shfmt and shellcheck fixes across scripts (#300)

## [0.12.22] - 2026-01-28

### 🐛 Fixed

- update turbocoder13/py-lintro digest to c2a95e1 (#210)

## [0.12.21] - 2026-01-28

### 🐛 Fixed

- use GitHub-hosted runner for npm publish provenance (#289)

## [0.12.20] - 2026-01-28

### 🐛 Fixed

- migrate workflows to Blacksmith runners (#286)

## [0.12.19] - 2026-01-28

### 🐛 Fixed

- update dependency lintro to v0.38.0 (#259)

## [0.12.18] - 2026-01-28

### 🐛 Fixed

- update dependency @playwright/test to v1.58.0 (#257)

## [0.12.17] - 2026-01-27

### 🐛 Fixed

- pin Ruby to 4.0.0 for GitHub Actions (#283)

## [0.12.16] - 2026-01-27

### 🐛 Fixed

- improve Lighthouse report generation resilience (#282)
- update dependency ruby to v4.0.1 (#241)

## [0.12.16] - 2026-01-27

### 🐛 Fixed

- update dependency ruby to v4.0.1 (#241)

## [0.12.15] - 2026-01-27

### 🐛 Fixed

- update dependency happy-dom to v20.3.9 (#249)

## [0.12.14] - 2026-01-26

### 🐛 Fixed

- correct scroll drift assertion boundary condition (#279)
- update dependency lightningcss to v1.31.1 (#251)

## [0.12.14] - 2026-01-26

### 🐛 Fixed

- update dependency lightningcss to v1.31.1 (#251)

## [0.12.13] - 2026-01-26

### 🐛 Fixed

- add artifact fallback and fix docs navigation links (#263)
- update vitest monorepo to v4.0.18 (#261)
- update github/codeql-action action to v4.31.11 (#260)

## [0.12.13] - 2026-01-26

### 🐛 Fixed

- update vitest monorepo to v4.0.18 (#261)
- update github/codeql-action action to v4.31.11 (#260)

## [0.12.13] - 2026-01-26

### 🐛 Fixed

- update github/codeql-action action to v4.31.11 (#260)

## [0.12.12] - 2026-01-24

### 🐛 Fixed

- update dependency style-dictionary to v5.2.0 (#250)

## [0.12.11] - 2026-01-24

### 🐛 Fixed

- update dependency sass to v1.97.3 (#255)

## [0.12.10] - 2026-01-24

### 🐛 Fixed

- update actions/checkout action to v6.0.2 (#254)
- update renovatebot/github-action action to v44.2.5 (#253)
- update dependency @types/react to v19.2.9 (#252)
- update oven-sh/setup-bun action to v2.1.2 (#247)
- update dependency @testing-library/react to v16.3.2 (#246)

## [0.12.10] - 2026-01-23

### 🐛 Fixed

- update renovatebot/github-action action to v44.2.5 (#253)
- update dependency @types/react to v19.2.9 (#252)
- update oven-sh/setup-bun action to v2.1.2 (#247)
- update dependency @testing-library/react to v16.3.2 (#246)

## [0.12.10] - 2026-01-23

### 🐛 Fixed

- update dependency @types/react to v19.2.9 (#252)
- update oven-sh/setup-bun action to v2.1.2 (#247)
- update dependency @testing-library/react to v16.3.2 (#246)

## [0.12.10] - 2026-01-21

### 🐛 Fixed

- update oven-sh/setup-bun action to v2.1.2 (#247)
- update dependency @testing-library/react to v16.3.2 (#246)

## [0.12.10] - 2026-01-21

### 🐛 Fixed

- update dependency @testing-library/react to v16.3.2 (#246)

## [0.12.9] - 2026-01-20

### 🐛 Fixed

- update dependency concurrently to v9.2.1 (#242)
- update actions/cache action to v5.0.2 (#239)
- update actions/setup-node digest to 6044e13 (#238)

## [0.12.9] - 2026-01-20

### 🐛 Fixed

- update dependency concurrently to v9.2.1 (#242)
- update actions/cache action to v5.0.2 (#239)
- update actions/setup-node digest to 6044e13 (#238)

## [0.12.9] - 2026-01-20

### 🐛 Fixed

- update actions/cache action to v5.0.2 (#239)
- update actions/setup-node digest to 6044e13 (#238)

## [0.12.9] - 2026-01-19

### 🐛 Fixed

- update actions/cache action to v5.0.2 (#239)
- update actions/setup-node digest to 6044e13 (#238)

## [0.12.9] - 2026-01-18

### 🐛 Fixed

- update actions/cache action to v5.0.2 (#239)
- update actions/setup-node digest to 6044e13 (#238)

## [0.12.9] - 2026-01-18

### 🐛 Fixed

- update actions/setup-node digest to 6044e13 (#238)

## [0.12.8] - 2026-01-17

### 🐛 Fixed

- update dependency ruby to v4 (#199)

## [0.12.7] - 2026-01-16

### 🐛 Fixed

- update dependency bun to v1.3.6 (#220)

## [0.12.6] - 2026-01-16

### 🐛 Fixed

- modernize for multi-platform focus (#233)

## [0.12.5] - 2026-01-16

### 🐛 Fixed

- restore Node 24 for npm publish with OIDC provenance (#231)

## [0.12.4] - 2026-01-16

### 🐛 Fixed

- resolve version sync and build failures (#229)

## [0.12.3] - 2026-01-16

### 🐛 Fixed

- resolve OIDC publishing and version sync issues (#227)

## [0.12.2] - 2026-01-16

### 🐛 Fixed

- use OIDC for npm and remove duplicate publish job (#225)

## [0.12.1] - 2026-01-16

### 🐛 Fixed

- exclude Jekyll test dir and skip Ruby in Python publish (#223)

## [0.12.0] - 2026-01-16

### ✨ Added

- rebrand from bulma-turbo-themes to turbo-themes with multi-platform support (#182)

### 🐛 Fixed

- generate Lighthouse index.html and improve Swift coverage (#221)
- fix search and add multi-language coverage reports (#219)
- lock file maintenance (#171)
- use baseUrl for all internal navigation links
- update docs and workflows for universal package focus (#218)
- add workflow for generating E2E snapshots (#215)
- update github/codeql-action action to v4.31.10 (#217)
- update dependency bun to v1.3.6 (#216)
- update softprops/action-gh-release digest to 78237c5 (#214)
- update ruby/setup-ruby action to v1.281.0 (#213)
- update ruby/setup-ruby action to v1.280.0 (#212)
- update astral-sh/setup-uv action to v7.2.0 (#211)
- update actions/github-script digest to 450193c (#209)
- update ruby/setup-ruby action to v1.279.0 (#208)
- update renovatebot/github-action action to v44.2.3 (#206)
- update oven-sh/setup-bun action to v2.1.0 (#205)
- update lgtm-hq/py-lintro digest to 05d996c (#204)
- update ruby/setup-ruby action to v1.278.0 (#203)
- update renovatebot/github-action action to v44.2.2 (#202)
- update ruby/setup-ruby action to v1.276.0 (#201)
- update lgtm-hq/py-lintro digest to 0376ea5 (#200)
- update renovatebot/github-action action to v44.2.1 (#198)
- update lgtm-hq/py-lintro digest to 0304bb5 (#197)
- update ruby/setup-ruby action to v1.275.0 (#196)
- update softprops/action-gh-release digest to 5122b4e (#195)
- update peter-evans/create-pull-request action to v8 (#194)
- update actions/setup-node digest (#193)
- update github artifact actions (#192)
- update dependency bun to v1.3.5 (#191)
- update actions/cache action to v5 (#189)
- update github/codeql-action action to v4.31.9 (#190)
- update lgtm-hq/py-lintro digest to 12e0051 (#185)
- update renovatebot/github-action action to v44.2.0 (#188)
- update step-security/harden-runner action to v2.14.0 (#186)
- update ruby/setup-ruby action to v1.270.0 (#181)
- update astral-sh/setup-uv action to v7.1.6 (#184)
- update actions/download-artifact digest to 37930b1 (#183)
- update github/codeql-action action to v4.31.8 (#180)
- update dependency bun to v1.3.4 (#179)
- update codecov/codecov-action action to v5.5.2 (#178)
- update actions/setup-node action to v6.1.0 (#176)
- update lgtm-hq/py-lintro digest to d2f79fd (#175)
- update astral-sh/setup-uv action to v7.1.5 (#174)
- update softprops/action-gh-release digest to 60cfd9a (#172)
- update renovatebot/github-action action to v44.0.5 (#173)
- update oven-sh/setup-bun action to v2.0.2 (#168)
- update actions/create-github-app-token action to v2.2.1 (#169)
- update github/codeql-action action to v4.31.7 (#167)

## [0.11.0] - 2026-01-XX

### Changed

- BREAKING: Restructured to monorepo architecture with workspace-based packages
- BREAKING: Refactored theme selector into focused modules (packages/theme-selector/)
- BREAKING: Moved Jekyll site to apps/site/ directory
- BREAKING: Reorganized build scripts to generators/ directory
- BREAKING: Moved adapters to packages/adapters/ (tailwind, bulma, bootstrap)
- BREAKING: Core tokens and themes now in packages/core/
- Updated Ruby gem build process to copy Jekyll files from apps/site/ during gem build
- Updated GitHub Pages deployment workflow to build from apps/site/
- Updated E2E test scripts to reference apps/site/\_site

### Added

- Workspace-based package structure for better code organization
- Clear separation between core tokens (@lgtm-hq/turbo-themes-core) and UI components
  (@turbocoder13/turbo-theme-selector)
- Package-level test configurations with vitest
- Generators directory for code generation scripts (python, swift, sass)

### Fixed

- Improved build order to ensure packages are built before root package
- Updated all import paths to use .js extensions for ES modules
- Fixed generator script paths to work with new monorepo structure

## [0.10.8] - 2025-12-05

### 🐛 Fixed

- update react monorepo to v19 (#165)

## [0.10.7] - 2025-12-05

### 🐛 Fixed

- update renovatebot/github-action digest to 4ebebab (#141)

## [0.10.6] - 2025-12-05

### 🐛 Fixed

- update actions/create-github-app-token action to v2 (#162)

## [0.10.5] - 2025-12-05

### 🐛 Fixed

- update actions/checkout action to v6 (#160)

## [0.10.4] - 2025-12-05

### 🐛 Fixed

- update softprops/action-gh-release digest to a06a81a (#142)

## [0.10.3] - 2025-12-05

### 🐛 Fixed

- update actions/checkout action to v5.0.1 (#144)

## [0.10.2] - 2025-12-05

### 🐛 Fixed

- update astral-sh/setup-uv action to v7.1.4 (#145)

## [0.10.1] - 2025-12-05

### 🐛 Fixed

- update actions/create-github-app-token action to v1.12.0 (#153)

## [0.10.0] - 2025-12-05

### ✨ Added

- add full theming solution with context and hooks (#151)

### 🐛 Fixed

- recognize scoped conventional commits in version bump (#154)
- update peter-evans/create-pull-request action to v7.0.11 (#148)
- add missing egress endpoints for Bun CDN downloads

## [0.9.0] - 2025-12-05

### ✨ Added

- migrate theme system to SASS (#143)

### 🐛 Fixed

- enable platformCommit for Renovate to sign commits
- correct JavaScript reference in gem layout (#106)

### 🔧 Changed

- add missing egress endpoints for Bun download (#149)
- update actions/setup-node digest to 633bb92 (#110)
- update peter-evans/create-pull-request digest to 271a8d0 (#109)
- update actions/setup-node digest to 2028fbc (#108)

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
- update lgtm-hq/py-lintro digest to b3fb40d (#77)
- update actions/download-artifact digest (#71)
- update actions/checkout digest to 08c6903 (#70)
- update dependency ruby (#68)
- update dependency jsdom to v27.1.0 (#67)
- update dependency eslint to v9.39.1 (#65)
- update dependency html-proofer to v5.1.0 (#66)
- update dependency happy-dom to v20.0.10 (#57)
- update softprops/action-gh-release digest to 00362be (#55)
- update github artifact actions (#60)
- update lgtm-hq/py-lintro digest to 1e25709 (#56)
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
