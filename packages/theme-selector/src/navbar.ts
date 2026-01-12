// SPDX-License-Identifier: MIT
/**
 * Navbar active state management
 */

import { DOM_SELECTORS } from './constants.js';

/**
 * Normalizes a path by removing trailing slashes, defaulting to '/' if empty.
 */
function normalizePath(path: string): string {
  return path.replace(/\/$/, '') || '/';
}

/**
 * Initializes navbar active state based on current path
 */
export function initNavbar(documentObj: Document): void {
  const currentPath = documentObj.location.pathname;
  const normalizedCurrentPath = normalizePath(currentPath);
  const navbarItems = documentObj.querySelectorAll(DOM_SELECTORS.NAVBAR_ITEM);

  // Single pass: find matching item and collect items to deactivate
  let matchingItem: Element | null = null;
  const itemsToDeactivate: Element[] = [];

  navbarItems.forEach((item) => {
    const link = item as HTMLAnchorElement;
    if (!link.href) return;

    try {
      const normalizedLinkPath = normalizePath(new URL(link.href).pathname);
      if (normalizedCurrentPath === normalizedLinkPath) {
        matchingItem = item;
      } else {
        // Collect non-matching items with valid URLs for deactivation
        itemsToDeactivate.push(item);
      }
    } catch {
      // Ignore invalid URLs
    }
  });

  // Apply deactivation after finding match (single DOM batch)
  for (const item of itemsToDeactivate) {
    item.classList.remove('is-active');
    (item as HTMLAnchorElement).removeAttribute('aria-current');
  }

  // Set active state for the matching link
  if (matchingItem) {
    (matchingItem as HTMLElement).classList.add('is-active');
    (matchingItem as HTMLAnchorElement).setAttribute('aria-current', 'page');
  }

  // Handle Reports dropdown highlighting
  const reportsLink = documentObj.querySelector<HTMLElement>(DOM_SELECTORS.NAV_REPORTS);
  if (reportsLink) {
    const reportPaths = [
      '/coverage',
      '/coverage-python',
      '/coverage-swift',
      '/coverage-ruby',
      '/playwright',
      '/playwright-examples',
      '/lighthouse',
    ];
    const isOnReportsPage = reportPaths.some(
      (path) => normalizedCurrentPath === path || normalizedCurrentPath.startsWith(path + '/')
    );
    if (isOnReportsPage) {
      reportsLink.classList.add('is-active');
    } else {
      reportsLink.classList.remove('is-active');
    }
  }
}

// Expose function to global scope for use in HTML
declare global {
  interface Window {
    initNavbar: typeof initNavbar;
  }
}

// Only assign to window in browser context
if (typeof window !== 'undefined') {
  window.initNavbar = initNavbar;
}
