import { Page, Locator } from "@playwright/test";

/**
 * Helper function to take a screenshot with visual annotations.
 * Highlights the element being tested by overlaying a semi-transparent color.
 *
 * @param page - The Playwright page object
 * @param element - The element to highlight
 * @param screenshotName - Name for the screenshot file
 * @param highlightColor - Color to use for highlighting (default: red with 50% opacity)
 */
export async function takeScreenshotWithHighlight(
  page: Page,
  element: Locator,
  screenshotName: string,
  highlightColor = "rgba(255, 0, 0, 0.3)",
): Promise<void> {
  // Add visual highlighting box to the element
  await element.evaluate((el, color) => {
    const box = el.getBoundingClientRect();
    const highlight = document.createElement("div");
    highlight.style.position = "absolute";
    highlight.style.top = `${box.top + window.scrollY}px`;
    highlight.style.left = `${box.left + window.scrollX}px`;
    highlight.style.width = `${box.width}px`;
    highlight.style.height = `${box.height}px`;
    highlight.style.backgroundColor = color;
    highlight.style.border = "2px solid red";
    highlight.style.pointerEvents = "none";
    highlight.style.zIndex = "999999";
    highlight.setAttribute("data-test-highlight", "true");
    document.body.appendChild(highlight);
  }, highlightColor);

  // Take screenshot
  await page.screenshot({
    path: `test-results/${screenshotName}.png`,
    fullPage: true,
  });

  // Clean up the highlight
  await page.evaluate(() => {
    const highlight = document.querySelector("[data-test-highlight]");
    if (highlight) {
      highlight.remove();
    }
  });
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
  highlightColors = [
    "rgba(255, 0, 0, 0.3)",
    "rgba(0, 255, 0, 0.3)",
    "rgba(0, 0, 255, 0.3)",
  ],
): Promise<void> {
  // Add visual highlighting boxes to all elements
  for (let i = 0; i < elements.length; i++) {
    const color = highlightColors[i % highlightColors.length];
    await elements[i].evaluate(
      (el, highlightColor, index) => {
        const box = el.getBoundingClientRect();
        const highlight = document.createElement("div");
        highlight.style.position = "absolute";
        highlight.style.top = `${box.top + window.scrollY}px`;
        highlight.style.left = `${box.left + window.scrollX}px`;
        highlight.style.width = `${box.width}px`;
        highlight.style.height = `${box.height}px`;
        highlight.style.backgroundColor = highlightColor;
        highlight.style.border = "2px solid rgba(0, 0, 0, 0.8)";
        highlight.style.pointerEvents = "none";
        highlight.style.zIndex = String(999999 - index);
        highlight.setAttribute("data-test-highlight", `true-${index}`);
        document.body.appendChild(highlight);
      },
      color,
      i,
    );
  }

  // Take screenshot
  await page.screenshot({
    path: `test-results/${screenshotName}.png`,
    fullPage: true,
  });

  // Clean up all highlights
  await page.evaluate(() => {
    const highlights = document.querySelectorAll("[data-test-highlight]");
    highlights.forEach((h) => h.remove());
  });
}
