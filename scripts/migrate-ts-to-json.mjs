#!/usr/bin/env node
/**
 * Migration script: Convert existing tokens from dist/tokens.json to individual W3C format JSON files
 *
 * This is a one-time migration script that:
 * 1. Reads the current dist/tokens.json (generated from TypeScript)
 * 2. Converts each theme to W3C Design Tokens format with $value/$type
 * 3. Writes individual .tokens.json files to schema/tokens/themes/
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const inputPath = join(projectRoot, 'dist', 'tokens.json');
const outputDir = join(projectRoot, 'schema', 'tokens', 'themes');

/**
 * Convert a simple value to W3C token format
 */
function toColorToken(value) {
  return { $value: value, $type: 'color' };
}

function toDimensionToken(value) {
  return { $value: value, $type: 'dimension' };
}

function toShadowToken(value) {
  return { $value: value, $type: 'shadow' };
}

function toDurationToken(value) {
  return { $value: value, $type: 'duration' };
}

function toCubicBezierToken(value) {
  return { $value: value, $type: 'cubicBezier' };
}

function toNumberToken(value) {
  return { $value: value, $type: 'number' };
}

function toFontFamilyToken(value) {
  return { $value: value, $type: 'fontFamily' };
}

/**
 * Convert a group of tokens (e.g., background colors)
 */
function convertColorGroup(group) {
  const result = {};
  for (const [key, value] of Object.entries(group)) {
    result[key] = toColorToken(value);
  }
  return result;
}

/**
 * Convert spacing tokens
 */
function convertSpacingTokens(spacing) {
  const result = {};
  for (const [key, value] of Object.entries(spacing)) {
    result[key] = toDimensionToken(value);
  }
  return result;
}

/**
 * Convert elevation tokens
 */
function convertElevationTokens(elevation) {
  const result = {};
  for (const [key, value] of Object.entries(elevation)) {
    result[key] = toShadowToken(value);
  }
  return result;
}

/**
 * Convert animation tokens
 */
function convertAnimationTokens(animation) {
  return {
    durationFast: toDurationToken(animation.durationFast),
    durationNormal: toDurationToken(animation.durationNormal),
    durationSlow: toDurationToken(animation.durationSlow),
    easingDefault: toCubicBezierToken(animation.easingDefault),
    easingEmphasized: toCubicBezierToken(animation.easingEmphasized),
  };
}

/**
 * Convert opacity tokens
 */
function convertOpacityTokens(opacity) {
  return {
    disabled: toNumberToken(opacity.disabled),
    hover: toNumberToken(opacity.hover),
    pressed: toNumberToken(opacity.pressed),
  };
}

/**
 * Convert typography tokens
 */
function convertTypographyTokens(typography) {
  return {
    fonts: {
      sans: toFontFamilyToken(typography.fonts.sans),
      mono: toFontFamilyToken(typography.fonts.mono),
    },
    webFonts: typography.webFonts,
  };
}

/**
 * Convert content tokens
 */
function convertContentTokens(content) {
  return {
    heading: convertColorGroup(content.heading),
    body: convertColorGroup(content.body),
    link: convertColorGroup(content.link),
    selection: convertColorGroup(content.selection),
    blockquote: convertColorGroup(content.blockquote),
    codeInline: convertColorGroup(content.codeInline),
    codeBlock: convertColorGroup(content.codeBlock),
    table: convertColorGroup(content.table),
  };
}

/**
 * Convert component tokens (if present)
 */
function convertComponentTokens(components) {
  if (!components) return undefined;

  const result = {};
  for (const [componentName, componentTokens] of Object.entries(components)) {
    result[componentName] = convertColorGroup(componentTokens);
  }
  return result;
}

/**
 * Check if theme has layout tokens (spacing/elevation/animation/opacity)
 */
function hasLayoutTokens(tokens) {
  return !!(tokens.spacing && tokens.elevation && tokens.animation && tokens.opacity);
}

/**
 * Convert a single theme to W3C format
 */
function convertTheme(themeId, theme) {
  const { tokens, ...themeMeta } = theme;
  const includesLayout = hasLayoutTokens(tokens);

  const convertedTokens = {
    background: convertColorGroup(tokens.background),
    text: convertColorGroup(tokens.text),
    brand: convertColorGroup(tokens.brand),
    state: convertColorGroup(tokens.state),
    border: convertColorGroup(tokens.border),
    accent: convertColorGroup(tokens.accent),
    typography: convertTypographyTokens(tokens.typography),
    content: convertContentTokens(tokens.content),
  };

  // Add layout tokens if theme has them (otherwise they'll be inherited from shared)
  if (includesLayout) {
    convertedTokens.spacing = convertSpacingTokens(tokens.spacing);
    convertedTokens.elevation = convertElevationTokens(tokens.elevation);
    convertedTokens.animation = convertAnimationTokens(tokens.animation);
    convertedTokens.opacity = convertOpacityTokens(tokens.opacity);
  }

  // Add component tokens if present
  if (tokens.components) {
    convertedTokens.components = convertComponentTokens(tokens.components);
  }

  const result = {
    $schema: '../../turbo-themes.schema.json#/$defs/ThemeFile',
    id: themeMeta.id,
    label: themeMeta.label,
    vendor: themeMeta.vendor,
    appearance: themeMeta.appearance,
    tokens: convertedTokens,
  };

  // Add iconUrl if present (remove leading slash for relative path)
  if (themeMeta.iconUrl) {
    result.iconUrl = themeMeta.iconUrl;
  }

  return result;
}

/**
 * Main migration function
 */
function migrate() {
  console.log('Reading dist/tokens.json...');
  const tokensJson = JSON.parse(readFileSync(inputPath, 'utf-8'));

  // Ensure output directory exists
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const themes = tokensJson.themes;
  const themeIds = Object.keys(themes);

  console.log(`Found ${themeIds.length} themes to migrate:`);
  console.log(themeIds.map(id => `  - ${id}`).join('\n'));
  console.log();

  for (const themeId of themeIds) {
    const theme = themes[themeId];
    const converted = convertTheme(themeId, theme);

    const outputPath = join(outputDir, `${themeId}.tokens.json`);
    writeFileSync(outputPath, JSON.stringify(converted, null, 2) + '\n');

    const hasLayout = hasLayoutTokens(theme.tokens);
    const hasComponents = !!theme.tokens.components;
    console.log(`  Migrated: ${themeId}.tokens.json${hasLayout ? ' (with layout)' : ''}${hasComponents ? ' (with components)' : ''}`);
  }

  console.log();
  console.log('Migration complete!');
  console.log(`Output written to: ${outputDir}`);
}

// Run migration
migrate();
