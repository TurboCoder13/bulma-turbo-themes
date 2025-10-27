# Local Test Reporting Guide

This guide explains how to view test reports locally after running E2E tests and Lighthouse CI.

## Overview

The project generates two types of test reports:

1. **Playwright E2E Test Report** - Visual regression, accessibility, and smoke tests
2. **Lighthouse Performance Report** - Performance metrics and audit results

## Viewing Playwright Reports Locally

### Generate the Report

Run the E2E tests to generate the Playwright HTML report:

```bash
npm run e2e:ci
```

This creates the `playwright-report/` directory with an interactive HTML report.

### View the Report

#### Option 1: Using Playwright CLI (recommended)

```bash
npx playwright show-report
```

Opens automatically at `http://localhost:9323`

#### Option 2: Using the serve script

```bash
./scripts/local/serve-reports.sh
```

View at `http://localhost:9323`

## Viewing Lighthouse Reports Locally

### Generate the Reports

Run the Lighthouse CI pipeline:

```bash
./scripts/ci/run-lighthouse-ci.sh
```

This creates the `lighthouse-reports/` directory with detailed audit results.

### View the Reports

#### Using the serve script

```bash
./scripts/local/serve-reports.sh
```

View at `http://localhost:3001/lighthouse-reports/`

## Using the Multi-Server Script

The `serve-reports.sh` script automatically detects which reports are available and starts the appropriate servers:

```bash
./scripts/local/serve-reports.sh
```

**Output example:**

```
📊 Test Report Servers
=====================

✅ Playwright HTML Report found
   📍 View at: http://localhost:9323

✅ Lighthouse Reports found
   📍 View at: http://localhost:3001/lighthouse-reports/

Jekyll Site: http://localhost:4000

Starting report servers...

✅ Playwright server started (PID: 12345)
✅ Lighthouse server started (PID: 12346)

Press Ctrl+C to stop all servers
```

## Accessing Reports Through Jekyll

The reports can also be included in the Jekyll build if they exist:

```yaml
# _config.yml
include:
  - playwright-report # Playwright E2E test report
  - lighthouse-reports # Lighthouse performance reports
```

When these directories exist, Jekyll will copy them to `_site/` and make them available through the main Jekyll server at:

- `http://localhost:4000/playwright-report/`
- `http://localhost:4000/lighthouse-reports/`

## CI Deployment

In the CI pipeline, these reports are:

1. Generated during test runs
2. Uploaded as artifacts to GitHub Actions
3. Deployed to GitHub Pages for permanent access

### Lighthouse Reports

- **Workflow**: `reporting-lighthouse-ci.yml`
- **Deploy**: `deploy-lighthouse-pages.yml`
- **Endpoint**: `https://turbocoder13.github.io/bulma-turbo-themes/lighthouse-reports/`

### Playwright Reports

- **Generated in**: `quality-e2e.yml`
- **Stored as**: GitHub Actions artifacts
- **View**: In PR checks or actions run details

## Troubleshooting

### Reports not found locally

If you see errors like:

```
ERROR '/playwright' not found.
ERROR '/lighthouse-reports' not found.
```

**Solution**: These directories are only created after running the respective tests. Run:

```bash
npm run e2e:ci      # For Playwright report
./scripts/ci/run-lighthouse-ci.sh  # For Lighthouse reports
```

### Port already in use

If a port is already in use, modify the script or use:

```bash
# Kill existing process
lsof -ti:9323 | xargs kill -9    # For Playwright (port 9323)
lsof -ti:3001 | xargs kill -9    # For Lighthouse (port 3001)
```

Then restart the server.

## Workflow Examples

### After Making Changes

1. Run E2E tests to check for visual regressions:

   ```bash
   npm run e2e:ci
   ```

2. View the report:

   ```bash
   npx playwright show-report
   ```

3. Review test results and screenshots

### Full Quality Check

1. Run complete CI pipeline:

   ```bash
   ./scripts/local/build.sh --quick
   ```

2. Serve all available reports:

   ```bash
   ./scripts/local/serve-reports.sh
   ```

3. Open browsers to:
   - **Main site**: http://localhost:4000
   - **Tests**: http://localhost:9323 (if available)
   - **Performance**: http://localhost:3001/lighthouse-reports/ (if available)
