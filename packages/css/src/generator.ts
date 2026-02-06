// SPDX-License-Identifier: MIT
/**
 * CSS Custom Properties generator for Turbo Themes.
 *
 * Generates framework-agnostic CSS variables from theme tokens.
 * This is the primary output format for platform-agnostic theming.
 *
 * @packageDocumentation
 */

import type { ThemeFlavor, ThemeTokens } from '@lgtm-hq/turbo-themes-core';
import { generateSyntaxVarsFromTokens } from './syntax.js';

// Import centralized mappings from config
import {
  CORE_MAPPINGS,
  CSS_VAR_PREFIX,
  OPTIONAL_GROUPS,
} from '@lgtm-hq/turbo-themes-core/css/mappings';

/**
 * Resolves a dot-separated path to a value in the tokens object.
 *
 * @param tokens - The tokens object to traverse
 * @param path - Dot-separated path (e.g., 'background.base')
 * @returns The resolved value or undefined if path doesn't exist
 */
function resolveTokenPath(tokens: ThemeTokens, path: string): string | undefined {
  const parts = path.split('.');
  let current: unknown = tokens;

  for (const part of parts) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return undefined;
    }
    // Safe: path is from hardcoded TOKEN_MAPPINGS, not user input
    // nosemgrep: prototype-pollution-loop
    current = (current as Record<string, unknown>)[part];
  }

  return typeof current === 'string' ? current : undefined;
}

/** Default modal backdrop color used when no component token is defined. */
const DEFAULT_MODAL_BACKDROP = 'rgba(10, 10, 10, 0.86)';

/**
 * Trusted font provider domains for web font imports.
 * Only HTTPS URLs from these domains are allowed to prevent CSS injection.
 */
const TRUSTED_FONT_DOMAINS = [
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'use.typekit.net',
  'fonts.bunny.net',
  'rsms.me', // Inter font
  'fonts.cdnfonts.com',
  'github.githubassets.com', // GitHub themes
] as const;

/**
 * Validates that a web font URL is safe to include in CSS.
 * Only allows HTTPS URLs from trusted font provider domains.
 *
 * @param url - The URL to validate
 * @returns true if the URL is from a trusted font provider
 */
function isValidFontUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:') {
      return false;
    }
    return TRUSTED_FONT_DOMAINS.some(
      (domain) => parsed.hostname === domain || parsed.hostname.endsWith(`.${domain}`),
    );
  } catch {
    return false;
  }
}

/**
 * Component token mappings: [cssVarName, componentPath, fallbackTokenPath].
 * Each entry maps a CSS variable to a component token path with a fallback.
 */
const COMPONENT_TOKEN_MAPPINGS: ReadonlyArray<[string, string, string]> = [
  ['card-bg', 'card.bg', 'background.surface'],
  ['card-border', 'card.border', 'border.default'],
  ['card-header-bg', 'card.headerBg', 'background.overlay'],
  ['card-footer-bg', 'card.footerBg', 'background.surface'],
  ['message-bg', 'message.bg', 'background.surface'],
  ['message-header-bg', 'message.headerBg', 'background.overlay'],
  ['message-border', 'message.border', 'border.default'],
  ['message-body-fg', 'message.bodyFg', 'text.primary'],
  ['panel-bg', 'panel.bg', 'background.surface'],
  ['panel-header-bg', 'panel.headerBg', 'background.overlay'],
  ['panel-header-fg', 'panel.headerFg', 'text.primary'],
  ['panel-border', 'panel.border', 'border.default'],
  ['panel-block-bg', 'panel.blockBg', 'background.surface'],
  ['panel-block-hover-bg', 'panel.blockHoverBg', 'background.overlay'],
  ['panel-block-active-bg', 'panel.blockActiveBg', 'background.overlay'],
  ['box-bg', 'box.bg', 'background.surface'],
  ['box-border', 'box.border', 'border.default'],
  ['notification-bg', 'notification.bg', 'background.surface'],
  ['notification-border', 'notification.border', 'border.default'],
  ['modal-bg', 'modal.bg', ''],
  ['modal-card-bg', 'modal.cardBg', 'background.surface'],
  ['modal-header-bg', 'modal.headerBg', 'background.overlay'],
  ['modal-footer-bg', 'modal.footerBg', 'background.surface'],
  ['dropdown-bg', 'dropdown.bg', 'background.surface'],
  ['dropdown-item-hover', 'dropdown.itemHoverBg', 'background.overlay'],
  ['dropdown-border', 'dropdown.border', 'border.default'],
  ['tabs-border', 'tabs.border', 'border.default'],
  ['tabs-link-bg', 'tabs.linkBg', 'background.surface'],
  ['tabs-link-active-bg', 'tabs.linkActiveBg', 'background.base'],
  ['tabs-link-hover-bg', 'tabs.linkHoverBg', 'background.overlay'],
];

/**
 * Resolves a component token value with fallback to a base token.
 * Uses the components section if available, otherwise falls back to base tokens.
 */
function resolveComponentToken(
  tokens: ThemeTokens,
  componentPath: string,
  fallbackPath: string,
): string {
  // Try component-specific value first
  const componentValue = resolveTokenPath(tokens, `components.${componentPath}`);
  if (componentValue !== undefined) return componentValue;

  // Special case: modal.bg has a non-token default
  if (componentPath === 'modal.bg') return DEFAULT_MODAL_BACKDROP;

  // Fall back to base token
  if (fallbackPath) return resolveTokenPath(tokens, fallbackPath) ?? '';
  return '';
}

/**
 * Generates CSS custom property declarations from theme tokens.
 * Uses centralized mapping configuration for consistency.
 *
 * @param tokens - The theme tokens to convert
 * @returns Array of CSS variable declaration lines
 *
 * @example
 * ```ts
 * const lines = generateCssVarsFromTokens(theme.tokens);
 * // ['  --turbo-bg-base: #1e1e2e;', '  --turbo-bg-surface: #313244;', ...]
 * ```
 */
export function generateCssVarsFromTokens(tokens: ThemeTokens): string[] {
  const lines: string[] = [];
  const prefix = CSS_VAR_PREFIX;

  const add = (name: string, value: string): void => {
    lines.push(`  --${prefix}-${name}: ${value};`);
  };

  // Apply core mappings from centralized config
  for (const mapping of CORE_MAPPINGS) {
    // Extract variable name from cssVar (remove prefix if present)
    const varName = mapping.cssVar.startsWith('--')
      ? mapping.cssVar.slice(2) // Remove leading --
      : mapping.cssVar;

    let value = resolveTokenPath(tokens, mapping.tokenPath);

    // Try fallback if primary path didn't resolve
    if (value === undefined && mapping.fallbackPath) {
      value = resolveTokenPath(tokens, mapping.fallbackPath);
    }

    if (value !== undefined) {
      add(varName, value);
    }
  }

  // Optional token groups
  const optionalGroups = OPTIONAL_GROUPS;

  // Spacing tokens (if available)
  if (tokens.spacing && optionalGroups.spacing) {
    const { properties } = optionalGroups.spacing;
    for (const prop of properties) {
      const value = (tokens.spacing as Record<string, string>)[prop];
      if (value) {
        add(`${optionalGroups.spacing.prefix}-${prop}`, value);
      }
    }
  }

  // Elevation tokens (if available)
  if (tokens.elevation && optionalGroups.elevation) {
    const { properties } = optionalGroups.elevation;
    for (const prop of properties) {
      const value = (tokens.elevation as Record<string, string>)[prop];
      if (value) {
        add(`${optionalGroups.elevation.prefix}-${prop}`, value);
      }
    }
  }

  // Animation tokens (if available) - uses custom mappings
  if (tokens.animation && optionalGroups.animation?.mappings) {
    for (const mapping of optionalGroups.animation.mappings) {
      const value = resolveTokenPath(tokens, mapping.tokenPath);
      if (value) {
        add(`${optionalGroups.animation.prefix}-${mapping.cssVar}`, value);
      }
    }
  }

  // Opacity tokens (if available)
  if (tokens.opacity && optionalGroups.opacity) {
    const { properties } = optionalGroups.opacity;
    for (const prop of properties) {
      const value = (tokens.opacity as Record<string, number>)[prop];
      if (value !== undefined) {
        add(`${optionalGroups.opacity.prefix}-${prop}`, String(value));
      }
    }
  }

  // Component tokens (always emitted with fallbacks from base tokens)
  for (const [cssVar, componentPath, fallbackPath] of COMPONENT_TOKEN_MAPPINGS) {
    const value = resolveComponentToken(tokens, componentPath, fallbackPath);
    if (value) {
      add(cssVar, value);
    }
  }

  // Syntax highlighting tokens
  const syntaxLines = generateSyntaxVarsFromTokens(tokens);
  lines.push(...syntaxLines);

  return lines;
}

/**
 * Generates a complete CSS file for a single theme flavor.
 *
 * @param flavor - The theme flavor to generate CSS for
 * @returns Complete CSS string with data-theme selector
 *
 * @example
 * ```ts
 * const css = generateThemeCss(catppuccinMocha);
 * // [data-theme="catppuccin-mocha"] { --turbo-bg-base: #1e1e2e; ... }
 * ```
 */
export function generateThemeCss(flavor: ThemeFlavor): string {
  const vars = generateCssVarsFromTokens(flavor.tokens);
  const webFonts = flavor.tokens.typography?.webFonts ?? [];
  const fontImports = webFonts
    .filter(isValidFontUrl)
    .map((url) => `@import url('${url}');`)
    .join('\n');
  const colorScheme = flavor.appearance === 'dark' ? 'dark' : 'light';

  const cssContent = `[data-theme="${flavor.id}"] {
${vars.join('\n')}
  color-scheme: ${colorScheme};
}`;

  return fontImports ? `${fontImports}\n\n${cssContent}\n` : `${cssContent}\n`;
}

/**
 * Design system tokens that are theme-agnostic.
 * These provide spacing, shadows, radius, and transitions for components.
 */
const DESIGN_SYSTEM_TOKENS = `
  /* Spacing */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  --space-2xl: 3rem;
  --space-3xl: 4rem;
  --space-4xl: 6rem;

  /* Border Radius */
  --radius-sm: 0.5rem;
  --radius-md: 0.75rem;
  --radius-lg: 1rem;
  --radius-xl: 1.5rem;
  --radius-2xl: 2rem;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.05);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15), 0 10px 10px rgba(0, 0, 0, 0.04);
  --shadow-glow: 0 0 30px color-mix(in srgb, var(--turbo-brand-primary) 30%, transparent);
  --shadow-glow-sm: 0 0 15px color-mix(in srgb, var(--turbo-brand-primary) 20%, transparent);

  /* Transitions */
  --transition-fast: 120ms ease-out;
  --transition-normal: 200ms ease-out;
  --transition-slow: 300ms cubic-bezier(0.4, 0, 0.2, 1);

  /* Gradients (theme-aware) */
  --gradient-primary: linear-gradient(135deg, var(--turbo-brand-primary), var(--turbo-state-info));
  --gradient-surface: linear-gradient(180deg, var(--turbo-bg-surface), var(--turbo-bg-base));
`;

/**
 * Generates the core CSS file with default variable values.
 *
 * @param defaultFlavor - The theme flavor to use as defaults
 * @returns CSS string with :root selector
 *
 * @example
 * ```ts
 * const coreCss = generateCoreCss(catppuccinMocha);
 * // :root { --turbo-bg-base: #1e1e2e; ... }
 * ```
 */
export function generateCoreCss(defaultFlavor: ThemeFlavor): string {
  const vars = generateCssVarsFromTokens(defaultFlavor.tokens);
  return `:root {\n${vars.join('\n')}\n${DESIGN_SYSTEM_TOKENS}}\n`;
}

/**
 * Generates a combined CSS file with all themes.
 *
 * @param flavors - Array of all theme flavors
 * @param defaultFlavorId - ID of the theme to use as :root defaults
 * @returns Complete CSS string with core and all theme selectors
 */
export function generateCombinedCss(
  flavors: readonly ThemeFlavor[],
  defaultFlavorId: string = 'catppuccin-mocha'
): string {
  const defaultFlavor = flavors.find((f) => f.id === defaultFlavorId) || flavors[0];
  if (!defaultFlavor) {
    throw new Error('No flavors provided');
  }

  const coreCss = generateCoreCss(defaultFlavor);
  const themeCss = flavors.map((flavor) => generateThemeCss(flavor)).join('\n');

  return `/* Turbo Themes - Pure CSS Custom Properties */\n/* Generated automatically - do not edit */\n\n${coreCss}\n${themeCss}`;
}

// Re-export the prefix for external use
export { CSS_VAR_PREFIX };
