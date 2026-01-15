#!/usr/bin/env node
/**
 * Lighthouse audit script with multi-run averaging.
 *
 * Runs Lighthouse audits on specified pages multiple times and averages
 * the results to reduce variance from network/system fluctuations.
 *
 * Usage:
 *   node scripts/ci/lighthouse-audit.mjs
 *
 * Requirements:
 *   - Lighthouse CLI: npm install -g lighthouse
 *   - Chrome installed
 *   - Site running at BASE_URL
 *
 * Environment variables:
 *   - BASE_URL: Site URL to audit (default: http://localhost:4173)
 *   - LIGHTHOUSE_RUNS: Number of runs per page (default: 3)
 */

import { execSync, spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

// Configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:4173';
const RUNS_PER_PAGE = parseInt(process.env.LIGHTHOUSE_RUNS || '3', 10);
const OUTPUT_DIR = path.join(projectRoot, 'lighthouse-reports');

// Pages to audit
const PAGES = [
  { name: 'homepage', path: '/' },
  { name: 'demo', path: '/demo/' },
  { name: 'html-example', path: '/examples/html-vanilla/index.html' },
];

// Score thresholds (0-100)
const THRESHOLDS = {
  performance: 80,
  accessibility: 90,
  'best-practices': 85,
  seo: 80,
};

/**
 * Run Lighthouse for a single page.
 */
async function runLighthouse(url, outputPath) {
  return new Promise((resolve, reject) => {
    const args = [
      url,
      '--output=json',
      `--output-path=${outputPath}`,
      '--chrome-flags="--headless --no-sandbox"',
      '--quiet',
    ];

    const lighthouse = spawn('lighthouse', args, {
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: true,
    });

    let stdout = '';
    let stderr = '';

    lighthouse.stdout?.on('data', (data) => {
      stdout += data.toString();
    });

    lighthouse.stderr?.on('data', (data) => {
      stderr += data.toString();
    });

    lighthouse.on('close', (code) => {
      if (code === 0) {
        resolve(outputPath);
      } else {
        reject(new Error(`Lighthouse failed with code ${code}: ${stderr}`));
      }
    });

    lighthouse.on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Parse Lighthouse JSON report.
 */
function parseReport(reportPath) {
  const content = fs.readFileSync(reportPath, 'utf-8');
  const report = JSON.parse(content);

  return {
    performance: report.categories.performance?.score * 100 || 0,
    accessibility: report.categories.accessibility?.score * 100 || 0,
    'best-practices': report.categories['best-practices']?.score * 100 || 0,
    seo: report.categories.seo?.score * 100 || 0,
    metrics: {
      fcp: report.audits['first-contentful-paint']?.numericValue || 0,
      lcp: report.audits['largest-contentful-paint']?.numericValue || 0,
      cls: report.audits['cumulative-layout-shift']?.numericValue || 0,
      tbt: report.audits['total-blocking-time']?.numericValue || 0,
      tti: report.audits['interactive']?.numericValue || 0,
    },
  };
}

/**
 * Average multiple Lighthouse results.
 */
function averageResults(results) {
  const avg = {
    performance: 0,
    accessibility: 0,
    'best-practices': 0,
    seo: 0,
    metrics: {
      fcp: 0,
      lcp: 0,
      cls: 0,
      tbt: 0,
      tti: 0,
    },
  };

  for (const result of results) {
    avg.performance += result.performance;
    avg.accessibility += result.accessibility;
    avg['best-practices'] += result['best-practices'];
    avg.seo += result.seo;
    avg.metrics.fcp += result.metrics.fcp;
    avg.metrics.lcp += result.metrics.lcp;
    avg.metrics.cls += result.metrics.cls;
    avg.metrics.tbt += result.metrics.tbt;
    avg.metrics.tti += result.metrics.tti;
  }

  const count = results.length;
  avg.performance /= count;
  avg.accessibility /= count;
  avg['best-practices'] /= count;
  avg.seo /= count;
  avg.metrics.fcp /= count;
  avg.metrics.lcp /= count;
  avg.metrics.cls /= count;
  avg.metrics.tbt /= count;
  avg.metrics.tti /= count;

  return avg;
}

/**
 * Format score with color indicator.
 */
function formatScore(score, threshold) {
  const rounded = Math.round(score);
  const status = rounded >= threshold ? '✅' : '❌';
  return `${status} ${rounded}`;
}

/**
 * Format milliseconds to readable string.
 */
function formatMs(ms) {
  if (ms < 1000) {
    return `${Math.round(ms)}ms`;
  }
  return `${(ms / 1000).toFixed(2)}s`;
}

/**
 * Check if Lighthouse is installed.
 */
function checkLighthouseInstalled() {
  try {
    execSync('lighthouse --version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

/**
 * Main audit function.
 */
async function runAudits() {
  console.log('🔦 Lighthouse Audit\n');
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Runs per page: ${RUNS_PER_PAGE}`);
  console.log('=' .repeat(60));

  // Check prerequisites
  if (!checkLighthouseInstalled()) {
    console.error('\n❌ Lighthouse CLI not found!');
    console.error('Install with: npm install -g lighthouse');
    process.exit(1);
  }

  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const allResults = [];
  let hasFailures = false;

  for (const page of PAGES) {
    console.log(`\n📄 Auditing: ${page.name} (${page.path})`);
    console.log('-'.repeat(40));

    const url = `${BASE_URL}${page.path}`;
    const pageResults = [];

    for (let run = 1; run <= RUNS_PER_PAGE; run++) {
      process.stdout.write(`   Run ${run}/${RUNS_PER_PAGE}...`);

      try {
        const outputPath = path.join(
          OUTPUT_DIR,
          `${page.name}-run${run}.json`
        );

        await runLighthouse(url, outputPath);
        const result = parseReport(outputPath);
        pageResults.push(result);

        console.log(' done');
      } catch (error) {
        console.log(' failed');
        console.error(`   Error: ${error.message}`);
      }
    }

    if (pageResults.length === 0) {
      console.log('   ⚠️ No successful runs');
      continue;
    }

    // Average results
    const avg = averageResults(pageResults);
    allResults.push({ page: page.name, results: avg });

    // Print scores
    console.log('\n   Scores (averaged):');
    console.log(`   Performance:    ${formatScore(avg.performance, THRESHOLDS.performance)} (min: ${THRESHOLDS.performance})`);
    console.log(`   Accessibility:  ${formatScore(avg.accessibility, THRESHOLDS.accessibility)} (min: ${THRESHOLDS.accessibility})`);
    console.log(`   Best Practices: ${formatScore(avg['best-practices'], THRESHOLDS['best-practices'])} (min: ${THRESHOLDS['best-practices']})`);
    console.log(`   SEO:            ${formatScore(avg.seo, THRESHOLDS.seo)} (min: ${THRESHOLDS.seo})`);

    // Print Core Web Vitals
    console.log('\n   Core Web Vitals:');
    console.log(`   FCP: ${formatMs(avg.metrics.fcp)}`);
    console.log(`   LCP: ${formatMs(avg.metrics.lcp)}`);
    console.log(`   CLS: ${avg.metrics.cls.toFixed(3)}`);
    console.log(`   TBT: ${formatMs(avg.metrics.tbt)}`);
    console.log(`   TTI: ${formatMs(avg.metrics.tti)}`);

    // Check thresholds
    if (
      avg.performance < THRESHOLDS.performance ||
      avg.accessibility < THRESHOLDS.accessibility ||
      avg['best-practices'] < THRESHOLDS['best-practices'] ||
      avg.seo < THRESHOLDS.seo
    ) {
      hasFailures = true;
    }
  }

  // Summary
  console.log('\n' + '=' .repeat(60));
  console.log('\n📊 Summary\n');

  if (allResults.length === 0) {
    console.log('❌ No audits completed successfully');
    process.exit(1);
  }

  // Overall averages
  const overallAvg = averageResults(allResults.map((r) => r.results));
  console.log('Overall averages across all pages:');
  console.log(`  Performance:    ${Math.round(overallAvg.performance)}`);
  console.log(`  Accessibility:  ${Math.round(overallAvg.accessibility)}`);
  console.log(`  Best Practices: ${Math.round(overallAvg['best-practices'])}`);
  console.log(`  SEO:            ${Math.round(overallAvg.seo)}`);

  // Save summary report
  const summaryPath = path.join(OUTPUT_DIR, 'summary.json');
  fs.writeFileSync(
    summaryPath,
    JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        baseUrl: BASE_URL,
        runsPerPage: RUNS_PER_PAGE,
        thresholds: THRESHOLDS,
        pages: allResults,
        overall: overallAvg,
      },
      null,
      2
    )
  );
  console.log(`\nReport saved to: ${summaryPath}`);

  if (hasFailures) {
    console.log('\n❌ Some pages did not meet thresholds');
    process.exit(1);
  } else {
    console.log('\n✅ All pages meet threshold requirements');
  }
}

// Run
runAudits().catch((error) => {
  console.error('Audit failed:', error.message);
  process.exit(1);
});
