// SPDX-License-Identifier: MIT
// Bulma configuration utilities

import type { BulmaConfig } from './types.ts';

/**
 * Convert hex color to HSL values
 */
export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  // Remove # if present
  const cleanHex = hex.replace('#', '');

  // Parse hex to RGB
  const r = parseInt(cleanHex.slice(0, 2), 16) / 255;
  const g = parseInt(cleanHex.slice(2, 4), 16) / 255;
  const b = parseInt(cleanHex.slice(4, 6), 16) / 255;

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
