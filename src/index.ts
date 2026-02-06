// SPDX-License-Identifier: MIT
/**
 * Main entry point - re-exports from internal packages
 * 
 * This file maintains the public API while delegating to internal packages.
 * At build time, packages are built first, then this file imports from their dist/ directories.
 */

// Re-export from core package (built to packages/core/dist)
export * from '../packages/core/dist/index.js';

// Re-export from theme-selector package (built to packages/theme-selector/dist)
export {
  initTheme,
  wireFlavorSelector,
  initNavbar,
  enhanceAccessibility,
} from '../packages/theme-selector/dist/index.js';

// Re-export types for backwards compatibility
export type { ThemeMode, ThemeAppearance, ThemeFamily } from '../packages/theme-selector/dist/index.js';
