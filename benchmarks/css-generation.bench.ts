// SPDX-License-Identifier: MIT
/**
 * Performance benchmarks for CSS generation.
 *
 * Run with: bunx vitest bench benchmarks/
 *
 * Note: These benchmarks test core theme operations that don't require
 * the full CSS generator infrastructure.
 */

import { bench, describe } from 'vitest';
import { flavors } from '@lgtm-hq/turbo-themes-core';
import { generateBaseCss, generateResetCss } from '../packages/css/src/base.js';
import { CORE_MAPPINGS, CSS_VAR_PREFIX, OPTIONAL_GROUPS } from '../packages/core/src/themes/css/mappings.js';

// Use the first flavor as a representative sample
const sampleFlavor = flavors[0];

/**
 * Helper to resolve a token path (simulates what the CSS generator does)
 */
function resolveTokenPath(tokens: Record<string, unknown>, path: string): string | undefined {
  const parts = path.split('.');
  let current: unknown = tokens;
  for (const part of parts) {
    if (current == null || typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === 'string' ? current : undefined;
}

/**
 * Generate CSS variables from tokens using the centralized mappings
 */
function generateCssVarsFromMappings(tokens: Record<string, unknown>): string[] {
  const vars: string[] = [];
  for (const mapping of CORE_MAPPINGS) {
    const value = resolveTokenPath(tokens, mapping.tokenPath);
    if (value) {
      vars.push(`--${CSS_VAR_PREFIX}-${mapping.cssVar}: ${value};`);
    }
  }
  return vars;
}

describe('CSS Generation Benchmarks', () => {
  describe('Core CSS Functions', () => {
    bench('generateBaseCss', () => {
      generateBaseCss();
    });

    bench('generateResetCss', () => {
      generateResetCss();
    });

    bench('generateCssVarsFromMappings', () => {
      generateCssVarsFromMappings(sampleFlavor.tokens);
    });
  });

  describe('Token Mapping Operations', () => {
    bench('resolve single token path', () => {
      resolveTokenPath(sampleFlavor.tokens, 'background.base');
    });

    bench('iterate all core mappings', () => {
      for (const mapping of CORE_MAPPINGS) {
        resolveTokenPath(sampleFlavor.tokens, mapping.tokenPath);
      }
    });

    bench('iterate optional groups (spacing)', () => {
      const spacing = OPTIONAL_GROUPS.spacing;
      if (spacing?.properties) {
        for (const prop of spacing.properties) {
          resolveTokenPath(sampleFlavor.tokens, `spacing.${prop}`);
        }
      }
    });
  });

  describe('Bulk Token Operations', () => {
    bench('generate CSS vars for all flavors', () => {
      for (const flavor of flavors) {
        generateCssVarsFromMappings(flavor.tokens);
      }
    });

    bench('lookup all flavors by ID', () => {
      const ids = flavors.map((f) => f.id);
      for (const id of ids) {
        flavors.find((f) => f.id === id);
      }
    });
  });
});
