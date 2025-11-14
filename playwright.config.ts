import { defineConfig, devices } from '@playwright/test';
import * as os from 'os';

/**
 * Detect the platform for snapshot storage
 * Values: 'darwin' (macOS), 'linux', or 'win32'
 */
const platform = os.platform();
const platformName = platform === 'darwin' ? 'macos' : platform === 'win32' ? 'windows' : 'linux';

/**
 * Snapshot directory name configuration.
 *
 * Can be overridden via PLAYWRIGHT_SNAPSHOT_DIR environment variable.
 * Defaults to "snapshots" for generic reuse across test suites.
 *
 * Individual test suites can set their own subdirectory by:
 * 1. Setting PLAYWRIGHT_SNAPSHOT_DIR environment variable
 * 2. Or by using project-specific snapshotPathTemplate overrides
 *
 * @example
 * // Use environment variable:
 * PLAYWRIGHT_SNAPSHOT_DIR=homepage-theme-snapshots npm run test:e2e
 *
 * // Or override in project config:
 * projects: [{
 *   name: "chromium",
 *   use: {
 *     snapshotPathTemplate: `{testDir}/custom-snapshots/${platformName}/{arg}.png`
 *   }
 * }]
 */
const snapshotDir = process.env.PLAYWRIGHT_SNAPSHOT_DIR || 'snapshots';

/**
 * Playwright configuration for E2E tests.
 *
 * Runs against a statically served Jekyll _site directory.
 * Uses chromium by default.
 *
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',

  // Run tests in parallel for faster execution
  fullyParallel: true,

  // Configure workers
  workers: process.env.CI ? 2 : undefined,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI, not locally
  retries: process.env.CI ? 2 : 0,

  // Reporter configuration
  // Use github reporter for inline annotations + html for deployment
  reporter: process.env.CI
    ? [['github'], ['html', { outputFolder: 'playwright-report' }]]
    : [['html', { outputFolder: 'playwright-report' }]],

  // Browser projects
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 800 },
      },
    },
  ],

  // Shared test configuration
  use: {
    // Base URL for navigation
    baseURL: 'http://localhost:4173',

    // Take screenshots on failure
    screenshot: 'only-on-failure',

    // Record trace on first retry
    trace: 'on-first-retry',

    // Maximum time for actions like click/typing (ms)
    actionTimeout: 10000,
  },

  // Web server configuration - builds and serves the Jekyll site
  webServer: {
    command: 'npm run e2e:start',
    port: 4173,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000, // 2 minutes for build + serve
  },

  // Screenshot and snapshot settings
  expect: {
    // Visual comparison settings
    toHaveScreenshot: {
      // Locally allow creating missing baselines; in CI, never auto-update
      updateSnapshots: process.env.CI ? 'none' : 'missing',
      // Reduced tolerances for stricter visual comparison
      // Allows only minor anti-aliasing noise while catching real visual regressions
      maxDiffPixels: 50,
      threshold: 0.05,
      // Disable animations in screenshots
      animations: 'disabled',
    },

    // Default timeout for assertions
    timeout: 10000,
  },

  // Snapshot path template - platform-specific paths for strict comparison
  // Uses configurable snapshotDir (defaults to "snapshots", can be overridden via PLAYWRIGHT_SNAPSHOT_DIR)
  snapshotPathTemplate: `{testDir}/${snapshotDir}/${platformName}/{arg}.png`,

  // Test timeout
  timeout: 30000,
});
