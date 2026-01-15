// SPDX-License-Identifier: MIT
// Typography CSS overrides - fonts, headings, body text

/**
 * Generate typography-related CSS overrides.
 * Includes font families, heading colors, and body text styles.
 */
export function cssTypographyOverrides(): string {
  return `/* Typography */
html {
  font-family: var(
    --theme-font-sans,
    system-ui,
    -apple-system,
    Segoe UI,
    Roboto,
    Helvetica,
    Arial,
    sans-serif
  );
}
body,
.content {
  font-family: var(
    --theme-font-sans,
    system-ui,
    -apple-system,
    Segoe UI,
    Roboto,
    Helvetica,
    Arial,
    sans-serif
  );
}
.title,
.content h1,
.content h2,
.content h3,
.content h4,
.content h5,
.content h6 {
  font-family: var(
    --theme-font-sans,
    system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif
  );
}
code,
kbd,
pre,
samp {
  font-family: var(
    --theme-font-mono,
    ui-monospace,
    SFMono-Regular,
    Menlo,
    Monaco,
    Consolas,
    'Liberation Mono',
    'Courier New',
    monospace
  );
}
html,
body {
  color: var(--theme-text, inherit);
}
.content p {
  color: var(--theme-text, inherit);
}
.title.is-1,
h1 {
  color: var(--theme-h1, var(--theme-text, inherit));
}
.title.is-2,
h2 {
  color: var(--theme-h2, var(--theme-text, inherit));
}
.title.is-3,
h3 {
  color: var(--theme-h3, var(--theme-text, inherit));
}
.title.is-4,
h4 {
  color: var(--theme-h4, var(--theme-text, inherit));
}
.title.is-5,
h5 {
  color: var(--theme-h5, var(--theme-text, inherit));
}
.title.is-6,
h6 {
  color: var(--theme-h6, var(--theme-text, inherit));
}
.content h1 {
  color: var(--theme-h1, var(--theme-text, inherit));
}
.content h2 {
  color: var(--theme-h2, var(--theme-text, inherit));
}
.content h3 {
  color: var(--theme-h3, var(--theme-text, inherit));
}
.content h4 {
  color: var(--theme-h4, var(--theme-text, inherit));
}
.content h5 {
  color: var(--theme-h5, var(--theme-text, inherit));
}
.content h6 {
  color: var(--theme-h6, var(--theme-text, inherit));
}
.label,
label {
  color: var(--theme-label-color, var(--theme-text, inherit));
}
.content a {
  color: var(--theme-link, var(--bulma-link));
}
.content a:hover {
  color: var(--theme-link-hover, var(--theme-link));
}
.content blockquote {
  border-left: 4px solid var(--theme-blockquote-border, currentColor);
  color: var(--theme-blockquote-fg, inherit);
  background: var(--theme-blockquote-bg, transparent);
  font-style: italic;
}
.content hr,
hr {
  height: 0;
  border: 0;
  border-top: 2px solid
    var(
      --theme-hr-color,
      var(--theme-h1, var(--theme-table-border, var(--bulma-border, currentColor)))
    );
  background: none;
}`;
}
