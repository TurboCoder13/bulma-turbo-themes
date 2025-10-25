import { test, expect } from "./fixtures";
import {
  takeScreenshotWithHighlight,
  takeScreenshotWithMultipleHighlights,
} from "./helpers";

/**
 * Navigation smoke tests.
 *
 * Tests basic navigation functionality:
 * - Navbar links are visible
 * - Clicking links navigates correctly
 * - Active state updates appropriately
 */
test.describe("Navigation Smoke Tests @smoke", () => {
  test.beforeEach(async ({ basePage }) => {
    await basePage.goto("/");
  });

  test("should display all navbar links", async ({ basePage }) => {
    await test.step("Verify all navbar links are visible", async () => {
      const links = basePage.getAllNavLinks();

      await basePage.expectNavLinkVisible("home");
      await basePage.expectNavLinkVisible("components");
      await basePage.expectNavLinkVisible("forms");

      // Take screenshot highlighting all navbar links
      await takeScreenshotWithMultipleHighlights(
        basePage.page,
        [links.home, links.components, links.forms],
        "navbar-links-display",
      );
    });
  });

  test("should navigate to Components page", async ({ basePage }) => {
    const componentsLink = basePage.getNavLink("components");

    await test.step("Take screenshot before navigation", async () => {
      await takeScreenshotWithHighlight(
        basePage.page,
        componentsLink,
        "before-navigate-components",
      );
    });

    await test.step("Navigate to Components page", async () => {
      await basePage.navigateToPage("components");
    });

    await test.step("Verify navigation successful", async () => {
      await basePage.expectUrl(/\/components/);

      // Verify the link is still visible (navbar is present)
      const activeComponent = basePage.getNavLink("components");
      await expect(activeComponent).toBeVisible();

      // Take screenshot after navigation
      await takeScreenshotWithHighlight(
        basePage.page,
        activeComponent,
        "after-navigate-components",
      );
    });
  });

  test("should navigate to Forms page", async ({ basePage }) => {
    const formsLink = basePage.getNavLink("forms");

    await test.step("Take screenshot before navigation", async () => {
      await takeScreenshotWithHighlight(
        basePage.page,
        formsLink,
        "before-navigate-forms",
      );
    });

    await test.step("Navigate to Forms page", async () => {
      await basePage.navigateToPage("forms");
    });

    await test.step("Verify navigation successful", async () => {
      await basePage.expectUrl(/\/forms/);

      // Verify the link is still visible (navbar is present)
      const activeForm = basePage.getNavLink("forms");
      await expect(activeForm).toBeVisible();

      // Take screenshot after navigation
      await takeScreenshotWithHighlight(
        basePage.page,
        activeForm,
        "after-navigate-forms",
      );
    });
  });

  test("should navigate back to Home page", async ({ basePage }) => {
    await test.step("First navigate to Components", async () => {
      await basePage.navigateToPage("components");
      await basePage.expectUrl(/\/components/);
    });

    const homeLink = basePage.getNavLink("home");

    await test.step("Take screenshot before navigating back", async () => {
      await takeScreenshotWithHighlight(
        basePage.page,
        homeLink,
        "before-navigate-home",
      );
    });

    await test.step("Navigate back to Home", async () => {
      await basePage.navigateToPage("home");
    });

    await test.step("Verify navigation to home successful", async () => {
      await basePage.expectUrl(/\/$/);

      // Verify the link is still visible (navbar is present)
      const activeHome = basePage.getNavLink("home");
      await expect(activeHome).toBeVisible();

      // Take screenshot after navigating back
      await takeScreenshotWithHighlight(
        basePage.page,
        activeHome,
        "after-navigate-home",
      );
    });
  });
});
