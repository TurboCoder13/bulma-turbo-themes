---
title: Theme Definitions
description: Complete reference for all 9 Turbo Themes color schemes.
category: api-reference
order: 4
prev: api-reference/tokens
next: api-reference/javascript-api
---

# Theme Definitions

Turbo Themes includes 9 beautiful color schemes across 4 theme families.

## Theme Overview

| Theme                | Family     | Appearance | File                       |
| -------------------- | ---------- | ---------- | -------------------------- |
| Catppuccin Mocha     | Catppuccin | Dark       | `catppuccin-mocha.css`     |
| Catppuccin Macchiato | Catppuccin | Dark       | `catppuccin-macchiato.css` |
| Catppuccin Frappé    | Catppuccin | Dark       | `catppuccin-frappe.css`    |
| Catppuccin Latte     | Catppuccin | Light      | `catppuccin-latte.css`     |
| Dracula              | Dracula    | Dark       | `dracula.css`              |
| GitHub Dark          | GitHub     | Dark       | `github-dark.css`          |
| GitHub Light         | GitHub     | Light      | `github-light.css`         |
| Bulma Dark           | Bulma      | Dark       | `bulma-dark.css`           |
| Bulma Light          | Bulma      | Light      | `bulma-light.css`          |

## Catppuccin Themes

[Catppuccin](https://catppuccin.com/) is a soothing pastel theme with warm, harmonious
colors.

### Catppuccin Mocha (Dark)

The darkest Catppuccin variant with a cozy, warm feel.

| Token              | Value     |
| ------------------ | --------- |
| Background Base    | `#1e1e2e` |
| Background Surface | `#313244` |
| Background Overlay | `#45475a` |
| Text Primary       | `#cdd6f4` |
| Text Secondary     | `#a6adc8` |
| Brand Primary      | `#89b4fa` |
| State Success      | `#a6e3a1` |
| State Warning      | `#f9e2af` |
| State Danger       | `#f38ba8` |
| State Info         | `#89dceb` |

### Catppuccin Macchiato (Dark)

A balanced dark theme, not too dark, not too light.

| Token              | Value     |
| ------------------ | --------- |
| Background Base    | `#24273a` |
| Background Surface | `#363a4f` |
| Background Overlay | `#494d64` |
| Text Primary       | `#cad3f5` |
| Text Secondary     | `#a5adcb` |
| Brand Primary      | `#8aadf4` |

### Catppuccin Frappé (Dark)

A softer dark theme with lighter tones.

| Token              | Value     |
| ------------------ | --------- |
| Background Base    | `#303446` |
| Background Surface | `#414559` |
| Background Overlay | `#51576d` |
| Text Primary       | `#c6d0f5` |
| Text Secondary     | `#a5adce` |
| Brand Primary      | `#8caaee` |

### Catppuccin Latte (Light)

A warm, creamy light theme.

| Token              | Value     |
| ------------------ | --------- |
| Background Base    | `#eff1f5` |
| Background Surface | `#e6e9ef` |
| Background Overlay | `#dce0e8` |
| Text Primary       | `#4c4f69` |
| Text Secondary     | `#6c6f85` |
| Brand Primary      | `#1e66f5` |

## Dracula Theme

[Dracula](https://draculatheme.com/) is a classic dark theme with vibrant accent colors.

### Dracula (Dark)

| Token              | Value     |
| ------------------ | --------- |
| Background Base    | `#282a36` |
| Background Surface | `#44475a` |
| Background Overlay | `#6272a4` |
| Text Primary       | `#f8f8f2` |
| Text Secondary     | `#6272a4` |
| Brand Primary      | `#bd93f9` |
| State Success      | `#50fa7b` |
| State Warning      | `#ffb86c` |
| State Danger       | `#ff5555` |
| State Info         | `#8be9fd` |

## GitHub Themes

Inspired by GitHub's official color schemes.

### GitHub Dark

| Token              | Value     |
| ------------------ | --------- |
| Background Base    | `#0d1117` |
| Background Surface | `#161b22` |
| Background Overlay | `#21262d` |
| Text Primary       | `#c9d1d9` |
| Text Secondary     | `#8b949e` |
| Brand Primary      | `#58a6ff` |
| State Success      | `#3fb950` |
| State Warning      | `#d29922` |
| State Danger       | `#f85149` |
| State Info         | `#58a6ff` |

### GitHub Light

| Token              | Value     |
| ------------------ | --------- |
| Background Base    | `#ffffff` |
| Background Surface | `#f6f8fa` |
| Background Overlay | `#eaeef2` |
| Text Primary       | `#24292f` |
| Text Secondary     | `#57606a` |
| Brand Primary      | `#0969da` |
| State Success      | `#1a7f37` |
| State Warning      | `#9a6700` |
| State Danger       | `#cf222e` |
| State Info         | `#0969da` |

## Bulma Themes

Based on the [Bulma CSS framework](https://bulma.io/) default colors.

### Bulma Dark

| Token              | Value     |
| ------------------ | --------- |
| Background Base    | `#1a1a1a` |
| Background Surface | `#2b2b2b` |
| Background Overlay | `#363636` |
| Text Primary       | `#f5f5f5` |
| Text Secondary     | `#b5b5b5` |
| Brand Primary      | `#00d1b2` |
| State Success      | `#48c78e` |
| State Warning      | `#ffe08a` |
| State Danger       | `#f14668` |
| State Info         | `#3e8ed0` |

### Bulma Light

| Token              | Value     |
| ------------------ | --------- |
| Background Base    | `#ffffff` |
| Background Surface | `#f5f5f5` |
| Background Overlay | `#ededed` |
| Text Primary       | `#363636` |
| Text Secondary     | `#7a7a7a` |
| Brand Primary      | `#00d1b2` |
| State Success      | `#48c78e` |
| State Warning      | `#ffe08a` |
| State Danger       | `#f14668` |
| State Info         | `#3e8ed0` |

## Choosing a Theme

### For Dark Mode Users

- **Catppuccin Mocha** - Warm, cozy, easy on the eyes
- **Dracula** - Vibrant accents, high contrast
- **GitHub Dark** - Familiar if you use GitHub

### For Light Mode Users

- **Catppuccin Latte** - Warm and creamy
- **GitHub Light** - Clean and professional
- **Bulma Light** - Modern and minimal

## Loading Themes

### Single Theme

```html
<link rel="stylesheet" href="/css/themes/turbo/catppuccin-mocha.css" />
```

### Theme Switching

```javascript
function setTheme(themeId) {
  const link = document.getElementById('theme-css');
  link.href = `/css/themes/turbo/${themeId}.css`;
}
```

## Next Steps

- Learn about the [JavaScript API](/docs/api-reference/javascript-api/)
- Explore [theme switching](/docs/guides/theme-switching/)
- Create your own [custom theme](/docs/guides/custom-themes/)
