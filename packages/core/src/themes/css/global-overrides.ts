// SPDX-License-Identifier: MIT
// Global CSS override generation - re-exports from modular structure
//
// This file maintains backward compatibility by re-exporting the composed
// cssGlobalOverrides function from the new modular overrides/ directory.
//
// For new code, prefer importing from './overrides/index.js' directly,
// which also exports individual override functions for selective use.

export {
  cssGlobalOverrides,
  cssTypographyOverrides,
  cssFormOverrides,
  cssDropdownOverrides,
  cssTableOverrides,
  cssNavbarOverrides,
  cssAccessibilityOverrides,
} from './overrides/index.js';
