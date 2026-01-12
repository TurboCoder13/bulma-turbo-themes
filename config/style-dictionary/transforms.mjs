// SPDX-License-Identifier: MIT
/**
 * Custom Style Dictionary transforms for Turbo Themes
 *
 * These transforms convert W3C Design Tokens to platform-specific formats
 * while preserving the $type metadata for tooling support.
 */

/**
 * Converts a hex color string to HSL format.
 * @param {string} hex - Hex color (e.g., "#ff5500" or "#f50")
 * @returns {string} HSL string (e.g., "hsl(20, 100%, 50%)")
 */
export function hexToHsl(hex) {
  // Remove # prefix
  let h = hex.replace(/^#/, '');

  // Expand shorthand (e.g., "f50" -> "ff5500")
  if (h.length === 3) {
    h = h
      .split('')
      .map((c) => c + c)
      .join('');
  }

  // Parse RGB components
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  if (max === min) {
    // Achromatic (grayscale)
    return `hsl(0, 0%, ${Math.round(l * 100)}%)`;
  }

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

  let hue;
  switch (max) {
    case r:
      hue = ((g - b) / d + (g < b ? 6 : 0)) / 6;
      break;
    case g:
      hue = ((b - r) / d + 2) / 6;
      break;
    case b:
      hue = ((r - g) / d + 4) / 6;
      break;
    default:
      hue = 0;
  }

  return `hsl(${Math.round(hue * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

/**
 * Formats a shadow token value to CSS box-shadow format.
 * Supports both single shadows and arrays of shadows.
 *
 * @param {Object|Object[]} value - Shadow token value(s)
 * @returns {string} CSS box-shadow string
 */
export function formatShadow(value) {
  const shadows = Array.isArray(value) ? value : [value];

  return shadows
    .map((shadow) => {
      const { offsetX = 0, offsetY = 0, blur = 0, spread = 0, color = '#000000' } = shadow;
      const inset = shadow.inset ? 'inset ' : '';
      return `${inset}${offsetX} ${offsetY} ${blur} ${spread} ${color}`;
    })
    .join(', ');
}

/**
 * Converts a pixel value to rem.
 * Assumes 16px base font size.
 *
 * @param {string} value - Dimension value (e.g., "16px", "1.5rem", "24")
 * @returns {string} Value in rem (e.g., "1rem")
 */
export function pxToRem(value) {
  // Already in rem
  if (typeof value === 'string' && value.endsWith('rem')) {
    return value;
  }

  // Parse numeric value
  const numericValue = parseFloat(value);
  if (isNaN(numericValue)) {
    return value; // Return as-is if not parseable
  }

  // Convert px to rem (assuming 16px base)
  const remValue = numericValue / 16;

  // Round to 4 decimal places to avoid floating point issues
  return `${Math.round(remValue * 10000) / 10000}rem`;
}

/**
 * Transform: Convert hex colors to HSL
 *
 * Useful for theme systems that need to manipulate colors programmatically.
 * HSL makes it easier to adjust lightness/saturation for hover states, etc.
 */
export const hexToHslTransform = {
  name: 'color/hex-to-hsl',
  type: 'value',
  transitive: true,
  filter: (token) => token.$type === 'color' && typeof token.value === 'string' && token.value.startsWith('#'),
  transform: (token) => hexToHsl(token.value),
};

/**
 * Transform: Convert shadow tokens to CSS box-shadow
 *
 * W3C Design Tokens represent shadows as objects with properties.
 * This transform converts them to valid CSS box-shadow strings.
 */
export const shadowToCssTransform = {
  name: 'shadow/css',
  type: 'value',
  transitive: true,
  filter: (token) => token.$type === 'shadow',
  transform: (token) => formatShadow(token.value),
};

/**
 * Transform: Convert dimensions to rem
 *
 * Converts pixel values to rem for better accessibility.
 * Assumes 16px base font size (browser default).
 */
export const spacingToRemTransform = {
  name: 'size/rem',
  type: 'value',
  transitive: true,
  filter: (token) => token.$type === 'dimension' && typeof token.value === 'string',
  transform: (token) => pxToRem(token.value),
};

/**
 * Short name mappings for legacy compatibility.
 * Maps full token paths to shorter CSS variable names.
 */
const shortNameMappings = {
  'background-base': 'bg-base',
  'background-surface': 'bg-surface',
  'background-overlay': 'bg-overlay',
  'typography-fonts-sans': 'font-sans',
  'typography-fonts-mono': 'font-mono',
  'content-heading-h1': 'heading-h1',
  'content-heading-h2': 'heading-h2',
  'content-heading-h3': 'heading-h3',
  'content-heading-h4': 'heading-h4',
  'content-heading-h5': 'heading-h5',
  'content-heading-h6': 'heading-h6',
  'content-body-primary': 'body-primary',
  'content-body-secondary': 'body-secondary',
  'content-link-default': 'link-default',
  'content-selection-fg': 'selection-fg',
  'content-selection-bg': 'selection-bg',
  'content-blockquote-border': 'blockquote-border',
  'content-blockquote-fg': 'blockquote-fg',
  'content-blockquote-bg': 'blockquote-bg',
  'content-code-inline-fg': 'code-inline-fg',
  'content-code-inline-bg': 'code-inline-bg',
  'content-code-block-fg': 'code-block-fg',
  'content-code-block-bg': 'code-block-bg',
  'content-table-border': 'table-border',
  'content-table-stripe': 'table-stripe',
  'content-table-thead-bg': 'table-thead-bg',
};

/**
 * Transform: Kebab-case token names with legacy short names
 *
 * Converts camelCase token names to kebab-case for CSS custom properties.
 * Uses short name mappings for legacy compatibility.
 */
export const kebabCaseNameTransform = {
  name: 'turbo/name-short',
  type: 'name',
  transform: (token) => {
    const fullName = token.path
      .join('-')
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .toLowerCase();

    // Check if there's a short name mapping
    return shortNameMappings[fullName] || fullName;
  },
};

/**
 * All custom transforms as an array for easy registration
 */
export const allTransforms = [
  hexToHslTransform,
  shadowToCssTransform,
  spacingToRemTransform,
  kebabCaseNameTransform,
];

export default allTransforms;
