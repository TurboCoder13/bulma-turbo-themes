#!/usr/bin/env node

/**
 * Run Playwright tests for examples.
 *
 * Usage:
 *   node test-examples.mjs           # Run all example tests
 *   node test-examples.mjs vue       # Run only vue example tests
 *   node test-examples.mjs react     # Run only react example tests
 */

import { spawn } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const EXAMPLES_DIR = join(__dirname, '..', 'examples');

function log(message) {
  console.log(`[test-examples] ${message}`);
}

function main() {
  const exampleName = process.argv[2];

  if (exampleName) {
    log(`Running ${exampleName} example tests...`);
  } else {
    log('Running all example tests...');
  }

  const isWindows = process.platform === 'win32';
  const cmd = isWindows ? 'bunx.cmd' : 'bunx';
  const args = ['playwright', 'test', '--config=playwright.config.ts'];

  // Limit workers when running in parallel mode
  const workers = process.env.PLAYWRIGHT_WORKERS;
  if (workers) {
    args.push(`--workers=${workers}`);
  }

  // If an example name is provided, only run tests for that example
  if (exampleName) {
    args.push(`${exampleName}/test/`);
  }

  const child = spawn(cmd, args, {
    cwd: EXAMPLES_DIR,
    stdio: 'inherit',
    shell: isWindows,
    env: { ...process.env },
  });

  child.on('close', (code) => {
    if (code === 0) {
      if (exampleName) {
        log(`${exampleName} example tests passed!`);
      } else {
        log('All example tests passed!');
      }
      process.exit(0);
    } else {
      log(`Example tests exited with code ${code}`);
      process.exit(code);
    }
  });

  child.on('error', (err) => {
    log(`Failed to start tests: ${err.message}`);
    process.exit(1);
  });
}

main();
