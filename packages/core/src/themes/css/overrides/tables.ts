// SPDX-License-Identifier: MIT
// Table CSS overrides - striping, borders, headers

/**
 * Generate table-related CSS overrides.
 * Includes striping, borders, and header styles.
 */
export function cssTableOverrides(): string {
  return `/* Tables */
.table.is-striped tbody tr:nth-child(even) {
  background-color: var(--theme-table-stripe, var(--theme-surface-2, inherit));
}
.box,
.card,
.dropdown-content,
.menu,
.message,
.panel,
.table,
.table td,
.table th,
.modal-card {
  border-color: var(--theme-table-border, var(--bulma-border, currentColor));
}
.table thead th {
  background-color: var(--theme-table-thead-bg, var(--theme-surface-2, inherit));
}`;
}
