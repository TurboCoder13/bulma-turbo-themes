import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';
import { describe, it, expect } from 'vitest';

const DIST_DIRS = [
  'packages/theme-selector/dist',
  'packages/adapters/tailwind/dist',
  'packages/adapters/bulma/dist',
  'packages/css/dist',
];

// =============================================================================
// Test 1: No private package imports in compiled JavaScript
// =============================================================================
describe('No @lgtm-hq/turbo-themes-core imports in dist JS files', () => {
  for (const distDir of DIST_DIRS) {
    if (!existsSync(distDir)) continue;

    const jsFiles = readdirSync(distDir).filter((f) => f.endsWith('.js'));

    for (const file of jsFiles) {
      it(`${distDir}/${file} should not import from private core package`, () => {
        const content = readFileSync(join(distDir, file), 'utf-8');
        expect(content).not.toMatch(/from\s+['"]@lgtm-hq\/turbo-themes-core/);
        expect(content).not.toMatch(/import\s*\{[^}]*\}\s*from\s*['"]@lgtm-hq\/turbo-themes-core/);
      });
    }
  }
});

// =============================================================================
// Test 2: No private package references in type declarations
// =============================================================================
describe('No @lgtm-hq/turbo-themes-core references in .d.ts files', () => {
  for (const distDir of DIST_DIRS) {
    if (!existsSync(distDir)) continue;

    const dtsFiles = readdirSync(distDir).filter((f) => f.endsWith('.d.ts'));

    for (const file of dtsFiles) {
      it(`${distDir}/${file} should not reference private core package`, () => {
        const content = readFileSync(join(distDir, file), 'utf-8');
        expect(content).not.toMatch(/@lgtm-hq\/turbo-themes-core/);
      });
    }
  }
});

// =============================================================================
// Test 3: Public API surface is preserved
// =============================================================================
describe('Public API exports are available', () => {
  it('theme-selector exports initTheme, wireFlavorSelector, initNavbar, enhanceAccessibility', async () => {
    const mod = await import('../../packages/theme-selector/dist/index.js');
    expect(typeof mod.initTheme).toBe('function');
    expect(typeof mod.wireFlavorSelector).toBe('function');
    expect(typeof mod.initNavbar).toBe('function');
    expect(typeof mod.enhanceAccessibility).toBe('function');
  });

  it('tailwind adapter exports preset function and re-exports from core', async () => {
    const mod = await import('../../packages/adapters/tailwind/dist/preset.js');
    expect(typeof mod.default).toBe('function');
    expect(typeof mod.getTheme).toBe('function');
    expect(mod.themeIds).toBeDefined();
    expect(Array.isArray(mod.themeIds)).toBe(true);
  });

  it('css package exports generateThemeCss', async () => {
    const mod = await import('../../packages/css/dist/index.js');
    expect(typeof mod.generateThemeCss).toBe('function');
  });
});

// =============================================================================
// Test 4: Bundle contains expected inlined data
// =============================================================================
describe('Bundled packages contain inlined theme data', () => {
  it('theme-selector bundle contains theme IDs', () => {
    const content = readFileSync('packages/theme-selector/dist/index.js', 'utf-8');
    // Should contain actual theme IDs from bundled flavors
    expect(content).toMatch(/catppuccin-mocha|bulma-dark|dracula/);
  });

  it('tailwind adapter bundle contains theme IDs (in entry or chunks)', () => {
    // The theme IDs may be in the main entry or in a chunked file
    const distPath = 'packages/adapters/tailwind/dist';
    const files = readdirSync(distPath).filter((f) => f.endsWith('.js'));
    // Read files using full paths constructed from known directory listing (no user input)
    const allContent = files.map((filename) => readFileSync(`${distPath}/${filename}`, 'utf-8')).join('\n');
    expect(allContent).toMatch(/catppuccin-mocha|bulma-dark|dracula/);
  });
});
