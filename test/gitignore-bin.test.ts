import { describe, expect, test } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

describe('.gitignore configuration', () => {
  test('ignores local tool bin directory', () => {
    const gitignorePath = join(__dirname, '..', '.gitignore');
    const content = readFileSync(gitignorePath, 'utf8');

    expect(content.split('\n')).toContain('.bin/');
  });
});
