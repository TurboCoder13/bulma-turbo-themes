---
title: Development Setup
description: Set up your local development environment for contributing.
category: contributing
order: 2
prev: contributing/index
next: contributing/testing
---

# Development Setup

This guide walks you through setting up a local development environment.

## Prerequisites

- **Node.js** 18 or higher
- **Bun** 1.0 or higher (recommended) or npm
- **Git**

Optional (for platform-specific packages):

- **Python** 3.9+ (for Python package)
- **Ruby** 3.1+ (for Jekyll gem)
- **Swift** 5.9+ (for Swift package)

## Installation

### 1. Fork and Clone

```bash
# Fork the repo on GitHub, then clone your fork
git clone https://github.com/YOUR-USERNAME/turbo-themes.git
cd turbo-themes
```

### 2. Install Dependencies

```bash
# Using Bun (recommended)
bun install

# Or using npm
npm install
```

### 3. Build All Packages

```bash
bun run build
```

This builds:

- Core package (tokens, types)
- CSS generator
- Theme selector
- Framework adapters
- Documentation site

### 4. Start Development Server

```bash
# Start the documentation site
cd apps/site
bun run dev
```

Visit `http://localhost:4321` to see the site.

## Project Scripts

From the root directory:

| Script             | Description        |
| ------------------ | ------------------ |
| `bun run build`    | Build all packages |
| `bun run dev`      | Start dev server   |
| `bun run test`     | Run test suite     |
| `bun run lint`     | Run linter         |
| `bun run lint:fix` | Fix linting issues |
| `bun run format`   | Format code        |

## Package-Specific Development

### Core Package

The core package (`packages/core`) contains design tokens and type definitions.

```bash
cd packages/core
bun run build
```

Key files:

- `src/themes/tokens.json` - All theme token definitions
- `src/themes/types.ts` - TypeScript types
- `src/themes/registry.ts` - Theme registry

### CSS Package

Generates CSS files from tokens.

```bash
cd packages/css
bun run build
```

Output goes to `assets/css/`.

### Theme Selector

The theme selector component.

```bash
cd packages/theme-selector
bun run build
bun run test
```

### Documentation Site

The Astro-powered documentation site.

```bash
cd apps/site
bun run dev      # Development server
bun run build    # Production build
bun run preview  # Preview production build
```

## Code Generation

When you modify tokens, regenerate all outputs:

```bash
# Regenerate everything
bun run build

# Or specifically:
bun run build:css      # Generate CSS files
bun run build:python   # Generate Python package
bun run build:swift    # Generate Swift package
```

## Environment Setup

### VS Code

Recommended extensions:

- ESLint
- Prettier
- Astro
- TypeScript

### EditorConfig

The project includes `.editorconfig` for consistent formatting.

## Troubleshooting

### Build Failures

```bash
# Clean and rebuild
rm -rf node_modules
rm -rf packages/*/dist
bun install
bun run build
```

### Port Already in Use

```bash
# Kill process on port 4321
lsof -ti:4321 | xargs kill -9
```

### Type Errors

```bash
# Regenerate types
bun run build:types
```

## Next Steps

- Learn about [Testing](/docs/contributing/testing/)
- Understand the [Release Process](/docs/contributing/release-process/)
- Review the [Contributing Guidelines](/docs/contributing/)
