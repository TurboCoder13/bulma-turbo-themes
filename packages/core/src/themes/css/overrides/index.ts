// SPDX-License-Identifier: MIT
// Global CSS overrides - composed from individual modules

import { cssTypographyOverrides } from './typography.js';
import { cssFormOverrides } from './forms.js';
import { cssDropdownOverrides } from './dropdown.js';
import { cssTableOverrides } from './tables.js';
import { cssNavbarOverrides } from './navbar.js';
import { cssAccessibilityOverrides } from './accessibility.js';

// Re-export individual override functions for selective use
export {
  cssTypographyOverrides,
  cssFormOverrides,
  cssDropdownOverrides,
  cssTableOverrides,
  cssNavbarOverrides,
  cssAccessibilityOverrides,
};

/**
 * Generate all global CSS overrides composed from individual modules.
 * This is the main entry point that combines typography, forms,
 * dropdowns, tables, navbar, and accessibility overrides.
 */
export function cssGlobalOverrides(): string {
  return `/* SPDX-License-Identifier: MIT */
${cssTypographyOverrides()}

${cssFormOverrides()}

${cssDropdownOverrides()}

${cssTableOverrides()}

${cssNavbarOverrides()}

${cssAccessibilityOverrides()}`;
}
