#!/usr/bin/env node
// SPDX-License-Identifier: MIT
/**
 * Build script for Bulma adapter CSS output.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageRoot = path.resolve(__dirname, '..');
const distDir = path.join(packageRoot, 'dist');

async function main() {
  // Import the compiled module
  const modPath = pathToFileURL(path.join(distDir, 'index.js'));
  const { BULMA_ADAPTER_CSS } = await import(modPath.href);

  // Write the CSS file
  const outputPath = path.join(distDir, 'bulma-adapter.css');
  fs.writeFileSync(outputPath, BULMA_ADAPTER_CSS, 'utf8');

  const sizeKb = (Buffer.byteLength(BULMA_ADAPTER_CSS, 'utf8') / 1024).toFixed(2);
  console.log(`  Wrote bulma-adapter.css (${sizeKb} KB)`);
}

main().catch((error) => {
  console.error('Failed to build Bulma adapter CSS:', error.message);
  process.exit(1);
});
