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

### Publishing Plan

#### Decisions to confirm

- Package name: e.g., `bulma-turbo-themes` or scoped `@org/bulma-turbo-themes`.
- Initial version: `0.1.0` or `0.0.1`.
- Repository URLs: GitHub org/repo for metadata and badges.
- Publishing flow: manual from local vs. automated on git tag via CI.

#### Staged steps

1. Metadata and structure
   - Ensure `package.json` fields: `name`, `version`, `description`, `license: MIT`, `repository`, `homepage`, `bugs`, `author`, `private: false`, `keywords`, `sideEffects: false`.
   - Add `exports`, `types`, and `files` to include `dist/**` and `assets/css/themes/*.css`.
   - Scripts: `build`, `test`, `lint`, `prepublishOnly` (build+test).

2. Public API and build
   - Ensure `src/index.ts` exports: `initTheme`, `wireFlavorSelector`, registry helpers, injection utilities.
   - Build to `dist/` with type declarations (`declaration: true`).
   - Verify `assets/css/themes/*.css` are present.

3. Docs and badges
   - README: add npm badge (version), install command, import usage.
   - Link CHANGELOG/SECURITY/GOVERNANCE; keep CI/Lighthouse badges.

4. Quality gates
   - `npm test` with coverage thresholds green.
   - `npm run lint` and `npm run format` clean.

5. Release and publish (manual)
   - `npm login`
   - `npm run build`
   - `npm publish --access public`
   - `git tag vX.Y.Z && git push --tags`

6. Optional automation
   - GitHub Action to publish on semver tags using `NPM_TOKEN`.
   - Conventional commits + `release: cut vX.Y.Z` workflow per `RELEASE.md`.

#### Publishing checklist

- [ ] Confirm package name/scope and version
- [ ] Complete `package.json` metadata and exports/files
- [ ] Ensure `src/index.ts` public API and `dist/` build
- [ ] README: add npm badge and install instructions
- [ ] Tests, lint, format all green
- [ ] Publish to npm and tag release
- [ ] (Optional) Enable publish-on-tag CI
