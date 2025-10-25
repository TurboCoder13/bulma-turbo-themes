import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration for E2E tests.
 *
 * Runs against a statically served Jekyll _site directory.
 * Uses chromium by default.
 *
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./e2e",

  // Run tests in parallel for faster execution
  fullyParallel: true,

  // Configure workers
  workers: process.env.CI ? 2 : undefined,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI, not locally
  retries: process.env.CI ? 2 : 0,

  // Reporter configuration
  reporter: process.env.CI ? "github" : "html",

  // Browser projects
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        // Disable animations for more stable screenshots
        viewport: { width: 1280, height: 800 },
      },
    },
  ],

  // Shared test configuration
  use: {
    // Base URL for navigation
    baseURL: "http://localhost:4173",

    // Take screenshots on failure
    screenshot: "only-on-failure",

    // Record trace on first retry
    trace: "on-first-retry",

    // Disable animations for more stable tests
    actionTimeout: 10000,

    // Emulate reduced motion for consistency
    reducedMotion: "reduce",
  },

  // Web server configuration - builds and serves the Jekyll site
  webServer: {
    command: 'bash -lc "npm run e2e:prep && npx http-server _site -p 4173 -s"',
    port: 4173,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000, // 2 minutes for build + serve
  },

  // Screenshot and snapshot settings
  expect: {
    // Visual comparison settings
    toHaveScreenshot: {
      maxDiffPixels: 100,
      threshold: 0.2,
      // Disable animations in screenshots
      animations: "disabled",
    },

    // Default timeout for assertions
    timeout: 10000,
  },

  // Test timeout
  timeout: 30000,
});
