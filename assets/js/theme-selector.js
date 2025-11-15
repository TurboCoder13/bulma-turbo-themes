const THEMES = [
  {
    id: 'bulma-light',
    name: 'Bulma Light',
    cssFile: 'assets/css/themes/bulma-light.css',
    icon: 'assets/img/bulma-logo.png',
  },
  {
    id: 'bulma-dark',
    name: 'Bulma Dark',
    cssFile: 'assets/css/themes/bulma-dark.css',
    icon: 'assets/img/bulma-logo-dark.png',
  },
  {
    id: 'catppuccin-latte',
    name: 'Catppuccin Latte',
    cssFile: 'assets/css/themes/catppuccin-latte.css',
    icon: 'assets/img/catppuccin-logo-latte.png',
  },
  {
    id: 'catppuccin-frappe',
    name: 'Catppuccin Frappé',
    cssFile: 'assets/css/themes/catppuccin-frappe.css',
    icon: 'assets/img/catppuccin-logo-latte.png',
  },
  {
    id: 'catppuccin-macchiato',
    name: 'Catppuccin Macchiato',
    cssFile: 'assets/css/themes/catppuccin-macchiato.css',
    icon: 'assets/img/catppuccin-logo-macchiato.png',
  },
  {
    id: 'catppuccin-mocha',
    name: 'Catppuccin Mocha',
    cssFile: 'assets/css/themes/catppuccin-mocha.css',
    icon: 'assets/img/catppuccin-logo-macchiato.png',
  },
  {
    id: 'dracula',
    name: 'Dracula',
    cssFile: 'assets/css/themes/dracula.css',
    icon: 'assets/img/dracula-logo.png',
  },
  {
    id: 'github-light',
    name: 'GitHub Light',
    cssFile: 'assets/css/themes/github-light.css',
    icon: 'assets/img/github-logo-light.png',
  },
  {
    id: 'github-dark',
    name: 'GitHub Dark',
    cssFile: 'assets/css/themes/github-dark.css',
    icon: 'assets/img/github-logo-dark.png',
  },
];
const STORAGE_KEY = 'bulma-theme-flavor';
const DEFAULT_THEME = 'catppuccin-mocha';
function getBaseUrl(doc) {
  const baseElement = doc.documentElement;
  const raw = baseElement?.getAttribute('data-baseurl') || '';
  try {
    const u = new URL(raw, 'http://localhost');
    // Only allow same-origin relative paths; strip origin used for parsing
    return u.origin === 'http://localhost' ? u.pathname.replace(/\/$/, '') : '';
  } catch {
    return '';
  }
}
function applyTheme(doc, themeId) {
  const theme = THEMES.find((t) => t.id === themeId) || THEMES.find((t) => t.id === DEFAULT_THEME);
  const baseUrl = getBaseUrl(doc);
  const flavorLink = doc.getElementById('theme-flavor-css');
  if (flavorLink) {
    // Build a safe URL relative to base by prepending baseUrl to relative path
    try {
      const fullPath = baseUrl ? `${baseUrl}/${theme.cssFile}` : theme.cssFile;
      const url = new URL(fullPath, 'http://localhost');
      flavorLink.href = url.pathname;
    } catch {
      // Ignore invalid URL
    }
  }
  doc.documentElement.setAttribute('data-flavor', themeId);
  // Update trigger button icon
  const triggerIcon = doc.getElementById('theme-flavor-trigger-icon');
  if (triggerIcon) {
    // Clear existing content first
    while (triggerIcon.firstChild) {
      triggerIcon.removeChild(triggerIcon.firstChild);
    }
    if (theme.icon) {
      // Create and append img element (CSP-friendly)
      const img = doc.createElement('img');
      try {
        const fullPath = baseUrl ? `${baseUrl}/${theme.icon}` : theme.icon;
        const url = new URL(fullPath, 'http://localhost');
        img.src = url.pathname;
      } catch {
        // Ignore invalid URL
      }
      img.alt = theme.name;
      img.title = theme.name; // Tooltip on hover
      img.width = 28;
      img.height = 28;
      triggerIcon.appendChild(img);
    } else {
      // Fallback: show first two letters with circular background
      const span = doc.createElement('span');
      span.textContent = theme.name.substring(0, 2).toUpperCase();
      span.style.fontSize = '12px';
      span.style.fontWeight = 'bold';
      span.style.color = 'var(--theme-text, inherit)';
      span.style.display = 'flex';
      span.style.alignItems = 'center';
      span.style.justifyContent = 'center';
      span.style.width = '28px';
      span.style.height = '28px';
      span.style.borderRadius = '50%';
      span.style.backgroundColor = 'var(--theme-surface-1, #f5f5f5)';
      span.style.border = '1px solid var(--theme-border, #ddd)';
      span.title = theme.name; // Tooltip on hover
      triggerIcon.appendChild(span);
    }
  }
  // Update active state in dropdown
  const dropdownItems = doc.querySelectorAll('#theme-flavor-items .dropdown-item');
  dropdownItems.forEach((item) => {
    if (item.getAttribute('data-theme-id') === themeId) {
      item.classList.add('is-active');
      item.setAttribute('aria-checked', 'true');
    } else {
      item.classList.remove('is-active');
      item.setAttribute('aria-checked', 'false');
    }
  });
}
export function initTheme(documentObj, windowObj) {
  const savedTheme = windowObj.localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME;
  applyTheme(documentObj, savedTheme);
}
export function initNavbar(documentObj) {
  const currentPath = documentObj.location.pathname;
  const navbarItems = documentObj.querySelectorAll('.navbar-item');
  // Find the matching link first
  let matchingItem = null;
  const checkedItems = new Set();
  navbarItems.forEach((item) => {
    const link = item;
    if (link.href) {
      try {
        const linkPath = new URL(link.href).pathname;
        // Remove trailing slashes for comparison
        const normalizedCurrentPath = currentPath.replace(/\/$/, '') || '/';
        const normalizedLinkPath = linkPath.replace(/\/$/, '') || '/';
        checkedItems.add(item);
        if (normalizedCurrentPath === normalizedLinkPath) {
          matchingItem = item;
        }
      } catch {
        // Ignore invalid URLs - don't add to checkedItems
      }
    }
  });
  // Clear all active states except the matching one (only for items that were checked)
  navbarItems.forEach((item) => {
    if (item !== matchingItem && checkedItems.has(item)) {
      item.classList.remove('is-active');
      const link = item;
      // Check if removeAttribute exists (for test mocks that might not have it)
      if (link && 'removeAttribute' in link && typeof link.removeAttribute === 'function') {
        link.removeAttribute('aria-current');
      }
    }
  });
  // Set active state for the matching link
  if (matchingItem) {
    matchingItem.classList.add('is-active');
    const link = matchingItem;
    // Check if setAttribute exists (for test mocks that might not have it)
    if (link && 'setAttribute' in link && typeof link.setAttribute === 'function') {
      link.setAttribute('aria-current', 'page');
    }
  }
  // Handle Reports dropdown highlighting
  const reportsLink = documentObj.querySelector('[data-testid="nav-reports"]');
  if (reportsLink) {
    const reportPaths = ['/coverage', '/playwright', '/lighthouse'];
    const normalizedCurrentPath = currentPath.replace(/\/$/, '') || '/';
    const isOnReportsPage = reportPaths.some(
      (path) => normalizedCurrentPath === path || normalizedCurrentPath.startsWith(path + '/')
    );
    if (isOnReportsPage) {
      reportsLink.classList.add('is-active');
    } else {
      reportsLink.classList.remove('is-active');
    }
  }
}
window.initNavbar = initNavbar;
export function wireFlavorSelector(documentObj, windowObj) {
  const abortController = new AbortController();
  const baseUrl = getBaseUrl(documentObj);
  const dropdownContent = documentObj.getElementById('theme-flavor-items');
  const trigger = documentObj.querySelector('.theme-flavor-trigger');
  const dropdown = documentObj.getElementById('theme-flavor-dd');
  if (!dropdownContent || !trigger || !dropdown) {
    return {
      cleanup: () => {
        abortController.abort();
      },
    };
  }
  let currentIndex = -1;
  const menuItems = [];
  // Get current theme to set initial aria-checked state
  const currentThemeId =
    windowObj.localStorage.getItem(STORAGE_KEY) ||
    documentObj.documentElement.getAttribute('data-flavor') ||
    DEFAULT_THEME;
  // Populate dropdown with theme options
  THEMES.forEach((theme) => {
    const item = documentObj.createElement('a');
    item.href = '#';
    item.className = 'dropdown-item';
    item.setAttribute('data-theme-id', theme.id);
    item.setAttribute('role', 'menuitemradio');
    item.setAttribute('aria-label', theme.name);
    item.setAttribute('tabindex', '-1');
    const isActive = theme.id === currentThemeId;
    item.setAttribute('aria-checked', String(isActive));
    if (isActive) {
      item.classList.add('is-active');
    }
    if (theme.icon) {
      const img = documentObj.createElement('img');
      try {
        const fullPath = baseUrl ? `${baseUrl}/${theme.icon}` : theme.icon;
        const url = new URL(fullPath, 'http://localhost');
        img.src = url.pathname;
      } catch {
        // Ignore invalid URL
      }
      img.alt = theme.name;
      img.title = theme.name;
      img.width = 28;
      img.height = 28;
      item.appendChild(img);
    } else {
      // Fallback: show first two letters with styled background
      const span = documentObj.createElement('span');
      span.textContent = theme.name.substring(0, 2);
      span.style.fontSize = '14px';
      span.style.fontWeight = 'bold';
      span.style.color = 'var(--theme-text, inherit)';
      item.appendChild(span);
    }
    // Always include a visually hidden full name for screen readers
    const srOnly = documentObj.createElement('span');
    srOnly.textContent = theme.name;
    srOnly.style.position = 'absolute';
    srOnly.style.width = '1px';
    srOnly.style.height = '1px';
    srOnly.style.padding = '0';
    srOnly.style.margin = '-1px';
    srOnly.style.overflow = 'hidden';
    srOnly.style.clip = 'rect(0, 0, 0, 0)';
    srOnly.style.whiteSpace = 'nowrap';
    srOnly.style.border = '0';
    item.appendChild(srOnly);
    item.addEventListener('click', (e) => {
      e.preventDefault();
      applyTheme(documentObj, theme.id);
      windowObj.localStorage.setItem(STORAGE_KEY, theme.id);
      closeDropdown({ restoreFocus: true });
    });
    menuItems.push(item);
    dropdownContent.appendChild(item);
  });
  // Update aria-expanded on trigger
  const updateAriaExpanded = (expanded) => {
    trigger.setAttribute('aria-expanded', String(expanded));
  };
  // Focus management
  const focusMenuItem = (index) => {
    if (index < 0 || index >= menuItems.length) return;
    const item = menuItems[index];
    // Set tabindex to -1 for all items
    menuItems.forEach((menuItem) => {
      menuItem.setAttribute('tabindex', '-1');
    });
    // Focus and set tabindex to 0 on current item
    item.setAttribute('tabindex', '0');
    item.focus();
    currentIndex = index;
  };
  const openDropdown = () => {
    dropdown.classList.add('is-active');
    updateAriaExpanded(true);
    currentIndex = -1;
  };
  const closeDropdown = (options = {}) => {
    const { restoreFocus = true } = options;
    dropdown.classList.remove('is-active');
    updateAriaExpanded(false);
    menuItems.forEach((menuItem) => {
      menuItem.setAttribute('tabindex', '-1');
    });
    currentIndex = -1;
    if (restoreFocus) {
      // Only restore focus to trigger when explicitly requested (e.g., selection or Esc)
      trigger.focus();
    }
  };
  // Open dropdown on hover
  dropdown.addEventListener(
    'mouseenter',
    () => {
      openDropdown();
    },
    { signal: abortController.signal }
  );
  // Close dropdown when mouse leaves
  dropdown.addEventListener(
    'mouseleave',
    () => {
      // Only close if not keyboard navigating
      if (currentIndex === -1) {
        closeDropdown();
      }
    },
    { signal: abortController.signal }
  );
  // Toggle dropdown helper function
  const toggleDropdown = (focusFirst = false) => {
    const isActive = dropdown.classList.toggle('is-active');
    updateAriaExpanded(isActive);
    if (!isActive) {
      currentIndex = -1;
      menuItems.forEach((menuItem) => {
        menuItem.setAttribute('tabindex', '-1');
        menuItem.setAttribute('aria-checked', String(menuItem.classList.contains('is-active')));
      });
    } else if (focusFirst && menuItems.length > 0) {
      // ...rest of the existing logic
      // When opening via keyboard, focus first item
      focusMenuItem(0);
    }
  };
  // Toggle dropdown on trigger click (for touch devices)
  trigger.addEventListener(
    'click',
    (e) => {
      e.preventDefault();
      toggleDropdown();
    },
    { signal: abortController.signal }
  );
  // Close dropdown when clicking outside
  documentObj.addEventListener(
    'click',
    (e) => {
      if (!dropdown.contains(e.target)) {
        // Close on any outside click; do not steal focus from the newly clicked element
        closeDropdown({ restoreFocus: false });
      }
    },
    { signal: abortController.signal }
  );
  // Handle Escape key globally to close dropdown
  documentObj.addEventListener(
    'keydown',
    (e) => {
      if (e.key === 'Escape' && dropdown.classList.contains('is-active')) {
        closeDropdown({ restoreFocus: true });
      }
    },
    { signal: abortController.signal }
  );
  // Keyboard navigation
  trigger.addEventListener(
    'keydown',
    (e) => {
      const key = e.key;
      if (key === 'Enter' || key === ' ') {
        e.preventDefault();
        const wasActive = dropdown.classList.contains('is-active');
        if (wasActive) {
          // If already open, close it
          toggleDropdown(false);
        } else {
          // If closed, open and focus first item
          toggleDropdown(true);
        }
      } else if (key === 'ArrowDown') {
        e.preventDefault();
        if (!dropdown.classList.contains('is-active')) {
          dropdown.classList.add('is-active');
          updateAriaExpanded(true);
          focusMenuItem(0); // Focus first item when opening
        } else {
          // If currentIndex is -1 (dropdown opened via mouse or not yet initialized), focus first item
          if (currentIndex < 0) {
            focusMenuItem(0);
          } else {
            const nextIndex = currentIndex < menuItems.length - 1 ? currentIndex + 1 : 0;
            focusMenuItem(nextIndex);
          }
        }
      } else if (key === 'ArrowUp') {
        e.preventDefault();
        if (!dropdown.classList.contains('is-active')) {
          dropdown.classList.add('is-active');
          updateAriaExpanded(true);
          // Start from last item when opening with ArrowUp
          focusMenuItem(menuItems.length - 1);
        } else {
          // If currentIndex is -1 (dropdown opened via mouse), start from last
          const startIndex = currentIndex < 0 ? menuItems.length - 1 : currentIndex;
          const prevIndex = startIndex > 0 ? startIndex - 1 : menuItems.length - 1;
          focusMenuItem(prevIndex);
        }
      }
    },
    { signal: abortController.signal }
  );
  // Keyboard navigation on menu items
  menuItems.forEach((item, index) => {
    item.addEventListener(
      'keydown',
      (e) => {
        const key = e.key;
        if (key === 'ArrowDown') {
          e.preventDefault();
          const nextIndex = index < menuItems.length - 1 ? index + 1 : 0;
          focusMenuItem(nextIndex);
        } else if (key === 'ArrowUp') {
          e.preventDefault();
          const prevIndex = index > 0 ? index - 1 : menuItems.length - 1;
          focusMenuItem(prevIndex);
        } else if (key === 'Escape') {
          e.preventDefault();
          closeDropdown();
        } else if (key === 'Enter' || key === ' ') {
          e.preventDefault();
          item.click();
        } else if (key === 'Home') {
          e.preventDefault();
          focusMenuItem(0);
        } else if (key === 'End') {
          e.preventDefault();
          focusMenuItem(menuItems.length - 1);
        }
      },
      { signal: abortController.signal }
    );
  });
  // Initialize aria-expanded
  updateAriaExpanded(false);
  return {
    cleanup: () => {
      abortController.abort();
    },
  };
}
export function enhanceAccessibility(documentObj) {
  const pres = documentObj.querySelectorAll('.highlight > pre');
  pres.forEach((pre) => {
    if (!pre.hasAttribute('tabindex')) pre.setAttribute('tabindex', '0');
    if (!pre.hasAttribute('role')) pre.setAttribute('role', 'region');
    if (!pre.hasAttribute('aria-label')) pre.setAttribute('aria-label', 'Code block');
  });
}
// Auto-initialize on DOMContentLoaded
if (typeof document !== 'undefined' && typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    console.warn('Theme switcher initializing...');
    try {
      initTheme(document, window);
      const { cleanup } = wireFlavorSelector(document, window);
      enhanceAccessibility(document);
      // Register cleanup to run on teardown
      const pagehideHandler = () => {
        cleanup();
        window.removeEventListener('pagehide', pagehideHandler);
      };
      window.addEventListener('pagehide', pagehideHandler);
      console.warn('Theme switcher initialized successfully');
    } catch (error) {
      console.error('Theme switcher initialization failed:', error);
    }
  });
}
//# sourceMappingURL=index.js.map
