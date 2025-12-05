#!/usr/bin/env node
// SPDX-License-Identifier: MIT
/**
 * Generate tokens.json for non-JS platforms
 *
 * This script outputs all design tokens as a JSON file that can be used by:
 * - Flutter/Dart apps
 * - iOS/Swift apps
 * - Android/Kotlin apps
 * - Any platform that can read JSON
 *
 * The JSON follows the W3C Design Tokens Community Group format where practical.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Import the compiled tokens
const distDir = path.join(projectRoot, 'dist');

async function main() {
  // Dynamic import of the compiled module
  const { flavors, packages } = await import(
    new URL(`file://${path.join(distDir, 'tokens/index.js')}`).href
  );

  // Build the output structure
  const output = {
    $schema: 'https://design-tokens.org/schema.json',
    $description: 'Bulma Turbo Themes - Cross-platform design tokens',
    $version: JSON.parse(
      fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8')
    ).version,
    $generated: new Date().toISOString(),

    // Metadata about available themes
    meta: {
      themeIds: flavors.map((f) => f.id),
      vendors: [...new Set(flavors.map((f) => f.vendor))],
      totalThemes: flavors.length,
      lightThemes: flavors.filter((f) => f.appearance === 'light').length,
      darkThemes: flavors.filter((f) => f.appearance === 'dark').length,
    },

    // All themes with their tokens
    themes: Object.fromEntries(
      flavors.map((flavor) => [
        flavor.id,
        {
          $description: `${flavor.label} theme`,
          id: flavor.id,
          label: flavor.label,
          vendor: flavor.vendor,
          appearance: flavor.appearance,
          tokens: flavor.tokens,
        },
      ])
    ),

    // Grouped by vendor for convenience
    byVendor: Object.fromEntries(
      Object.entries(packages).map(([vendorId, pkg]) => [
        vendorId,
        {
          name: pkg.name,
          homepage: pkg.homepage,
          themes: pkg.flavors.map((f) => f.id),
        },
      ])
    ),
  };

  // Write to dist/tokens.json
  const outputPath = path.join(distDir, 'tokens.json');
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf8');

  console.log(`✅ Generated ${outputPath}`);
  console.log(`   ${flavors.length} themes exported`);
  console.log(`   ${output.meta.lightThemes} light, ${output.meta.darkThemes} dark`);
}

main().catch((error) => {
  console.error('❌ Failed to generate tokens.json:', error);
  process.exit(1);
});
