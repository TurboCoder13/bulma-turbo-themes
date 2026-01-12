#!/usr/bin/env node

/**
 * Run Playwright tests for all examples.
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
  log('Running example tests...');

  const isWindows = process.platform === 'win32';
  const cmd = isWindows ? 'bunx.cmd' : 'bunx';
  const args = ['playwright', 'test', '--config=playwright.config.ts'];

  const child = spawn(cmd, args, {
    cwd: EXAMPLES_DIR,
    stdio: 'inherit',
    shell: isWindows,
  });

  child.on('close', (code) => {
    if (code === 0) {
      log('All example tests passed!');
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
