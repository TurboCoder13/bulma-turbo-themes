// SPDX-License-Identifier: MIT
/**
 * Snapshot tests for CSS output.
 *
 * These tests ensure that CSS generation remains consistent across changes.
 * If CSS output changes intentionally, update snapshots with: bunx vitest -u
 */

import { describe, expect, it } from 'vitest';
import { flavors } from '@lgtm-hq/turbo-themes-core';
import {
  CORE_MAPPINGS,
  CSS_VAR_PREFIX,
} from '@lgtm-hq/turbo-themes-core/css/mappings';
import { generateBaseCss, generateResetCss } from '../../src/base.js';

/**
 * Helper to generate CSS variables from tokens (subset for snapshot)
 */
function generateCssVarsSnapshot(tokens: Record<string, unknown>): string {
  const lines: string[] = [];

  // Only snapshot first 10 mappings to keep snapshots manageable
  const mappingsToTest = CORE_MAPPINGS.slice(0, 10);

  for (const mapping of mappingsToTest) {
    const parts = mapping.tokenPath.split('.');
    let current: unknown = tokens;
    for (const part of parts) {
      if (current == null || typeof current !== 'object') break;
      // Safe: path is from hardcoded mappings, not user input
      // nosemgrep: prototype-pollution-loop
      current = (current as Record<string, unknown>)[part];
    }
    if (typeof current === 'string') {
      lines.push(`--${CSS_VAR_PREFIX}-${mapping.cssVar}: ${current};`);
    }
  }

  return lines.join('\n');
}

describe('CSS Output Snapshots', () => {
  describe('Base CSS', () => {
    it('matches base CSS snapshot', () => {
      const output = generateBaseCss();
      expect(output).toMatchSnapshot();
    });

    it('matches reset CSS snapshot', () => {
      const output = generateResetCss();
      expect(output).toMatchSnapshot();
    });
  });

  describe('Theme CSS Variables', () => {
    // Test a representative sample of themes
    const sampleThemes = [
      flavors.find((f) => f.id === 'catppuccin-mocha'),
      flavors.find((f) => f.id === 'catppuccin-latte'),
      flavors.find((f) => f.id === 'github-dark'),
      flavors.find((f) => f.id === 'github-light'),
    ].filter(Boolean);

    it.each(sampleThemes.map((f) => [f!.id, f!]))(
      'matches %s theme CSS variables snapshot',
      (id, flavor) => {
        const vars = generateCssVarsSnapshot(flavor!.tokens);
        expect(vars).toMatchSnapshot();
      }
    );
  });

  describe('Token Path Mapping', () => {
    it('core mappings structure matches snapshot', () => {
      // Snapshot the mapping configuration itself
      const mappingInfo = CORE_MAPPINGS.map((m) => ({
        cssVar: m.cssVar,
        tokenPath: m.tokenPath,
      }));
      expect(mappingInfo).toMatchSnapshot();
    });
  });
});
