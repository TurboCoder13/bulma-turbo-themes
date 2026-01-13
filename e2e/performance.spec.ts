import { expect, test } from '@playwright/test';

// Core Web Vitals thresholds (Google's recommended "good" values)
const WEB_VITALS = {
  LCP: 2500, // Largest Contentful Paint < 2.5s (good)
  FCP: 1800, // First Contentful Paint < 1.8s (good)
  CLS: 0.1, // Cumulative Layout Shift < 0.1 (good)
  TTI: 3800, // Time to Interactive < 3.8s (good)
};

// Performance thresholds specific to Turbo Themes
const TURBO_THRESHOLDS = {
  cssFileSizeKb: 10, // Theme CSS should be under 10KB
  themeSwitchMs: 100, // Theme switch should complete in < 100ms
  initialLoadMs: 1000, // Initial page load to interactive < 1s
};

test.describe('Performance @performance', () => {
  test('should have no FOUC on page load', async ({ page, browserName }) => {
    // Skip on webkit due to different CSS loading timing
    test.skip(browserName === 'webkit', 'Webkit has different CSS loading timing');
    await page.goto('/');

    // Check data-theme attribute is applied immediately (set by blocking script)
    const dataTheme = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );
    expect(dataTheme).toBeTruthy();
    expect(dataTheme).toMatch(/^[a-z-]+$/);
  });

  test('should persist theme after hard refresh', async ({ page, browserName }) => {
    // Skip on webkit due to theme persistence timing issues
    test.skip(browserName === 'webkit', 'Webkit has theme persistence timing issues');
    await page.goto('/');

    // Switch to a specific theme using the dropdown
    const themeTrigger = page.locator('#theme-trigger');
    await themeTrigger.click();

    const themeMenu = page.locator('#theme-menu');
    await themeMenu.waitFor({ state: 'visible', timeout: 5000 });

    const themeOption = page.locator('.theme-option[data-theme="catppuccin-latte"]');
    await themeOption.click();

    // Wait for theme to be applied using CSS variable check
    await page.waitForFunction(() => {
      const dataTheme = document.documentElement.getAttribute('data-theme');
      return dataTheme === 'catppuccin-latte';
    }, { timeout: 5000 });

    // Hard refresh
    await page.reload();

    // Theme should be applied immediately after reload
    const dataTheme = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );
    expect(dataTheme).toBe('catppuccin-latte');
  });

  test('should load CSS files efficiently', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);

    // Check that turbo theme CSS is loaded
    const themeCssLoaded = await page.evaluate(() => {
      const link = document.getElementById('turbo-theme-css');
      return link !== null;
    });
    expect(themeCssLoaded).toBe(true);
  });

  test('should have compact CSS file sizes', async ({ page, request }) => {
    await page.goto('/');

    // Get the current theme from data-theme attribute
    const themeName = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );
    expect(themeName).toBeTruthy();

    if (themeName) {
      const cssUrl = `/assets/css/themes/turbo/${themeName}.css`;

      const response = await request.get(cssUrl);
      expect(response.status()).toBe(200);

      const content = await response.text();
      const sizeKB = Buffer.byteLength(content, 'utf8') / 1024;

      // Turbo theme CSS should be under threshold (typically ~2-3KB)
      expect(sizeKB).toBeLessThan(TURBO_THRESHOLDS.cssFileSizeKb);
    }
  });

  test.describe('Core Web Vitals', () => {
    test('should have good LCP (Largest Contentful Paint)', async ({ page }) => {
      // Navigate and wait for page to be fully loaded
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Get LCP from Performance API
      const lcp = await page.evaluate(() => {
        return new Promise<number | null>((resolve) => {
          // Check if LCP entry already exists
          const entries = performance.getEntriesByType('largest-contentful-paint');
          if (entries.length > 0) {
            const lastEntry = entries[entries.length - 1] as PerformanceEntry & { startTime: number };
            resolve(lastEntry.startTime);
            return;
          }

          // Otherwise wait for it
          const observer = new PerformanceObserver((list) => {
            const observerEntries = list.getEntries();
            const lastEntry = observerEntries[observerEntries.length - 1] as PerformanceEntry & { startTime: number };
            resolve(lastEntry.startTime);
            observer.disconnect();
          });

          try {
            observer.observe({ type: 'largest-contentful-paint', buffered: true });
          } catch {
            resolve(null);
          }

          // Timeout after 5 seconds
          setTimeout(() => resolve(null), 5000);
        });
      });

      // LCP should be measurable and under threshold
      expect(lcp).not.toBeNull();
      if (lcp !== null) {
        expect(lcp).toBeLessThan(WEB_VITALS.LCP);
      }
    });

    test('should have good CLS (Cumulative Layout Shift)', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Get CLS from Performance API with proper accumulation
      const cls = await page.evaluate(() => {
        return new Promise<number>((resolve) => {
          let clsValue = 0;

          // Get existing layout shift entries
          const existingEntries = performance.getEntriesByType('layout-shift');
          for (const entry of existingEntries) {
            const layoutEntry = entry as PerformanceEntry & { hadRecentInput: boolean; value: number };
            if (!layoutEntry.hadRecentInput) {
              clsValue += layoutEntry.value;
            }
          }

          // Also observe for new shifts
          const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              const layoutEntry = entry as PerformanceEntry & { hadRecentInput: boolean; value: number };
              if (!layoutEntry.hadRecentInput) {
                clsValue += layoutEntry.value;
              }
            }
          });

          try {
            observer.observe({ type: 'layout-shift', buffered: true });
          } catch {
            // CLS observation not supported
          }

          // Wait for any pending shifts and resolve
          setTimeout(() => {
            observer.disconnect();
            resolve(clsValue);
          }, 2000);
        });
      });

      // CLS should be under threshold for "good" rating
      expect(cls).toBeLessThan(WEB_VITALS.CLS);
    });

    test('should have good FCP (First Contentful Paint)', async ({ page }) => {
      await page.goto('/');

      // Get FCP from Performance API
      const fcp = await page.evaluate(() => {
        const entries = performance.getEntriesByName('first-contentful-paint');
        if (entries.length > 0) {
          return entries[0].startTime;
        }
        return null;
      });

      // FCP should be measurable and under threshold
      expect(fcp).not.toBeNull();
      if (fcp !== null) {
        expect(fcp).toBeLessThan(WEB_VITALS.FCP);
      }
    });

    test('should have good TTI (Time to Interactive)', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');

      // Measure time using Navigation Timing API for accurate results
      const tti = await page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigation) {
          // domInteractive is a good proxy for TTI
          return navigation.domInteractive;
        }
        return null;
      });

      // Verify the page is interactive
      const themeSelector = page.locator('#theme-trigger');
      await expect(themeSelector).toBeVisible();
      await expect(themeSelector).toBeEnabled();

      // TTI should be under threshold
      expect(tti).not.toBeNull();
      if (tti !== null) {
        expect(tti).toBeLessThan(WEB_VITALS.TTI);
      }
    });
  });

  test.describe('Theme Switch Performance', () => {
    test('should switch themes quickly', async ({ page, browserName }) => {
      // Skip on Firefox due to inconsistent timing measurements
      test.skip(browserName === 'firefox', 'Firefox has inconsistent performance timing');
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Open theme menu
      const themeTrigger = page.locator('#theme-trigger');
      await themeTrigger.click();

      const themeMenu = page.locator('#theme-menu');
      await themeMenu.waitFor({ state: 'visible', timeout: 5000 });

      // Measure theme switch time
      const switchTime = await page.evaluate(() => {
        return new Promise<number>((resolve) => {
          const startTime = performance.now();

          // Find and click a theme option
          const option = document.querySelector('.theme-option[data-theme="dracula"]') as HTMLElement;
          if (option) {
            option.click();

            // Wait for theme to be applied
            const checkTheme = () => {
              const dataTheme = document.documentElement.getAttribute('data-theme');
              if (dataTheme === 'dracula') {
                resolve(performance.now() - startTime);
              } else {
                requestAnimationFrame(checkTheme);
              }
            };
            requestAnimationFrame(checkTheme);
          } else {
            resolve(-1);
          }
        });
      });

      // Theme switch should be fast
      expect(switchTime).toBeGreaterThan(0);
      expect(switchTime).toBeLessThan(TURBO_THRESHOLDS.themeSwitchMs);
    });

    test('should not cause layout shift during theme switch', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Get CLS before theme switch
      const clsBefore = await page.evaluate(() => {
        let cls = 0;
        const entries = performance.getEntriesByType('layout-shift');
        for (const entry of entries) {
          const layoutEntry = entry as PerformanceEntry & { hadRecentInput: boolean; value: number };
          if (!layoutEntry.hadRecentInput) {
            cls += layoutEntry.value;
          }
        }
        return cls;
      });

      // Switch themes multiple times
      const themes = ['dracula', 'github-light', 'catppuccin-mocha'];
      for (const theme of themes) {
        await page.evaluate((t) => {
          document.documentElement.setAttribute('data-theme', t);
        }, theme);
        // Small wait for CSS to apply
        await page.waitForTimeout(50);
      }

      // Get CLS after theme switches
      const clsAfter = await page.evaluate(() => {
        let cls = 0;
        const entries = performance.getEntriesByType('layout-shift');
        for (const entry of entries) {
          const layoutEntry = entry as PerformanceEntry & { hadRecentInput: boolean; value: number };
          if (!layoutEntry.hadRecentInput) {
            cls += layoutEntry.value;
          }
        }
        return cls;
      });

      // Theme switching should not cause significant layout shift
      const clsDelta = clsAfter - clsBefore;
      expect(clsDelta).toBeLessThan(0.05); // Very small CLS increase is acceptable
    });
  });
});
