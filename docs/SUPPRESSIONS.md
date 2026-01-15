# Warning and Deprecation Suppressions

This document tracks all warning and deprecation suppressions in the turbo-themes
project, explaining why each is necessary and when it can be removed.

## Sass Deprecation Suppressions

### Vite Legacy JS API

**Files:**

- `vite.config.js:40`
- `vite.css.config.js:40`

**Suppression:**

```javascript
silenceDeprecations: ['legacy-js-api'];
```

**Reason:** Vite internally uses Dart Sass's legacy JavaScript API. This is a Vite
limitation, not something we can fix in our codebase.

**Removable:** When Vite updates to use the modern Sass API. Track progress at
[Vite GitHub](https://github.com/vitejs/vite).

---

### Bootstrap 5 SCSS Deprecations

**Files:**

- `examples/bootstrap/vite.config.ts:22-28`
- `examples/stackblitz/bootstrap/vite.config.js:10-16`

**Suppression:**

```javascript
silenceDeprecations: [
  'import', // @import rule deprecated in favor of @use/@forward
  'global-builtin', // Global functions like darken(), lighten() deprecated
  'color-functions', // Color manipulation functions deprecated
  'legacy-js-api', // Legacy Sass JS API
  'if-function', // if() function deprecated
];
```

**Reason:** Bootstrap 5's internal SCSS files use legacy Sass patterns:

- `@import` instead of `@use`/`@forward` module system
- Global color functions (`darken()`, `lighten()`) instead of `color.adjust()`
- Other legacy Sass features

These warnings originate from Bootstrap's source code, not ours.

**Removable:** When Bootstrap 6 releases with Sass module system support. Bootstrap 6
development has not yet started as of January 2026. Track progress at
[Bootstrap GitHub](https://github.com/twbs/bootstrap).

---

## ESLint Suppressions

### Browser Globals in Test Setup

**Files:**

- `test/setup.ts:8,27`
- `packages/core/test/setup.ts:8,20`
- `packages/theme-selector/test/setup.ts:8`

**Suppression:**

```typescript
// eslint-disable-next-line no-undef
```

**Reason:** These test setup files use browser globals (`Response`, `setTimeout`,
`queueMicrotask`) that ESLint doesn't recognize in the Node.js environment context.

**Removable:** Could be fixed by adding `env: { browser: true }` to ESLint configuration
for test files, or by adding these globals to the ESLint config. Low priority since
these files are small and stable.

---

## Biome Linting Rules

**File:** `biome.json`

The following rules are intentionally disabled as project style choices:

| Rule                      | Reason                                                      |
| ------------------------- | ----------------------------------------------------------- |
| `noConsoleLog`            | Console logging needed for scripts and debugging            |
| `noGlobalIsNan`           | Project uses global `isNaN` intentionally                   |
| `noExplicitAny`           | Gradual typing strategy allows explicit `any` in some cases |
| `noImplicitAnyLet`        | Same as above                                               |
| `noUnusedTemplateLiteral` | Template literals used for consistency                      |
| `useNodejsImportProtocol` | Project supports both Node.js and browser environments      |
| `noNonNullAssertion`      | Non-null assertions used judiciously where safe             |
| `noUselessElse`           | Preference for explicit else blocks in some cases           |
| `useTemplate`             | String concatenation preferred in some cases                |
| `useSingleVarDeclarator`  | Multiple declarations allowed for related variables         |
| `noForEach`               | `forEach` used when appropriate                             |

These are intentional style choices, not warning suppressions.

---

## Summary

| Category               | Count | Removable?                |
| ---------------------- | ----- | ------------------------- |
| Sass (Vite limitation) | 2     | When Vite updates         |
| Sass (Bootstrap 5)     | 2     | When Bootstrap 6 releases |
| ESLint (test globals)  | 5     | Yes, with config change   |
| Biome (style choices)  | 11    | N/A - intentional         |

**Total suppressions that hide real issues:** 0

All current suppressions are either:

1. Required due to external dependency limitations (Vite, Bootstrap)
2. Addressable via configuration changes (ESLint)
3. Intentional project style choices (Biome)
