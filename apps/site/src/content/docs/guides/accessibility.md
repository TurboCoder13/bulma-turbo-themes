---
title: Accessibility
description: Ensure your themed UI meets accessibility standards.
category: guides
order: 6
prev: guides/performance
next: contributing/index
---

# Accessibility

Turbo Themes is designed with accessibility in mind. This guide covers best practices
for building accessible themed interfaces.

## Color Contrast

### WCAG Requirements

Web Content Accessibility Guidelines (WCAG) define minimum contrast ratios:

| Content Type                     | Minimum Ratio | Level |
| -------------------------------- | ------------- | ----- |
| Normal text                      | 4.5:1         | AA    |
| Large text (18px+ or 14px+ bold) | 3:1           | AA    |
| UI components                    | 3:1           | AA    |
| Normal text                      | 7:1           | AAA   |
| Large text                       | 4.5:1         | AAA   |

### Built-in Contrast

All Turbo Themes meet WCAG AA standards:

```css
/* These combinations are safe */
body {
  background: var(--turbo-bg-base);
  color: var(--turbo-text-primary); /* ✓ 4.5:1+ contrast */
}

.muted {
  color: var(--turbo-text-secondary); /* ✓ 4.5:1+ contrast */
}
```

### Testing Contrast

Use these tools to verify contrast:

- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Colour Contrast Analyser](https://www.tpgi.com/color-contrast-checker/)
- Browser DevTools (Chrome, Firefox have built-in contrast checking)

## Don't Rely on Color Alone

Color should not be the only way to convey information:

### Bad Example

```html
<!-- Don't do this - color is the only indicator -->
<span style="color: red;">Error</span>
<span style="color: green;">Success</span>
```

### Good Example

```html
<!-- Better - includes icon and text -->
<span class="alert alert-danger">
  <svg aria-hidden="true"><!-- error icon --></svg>
  Error: Invalid email address
</span>

<span class="alert alert-success">
  <svg aria-hidden="true"><!-- check icon --></svg>
  Success: Changes saved
</span>
```

## Focus Indicators

Ensure interactive elements have visible focus states:

```css
/* Good focus styles using theme tokens */
button:focus-visible,
a:focus-visible,
input:focus-visible {
  outline: 2px solid var(--turbo-brand-primary);
  outline-offset: 2px;
}

/* Never remove focus outlines without replacement */
/* BAD: *:focus { outline: none; } */
```

## Theme Switcher Accessibility

### Keyboard Navigation

Ensure theme switchers are keyboard accessible:

```html
<div role="listbox" aria-label="Choose theme" tabindex="0">
  <button role="option" aria-selected="true" tabindex="0">Catppuccin Mocha</button>
  <button role="option" aria-selected="false" tabindex="-1">Catppuccin Latte</button>
</div>
```

### Screen Reader Announcements

Announce theme changes to screen readers:

```javascript
function setTheme(themeName) {
  // ... change theme ...

  // Announce to screen readers
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.className = 'sr-only'; // Visually hidden
  announcement.textContent = `Theme changed to ${themeName}`;
  document.body.appendChild(announcement);

  setTimeout(() => announcement.remove(), 1000);
}
```

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

## Reduced Motion

Respect users who prefer reduced motion:

```css
/* Default: smooth transitions */
.theme-transition {
  transition:
    background-color 0.3s,
    color 0.3s;
}

/* Reduced motion: instant changes */
@media (prefers-reduced-motion: reduce) {
  .theme-transition {
    transition: none;
  }
}
```

## High Contrast Mode

Support Windows High Contrast Mode:

```css
@media (forced-colors: active) {
  /* Ensure borders are visible */
  .card {
    border: 1px solid CanvasText;
  }

  /* Ensure focus is visible */
  button:focus {
    outline: 2px solid Highlight;
  }
}
```

## Light/Dark Mode Preferences

Respect system preferences as a default:

```javascript
function getPreferredTheme() {
  // Check saved preference first
  const saved = localStorage.getItem('turbo-theme');
  if (saved) return saved;

  // Fall back to system preference
  if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'catppuccin-latte';
  }
  return 'catppuccin-mocha';
}
```

## Component Patterns

### Buttons

```html
<button type="button" class="btn btn-primary" aria-pressed="false">
  Toggle Feature
</button>
```

```css
.btn-primary {
  background: var(--turbo-brand-primary);
  color: var(--turbo-text-inverse);
  /* Ensure sufficient contrast */
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary:focus-visible {
  outline: 2px solid var(--turbo-brand-primary);
  outline-offset: 2px;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

### Form Inputs

```html
<div class="form-group">
  <label for="email">Email address</label>
  <input
    type="email"
    id="email"
    aria-describedby="email-help email-error"
    aria-invalid="false"
  />
  <p id="email-help" class="form-help">We'll never share your email.</p>
  <p id="email-error" class="form-error" hidden>Please enter a valid email.</p>
</div>
```

```css
input {
  background: var(--turbo-bg-surface);
  color: var(--turbo-text-primary);
  border: 1px solid var(--turbo-border-default);
}

input:focus {
  border-color: var(--turbo-brand-primary);
  outline: none;
  box-shadow: 0 0 0 2px rgba(137, 180, 250, 0.25);
}

input[aria-invalid='true'] {
  border-color: var(--turbo-state-danger);
}

.form-error {
  color: var(--turbo-state-danger);
}
```

### Alerts

```html
<div role="alert" class="alert alert-danger">
  <svg aria-hidden="true" class="alert-icon"><!-- icon --></svg>
  <div>
    <strong>Error:</strong> Your session has expired.
    <a href="/login">Log in again</a>
  </div>
</div>
```

## Testing Checklist

- [ ] All text meets 4.5:1 contrast ratio
- [ ] Large text meets 3:1 contrast ratio
- [ ] UI components meet 3:1 contrast ratio
- [ ] Interactive elements have visible focus states
- [ ] Theme switcher is keyboard accessible
- [ ] Theme changes are announced to screen readers
- [ ] Color is not the only indicator of meaning
- [ ] System color preferences are respected
- [ ] Reduced motion preference is respected

## Tools for Testing

1. **axe DevTools** - Browser extension for accessibility testing
2. **WAVE** - Web accessibility evaluation tool
3. **Lighthouse** - Built into Chrome DevTools
4. **Screen readers** - VoiceOver (Mac), NVDA (Windows), JAWS

## Next Steps

- Check [Contributing Guide](/docs/contributing/) to help improve accessibility
- Review [CSS Variables Reference](/docs/api-reference/css-variables/)
- Learn about [theme switching](/docs/guides/theme-switching/)
