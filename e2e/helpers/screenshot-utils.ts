/**
 * Screenshot utility functions for E2E tests.
 * Helpers for taking annotated screenshots with element highlighting.
 */

import { type Locator, type Page } from '@playwright/test';
import { toOpaqueColor } from './color-utils';

/**
 * Helper function to take a screenshot with visual annotations.
 * Highlights the element being tested by overlaying a semi-transparent color.
 *
 * @param page - The Playwright page object
 * @param element - The element to highlight
 * @param screenshotName - Name for the screenshot file
 * @param highlightColor - Color to use for highlighting (default: red with 30% opacity)
 */
export async function takeScreenshotWithHighlight(
  page: Page,
  element: Locator,
  screenshotName: string,
  highlightColor = 'rgba(255, 0, 0, 0.3)'
): Promise<void> {
  // Compute opaque color for border
  const opaqueColor = toOpaqueColor(highlightColor);

  // Add visual highlighting box to the element
  await element.evaluate(
    (el, { backgroundColor, borderColor }) => {
      const box = el.getBoundingClientRect();
      const highlight = document.createElement('div');
      highlight.style.position = 'absolute';
      highlight.style.top = `${box.top + window.scrollY}px`;
      highlight.style.left = `${box.left + window.scrollX}px`;
      highlight.style.width = `${box.width}px`;
      highlight.style.height = `${box.height}px`;
      highlight.style.backgroundColor = backgroundColor;
      highlight.style.border = `2px solid ${borderColor}`;
      highlight.style.pointerEvents = 'none';
      highlight.style.zIndex = '999999';
      highlight.setAttribute('data-test-highlight', 'true');
      document.body.appendChild(highlight);
    },
    { backgroundColor: highlightColor, borderColor: opaqueColor }
  );

  // Wait for the highlight element to be present in the DOM
  await page.waitForSelector('[data-test-highlight="true"]');

  // Wait for one frame to ensure rendering is complete
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => resolve());
      })
  );

  try {
    // Take screenshot
    await page.screenshot({
      path: `test-results/${screenshotName}.png`,
      fullPage: true,
    });
  } finally {
    // Clean up the highlight - always runs even if errors occur
    await page.evaluate(() => {
      const highlights = document.querySelectorAll('[data-test-highlight]');
      highlights.forEach((h) => h.remove());
    });
  }
}

/**
 * Helper function to highlight multiple elements in a screenshot.
 *
 * @param page - The Playwright page object
 * @param elements - Array of elements to highlight
 * @param screenshotName - Name for the screenshot file
 * @param highlightColors - Colors to use for each element (cycles if fewer colors than elements)
 */
export async function takeScreenshotWithMultipleHighlights(
  page: Page,
  elements: Locator[],
  screenshotName: string,
  highlightColors = ['rgba(255, 0, 0, 0.3)', 'rgba(0, 255, 0, 0.3)', 'rgba(0, 0, 255, 0.3)']
): Promise<void> {
  try {
    // Add visual highlighting boxes to all elements
    for (let i = 0; i < elements.length; i++) {
      const color = highlightColors[i % highlightColors.length];
      const borderColor = toOpaqueColor(color);
      await elements[i].evaluate(
        (el, { highlightColor, borderCol, index }) => {
          const box = el.getBoundingClientRect();
          const highlight = document.createElement('div');
          highlight.style.position = 'absolute';
          highlight.style.top = `${box.top + window.scrollY}px`;
          highlight.style.left = `${box.left + window.scrollX}px`;
          highlight.style.width = `${box.width}px`;
          highlight.style.height = `${box.height}px`;
          highlight.style.backgroundColor = highlightColor;
          highlight.style.border = `2px solid ${borderCol}`;
          highlight.style.pointerEvents = 'none';
          highlight.style.zIndex = String(999999 - index);
          highlight.setAttribute('data-test-highlight', `true-${index}`);
          document.body.appendChild(highlight);
        },
        { highlightColor: color, borderCol: borderColor, index: i }
      );
    }

    // Wait for one frame to ensure rendering is complete
    await page.evaluate(
      () =>
        new Promise<void>((resolve) => {
          requestAnimationFrame(() => resolve());
        })
    );

    // Take screenshot
    await page.screenshot({
      path: `test-results/${screenshotName}.png`,
      fullPage: true,
    });
  } finally {
    // Clean up all highlights - always runs even if errors occur
    await page.evaluate(() => {
      const highlights = document.querySelectorAll('[data-test-highlight]');
      highlights.forEach((h) => h.remove());
    });
  }
}
