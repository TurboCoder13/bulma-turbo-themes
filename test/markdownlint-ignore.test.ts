import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('ignore files include generated report directories', () => {
  it('should include playwright-report/ and lighthouse-reports/ in .markdownlintignore', () => {
    const ignorePath = resolve(process.cwd(), '.markdownlintignore');
    const content = readFileSync(ignorePath, 'utf8');
    expect(content).toMatch(/(^|\n)playwright-report\/\s*$/m);
    expect(content).toMatch(/(^|\n)lighthouse-reports\/\s*$/m);
  });

  it('should include playwright-report/** and lighthouse-reports/** in .stylelintignore', () => {
    const ignorePath = resolve(process.cwd(), '.stylelintignore');
    const content = readFileSync(ignorePath, 'utf8');
    expect(content).toMatch(/(^|\n)playwright-report\/\*\*\s*$/m);
    expect(content).toMatch(/(^|\n)lighthouse-reports\/\*\*\s*$/m);
  });
});
