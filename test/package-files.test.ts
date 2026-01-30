/**
 * Verifies npm package includes all required files.
 * Prevents regression of missing dist directories in published package.
 */
import { execSync } from 'child_process';
import { describe, expect, it } from 'vitest';

describe('npm package files', () => {
  it('includes all required directories in pack output', () => {
    // npm pack --dry-run lists all files that would be included in the package
    const output = execSync('npm pack --dry-run 2>&1', { encoding: 'utf-8' });

    // Core package exports (required for main entry point imports)
    expect(output).toContain('packages/core/dist/');

    // CSS package exports
    expect(output).toContain('packages/css/dist/');

    // Theme selector exports
    expect(output).toContain('packages/theme-selector/dist/');

    // Root dist (main entry point)
    expect(output).toContain('dist/');
  });

  it('includes adapter packages', () => {
    const output = execSync('npm pack --dry-run 2>&1', { encoding: 'utf-8' });

    // Bulma adapter
    expect(output).toContain('packages/adapters/bulma/dist/');

    // Tailwind adapter
    expect(output).toContain('packages/adapters/tailwind/dist/');
  });
});
