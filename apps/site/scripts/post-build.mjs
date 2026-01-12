/**
 * Post-build script for Astro site.
 *
 * Copies report directories (Playwright, Lighthouse, Coverage) to the built site.
 * Uses centralized configuration from config/reports.json.
 */

import { existsSync, cpSync, mkdirSync, writeFileSync, readdirSync, readFileSync } from 'node:fs';
import { resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

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
 * Create an index page listing report files
 */
function createReportIndex(destDir, title) {
  const files = readdirSync(destDir)
    .filter((f) => f.endsWith('.html') && (f.endsWith('.report.html') || f.startsWith('lhr-')))
    .sort()
    .reverse();

  if (files.length === 0) return;

  const links = files.map((f) => `    <li><a href="${encodeURIComponent(f)}">${f}</a></li>`).join('\n');
  writeFileSync(resolve(destDir, 'index.html'), generateHtml(title, `<ul>\n${links}\n  </ul>`));
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
 * Process a single report based on configuration
 */
function processReport(key, config) {
  const destPath = resolve(distDir, config.path.substring(1)); // Remove leading /
  mkdirSync(destPath, { recursive: true });

  const srcPath = findSourcePath(config.source);

  if (srcPath) {
    cpSync(srcPath, destPath, { recursive: true });
    console.log(`  Copied: ${basename(srcPath)} -> ${basename(destPath)}/`);

    // Generate index page for reports that need it (like Lighthouse)
    if (config.generateIndex) {
      createReportIndex(destPath, config.title);
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
