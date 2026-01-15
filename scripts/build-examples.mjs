#!/usr/bin/env node

/**
 * Build all examples that require a build step.
 * Excludes: html-vanilla (static), jekyll (separate build process)
 */

import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const EXAMPLES_DIR = new URL('../examples', import.meta.url).pathname;

const BUILDABLE_EXAMPLES = ['tailwind', 'react', 'vue', 'bootstrap'];

function log(message) {
  console.log(`[build-examples] ${message}`);
}

function error(message) {
  console.error(`[build-examples] ERROR: ${message}`);
}

function buildExample(name) {
  const exampleDir = join(EXAMPLES_DIR, name);
  const packageJson = join(exampleDir, 'package.json');

  if (!existsSync(packageJson)) {
    log(`Skipping ${name}: no package.json found`);
    return true;
  }

  log(`Building ${name}...`);

  try {
    // Install dependencies
    execSync('bun install', {
      cwd: exampleDir,
      stdio: 'inherit',
    });

    // Build
    execSync('bun run build', {
      cwd: exampleDir,
      stdio: 'inherit',
    });

    log(`Successfully built ${name}`);
    return true;
  } catch (err) {
    error(`Failed to build ${name}: ${err.message}`);
    return false;
  }
}

function main() {
  log('Starting examples build...');

  let success = true;

  for (const example of BUILDABLE_EXAMPLES) {
    if (!buildExample(example)) {
      success = false;
    }
  }

  if (success) {
    log('All examples built successfully!');
    process.exit(0);
  } else {
    error('Some examples failed to build');
    process.exit(1);
  }
}

main();
