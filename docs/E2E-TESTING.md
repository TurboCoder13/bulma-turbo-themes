## End-to-end testing (Playwright)

This project includes a complete Playwright setup covering:

- Smoke navigation and theme switching
- Accessibility checks with axe-core
- Visual regression snapshots

### Commands

- Run all E2E tests: `npm run e2e`
- UI mode: `npm run e2e:ui`
- Smoke only: `npm run e2e:smoke`
- Visual regression: `npm run e2e:visual`
- Accessibility: `npm run e2e:a11y`

### Visual testing

See `docs/PLAYWRIGHT-VISUAL-TESTS.md` for snapshot guidance and updating screenshots.

#### Snapshot fallback behavior

- Locally, missing snapshots are auto-created on first run (Playwright `updateSnapshots: 'missing'`).
- In CI, snapshots are never auto-updated; tests fail if a baseline is missing or mismatched.
- To intentionally refresh baselines locally, run: `npm run e2e:visual -- --update-snapshots`.

### Local reports

See `docs/LOCAL-TEST-REPORTING.md` for serving Playwright, Lighthouse, and coverage reports locally.

### CI

Playwright is integrated into GitHub Actions via `quality-e2e.yml`. It generates PR comments and uploads artifacts for reports.
