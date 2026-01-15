#!/usr/bin/env node
/**
 * Build tokens with Style Dictionary
 *
 * Uses the Style Dictionary programmatic API to build platform-specific
 * token outputs from the prepared token files.
 */

import { readdirSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import StyleDictionary from 'style-dictionary';

import { allTransforms } from '../config/style-dictionary/transforms.mjs';
import { allFormats } from '../config/style-dictionary/formats.mjs';
import { validateThemeId } from './utils/validation.mjs';

// Register formats and transforms globally before creating instances
for (const transform of allTransforms) {
  StyleDictionary.registerTransform(transform);
}
for (const format of allFormats) {
  StyleDictionary.registerFormat(format);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const tokensDir = join(projectRoot, 'dist', 'tokens', 'style-dictionary');

/**
 * Get all individual theme token files
 */
function getThemeTokenFiles() {
  return readdirSync(tokensDir)
    .filter((f) => f.endsWith('.json') && f !== 'themes.json' && f !== 'tokens.json')
    .map((f) => join(tokensDir, f));
}

/**
 * Build tokens for a single theme
 */
async function buildTheme(tokenFile, themeId) {
  console.log(`[style-dictionary] Building theme: ${themeId}`);

  // Ensure output directories exist
  const themesDir = join(projectRoot, 'assets', 'css', 'themes');
  if (!existsSync(themesDir)) {
    mkdirSync(themesDir, { recursive: true });
  }

  const sd = new StyleDictionary({
    source: [tokenFile],

    log: {
      verbosity: 'verbose',
    },

    platforms: {
      // CSS custom properties for this theme
      css: {
        transformGroup: 'css',
        transforms: ['turbo/name-short'],
        buildPath: 'assets/css/themes/',
        files: [
          {
            destination: `${themeId}.css`,
            format: 'css/variables-with-metadata',
            options: {
              selector: `[data-theme="${themeId}"]`,
              prefix: 'turbo',
            },
          },
        ],
      },
    },
  });

  await sd.buildAllPlatforms();
}

/**
 * Build shared/core tokens
 */
async function buildCore() {
  console.log('[style-dictionary] Building core tokens...');

  // Use catppuccin-mocha as the default theme for core tokens
  const themeFiles = getThemeTokenFiles();
  if (themeFiles.length === 0) {
    console.error('[style-dictionary] No theme token files found!');
    process.exit(1);
  }

  // Find catppuccin-mocha as the default, fall back to first theme
  const defaultThemeFile =
    themeFiles.find((f) => basename(f, '.json') === 'catppuccin-mocha') || themeFiles[0];
  console.log(`[style-dictionary] Using default theme: ${basename(defaultThemeFile, '.json')}`);

  // Ensure all output directories exist
  const outputDirs = [
    join(projectRoot, 'dist', 'tokens'),
    join(projectRoot, 'assets', 'css'),
    join(projectRoot, 'assets', 'scss'),
    join(projectRoot, 'packages', 'core', 'src', 'themes', 'generated'),
    join(projectRoot, 'python', 'src', 'turbo_themes', 'generated'),
    join(projectRoot, 'swift', 'Sources', 'TurboThemes', 'Generated'),
  ];

  for (const dir of outputDirs) {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
      console.log(`[style-dictionary] Created directory: ${dir}`);
    }
  }

  const sd = new StyleDictionary({
    source: [defaultThemeFile], // Use default theme (catppuccin-mocha) for structure

    log: {
      verbosity: 'default',
    },

    platforms: {
      // Core CSS custom properties with :root selector
      css: {
        transformGroup: 'css',
        transforms: ['turbo/name-short'],
        buildPath: 'assets/css/',
        files: [
          {
            destination: 'turbo-core.css',
            format: 'css/variables-with-metadata',
            options: {
              selector: ':root',
              prefix: 'turbo',
            },
          },
        ],
      },

      // SCSS map with type annotations
      scss: {
        transformGroup: 'scss',
        transforms: ['turbo/name-short'],
        buildPath: 'assets/scss/',
        files: [
          {
            destination: '_tokens.scss',
            format: 'scss/map-with-types',
            options: {
              mapName: 'turbo-tokens',
            },
          },
        ],
      },

      // JSON with types for tooling
      json: {
        transformGroup: 'js',
        transforms: ['turbo/name-short'],
        buildPath: 'dist/tokens/',
        files: [
          {
            destination: 'tokens-typed.json',
            format: 'json/with-types',
          },
        ],
      },

      // JavaScript ESM
      js: {
        transformGroup: 'js',
        transforms: ['turbo/name-short'],
        buildPath: 'packages/core/src/themes/generated/',
        files: [
          {
            destination: 'tokens.js',
            format: 'javascript/esm-with-types',
            options: {
              exportName: 'tokens',
            },
          },
        ],
      },

      // Python dataclass
      python: {
        transformGroup: 'js',
        transforms: ['turbo/name-short'],
        buildPath: 'python/src/turbo_themes/generated/',
        files: [
          {
            destination: 'tokens.py',
            format: 'python/dataclass',
            options: {
              className: 'TurboTokens',
            },
          },
        ],
      },

      // Swift struct
      swift: {
        transformGroup: 'js',
        transforms: ['turbo/name-short'],
        buildPath: 'swift/Sources/TurboThemes/Generated/',
        files: [
          {
            destination: 'Tokens.swift',
            format: 'swift/struct',
            options: {
              structName: 'TurboTokens',
            },
          },
        ],
      },
    },
  });

  await sd.buildAllPlatforms();
}

/**
 * Main function
 */
async function main() {
  console.log('[style-dictionary] Starting build...');

  // Build core tokens first
  await buildCore();

  // Build each theme
  const themeFiles = getThemeTokenFiles();
  for (const file of themeFiles) {
    // Extract and validate theme ID from filename
    const themeId = basename(file, '.json');
    validateThemeId(themeId);
    await buildTheme(file, themeId);
  }

  console.log(`[style-dictionary] Built ${themeFiles.length} themes`);
  console.log('[style-dictionary] Done!');
}

main().catch((err) => {
  console.error('[style-dictionary] Build failed:', err);
  process.exit(1);
});
