#!/usr/bin/env node
/**
 * Generate index.html for Lighthouse reports.
 *
 * This script generates an index page listing all Lighthouse report files.
 * Called by run-lighthouse-ci.sh after Lighthouse runs so the index.html
 * is included in the artifact.
 *
 * Usage: node generate-lighthouse-index.mjs [reports-dir]
 *        Default reports-dir: lighthouse-reports
 */

import { readdirSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const reportsDir = process.argv[2] || 'lighthouse-reports';

if (!existsSync(reportsDir)) {
  console.log(`Directory ${reportsDir} does not exist, skipping index generation`);
  process.exit(0);
}

// Find all report HTML files
const files = readdirSync(reportsDir)
  .filter((f) => f.endsWith('.report.html') || f.startsWith('lhr-'))
  .sort()
  .reverse();

if (files.length === 0) {
  console.log('No Lighthouse report files found');
  process.exit(0);
}

// Generate index.html
const links = files.map((f) => `    <li><a href="${encodeURIComponent(f)}">${f}</a></li>`).join('\n');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lighthouse Reports</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 800px; margin: 2rem auto; padding: 1rem; }
    h1 { color: #333; }
    p { color: #666; }
    ul { list-style: none; padding: 0; }
    li { margin: 0.5rem 0; }
    a { color: #0066cc; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <h1>Lighthouse Reports</h1>
  <ul>
${links}
  </ul>
</body>
</html>`;

writeFileSync(resolve(reportsDir, 'index.html'), html);
console.log(`Generated index.html with ${files.length} reports`);
