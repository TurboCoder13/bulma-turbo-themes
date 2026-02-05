import { readFileSync, readdirSync, existsSync, statSync } from 'fs';
import { join } from 'path';
import { describe, it, expect } from 'vitest';

const DIST_DIRS = [
  'packages/theme-selector/dist',
  'packages/adapters/tailwind/dist',
  'packages/adapters/bulma/dist',
  'packages/css/dist',
];

/**
 * Recursively get all files with a given extension from a directory.
 */
function getFilesRecursively(dir: string, ext: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    // nosemgrep: path-join-resolve-traversal - Safe: entry.name comes from readdirSync, not user input
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getFilesRecursively(fullPath, ext));
    } else if (entry.name.endsWith(ext)) {
      files.push(fullPath);
    }
  }
  return files;
}

// =============================================================================
// Test 0: Verify dist directories exist after build
// =============================================================================
describe('Dist directories should exist after build', () => {
  for (const distDir of DIST_DIRS) {
    it(`${distDir} should exist`, () => {
      expect(existsSync(distDir), `Expected ${distDir} to exist after build`).toBe(true);
    });
  }
});

// =============================================================================
// Test 1: No private package imports in compiled JavaScript
// =============================================================================
describe('No @lgtm-hq/turbo-themes-core imports in dist JS files', () => {
  for (const distDir of DIST_DIRS) {
    // Skip file tests if directory doesn't exist (for local dev before build)
    if (!existsSync(distDir)) continue;

    const jsFiles = getFilesRecursively(distDir, '.js');

    for (const file of jsFiles) {
      it(`${file} should not import from private core package`, () => {
        const content = readFileSync(file, 'utf-8');
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
    // Skip file tests if directory doesn't exist (for local dev before build)
    if (!existsSync(distDir)) continue;

    const dtsFiles = getFilesRecursively(distDir, '.d.ts');

    for (const file of dtsFiles) {
      it(`${file} should not reference private core package`, () => {
        const content = readFileSync(file, 'utf-8');
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
    const files = getFilesRecursively(distPath, '.js');
    // Read files using full paths constructed from known directory listing (no user input)
    const allContent = files.map((filePath) => readFileSync(filePath, 'utf-8')).join('\n');
    expect(allContent).toMatch(/catppuccin-mocha|bulma-dark|dracula/);
  });
});
