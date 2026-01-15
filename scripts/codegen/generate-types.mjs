#!/usr/bin/env node
// SPDX-License-Identifier: MIT
/**
 * Type Generation Orchestrator
 *
 * Generates typed interfaces/classes from JSON Schema for all platforms:
 * - TypeScript: packages/core/src/themes/generated-types.ts
 * - Python: python/src/turbo_themes/generated/types.py
 * - Swift: swift/Sources/TurboThemes/Generated/Types.swift
 *
 * Usage:
 *   node scripts/codegen/generate-types.mjs [--all|--ts|--python|--swift]
 */

import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const GENERATORS = {
  ts: {
    name: 'TypeScript',
    script: join(__dirname, 'generate-ts-types.mjs'),
    output: 'packages/core/src/themes/generated-types.ts',
  },
  python: {
    name: 'Python',
    script: join(__dirname, 'generate-python-types.mjs'),
    output: 'python/src/turbo_themes/generated/types.py',
  },
  swift: {
    name: 'Swift',
    script: join(__dirname, 'generate-swift-types.mjs'),
    output: 'swift/Sources/TurboThemes/Generated/Types.swift',
  },
};

/**
 * Run a generator script.
 * @param {string} name - Generator name
 * @param {string} script - Path to generator script
 * @returns {Promise<void>}
 */
async function runGenerator(name, script) {
  return new Promise((resolve, reject) => {
    console.log(`\n🔧 Generating ${name} types...`);

    const proc = spawn('node', [script], {
      stdio: 'inherit',
      cwd: join(__dirname, '..', '..'),
    });

    proc.on('close', (code) => {
      if (code === 0) {
        console.log(`✅ ${name} types generated successfully`);
        resolve();
      } else {
        reject(new Error(`${name} generator failed with code ${code}`));
      }
    });

    proc.on('error', (err) => {
      reject(new Error(`Failed to start ${name} generator: ${err.message}`));
    });
  });
}

/**
 * Parse command-line arguments.
 * @returns {{ all: boolean, ts: boolean, python: boolean, swift: boolean }}
 */
function parseArgs() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--all')) {
    return { all: true, ts: true, python: true, swift: true };
  }

  return {
    all: false,
    ts: args.includes('--ts') || args.includes('--typescript'),
    python: args.includes('--python') || args.includes('--py'),
    swift: args.includes('--swift'),
  };
}

async function main() {
  console.log('🚀 Type Generation Orchestrator');
  console.log('================================');

  const flags = parseArgs();
  const generators = [];

  if (flags.ts) generators.push(GENERATORS.ts);
  if (flags.python) generators.push(GENERATORS.python);
  if (flags.swift) generators.push(GENERATORS.swift);

  if (generators.length === 0) {
    console.log('No generators selected. Use --all, --ts, --python, or --swift');
    process.exit(1);
  }

  console.log(`\nGenerating types for: ${generators.map((g) => g.name).join(', ')}`);

  const results = { success: [], failed: [] };

  for (const gen of generators) {
    try {
      await runGenerator(gen.name, gen.script);
      results.success.push(gen.name);
    } catch (error) {
      console.error(`❌ ${error.message}`);
      results.failed.push(gen.name);
    }
  }

  console.log('\n================================');
  console.log('📊 Summary:');
  if (results.success.length > 0) {
    console.log(`   ✅ Success: ${results.success.join(', ')}`);
  }
  if (results.failed.length > 0) {
    console.log(`   ❌ Failed: ${results.failed.join(', ')}`);
    process.exit(1);
  }

  console.log('\n✨ Type generation complete!');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
