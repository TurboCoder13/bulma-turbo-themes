<!-- 793e7271-6788-498f-9b5c-75bc160d1584 eaa5f9fc-2943-4127-9747-2248356c4262 -->

### Open Source Hardening Plan

#### Scope

Bring the project in line with OSS best practices: clear docs (README, CONTRIBUTING, CoC, SECURITY), transparent governance and changelog, packaging metadata for consumption, and badges. No code logic changes.

#### Changes

- README updates in `README.md`
- Add clear description, features, install/usage steps, quick start, and links to `CODE_OF_CONDUCT.md`, `CONTRIBUTING.md`, and `SECURITY.md`.
- Add badges: License, CI, Coverage, Lighthouse, and (optional) npm version once published.
- Add Support/Community section (issues, discussions if enabled), and Governance link.
- Governance and maintainers
- Add `GOVERNANCE.md` describing decision making and release process.
- Add `MAINTAINERS.md` with current maintainers and contact rules; link from README.
- Security
- Ensure `SECURITY.md` includes a clear security contact email and SLA; link from README.
- Changelog
- Add `CHANGELOG.md` following Keep a Changelog; reference SemVer and `RELEASE.md`.
- License headers
- Add SPDX license headers to source files under `assets/css/**/*.css`, `scripts/**/*.mjs`, and any TS/JS sources (if present) via a one-time header insertion.
- Package/distribution metadata in `package.json`
- Ensure fields: `name`, `version`, `license: MIT`, `repository`, `homepage`, `bugs`, `author`, `publishConfig` (if publishing), and `private: false` if intended to publish.
- If distributing as an npm package: ensure `exports`, `types` and `files` include built assets; document publish steps in README.
- Contribution hygiene
- Ensure `CONTRIBUTING.md` covers local setup, testing/coverage, lint/style, commit conventions, and PR/issue workflow; link to templates.
- Verify `.github/ISSUE_TEMPLATE/*` and `.github/PULL_REQUEST_TEMPLATE.md` reference CoC and provide triage labels.
- Badges and automation
- Add coverage badge from `coverage/lcov-report` via `scripts/coverage-badges.mjs` flow to README.
- Add Lighthouse badge link if applicable (`lighthouserc.json` + CI job output).

#### Notes

- No build or logic changes; only documentation and metadata updates.
- If npm publishing is desired, we’ll confirm package name/scope before changing visibility.

### To-dos

- [x] Expand README with description, usage, links, and badges
- [x] Add GOVERNANCE.md and MAINTAINERS.md and link from README
- [x] Update SECURITY.md with contact email and SLA
- [x] Create CHANGELOG.md with Keep a Changelog
- [x] Insert SPDX headers in scripts and CSS
- [x] Harden package.json (name, repo, bugs, homepage, license)
- [x] Tighten CONTRIBUTING.md with setup, tests, commits, PR flow
- [x] Review issue/PR templates and add CoC references
- [x] Wire coverage/Lighthouse badges into README

### Publishing Plan (confirmed inputs)

- Package name: `@turbocoder13/bulma-turbo-themes` (scoped)
- Initial version: `0.1.0`
- Repository: `https://github.com/TurboCoder13/bulma-turbo-themes`
- Homepage (GH Pages target): `https://turbocoder13.github.io/bulma-turbo-themes/`
- Bugs: `https://github.com/TurboCoder13/bulma-turbo-themes/issues`
