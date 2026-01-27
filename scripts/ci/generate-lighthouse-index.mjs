#!/usr/bin/env node
/**
 * Generate index.html for Lighthouse reports.
 *
 * This script generates an index page listing all Lighthouse report files
 * with friendly names and score summaries parsed from manifest.json.
 * Uses turbo-themes CSS for consistent styling with the main site.
 *
 * Called by run-lighthouse-ci.sh after Lighthouse runs so the index.html
 * is included in the artifact.
 *
 * Usage: node generate-lighthouse-index.mjs [reports-dir]
 *        Default reports-dir: lighthouse-reports
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, basename } from 'node:path';

const reportsDir = process.argv[2] || 'lighthouse-reports';

if (!existsSync(reportsDir)) {
  console.log(`Directory ${reportsDir} does not exist, skipping index generation`);
  process.exit(0);
}

/**
 * Find HTML report files in the directory
 * @param {string} dir - Directory to scan
 * @returns {string[]} Array of HTML file names
 */
function findReportFiles(dir) {
  try {
    return readdirSync(dir)
      .filter((f) => f.endsWith('.html') && (f.endsWith('.report.html') || f.startsWith('lhr-')))
      .sort()
      .reverse();
  } catch {
    return [];
  }
}

/**
 * Extract page name from filename
 * @param {string} filename - Report filename like "localhost-demo_-2026_01_27.report.html" or "lhr-xxx.html"
 * @returns {string} Friendly name
 */
function filenameToFriendlyName(filename) {
  // Handle lhr-xxx.html format (Lighthouse CI format)
  if (filename.startsWith('lhr-')) {
    const match = filename.match(/lhr-.*?-(\w+)\.html/);
    if (match) {
      return match[1].charAt(0).toUpperCase() + match[1].slice(1);
    }
    return 'Report';
  }

  // Handle localhost-page-timestamp.report.html format
  const match = filename.match(/localhost-?([^-_]*)?[_-]/);
  if (match) {
    const pageName = match[1] || '';
    if (!pageName || pageName === '') return 'Homepage';
    return pageName.charAt(0).toUpperCase() + pageName.slice(1).replace(/-/g, ' ');
  }

  return 'Report';
}

/**
 * Convert URL path to friendly page name
 * @param {string} url - Full URL like "http://localhost:4000/demo/"
 * @returns {string} Friendly name like "Demo"
 */
function urlToFriendlyName(url) {
  try {
    const urlObj = new URL(url);
    const path = urlObj.pathname.replace(/\/$/, ''); // Remove trailing slash

    if (!path || path === '') {
      return 'Homepage';
    }

    // Convert path to title case: /demo/ -> "Demo", /components/ -> "Components"
    const name = path
      .split('/')
      .filter(Boolean)
      .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '))
      .join(' / ');

    return name || 'Homepage';
  } catch {
    return 'Unknown Page';
  }
}

/**
 * Get CSS class for score color
 * @param {number} score - Score from 0 to 1
 * @returns {string} CSS class name
 */
function getScoreClass(score) {
  if (score >= 0.9) return 'score-good';
  if (score >= 0.5) return 'score-average';
  return 'score-poor';
}

/**
 * Format score as percentage with color indicator
 * @param {number} score - Score from 0 to 1
 * @returns {string} Formatted score HTML
 */
function formatScore(score) {
  const percentage = Math.round(score * 100);
  const cssClass = getScoreClass(score);
  return `<span class="score-value ${cssClass}">${percentage}</span>`;
}

/**
 * Generate report card HTML for a single report
 * @param {object} entry - Manifest entry
 * @returns {string} HTML for report card
 */
function generateReportCard(entry) {
  const friendlyName = urlToFriendlyName(entry.url);
  const htmlFile = basename(entry.htmlPath);
  const { summary } = entry;

  return `
      <article class="report-card">
        <div class="report-card-header">
          <h2>${friendlyName}</h2>
          <a href="${encodeURIComponent(htmlFile)}" class="report-card-badge">View Report →</a>
        </div>
        <div class="scores">
          <div class="score-item">
            <span class="score-label">Performance</span>
            ${formatScore(summary.performance)}
          </div>
          <div class="score-item">
            <span class="score-label">Accessibility</span>
            ${formatScore(summary.accessibility)}
          </div>
          <div class="score-item">
            <span class="score-label">Best Practices</span>
            ${formatScore(summary['best-practices'])}
          </div>
          <div class="score-item">
            <span class="score-label">SEO</span>
            ${formatScore(summary.seo)}
          </div>
        </div>
        <p class="url-hint"><code>${entry.url}</code></p>
      </article>`;
}

/**
 * Generate a simple report card for files without manifest data
 * @param {string} filename - HTML report filename
 * @returns {string} HTML for report card
 */
function generateSimpleReportCard(filename) {
  const friendlyName = filenameToFriendlyName(filename);

  return `
      <article class="report-card report-card-simple">
        <div class="report-card-header">
          <h2>${friendlyName}</h2>
          <a href="${encodeURIComponent(filename)}" class="report-card-badge">View Report →</a>
        </div>
        <p class="url-hint"><code>${filename}</code></p>
      </article>`;
}

// Try to read manifest.json first
const manifestPath = resolve(reportsDir, 'manifest.json');
let manifest = [];
let useManifest = false;

if (existsSync(manifestPath)) {
  try {
    manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
    useManifest = manifest.length > 0;
  } catch {
    console.log('Failed to parse manifest.json, falling back to file scan');
  }
}

// Fall back to scanning for HTML files if no manifest
let reportCards = '';
let reportCount = 0;

if (useManifest) {
  reportCards = manifest.map(generateReportCard).join('\n');
  reportCount = manifest.length;
} else {
  const htmlFiles = findReportFiles(reportsDir);
  if (htmlFiles.length === 0) {
    console.log('No report files found in directory');
    process.exit(0);
  }
  reportCards = htmlFiles.map(generateSimpleReportCard).join('\n');
  reportCount = htmlFiles.length;
  console.log(`No manifest.json found, generating index from ${htmlFiles.length} HTML files`);
}

// Base path for assets (from /lighthouse/ go up to site root)
const basePath = '..';

// Generate index.html using turbo-themes styling (matching site.css patterns)
const html = `<!DOCTYPE html>
<html lang="en" data-theme="catppuccin-mocha">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lighthouse Reports | Turbo Themes</title>

  <!-- Google Fonts (same as main site) -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">

  <!-- Turbo Themes CSS -->
  <link rel="stylesheet" href="${basePath}/assets/css/turbo-core.css">
  <link rel="stylesheet" href="${basePath}/assets/css/turbo-base.css">
  <link id="turbo-theme-css" rel="stylesheet" href="${basePath}/assets/css/themes/turbo/catppuccin-mocha.css">

  <!-- Site CSS -->
  <link rel="stylesheet" href="${basePath}/assets/css/site.css">

  <!-- Favicon -->
  <link rel="icon" href="${basePath}/favicon.ico">

  <style>
    /* Page-specific styles using site.css conventions */
    html:root .lighthouse-page {
      min-height: 100vh;
      padding: var(--space-3xl) var(--space-lg);
      background: var(--turbo-bg-base);
    }

    html:root .lighthouse-container {
      max-width: var(--container-narrow);
      margin: 0 auto;
    }

    html:root .lighthouse-header {
      text-align: center;
      margin-bottom: var(--space-3xl);
    }

    html:root .lighthouse-title {
      font-size: 2.5rem;
      font-weight: 800;
      color: var(--turbo-text-primary);
      margin: 0 0 var(--space-sm) 0;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-md);
    }

    html:root .lighthouse-subtitle {
      color: var(--turbo-text-secondary);
      font-size: 1.125rem;
      margin: 0;
    }

    html:root .back-link {
      display: inline-flex;
      align-items: center;
      gap: var(--space-sm);
      color: var(--turbo-accent-link);
      text-decoration: none;
      margin-bottom: var(--space-xl);
      font-weight: 500;
      transition: opacity var(--transition-fast);
    }

    html:root .back-link:hover {
      opacity: 0.8;
    }

    html:root .reports-grid {
      display: grid;
      gap: var(--space-lg);
    }

    html:root .report-card {
      background: var(--turbo-bg-surface);
      border: 2px solid var(--turbo-border-default);
      border-radius: var(--radius-xl);
      padding: var(--space-lg);
      transition: all var(--transition-normal);
    }

    html:root .report-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-lg);
      border-color: var(--turbo-brand-primary);
    }

    html:root .report-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--space-lg);
    }

    html:root .report-card h2 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
    }

    html:root .report-card h2 a {
      color: var(--turbo-text-primary);
      text-decoration: none;
      transition: color var(--transition-fast);
    }

    html:root .report-card h2 a:hover {
      color: var(--turbo-brand-primary);
    }

    html:root .report-card-badge {
      font-size: 0.75rem;
      padding: var(--space-xs) var(--space-sm);
      background: var(--turbo-bg-overlay);
      border-radius: var(--radius-full);
      color: var(--turbo-text-secondary);
      font-weight: 500;
      text-decoration: none;
      transition: all var(--transition-fast);
    }

    html:root .report-card-badge:hover {
      background: var(--turbo-brand-primary);
      color: var(--turbo-text-inverse);
    }

    html:root .scores {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: var(--space-md);
    }

    @media (max-width: 600px) {
      html:root .scores {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    html:root .score-item {
      text-align: center;
      padding: var(--space-md);
      background: var(--turbo-bg-overlay);
      border-radius: var(--radius-lg);
    }

    html:root .score-label {
      display: block;
      font-size: 0.7rem;
      color: var(--turbo-text-secondary);
      margin-bottom: var(--space-xs);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 500;
    }

    html:root .score-value {
      font-size: 1.75rem;
      font-weight: 700;
    }

    html:root .score-good { color: var(--turbo-state-success); }
    html:root .score-average { color: var(--turbo-state-warning); }
    html:root .score-poor { color: var(--turbo-state-danger); }

    html:root .url-hint {
      margin: var(--space-lg) 0 0 0;
      font-size: 0.8rem;
    }

    html:root .url-hint code {
      color: var(--turbo-text-secondary);
      background: var(--turbo-bg-overlay);
      padding: var(--space-xs) var(--space-sm);
      border-radius: var(--radius-md);
      font-family: var(--turbo-font-mono);
    }

    html:root .lighthouse-footer {
      margin-top: var(--space-3xl);
      padding-top: var(--space-lg);
      border-top: 1px solid var(--turbo-border-default);
      text-align: center;
      font-size: 0.875rem;
      color: var(--turbo-text-secondary);
    }

    /* Simple report cards (no scores) */
    html:root .report-card-simple .report-card-header {
      margin-bottom: var(--space-md);
    }

    html:root .report-card-simple .url-hint {
      margin: 0;
    }
  </style>
</head>
<body>
  <main class="lighthouse-page">
    <div class="lighthouse-container">
      <a href="${basePath}/" class="back-link">← Back to Turbo Themes</a>

      <header class="lighthouse-header">
        <h1 class="lighthouse-title">
          <span>🔦</span>
          Lighthouse Reports
        </h1>
        <p class="lighthouse-subtitle">${reportCount} report${reportCount !== 1 ? 's' : ''} available</p>
      </header>

      <div class="reports-grid">
${reportCards}
      </div>

      <footer class="lighthouse-footer">
        Generated ${new Date().toISOString().replace('T', ' ').slice(0, 19)} UTC
      </footer>
    </div>
  </main>

  <!-- Theme Selector JS -->
  <script src="${basePath}/assets/js/theme-selector.min.js"></script>
  <script>
    // Initialize theme (respects saved preference)
    if (typeof TurboThemeSelector !== 'undefined') {
      TurboThemeSelector.initTheme();
    }
  </script>
</body>
</html>`;

writeFileSync(resolve(reportsDir, 'index.html'), html);
console.log(`Generated index.html with ${reportCount} reports`);
