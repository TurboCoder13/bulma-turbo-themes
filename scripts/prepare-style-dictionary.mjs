#!/usr/bin/env node
/**
 * Prepare tokens for Style Dictionary
 *
 * This script transforms W3C Design Tokens format into Style Dictionary format
 * while preserving $type metadata for better tooling support.
 *
 * Input: schema/tokens/themes/*.tokens.json (W3C format)
 * Output: dist/tokens/style-dictionary/themes.json
 */

import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateThemeId } from './utils/validation.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const themesDir = join(projectRoot, 'schema', 'tokens', 'themes');
const sharedTokensPath = join(projectRoot, 'schema', 'tokens', '_shared.tokens.json');
const outputDir = join(projectRoot, 'dist', 'tokens', 'style-dictionary');
const packageJsonPath = join(projectRoot, 'package.json');

// Get version from package.json
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
const version = packageJson.version;

/**
 * Keep W3C token format as-is for Style Dictionary 5.x.
 * SD 5.x supports W3C Design Tokens format: { "$value": "#fff", "$type": "color" }
 */
function transformToken(w3cToken) {
  // SD 5.x supports W3C format directly, no transformation needed
  return w3cToken;
}

/**
 * Extract $value from a W3C token, recursively processing nested objects.
 * Used for generating flat tokens.json for runtime consumption.
 */
function extractValues(obj) {
  if (obj === null || obj === undefined) {
    return obj;
  }

  // If it's a W3C token with $value, extract it
  if (typeof obj === 'object' && '$value' in obj) {
    return obj.$value;
  }

  // If it's an array, process each element
  if (Array.isArray(obj)) {
    return obj.map(extractValues);
  }

  // If it's an object, recursively process each property
  if (typeof obj === 'object') {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      // Skip schema metadata keys
      if (key.startsWith('$')) continue;
      result[key] = extractValues(value);
    }
    return result;
  }

  // Return primitives as-is
  return obj;
}

// Vendor metadata for byVendor grouping
const vendorMeta = {
  bulma: { name: 'Bulma', homepage: 'https://bulma.io/' },
  catppuccin: { name: 'Catppuccin (synced)', homepage: 'https://catppuccin.com/palette/' },
  dracula: { name: 'Dracula', homepage: 'https://draculatheme.com/' },
  github: { name: 'GitHub (synced)', homepage: 'https://primer.style/' },
  nord: { name: 'Nord', homepage: 'https://www.nordtheme.com/' },
  'rose-pine': { name: 'Rosé Pine (synced)', homepage: 'https://rosepinetheme.com/' },
  solarized: { name: 'Solarized', homepage: 'https://ethanschoonover.com/solarized/' },
};

/**
 * Group themes by vendor
 */
function groupByVendor(themes) {
  const vendors = {};

  for (const [themeId, theme] of Object.entries(themes)) {
    const vendor = theme.vendor;
    if (!vendors[vendor]) {
      vendors[vendor] = {
        name: vendorMeta[vendor]?.name || vendor,
        homepage: vendorMeta[vendor]?.homepage || '',
        themes: [],
      };
    }
    vendors[vendor].themes.push(themeId);
  }

  return vendors;
}

/**
 * Recursively transform a token tree to Style Dictionary format.
 * Preserves nested structure for category grouping.
 */
function transformTokenTree(obj, path = []) {
  if (obj === null || obj === undefined) {
    return obj;
  }

  // If it's a W3C token with $value, transform it
  if (typeof obj === 'object' && '$value' in obj) {
    return transformToken(obj);
  }

  // If it's an array, process each element
  if (Array.isArray(obj)) {
    return obj.map((item, i) => transformTokenTree(item, [...path, String(i)]));
  }

  // If it's an object, recursively process each property
  if (typeof obj === 'object') {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      // Skip schema metadata keys (except $type which we preserve on tokens)
      if (key === '$schema' || key === '$description') continue;
      result[key] = transformTokenTree(value, [...path, key]);
    }
    return result;
  }

  // Return primitives as-is
  return obj;
}

/**
 * Deep merge two objects, with source overwriting target.
 */
function deepMerge(target, source) {
  const result = { ...target };

  for (const [key, value] of Object.entries(source)) {
    if (
      value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      !('value' in value) && // Don't recurse into token objects
      result[key] &&
      typeof result[key] === 'object' &&
      !Array.isArray(result[key])
    ) {
      result[key] = deepMerge(result[key], value);
    } else {
      result[key] = value;
    }
  }

  return result;
}

/**
 * Load and transform shared tokens
 */
function loadSharedTokens() {
  const data = JSON.parse(readFileSync(sharedTokensPath, 'utf-8'));
  return transformTokenTree(data);
}

/**
 * Load and transform a single theme file
 */
function loadTheme(filePath) {
  const data = JSON.parse(readFileSync(filePath, 'utf-8'));

  // Extract theme metadata
  const { id, label, vendor, appearance, iconUrl, tokens } = data;

  // Validate theme ID before using it in file paths or CSS selectors
  validateThemeId(id);

  // Transform tokens to Style Dictionary format (preserving $type)
  const transformedTokens = transformTokenTree(tokens);

  return {
    id,
    label,
    vendor,
    appearance,
    ...(iconUrl && { iconUrl }),
    tokens: transformedTokens,
  };
}

/**
 * Main function
 */
function main() {
  console.log('[prepare-style-dictionary] Starting token transformation...');

  // Ensure output directory exists
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  // Load shared tokens
  const sharedTokens = loadSharedTokens();
  console.log(`[prepare-style-dictionary] Loaded shared tokens`);

  // Load all theme files
  const themeFiles = readdirSync(themesDir)
    .filter((f) => f.endsWith('.tokens.json'))
    .sort();

  const themes = {};
  const themeIds = [];

  for (const file of themeFiles) {
    const filePath = join(themesDir, file);
    const theme = loadTheme(filePath);
    themes[theme.id] = theme;
    themeIds.push(theme.id);
    console.log(`[prepare-style-dictionary] Processed theme: ${theme.id}`);
  }

  // Group themes by vendor
  const byVendor = groupByVendor(themes);

  // Build output structure for Style Dictionary
  const output = {
    $schema: 'https://design-tokens.org/schema.json',
    $description: `Turbo Themes - Design tokens for ${themeIds.length} themes`,
    $version: version,
    $generated: new Date().toISOString(),
    meta: {
      themeIds,
      totalThemes: themeIds.length,
    },
    shared: sharedTokens,
    themes,
    byVendor,
  };

  // Write main themes file (SD format with $value)
  const outputPath = join(outputDir, 'themes.json');
  writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log(`[prepare-style-dictionary] Wrote ${outputPath}`);

  // Build flat tokens structure for TypeScript/runtime consumption
  // This extracts $value from W3C tokens for direct use
  const flatThemes = {};
  for (const [id, theme] of Object.entries(themes)) {
    flatThemes[id] = {
      id: theme.id,
      label: theme.label,
      vendor: theme.vendor,
      appearance: theme.appearance,
      ...(theme.iconUrl && { iconUrl: theme.iconUrl }),
      tokens: extractValues(theme.tokens),
    };
  }

  const tokensOutput = {
    $schema: 'https://design-tokens.org/schema.json',
    $description: `Turbo Themes - Flat tokens for ${themeIds.length} themes`,
    $version: version,
    $generated: new Date().toISOString(),
    meta: {
      themeIds,
      totalThemes: themeIds.length,
    },
    shared: extractValues(sharedTokens),
    themes: flatThemes,
    byVendor,
  };

  // Write flat tokens file for TypeScript/runtime
  const tokensPath = join(outputDir, 'tokens.json');
  writeFileSync(tokensPath, JSON.stringify(tokensOutput, null, 2));
  console.log(`[prepare-style-dictionary] Wrote ${tokensPath}`);

  // Also write individual theme files for Style Dictionary platform configs
  // Note: These files contain ONLY tokens (no metadata) for SD compatibility
  // We keep nested structure as SD requires it (not flat hyphenated keys)
  for (const [id, theme] of Object.entries(themes)) {
    // Deep merge shared tokens with theme tokens
    const mergedTokens = deepMerge(sharedTokens, theme.tokens);

    const themeOutputPath = join(outputDir, `${id}.json`);
    writeFileSync(themeOutputPath, JSON.stringify(mergedTokens, null, 2));
  }

  console.log(`[prepare-style-dictionary] Wrote ${themeIds.length} individual theme files`);
  console.log('[prepare-style-dictionary] Done!');
}

main();
