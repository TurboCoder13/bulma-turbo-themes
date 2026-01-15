---
title: Guides
description: In-depth guides for using Turbo Themes effectively.
category: guides
order: 1
prev: api-reference/javascript-api
next: guides/theme-switching
---

# Guides

In-depth guides for getting the most out of Turbo Themes.

## Available Guides

| Guide                                            | Description                         |
| ------------------------------------------------ | ----------------------------------- |
| [Theme Switching](/docs/guides/theme-switching/) | Implement runtime theme switching   |
| [Custom Themes](/docs/guides/custom-themes/)     | Create your own color schemes       |
| [Accessibility](/docs/guides/accessibility/)     | Ensure your themed UI is accessible |

## Quick Tips

### Use Semantic Tokens

Instead of hardcoding colors, use semantic tokens that adapt to themes:

```css
/* Good - semantic */
.error {
  color: var(--turbo-state-danger);
}

/* Avoid - hardcoded */
.error {
  color: #f38ba8;
}
```

### Test Both Light and Dark

Always test your UI with at least one light and one dark theme to ensure proper contrast
and readability.

### Persist User Preference

Remember to save theme choices to `localStorage` so users don't have to re-select their
theme on every visit.

### Prevent Flash of Unstyled Content

Use a blocking script in `<head>` to apply the saved theme before the page renders.

## Next Steps

Start with the [Theme Switching](/docs/guides/theme-switching/) guide to learn how to
implement dynamic theme changes.
