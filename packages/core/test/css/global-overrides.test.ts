import { describe, expect, it } from 'vitest';
import { cssGlobalOverrides } from '../../src/themes/css.js';

describe('cssGlobalOverrides', () => {
  it('returns CSS with SPDX license header', () => {
    const css = cssGlobalOverrides();
    expect(css).toContain('/* SPDX-License-Identifier: MIT */');
  });

  it('contains html font-family rule', () => {
    const css = cssGlobalOverrides();
    expect(css).toContain('html {');
    expect(css).toContain('font-family: var(');
    expect(css).toContain('--theme-font-sans');
  });

  it('contains body and content font-family rule', () => {
    const css = cssGlobalOverrides();
    expect(css).toContain('body,');
    expect(css).toContain('.content {');
  });

  it('contains title and heading font-family rules', () => {
    const css = cssGlobalOverrides();
    expect(css).toContain('.title,');
    expect(css).toContain('.content h1,');
    expect(css).toContain('.content h2,');
    expect(css).toContain('.content h3,');
    expect(css).toContain('.content h4,');
    expect(css).toContain('.content h5,');
    expect(css).toContain('.content h6 {');
  });

  it('contains code font-family rules', () => {
    const css = cssGlobalOverrides();
    expect(css).toContain('code,');
    expect(css).toContain('kbd,');
    expect(css).toContain('pre,');
    expect(css).toContain('samp {');
    expect(css).toContain('--theme-font-mono');
  });

  it('contains text color rules', () => {
    const css = cssGlobalOverrides();
    expect(css).toContain('color: var(--theme-text');
  });

  it('contains heading color rules', () => {
    const css = cssGlobalOverrides();
    expect(css).toContain('var(--theme-h1');
    expect(css).toContain('var(--theme-h2');
    expect(css).toContain('var(--theme-h3');
    expect(css).toContain('var(--theme-h4');
    expect(css).toContain('var(--theme-h5');
    expect(css).toContain('var(--theme-h6');
  });

  it('contains blockquote styling', () => {
    const css = cssGlobalOverrides();
    expect(css).toContain('.content blockquote {');
    expect(css).toContain('--theme-blockquote-border');
    expect(css).toContain('--theme-blockquote-fg');
    expect(css).toContain('--theme-blockquote-bg');
  });

  it('contains hr styling', () => {
    const css = cssGlobalOverrides();
    expect(css).toContain('.content hr,');
    expect(css).toContain('hr {');
    expect(css).toContain('border-top:');
  });

  it('contains form element styling', () => {
    const css = cssGlobalOverrides();
    expect(css).toContain("input[type='checkbox']");
    expect(css).toContain("input[type='radio']");
    expect(css).toContain('progress,');
    expect(css).toContain("input[type='range']");
    expect(css).toContain('accent-color:');
  });

  it('contains input validation styling', () => {
    const css = cssGlobalOverrides();
    expect(css).toContain('.input:invalid');
    expect(css).toContain('.input:valid');
    expect(css).toContain('.input:focus');
    expect(css).toContain('--bulma-danger');
    expect(css).toContain('--bulma-success');
    expect(css).toContain('--bulma-link');
  });

  it('contains placeholder styling', () => {
    const css = cssGlobalOverrides();
    expect(css).toContain('::placeholder {');
    expect(css).toContain('--theme-text-muted');
  });

  it('contains autofill styling', () => {
    const css = cssGlobalOverrides();
    expect(css).toContain('input:-webkit-autofill');
    expect(css).toContain('-webkit-text-fill-color');
  });

  it('contains file input styling', () => {
    const css = cssGlobalOverrides();
    expect(css).toContain("input[type='file']::file-selector-button");
  });

  it('contains theme flavor select styling', () => {
    const css = cssGlobalOverrides();
    expect(css).toContain('#theme-flavor-select');
    expect(css).toContain('#theme-flavor-icon');
  });

  it('contains dropdown theme styling', () => {
    const css = cssGlobalOverrides();
    expect(css).toContain('.dropdown.is-theme');
    expect(css).toContain('.theme-flavor-trigger');
    expect(css).toContain('.dropdown-menu');
    expect(css).toContain('.dropdown-content');
    expect(css).toContain('.dropdown-item');
  });

  it('contains table styling', () => {
    const css = cssGlobalOverrides();
    expect(css).toContain('.table.is-striped');
    expect(css).toContain('--theme-table-stripe');
    expect(css).toContain('.table thead th');
    expect(css).toContain('--theme-table-thead-bg');
  });

  it('contains navbar styling', () => {
    const css = cssGlobalOverrides();
    expect(css).toContain('.navbar {');
    expect(css).toContain('.navbar-item');
    expect(css).toContain('.navbar-link');
    expect(css).toContain('.navbar-dropdown');
    expect(css).toContain('--theme-surface-0');
  });

  it('contains accessibility contrast fixes', () => {
    const css = cssGlobalOverrides();
    expect(css).toContain("/* Accessibility contrast fixes (Axe) */");
    expect(css).toContain("[data-flavor='catppuccin-latte']");
    expect(css).toContain("[data-flavor='github-dark']");
  });

  it('contains select theme styling', () => {
    const css = cssGlobalOverrides();
    expect(css).toContain('.select.is-theme select');
    expect(css).toContain('appearance: none');
  });

  it('returns consistent output on multiple calls', () => {
    const css1 = cssGlobalOverrides();
    const css2 = cssGlobalOverrides();
    expect(css1).toBe(css2);
  });
});
