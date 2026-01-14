import { defineConfig, devices } from '@playwright/test';
import * as os from 'os';

/**
 * Get optimal worker count based on available CPUs.
 * Uses half the CPUs to leave room for browser processes.
 */
const cpuCount = os.cpus().length;
const optimalWorkers = Math.max(1, Math.floor(cpuCount / 2));

/**
 * Detect the platform for snapshot storage.
 *
 * Uses platform-specific snapshot directories to handle rendering differences
 * (fonts, anti-aliasing) between macOS, Linux, and Windows.
 *
 * Snapshots are stored in e2e/snapshots/{platform}/:
 * - macos: Generated on macOS (darwin)
 * - linux: Generated on Linux (CI uses ubuntu)
 * - windows: Generated on Windows (win32)
 */
const platform = os.platform();
const platformName =
  platform === 'darwin' ? 'macos' : platform === 'win32' ? 'windows' : 'linux';

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
 * PLAYWRIGHT_SNAPSHOT_DIR=homepage-theme-snapshots bun run test:e2e
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

const isCI = !!process.env.CI;

const skipE2E = process.env.SKIP_E2E === '1';
const skipServer = process.env.PLAYWRIGHT_SKIP_SERVER === '1';

/**
 * Test filtering configuration.
 *
 * Use TEST_TAGS to run specific test categories:
 *   TEST_TAGS=smoke bun run e2e       # Run only @smoke tests
 *   TEST_TAGS=visual bun run e2e      # Run only @visual tests
 *
 * Use SKIP_TAGS to exclude specific test categories:
 *   SKIP_TAGS=visual bun run e2e      # Skip visual regression tests
 *   SKIP_TAGS=slow bun run e2e        # Skip slow tests
 */
const testTagsFilter = process.env.TEST_TAGS ? new RegExp(process.env.TEST_TAGS) : undefined;
const skipTagsFilter = process.env.SKIP_TAGS ? new RegExp(process.env.SKIP_TAGS) : undefined;

// Allow skipping E2E via SKIP_E2E=1 (e.g., sandbox without Jekyll/http-server)
/**
 * Playwright configuration for E2E tests.
 *
 * Runs against a statically served Jekyll _site directory.
 * Uses chromium by default.
 *
 * CI policy:
 * - No retries in CI to ensure any flaky failure marks the workflow as failed.
 * - Local runs can still be configured via PLAYWRIGHT_RETRIES if needed.
 *
 * @see https://playwright.dev/docs/test-configuration
 */
const config = defineConfig({
  testDir: './e2e',

  // Run tests in parallel for faster execution
  fullyParallel: true,

  // Configure workers based on available CPUs
  // CI: use optimal workers (half of CPUs), Local: use all available
  workers: isCI ? optimalWorkers : undefined,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: isCI,

  // Retry policy
  // - CI: no retries so that any failure (including flakes) fails the job
  // - Local: default 0 retries, but configurable via PLAYWRIGHT_RETRIES
  retries: process.env.PLAYWRIGHT_RETRIES ? Number(process.env.PLAYWRIGHT_RETRIES) : 0,

  // Test filtering by tags (@smoke, @visual, @slow, etc.)
  grep: testTagsFilter,
  grepInvert: skipTagsFilter,

  // Reporter configuration
  // Use github reporter for inline annotations + html for deployment
  // open: 'never' prevents auto-opening report after tests (would block make serve)
  reporter: isCI
    ? [['github'], ['html', { outputFolder: 'playwright-report', open: 'never' }]]
    : [['html', { outputFolder: 'playwright-report', open: 'never' }]],

  // Browser projects
  // Visual tests run only on chromium; functional tests run on chromium + firefox
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 800 },
      },
      // Run all tests except mobile-specific ones
      testIgnore: '**/mobile-*.spec.ts',
    },
    // Firefox disabled - install issues in CI and redundant with Chromium coverage
    // {
    //   name: 'firefox',
    //   use: {
    //     ...devices['Desktop Firefox'],
    //     viewport: { width: 1280, height: 800 },
    //   },
    //   testIgnore: ['**/visual-*.spec.ts', '**/mobile-*.spec.ts', '**/playground-visual.spec.ts'],
    // },
    // Webkit/Safari disabled due to consistent CSS loading timing issues
    // These are timing-related, not functional issues - the code works in Safari
    // TODO: Re-enable when webkit timing issues are resolved
    // {
    //   name: 'webkit',
    //   use: {
    //     ...devices['Desktop Safari'],
    //     viewport: { width: 1280, height: 800 },
    //   },
    // },

    // Mobile viewport projects (Chromium only for consistent results)
    {
      name: 'mobile-chrome',
      use: {
        ...devices['Pixel 5'],
      },
      testMatch: '**/mobile-*.spec.ts',
    },
    {
      name: 'mobile-chrome-landscape',
      use: {
        ...devices['Pixel 5 landscape'],
      },
      testMatch: '**/mobile-*.spec.ts',
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
  // Disabled when PLAYWRIGHT_SKIP_SERVER=1 (used when server is managed externally)
  webServer: skipServer
    ? undefined
    : {
        command: 'bun run e2e:start',
        port: 4173,
        reuseExistingServer: !process.env.CI,
        timeout: 120 * 1000, // 2 minutes for build + serve
      },

  // Screenshot and snapshot settings
  expect: {
    // Visual comparison settings
    toHaveScreenshot: {
      // Locally allow creating missing baselines; in CI, never auto-update
      // Can override with UPDATE_SNAPSHOTS=1 to generate new baselines
      updateSnapshots:
        process.env.UPDATE_SNAPSHOTS === '1' ? 'all' : process.env.CI ? 'none' : 'missing',
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

if (skipE2E) {
  // Disable running E2E when SKIP_E2E=1 (e.g., sandbox without Jekyll/http-server)
  config.testMatch = [];
  config.projects = [];
  config.webServer = undefined;
}

export default config;
