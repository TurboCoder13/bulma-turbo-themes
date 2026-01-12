/* SPDX-License-Identifier: MIT */
/**
 * Copy adapter assets to dist for package exports
 *
 * This script ensures adapter files are available at the paths
 * declared in package.json exports.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function copyFile(src, dest) {
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
  console.log(`✅ Copied ${path.relative(projectRoot, src)} → ${path.relative(projectRoot, dest)}`);
}

function main() {
  try {
    // Copy Tailwind preset (from built output)
    const tailwindPresetSrc = path.join(projectRoot, 'packages/adapters/tailwind/dist/preset.js');
    const tailwindColorsSrc = path.join(projectRoot, 'packages/adapters/tailwind/dist/colors.js');
    
    if (fs.existsSync(tailwindPresetSrc)) {
      copyFile(
        tailwindPresetSrc,
        path.join(projectRoot, 'dist/adapters/tailwind/preset.js')
      );
    }
    
    if (fs.existsSync(tailwindColorsSrc)) {
      copyFile(
        tailwindColorsSrc,
        path.join(projectRoot, 'dist/adapters/tailwind/colors.js')
      );
    }

    // Copy Bootstrap adapter (SCSS files, no build needed)
    copyFile(
      path.join(projectRoot, 'packages/adapters/bootstrap/_variables.scss'),
      path.join(projectRoot, 'dist/adapters/bootstrap/_variables.scss')
    );

    copyFile(
      path.join(projectRoot, 'packages/adapters/bootstrap/_utilities.scss'),
      path.join(projectRoot, 'dist/adapters/bootstrap/_utilities.scss')
    );

    // Copy CSS package output to assets/css for Jekyll
    const cssPkgDist = path.join(projectRoot, 'packages/css/dist');
    const assetsCSS = path.join(projectRoot, 'assets/css');

    // Copy core CSS files
    const cssFiles = ['turbo-core.css', 'turbo-base.css', 'turbo-syntax.css'];
    for (const file of cssFiles) {
      const src = path.join(cssPkgDist, file);
      if (fs.existsSync(src)) {
        copyFile(src, path.join(assetsCSS, file));
      }
    }

    // Copy theme files to assets/css/themes/turbo/
    const themesDir = path.join(cssPkgDist, 'themes');
    const assetThemesDir = path.join(assetsCSS, 'themes/turbo');
    if (fs.existsSync(themesDir)) {
      ensureDir(assetThemesDir);
      const themeFiles = fs.readdirSync(themesDir).filter((f) => f.endsWith('.css'));
      for (const file of themeFiles) {
        copyFile(path.join(themesDir, file), path.join(assetThemesDir, file));
      }
    }

    console.log('✅ Adapter assets copied to dist/');
    console.log('✅ CSS package assets copied to assets/css/');
  } catch (error) {
    console.error('❌ Failed to copy adapter assets:', error);
    process.exit(1);
  }
}

main();
