// SPDX-License-Identifier: MIT
// Accessibility CSS overrides - contrast fixes for specific themes

/**
 * Generate accessibility-related CSS overrides.
 * Includes contrast fixes for themes that need WCAG compliance adjustments.
 */
export function cssAccessibilityOverrides(): string {
  return `/* Accessibility contrast fixes (Axe) */
[data-flavor='catppuccin-latte'] .navbar-item,
[data-flavor='catppuccin-latte'] .has-text-centered > p,
[data-flavor='catppuccin-latte'] a.navbar-item,
[data-flavor='catppuccin-latte'] .title,
[data-flavor='catppuccin-latte'] h1,
[data-flavor='catppuccin-latte'] h2,
[data-flavor='catppuccin-latte'] h3,
[data-flavor='catppuccin-latte'] h4 {
  color: #1e293b; /* strong slate for >=4.5:1 on light bg */
}

[data-flavor='catppuccin-latte'] .button.is-text,
[data-flavor='catppuccin-latte'] .button.is-ghost,
[data-flavor='catppuccin-latte'] .navbar-item.is-active {
  color: #0b66d6; /* deeper blue for >=4.5:1 on light bg */
}

[data-flavor='github-dark'] strong,
[data-flavor='github-dark'] th,
[data-flavor='github-dark'] .has-text-centered > p {
  color: #c9d1d9; /* github-dark foreground */
}

[data-flavor='github-dark'] .button.is-text,
[data-flavor='github-dark'] .button.is-ghost {
  color: #58a6ff; /* accessible link blue on dark bg */
}`;
}
