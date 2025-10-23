import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration for E2E tests.
 *
 * Runs against a statically served Jekyll _site directory.
 * Uses chromium for fast, deterministic tests.
 *
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./e2e",

  // Use chromium only for fast, deterministic tests
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  // Viewport size
  use: {
    viewport: { width: 1280, height: 800 },
    baseURL: "http://localhost:4173",
    screenshot: "only-on-failure",
    trace: "on-first-retry",
  },

  // Retry on CI, not locally
  retries: process.env.CI ? 2 : 0,

  // Reporter configuration
  reporter: process.env.CI ? "github" : "html",

  // Web server configuration - builds and serves the Jekyll site
  webServer: {
    command: 'bash -lc "npm run e2e:prep && npx http-server _site -p 4173 -s"',
    port: 4173,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000, // 2 minutes for build + serve
  },

  // Screenshot and snapshot settings
  expect: {
    toHaveScreenshot: {
      maxDiffPixels: 100,
      threshold: 0.2,
    },
  },
});
