#!/usr/bin/env node
// SPDX-License-Identifier: MIT
/**
 * Build script for @turbo-themes/css package.
 *
 * Generates pure CSS Custom Properties files from theme tokens.
 *
 * Output:
 *   - dist/turbo.css              (combined: core + all themes)
 *   - dist/turbo-core.css         (just default variables in :root)
 *   - dist/turbo-base.css         (semantic styles using variables)
 *   - dist/turbo-syntax.css       (syntax highlighting styles)
 *   - dist/turbo-themes-all.css   (all [data-theme] selectors, no :root — FOUC-free)
 *   - dist/themes/<id>.css        (individual theme files)
 *   - dist/components/            (pre-built UI components)
 *   - dist/turbo-components.css   (all components bundled)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageRoot = path.resolve(__dirname, '..');
const distDir = path.join(packageRoot, 'dist');
const themesDir = path.join(distDir, 'themes');
const componentsDistDir = path.join(distDir, 'components');
const componentsSrcDir = path.join(packageRoot, 'src', 'components');

// Path to compiled core package
const coreDistPath = path.resolve(packageRoot, '..', 'core', 'dist', 'tokens', 'index.js');

// Component files in order of import
const COMPONENT_FILES = [
  'buttons.css',
  'cards.css',
  'forms.css',
  'tables.css',
  'tabs.css',
  'progress.css',
  'tags.css',
  'notifications.css',
  'navigation.css',
  'sidebar.css',
];

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeFile(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, 'utf8');
  const relativePath = path.relative(packageRoot, filePath);
  const sizeKb = (Buffer.byteLength(content, 'utf8') / 1024).toFixed(2);
  console.log(`  ${relativePath} (${sizeKb} KB)`);
}

function buildComponents() {
  console.log('\nBuilding components...\n');
  ensureDir(componentsDistDir);

  let bundleContent = `/* ==========================================================================
   Turbo Themes - Components Bundle
   Generated from individual component files.
   ========================================================================== */

`;

  let totalSize = 0;
  console.log('  components/');

  for (const file of COMPONENT_FILES) {
    const srcPath = path.join(componentsSrcDir, file);
    const destPath = path.join(componentsDistDir, file);

    if (!fs.existsSync(srcPath)) {
      console.warn(`  Warning: ${file} not found, skipping`);
      continue;
    }

    const content = fs.readFileSync(srcPath, 'utf8');
    fs.writeFileSync(destPath, content, 'utf8');

    const sizeKb = (Buffer.byteLength(content, 'utf8') / 1024).toFixed(2);
    totalSize += Buffer.byteLength(content, 'utf8');
    console.log(`    ${file} (${sizeKb} KB)`);

    // Add to bundle (strip the import statements from index.css style)
    bundleContent += content + '\n\n';
  }

  // Write the combined bundle
  const bundlePath = path.join(distDir, 'turbo-components.css');
  writeFile(bundlePath, bundleContent);

  return { totalSize, bundleSize: Buffer.byteLength(bundleContent, 'utf8') };
}

async function loadCoreTokens() {
  const modPath = pathToFileURL(coreDistPath);
  return import(modPath.href);
}

async function loadCssGenerators() {
  const cssDistPath = pathToFileURL(path.join(distDir, 'index.js'));
  return import(cssDistPath.href);
}

async function main() {
  console.log('\nBuilding @turbo-themes/css...\n');

  // Load core tokens and CSS generators
  const { flavors } = await loadCoreTokens();
  const {
    generateCoreCss,
    generateThemeCss,
    generateCombinedCss,
    generateThemesOnlyCss,
    generateBaseCss,
    generateSyntaxBaseCss,
  } = await loadCssGenerators();

  if (!Array.isArray(flavors) || flavors.length === 0) {
    throw new Error('No flavors found in core package');
  }

  console.log(`Found ${flavors.length} theme flavors\n`);
  console.log('Generated files:');

  // Generate turbo-core.css (default variables from first theme)
  const defaultFlavor = flavors.find((f) => f.id === 'catppuccin-mocha') || flavors[0];
  const coreCss = generateCoreCss(defaultFlavor);
  writeFile(path.join(distDir, 'turbo-core.css'), coreCss);

  // Generate turbo-base.css (semantic styles)
  const baseCss = generateBaseCss();
  writeFile(path.join(distDir, 'turbo-base.css'), baseCss);

  // Generate turbo-syntax.css (syntax highlighting)
  const syntaxCss = generateSyntaxBaseCss();
  writeFile(path.join(distDir, 'turbo-syntax.css'), syntaxCss);

  // Generate individual theme files
  console.log('\n  themes/');
  let totalThemeSize = 0;
  for (const flavor of flavors) {
    const themeCss = generateThemeCss(flavor);
    const themePath = path.join(themesDir, `${flavor.id}.css`);
    const sizeBytes = Buffer.byteLength(themeCss, 'utf8');
    totalThemeSize += sizeBytes;
    writeFile(themePath, themeCss);
  }

  // Generate turbo.css (combined bundle)
  console.log('');
  const combinedCss = generateCombinedCss(flavors, 'catppuccin-mocha');
  writeFile(path.join(distDir, 'turbo.css'), combinedCss);

  // Generate turbo-themes-all.css (all [data-theme] selectors, no :root — FOUC-free)
  const themesOnlyCss = generateThemesOnlyCss(flavors);
  writeFile(path.join(distDir, 'turbo-themes-all.css'), themesOnlyCss);

  // Build component CSS files
  const { totalSize: componentsTotalSize, bundleSize: componentsBundleSize } = buildComponents();

  // Summary
  const coreSize = Buffer.byteLength(coreCss, 'utf8');
  const baseSize = Buffer.byteLength(baseCss, 'utf8');
  const syntaxSize = Buffer.byteLength(syntaxCss, 'utf8');
  const combinedSize = Buffer.byteLength(combinedCss, 'utf8');
  const themesOnlySize = Buffer.byteLength(themesOnlyCss, 'utf8');
  const avgThemeSize = totalThemeSize / flavors.length;

  console.log('\n--- Build Summary ---');
  console.log(`  Core CSS:       ${(coreSize / 1024).toFixed(2)} KB`);
  console.log(`  Base CSS:       ${(baseSize / 1024).toFixed(2)} KB`);
  console.log(`  Syntax CSS:     ${(syntaxSize / 1024).toFixed(2)} KB`);
  console.log(`  Components CSS: ${(componentsBundleSize / 1024).toFixed(2)} KB`);
  console.log(`  Combined CSS:   ${(combinedSize / 1024).toFixed(2)} KB`);
  console.log(`  Themes Only:    ${(themesOnlySize / 1024).toFixed(2)} KB`);
  console.log(`  Avg theme:      ${(avgThemeSize / 1024).toFixed(2)} KB`);
  console.log(`  Total themes:   ${flavors.length}`);
  console.log('\nBuild complete!\n');
}

main().catch((error) => {
  console.error('\nBuild failed:', error.message);
  process.exit(1);
});
