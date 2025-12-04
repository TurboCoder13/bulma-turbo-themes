# bulma-turbo-themes

Modern, accessible theme packs and a drop-in theme selector for Bulma 1.x.

[![Bun](https://img.shields.io/badge/bun-1.3+-black?logo=bun)](https://bun.sh/)
[![Node.js](https://img.shields.io/badge/node.js-22-green)](https://nodejs.org/)
[![Coverage](https://codecov.io/gh/TurboCoder13/bulma-turbo-themes/branch/main/graph/badge.svg)](https://codecov.io/gh/TurboCoder13/bulma-turbo-themes)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)
[![Tests](https://img.shields.io/github/actions/workflow/status/TurboCoder13/bulma-turbo-themes/quality-ci-main.yml?label=tests&branch=main&logo=githubactions&logoColor=white)](https://github.com/TurboCoder13/bulma-turbo-themes/actions/workflows/quality-ci-main.yml?query=branch%3Amain)
[![CI](https://img.shields.io/github/actions/workflow/status/TurboCoder13/bulma-turbo-themes/quality-ci-main.yml?label=ci&branch=main&logo=githubactions&logoColor=white)](https://github.com/TurboCoder13/bulma-turbo-themes/actions/workflows/quality-ci-main.yml?query=branch%3Amain)
[![Lighthouse](https://img.shields.io/github/actions/workflow/status/TurboCoder13/bulma-turbo-themes/reporting-lighthouse-ci.yml?label=lighthouse&branch=main)](https://github.com/TurboCoder13/bulma-turbo-themes/actions/workflows/reporting-lighthouse-ci.yml?query=branch%3Amain)

[![CodeQL](https://github.com/TurboCoder13/bulma-turbo-themes/actions/workflows/security-codeql.yml/badge.svg?branch=main)](https://github.com/TurboCoder13/bulma-turbo-themes/actions/workflows/security-codeql.yml?query=branch%3Amain)
[![OpenSSF Best Practices](https://www.bestpractices.dev/projects/11471/badge)](https://www.bestpractices.dev/projects/11471)
[![SBOM](https://img.shields.io/badge/SBOM-enabled-brightgreen)](SECURITY.md)
[![Download SBOM](https://img.shields.io/badge/SBOM-download_latest-blue?logo=github)](https://github.com/TurboCoder13/bulma-turbo-themes/actions/workflows/security-sbom.yml)

[![npm](https://img.shields.io/npm/v/%40turbocoder13%2Fbulma-turbo-themes)](https://www.npmjs.com/package/@turbocoder13/bulma-turbo-themes)
[![RubyGems](https://img.shields.io/gem/v/bulma-turbo-themes.svg)](https://rubygems.org/gems/bulma-turbo-themes)

## Features

- Catppuccin, Dracula, GitHub (light/dark) flavor packs
- Accessible theme selector with keyboard and screen reader support
- Inline or link-based CSS delivery; CSP-friendly
- Tested with coverage, Lighthouse CI, and stylelint
- Advanced Bulma customization (breakpoints, spacing, shadows, mixins)
- Lazy-loaded themes with performance optimizations
- Full Bulma Sass variable integration

## Installation

### For Jekyll Sites (Recommended)

Install as a Ruby gem:

```ruby
# Gemfile
gem "bulma-turbo-themes", "~> 0.4"
```

```yaml
# _config.yml
theme: bulma-turbo-themes
```

Then run:

```bash
bundle install
bundle exec jekyll serve
```

Assets are automatically available - no copying needed!

### Advanced Theming

For advanced customization options including custom breakpoints, spacing, shadows, and Bulma mixins, see the [Advanced Theming Guide](docs/ADVANCED-THEMING.md).

### For Non-Jekyll Projects

Install via Bun (recommended) or npm:

```bash
# Using Bun (recommended - 5-10x faster)
bun add @turbocoder13/bulma-turbo-themes

# Using npm
npm install @turbocoder13/bulma-turbo-themes
```

## Quick start

### Jekyll Sites

1. Install the gem (see above)
2. Include CSS links in your layout:

```html
<link
  id="theme-global-css"
  rel="stylesheet"
  href="{{ '/assets/css/themes/global.css' | relative_url }}"
/>
<link id="theme-flavor-css" rel="stylesheet" href="#" />
```

1. Add selector markup and initialize:

```html
<div class="navbar-item has-dropdown is-hoverable">
  <button
    class="navbar-link"
    id="theme-flavor-trigger"
    type="button"
    aria-haspopup="true"
    aria-expanded="false"
    aria-controls="theme-flavor-menu"
  >
    <span class="icon is-small" id="theme-flavor-trigger-icon"></span>
    Theme
  </button>
  <div class="navbar-dropdown" id="theme-flavor-menu" aria-labelledby="theme-flavor-trigger">
    <div class="dropdown-content" id="theme-flavor-items"></div>
  </div>
</div>
<div class="select is-rounded is-small is-hidden">
  <select id="theme-flavor-select" aria-label="Theme flavor" disabled></select>
</div>
```

```html
<script src="{{ '/assets/js/theme-selector.js' | relative_url }}"></script>
```

### Non-Jekyll Projects

1. Copy CSS files from `node_modules/@turbocoder13/bulma-turbo-themes/assets/css/themes/` to your project:
   - `global.css` (required)
   - Flavor CSS files (e.g., `catppuccin-mocha.css`, `dracula.css`, `github-dark.css`) - copy the ones you want to use
2. Include CSS links (adjust paths to match your project structure):

```html
<link id="theme-global-css" rel="stylesheet" href="/assets/css/themes/global.css" />
<link id="theme-flavor-css" rel="stylesheet" href="#" />
```

1. Add selector markup and initialize:

```html
<div class="navbar-item has-dropdown is-hoverable">
  <button
    class="navbar-link"
    id="theme-flavor-trigger"
    type="button"
    aria-haspopup="true"
    aria-expanded="false"
    aria-controls="theme-flavor-menu"
  >
    <span class="icon is-small" id="theme-flavor-trigger-icon"></span>
    Theme
  </button>
  <div class="navbar-dropdown" id="theme-flavor-menu" aria-labelledby="theme-flavor-trigger">
    <div class="dropdown-content" id="theme-flavor-items"></div>
  </div>
</div>
<div class="select is-rounded is-small is-hidden">
  <select id="theme-flavor-select" aria-label="Theme flavor" disabled></select>
</div>
```

```ts
import { initTheme, wireFlavorSelector } from '@turbocoder13/bulma-turbo-themes';

document.addEventListener('DOMContentLoaded', () => {
  initTheme(document, window);
  wireFlavorSelector(document, window);
});
```

## Testing

This project includes comprehensive testing:

- **Unit Tests**: Vitest with coverage reporting
- **E2E Tests**: Playwright with Page Object Model pattern
- **Accessibility Tests**: axe-core integration for WCAG compliance
- **Visual Regression**: Playwright screenshots and snapshots

Run tests:

```bash
# Using Bun (recommended)
bun run test          # Unit tests with coverage
bun run e2e           # All E2E tests
bun run e2e:smoke     # Smoke tests only
bun run e2e:visual    # Visual regression tests
bun run e2e:a11y      # Accessibility tests
bun run e2e:ui        # Playwright UI mode

# Using npm (also works)
npm test              # Unit tests with coverage
npm run e2e           # All E2E tests
```

For detailed E2E testing documentation, see `docs/E2E-TESTING.md`.

## Development Setup

### Prerequisites

- **Bun** 1.3+ (recommended) - [Install Bun](https://bun.sh/docs/installation)
- **Node.js** 22+ (alternative)
- **Ruby** 3.3+ with Bundler (for Jekyll demo site)

### Quick Start

```bash
# Clone and install
git clone https://github.com/TurboCoder13/bulma-turbo-themes.git
cd bulma-turbo-themes
bun install
bundle install

# Build and serve
bun run build
bun run build:themes
bun run serve
```

### Why Bun?

This project uses [Bun](https://bun.sh/) as its primary JavaScript runtime for:

- **5-10x faster** package installation
- **10x faster** script startup time
- **~40% reduction** in CI build times
- Full npm compatibility (works with all existing packages)

## Documentation

- Code of Conduct: see `CODE_OF_CONDUCT.md`
- Contributing Guide: see `CONTRIBUTING.md`
- Security Policy: see `SECURITY.md`
- Release process: see `docs/RELEASE-TRAIN.md`
- E2E Testing: see `docs/E2E-TESTING.md`
- Workflows & Actions: see `.github/workflows/README.md` and `.github/actions/README.md`
- Scripts: see `scripts/README.md`

## Governance

See `GOVERNANCE.md` and `MAINTAINERS.md`.

## License

MIT © Turbo Coder
