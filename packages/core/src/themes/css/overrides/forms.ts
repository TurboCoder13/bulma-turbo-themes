// SPDX-License-Identifier: MIT
// Form CSS overrides - inputs, selects, validation states

/**
 * Generate form-related CSS overrides.
 * Includes inputs, textareas, selects, checkboxes, and validation states.
 */
export function cssFormOverrides(): string {
  return `/* Forms */
input[type='checkbox'],
input[type='radio'],
progress,
input[type='range'] {
  accent-color: var(--theme-link, var(--bulma-link));
}
.input:invalid,
.textarea:invalid,
select:invalid,
input:invalid {
  border-color: var(--bulma-danger);
  box-shadow: none;
}
.input:valid,
.textarea:valid,
select:valid,
input:valid {
  border-color: var(--bulma-success);
  box-shadow: none;
}
.input:focus,
.textarea:focus,
select:focus,
input:focus {
  border-color: var(--bulma-link);
  box-shadow: 0 0 0 0.125em color-mix(in srgb, var(--bulma-link), transparent 80%);
  outline: none;
}
.input:-moz-ui-invalid,
input:-moz-ui-invalid,
select:-moz-ui-invalid {
  border-color: var(--bulma-danger);
  box-shadow: none;
}
::placeholder {
  color: var(--theme-text-muted, currentColor);
  opacity: 1;
}
input:-webkit-autofill {
  -webkit-text-fill-color: var(--theme-text, inherit);
  box-shadow: 0 0 0 1000px var(--theme-surface-1, transparent) inset !important;
  filter: none;
}
input[type='file']::file-selector-button {
  background: color-mix(in srgb, var(--theme-link, var(--bulma-link)) 10%, transparent);
  border: 1px solid var(--theme-link, var(--bulma-link));
  color: var(--theme-text, inherit);
  padding: 0.35rem 0.6rem;
  border-radius: 0.4rem;
}
input[type='file']::file-selector-button:hover {
  background: color-mix(in srgb, var(--theme-link, var(--bulma-link)) 18%, transparent);
}
#theme-flavor-select {
  padding-left: 2rem;
}
#theme-flavor-icon {
  display: none;
}
#theme-flavor-select option[data-icon] {
  background-repeat: no-repeat;
  background-size: 1rem 1rem;
  background-position: 0.5rem center;
  padding-left: 1.75rem;
}
#theme-flavor-select:hover {
  border-color: var(--bulma-link);
  box-shadow: 0 0 0 0.125em color-mix(in srgb, var(--bulma-link), transparent 80%);
}
.input:not(.is-success):not(.is-danger),
.textarea:not(.is-success):not(.is-danger),
.select:not(.is-success):not(.is-danger) select,
.button.is-light {
  background-color: var(--theme-surface-1, inherit);
  color: var(--theme-text, inherit);
  border-color: var(--theme-table-border, var(--bulma-border, currentColor));
}
.input:not(.is-success):not(.is-danger):focus,
.textarea:not(.is-success):not(.is-danger):focus,
.select:not(.is-success):not(.is-danger) select:focus {
  border-color: var(--bulma-link);
  box-shadow: 0 0 0 0.125em color-mix(in srgb, var(--bulma-link), transparent 80%);
}
.select.is-theme select {
  background-color: var(--theme-surface-1, inherit) !important;
  color: var(--theme-text, inherit) !important;
  border: 2px solid var(--theme-table-border, var(--bulma-border, currentColor)) !important;
  border-radius: var(--bulma-radius, 0.375rem) !important;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05) !important;
  padding: 0.5em 2.5em 0.5em 0.75em !important;
  transition: all 0.2s ease !important;
  font-weight: 500 !important;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75em center;
  background-size: 0.75em;
  filter: var(--theme-select-arrow-filter, brightness(0) saturate(100%) invert(0.4));
}
.select.is-theme select:hover {
  border-color: var(--theme-link, var(--bulma-link)) !important;
  box-shadow: 0 2px 4px color-mix(in srgb, var(--theme-link, var(--bulma-link)), transparent 85%) !important;
  background-color: var(--theme-surface-2, inherit) !important;
}
.select.is-theme select:focus {
  border-color: var(--theme-link, var(--bulma-link)) !important;
  box-shadow: 0 0 0 0.125em color-mix(in srgb, var(--theme-link, var(--bulma-link)), transparent 80%),
    0 2px 4px color-mix(in srgb, var(--theme-link, var(--bulma-link)), transparent 85%) !important;
  outline: none !important;
  background-color: var(--theme-surface-1, inherit) !important;
}
.select.is-theme select:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.select.is-theme.has-icons-left select {
  padding-left: 2.5em;
}`;
}
