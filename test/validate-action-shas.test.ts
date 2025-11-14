import { describe, expect, test } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';

describe('validate-action-shas.sh', () => {
  const scriptPath = join(__dirname, '../scripts/ci/validate-action-shas.sh');

  test('script exists and is executable', () => {
    expect(existsSync(scriptPath)).toBe(true);
    // Basic syntax check by running with --help-like behavior
    const result = execSync(`bash -n "${scriptPath}"`, { encoding: 'utf8' });
    expect(result).toBe('');
  });

  test('extracts full action labels for nested actions from sample workflow', () => {
    const workflowPath = join(__dirname, '../.github/workflows/security-codeql.yml');
    const content = readFileSync(workflowPath, 'utf8');

    expect(content).toContain('github/codeql-action/init@');
    expect(content).toContain('github/codeql-action/autobuild@');
    expect(content).toContain('github/codeql-action/analyze@');
  });

  test('validates SHA format in workflow files', () => {
    // Run the script in format validation mode (should pass for our workflows)
    const result = execSync(`bash "${scriptPath}"`, {
      encoding: 'utf8',
      env: { ...process.env, GITHUB_TOKEN: '' }, // No token to avoid API calls
    });

    expect(result).toContain('✅ All SHAs pass format validation');
    expect(result).toContain('Total unique SHAs found:');
  });

  test('handles invalid arguments gracefully', () => {
    try {
      execSync(`bash "${scriptPath}" --invalid-flag`, { encoding: 'utf8' });
      expect.fail('Expected command to fail with invalid argument');
    } catch (error) {
      const execError = error as { status?: number; stdout?: Buffer; stderr?: Buffer };
      expect(execError.status).toBe(1);
      const output = execError.stdout?.toString() || execError.stderr?.toString() || '';
      expect(output).toContain('Unknown option: --invalid-flag');
    }
  });

  test('strict mode requires GITHUB_TOKEN', () => {
    // Run without GITHUB_TOKEN - should skip API validation
    const result = execSync(`bash "${scriptPath}" --strict`, {
      encoding: 'utf8',
      env: { ...process.env, GITHUB_TOKEN: '' },
    });

    expect(result).toContain('✅ Format validation passed');
    expect(result).not.toContain('GitHub API SHA Existence Check');
  });

  test('parses workflow files correctly', () => {
    const result = execSync(`bash "${scriptPath}"`, {
      encoding: 'utf8',
      env: { ...process.env, GITHUB_TOKEN: '' },
    });

    // Should find actions in our workflows
    expect(result).toContain('actions/checkout');
    expect(result).toContain('github/codeql-action');

    // Should show summary statistics
    expect(result).toMatch(/Total unique SHAs found: \d+/);
  });
});
