// SPDX-License-Identifier: MIT
/**
 * Bulma CSS adapter for Turbo Themes.
 *
 * Provides utilities to integrate Turbo theme tokens with Bulma CSS framework.
 * This adapter maps Turbo CSS custom properties to Bulma's expected variables.
 *
 * @packageDocumentation
 */

import type { BulmaConfig } from '@turbocoder13/turbo-themes-core/themes/types';

/**
 * Convert hex color to HSL values
 */
export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  // Remove # if present
  const cleanHex = hex.replace('#', '');

  // Parse hex to RGB
  const r = Number.parseInt(cleanHex.slice(0, 2), 16) / 255;
  const g = Number.parseInt(cleanHex.slice(2, 4), 16) / 255;
  const b = Number.parseInt(cleanHex.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h: number;
  const l = (max + min) / 2;
  let s: number;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Theme colors interface for Bulma configuration
 */
export interface ThemeColors {
  primary: string; // hex color
  link: string; // hex color
  info: string; // hex color
  success: string; // hex color
  warning: string; // hex color
  danger: string; // hex color
}

/**
 * Generate Bulma Sass configuration from theme config
 */
export function generateBulmaConfig(config: BulmaConfig): string {
  const lines: string[] = [];

  // Breakpoints
  if (config.breakpoints) {
    lines.push('// Custom breakpoints');
    const breakpoints = config.breakpoints;
    if (breakpoints.mobile) lines.push(`$mobile: ${breakpoints.mobile};`);
    if (breakpoints.tablet) lines.push(`$tablet: ${breakpoints.tablet};`);
    if (breakpoints.desktop) lines.push(`$desktop: ${breakpoints.desktop};`);
    if (breakpoints.widescreen) lines.push(`$widescreen: ${breakpoints.widescreen};`);
    if (breakpoints.fullhd) lines.push(`$fullhd: ${breakpoints.fullhd};`);
    lines.push('');
  }

  // Spacing
  if (config.spacing) {
    lines.push('// Custom spacing scale');
    const spacing = config.spacing;
    if (spacing.small) lines.push(`$spacing-small: ${spacing.small};`);
    if (spacing.medium) lines.push(`$spacing-medium: ${spacing.medium};`);
    if (spacing.large) lines.push(`$spacing-large: ${spacing.large};`);
    lines.push('');
  }

  // Sizes
  if (config.sizes) {
    lines.push('// Custom typography sizes');
    const sizes = config.sizes;
    if (sizes.small) lines.push(`$size-small: ${sizes.small};`);
    if (sizes.normal) lines.push(`$size-normal: ${sizes.normal};`);
    if (sizes.medium) lines.push(`$size-medium: ${sizes.medium};`);
    if (sizes.large) lines.push(`$size-large: ${sizes.large};`);
    lines.push('');
  }

  // Radius
  if (config.radius) {
    lines.push('// Custom border radius');
    const radius = config.radius;
    if (radius.small) lines.push(`$radius-small: ${radius.small};`);
    if (radius.normal) lines.push(`$radius: ${radius.normal};`);
    if (radius.medium) lines.push(`$radius-medium: ${radius.medium};`);
    if (radius.large) lines.push(`$radius-large: ${radius.large};`);
    if (radius.rounded) lines.push(`$radius-rounded: ${radius.rounded};`);
    lines.push('');
  }

  // Shadows
  if (config.shadows) {
    lines.push('// Custom shadows');
    const shadows = config.shadows;
    if (shadows.small) lines.push(`$shadow-small: ${shadows.small};`);
    if (shadows.normal) lines.push(`$shadow-normal: ${shadows.normal};`);
    if (shadows.medium) lines.push(`$shadow-medium: ${shadows.medium};`);
    if (shadows.large) lines.push(`$shadow-large: ${shadows.large};`);
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Generate full Bulma @use statement with configuration
 * @param colors - Theme colors in hex format
 * @param config - Optional Bulma configuration (breakpoints, spacing, etc.)
 */
export function generateBulmaUse(colors: ThemeColors, config?: BulmaConfig): string {
  // Convert hex colors to HSL with error handling
  let primaryHsl, linkHsl, infoHsl, successHsl, warningHsl, dangerHsl;
  try {
    primaryHsl = hexToHsl(colors.primary);
    linkHsl = hexToHsl(colors.link);
    infoHsl = hexToHsl(colors.info);
    successHsl = hexToHsl(colors.success);
    warningHsl = hexToHsl(colors.warning);
    dangerHsl = hexToHsl(colors.danger);
  } catch (error) {
    throw new Error(
      `Invalid theme colors: ${error instanceof Error ? error.message : String(error)}`
    );
  }

  // Generate Bulma config (breakpoints, spacing, etc.)
  const configStr = config ? generateBulmaConfig(config) : '';

  // Build the @use statement with color configuration
  // Use 'bulma/sass' to ensure variables are properly forwarded and configurable
  const colorConfig = `@use 'bulma/sass' with (
  $primary: hsl(${primaryHsl.h}, ${primaryHsl.s}%, ${primaryHsl.l}%),
  $link: hsl(${linkHsl.h}, ${linkHsl.s}%, ${linkHsl.l}%),
  $info: hsl(${infoHsl.h}, ${infoHsl.s}%, ${infoHsl.l}%),
  $success: hsl(${successHsl.h}, ${successHsl.s}%, ${successHsl.l}%),
  $warning: hsl(${warningHsl.h}, ${warningHsl.s}%, ${warningHsl.l}%),
  $danger: hsl(${dangerHsl.h}, ${dangerHsl.s}%, ${dangerHsl.l}%)
);`;

  // If no additional config, return just the color config
  if (!configStr.trim()) {
    return colorConfig;
  }

  // Combine config and color @use statement with newline separator
  return `${configStr}\n${colorConfig}`;
}

/**
 * CSS adapter content that maps Turbo theme variables to Bulma CSS custom properties.
 *
 * This CSS should be loaded AFTER turbo-core.css and BEFORE bulma.css.
 * It bridges the gap between Turbo's variable naming and Bulma's expectations.
 *
 * @example
 * ```html
 * <link rel="stylesheet" href="turbo-core.css" />
 * <link rel="stylesheet" href="turbo-theme.css" />
 * <link rel="stylesheet" href="bulma-adapter.css" />
 * <link rel="stylesheet" href="bulma.css" />
 * ```
 */
export const BULMA_ADAPTER_CSS = `/* Turbo Themes - Bulma Adapter */
/* Maps Turbo CSS variables to Bulma's expected custom properties */

:root {
  /* Color Scheme */
  --bulma-scheme-main: var(--turbo-bg-base);
  --bulma-scheme-main-bis: var(--turbo-bg-surface);
  --bulma-scheme-main-ter: var(--turbo-bg-overlay);

  /* Body & Background */
  --bulma-body-background-color: var(--turbo-bg-base);
  --bulma-background: var(--turbo-bg-surface);

  /* Text Colors */
  --bulma-text: var(--turbo-text-primary);
  --bulma-text-strong: var(--turbo-text-primary);
  --bulma-text-light: var(--turbo-text-secondary);
  --bulma-text-weak: var(--turbo-text-secondary);

  /* Brand Color - Primary */
  --bulma-primary: var(--turbo-brand-primary);

  /* State Colors */
  --bulma-info: var(--turbo-state-info);
  --bulma-success: var(--turbo-state-success);
  --bulma-warning: var(--turbo-state-warning);
  --bulma-danger: var(--turbo-state-danger);

  /* Link Color */
  --bulma-link: var(--turbo-accent-link);
  --bulma-link-text: var(--turbo-accent-link);

  /* Border */
  --bulma-border: var(--turbo-border-default);
  --bulma-border-weak: var(--turbo-border-default);

  /* Typography */
  --bulma-family-primary: var(--turbo-font-sans);
  --bulma-family-code: var(--turbo-font-mono);

  /* Code */
  --bulma-code: var(--turbo-code-inline-fg);
  --bulma-code-background: var(--turbo-code-inline-bg);
  --bulma-pre: var(--turbo-code-block-fg);
  --bulma-pre-background: var(--turbo-code-block-bg);

  /* Table */
  --bulma-table-color: var(--turbo-text-primary);
  --bulma-table-background-color: var(--turbo-bg-base);
  --bulma-table-cell-border-color: var(--turbo-table-border);
  --bulma-table-head-background-color: var(--turbo-table-thead-bg);
  --bulma-table-striped-row-even-background-color: var(--turbo-table-stripe);

  /* Box & Card */
  --bulma-box-background-color: var(--turbo-bg-surface);

  /* Dropdown */
  --bulma-dropdown-content-background-color: var(--turbo-bg-surface);
  --bulma-dropdown-item-color: var(--turbo-text-primary);
  --bulma-dropdown-item-hover-color: var(--turbo-text-primary);
  --bulma-dropdown-item-hover-background-color: var(--turbo-bg-overlay);
  --bulma-dropdown-item-active-color: var(--turbo-text-inverse);
  --bulma-dropdown-item-active-background-color: var(--turbo-brand-primary);

  /* Modal */
  --bulma-modal-background-background-color: hsla(0, 0%, 0%, 0.7);
  --bulma-modal-card-head-background-color: var(--turbo-bg-surface);
  --bulma-modal-card-body-background-color: var(--turbo-bg-base);
  --bulma-modal-card-foot-background-color: var(--turbo-bg-surface);

  /* Navbar */
  --bulma-navbar-background-color: var(--turbo-bg-surface);
  --bulma-navbar-item-color: var(--turbo-text-primary);
  --bulma-navbar-item-hover-color: var(--turbo-text-primary);
  --bulma-navbar-item-hover-background-color: var(--turbo-bg-overlay);
  --bulma-navbar-dropdown-background-color: var(--turbo-bg-surface);
  --bulma-navbar-dropdown-item-hover-color: var(--turbo-text-primary);
  --bulma-navbar-dropdown-item-hover-background-color: var(--turbo-bg-overlay);

  /* Menu (side navigation) */
  --bulma-menu-item-color: var(--turbo-text-primary);
  --bulma-menu-item-hover-color: var(--turbo-text-primary);
  --bulma-menu-item-hover-background-color: var(--turbo-bg-overlay);
  --bulma-menu-item-active-color: var(--turbo-text-inverse);
  --bulma-menu-item-active-background-color: var(--turbo-brand-primary);

  /* Panel */
  --bulma-panel-heading-background-color: var(--turbo-bg-overlay);
  --bulma-panel-heading-color: var(--turbo-text-primary);
  --bulma-panel-block-color: var(--turbo-text-primary);
  --bulma-panel-block-hover-background-color: var(--turbo-bg-surface);
  --bulma-panel-block-active-color: var(--turbo-text-inverse);
  --bulma-panel-block-active-background-color: var(--turbo-brand-primary);

  /* Tabs */
  --bulma-tabs-link-color: var(--turbo-text-primary);
  --bulma-tabs-link-hover-color: var(--turbo-text-primary);
  --bulma-tabs-link-hover-border-bottom-color: var(--turbo-text-primary);
  --bulma-tabs-link-active-color: var(--turbo-brand-primary);
  --bulma-tabs-link-active-border-bottom-color: var(--turbo-brand-primary);

  /* Input & Form */
  --bulma-input-color: var(--turbo-text-primary);
  --bulma-input-background-color: var(--turbo-bg-base);
  --bulma-input-border-color: var(--turbo-border-default);
  --bulma-input-placeholder-color: var(--turbo-text-secondary);
  --bulma-input-hover-border-color: var(--turbo-text-secondary);
  --bulma-input-focus-border-color: var(--turbo-brand-primary);

  /* Button */
  --bulma-button-color: var(--turbo-text-primary);
  --bulma-button-background-color: var(--turbo-bg-surface);
  --bulma-button-border-color: var(--turbo-border-default);
  --bulma-button-hover-color: var(--turbo-text-primary);
  --bulma-button-hover-border-color: var(--turbo-text-secondary);

  /* Message */
  --bulma-message-background-color: var(--turbo-bg-surface);
  --bulma-message-header-background-color: var(--turbo-bg-overlay);
  --bulma-message-body-color: var(--turbo-text-primary);

  /* Notification */
  --bulma-notification-background-color: var(--turbo-bg-surface);
  --bulma-notification-color: var(--turbo-text-primary);

  /* Progress */
  --bulma-progress-bar-background-color: var(--turbo-border-default);

  /* Breadcrumb */
  --bulma-breadcrumb-item-color: var(--turbo-accent-link);
  --bulma-breadcrumb-item-hover-color: var(--turbo-text-primary);
  --bulma-breadcrumb-item-active-color: var(--turbo-text-primary);
  --bulma-breadcrumb-item-separator-color: var(--turbo-text-secondary);

  /* Pagination */
  --bulma-pagination-color: var(--turbo-text-primary);
  --bulma-pagination-border-color: var(--turbo-border-default);
  --bulma-pagination-hover-color: var(--turbo-text-primary);
  --bulma-pagination-hover-border-color: var(--turbo-text-secondary);
  --bulma-pagination-current-color: var(--turbo-text-inverse);
  --bulma-pagination-current-background-color: var(--turbo-brand-primary);
  --bulma-pagination-current-border-color: var(--turbo-brand-primary);

  /* Footer */
  --bulma-footer-background-color: var(--turbo-bg-surface);
  --bulma-footer-color: var(--turbo-text-primary);

  /* Card */
  --bulma-card-background-color: var(--turbo-bg-surface);
  --bulma-card-header-background-color: transparent;
  --bulma-card-footer-background-color: transparent;
  --bulma-card-footer-border-top: 1px solid var(--turbo-border-default);
}
`;

/**
 * Generates the Bulma adapter CSS content.
 *
 * @returns CSS string that maps Turbo variables to Bulma variables
 */
export function generateBulmaAdapterCss(): string {
  return BULMA_ADAPTER_CSS;
}
