/**
 * Post-build script for Astro site.
 *
 * Copies report directories (Playwright, Lighthouse, Coverage) to the built site.
 * Uses centralized configuration from config/reports.json.
 */

import { existsSync, cpSync, mkdirSync, writeFileSync, readFileSync, readdirSync } from 'node:fs';
import { resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const siteDir = resolve(__dirname, '..');
const projectRoot = resolve(siteDir, '../..');
const distDir = resolve(siteDir, 'dist');

// Load centralized report configuration
const reportsConfig = JSON.parse(
  readFileSync(resolve(projectRoot, 'config/reports.json'), 'utf-8')
);

/**
 * Shared HTML template styles
 */
const HTML_STYLES = `
    body { font-family: system-ui, sans-serif; max-width: 800px; margin: 2rem auto; padding: 1rem; }
    h1 { color: #333; }
    p { color: #666; }
    ul { list-style: none; padding: 0; }
    li { margin: 0.5rem 0; }
    a { color: #0066cc; text-decoration: none; }
    a:hover { text-decoration: underline; }
`;

/**
 * Generate HTML page with shared template
 */
function generateHtml(title, bodyContent) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>${HTML_STYLES}</style>
</head>
<body>
  <h1>${title}</h1>
  ${bodyContent}
</body>
</html>`;
}

/**
 * Create a placeholder HTML page for missing reports
 */
function createPlaceholder(destPath, title, message) {
  mkdirSync(dirname(destPath), { recursive: true });
  writeFileSync(destPath, generateHtml(title, `<p>${message}</p>`));
}

/**
 * Check if a directory has meaningful content (not just empty or only subdirs)
 */
function hasContent(dirPath) {
  if (!existsSync(dirPath)) return false;
  try {
    const entries = readdirSync(dirPath, { withFileTypes: true });
    return entries.some((entry) => entry.isFile() || (entry.isDirectory() && hasContent(resolve(dirPath, entry.name))));
  } catch {
    return false;
  }
}

/**
 * Find first existing source path from array of possibilities
 */
function findSourcePath(sources) {
  const sourcePaths = Array.isArray(sources) ? sources : [sources];
  for (const src of sourcePaths) {
    const srcPath = resolve(projectRoot, src);
    if (existsSync(srcPath) && hasContent(srcPath)) {
      return srcPath;
    }
  }
  return null;
}

/**
 * Generate Lighthouse index using the dedicated script
 */
function generateLighthouseIndex(destPath) {
  const generatorScript = resolve(projectRoot, 'scripts/ci/generate-lighthouse-index.mjs');
  if (existsSync(generatorScript)) {
    try {
      execSync(`node "${generatorScript}" "${destPath}"`, { stdio: 'inherit' });
      return true;
    } catch (error) {
      console.warn(`  Warning: Lighthouse index generation failed: ${error.message}`);
      return false;
    }
  }
  return false;
}

/**
 * Process a single report based on configuration
 */
function processReport(key, config) {
  const destPath = resolve(distDir, config.path.substring(1)); // Remove leading /
  mkdirSync(destPath, { recursive: true });

  const srcPath = findSourcePath(config.source);

  if (srcPath) {
    cpSync(srcPath, destPath, { recursive: true });
    console.log(`  Copied: ${basename(srcPath)} -> ${basename(destPath)}/`);

    // Generate styled index page for Lighthouse reports
    if (config.generateIndex && key === 'lighthouse') {
      generateLighthouseIndex(destPath);
    }
    return true;
  } else {
    createPlaceholder(resolve(destPath, 'index.html'), config.title, config.placeholder);
    console.log(`  Created placeholder: ${basename(destPath)}/`);
    return false;
  }
}

// Main execution
console.log('Processing report directories...');

// Ensure dist directory exists
if (!existsSync(distDir)) {
  console.error('Error: dist directory not found. Run astro build first.');
  process.exit(1);
}

// Process all reports from configuration
for (const [key, config] of Object.entries(reportsConfig.reports)) {
  processReport(key, config);
}

console.log('Post-build processing complete!');
