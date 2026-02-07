// SPDX-License-Identifier: MIT
/**
 * Dropdown UI element creation
 */

import type { ThemeFlavor } from '../theme-mapper.js';
import type { ThemeFamilyMeta } from '../constants.js';
import { setItemActiveState } from './helpers.js';
import { DOM_IDS, DOM_SELECTORS } from '../constants.js';
import { resolveAssetPath } from '../theme-loader.js';
import { ThemeErrors, logThemeError } from '../errors.js';
import type { DropdownElements } from './state.js';

export interface DropdownContext {
  documentObj: Document;
  windowObj: Window;
  baseUrl: string;
  currentThemeId: string;
  selectEl: HTMLSelectElement | null;
  menuItems: HTMLElement[];
  closeDropdown: (options?: { restoreFocus?: boolean }) => void;
  onThemeSelect: (themeId: string) => void;
}

/**
 * Creates a checkmark SVG icon for the active theme indicator.
 */
export function createCheckmarkIcon(doc: Document): SVGSVGElement {
  const svg = doc.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '16');
  svg.setAttribute('height', '16');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '3');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');

  const polyline = doc.createElementNS('http://www.w3.org/2000/svg', 'polyline');
  polyline.setAttribute('points', '20 6 9 17 4 12');
  svg.appendChild(polyline);

  return svg;
}

/**
 * Creates a single theme item button element.
 */
export function createThemeItemElement(
  ctx: DropdownContext,
  theme: ThemeFlavor,
  familyMeta: ThemeFamilyMeta
): HTMLButtonElement {
  const { documentObj, baseUrl, currentThemeId, selectEl, windowObj, closeDropdown, onThemeSelect } = ctx;

  const item = documentObj.createElement('button');
  item.type = 'button';
  item.className = 'dropdown-item theme-item';
  item.setAttribute('data-theme-id', theme.id);
  item.setAttribute('data-appearance', theme.appearance);
  item.setAttribute('role', 'menuitemradio');
  item.setAttribute(
    'aria-label',
    `${familyMeta.name} ${theme.name} (${theme.appearance}). ${theme.description}`
  );
  item.setAttribute('tabindex', '-1');

  const isActive = theme.id === currentThemeId;
  setItemActiveState(item, isActive);

  // Icon (only render if theme has an icon)
  if (theme.icon) {
    const icon = documentObj.createElement('img');
    icon.className = 'theme-icon';
    try {
      icon.src = resolveAssetPath(theme.icon, baseUrl);
    } catch {
      logThemeError(ThemeErrors.INVALID_ICON_PATH(theme.id));
      icon.src = theme.icon;
    }
    icon.alt = `${familyMeta.name} ${theme.name}`;
    icon.width = 24;
    icon.height = 24;
    item.appendChild(icon);
  } else {
    // Add placeholder for consistent spacing
    const placeholder = documentObj.createElement('span');
    placeholder.className = 'theme-icon theme-icon-placeholder';
    placeholder.setAttribute('aria-hidden', 'true');
    item.appendChild(placeholder);
  }

  // Text content
  const copy = documentObj.createElement('div');
  copy.className = 'theme-copy';

  const titleEl = documentObj.createElement('span');
  titleEl.className = 'theme-title';
  titleEl.textContent = `${familyMeta.name} · ${theme.name}`;
  copy.appendChild(titleEl);

  const descriptionEl = documentObj.createElement('span');
  descriptionEl.className = 'theme-description';
  descriptionEl.textContent = theme.description;
  copy.appendChild(descriptionEl);

  item.appendChild(copy);

  // Checkmark for active state
  const check = documentObj.createElement('span');
  check.className = 'theme-check';
  check.appendChild(createCheckmarkIcon(documentObj));
  item.appendChild(check);

  // Click handler
  item.addEventListener('click', (e) => {
    e.preventDefault();
    onThemeSelect(theme.id);
    if (selectEl) {
      selectEl.value = theme.id;
      selectEl.dispatchEvent(new Event('change', { bubbles: true }));
    }
    closeDropdown({ restoreFocus: true });
  });

  return item;
}

/**
 * Creates a family group container with header and theme items.
 */
export function createFamilyGroup(
  ctx: DropdownContext,
  familyKey: string,
  themes: ThemeFlavor[],
  familyMeta: ThemeFamilyMeta,
  animationDelay: number
): { group: HTMLDivElement; items: HTMLElement[] } | null {
  const { documentObj } = ctx;
  if (themes.length === 0) return null;

  const items: HTMLElement[] = [];

  // Create family group container
  const group = documentObj.createElement('div');
  group.className = 'theme-family-group';
  group.setAttribute('role', 'group');
  group.setAttribute('aria-labelledby', `theme-family-${familyKey}`);
  if (group.style && typeof group.style.setProperty === 'function') {
    group.style.setProperty('--animation-delay', `${animationDelay}ms`);
  }

  // Create family header
  const header = documentObj.createElement('div');
  header.className = 'theme-family-header';
  header.id = `theme-family-${familyKey}`;

  const headerTitle = documentObj.createElement('span');
  headerTitle.className = 'theme-family-name';
  headerTitle.textContent = familyMeta.name;
  header.appendChild(headerTitle);
  group.appendChild(header);

  // Create themes container
  const themesContainer = documentObj.createElement('div');
  themesContainer.className = 'theme-family-items';

  themes.forEach((theme) => {
    const item = createThemeItemElement(ctx, theme, familyMeta);
    items.push(item);
    themesContainer.appendChild(item);
  });

  group.appendChild(themesContainer);

  return { group, items };
}

/**
 * Populates the dropdown menu with all theme family groups.
 */
export function populateDropdownMenu(
  ctx: DropdownContext,
  dropdownMenu: HTMLElement,
  themes: ThemeFlavor[],
  themeFamilies: Record<string, ThemeFamilyMeta>
): void {
  const families = Object.keys(themeFamilies);
  let animationDelay = 0;

  families.forEach((familyKey) => {
    const familyThemes = themes.filter((t) => t.family === familyKey);
    const familyMeta = themeFamilies[familyKey];
    if (!familyMeta) return;

    const result = createFamilyGroup(ctx, familyKey, familyThemes, familyMeta, animationDelay);
    if (result) {
      ctx.menuItems.push(...result.items);
      dropdownMenu.appendChild(result.group);
      animationDelay += 30;
    }
  });
}

/**
 * Wires up the native select element for theme selection.
 */
export function wireNativeSelect(
  ctx: DropdownContext,
  selectEl: HTMLSelectElement,
  themes: ThemeFlavor[],
  defaultTheme: string
): void {
  const { documentObj, windowObj, onThemeSelect } = ctx;

  // Clear existing options
  while (selectEl.firstChild) {
    selectEl.removeChild(selectEl.firstChild);
  }

  // Populate options
  themes.forEach((theme) => {
    const option = documentObj.createElement('option');
    option.value = theme.id;
    option.textContent = theme.name;
    option.selected = theme.id === ctx.currentThemeId;
    selectEl.appendChild(option);
  });

  selectEl.disabled = false;

  // Change handler
  selectEl.addEventListener('change', (event) => {
    const target = event.target as HTMLSelectElement | null;
    const selectedThemeId = target?.value || defaultTheme;
    onThemeSelect(selectedThemeId);
  });
}

/**
 * Gets DOM elements required for the dropdown, returning null if any are missing.
 */
export function getDropdownElements(documentObj: Document): DropdownElements | null {
  const dropdownMenu = documentObj.getElementById(DOM_IDS.THEME_FLAVOR_MENU);
  const trigger = documentObj.getElementById(
    DOM_IDS.THEME_FLAVOR_TRIGGER
  ) as HTMLButtonElement | null;
  const dropdown = trigger?.closest(DOM_SELECTORS.NAVBAR_DROPDOWN) as HTMLElement | null;
  const selectEl = documentObj.getElementById(
    DOM_IDS.THEME_FLAVOR_SELECT
  ) as HTMLSelectElement | null;

  if (!dropdownMenu || !trigger || !dropdown) {
    return null;
  }

  return { dropdownMenu, trigger, dropdown, selectEl };
}
