// SPDX-License-Identifier: MIT
// Dropdown CSS overrides - theme selector dropdown styling

/**
 * Generate dropdown-related CSS overrides.
 * Includes theme selector dropdown and menu item styles.
 */
export function cssDropdownOverrides(): string {
  return `/* Dropdown Theme Selector */
.dropdown.is-theme {
  --bulma-dropdown-item-h: var(--bulma-text-h);
  --bulma-dropdown-item-s: var(--bulma-text-s);
  --bulma-dropdown-item-color-l: var(--bulma-text-l);
  --bulma-dropdown-item-background-l: var(--bulma-scheme-main-l);
  --bulma-dropdown-item-selected-h: var(--bulma-link-h);
  --bulma-dropdown-item-selected-s: var(--bulma-link-s);
  --bulma-dropdown-item-selected-l: var(--bulma-link-l);
  --bulma-dropdown-item-selected-background-l: var(--bulma-link-l);
  --bulma-dropdown-item-selected-color-l: var(--bulma-link-invert-l);
}
.dropdown.is-theme .theme-flavor-trigger {
  background: var(--theme-surface-1, inherit) !important;
  color: var(--theme-text, inherit) !important;
  border: 2px solid var(--theme-table-border, var(--bulma-border, currentColor)) !important;
  border-radius: var(--bulma-radius, 0.375rem) !important;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05) !important;
  transition: all 0.2s ease !important;
  font-weight: 500 !important;
}
.dropdown.is-theme .theme-flavor-trigger:hover {
  border-color: var(--theme-link, var(--bulma-link)) !important;
  box-shadow: 0 2px 4px color-mix(in srgb, var(--theme-link, var(--bulma-link)), transparent 85%),
    0 0 0 0.125em color-mix(in srgb, var(--theme-link, var(--bulma-link)), transparent 80%) !important;
  background: var(--theme-surface-2, inherit) !important;
}
.dropdown.is-theme .theme-flavor-trigger:focus {
  border-color: var(--theme-link, var(--bulma-link)) !important;
  box-shadow: 0 0 0 0.125em color-mix(in srgb, var(--theme-link, var(--bulma-link)), transparent 80%),
    0 2px 4px color-mix(in srgb, var(--theme-link, var(--bulma-link)), transparent 85%) !important;
  outline: none !important;
}
.dropdown.is-theme .dropdown-menu {
  background: var(--theme-surface-1, inherit) !important;
  border: 2px solid var(--theme-table-border, var(--bulma-border, currentColor)) !important;
  border-radius: var(--bulma-radius, 0.375rem) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1) !important;
  margin-top: 0.25rem !important;
}
.dropdown.is-theme .dropdown-content {
  background-color: transparent !important;
  box-shadow: none !important;
  padding: 0.5rem !important;
  border: none !important;
}
.dropdown.is-theme .dropdown-item {
  color: var(--theme-text, inherit) !important;
  background-color: transparent !important;
  border-radius: var(--bulma-radius-small, 0.25rem) !important;
  padding: 0.625rem 1rem !important;
  display: flex !important;
  align-items: center !important;
  gap: 0.75rem !important;
  border: none !important;
  transition: all 0.15s ease !important;
  font-weight: 400 !important;
}
.dropdown.is-theme .dropdown-item:hover {
  background: var(--theme-surface-2, inherit) !important;
  color: var(--theme-link, var(--bulma-link)) !important;
  transform: translateX(2px);
}
.dropdown.is-theme .dropdown-item.is-active {
  background: var(--theme-link, var(--bulma-link)) !important;
  color: var(--bulma-link-invert, var(--bulma-body-background-color)) !important;
  font-weight: 500 !important;
}
.dropdown.is-theme .dropdown-item.is-active::before {
  content: '\\2713';
  margin-right: 0.25rem;
  font-weight: bold;
}
.dropdown.is-theme .dropdown-item img {
  border-radius: 50% !important;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1) !important;
}`;
}
