# Turbo Themes Examples

This directory contains complete, working examples demonstrating how to integrate Turbo
Themes with various frameworks and platforms.

## Available Examples

| Example                           | Framework    | Description                                | Try It                                                                                           |
| --------------------------------- | ------------ | ------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| [html-vanilla](./html-vanilla/)   | HTML/JS      | Zero-dependency vanilla JavaScript         | [StackBlitz](https://stackblitz.com/github/lgtm-hq/turbo-themes/tree/main/examples/html-vanilla) |
| [react](./react/)                 | React 18     | TypeScript with custom `useTheme` hook     | [StackBlitz](https://stackblitz.com/github/lgtm-hq/turbo-themes/tree/main/examples/react)        |
| [vue](./vue/)                     | Vue 3        | Composition API with `useTheme` composable | [StackBlitz](https://stackblitz.com/github/lgtm-hq/turbo-themes/tree/main/examples/vue)          |
| [tailwind](./tailwind/)           | Tailwind CSS | Preset integration with utility classes    | [StackBlitz](https://stackblitz.com/github/lgtm-hq/turbo-themes/tree/main/examples/tailwind)     |
| [bootstrap](./bootstrap/)         | Bootstrap 5  | SCSS integration with light/dark mode      | [StackBlitz](https://stackblitz.com/github/lgtm-hq/turbo-themes/tree/main/examples/bootstrap)    |
| [jekyll](./jekyll/)               | Jekyll       | Ruby gem with Bulma components             | -                                                                                                |
| [swift-swiftui](./swift-swiftui/) | SwiftUI      | iOS/macOS native app                       | -                                                                                                |

## Quick Start

Each example can be run locally with these steps:

### Node.js Examples (HTML, React, Vue, Tailwind, Bootstrap)

```bash
# Navigate to the example
cd examples/<example-name>

# Install dependencies
bun install

# Start development server
bun run dev
```

### Jekyll Example

```bash
cd examples/jekyll
bundle install
bundle exec jekyll serve --livereload
```

### SwiftUI Example

Open `examples/swift-swiftui/Package.swift` in Xcode and run the ThemeShowcaseApp
scheme.

## What Each Example Demonstrates

All examples include:

- **Theme Switching** - A dropdown selector to switch between 9 built-in themes
- **localStorage Persistence** - Selected theme persists across page reloads
- **FOUC Prevention** - Blocking script prevents flash of unstyled content
- **CSS Custom Properties** - All styling uses `var(--turbo-*)` tokens
- **Buttons** - Primary, success, and danger button styles
- **Cards** - Surface containers with proper backgrounds and borders
- **Color Swatches** - Visual display of theme accent colors

## Running Tests

Each example has Playwright E2E tests that verify theme switching functionality:

```bash
# Run all example tests
bun run examples:test

# Or run from the examples directory
cd examples
bunx playwright test --config=playwright.config.ts
```

## Building Examples

Build all examples that have a build step:

```bash
bun run examples:build
```

## Contributing

Want to add a new example? Here's how:

1. Create a new directory under `examples/`
2. Include:
   - A complete, working implementation
   - A `README.md` with setup instructions
   - Theme switching with all 9 themes
   - localStorage persistence
   - FOUC prevention script
3. Add tests in a `test/` subdirectory
4. Update this README with your example
5. Submit a pull request

## Example Structure

```
examples/
├── html-vanilla/         # Zero-dependency HTML
├── react/                # Vite + React 18 + TypeScript
├── vue/                  # Vite + Vue 3 + TypeScript
├── tailwind/             # Vite + Tailwind CSS
├── bootstrap/            # Vite + Bootstrap 5 + SCSS
├── jekyll/               # Ruby + Jekyll + Bulma
├── swift-swiftui/        # SwiftUI iOS/macOS app
├── playwright.config.ts  # Shared test configuration
└── test-utils/           # Shared test utilities
    ├── fixtures.ts
    ├── helpers.ts
    └── index.ts
```
