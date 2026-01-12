# Testing Guidelines

This document describes testing patterns and best practices for the turbo-themes
project.

## Test Structure

### Directory Organization

```
test/                          # Root-level integration tests
├── helpers/
│   └── mocks.ts              # Shared mock utilities
├── public-api/               # Public API tests
│   ├── edge-cases/           # Edge case tests (split by feature)
│   │   ├── keyboard-navigation.test.ts
│   │   ├── base-url-paths.test.ts
│   │   └── icon-handling.test.ts
│   └── wire-flavor-selector/
├── css-output.test.ts        # CSS output validation

packages/*/test/              # Package-specific unit tests
├── flavor-selector/          # Feature-based test modules
│   ├── test-setup.ts        # Shared setup for module
│   ├── initialization.test.ts
│   ├── theme-selection.test.ts
│   ├── dropdown-behavior.test.ts
│   ├── keyboard-nav.test.ts
│   ├── native-select-sync.test.ts
│   └── error-handling.test.ts
```

## Using Mock Helpers

### Available Helpers

Import from `test/helpers/mocks.ts`:

```typescript
import {
  // Factory functions
  createMockLocalStorage,
  createMockClassList,
  createMockElement,
  createMockDropdownContainer,
  createMockAbortController,

  // Setup functions (SOLID - Single Responsibility)
  setupLocalStorageMock,
  setupDocumentHeadMock,
  setupDocumentBodyMock,
  setupDocumentElementMock,
  setupDomQueryMocks,
  setupConsoleMocks,

  // Composite setup
  setupDocumentMocks,

  // Edge case helpers
  createKeyboardNavTestSetup,
  createBaseUrlTestSetup,
  createMockMenuItems,

  // Utilities
  extractEventHandler,
  extractDocumentEventHandler,
} from '../../test/helpers/mocks.js';
```

### Standard Test Setup

```typescript
describe('myFeature', () => {
  let mocks: ReturnType<typeof setupDocumentMocks>;

  beforeEach(() => {
    vi.clearAllMocks();
    mocks = setupDocumentMocks();
  });

  it('does something', () => {
    // Use mocks.mockElement, mocks.mockLocalStorage, etc.
  });
});
```

### Custom Setup with Individual Helpers

For tests that need partial mocking:

```typescript
beforeEach(() => {
  vi.clearAllMocks();
  setupDocumentHeadMock();
  setupDocumentBodyMock();
  setupDocumentElementMock('my-theme');
  // Don't setup localStorage - use real one
});
```

## Parametrized Tests

Use `it.each()` instead of `forEach()` for better test output:

```typescript
// Preferred
it.each(themeIds)('%s.css exists', (themeId) => {
  expect(fileExists(`${themeId}.css`)).toBe(true);
});

// Avoid
themeIds.forEach((themeId) => {
  it(`${themeId}.css exists`, () => {
    expect(fileExists(`${themeId}.css`)).toBe(true);
  });
});
```

For complex parameters:

```typescript
const testCases = flavors.map((f) => [f.id, f.appearance] as const);

it.each(testCases)('%s.css has correct color-scheme: %s', (themeId, appearance) => {
  // ...
});
```

## Assertion Best Practices

### Avoid "Nothing Burger" Tests

```typescript
// Weak - only checks it doesn't crash
it('handles missing element', async () => {
  await expect(doSomething()).resolves.not.toThrow();
});

// Strong - verifies actual behavior
it('applies theme successfully when element is missing', async () => {
  await doSomething();
  expect(themeLoader.applyThemeClass).toHaveBeenCalledWith(document, 'my-theme');
  expect(themeLoader.loadThemeCSS).toHaveBeenCalled();
});
```

### Verify Behavior, Not Implementation

```typescript
// Good - tests behavior
expect(dropdown.classList.contains('is-active')).toBe(true);
expect(menuItems[0].focus).toHaveBeenCalled();

// Avoid - tests implementation details
expect(internal.privateMethod).toHaveBeenCalled();
```

## File Size Guidelines

- **Split files when**: > 500 lines or > 10 tests on unrelated features
- **Keep together when**: Tests share significant setup and are logically cohesive
- **Create shared setup**: When splitting, extract common setup to `test-setup.ts`

## Running Tests

```bash
# All tests
bunx vitest run

# Specific file
bunx vitest run test/css-output.test.ts

# Specific directory
bunx vitest run packages/theme-selector/test/

# Watch mode
bunx vitest

# Coverage
bunx vitest run --coverage
```

## Test Naming Conventions

- Use descriptive names: `'applies theme when dropdown is open'`
- Include expected behavior: `'returns null for invalid input'`
- Reference line numbers for edge cases: `'(lines 689-691)'`
