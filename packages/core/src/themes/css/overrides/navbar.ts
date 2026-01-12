// SPDX-License-Identifier: MIT
// Navbar CSS overrides - navigation bar styling

/**
 * Generate navbar-related CSS overrides.
 * Includes navigation bar, items, dropdowns, and active states.
 */
export function cssNavbarOverrides(): string {
  return `/* Navbar */
.navbar {
  background-color: var(--theme-surface-0, inherit) !important;
  border-bottom: 1px solid var(--theme-border, var(--theme-table-border, var(--bulma-border, currentColor))) !important;
  --bulma-navbar-background-color: var(--theme-surface-0, inherit);
  --bulma-navbar-item-color: var(--theme-text, inherit);
  --bulma-navbar-item-hover-background-l-delta: 0.05;
  --bulma-navbar-item-active-background-l-delta: 0.1;
}
.navbar-item,
.navbar-link {
  color: var(--theme-text, inherit) !important;
  --bulma-navbar-item-color-l: var(--bulma-text-l);
}
.navbar-item.is-active,
.navbar-link.is-active {
  color: var(--theme-link, var(--bulma-link)) !important;
  background-color: transparent !important;
  --bulma-navbar-item-color-l: var(--bulma-link-l);
}
.navbar-link:not(.is-arrowless)::after {
  border-color: var(--theme-link, var(--bulma-link)) !important;
}
.navbar-dropdown {
  background-color: var(--theme-surface-1, inherit) !important;
  border-top: 1px solid var(--theme-border, var(--theme-table-border, var(--bulma-border, currentColor))) !important;
  box-shadow: 0 4px 6px rgba(10, 10, 10, 0.1);
  --bulma-navbar-dropdown-background-color: var(--theme-surface-1, inherit);
}
.navbar-dropdown .navbar-item {
  color: var(--theme-text, inherit) !important;
  background-color: transparent !important;
  border: none;
}
.navbar-dropdown .navbar-item:hover {
  background-color: var(--theme-surface-2, inherit) !important;
  color: var(--theme-link, var(--bulma-link)) !important;
}
.navbar-dropdown .navbar-item.is-active {
  background-color: var(--theme-surface-2, inherit) !important;
  color: var(--theme-link, var(--bulma-link)) !important;
}
.navbar-item:hover,
.navbar-link:hover {
  background-color: var(--theme-surface-2, inherit) !important;
  color: var(--theme-link, var(--bulma-link)) !important;
}
a.navbar-item:hover,
a.navbar-item.is-active,
.navbar-link:hover,
.navbar-link.is-active {
  background-color: var(--theme-surface-2, inherit) !important;
  color: var(--theme-link, var(--bulma-link)) !important;
}`;
}
