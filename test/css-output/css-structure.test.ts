/**
 * CSS Structure Validation Tests
 *
 * Tests theme differentiation and font imports.
 */

import { describe, expect, it } from 'vitest';
import path from 'node:path';
import { flavors } from '../../packages/core/src/tokens/index';
import { turboThemesDir, readFile, hexToBrightness } from './test-utils';

describe('CSS Output - Theme Differentiation', () => {
  it('light themes have lighter background than dark themes', () => {
    const lightThemes = flavors.filter((f) => f.appearance === 'light');
    const darkThemes = flavors.filter((f) => f.appearance === 'dark');

    lightThemes.forEach((light) => {
      const lightBg = light.tokens.background.base;
      const lightBrightness = hexToBrightness(lightBg);

      darkThemes.forEach((dark) => {
        const darkBg = dark.tokens.background.base;
        const darkBrightness = hexToBrightness(darkBg);

        expect(
          lightBrightness,
          `${light.id} should be brighter than ${dark.id}`
        ).toBeGreaterThan(darkBrightness);
      });
    });
  });

  it('dark themes have distinct background colors', () => {
    const darkThemes = flavors.filter((f) => f.appearance === 'dark');
    const backgrounds = new Set<string>();

    darkThemes.forEach((theme) => {
      const bg = theme.tokens.background.base;
      expect(
        backgrounds.has(bg),
        `Duplicate dark background ${bg} in ${theme.id}`
      ).toBe(false);
      backgrounds.add(bg);
    });
  });

  it('at least 2 distinct light backgrounds exist', () => {
    const lightThemes = flavors.filter((f) => f.appearance === 'light');
    const backgrounds = new Set(lightThemes.map((t) => t.tokens.background.base));
    expect(backgrounds.size).toBeGreaterThanOrEqual(2);
  });
});

describe('CSS Output - Font Imports', () => {
  // Filter flavors that have web fonts defined
  const flavorsWithWebFonts = flavors
    .filter((f) => (f.tokens.typography?.webFonts ?? []).length > 0)
    .map((f) => [f.id, f.tokens.typography?.webFonts ?? []] as const);

  it.each(flavorsWithWebFonts)(
    '%s.css has @import for web fonts',
    (themeId, webFonts) => {
      const themePath = path.join(turboThemesDir, `${themeId}.css`);
      const css = readFile(themePath);

      webFonts.forEach((fontUrl) => {
        expect(css).toContain(`@import url('${fontUrl}')`);
      });
    }
  );
});
