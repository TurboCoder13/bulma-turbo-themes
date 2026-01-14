import { defineConfig, devices } from '@playwright/test';
import * as os from 'os';

/**
 * Playwright configuration for examples E2E tests.
 *
 * Runs against statically served example directories.
 * Uses chromium and firefox by default.
 *
 * @see https://playwright.dev/docs/test-configuration
 */

const platform = os.platform();
const platformName =
  platform === 'darwin' ? 'macos' : platform === 'win32' ? 'windows' : 'linux';

const isCI = !!process.env.CI;
const skipServer = process.env.PLAYWRIGHT_SKIP_SERVER === '1';

export default defineConfig({
  testDir: '.',
  testMatch: ['**/test/**/*.spec.ts'],

  // Run tests in parallel for faster execution
  fullyParallel: true,

  // Configure workers
  workers: isCI ? 2 : undefined,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: isCI,

  // Retry policy - no retries in CI
  retries: process.env.PLAYWRIGHT_RETRIES ? Number(process.env.PLAYWRIGHT_RETRIES) : 0,

  // Reporter configuration
  reporter: isCI
    ? [['github'], ['html', { outputFolder: 'playwright-report', open: 'never' }]]
    : [['html', { outputFolder: 'playwright-report', open: 'never' }]],

  // Browser projects
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 800 },
      },
    },
    // Firefox disabled - install issues in CI and redundant with Chromium coverage
    // {
    //   name: 'firefox',
    //   use: {
    //     ...devices['Desktop Firefox'],
    //     viewport: { width: 1280, height: 800 },
    //   },
    // },
  ],

  // Shared test configuration
  use: {
    // Base URL for navigation - examples are served from the site dist
    baseURL: 'http://localhost:4173',

    // Take screenshots on failure
    screenshot: 'only-on-failure',

    // Record trace on first retry
    trace: 'on-first-retry',

    // Maximum time for actions like click/typing (ms)
    actionTimeout: 10000,
  },

  // Web server configuration - serves the site with examples
  // Disabled when PLAYWRIGHT_SKIP_SERVER=1 (used when server is managed externally)
  webServer: skipServer
    ? undefined
    : {
        command: 'bun run e2e:start',
        port: 4173,
        cwd: '..',
        reuseExistingServer: !process.env.CI,
        timeout: 120 * 1000, // 2 minutes for build + serve
      },

  // Screenshot and snapshot settings
  expect: {
    toHaveScreenshot: {
      updateSnapshots: process.env.CI ? 'none' : 'missing',
      maxDiffPixels: 50,
      threshold: 0.05,
      animations: 'disabled',
    },
    timeout: 10000,
  },

  // Snapshot path template
  snapshotPathTemplate: `{testDir}/snapshots/${platformName}/{arg}.png`,

  // Test timeout
  timeout: 30000,
});
