import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { execSync, execFileSync } from 'child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

describe('External package consumption', () => {
  let testDir: string | undefined;
  let tarballPath: string | undefined;

  beforeAll(() => {
    // Create tarball
    execSync('bun pm pack', { stdio: 'pipe' });
    const files = execSync('ls -1 lgtm-hq-turbo-themes-*.tgz', { encoding: 'utf-8' });
    tarballPath = join(process.cwd(), files.trim().split('\n')[0]);

    // Create temp directory
    testDir = mkdtempSync(join(tmpdir(), 'turbo-themes-test-'));

    // Initialize package and install tarball
    execSync('bun init -y', { cwd: testDir, stdio: 'pipe' });
    // Use execFileSync with array args to avoid shell injection with path
    execFileSync('bun', ['add', tarballPath], { cwd: testDir, stdio: 'pipe' });
  });

  afterAll(() => {
    // Cleanup temp directory
    if (testDir) {
      rmSync(testDir, { recursive: true, force: true });
    }
    // Cleanup tarball using fs instead of shell glob
    if (tarballPath) {
      rmSync(tarballPath, { force: true });
    }
  });

  it('can import main entry point without resolution errors', () => {
    const testFile = join(testDir!, 'test-main.mjs');
    writeFileSync(
      testFile,
      `
      import { flavors, getTheme, themeIds } from '@lgtm-hq/turbo-themes';
      console.log(JSON.stringify({ flavors: flavors.length, themeIds: themeIds.length }));
    `,
    );

    const output = execFileSync('node', [testFile], { encoding: 'utf-8' });
    const result = JSON.parse(output.trim());
    expect(result.flavors).toBeGreaterThan(0);
    expect(result.themeIds).toBeGreaterThan(0);
  });

  it('can import /selector subpath without resolution errors', () => {
    const testFile = join(testDir!, 'test-selector.mjs');
    writeFileSync(
      testFile,
      `
      import { initTheme, wireFlavorSelector } from '@lgtm-hq/turbo-themes/selector';
      console.log(JSON.stringify({
        hasInitTheme: typeof initTheme === 'function',
        hasWireFlavorSelector: typeof wireFlavorSelector === 'function'
      }));
    `,
    );

    const output = execFileSync('node', [testFile], { encoding: 'utf-8' });
    const result = JSON.parse(output.trim());
    expect(result.hasInitTheme).toBe(true);
    expect(result.hasWireFlavorSelector).toBe(true);
  });

  it('can import /tokens subpath without resolution errors', () => {
    const testFile = join(testDir!, 'test-tokens.mjs');
    writeFileSync(
      testFile,
      `
      import { flavors, themeIds } from '@lgtm-hq/turbo-themes/tokens';
      console.log(JSON.stringify({ flavors: flavors.length, themeIds: themeIds.length }));
    `,
    );

    const output = execFileSync('node', [testFile], { encoding: 'utf-8' });
    const result = JSON.parse(output.trim());
    expect(result.flavors).toBeGreaterThan(0);
    expect(result.themeIds).toBeGreaterThan(0);
  });
});
