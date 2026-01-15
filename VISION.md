# Turbo Themes: Project Vision & Architecture

This document defines the vision, goals, and architectural principles for Turbo Themes.
All development should align with these guidelines.

---

## Mission Statement

**Turbo Themes is a platform-agnostic design token library that provides curated theme
packs with the easiest possible integration for any platform.**

We are NOT a component library. We are NOT a CSS framework. We provide **theme values**
and **platform-native ways to access them**.

---

## Core Principles

### 1. Tokens Are the Product

The core value is the curated theme tokens (Catppuccin, Dracula, GitHub, etc.) with a
consistent, well-designed token structure. Everything else is a delivery mechanism.

### 2. Platform Agnostic

Themes work identically across all platforms. A developer using React Native gets the
same `background.base`, `text.primary`, `brand.primary` values as someone using Swift or
plain CSS.

### 3. Zero Lock-In

Users keep their own components, their own framework, their own patterns. We provide
theme values - they decide how to apply them. No proprietary abstractions.

### 4. Minimal Friction

Importing and using themes should be as simple as possible for each platform:

- **Web**: Include CSS, set `data-theme`, done
- **React**: Wrap in `ThemeProvider`, use `useTheme()`, done
- **Swift**: Import package, access `TurboTheme.current`, done

### 5. Framework Adapters Are Optional

Bulma, Tailwind, Bootstrap support exists as **adapters** - optional bridges that map
turbo tokens to framework-specific variables. The core never depends on any framework.

### 6. Quality Over Quantity

Fewer platforms done excellently beats many platforms done poorly. Each supported
platform should have:

- Idiomatic API for that platform
- Complete documentation
- Full test coverage

---

## What We Provide (Level B: Theme System)

| Layer                   | Description                                                       |
| ----------------------- | ----------------------------------------------------------------- |
| **Token Data**          | Color palettes, typography, spacing, component tokens             |
| **Theme Accessor**      | Platform-specific way to access tokens (CSS vars, hooks, objects) |
| **Base Styling**        | Optional CSS/styles that apply tokens to semantic HTML            |
| **Syntax Highlighting** | Code block theming for web                                        |
| **Framework Adapters**  | Optional bridges to CSS frameworks (Bulma, Tailwind, Bootstrap)   |

## What We Do NOT Provide (Level C: Component Library)

- Pre-built components (`<TurboButton>`, `<TurboCard>`, etc.)
- Layout systems
- Proprietary component APIs
- Framework-specific component wrappers

---

## Architecture

### Single Source of Truth

```
packages/core/
├── src/themes/
│   ├── types.ts           # Token type definitions
│   ├── packs/             # Theme definitions (Catppuccin, Dracula, etc.)
│   └── factories/         # Token creation utilities
└── src/tokens/
    └── index.ts           # Canonical export of all themes
```

All theme data originates here. Everything else is generated or derived.

### Generation Pipeline

```
TypeScript Tokens (packages/core/)
         │
         ├──→ JSON (dist/tokens.json) ──→ Any platform can consume
         │
         ├──→ CSS Package (packages/css/)
         │         └── turbo.css, turbo-core.css, themes/*.css
         │
         ├──→ Python (python/src/turbo_themes/)
         │         └── Dataclasses + theme registry
         │
         ├──→ Swift (swift/Sources/TurboThemes/)
         │         └── Enums + structs
         │
         └──→ Future: React, React Native, Android, Flutter, etc.
```

### Package Structure

```
packages/
├── core/                    # @turbo-themes/core - Token definitions
├── css/                     # @turbo-themes/css - Pure CSS output
├── theme-selector/          # @turbo-themes/selector - Web UI component
├── react/                   # @turbo-themes/react - (future)
├── react-native/            # @turbo-themes/react-native - (future)
└── adapters/
    ├── bulma/               # @turbo-themes/adapter-bulma
    ├── tailwind/            # @turbo-themes/adapter-tailwind
    └── bootstrap/           # @turbo-themes/adapter-bootstrap
```

---

## Token Structure

Every theme provides these tokens:

### Required Tokens

```typescript
interface ThemeTokens {
  // Backgrounds
  background: { base; surface; overlay };

  // Text
  text: { primary; secondary; inverse };

  // Brand & State
  brand: { primary };
  state: { info; success; warning; danger };

  // UI Elements
  border: { default };
  accent: { link };

  // Typography
  typography: {
    fonts: { sans; mono };
    webFonts: string[]; // Google Fonts URLs
  };

  // Content (for rich text/markdown)
  content: {
    heading: { h1; h2; h3; h4; h5; h6 };
    body: { primary; secondary };
    link: { default };
    selection: { fg; bg };
    blockquote: { border; fg; bg };
    codeInline: { fg; bg };
    codeBlock: { fg; bg };
    table: { border; stripe; theadBg };
  };
}
```

### Optional Tokens

```typescript
interface ThemeTokens {
  // Layout (shared across themes)
  spacing?: { xs, sm, md, lg, xl }
  elevation?: { none, sm, md, lg, xl }
  animation?: { durationFast, durationNormal, durationSlow, ... }
  opacity?: { disabled, hover, pressed }

  // Component-specific (for enhanced contrast)
  components?: {
    card?: { bg, border, headerBg, footerBg }
    modal?: { bg, cardBg, headerBg, footerBg }
    dropdown?: { bg, itemHoverBg, border }
    // ... etc
  }
}
```

---

## Platform Support Strategy

### Tier 1: Full Support (Current Focus)

- **Web/CSS** - Pure CSS custom properties
- **Jekyll** - Gem + CSS for static sites

### Tier 2: Next Priority

- **React** - ThemeProvider + useTheme hook
- **React Native** - Same API, native values

### Tier 3: Planned

- **Swift/iOS** - SwiftUI environment values
- **Python** - CLI/terminal theming (Rich, Textual)

### Tier 4: Future

- **Android/Kotlin** - Compose theming
- **Flutter/Dart** - ThemeData integration
- **Windows/.NET** - WPF/WinUI resources

### Adding a New Platform

1. Create generator in `generators/<platform>/`
2. Generator reads from `dist/tokens.json` or compiled TypeScript
3. Output platform-idiomatic code to `<platform>/` directory
4. Provide idiomatic theme accessor (hook, object, environment, etc.)
5. Document usage thoroughly
6. Add to build pipeline

---

## CSS Variable Naming Convention

All CSS custom properties use the `--turbo-` prefix:

```css
/* Backgrounds */
--turbo-bg-base
--turbo-bg-surface
--turbo-bg-overlay

/* Text */
--turbo-text-primary
--turbo-text-secondary
--turbo-text-inverse

/* Brand & State */
--turbo-brand-primary
--turbo-state-info
--turbo-state-success
--turbo-state-warning
--turbo-state-danger

/* Typography */
--turbo-font-sans
--turbo-font-mono

/* Content */
--turbo-heading-h1 ... --turbo-heading-h6
--turbo-code-inline-fg, --turbo-code-inline-bg
--turbo-code-block-fg, --turbo-code-block-bg
/* etc. */
```

---

## Theme Switching

### Web

```html
<html data-theme="catppuccin-mocha"></html>
```

```javascript
document.documentElement.setAttribute('data-theme', 'dracula');
```

### React / React Native

```jsx
<ThemeProvider theme="catppuccin-mocha">
  <App />
</ThemeProvider>;

// Or dynamically
const { setTheme } = useTheme();
setTheme('dracula');
```

### Swift

```swift
TurboTheme.current = .catppuccinMocha

// Or in SwiftUI
.environment(\.turboTheme, .dracula)
```

---

## Quality Standards

### Code Quality

- TypeScript strict mode enabled
- Comprehensive test coverage (unit, integration, E2E)
- Linting and formatting enforced
- SPDX license headers on all source files

### Documentation

- Every package has a README
- Every public API has JSDoc/documentation
- Platform-specific integration guides
- Examples that actually work

### Performance

- CSS output < 3KB per theme
- No runtime dependencies in core
- Lazy loading support for themes

### Accessibility

- WCAG-compliant color contrasts where possible
- Accessibility fixes documented per theme
- Theme selector is keyboard/screen-reader accessible

---

## What Success Looks Like

A developer should be able to:

1. **Discover** - Find turbo-themes, understand what it offers in < 2 minutes
2. **Install** - Add to their project with one command
3. **Integrate** - Get themed UI working in < 10 minutes
4. **Customize** - Switch themes with one line of code
5. **Extend** - Add their own themes following our structure (optional)

---

## Anti-Patterns to Avoid

1. **Framework coupling** - Core must never depend on Bulma, Tailwind, React, etc.
2. **Component creep** - Don't build components; provide values
3. **Platform favoritism** - Token structure must work for ALL platforms
4. **Scope creep** - Nail fewer platforms well before expanding
5. **Breaking changes** - Token structure is a contract; changes need migration paths
6. **Clever abstractions** - Prefer explicit, boring code over clever indirection

---

## Decision Log

| Date       | Decision                                        | Rationale                                     |
| ---------- | ----------------------------------------------- | --------------------------------------------- |
| 2024-01-08 | CSS Custom Properties as primary web output     | Framework-agnostic, native browser support    |
| 2024-01-08 | Bulma moved to adapter                          | Core should not depend on any framework       |
| 2024-01-08 | Level B (Theme System) not Level C (Components) | Avoid lock-in, reduce scope, match user needs |
| 2024-01-08 | Monorepo with separate packages                 | Clear separation, independent versioning      |

---

## References

- [W3C Design Tokens](https://design-tokens.github.io/community-group/format/)
- [Style Dictionary](https://amzn.github.io/style-dictionary/)
- [Open Props](https://open-props.style/)
- [Catppuccin](https://catppuccin.com/)
- [Dracula Theme](https://draculatheme.com/)

---

_This document should be updated as the project evolves. Major architectural decisions
should be recorded in the Decision Log._
