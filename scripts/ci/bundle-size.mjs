#!/usr/bin/env node
/**
 * Bundle size monitoring script.
 *
 * Checks the gzipped size of built packages to ensure they stay within limits.
 * Run this in CI to prevent bundle size regressions.
 *
 * Usage:
 *   node scripts/ci/bundle-size.mjs
 *
 * Exit codes:
 *   0 - All bundles within limits
 *   1 - One or more bundles exceed limits
 */

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import zlib from 'node:zlib';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

// Bundle size limits (in KB, gzipped)
const BUNDLE_LIMITS = {
  // JavaScript bundles
  'packages/theme-selector/dist/index.js': 15,
  'packages/core/dist/index.js': 20,
  'packages/css/dist/index.js': 5,

  // CSS bundles
  'assets/css/turbo-core.css': 3,
  'assets/css/themes/turbo/catppuccin-mocha.css': 5,
  'assets/css/themes/turbo/catppuccin-latte.css': 5,
  'assets/css/themes/turbo/dracula.css': 5,
  'assets/css/themes/turbo/github-dark.css': 5,
  'assets/css/themes/turbo/github-light.css': 5,
};

// Optional bundles that may not exist (won't fail if missing)
const OPTIONAL_BUNDLES = new Set([
  'packages/theme-selector/dist/index.js',
  'packages/core/dist/index.js',
  'packages/css/dist/index.js',
]);

/**
 * Get the gzipped size of a file in KB.
 */
function getGzippedSize(filePath) {
  const content = fs.readFileSync(filePath);
  const gzipped = zlib.gzipSync(content, { level: 9 });
  return gzipped.length / 1024;
}

/**
 * Format size for display.
 */
function formatSize(sizeKB) {
  if (sizeKB < 1) {
    return `${(sizeKB * 1024).toFixed(0)} B`;
  }
  return `${sizeKB.toFixed(2)} KB`;
}

/**
 * Check all bundle sizes.
 */
function checkBundleSizes() {
  console.log('📦 Bundle Size Check\n');
  console.log('=' .repeat(60));

  const results = [];
  let hasFailures = false;

  for (const [relativePath, limitKB] of Object.entries(BUNDLE_LIMITS)) {
    const fullPath = path.join(projectRoot, relativePath);
    const isOptional = OPTIONAL_BUNDLES.has(relativePath);

    if (!fs.existsSync(fullPath)) {
      if (isOptional) {
        results.push({
          path: relativePath,
          status: 'skip',
          message: 'File not found (optional)',
        });
      } else {
        results.push({
          path: relativePath,
          status: 'fail',
          message: 'File not found',
        });
        hasFailures = true;
      }
      continue;
    }

    const sizeKB = getGzippedSize(fullPath);
    const withinLimit = sizeKB <= limitKB;
    const percentage = (sizeKB / limitKB) * 100;

    results.push({
      path: relativePath,
      status: withinLimit ? 'pass' : 'fail',
      sizeKB,
      limitKB,
      percentage,
    });

    if (!withinLimit) {
      hasFailures = true;
    }
  }

  // Print results
  for (const result of results) {
    const icon = result.status === 'pass' ? '✅' : result.status === 'skip' ? '⏭️' : '❌';

    if (result.status === 'skip') {
      console.log(`${icon} ${result.path}`);
      console.log(`   ${result.message}\n`);
    } else if (result.status === 'fail' && !result.sizeKB) {
      console.log(`${icon} ${result.path}`);
      console.log(`   ${result.message}\n`);
    } else {
      const bar = generateProgressBar(result.percentage);
      console.log(`${icon} ${result.path}`);
      console.log(`   Size: ${formatSize(result.sizeKB)} / ${formatSize(result.limitKB)} (${result.percentage.toFixed(1)}%)`);
      console.log(`   ${bar}\n`);
    }
  }

  console.log('=' .repeat(60));

  // Summary
  const passed = results.filter((r) => r.status === 'pass').length;
  const failed = results.filter((r) => r.status === 'fail').length;
  const skipped = results.filter((r) => r.status === 'skip').length;

  console.log(`\n📊 Summary: ${passed} passed, ${failed} failed, ${skipped} skipped\n`);

  if (hasFailures) {
    console.log('❌ Bundle size check failed!\n');
    console.log('To fix:');
    console.log('1. Review recent changes that increased bundle size');
    console.log('2. Remove unused code or dependencies');
    console.log('3. Consider code splitting or lazy loading');
    console.log('4. If the increase is intentional, update BUNDLE_LIMITS in this script\n');
    process.exit(1);
  } else {
    console.log('✅ All bundles within size limits!\n');
  }
}

/**
 * Generate a progress bar string.
 */
function generateProgressBar(percentage) {
  const width = 40;
  const filled = Math.round((percentage / 100) * width);
  const empty = width - filled;
  const bar = '█'.repeat(Math.min(filled, width)) + '░'.repeat(Math.max(empty, 0));
  return `[${bar}]`;
}

/**
 * Print total bundle sizes.
 */
function printTotalSizes() {
  console.log('\n📊 Total Bundle Sizes\n');

  // Group by category
  const categories = {
    'JavaScript': [],
    'CSS Core': [],
    'CSS Themes': [],
  };

  for (const [relativePath, limitKB] of Object.entries(BUNDLE_LIMITS)) {
    const fullPath = path.join(projectRoot, relativePath);
    if (!fs.existsSync(fullPath)) continue;

    const sizeKB = getGzippedSize(fullPath);

    if (relativePath.endsWith('.js')) {
      categories['JavaScript'].push({ path: relativePath, sizeKB });
    } else if (relativePath.includes('turbo-core')) {
      categories['CSS Core'].push({ path: relativePath, sizeKB });
    } else {
      categories['CSS Themes'].push({ path: relativePath, sizeKB });
    }
  }

  for (const [category, files] of Object.entries(categories)) {
    const total = files.reduce((sum, f) => sum + f.sizeKB, 0);
    console.log(`${category}: ${formatSize(total)} (${files.length} files)`);
  }
}

// Main
try {
  checkBundleSizes();
  printTotalSizes();
} catch (error) {
  console.error('Error checking bundle sizes:', error.message);
  process.exit(1);
}
