// SPDX-License-Identifier: MIT
// Syntax highlighting CSS generation

import type { ThemeFlavor } from '../types.js';
import { escapeCssId } from './helpers.js';
import { SYNTAX_CLASS_GROUPS } from './mappings.js';

/**
 * Generates syntax highlighting CSS for a theme flavor.
 */
export function generateSyntaxHighlightingCSS(flavor: ThemeFlavor): string {
  const { tokens } = flavor;
  const escapedId = escapeCssId(flavor.id);

  const syntaxColors = {
    fg: tokens.content.codeInline.fg,
    bg: tokens.content.codeInline.bg,
    comment: tokens.text.secondary,
    keyword: tokens.brand.primary,
    string: tokens.state.success,
    number: tokens.state.warning,
    title: tokens.state.info,
    attr: tokens.accent.link,
  };

  const selector = (classes: readonly string[]): string =>
    classes.map((c) => `html[data-flavor='${escapedId}'] .highlight ${c}`).join(',\n');

  return `html[data-flavor='${escapedId}'] .highlight {
  background: ${syntaxColors.bg};
  color: ${syntaxColors.fg};
}
html[data-flavor='${escapedId}'] .highlight pre,
html[data-flavor='${escapedId}'] pre.highlight {
  background: transparent;
  color: ${syntaxColors.fg};
}
html[data-flavor='${escapedId}'] .highlight code {
  background: transparent;
  color: ${syntaxColors.fg};
}
${selector(SYNTAX_CLASS_GROUPS.comment)} {
  color: ${syntaxColors.comment};
}
${selector(SYNTAX_CLASS_GROUPS.keyword)} {
  color: ${syntaxColors.keyword};
}
${selector(SYNTAX_CLASS_GROUPS.string)} {
  color: ${syntaxColors.string};
}
${selector(SYNTAX_CLASS_GROUPS.number)} {
  color: ${syntaxColors.number};
}
${selector(SYNTAX_CLASS_GROUPS.attr)} {
  color: ${syntaxColors.attr};
}
${selector(SYNTAX_CLASS_GROUPS.title)} {
  color: ${syntaxColors.title};
}`;
}
