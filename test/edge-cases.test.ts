/**
 * Edge case tests for theme system.
 *
 * Tests the production validation and sanitization functions from theme-resolver.
 * Uses it.each() for parametrized testing of multiple payloads.
 */
import { describe, expect, it } from 'vitest';
import {
  isValidThemeId,
  sanitizeThemeId,
} from '../packages/theme-selector/src/theme-resolver';

describe('Theme ID Validation', () => {
  describe('Valid IDs', () => {
    it.each([
      ['catppuccin-mocha', 'standard hyphenated'],
      ['github-dark', 'standard hyphenated'],
      ['dracula', 'single word'],
      ['my_custom_theme', 'underscored'],
      ['theme_v2_dark', 'underscored with numbers'],
      ['my-custom-theme', 'hyphenated'],
      ['theme123', 'with trailing numbers'],
      ['v2-dark', 'starting with number prefix'],
      ['2024-theme', 'starting with year'],
      ['a'.repeat(100), 'at max length (100 chars)'],
    ])('accepts "%s" (%s)', (id: string) => {
      expect(isValidThemeId(id)).toBe(true);
    });
  });

  describe('Invalid IDs - Special Characters', () => {
    it.each([
      ['<script>alert(1)</script>', 'script tags'],
      ['theme<script>', 'partial script tag'],
      ['"theme"', 'double quotes'],
      ["'theme'", 'single quotes'],
      ['theme"name', 'embedded quote'],
      ['theme&amp;name', 'HTML entities'],
      ['theme\\name', 'backslash'],
      ['theme/name', 'forward slash'],
      ['/etc/passwd', 'path'],
      ['theme.name', 'dots'],
      ['theme:name', 'colons'],
      ['theme;name', 'semicolons'],
      ['theme(name)', 'parentheses'],
      ['theme[0]', 'brackets'],
      ['theme{name}', 'braces'],
      ['theme=name', 'equals'],
      ['theme|name', 'pipes'],
      ['`rm -rf /`', 'backticks'],
      ['$theme', 'dollar sign'],
      ['@theme', 'at sign'],
      ['#theme', 'hash sign'],
      ['%theme', 'percent sign'],
      ['^theme', 'caret'],
      ['theme&name', 'ampersand'],
      ['theme*', 'asterisk'],
      ['theme+name', 'plus sign'],
    ])('rejects "%s" (%s)', (id: string) => {
      expect(isValidThemeId(id)).toBe(false);
    });
  });

  describe('Invalid IDs - Unicode', () => {
    it.each([
      ['thème', 'French accent'],
      ['テーマ', 'Japanese'],
      ['主题', 'Chinese'],
      ['тема', 'Russian'],
      ['🌙dark', 'emoji prefix'],
      ['theme🎨', 'emoji suffix'],
      ['😎', 'emoji only'],
      ['theme\u200Bname', 'zero-width space'],
      ['theme\u200Cname', 'zero-width non-joiner'],
      ['theme\u200Dname', 'zero-width joiner'],
      ['theme\uFEFFname', 'BOM'],
      ['theme\u0000name', 'null character'],
      ['theme\u0007name', 'bell character'],
      ['theme\u001Bname', 'escape character'],
      ['theme\u202Ename', 'RTL override'],
    ])('rejects "%s" (%s)', (id: string) => {
      expect(isValidThemeId(id)).toBe(false);
    });
  });

  describe('Invalid IDs - Length and Whitespace', () => {
    it.each([
      ['', 'empty string'],
      [' ', 'single space'],
      ['   ', 'multiple spaces'],
      ['\t', 'tab'],
      ['\n', 'newline'],
      [' theme', 'leading space'],
      ['theme ', 'trailing space'],
      [' theme ', 'surrounding spaces'],
      ['a'.repeat(101), 'over max length (101 chars)'],
    ])('rejects "%s" (%s)', (id: string) => {
      expect(isValidThemeId(id)).toBe(false);
    });
  });

  describe('Invalid IDs - Type Safety', () => {
    it.each([
      [null, 'null'],
      [undefined, 'undefined'],
      [123, 'number'],
      [0, 'zero'],
      [-1, 'negative number'],
      [true, 'true'],
      [false, 'false'],
      [{}, 'empty object'],
      [{ id: 'theme' }, 'object with id'],
      [[], 'empty array'],
      [['theme'], 'array with string'],
      [() => 'theme', 'function'],
    ])('rejects %s (%s)', (id: unknown) => {
      expect(isValidThemeId(id)).toBe(false);
    });
  });
});

describe('Theme ID Sanitization', () => {
  it.each([
    ['catppuccin-mocha', 'catppuccin-mocha', 'preserves valid hyphenated'],
    ['my_theme_v2', 'my_theme_v2', 'preserves valid underscored'],
    ['<script>alert(1)</script>', 'scriptalert1script', 'removes script tags'],
    ['"theme"', 'theme', 'removes double quotes'],
    ["'theme'", 'theme', 'removes single quotes'],
    ['theme!@#$%', 'theme', 'removes special characters'],
    ['a.b.c', 'abc', 'removes dots'],
    ['thème', 'thme', 'removes unicode'],
    ['🌙dark', 'dark', 'removes emoji'],
    [' theme ', 'theme', 'removes whitespace'],
    ['theme\tname', 'themename', 'removes tab'],
    ['!@#$%', '', 'results in empty for all special'],
    ['🎨', '', 'results in empty for emoji only'],
  ])('sanitizes "%s" to "%s" (%s)', (input: string, expected: string) => {
    expect(sanitizeThemeId(input)).toBe(expected);
  });
});

describe('XSS Prevention', () => {
  const xssPayloads = [
    '<script>alert("XSS")</script>',
    '<img src=x onerror=alert(1)>',
    '<svg/onload=alert(1)>',
    'javascript:alert(1)',
    'data:text/html,<script>alert(1)</script>',
    '<iframe src="javascript:alert(1)">',
    '<body onload=alert(1)>',
    '"><script>alert(1)</script>',
    "'-alert(1)-'",
    '${alert(1)}',
  ] as const;

  describe('validation rejects all XSS payloads', () => {
    it.each(xssPayloads.map((p) => [p]))('rejects: %s', (payload: string) => {
      expect(isValidThemeId(payload)).toBe(false);
    });
  });

  describe('sanitization removes dangerous characters', () => {
    it.each(xssPayloads.map((p) => [p]))(
      'sanitizes dangerous chars from: %s',
      (payload: string) => {
        const sanitized = sanitizeThemeId(payload);
        expect(sanitized).not.toContain('<');
        expect(sanitized).not.toContain('>');
        expect(sanitized).not.toContain('"');
        expect(sanitized).not.toContain("'");
        expect(sanitized).not.toContain(':');
      }
    );
  });
});

describe('Path Traversal Prevention', () => {
  const pathPayloads = [
    '../../../etc/passwd',
    '..\\..\\..\\windows\\system32',
    '/etc/passwd',
    'C:\\Windows\\System32',
    '....//....//etc/passwd',
    '..%2f..%2fetc%2fpasswd',
  ] as const;

  it.each(pathPayloads.map((p) => [p]))('rejects: %s', (payload: string) => {
    expect(isValidThemeId(payload)).toBe(false);
  });
});

describe('SQL Injection Prevention', () => {
  const sqlPayloads = [
    "' OR '1'='1",
    '"; DROP TABLE themes;--',
    "1' AND '1'='1",
    'UNION SELECT * FROM users--',
    '1; DELETE FROM themes',
  ] as const;

  it.each(sqlPayloads.map((p) => [p]))('rejects: %s', (payload: string) => {
    expect(isValidThemeId(payload)).toBe(false);
  });
});

describe('Command Injection Prevention', () => {
  const commandPayloads = [
    '; rm -rf /',
    '| cat /etc/passwd',
    '`whoami`',
    '$(whoami)',
    '&& ls -la',
    '|| true',
    '\n rm -rf /',
  ] as const;

  it.each(commandPayloads.map((p) => [p]))('rejects: %s', (payload: string) => {
    expect(isValidThemeId(payload)).toBe(false);
  });
});
