// SPDX-License-Identifier: MIT
/**
 * Accessibility enhancements
 */

import { DOM_SELECTORS } from './constants.js';

/**
 * Enhances accessibility for code blocks
 */
export function enhanceAccessibility(documentObj: Document): void {
  documentObj.querySelectorAll(DOM_SELECTORS.HIGHLIGHT_PRE).forEach((pre) => {
    if (!pre.hasAttribute('tabindex')) pre.setAttribute('tabindex', '0');
    if (!pre.hasAttribute('role')) pre.setAttribute('role', 'region');
    if (!pre.hasAttribute('aria-label')) pre.setAttribute('aria-label', 'Code block');
  });
}
