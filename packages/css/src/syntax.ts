// SPDX-License-Identifier: MIT
/**
 * Syntax highlighting styles for Turbo Themes.
 *
 * Provides CSS for code syntax highlighting that uses Turbo theme variables.
 * Compatible with Rouge (Jekyll), Prism, highlight.js, and other highlighters.
 *
 * @packageDocumentation
 */

import type { ThemeFlavor, ThemeTokens } from '@turbocoder13/turbo-themes-core';
import { CSS_VAR_PREFIX } from './generator.js';

/**
 * Syntax highlighting token types and their CSS class mappings.
 * These cover the common classes used by most syntax highlighters.
 */
const SYNTAX_CLASS_GROUPS = {
  // Comments
  comment: ['.c', '.cm', '.c1', '.cs', '.cp', '.cpf'],
  // Keywords (control flow, declarations)
  keyword: ['.k', '.kc', '.kd', '.kn', '.kp', '.kr', '.kt', '.kv'],
  // Strings
  string: ['.s', '.s1', '.s2', '.sb', '.sc', '.sd', '.se', '.sh', '.si', '.sr', '.ss', '.sx'],
  // Numbers
  number: ['.m', '.mi', '.mf', '.mh', '.mo', '.mb', '.mx', '.il'],
  // Functions and methods
  function: ['.nf', '.fm', '.nb'],
  // Classes and types
  type: ['.nc', '.nn', '.no', '.nd'],
  // Variables and identifiers
  variable: ['.n', '.na', '.nv', '.vc', '.vg', '.vi', '.vm'],
  // Operators
  operator: ['.o', '.ow'],
  // Punctuation
  punctuation: ['.p'],
  // HTML/XML tags
  tag: ['.nt', '.nx'],
  // Attributes
  attribute: ['.na', '.atn'],
  // Values (attribute values, etc.)
  value: ['.atv'],
  // Errors
  error: ['.err', '.gr'],
  // Deletions (diffs)
  deleted: ['.gd'],
  // Insertions (diffs)
  inserted: ['.gi'],
} as const;

/**
 * Generates CSS variable declarations for syntax highlighting.
 */
export function generateSyntaxVarsFromTokens(tokens: ThemeTokens): string[] {
  const lines: string[] = [];
  const add = (name: string, value: string): void => {
    lines.push(`  --${CSS_VAR_PREFIX}-syntax-${name}: ${value};`);
  };

  // Map theme tokens to syntax colors
  add('fg', tokens.content?.codeBlock?.fg ?? tokens.text.primary);
  add('bg', tokens.content?.codeBlock?.bg ?? tokens.background.surface);
  add('comment', tokens.text.secondary);
  add('keyword', tokens.brand.primary);
  add('string', tokens.state.success);
  add('number', tokens.state.warning);
  add('function', tokens.state.info);
  add('type', tokens.brand.primary);
  add('variable', tokens.text.primary);
  add('operator', tokens.text.secondary);
  add('punctuation', tokens.text.secondary);
  add('tag', tokens.state.danger);
  add('attribute', tokens.state.info);
  add('value', tokens.state.success);
  add('error', tokens.state.danger);
  add('deleted', tokens.state.danger);
  add('inserted', tokens.state.success);

  return lines;
}

/**
 * CSS styles for syntax highlighting using Turbo variables.
 * Works with Rouge, Prism, highlight.js, and similar highlighters.
 */
export const CSS_SYNTAX = `/* Turbo Themes - Syntax Highlighting */

/* Astro Code component css-variables theme mapping */
:root {
  --astro-code-color-text: var(--turbo-syntax-fg, var(--turbo-text-primary));
  --astro-code-color-background: var(--turbo-syntax-bg, var(--turbo-code-block-bg));
  --astro-code-token-constant: var(--turbo-syntax-number);
  --astro-code-token-string: var(--turbo-syntax-string);
  --astro-code-token-comment: var(--turbo-syntax-comment);
  --astro-code-token-keyword: var(--turbo-syntax-keyword);
  --astro-code-token-parameter: var(--turbo-syntax-variable);
  --astro-code-token-function: var(--turbo-syntax-function);
  --astro-code-token-string-expression: var(--turbo-syntax-string);
  --astro-code-token-punctuation: var(--turbo-syntax-punctuation);
  --astro-code-token-link: var(--turbo-accent-link, var(--turbo-brand-primary));
  /* Additional Astro tokens */
  --astro-code-background: var(--turbo-syntax-bg, var(--turbo-code-block-bg));
  --astro-code-foreground: var(--turbo-syntax-fg, var(--turbo-text-primary));
}

/* Astro Code component styling */
.astro-code,
pre.astro-code {
  background-color: var(--turbo-syntax-bg, var(--turbo-code-block-bg)) !important;
  padding: var(--space-lg);
  border-radius: var(--radius-lg);
  overflow-x: auto;
  border: 1px solid var(--turbo-border-default);
}

.astro-code code {
  background-color: transparent !important;
  color: inherit;
}

/* Base highlight container - only applies to pre elements */
.highlight,
pre.highlight,
pre[class*="language-"] {
  background-color: var(--turbo-syntax-bg, var(--turbo-code-block-bg));
  color: var(--turbo-syntax-fg, var(--turbo-code-block-fg));
}

/* Code inside pre should have transparent background */
.highlight pre,
.highlight code,
pre code,
pre code[class*="language-"] {
  background-color: transparent;
  color: inherit;
}

/* Comments */
.highlight .c,
.highlight .cm,
.highlight .c1,
.highlight .cs,
.highlight .cp,
.highlight .cpf,
.token.comment,
.token.prolog,
.token.doctype,
.token.cdata,
.hljs-comment,
.hljs-quote {
  color: var(--turbo-syntax-comment);
  font-style: italic;
}

/* Keywords */
.highlight .k,
.highlight .kc,
.highlight .kd,
.highlight .kn,
.highlight .kp,
.highlight .kr,
.highlight .kt,
.highlight .kv,
.token.keyword,
.token.atrule,
.token.important,
.hljs-keyword,
.hljs-selector-tag,
.hljs-built_in,
.hljs-type {
  color: var(--turbo-syntax-keyword);
}

/* Strings */
.highlight .s,
.highlight .s1,
.highlight .s2,
.highlight .sb,
.highlight .sc,
.highlight .sd,
.highlight .se,
.highlight .sh,
.highlight .si,
.highlight .sr,
.highlight .ss,
.highlight .sx,
.token.string,
.token.char,
.token.regex,
.token.template-string,
.hljs-string,
.hljs-regexp {
  color: var(--turbo-syntax-string);
}

/* Numbers */
.highlight .m,
.highlight .mi,
.highlight .mf,
.highlight .mh,
.highlight .mo,
.highlight .mb,
.highlight .mx,
.highlight .il,
.token.number,
.token.boolean,
.token.constant,
.hljs-number,
.hljs-literal {
  color: var(--turbo-syntax-number);
}

/* Functions */
.highlight .nf,
.highlight .fm,
.highlight .nb,
.token.function,
.token.builtin,
.hljs-title.function_,
.hljs-built_in {
  color: var(--turbo-syntax-function);
}

/* Classes and types */
.highlight .nc,
.highlight .nn,
.highlight .no,
.highlight .nd,
.token.class-name,
.token.namespace,
.hljs-title.class_,
.hljs-class .hljs-title {
  color: var(--turbo-syntax-type);
}

/* Variables and identifiers */
.highlight .n,
.highlight .nv,
.highlight .vc,
.highlight .vg,
.highlight .vi,
.highlight .vm,
.token.variable,
.hljs-variable,
.hljs-template-variable {
  color: var(--turbo-syntax-variable);
}

/* Operators */
.highlight .o,
.highlight .ow,
.token.operator,
.hljs-operator {
  color: var(--turbo-syntax-operator);
}

/* Punctuation */
.highlight .p,
.token.punctuation,
.hljs-punctuation {
  color: var(--turbo-syntax-punctuation);
}

/* HTML/XML tags */
.highlight .nt,
.highlight .nx,
.token.tag,
.hljs-tag,
.hljs-name {
  color: var(--turbo-syntax-tag);
}

/* Attributes */
.highlight .na,
.highlight .atn,
.token.attr-name,
.hljs-attr {
  color: var(--turbo-syntax-attribute);
}

/* Attribute values */
.highlight .atv,
.token.attr-value,
.hljs-attr .hljs-string {
  color: var(--turbo-syntax-value);
}

/* Errors */
.highlight .err,
.highlight .gr,
.token.error,
.hljs-error {
  color: var(--turbo-syntax-error);
}

/* Diff: deletions */
.highlight .gd,
.token.deleted,
.hljs-deletion {
  color: var(--turbo-syntax-deleted);
  background-color: color-mix(in srgb, var(--turbo-syntax-deleted) 15%, transparent);
}

/* Diff: insertions */
.highlight .gi,
.token.inserted,
.hljs-addition {
  color: var(--turbo-syntax-inserted);
  background-color: color-mix(in srgb, var(--turbo-syntax-inserted) 15%, transparent);
}

/* Line numbers (if used) */
.highlight .lineno,
.line-numbers .line-numbers-rows,
.hljs-ln-numbers {
  color: var(--turbo-text-secondary);
  opacity: 0.5;
  user-select: none;
}

/* Selection within code */
.highlight ::selection,
pre[class*="language-"] ::selection,
code[class*="language-"] ::selection {
  background-color: var(--turbo-selection-bg);
  color: var(--turbo-selection-fg);
}
`;

/**
 * Generates syntax highlighting CSS for a specific theme.
 * This includes both the variable definitions and the styling rules.
 */
export function generateSyntaxCss(flavor: ThemeFlavor): string {
  const vars = generateSyntaxVarsFromTokens(flavor.tokens);

  return `/* Turbo Themes - Syntax Highlighting for ${flavor.label} */
[data-theme="${flavor.id}"] {
${vars.join('\n')}
}
`;
}

/**
 * Generates the complete syntax highlighting CSS file.
 * Includes base styles that work with any theme.
 */
export function generateSyntaxBaseCss(): string {
  return CSS_SYNTAX;
}
