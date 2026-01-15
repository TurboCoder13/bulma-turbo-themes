// SPDX-License-Identifier: MIT
// Bulma-specific CSS variable generation

import type { ThemeFlavor } from '../types.js';
import {
  escapeCssId,
  generateVariables,
  generateHSLComponents,
  generateHSLColors,
  generateComponentVariables,
} from './helpers.js';
import {
  BULMA_SCHEME_MAPPINGS,
  PRIMARY_HSL_MAPPING,
  STATE_HSL_MAPPINGS,
  TEXT_MAPPINGS,
  HEADING_MAPPINGS,
  CONTENT_MAPPINGS,
  TABLE_MAPPINGS,
  SYNTAX_MAPPINGS,
  SURFACE_MAPPINGS,
  COMPONENT_MAPPINGS,
} from './mappings.js';

/**
 * Generates theme CSS variables for a flavor using data-driven mappings.
 */
export function generateThemeCSSVariables(flavor: ThemeFlavor): string {
  const { tokens } = flavor;
  const escapedId = escapeCssId(flavor.id);

  const lines: string[] = [];

  // Bulma scheme variables
  lines.push(...generateVariables(tokens, BULMA_SCHEME_MAPPINGS));

  // Primary color HSL components
  lines.push(...generateHSLComponents(tokens, PRIMARY_HSL_MAPPING));

  // State colors as HSL
  lines.push(...generateHSLColors(tokens, STATE_HSL_MAPPINGS));

  // Typography (with special formatting for font stacks)
  lines.push(`  --theme-font-sans:\n    ${tokens.typography.fonts.sans};`);
  lines.push(`  --theme-font-mono:\n    ${tokens.typography.fonts.mono};`);

  // Text variables
  lines.push(...generateVariables(tokens, TEXT_MAPPINGS));

  // Heading variables
  lines.push(...generateVariables(tokens, HEADING_MAPPINGS));

  // Content element variables
  lines.push(...generateVariables(tokens, CONTENT_MAPPINGS));

  // Table variables
  lines.push(...generateVariables(tokens, TABLE_MAPPINGS));

  // Syntax highlighting variables
  lines.push(...generateVariables(tokens, SYNTAX_MAPPINGS));

  // Surface/background variables
  lines.push(...generateVariables(tokens, SURFACE_MAPPINGS));

  // Component tokens (optional)
  const componentLines = generateComponentVariables(tokens, COMPONENT_MAPPINGS);
  if (componentLines.length > 0) {
    lines.push(...componentLines);
  }

  // Color scheme
  lines.push(`  color-scheme: ${flavor.appearance};`);

  return `html[data-flavor='${escapedId}'] {\n${lines.join('\n')}\n}`;
}
