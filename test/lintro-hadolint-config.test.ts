import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';

describe('lintro hadolint configuration', () => {
  test('defines hadolint tool with _site/Dockerfile exclusion', () => {
    const pyprojectPath = join(__dirname, '..', 'pyproject.toml');
    const content = readFileSync(pyprojectPath, 'utf8');

    expect(content).toContain('[tool.lintro.tool.hadolint]');
    expect(content).toContain('exclude = ["_site/Dockerfile"]');
  });
});
