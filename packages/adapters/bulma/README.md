# @turbocoder13/turbo-themes-adapter-bulma

Bulma CSS adapter for Turbo Themes. Maps Turbo theme tokens to Bulma's CSS custom
properties.

## Overview

This adapter allows you to use Turbo Themes with the Bulma CSS framework. It provides a
CSS file that bridges Turbo's variable naming convention to Bulma's expected custom
properties.

## Installation

```bash
npm install @turbocoder13/turbo-themes bulma
# or
bun add @turbocoder13/turbo-themes bulma
```

## Usage

### Basic Setup

Load the CSS files in this order:

```html
<!-- 1. Turbo core variables (required) -->
<link rel="stylesheet" href="path/to/turbo-core.css" />

<!-- 2. Theme (changes the variables) -->
<link rel="stylesheet" href="path/to/themes/catppuccin-mocha.css" />

<!-- 3. Bulma adapter (bridges variables) -->
<link rel="stylesheet" href="path/to/bulma-adapter.css" />

<!-- 4. Bulma framework -->
<link rel="stylesheet" href="bulma/css/bulma.min.css" />
```

### With a Bundler

```js
// Import in order
import '@turbocoder13/turbo-themes/css/core';
import '@turbocoder13/turbo-themes/css/themes/catppuccin-mocha.css';
import '@turbocoder13/turbo-themes/adapters/bulma.css';
import 'bulma/css/bulma.min.css';
```

### Dynamic Theme Switching

```html
<html data-theme="catppuccin-mocha"></html>
```

```js
function setTheme(themeId) {
  document.documentElement.setAttribute('data-theme', themeId);
}

// Switch to Dracula
setTheme('dracula');
```

## How It Works

The adapter creates CSS custom property mappings from Turbo's naming convention to
Bulma's:

```css
:root {
  /* Turbo variable -> Bulma variable */
  --bulma-scheme-main: var(--turbo-bg-base);
  --bulma-text: var(--turbo-text-primary);
  --bulma-primary: var(--turbo-brand-primary);
  /* ... 80+ mappings */
}
```

## Covered Components

The adapter provides mappings for all major Bulma components:

- **Layout**: Body, Background, Color Scheme
- **Typography**: Text, Code, Headings
- **Forms**: Input, Button, Select
- **Components**: Card, Box, Modal, Dropdown, Navbar, Menu, Panel, Tabs
- **Elements**: Table, Notification, Message, Progress, Breadcrumb, Pagination
- **Sections**: Footer

## Integration with Frameworks

### Vite

```typescript
// vite.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        // If using Bulma Sass
        additionalData: `@use "bulma/sass" with ($primary: hsl(217, 92%, 76%));`,
      },
    },
  },
});
```

```typescript
// main.ts
import '@turbocoder13/turbo-themes/css/core';
import '@turbocoder13/turbo-themes/css/themes/catppuccin-mocha.css';
import '@turbocoder13/turbo-themes/adapters/bulma.css';
import 'bulma/css/bulma.min.css';
```

### Next.js

```typescript
// app/layout.tsx
import '@turbocoder13/turbo-themes/css/core';
import '@turbocoder13/turbo-themes/adapters/bulma.css';
import 'bulma/css/bulma.min.css';

export default function RootLayout({ children }) {
  return (
    <html data-theme="catppuccin-mocha">
      <body>{children}</body>
    </html>
  );
}
```

### Astro

```astro
---
// src/layouts/Layout.astro
---

<html data-theme="catppuccin-mocha">
  <head>
    <link rel="stylesheet" href="/turbo-core.css" />
    <link rel="stylesheet" href="/themes/catppuccin-mocha.css" />
    <link rel="stylesheet" href="/bulma-adapter.css" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@1/css/bulma.min.css" />
  </head>
  <body>
    <slot />
  </body>
</html>
```

## Programmatic Usage

If you need to generate the CSS programmatically:

```ts
import {
  generateBulmaAdapterCss,
  BULMA_ADAPTER_CSS,
} from '@turbocoder13/turbo-themes/adapters/bulma';

// Get the CSS content
const css = generateBulmaAdapterCss();
```

## Advanced: Sass Configuration

For advanced Bulma customization using Sass, use the configuration utilities:

```ts
import { generateBulmaUse, hexToHsl } from '@turbocoder13/turbo-themes/adapters/bulma';

const colors = {
  primary: '#89b4fa',
  link: '#89dceb',
  info: '#89dceb',
  success: '#a6e3a1',
  warning: '#f9e2af',
  danger: '#f38ba8',
};

const sassConfig = generateBulmaUse(colors);
// Generates @use 'bulma/sass' with ($primary: hsl(...), ...)
```

## API

- `BULMA_ADAPTER_CSS` - The CSS adapter content as a string
- `generateBulmaAdapterCss()` - Returns the CSS adapter content
- `generateBulmaUse(colors, config?)` - Generate Bulma Sass @use statement
- `generateBulmaConfig(config)` - Generate Bulma Sass configuration
- `hexToHsl(hex)` - Convert hex color to HSL values

## TypeScript Support

The adapter includes full TypeScript support:

```typescript
import type { BulmaAdapterConfig } from '@turbocoder13/turbo-themes/adapters/bulma';

const config: BulmaAdapterConfig = {
  colors: {
    primary: '#89b4fa',
    link: '#89dceb',
    info: '#89dceb',
    success: '#a6e3a1',
    warning: '#f9e2af',
    danger: '#f38ba8',
  },
};
```

## Troubleshooting

### Bulma styles override theme colors

Ensure you load the CSS files in the correct order:

1. Turbo core variables
2. Theme CSS
3. Bulma adapter
4. Bulma framework

The adapter must come before Bulma to properly set the CSS custom properties.

### Components not themed correctly

Some Bulma components use hardcoded colors. For full theming support, use the Sass
configuration approach:

```typescript
import { generateBulmaUse } from '@turbocoder13/turbo-themes/adapters/bulma';

// Generate Sass config with your theme colors
const sassConfig = generateBulmaUse({
  primary: '#89b4fa',
  link: '#89dceb',
});
```

### Dark mode toggle not working

Ensure the `data-theme` attribute is set on the `<html>` element:

```html
<html data-theme="dracula">
  <!-- content -->
</html>
```

### Missing component styles

The adapter covers 80+ Bulma CSS custom properties. If a component appears unstyled, it
may use hardcoded Sass values. Check the Bulma documentation for component-specific
customization.

## License

MIT
