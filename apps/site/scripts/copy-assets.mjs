/**
 * Copy built assets from root project to Astro public directory.
 *
 * This script runs before Astro build to ensure CSS/JS assets are available.
 */

import { existsSync, cpSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const siteDir = resolve(__dirname, '..');
const projectRoot = resolve(siteDir, '../..');
const publicDir = resolve(siteDir, 'public');

// Ensure public directory exists
mkdirSync(publicDir, { recursive: true });

// Assets to copy: [source, destination]
const assetsToCopy = [
  // Core CSS
  ['packages/css/dist/turbo-core.css', 'assets/css/turbo-core.css'],
  ['packages/css/dist/turbo-base.css', 'assets/css/turbo-base.css'],
  ['packages/css/dist/turbo-syntax.css', 'assets/css/turbo-syntax.css'],
  ['packages/css/dist/turbo-components.css', 'assets/css/turbo-components.css'],

  // Theme CSS files
  ['packages/css/dist/themes', 'assets/css/themes/turbo'],

  // Site CSS
  ['assets/css/site.css', 'assets/css/site.css'],
  ['assets/css/custom.css', 'assets/css/custom.css'],

  // Adapters
  ['packages/adapters/bulma/dist/bulma-adapter.css', 'assets/css/adapters/bulma.css'],

  // JavaScript
  ['assets/js/theme-selector.js', 'assets/js/theme-selector.js'],
  ['assets/js/theme-selector.min.js', 'assets/js/theme-selector.min.js'],

  // Images
  ['assets/img', 'assets/img'],
];

// Example directories to copy (excluding vendor/node_modules/build artifacts)
const exampleDirs = ['html-vanilla', 'tailwind', 'swift-swiftui'];
for (const example of exampleDirs) {
  assetsToCopy.push([`examples/${example}`, `examples/${example}`]);
}
// Jekyll example: copy specific files only, excluding vendor/.bundle/.jekyll-cache directories
const jekyllFiles = [
  ['examples/jekyll/index.md', 'examples/jekyll/index.md'],
  ['examples/jekyll/_config.yml', 'examples/jekyll/_config.yml'],
  ['examples/jekyll/Gemfile', 'examples/jekyll/Gemfile'],
  ['examples/jekyll/Gemfile.lock', 'examples/jekyll/Gemfile.lock'],
  ['examples/jekyll/README.md', 'examples/jekyll/README.md'],
];
assetsToCopy.push(...jekyllFiles);

console.log('Copying assets to public directory...');

for (const [src, dest] of assetsToCopy) {
  const srcPath = resolve(projectRoot, src);
  const destPath = resolve(publicDir, dest);

  if (existsSync(srcPath)) {
    // Ensure destination directory exists
    mkdirSync(dirname(destPath), { recursive: true });

    try {
      cpSync(srcPath, destPath, { recursive: true });
      console.log(`  Copied: ${src} -> public/${dest}`);
    } catch (error) {
      console.warn(`  Warning: Failed to copy ${src}: ${error.message}`);
    }
  } else {
    console.warn(`  Warning: Source not found: ${src}`);
  }
}

// Copy favicon
const faviconSrc = resolve(siteDir, 'favicon.ico');
const faviconDest = resolve(publicDir, 'favicon.ico');
if (existsSync(faviconSrc)) {
  cpSync(faviconSrc, faviconDest);
  console.log('  Copied: favicon.ico');
}

console.log('Asset copy complete!');
