/**
 * Verifies npm package includes all required files.
 * Prevents regression of missing dist directories in published package.
 */
import { execSync } from 'child_process';
import { describe, expect, it } from 'vitest';

describe('npm package files', () => {
  // Cache the pack output since it's slow (~1s)
  const getPackOutput = (() => {
    let cached: string | null = null;
    return () => {
      if (!cached) {
        cached = execSync('npm pack --dry-run 2>&1', { encoding: 'utf-8' });
      }
      return cached;
    };
  })();

  it('includes files imported by dist/index.js', () => {
    const output = getPackOutput();

    // These are the exact files that dist/index.js imports
    // If any are missing, the package will be broken for consumers
    expect(output).toContain('packages/core/dist/index.js');
    expect(output).toContain('packages/core/dist/tokens/index.js');
    expect(output).toContain('packages/core/dist/themes/registry.js');
    expect(output).toContain('packages/theme-selector/dist/index.js');
  });

  it('includes all required directories', () => {
    const output = getPackOutput();

    // Root dist (main entry point)
    expect(output).toContain('dist/index.js');

    // Core package
    expect(output).toContain('packages/core/dist/');

    // CSS package
    expect(output).toContain('packages/css/dist/');

    // Theme selector
    expect(output).toContain('packages/theme-selector/dist/');
  });

  it('includes adapter packages', () => {
    const output = getPackOutput();

    // Bulma adapter
    expect(output).toContain('packages/adapters/bulma/dist/');

    // Tailwind adapter
    expect(output).toContain('packages/adapters/tailwind/dist/');
  });
});
