---
title: Testing
description: How to run and write tests for Turbo Themes.
category: contributing
order: 3
prev: contributing/development-setup
next: contributing/release-process
---

# Testing

Turbo Themes uses multiple testing strategies to ensure quality.

## Running Tests

### All Tests

```bash
bun run test
```

### Specific Test Suites

```bash
# Unit tests
bun run test:unit

# E2E tests
bun run test:e2e

# Visual regression tests
bun run test:visual
```

## Test Types

### Unit Tests

Unit tests for individual functions and components.

Location: `packages/*/test/`

```bash
# Run unit tests
bun run test:unit

# Run with coverage
bun run test:coverage
```

Example test:

```typescript
// packages/theme-selector/test/storage.test.ts
import { describe, it, expect, beforeEach } from 'bun:test';
import { getStoredTheme, setStoredTheme } from '../src/storage';

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns default theme when nothing stored', () => {
    expect(getStoredTheme()).toBe('catppuccin-mocha');
  });

  it('returns stored theme', () => {
    localStorage.setItem('turbo-theme', 'dracula');
    expect(getStoredTheme()).toBe('dracula');
  });

  it('stores theme in localStorage', () => {
    setStoredTheme('github-dark');
    expect(localStorage.getItem('turbo-theme')).toBe('github-dark');
  });
});
```

### End-to-End Tests

E2E tests using Playwright.

Location: `e2e/`

```bash
# Run E2E tests
bun run test:e2e

# Run in headed mode (see browser)
bun run test:e2e -- --headed

# Run specific test file
bun run test:e2e -- e2e/theme-switching.spec.ts
```

Example E2E test:

```typescript
// e2e/theme-switching.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Theme Switching', () => {
  test('changes theme when selecting from dropdown', async ({ page }) => {
    await page.goto('/');

    // Open theme dropdown
    await page.click('[data-testid="theme-trigger"]');

    // Select Dracula theme
    await page.click('[data-theme="dracula"]');

    // Verify theme applied
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-theme', 'dracula');
  });

  test('persists theme across page reload', async ({ page }) => {
    await page.goto('/');

    // Change theme
    await page.click('[data-testid="theme-trigger"]');
    await page.click('[data-theme="dracula"]');

    // Reload page
    await page.reload();

    // Theme should still be Dracula
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-theme', 'dracula');
  });
});
```

### Visual Regression Tests

Visual tests to catch unintended UI changes.

```bash
# Run visual tests
bun run test:visual

# Update snapshots
bun run test:visual -- --update-snapshots
```

### Accessibility Tests

Automated accessibility checks:

```bash
bun run test:a11y
```

## Writing Tests

### Test File Naming

- Unit tests: `*.test.ts`
- E2E tests: `*.spec.ts`
- Visual tests: `*.visual.ts`

### Test Structure

Follow the AAA pattern (Arrange, Act, Assert):

```typescript
it('applies theme class to document', () => {
  // Arrange
  const doc = createMockDocument();

  // Act
  applyTheme(doc, 'dracula');

  // Assert
  expect(doc.documentElement.getAttribute('data-theme')).toBe('dracula');
});
```

### Mocking

```typescript
import { mock, spyOn } from 'bun:test';

// Mock localStorage
const mockStorage = {
  getItem: mock(() => 'catppuccin-mocha'),
  setItem: mock(() => {}),
};
globalThis.localStorage = mockStorage;

// Spy on function
const spy = spyOn(console, 'log');
```

## Test Coverage

Check test coverage:

```bash
bun run test:coverage
```

Coverage report is generated in `coverage/`.

### Coverage Requirements

- Minimum overall coverage: 80%
- New code should have tests
- Critical paths should have 100% coverage

## CI/CD Tests

Tests run automatically on:

- Pull requests
- Pushes to main

CI runs:

1. Linting
2. Type checking
3. Unit tests
4. E2E tests
5. Visual regression tests
6. Accessibility tests

## Debugging Tests

### Unit Tests

```bash
# Run with verbose output
bun run test:unit -- --verbose

# Run single test
bun run test:unit -- --filter "storage"
```

### E2E Tests

```bash
# Debug mode
bun run test:e2e -- --debug

# Headed mode (see browser)
bun run test:e2e -- --headed

# Slow motion
bun run test:e2e -- --headed --slow-mo=500
```

## Next Steps

- Understand the [Release Process](/docs/contributing/release-process/)
- Review [Contributing Guidelines](/docs/contributing/)
- Set up your [Development Environment](/docs/contributing/development-setup/)
