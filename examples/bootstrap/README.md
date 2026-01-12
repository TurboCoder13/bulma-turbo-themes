# Turbo Themes - Bootstrap Example

A Bootstrap 5 + TypeScript example demonstrating theme integration with Turbo Themes.

## Features

- Bootstrap 5 with SCSS
- Turbo Themes CSS variables mapped to Bootstrap SCSS variables
- Automatic light/dark mode detection
- Theme persistence in localStorage
- FOUC (Flash of Unstyled Content) prevention

## Quick Start

```bash
cd examples/bootstrap
bun install
bun run dev
```

Open [http://localhost:4177](http://localhost:4177) in your browser.

## Project Structure

```
bootstrap/
├── src/
│   ├── styles/
│   │   └── main.scss      # Bootstrap + Turbo integration
│   └── main.ts            # Theme switching logic
├── index.html
├── package.json
└── vite.config.ts
```

## How It Works

### SCSS Integration

The `main.scss` file maps Turbo Themes CSS variables to Bootstrap SCSS variables:

```scss
// Map Turbo variables to Bootstrap
$primary: var(--turbo-brand-primary);
$success: var(--turbo-state-success);
$danger: var(--turbo-state-danger);

$body-bg: var(--turbo-bg-base);
$body-color: var(--turbo-text-primary);

$card-bg: var(--turbo-bg-surface);
$card-border-color: var(--turbo-border-default);

@import 'bootstrap/scss/bootstrap';
```

### Light/Dark Mode

Bootstrap's `data-bs-theme` attribute is automatically set based on the selected theme:

```typescript
const LIGHT_THEMES = ['catppuccin-latte', 'github-light', 'bulma-light'];
const bsTheme = LIGHT_THEMES.includes(themeId) ? 'light' : 'dark';
document.documentElement.setAttribute('data-bs-theme', bsTheme);
```

## Build

```bash
bun run build
```

Output will be in the `dist/` directory.
