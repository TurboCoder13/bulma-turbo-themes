var TurboThemeSelector = (function(exports) {
  "use strict";
  const STORAGE_KEY = "turbo-theme";
  const LEGACY_STORAGE_KEYS = ["bulma-theme-flavor"];
  const DEFAULT_THEME = "catppuccin-mocha";
  const DOM_IDS = {
    THEME_FLAVOR_TRIGGER: "theme-flavor-trigger",
    THEME_FLAVOR_TRIGGER_ICON: "theme-flavor-trigger-icon",
    THEME_FLAVOR_TRIGGER_LABEL: "theme-flavor-trigger-label",
    THEME_FLAVOR_MENU: "theme-flavor-menu",
    THEME_FLAVOR_SELECT: "theme-flavor-select"
  };
  const DOM_SELECTORS = {
    DROPDOWN_ITEMS: `#${DOM_IDS.THEME_FLAVOR_MENU} .dropdown-item.theme-item`,
    NAVBAR_DROPDOWN: ".navbar-item.has-dropdown",
    NAV_REPORTS: '[data-testid="nav-reports"]',
    NAVBAR_ITEM: ".navbar-item",
    HIGHLIGHT_PRE: ".highlight > pre",
    THEME_CSS_LINKS: 'link[id^="theme-"][id$="-css"]'
  };
  const THEME_FAMILIES = {
    bulma: { name: "Bulma", description: "Classic Bulma themes" },
    catppuccin: { name: "Catppuccin", description: "Soothing pastel themes" },
    dracula: { name: "Dracula", description: "Dark vampire aesthetic" },
    gruvbox: { name: "Gruvbox", description: "Retro groove palette with warm, earthy tones" },
    github: { name: "GitHub", description: "GitHub-inspired themes" },
    nord: { name: "Nord", description: "Arctic, north-bluish color palette" },
    "rose-pine": { name: "Rosé Pine", description: "All natural pine, faux fur and a bit of soho vibes" },
    solarized: { name: "Solarized", description: "Precision-balanced light and dark modes" },
    "tokyo-night": { name: "Tokyo Night", description: "Neon-infused nightscape with crisp contrast" }
  };
  const LOG_PREFIX = "[turbo-themes]";
  const ThemeErrors = {
    /** Invalid theme ID provided */
    INVALID_THEME_ID: (themeId) => ({
      code: "INVALID_THEME_ID",
      message: `Invalid theme ID "${themeId}" not saved to storage`,
      level: "warn",
      context: { themeId }
    }),
    /** No themes available in registry */
    NO_THEMES_AVAILABLE: () => ({
      code: "NO_THEMES_AVAILABLE",
      message: "No themes available",
      level: "error"
      /* ERROR */
    }),
    /** Invalid theme icon path */
    INVALID_ICON_PATH: (themeId) => ({
      code: "INVALID_ICON_PATH",
      message: `Invalid theme icon path for ${themeId}`,
      level: "warn",
      context: { themeId }
    }),
    /** Theme initialization failed */
    INIT_FAILED: (error) => ({
      code: "INIT_FAILED",
      message: "Theme switcher initialization failed",
      level: "error",
      context: { error: error instanceof Error ? error.message : String(error) }
    }),
    /** Protocol-relative URL rejected for security */
    PROTOCOL_REJECTED: () => ({
      code: "PROTOCOL_REJECTED",
      message: "Protocol-relative base URL rejected for security",
      level: "warn"
      /* WARN */
    }),
    /** Insecure HTTP URL rejected */
    INSECURE_HTTP_REJECTED: () => ({
      code: "INSECURE_HTTP_REJECTED",
      message: "Insecure HTTP base URL rejected",
      level: "warn"
      /* WARN */
    }),
    /** Cross-origin URL rejected */
    CROSS_ORIGIN_REJECTED: (origin) => ({
      code: "CROSS_ORIGIN_REJECTED",
      message: `Cross-origin base URL rejected: ${origin}`,
      level: "warn",
      context: { origin }
    }),
    /** Invalid CSS path for theme */
    INVALID_CSS_PATH: (themeId) => ({
      code: "INVALID_CSS_PATH",
      message: `Invalid theme CSS path for ${themeId}`,
      level: "warn",
      context: { themeId }
    }),
    /** CSS failed to load */
    CSS_LOAD_FAILED: (themeId, error) => ({
      code: "CSS_LOAD_FAILED",
      message: `Theme CSS failed to load for ${themeId}`,
      level: "warn",
      context: {
        themeId,
        error: error instanceof Error ? error.message : String(error)
      }
    }),
    /** Storage unavailable (private browsing or disabled) */
    STORAGE_UNAVAILABLE: (operation, error) => ({
      code: "STORAGE_UNAVAILABLE",
      message: `localStorage ${operation} failed - storage may be unavailable`,
      level: "warn",
      context: {
        operation,
        error: error instanceof Error ? error.message : String(error)
      }
    })
  };
  function logThemeError(themeError) {
    const prefixedMessage = `${LOG_PREFIX} ${themeError.message}`;
    if (themeError.level === "error") {
      if (themeError.context) {
        console.error(prefixedMessage, themeError.context);
      } else {
        console.error(prefixedMessage);
      }
    } else {
      if (themeError.context) {
        console.warn(prefixedMessage, themeError.context);
      } else {
        console.warn(prefixedMessage);
      }
    }
  }
  function safeGetItem(windowObj, key) {
    try {
      return windowObj.localStorage.getItem(key);
    } catch (error) {
      logThemeError(ThemeErrors.STORAGE_UNAVAILABLE("getItem", error));
      return null;
    }
  }
  function safeSetItem(windowObj, key, value) {
    try {
      windowObj.localStorage.setItem(key, value);
      return true;
    } catch (error) {
      logThemeError(ThemeErrors.STORAGE_UNAVAILABLE("setItem", error));
      return false;
    }
  }
  function safeRemoveItem(windowObj, key) {
    try {
      windowObj.localStorage.removeItem(key);
    } catch (error) {
      logThemeError(ThemeErrors.STORAGE_UNAVAILABLE("removeItem", error));
    }
  }
  function validateThemeId(themeId, validIds) {
    if (themeId && validIds.has(themeId)) {
      return themeId;
    }
    return DEFAULT_THEME;
  }
  function migrateLegacyStorage(windowObj) {
    for (const legacyKey of LEGACY_STORAGE_KEYS) {
      const legacy = safeGetItem(windowObj, legacyKey);
      if (legacy && !safeGetItem(windowObj, STORAGE_KEY)) {
        safeSetItem(windowObj, STORAGE_KEY, legacy);
        safeRemoveItem(windowObj, legacyKey);
      }
    }
  }
  function getSavedTheme(windowObj, validIds) {
    const stored = safeGetItem(windowObj, STORAGE_KEY);
    if (validIds) {
      return validateThemeId(stored, validIds);
    }
    return stored || DEFAULT_THEME;
  }
  function saveTheme(windowObj, themeId, validIds) {
    if (validIds && !validIds.has(themeId)) {
      logThemeError(ThemeErrors.INVALID_THEME_ID(themeId));
      return false;
    }
    return safeSetItem(windowObj, STORAGE_KEY, themeId);
  }
  function resolveAssetPath(assetPath, baseUrl) {
    const normalizedBase = baseUrl.replace(/\/$/, "");
    const base = normalizedBase ? `${window.location.origin}${normalizedBase}/` : `${window.location.origin}/`;
    return new URL(assetPath, base).pathname;
  }
  function getBaseUrl(doc) {
    const baseElement = doc.documentElement;
    const raw = baseElement?.getAttribute("data-baseurl") || "";
    if (!raw) return "";
    if (raw.startsWith("//")) {
      logThemeError(ThemeErrors.PROTOCOL_REJECTED());
      return "";
    }
    if (raw.startsWith("http://") && !raw.startsWith("http://localhost")) {
      logThemeError(ThemeErrors.INSECURE_HTTP_REJECTED());
      return "";
    }
    try {
      const currentOrigin = typeof window !== "undefined" ? window.location.origin : "http://localhost";
      const u = new URL(raw, currentOrigin);
      if (u.origin !== currentOrigin) {
        logThemeError(ThemeErrors.CROSS_ORIGIN_REJECTED(u.origin));
        return "";
      }
      return u.pathname.replace(/\/$/, "");
    } catch {
      return "";
    }
  }
  function clearLinkHandlers(link) {
    link.onload = null;
    link.onerror = null;
  }
  function loadCSSWithTimeout(link, themeId, timeoutMs = 1e4) {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        clearLinkHandlers(link);
        reject(new Error(`Theme ${themeId} load timeout`));
      }, timeoutMs);
      link.onload = () => {
        clearTimeout(timeoutId);
        clearLinkHandlers(link);
        resolve();
      };
      link.onerror = () => {
        clearTimeout(timeoutId);
        clearLinkHandlers(link);
        reject(new Error(`Failed to load theme ${themeId}`));
      };
    });
  }
  function getCurrentThemeFromClasses(element) {
    const classList = Array.from(element.classList);
    for (const className of classList) {
      if (className.startsWith("theme-")) {
        return className.substring(6);
      }
    }
    return null;
  }
  function applyThemeClass(doc, themeId) {
    const themeClasses = Array.from(doc.documentElement.classList).filter(
      (className) => className.startsWith("theme-")
    );
    if (themeClasses.length > 0) {
      doc.documentElement.classList.remove(...themeClasses);
    }
    doc.documentElement.classList.add(`theme-${themeId}`);
  }
  async function loadThemeCSS(doc, theme, baseUrl) {
    const themeLinkId = `theme-${theme.id}-css`;
    let themeLink = doc.getElementById(themeLinkId);
    if (!themeLink) {
      themeLink = doc.createElement("link");
      themeLink.id = themeLinkId;
      themeLink.rel = "stylesheet";
      themeLink.type = "text/css";
      themeLink.setAttribute("data-theme-id", theme.id);
      try {
        themeLink.href = resolveAssetPath(theme.cssFile, baseUrl);
      } catch {
        logThemeError(ThemeErrors.INVALID_CSS_PATH(theme.id));
        return;
      }
      doc.head.appendChild(themeLink);
      try {
        await loadCSSWithTimeout(themeLink, theme.id);
      } catch (error) {
        logThemeError(ThemeErrors.CSS_LOAD_FAILED(theme.id, error));
      }
    }
    doc.querySelectorAll(DOM_SELECTORS.THEME_CSS_LINKS).forEach((link) => {
      const linkThemeId = link.id.replace("theme-", "").replace("-css", "");
      if (linkThemeId !== theme.id && linkThemeId !== "base") {
        link.remove();
      }
    });
  }
  function setItemActiveState(item, isActive) {
    if (isActive) {
      item.classList.add("is-active");
    } else {
      item.classList.remove("is-active");
    }
    item.setAttribute("aria-checked", String(isActive));
  }
  function setTabindexBatch(items, value) {
    for (const item of items) {
      item.setAttribute("tabindex", value);
    }
  }
  const themes = /* @__PURE__ */ JSON.parse('{"bulma-dark":{"id":"bulma-dark","label":"Bulma Dark","vendor":"bulma","appearance":"dark","tokens":{"background":{"base":"#141414","surface":"#1f1f1f","overlay":"#2b2b2b"},"text":{"primary":"#f5f5f5","secondary":"#dbdbdb","inverse":"#141414"},"brand":{"primary":"#00d1b2"},"state":{"info":"#3e8ed0","success":"#48c78e","warning":"#ffe08a","danger":"#f14668"},"border":{"default":"#363636"},"accent":{"link":"#485fc7"},"typography":{"fonts":{"sans":"\\"Nunito Sans\\", BlinkMacSystemFont, -apple-system, \\"Segoe UI\\", Roboto, Oxygen, Ubuntu, Cantarell, \\"Fira Sans\\", \\"Droid Sans\\", \\"Helvetica Neue\\", Helvetica, Arial, sans-serif","mono":"\\"JetBrains Mono\\", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \\"Liberation Mono\\", \\"Courier New\\", monospace"},"webFonts":["https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,400;0,6..12,600;0,6..12,700;1,6..12,400&display=swap","https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&display=swap"]},"content":{"heading":{"h1":"#00d1b2","h2":"#7289da","h3":"#5dade2","h4":"#58d68d","h5":"#f7dc6f","h6":"#f1948a"},"body":{"primary":"#dbdbdb","secondary":"#b5b5b5"},"link":{"default":"#485fc7"},"selection":{"fg":"#f5f5f5","bg":"#3273dc"},"blockquote":{"border":"#363636","fg":"#dbdbdb","bg":"#1f1f1f"},"codeInline":{"fg":"#f14668","bg":"#2b2b2b"},"codeBlock":{"fg":"#f5f5f5","bg":"#2b2b2b"},"table":{"border":"#404040","stripe":"#1c1c1c","theadBg":"#2d2d2d","cellBg":"#1a1a1a","headerFg":"#f5f5f5"}},"spacing":{"xs":"0.25rem","sm":"0.5rem","md":"1rem","lg":"1.5rem","xl":"2rem"},"elevation":{"none":"none","sm":"0 1px 2px 0 rgba(0, 0, 0, 0.05)","md":"0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)","lg":"0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)","xl":"0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"},"animation":{"durationFast":"150ms","durationNormal":"300ms","durationSlow":"500ms","easingDefault":"cubic-bezier(0.4, 0, 0.2, 1)","easingEmphasized":"cubic-bezier(0.05, 0.7, 0.1, 1)"},"opacity":{"disabled":0.5,"hover":0.8,"pressed":0.6},"components":{"card":{"bg":"#1c1c1c","border":"#3a3a3a","headerBg":"#252525","footerBg":"#1f1f1f"},"message":{"bg":"#1f1f1f","headerBg":"#2a2a2a","border":"#404040","bodyFg":"#e0e0e0"},"panel":{"bg":"#1c1c1c","headerBg":"#2a2a2a","headerFg":"#f5f5f5","border":"#3a3a3a","blockBg":"#1f1f1f","blockHoverBg":"#262626","blockActiveBg":"#2d3748"},"box":{"bg":"#1c1c1c","border":"#3a3a3a"},"notification":{"bg":"#252525","border":"#404040"},"modal":{"bg":"rgba(0, 0, 0, 0.86)","cardBg":"#1c1c1c","headerBg":"#252525","footerBg":"#1f1f1f"},"dropdown":{"bg":"#1c1c1c","itemHoverBg":"#2a2a2a","border":"#404040"},"tabs":{"border":"#404040","linkBg":"#252525","linkActiveBg":"#1c1c1c","linkHoverBg":"#2a2a2a"}}}},"bulma-light":{"id":"bulma-light","label":"Bulma Light","vendor":"bulma","appearance":"light","tokens":{"background":{"base":"#ffffff","surface":"#f5f5f5","overlay":"#eeeeee"},"text":{"primary":"#363636","secondary":"#4a4a4a","inverse":"#ffffff"},"brand":{"primary":"#00d1b2"},"state":{"info":"#3e8ed0","success":"#48c78e","warning":"#ffe08a","danger":"#f14668"},"border":{"default":"#dbdbdb"},"accent":{"link":"#485fc7"},"typography":{"fonts":{"sans":"\\"Nunito Sans\\", BlinkMacSystemFont, -apple-system, \\"Segoe UI\\", Roboto, Oxygen, Ubuntu, Cantarell, \\"Fira Sans\\", \\"Droid Sans\\", \\"Helvetica Neue\\", Helvetica, Arial, sans-serif","mono":"\\"JetBrains Mono\\", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \\"Liberation Mono\\", \\"Courier New\\", monospace"},"webFonts":["https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,400;0,6..12,600;0,6..12,700;1,6..12,400&display=swap","https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&display=swap"]},"content":{"heading":{"h1":"#00d1b2","h2":"#485fc7","h3":"#3e8ed0","h4":"#48c78e","h5":"#ffe08a","h6":"#f14668"},"body":{"primary":"#4a4a4a","secondary":"#6b6b6b"},"link":{"default":"#485fc7"},"selection":{"fg":"#363636","bg":"#b5d5ff"},"blockquote":{"border":"#dbdbdb","fg":"#4a4a4a","bg":"#f5f5f5"},"codeInline":{"fg":"#f14668","bg":"#f5f5f5"},"codeBlock":{"fg":"#363636","bg":"#f5f5f5"},"table":{"border":"#dbdbdb","stripe":"#fafafa","theadBg":"#f0f0f0","cellBg":"#ffffff","headerFg":"#363636"}},"spacing":{"xs":"0.25rem","sm":"0.5rem","md":"1rem","lg":"1.5rem","xl":"2rem"},"elevation":{"none":"none","sm":"0 1px 2px 0 rgba(0, 0, 0, 0.05)","md":"0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)","lg":"0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)","xl":"0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"},"animation":{"durationFast":"150ms","durationNormal":"300ms","durationSlow":"500ms","easingDefault":"cubic-bezier(0.4, 0, 0.2, 1)","easingEmphasized":"cubic-bezier(0.05, 0.7, 0.1, 1)"},"opacity":{"disabled":0.5,"hover":0.8,"pressed":0.6},"components":{"card":{"bg":"#ffffff","border":"#d5d5d5","headerBg":"#f5f5f5","footerBg":"#fafafa"},"message":{"bg":"#f8f9fa","headerBg":"#eef1f4","border":"#d5dbe1","bodyFg":"#4a4a4a"},"panel":{"bg":"#ffffff","headerBg":"#f0f0f0","headerFg":"#363636","border":"#d5d5d5","blockBg":"#fafafa","blockHoverBg":"#f5f5f5","blockActiveBg":"#eef6fc"},"box":{"bg":"#ffffff","border":"#e0e0e0"},"notification":{"bg":"#f5f5f5","border":"#e0e0e0"},"modal":{"bg":"rgba(10, 10, 10, 0.86)","cardBg":"#ffffff","headerBg":"#f5f5f5","footerBg":"#fafafa"},"dropdown":{"bg":"#ffffff","itemHoverBg":"#f5f5f5","border":"#dbdbdb"},"tabs":{"border":"#dbdbdb","linkBg":"#f5f5f5","linkActiveBg":"#ffffff","linkHoverBg":"#eeeeee"}}}},"catppuccin-frappe":{"id":"catppuccin-frappe","label":"Catppuccin Frappé","vendor":"catppuccin","appearance":"dark","tokens":{"background":{"base":"#303446","surface":"#292c3c","overlay":"#232634"},"text":{"primary":"#c6d0f5","secondary":"#a5adce","inverse":"#303446"},"brand":{"primary":"#8caaee"},"state":{"info":"#99d1db","success":"#a6d189","warning":"#e5c890","danger":"#e78284"},"border":{"default":"#737994"},"accent":{"link":"#8caaee"},"typography":{"fonts":{"sans":"Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, \\"Apple Color Emoji\\", \\"Segoe UI Emoji\\"","mono":"JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \\"Liberation Mono\\", \\"Courier New\\", monospace"},"webFonts":["https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap","https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap"]},"content":{"heading":{"h1":"#a6d189","h2":"#8caaee","h3":"#85c1dc","h4":"#e5c890","h5":"#ca9ee6","h6":"#e78284"},"body":{"primary":"#c6d0f5","secondary":"#a5adce"},"link":{"default":"#8caaee"},"selection":{"fg":"#c6d0f5","bg":"#838ba7"},"blockquote":{"border":"#838ba7","fg":"#c6d0f5","bg":"#292c3c"},"codeInline":{"fg":"#c6d0f5","bg":"#414559"},"codeBlock":{"fg":"#c6d0f5","bg":"#414559"},"table":{"border":"#838ba7","stripe":"#414559","theadBg":"#51576d"}}}},"catppuccin-latte":{"id":"catppuccin-latte","label":"Catppuccin Latte","vendor":"catppuccin","appearance":"light","tokens":{"background":{"base":"#eff1f5","surface":"#e6e9ef","overlay":"#dce0e8"},"text":{"primary":"#4c4f69","secondary":"#6c6f85","inverse":"#eff1f5"},"brand":{"primary":"#1e66f5"},"state":{"info":"#04a5e5","success":"#40a02b","warning":"#df8e1d","danger":"#d20f39"},"border":{"default":"#9ca0b0"},"accent":{"link":"#1e66f5"},"typography":{"fonts":{"sans":"Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, \\"Apple Color Emoji\\", \\"Segoe UI Emoji\\"","mono":"JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \\"Liberation Mono\\", \\"Courier New\\", monospace"},"webFonts":["https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap","https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap"]},"content":{"heading":{"h1":"#40a02b","h2":"#1e66f5","h3":"#209fb5","h4":"#df8e1d","h5":"#8839ef","h6":"#d20f39"},"body":{"primary":"#4c4f69","secondary":"#6c6f85"},"link":{"default":"#1e66f5"},"selection":{"fg":"#4c4f69","bg":"#8c8fa1"},"blockquote":{"border":"#8c8fa1","fg":"#4c4f69","bg":"#e6e9ef"},"codeInline":{"fg":"#4c4f69","bg":"#ccd0da"},"codeBlock":{"fg":"#4c4f69","bg":"#ccd0da"},"table":{"border":"#8c8fa1","stripe":"#ccd0da","theadBg":"#bcc0cc"}}}},"catppuccin-macchiato":{"id":"catppuccin-macchiato","label":"Catppuccin Macchiato","vendor":"catppuccin","appearance":"dark","tokens":{"background":{"base":"#24273a","surface":"#1e2030","overlay":"#181926"},"text":{"primary":"#cad3f5","secondary":"#a5adcb","inverse":"#24273a"},"brand":{"primary":"#8aadf4"},"state":{"info":"#91d7e3","success":"#a6da95","warning":"#eed49f","danger":"#ed8796"},"border":{"default":"#6e738d"},"accent":{"link":"#8aadf4"},"typography":{"fonts":{"sans":"Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, \\"Apple Color Emoji\\", \\"Segoe UI Emoji\\"","mono":"JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \\"Liberation Mono\\", \\"Courier New\\", monospace"},"webFonts":["https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap","https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap"]},"content":{"heading":{"h1":"#a6da95","h2":"#8aadf4","h3":"#7dc4e4","h4":"#eed49f","h5":"#c6a0f6","h6":"#ed8796"},"body":{"primary":"#cad3f5","secondary":"#a5adcb"},"link":{"default":"#8aadf4"},"selection":{"fg":"#cad3f5","bg":"#8087a2"},"blockquote":{"border":"#8087a2","fg":"#cad3f5","bg":"#1e2030"},"codeInline":{"fg":"#cad3f5","bg":"#363a4f"},"codeBlock":{"fg":"#cad3f5","bg":"#363a4f"},"table":{"border":"#8087a2","stripe":"#363a4f","theadBg":"#494d64"}}}},"catppuccin-mocha":{"id":"catppuccin-mocha","label":"Catppuccin Mocha","vendor":"catppuccin","appearance":"dark","tokens":{"background":{"base":"#1e1e2e","surface":"#181825","overlay":"#11111b"},"text":{"primary":"#cdd6f4","secondary":"#a6adc8","inverse":"#1e1e2e"},"brand":{"primary":"#89b4fa"},"state":{"info":"#89dceb","success":"#a6e3a1","warning":"#f9e2af","danger":"#f38ba8"},"border":{"default":"#6c7086"},"accent":{"link":"#89b4fa"},"typography":{"fonts":{"sans":"Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, \\"Apple Color Emoji\\", \\"Segoe UI Emoji\\"","mono":"JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \\"Liberation Mono\\", \\"Courier New\\", monospace"},"webFonts":["https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap","https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap"]},"content":{"heading":{"h1":"#a6e3a1","h2":"#89b4fa","h3":"#74c7ec","h4":"#f9e2af","h5":"#cba6f7","h6":"#f38ba8"},"body":{"primary":"#cdd6f4","secondary":"#a6adc8"},"link":{"default":"#89b4fa"},"selection":{"fg":"#cdd6f4","bg":"#7f849c"},"blockquote":{"border":"#7f849c","fg":"#cdd6f4","bg":"#181825"},"codeInline":{"fg":"#cdd6f4","bg":"#313244"},"codeBlock":{"fg":"#cdd6f4","bg":"#313244"},"table":{"border":"#7f849c","stripe":"#313244","theadBg":"#45475a"}}}},"dracula":{"id":"dracula","label":"Dracula","vendor":"dracula","appearance":"dark","tokens":{"background":{"base":"#282a36","surface":"#21222c","overlay":"#44475a"},"text":{"primary":"#f8f8f2","secondary":"#6272a4","inverse":"#282a36"},"brand":{"primary":"#bd93f9"},"state":{"info":"#8be9fd","success":"#50fa7b","warning":"#f1fa8c","danger":"#ff5555"},"border":{"default":"#44475a"},"accent":{"link":"#8be9fd"},"typography":{"fonts":{"sans":"ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \\"Segoe UI\\", Roboto, \\"Helvetica Neue\\", Arial, sans-serif","mono":"\\"Fira Code\\", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \\"Liberation Mono\\", \\"Courier New\\", monospace"},"webFonts":["https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600&display=swap"]},"content":{"heading":{"h1":"#ff79c6","h2":"#bd93f9","h3":"#8be9fd","h4":"#50fa7b","h5":"#ffb86c","h6":"#f1fa8c"},"body":{"primary":"#f8f8f2","secondary":"#6272a4"},"link":{"default":"#8be9fd"},"selection":{"fg":"#f8f8f2","bg":"#44475a"},"blockquote":{"border":"#bd93f9","fg":"#6272a4","bg":"#21222c"},"codeInline":{"fg":"#50fa7b","bg":"#21222c"},"codeBlock":{"fg":"#f8f8f2","bg":"#21222c"},"table":{"border":"#44475a","stripe":"#21222c","theadBg":"#44475a","cellBg":"#282a36","headerFg":"#f8f8f2"}},"spacing":{"xs":"0.25rem","sm":"0.5rem","md":"1rem","lg":"1.5rem","xl":"2rem"},"elevation":{"none":"none","sm":"0 1px 2px 0 rgba(0, 0, 0, 0.05)","md":"0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)","lg":"0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)","xl":"0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"},"animation":{"durationFast":"150ms","durationNormal":"300ms","durationSlow":"500ms","easingDefault":"cubic-bezier(0.4, 0, 0.2, 1)","easingEmphasized":"cubic-bezier(0.05, 0.7, 0.1, 1)"},"opacity":{"disabled":0.5,"hover":0.8,"pressed":0.6},"components":{"card":{"bg":"#21222c","border":"#6272a4","headerBg":"#282a36","footerBg":"#21222c"},"message":{"bg":"#282a36","headerBg":"#44475a","border":"#6272a4","bodyFg":"#f8f8f2"},"panel":{"bg":"#21222c","headerBg":"#44475a","headerFg":"#f8f8f2","border":"#6272a4","blockBg":"#282a36","blockHoverBg":"#2e303e","blockActiveBg":"#44475a"},"box":{"bg":"#21222c","border":"#6272a4"},"notification":{"bg":"#282a36","border":"#6272a4"},"modal":{"bg":"rgba(40, 42, 54, 0.9)","cardBg":"#21222c","headerBg":"#282a36","footerBg":"#21222c"},"dropdown":{"bg":"#21222c","itemHoverBg":"#2e303e","border":"#6272a4"},"tabs":{"border":"#6272a4","linkBg":"#2e303e","linkActiveBg":"#21222c","linkHoverBg":"#44475a"}}}},"github-dark":{"id":"github-dark","label":"GitHub Dark","vendor":"github","appearance":"dark","tokens":{"background":{"base":"#0d1117","surface":"#151b23","overlay":"#010409"},"text":{"primary":"#f0f6fc","secondary":"#9198a1","inverse":"#ffffff"},"brand":{"primary":"#1f6feb"},"state":{"info":"#4493f8","success":"#3fb950","warning":"#d29922","danger":"#f85149"},"border":{"default":"#3d444d"},"accent":{"link":"#4493f8"},"typography":{"fonts":{"sans":"\\"Mona Sans\\", -apple-system, BlinkMacSystemFont, \\"Segoe UI\\", \\"Noto Sans\\", Helvetica, Arial, sans-serif, \\"Apple Color Emoji\\", \\"Segoe UI Emoji\\"","mono":"\\"Hubot Sans\\", ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, \\"Liberation Mono\\", monospace"},"webFonts":["https://github.githubassets.com/assets/mona-sans-webfont.woff2","https://github.githubassets.com/assets/hubot-sans-webfont.woff2"]},"content":{"heading":{"h1":"#3fb950","h2":"#4493f8","h3":"#1f6feb","h4":"#d29922","h5":"#3fb950","h6":"#f85149"},"body":{"primary":"#f0f6fc","secondary":"#9198a1"},"link":{"default":"#4493f8"},"selection":{"fg":"#f0f6fc","bg":"#264f78"},"blockquote":{"border":"#3d444d","fg":"#9198a1","bg":"#151b23"},"codeInline":{"fg":"#f0f6fc","bg":"#151b23"},"codeBlock":{"fg":"#f0f6fc","bg":"#151b23"},"table":{"border":"#3d444d","stripe":"#151b23","theadBg":"#151b23"}}}},"github-light":{"id":"github-light","label":"GitHub Light","vendor":"github","appearance":"light","tokens":{"background":{"base":"#ffffff","surface":"#f6f8fa","overlay":"#f6f8fa"},"text":{"primary":"#1f2328","secondary":"#59636e","inverse":"#ffffff"},"brand":{"primary":"#0969da"},"state":{"info":"#0969da","success":"#1a7f37","warning":"#9a6700","danger":"#d1242f"},"border":{"default":"#d1d9e0"},"accent":{"link":"#0969da"},"typography":{"fonts":{"sans":"\\"Mona Sans\\", -apple-system, BlinkMacSystemFont, \\"Segoe UI\\", \\"Noto Sans\\", Helvetica, Arial, sans-serif, \\"Apple Color Emoji\\", \\"Segoe UI Emoji\\"","mono":"\\"Hubot Sans\\", ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, \\"Liberation Mono\\", monospace"},"webFonts":["https://github.githubassets.com/assets/mona-sans-webfont.woff2","https://github.githubassets.com/assets/hubot-sans-webfont.woff2"]},"content":{"heading":{"h1":"#1a7f37","h2":"#0969da","h3":"#0969da","h4":"#9a6700","h5":"#1a7f37","h6":"#d1242f"},"body":{"primary":"#1f2328","secondary":"#59636e"},"link":{"default":"#0969da"},"selection":{"fg":"#1f2328","bg":"#b6e3ff"},"blockquote":{"border":"#d1d9e0","fg":"#59636e","bg":"#f6f8fa"},"codeInline":{"fg":"#1f2328","bg":"#f6f8fa"},"codeBlock":{"fg":"#1f2328","bg":"#f6f8fa"},"table":{"border":"#d1d9e0","stripe":"#f6f8fa","theadBg":"#f6f8fa"}}}},"gruvbox-dark-hard":{"id":"gruvbox-dark-hard","label":"Gruvbox Dark Hard","vendor":"gruvbox","appearance":"dark","tokens":{"background":{"base":"#1d2021","surface":"#282828","overlay":"#3c3836"},"text":{"primary":"#ebdbb2","secondary":"#d5c4a1","inverse":"#1d2021"},"brand":{"primary":"#d79921"},"state":{"info":"#83a598","success":"#b8bb26","warning":"#fabd2f","danger":"#fb4934"},"border":{"default":"#665c54"},"accent":{"link":"#83a598"},"typography":{"fonts":{"sans":"Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, \\"Apple Color Emoji\\", \\"Segoe UI Emoji\\"","mono":"JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \\"Liberation Mono\\", \\"Courier New\\", monospace"},"webFonts":["https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap","https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap"]},"content":{"heading":{"h1":"#b8bb26","h2":"#83a598","h3":"#8ec07c","h4":"#fabd2f","h5":"#d3869b","h6":"#fb4934"},"body":{"primary":"#ebdbb2","secondary":"#d5c4a1"},"link":{"default":"#83a598"},"selection":{"fg":"#ebdbb2","bg":"#3c3836"},"blockquote":{"border":"#665c54","fg":"#d5c4a1","bg":"#282828"},"codeInline":{"fg":"#fe8019","bg":"#3c3836"},"codeBlock":{"fg":"#ebdbb2","bg":"#282828"},"table":{"border":"#665c54","stripe":"#3c3836","theadBg":"#282828"}},"components":{"card":{"bg":"#282828","border":"#665c54","headerBg":"#1d2021","footerBg":"#282828"},"message":{"bg":"#1d2021","headerBg":"#282828","border":"#665c54","bodyFg":"#ebdbb2"},"panel":{"bg":"#282828","headerBg":"#1d2021","headerFg":"#ebdbb2","border":"#665c54","blockBg":"#1d2021","blockHoverBg":"#282828","blockActiveBg":"#3c3836"},"box":{"bg":"#282828","border":"#665c54"},"notification":{"bg":"#1d2021","border":"#665c54"},"modal":{"bg":"rgba(29, 32, 33, 0.9)","cardBg":"#282828","headerBg":"#1d2021","footerBg":"#282828"},"dropdown":{"bg":"#282828","itemHoverBg":"#3c3836","border":"#665c54"},"tabs":{"border":"#665c54","linkBg":"#282828","linkActiveBg":"#1d2021","linkHoverBg":"#3c3836"}}}},"gruvbox-dark-soft":{"id":"gruvbox-dark-soft","label":"Gruvbox Dark Soft","vendor":"gruvbox","appearance":"dark","tokens":{"background":{"base":"#32302f","surface":"#3c3836","overlay":"#504945"},"text":{"primary":"#ebdbb2","secondary":"#d5c4a1","inverse":"#32302f"},"brand":{"primary":"#d79921"},"state":{"info":"#83a598","success":"#b8bb26","warning":"#fabd2f","danger":"#fb4934"},"border":{"default":"#665c54"},"accent":{"link":"#83a598"},"typography":{"fonts":{"sans":"Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, \\"Apple Color Emoji\\", \\"Segoe UI Emoji\\"","mono":"JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \\"Liberation Mono\\", \\"Courier New\\", monospace"},"webFonts":["https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap","https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap"]},"content":{"heading":{"h1":"#b8bb26","h2":"#83a598","h3":"#8ec07c","h4":"#fabd2f","h5":"#d3869b","h6":"#fb4934"},"body":{"primary":"#ebdbb2","secondary":"#d5c4a1"},"link":{"default":"#83a598"},"selection":{"fg":"#ebdbb2","bg":"#504945"},"blockquote":{"border":"#665c54","fg":"#d5c4a1","bg":"#3c3836"},"codeInline":{"fg":"#fe8019","bg":"#504945"},"codeBlock":{"fg":"#ebdbb2","bg":"#3c3836"},"table":{"border":"#665c54","stripe":"#504945","theadBg":"#3c3836"}},"components":{"card":{"bg":"#3c3836","border":"#665c54","headerBg":"#32302f","footerBg":"#3c3836"},"message":{"bg":"#32302f","headerBg":"#3c3836","border":"#665c54","bodyFg":"#ebdbb2"},"panel":{"bg":"#3c3836","headerBg":"#32302f","headerFg":"#ebdbb2","border":"#665c54","blockBg":"#32302f","blockHoverBg":"#3c3836","blockActiveBg":"#504945"},"box":{"bg":"#3c3836","border":"#665c54"},"notification":{"bg":"#32302f","border":"#665c54"},"modal":{"bg":"rgba(50, 48, 47, 0.9)","cardBg":"#3c3836","headerBg":"#32302f","footerBg":"#3c3836"},"dropdown":{"bg":"#3c3836","itemHoverBg":"#504945","border":"#665c54"},"tabs":{"border":"#665c54","linkBg":"#3c3836","linkActiveBg":"#32302f","linkHoverBg":"#504945"}}}},"gruvbox-dark":{"id":"gruvbox-dark","label":"Gruvbox Dark","vendor":"gruvbox","appearance":"dark","tokens":{"background":{"base":"#282828","surface":"#3c3836","overlay":"#504945"},"text":{"primary":"#ebdbb2","secondary":"#d5c4a1","inverse":"#282828"},"brand":{"primary":"#d79921"},"state":{"info":"#83a598","success":"#b8bb26","warning":"#fabd2f","danger":"#fb4934"},"border":{"default":"#665c54"},"accent":{"link":"#83a598"},"typography":{"fonts":{"sans":"Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, \\"Apple Color Emoji\\", \\"Segoe UI Emoji\\"","mono":"JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \\"Liberation Mono\\", \\"Courier New\\", monospace"},"webFonts":["https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap","https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap"]},"content":{"heading":{"h1":"#b8bb26","h2":"#83a598","h3":"#8ec07c","h4":"#fabd2f","h5":"#d3869b","h6":"#fb4934"},"body":{"primary":"#ebdbb2","secondary":"#d5c4a1"},"link":{"default":"#83a598"},"selection":{"fg":"#ebdbb2","bg":"#504945"},"blockquote":{"border":"#665c54","fg":"#d5c4a1","bg":"#3c3836"},"codeInline":{"fg":"#fe8019","bg":"#504945"},"codeBlock":{"fg":"#ebdbb2","bg":"#3c3836"},"table":{"border":"#665c54","stripe":"#504945","theadBg":"#3c3836"}},"components":{"card":{"bg":"#3c3836","border":"#665c54","headerBg":"#282828","footerBg":"#3c3836"},"message":{"bg":"#282828","headerBg":"#3c3836","border":"#665c54","bodyFg":"#ebdbb2"},"panel":{"bg":"#3c3836","headerBg":"#282828","headerFg":"#ebdbb2","border":"#665c54","blockBg":"#282828","blockHoverBg":"#3c3836","blockActiveBg":"#504945"},"box":{"bg":"#3c3836","border":"#665c54"},"notification":{"bg":"#282828","border":"#665c54"},"modal":{"bg":"rgba(40, 40, 40, 0.9)","cardBg":"#3c3836","headerBg":"#282828","footerBg":"#3c3836"},"dropdown":{"bg":"#3c3836","itemHoverBg":"#504945","border":"#665c54"},"tabs":{"border":"#665c54","linkBg":"#3c3836","linkActiveBg":"#282828","linkHoverBg":"#504945"}}}},"gruvbox-light-hard":{"id":"gruvbox-light-hard","label":"Gruvbox Light Hard","vendor":"gruvbox","appearance":"light","tokens":{"background":{"base":"#f9f5d7","surface":"#fbf1c7","overlay":"#ebdbb2"},"text":{"primary":"#3c3836","secondary":"#504945","inverse":"#f9f5d7"},"brand":{"primary":"#b57614"},"state":{"info":"#076678","success":"#79740e","warning":"#b57614","danger":"#9d0006"},"border":{"default":"#bdae93"},"accent":{"link":"#076678"},"typography":{"fonts":{"sans":"Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, \\"Apple Color Emoji\\", \\"Segoe UI Emoji\\"","mono":"JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \\"Liberation Mono\\", \\"Courier New\\", monospace"},"webFonts":["https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap","https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap"]},"content":{"heading":{"h1":"#79740e","h2":"#076678","h3":"#427b58","h4":"#b57614","h5":"#8f3f71","h6":"#9d0006"},"body":{"primary":"#3c3836","secondary":"#504945"},"link":{"default":"#076678"},"selection":{"fg":"#3c3836","bg":"#ebdbb2"},"blockquote":{"border":"#bdae93","fg":"#504945","bg":"#fbf1c7"},"codeInline":{"fg":"#af3a03","bg":"#ebdbb2"},"codeBlock":{"fg":"#3c3836","bg":"#fbf1c7"},"table":{"border":"#bdae93","stripe":"#ebdbb2","theadBg":"#fbf1c7"}},"components":{"card":{"bg":"#f9f5d7","border":"#bdae93","headerBg":"#fbf1c7","footerBg":"#fbf1c7"},"message":{"bg":"#fbf1c7","headerBg":"#f9f5d7","border":"#bdae93","bodyFg":"#3c3836"},"panel":{"bg":"#f9f5d7","headerBg":"#fbf1c7","headerFg":"#3c3836","border":"#bdae93","blockBg":"#fbf1c7","blockHoverBg":"#f9f5d7","blockActiveBg":"#ebdbb2"},"box":{"bg":"#f9f5d7","border":"#bdae93"},"notification":{"bg":"#fbf1c7","border":"#bdae93"},"modal":{"bg":"rgba(60, 56, 54, 0.86)","cardBg":"#f9f5d7","headerBg":"#fbf1c7","footerBg":"#fbf1c7"},"dropdown":{"bg":"#f9f5d7","itemHoverBg":"#fbf1c7","border":"#bdae93"},"tabs":{"border":"#bdae93","linkBg":"#fbf1c7","linkActiveBg":"#f9f5d7","linkHoverBg":"#ebdbb2"}}}},"gruvbox-light-soft":{"id":"gruvbox-light-soft","label":"Gruvbox Light Soft","vendor":"gruvbox","appearance":"light","tokens":{"background":{"base":"#f2e5bc","surface":"#ebdbb2","overlay":"#d5c4a1"},"text":{"primary":"#3c3836","secondary":"#504945","inverse":"#f2e5bc"},"brand":{"primary":"#b57614"},"state":{"info":"#076678","success":"#79740e","warning":"#b57614","danger":"#9d0006"},"border":{"default":"#bdae93"},"accent":{"link":"#076678"},"typography":{"fonts":{"sans":"Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, \\"Apple Color Emoji\\", \\"Segoe UI Emoji\\"","mono":"JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \\"Liberation Mono\\", \\"Courier New\\", monospace"},"webFonts":["https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap","https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap"]},"content":{"heading":{"h1":"#79740e","h2":"#076678","h3":"#427b58","h4":"#b57614","h5":"#8f3f71","h6":"#9d0006"},"body":{"primary":"#3c3836","secondary":"#504945"},"link":{"default":"#076678"},"selection":{"fg":"#3c3836","bg":"#d5c4a1"},"blockquote":{"border":"#bdae93","fg":"#504945","bg":"#ebdbb2"},"codeInline":{"fg":"#af3a03","bg":"#d5c4a1"},"codeBlock":{"fg":"#3c3836","bg":"#ebdbb2"},"table":{"border":"#bdae93","stripe":"#d5c4a1","theadBg":"#ebdbb2"}},"components":{"card":{"bg":"#f2e5bc","border":"#bdae93","headerBg":"#ebdbb2","footerBg":"#ebdbb2"},"message":{"bg":"#ebdbb2","headerBg":"#f2e5bc","border":"#bdae93","bodyFg":"#3c3836"},"panel":{"bg":"#f2e5bc","headerBg":"#ebdbb2","headerFg":"#3c3836","border":"#bdae93","blockBg":"#ebdbb2","blockHoverBg":"#f2e5bc","blockActiveBg":"#d5c4a1"},"box":{"bg":"#f2e5bc","border":"#bdae93"},"notification":{"bg":"#ebdbb2","border":"#bdae93"},"modal":{"bg":"rgba(60, 56, 54, 0.86)","cardBg":"#f2e5bc","headerBg":"#ebdbb2","footerBg":"#ebdbb2"},"dropdown":{"bg":"#f2e5bc","itemHoverBg":"#ebdbb2","border":"#bdae93"},"tabs":{"border":"#bdae93","linkBg":"#ebdbb2","linkActiveBg":"#f2e5bc","linkHoverBg":"#d5c4a1"}}}},"gruvbox-light":{"id":"gruvbox-light","label":"Gruvbox Light","vendor":"gruvbox","appearance":"light","tokens":{"background":{"base":"#fbf1c7","surface":"#ebdbb2","overlay":"#d5c4a1"},"text":{"primary":"#3c3836","secondary":"#504945","inverse":"#fbf1c7"},"brand":{"primary":"#b57614"},"state":{"info":"#076678","success":"#79740e","warning":"#b57614","danger":"#9d0006"},"border":{"default":"#bdae93"},"accent":{"link":"#076678"},"typography":{"fonts":{"sans":"Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, \\"Apple Color Emoji\\", \\"Segoe UI Emoji\\"","mono":"JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \\"Liberation Mono\\", \\"Courier New\\", monospace"},"webFonts":["https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap","https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap"]},"content":{"heading":{"h1":"#79740e","h2":"#076678","h3":"#427b58","h4":"#b57614","h5":"#8f3f71","h6":"#9d0006"},"body":{"primary":"#3c3836","secondary":"#504945"},"link":{"default":"#076678"},"selection":{"fg":"#3c3836","bg":"#d5c4a1"},"blockquote":{"border":"#bdae93","fg":"#504945","bg":"#ebdbb2"},"codeInline":{"fg":"#af3a03","bg":"#d5c4a1"},"codeBlock":{"fg":"#3c3836","bg":"#ebdbb2"},"table":{"border":"#bdae93","stripe":"#d5c4a1","theadBg":"#ebdbb2"}},"components":{"card":{"bg":"#fbf1c7","border":"#bdae93","headerBg":"#ebdbb2","footerBg":"#ebdbb2"},"message":{"bg":"#ebdbb2","headerBg":"#fbf1c7","border":"#bdae93","bodyFg":"#3c3836"},"panel":{"bg":"#fbf1c7","headerBg":"#ebdbb2","headerFg":"#3c3836","border":"#bdae93","blockBg":"#ebdbb2","blockHoverBg":"#fbf1c7","blockActiveBg":"#d5c4a1"},"box":{"bg":"#fbf1c7","border":"#bdae93"},"notification":{"bg":"#ebdbb2","border":"#bdae93"},"modal":{"bg":"rgba(60, 56, 54, 0.86)","cardBg":"#fbf1c7","headerBg":"#ebdbb2","footerBg":"#ebdbb2"},"dropdown":{"bg":"#fbf1c7","itemHoverBg":"#ebdbb2","border":"#bdae93"},"tabs":{"border":"#bdae93","linkBg":"#ebdbb2","linkActiveBg":"#fbf1c7","linkHoverBg":"#d5c4a1"}}}},"nord":{"id":"nord","label":"Nord","vendor":"nord","appearance":"dark","tokens":{"background":{"base":"#2e3440","surface":"#3b4252","overlay":"#434c5e"},"text":{"primary":"#eceff4","secondary":"#d8dee9","inverse":"#2e3440"},"brand":{"primary":"#88c0d0"},"state":{"info":"#5e81ac","success":"#a3be8c","warning":"#ebcb8b","danger":"#bf616a"},"border":{"default":"#4c566a"},"accent":{"link":"#88c0d0"},"typography":{"fonts":{"sans":"Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, \\"Apple Color Emoji\\", \\"Segoe UI Emoji\\"","mono":"JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \\"Liberation Mono\\", \\"Courier New\\", monospace"},"webFonts":["https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap","https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap"]},"content":{"heading":{"h1":"#8fbcbb","h2":"#88c0d0","h3":"#81a1c1","h4":"#ebcb8b","h5":"#d08770","h6":"#b48ead"},"body":{"primary":"#eceff4","secondary":"#d8dee9"},"link":{"default":"#88c0d0"},"selection":{"fg":"#eceff4","bg":"#4c566a"},"blockquote":{"border":"#4c566a","fg":"#d8dee9","bg":"#3b4252"},"codeInline":{"fg":"#eceff4","bg":"#434c5e"},"codeBlock":{"fg":"#eceff4","bg":"#434c5e"},"table":{"border":"#4c566a","stripe":"#434c5e","theadBg":"#3b4252"}}}},"rose-pine-dawn":{"id":"rose-pine-dawn","label":"Rosé Pine Dawn","vendor":"rose-pine","appearance":"light","tokens":{"background":{"base":"#faf4ed","surface":"#fffaf3","overlay":"#f2e9e1"},"text":{"primary":"#575279","secondary":"#797593","inverse":"#faf4ed"},"brand":{"primary":"#907aa9"},"state":{"info":"#56949f","success":"#286983","warning":"#ea9d34","danger":"#b4637a"},"border":{"default":"#dfdad9"},"accent":{"link":"#907aa9"},"typography":{"fonts":{"sans":"Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, \\"Apple Color Emoji\\", \\"Segoe UI Emoji\\"","mono":"JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \\"Liberation Mono\\", \\"Courier New\\", monospace"},"webFonts":["https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap","https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap"]},"content":{"heading":{"h1":"#286983","h2":"#907aa9","h3":"#56949f","h4":"#ea9d34","h5":"#d7827e","h6":"#b4637a"},"body":{"primary":"#575279","secondary":"#797593"},"link":{"default":"#907aa9"},"selection":{"fg":"#575279","bg":"#cecacd"},"blockquote":{"border":"#cecacd","fg":"#575279","bg":"#fffaf3"},"codeInline":{"fg":"#575279","bg":"#f2e9e1"},"codeBlock":{"fg":"#575279","bg":"#f2e9e1"},"table":{"border":"#cecacd","stripe":"#f2e9e1","theadBg":"#dfdad9"}}}},"rose-pine-moon":{"id":"rose-pine-moon","label":"Rosé Pine Moon","vendor":"rose-pine","appearance":"dark","tokens":{"background":{"base":"#232136","surface":"#2a273f","overlay":"#393552"},"text":{"primary":"#e0def4","secondary":"#908caa","inverse":"#232136"},"brand":{"primary":"#c4a7e7"},"state":{"info":"#9ccfd8","success":"#3e8fb0","warning":"#f6c177","danger":"#eb6f92"},"border":{"default":"#44415a"},"accent":{"link":"#c4a7e7"},"typography":{"fonts":{"sans":"Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, \\"Apple Color Emoji\\", \\"Segoe UI Emoji\\"","mono":"JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \\"Liberation Mono\\", \\"Courier New\\", monospace"},"webFonts":["https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap","https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap"]},"content":{"heading":{"h1":"#3e8fb0","h2":"#c4a7e7","h3":"#9ccfd8","h4":"#f6c177","h5":"#ea9a97","h6":"#eb6f92"},"body":{"primary":"#e0def4","secondary":"#908caa"},"link":{"default":"#c4a7e7"},"selection":{"fg":"#e0def4","bg":"#56526e"},"blockquote":{"border":"#56526e","fg":"#e0def4","bg":"#2a273f"},"codeInline":{"fg":"#e0def4","bg":"#393552"},"codeBlock":{"fg":"#e0def4","bg":"#393552"},"table":{"border":"#56526e","stripe":"#393552","theadBg":"#44415a"}}}},"rose-pine":{"id":"rose-pine","label":"Rosé Pine","vendor":"rose-pine","appearance":"dark","tokens":{"background":{"base":"#191724","surface":"#1f1d2e","overlay":"#26233a"},"text":{"primary":"#e0def4","secondary":"#908caa","inverse":"#191724"},"brand":{"primary":"#c4a7e7"},"state":{"info":"#9ccfd8","success":"#31748f","warning":"#f6c177","danger":"#eb6f92"},"border":{"default":"#403d52"},"accent":{"link":"#c4a7e7"},"typography":{"fonts":{"sans":"Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, \\"Apple Color Emoji\\", \\"Segoe UI Emoji\\"","mono":"JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \\"Liberation Mono\\", \\"Courier New\\", monospace"},"webFonts":["https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap","https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap"]},"content":{"heading":{"h1":"#31748f","h2":"#c4a7e7","h3":"#9ccfd8","h4":"#f6c177","h5":"#ebbcba","h6":"#eb6f92"},"body":{"primary":"#e0def4","secondary":"#908caa"},"link":{"default":"#c4a7e7"},"selection":{"fg":"#e0def4","bg":"#524f67"},"blockquote":{"border":"#524f67","fg":"#e0def4","bg":"#1f1d2e"},"codeInline":{"fg":"#e0def4","bg":"#26233a"},"codeBlock":{"fg":"#e0def4","bg":"#26233a"},"table":{"border":"#524f67","stripe":"#26233a","theadBg":"#403d52"}}}},"solarized-dark":{"id":"solarized-dark","label":"Solarized Dark","vendor":"solarized","appearance":"dark","tokens":{"background":{"base":"#002b36","surface":"#073642","overlay":"#586e75"},"text":{"primary":"#839496","secondary":"#657b83","inverse":"#002b36"},"brand":{"primary":"#268bd2"},"state":{"info":"#2aa198","success":"#859900","warning":"#b58900","danger":"#dc322f"},"border":{"default":"#586e75"},"accent":{"link":"#268bd2"},"typography":{"fonts":{"sans":"Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, \\"Apple Color Emoji\\", \\"Segoe UI Emoji\\"","mono":"JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \\"Liberation Mono\\", \\"Courier New\\", monospace"},"webFonts":["https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap","https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap"]},"content":{"heading":{"h1":"#268bd2","h2":"#2aa198","h3":"#859900","h4":"#b58900","h5":"#cb4b16","h6":"#d33682"},"body":{"primary":"#839496","secondary":"#657b83"},"link":{"default":"#268bd2"},"selection":{"fg":"#fdf6e3","bg":"#586e75"},"blockquote":{"border":"#657b83","fg":"#839496","bg":"#073642"},"codeInline":{"fg":"#2aa198","bg":"#073642"},"codeBlock":{"fg":"#93a1a1","bg":"#073642"},"table":{"border":"#586e75","stripe":"#073642","theadBg":"#586e75"}},"components":{"card":{"bg":"#073642","border":"#586e75","headerBg":"#002b36","footerBg":"#073642"},"message":{"bg":"#002b36","headerBg":"#073642","border":"#586e75","bodyFg":"#839496"},"panel":{"bg":"#073642","headerBg":"#002b36","headerFg":"#93a1a1","border":"#586e75","blockBg":"#002b36","blockHoverBg":"#073642","blockActiveBg":"#586e75"},"box":{"bg":"#073642","border":"#586e75"},"notification":{"bg":"#002b36","border":"#586e75"},"modal":{"bg":"rgba(0, 43, 54, 0.9)","cardBg":"#073642","headerBg":"#002b36","footerBg":"#073642"},"dropdown":{"bg":"#073642","itemHoverBg":"#586e75","border":"#586e75"},"tabs":{"border":"#586e75","linkBg":"#073642","linkActiveBg":"#002b36","linkHoverBg":"#586e75"}}}},"solarized-light":{"id":"solarized-light","label":"Solarized Light","vendor":"solarized","appearance":"light","tokens":{"background":{"base":"#fdf6e3","surface":"#eee8d5","overlay":"#93a1a1"},"text":{"primary":"#586e75","secondary":"#657b83","inverse":"#fdf6e3"},"brand":{"primary":"#268bd2"},"state":{"info":"#2aa198","success":"#859900","warning":"#b58900","danger":"#dc322f"},"border":{"default":"#93a1a1"},"accent":{"link":"#268bd2"},"typography":{"fonts":{"sans":"Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, \\"Apple Color Emoji\\", \\"Segoe UI Emoji\\"","mono":"JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \\"Liberation Mono\\", \\"Courier New\\", monospace"},"webFonts":["https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap","https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap"]},"content":{"heading":{"h1":"#268bd2","h2":"#2aa198","h3":"#859900","h4":"#b58900","h5":"#cb4b16","h6":"#d33682"},"body":{"primary":"#586e75","secondary":"#657b83"},"link":{"default":"#268bd2"},"selection":{"fg":"#002b36","bg":"#93a1a1"},"blockquote":{"border":"#93a1a1","fg":"#657b83","bg":"#eee8d5"},"codeInline":{"fg":"#6c71c4","bg":"#eee8d5"},"codeBlock":{"fg":"#073642","bg":"#eee8d5"},"table":{"border":"#93a1a1","stripe":"#eee8d5","theadBg":"#eee8d5"}},"components":{"card":{"bg":"#fdf6e3","border":"#93a1a1","headerBg":"#eee8d5","footerBg":"#eee8d5"},"message":{"bg":"#eee8d5","headerBg":"#fdf6e3","border":"#93a1a1","bodyFg":"#586e75"},"panel":{"bg":"#fdf6e3","headerBg":"#eee8d5","headerFg":"#073642","border":"#93a1a1","blockBg":"#eee8d5","blockHoverBg":"#fdf6e3","blockActiveBg":"#93a1a1"},"box":{"bg":"#fdf6e3","border":"#93a1a1"},"notification":{"bg":"#eee8d5","border":"#93a1a1"},"modal":{"bg":"rgba(0, 43, 54, 0.86)","cardBg":"#fdf6e3","headerBg":"#eee8d5","footerBg":"#eee8d5"},"dropdown":{"bg":"#fdf6e3","itemHoverBg":"#eee8d5","border":"#93a1a1"},"tabs":{"border":"#93a1a1","linkBg":"#eee8d5","linkActiveBg":"#fdf6e3","linkHoverBg":"#93a1a1"}}}},"tokyo-night-dark":{"id":"tokyo-night-dark","label":"Tokyo Night Dark","vendor":"tokyo-night","appearance":"dark","tokens":{"background":{"base":"#1a1b26","surface":"#24283b","overlay":"#28344a"},"text":{"primary":"#c0caf5","secondary":"#a9b1d6","inverse":"#1a1b26"},"brand":{"primary":"#7aa2f7"},"state":{"info":"#7dcfff","success":"#9ece6a","warning":"#e0af68","danger":"#f7768e"},"border":{"default":"#565f89"},"accent":{"link":"#7aa2f7"},"typography":{"fonts":{"sans":"Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, \\"Apple Color Emoji\\", \\"Segoe UI Emoji\\"","mono":"JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \\"Liberation Mono\\", \\"Courier New\\", monospace"},"webFonts":["https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap","https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap"]},"content":{"heading":{"h1":"#7aa2f7","h2":"#bb9af7","h3":"#7dcfff","h4":"#e0af68","h5":"#ff9e64","h6":"#f7768e"},"body":{"primary":"#c0caf5","secondary":"#a9b1d6"},"link":{"default":"#7aa2f7"},"selection":{"fg":"#c0caf5","bg":"#28344a"},"blockquote":{"border":"#565f89","fg":"#a9b1d6","bg":"#24283b"},"codeInline":{"fg":"#c0caf5","bg":"#28344a"},"codeBlock":{"fg":"#c0caf5","bg":"#28344a"},"table":{"border":"#565f89","stripe":"#24283b","theadBg":"#28344a"}}}},"tokyo-night-light":{"id":"tokyo-night-light","label":"Tokyo Night Light","vendor":"tokyo-night","appearance":"light","tokens":{"background":{"base":"#e6e7ed","surface":"#d5d6dc","overlay":"#c8d3f5"},"text":{"primary":"#343b58","secondary":"#40434f","inverse":"#e6e7ed"},"brand":{"primary":"#2e7de9"},"state":{"info":"#0089a5","success":"#2f866c","warning":"#8c6c3e","danger":"#d81159"},"border":{"default":"#b0b4ca"},"accent":{"link":"#2e7de9"},"typography":{"fonts":{"sans":"Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, \\"Apple Color Emoji\\", \\"Segoe UI Emoji\\"","mono":"JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \\"Liberation Mono\\", \\"Courier New\\", monospace"},"webFonts":["https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap","https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap"]},"content":{"heading":{"h1":"#2e7de9","h2":"#7847bd","h3":"#0089a5","h4":"#8c6c3e","h5":"#f1784b","h6":"#d81159"},"body":{"primary":"#343b58","secondary":"#40434f"},"link":{"default":"#2e7de9"},"selection":{"fg":"#343b58","bg":"#c8d3f5"},"blockquote":{"border":"#b0b4ca","fg":"#40434f","bg":"#e6e7ed"},"codeInline":{"fg":"#343b58","bg":"#c8d3f5"},"codeBlock":{"fg":"#343b58","bg":"#c8d3f5"},"table":{"border":"#b0b4ca","stripe":"#e6e7ed","theadBg":"#c8d3f5"}}}},"tokyo-night-storm":{"id":"tokyo-night-storm","label":"Tokyo Night Storm","vendor":"tokyo-night","appearance":"dark","tokens":{"background":{"base":"#24283b","surface":"#28344a","overlay":"#565f89"},"text":{"primary":"#c0caf5","secondary":"#a9b1d6","inverse":"#24283b"},"brand":{"primary":"#7aa2f7"},"state":{"info":"#7dcfff","success":"#9ece6a","warning":"#e0af68","danger":"#f7768e"},"border":{"default":"#565f89"},"accent":{"link":"#7aa2f7"},"typography":{"fonts":{"sans":"Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, \\"Apple Color Emoji\\", \\"Segoe UI Emoji\\"","mono":"JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \\"Liberation Mono\\", \\"Courier New\\", monospace"},"webFonts":["https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap","https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap"]},"content":{"heading":{"h1":"#7aa2f7","h2":"#bb9af7","h3":"#7dcfff","h4":"#e0af68","h5":"#ff9e64","h6":"#f7768e"},"body":{"primary":"#c0caf5","secondary":"#a9b1d6"},"link":{"default":"#7aa2f7"},"selection":{"fg":"#c0caf5","bg":"#28344a"},"blockquote":{"border":"#565f89","fg":"#a9b1d6","bg":"#28344a"},"codeInline":{"fg":"#c0caf5","bg":"#28344a"},"codeBlock":{"fg":"#c0caf5","bg":"#28344a"},"table":{"border":"#565f89","stripe":"#28344a","theadBg":"#28344a"}}}}}');
  const byVendor = { "bulma": { "name": "Bulma", "homepage": "https://bulma.io/", "themes": ["bulma-dark", "bulma-light"] }, "catppuccin": { "name": "Catppuccin (synced)", "homepage": "https://catppuccin.com/palette/", "themes": ["catppuccin-frappe", "catppuccin-latte", "catppuccin-macchiato", "catppuccin-mocha"] }, "dracula": { "name": "Dracula", "homepage": "https://draculatheme.com/", "themes": ["dracula"] }, "github": { "name": "GitHub (synced)", "homepage": "https://primer.style/", "themes": ["github-dark", "github-light"] }, "gruvbox": { "name": "Gruvbox", "homepage": "https://github.com/morhetz/gruvbox", "themes": ["gruvbox-dark-hard", "gruvbox-dark-soft", "gruvbox-dark", "gruvbox-light-hard", "gruvbox-light-soft", "gruvbox-light"] }, "nord": { "name": "Nord", "homepage": "https://www.nordtheme.com/", "themes": ["nord"] }, "rose-pine": { "name": "Rosé Pine (synced)", "homepage": "https://rosepinetheme.com/", "themes": ["rose-pine-dawn", "rose-pine-moon", "rose-pine"] }, "solarized": { "name": "Solarized", "homepage": "https://ethanschoonover.com/solarized/", "themes": ["solarized-dark", "solarized-light"] }, "tokyo-night": { "name": "Tokyo Night", "homepage": "https://github.com/enkia/tokyo-night-vscode-theme", "themes": ["tokyo-night-dark", "tokyo-night-light", "tokyo-night-storm"] } };
  const tokensData = {
    themes,
    byVendor
  };
  const tokens = tokensData;
  const flavors = Object.values(tokens.themes).map((theme) => ({
    id: theme.id,
    label: theme.label,
    vendor: theme.vendor,
    appearance: theme.appearance,
    ...theme.iconUrl !== void 0 && { iconUrl: theme.iconUrl },
    tokens: theme.tokens
  }));
  const themesById = /* @__PURE__ */ Object.fromEntries(flavors.map((flavor) => [flavor.id, flavor]));
  /* @__PURE__ */ Object.fromEntries(Object.entries(tokens.byVendor).map(([vendorId, vendor]) => [
    vendorId,
    {
      id: vendorId,
      name: vendor.name,
      homepage: vendor.homepage,
      flavors: vendor.themes.map((themeId) => themesById[themeId]).filter(Boolean)
    }
  ]));
  [...new Set(flavors.map((f) => f.vendor))];
  const VENDOR_FAMILY_MAP = {
    bulma: "bulma",
    catppuccin: "catppuccin",
    dracula: "dracula",
    gruvbox: "gruvbox",
    github: "github",
    nord: "nord",
    "rose-pine": "rose-pine",
    solarized: "solarized",
    "tokyo-night": "tokyo-night"
  };
  const DEFAULT_FAMILY = "bulma";
  const VENDOR_ICON_MAP = {
    bulma: "assets/img/turbo-themes-logo.png",
    catppuccin: {
      light: "assets/img/catppuccin-logo-latte.png",
      dark: "assets/img/catppuccin-logo-macchiato.png"
    },
    dracula: "assets/img/dracula-logo.png",
    gruvbox: {
      light: "assets/img/gruvbox-light.png",
      dark: "assets/img/gruvbox-dark.png"
    },
    github: {
      light: "assets/img/github-logo-light.png",
      dark: "assets/img/github-logo-dark.png"
    },
    nord: "assets/img/nord.png",
    "rose-pine": {
      light: "assets/img/rose-pine-dawn.png",
      dark: "assets/img/rose-pine.png"
    },
    solarized: {
      light: "assets/img/solarized-light.png",
      dark: "assets/img/solarized-dark.png"
    },
    "tokyo-night": "assets/img/tokyo-night.png"
  };
  const FLAVOR_DESCRIPTIONS = {
    "bulma-light": "Classic Bulma look with a bright, neutral palette.",
    "bulma-dark": "Dark Bulma theme tuned for low-light reading.",
    "catppuccin-latte": "Light, soft Catppuccin palette for daytime use.",
    "catppuccin-frappe": "Balanced dark Catppuccin theme for focused work.",
    "catppuccin-macchiato": "Deep, atmospheric Catppuccin variant with rich contrast.",
    "catppuccin-mocha": "Cozy, high-contrast Catppuccin theme for late-night sessions.",
    dracula: "Iconic Dracula dark theme with vibrant accents.",
    "gruvbox-dark-hard": "Highest contrast dark Gruvbox palette with deep shadows.",
    "gruvbox-dark": "Classic Gruvbox dark palette with warm, muted tones.",
    "gruvbox-dark-soft": "Softer dark Gruvbox palette with reduced contrast.",
    "gruvbox-light-hard": "Bright, crisp Gruvbox light palette with extra contrast.",
    "gruvbox-light": "Classic Gruvbox light palette with warm paper tones.",
    "gruvbox-light-soft": "Soft, low-contrast Gruvbox light palette for long sessions.",
    "github-light": "GitHub-inspired light theme suited for documentation and UI heavy pages.",
    "github-dark": "GitHub dark theme optimized for code-heavy views.",
    nord: "Arctic, north-bluish color palette inspired by the polar night.",
    "rose-pine": "Elegant dark theme with natural pine and soho vibes.",
    "rose-pine-moon": "Deeper variant of Rosé Pine with enhanced contrast.",
    "rose-pine-dawn": "Light Rosé Pine variant for daytime use.",
    "solarized-dark": "Solarized Dark with a balanced, low-contrast palette.",
    "solarized-light": "Solarized Light tuned for bright, daylight-friendly UIs.",
    "tokyo-night-dark": "Deep midnight blues with neon accents.",
    "tokyo-night-storm": "Stormy variant with richer contrast and depth.",
    "tokyo-night-light": "Clean daylight palette inspired by Tokyo mornings."
  };
  function getFamily(vendor) {
    return VENDOR_FAMILY_MAP[vendor] ?? DEFAULT_FAMILY;
  }
  function getIconForVendor(vendor, appearance) {
    const iconConfig = VENDOR_ICON_MAP[vendor];
    if (!iconConfig) {
      return void 0;
    }
    if (typeof iconConfig === "string") {
      return iconConfig;
    }
    return iconConfig[appearance];
  }
  function getDescriptionForFlavor(id, label) {
    return FLAVOR_DESCRIPTIONS[id] ?? `${label} theme`;
  }
  function extractPreviewColors(tokens2) {
    return {
      bg: tokens2.background.base,
      surface: tokens2.background.surface,
      accent: tokens2.brand.primary,
      text: tokens2.text.primary
    };
  }
  function mapFlavorToUI(flavor) {
    const family = getFamily(flavor.vendor);
    return {
      id: flavor.id,
      name: flavor.label,
      description: getDescriptionForFlavor(flavor.id, flavor.label),
      cssFile: `packages/css/dist/themes/${flavor.id}.css`,
      icon: getIconForVendor(flavor.vendor, flavor.appearance),
      family,
      vendor: flavor.vendor,
      appearance: flavor.appearance,
      colors: extractPreviewColors(flavor.tokens)
    };
  }
  let mappedThemes = null;
  let validThemeIds = null;
  function getThemes() {
    if (!mappedThemes) {
      mappedThemes = flavors.map(mapFlavorToUI);
    }
    return mappedThemes || [];
  }
  function getValidThemeIds() {
    if (!validThemeIds) {
      validThemeIds = new Set(flavors.map((f) => f.id));
    }
    return validThemeIds;
  }
  function resolveTheme(themeId) {
    const themes2 = getThemes();
    return themes2.find((t) => t.id === themeId) || themes2.find((t) => t.id === DEFAULT_THEME) || themes2[0];
  }
  async function applyTheme(doc, themeId) {
    const theme = resolveTheme(themeId);
    if (!theme) {
      logThemeError(ThemeErrors.NO_THEMES_AVAILABLE());
      return;
    }
    const baseUrl = getBaseUrl(doc);
    const trigger = doc.getElementById(DOM_IDS.THEME_FLAVOR_TRIGGER);
    if (trigger) {
      trigger.classList.add("is-loading");
    }
    try {
      applyThemeClass(doc, theme.id);
      await loadThemeCSS(doc, theme, baseUrl);
      const triggerIcon = doc.getElementById(
        DOM_IDS.THEME_FLAVOR_TRIGGER_ICON
      );
      if (triggerIcon && theme.icon) {
        try {
          triggerIcon.src = resolveAssetPath(theme.icon, baseUrl);
          const familyMeta = THEME_FAMILIES[theme.family];
          const familyName = familyMeta?.name ?? theme.family;
          triggerIcon.alt = `${familyName} ${theme.name}`;
          triggerIcon.title = `${familyName} ${theme.name}`;
        } catch {
          logThemeError(ThemeErrors.INVALID_ICON_PATH(theme.id));
        }
      }
      const triggerLabel = doc.getElementById(
        DOM_IDS.THEME_FLAVOR_TRIGGER_LABEL
      );
      if (triggerLabel) {
        triggerLabel.textContent = theme.name;
      }
      doc.querySelectorAll(DOM_SELECTORS.DROPDOWN_ITEMS).forEach((item) => {
        setItemActiveState(item, item.getAttribute("data-theme-id") === theme.id);
      });
    } finally {
      if (trigger) {
        trigger.classList.remove("is-loading");
      }
    }
  }
  function getCurrentTheme(doc, defaultTheme) {
    return getCurrentThemeFromClasses(doc.documentElement) || defaultTheme;
  }
  function createDropdownStateManager(elements, state) {
    const { trigger, dropdown } = elements;
    const updateAriaExpanded = (expanded) => {
      trigger.setAttribute("aria-expanded", String(expanded));
    };
    const focusMenuItem = (index) => {
      if (index < 0 || index >= state.menuItems.length) return;
      const item = state.menuItems[index];
      setTabindexBatch(state.menuItems, "-1");
      item.setAttribute("tabindex", "0");
      item.focus();
      state.currentIndex = index;
    };
    const closeDropdown = (options = {}) => {
      const { restoreFocus = true } = options;
      dropdown.classList.remove("is-active");
      updateAriaExpanded(false);
      setTabindexBatch(state.menuItems, "-1");
      state.currentIndex = -1;
      if (restoreFocus) {
        trigger.focus();
      }
    };
    const toggleDropdown = (focusFirst = false) => {
      const isActive = dropdown.classList.toggle("is-active");
      updateAriaExpanded(isActive);
      if (!isActive) {
        state.currentIndex = -1;
        setTabindexBatch(state.menuItems, "-1");
        for (const menuItem of state.menuItems) {
          const isActiveItem = menuItem.classList.contains("is-active");
          setItemActiveState(menuItem, isActiveItem);
        }
      } else if (focusFirst && state.menuItems.length > 0) {
        focusMenuItem(0);
      }
    };
    return { updateAriaExpanded, focusMenuItem, closeDropdown, toggleDropdown };
  }
  function getNextIndex(currentIndex, totalItems) {
    return currentIndex < totalItems - 1 ? currentIndex + 1 : 0;
  }
  function getPrevIndex(currentIndex, totalItems) {
    return currentIndex > 0 ? currentIndex - 1 : totalItems - 1;
  }
  function handleTriggerKeydown(e, dropdown, state, stateManager) {
    const { focusMenuItem, toggleDropdown, updateAriaExpanded } = stateManager;
    const totalItems = state.menuItems.length;
    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        toggleDropdown(!dropdown.classList.contains("is-active"));
        break;
      case "ArrowDown":
        e.preventDefault();
        if (!dropdown.classList.contains("is-active")) {
          dropdown.classList.add("is-active");
          updateAriaExpanded(true);
          focusMenuItem(0);
        } else {
          const nextIndex = state.currentIndex < 0 ? 0 : getNextIndex(state.currentIndex, totalItems);
          focusMenuItem(nextIndex);
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (!dropdown.classList.contains("is-active")) {
          dropdown.classList.add("is-active");
          updateAriaExpanded(true);
          focusMenuItem(totalItems - 1);
        } else {
          const startIndex = state.currentIndex < 0 ? totalItems - 1 : state.currentIndex;
          focusMenuItem(getPrevIndex(startIndex, totalItems));
        }
        break;
    }
  }
  function handleMenuItemKeydown(e, index, item, state, stateManager) {
    const { focusMenuItem, closeDropdown } = stateManager;
    const totalItems = state.menuItems.length;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        focusMenuItem(getNextIndex(index, totalItems));
        break;
      case "ArrowUp":
        e.preventDefault();
        focusMenuItem(getPrevIndex(index, totalItems));
        break;
      case "Escape":
        e.preventDefault();
        closeDropdown();
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        item.click();
        break;
      case "Home":
        e.preventDefault();
        focusMenuItem(0);
        break;
      case "End":
        e.preventDefault();
        focusMenuItem(totalItems - 1);
        break;
    }
  }
  function wireDropdownEventHandlers(documentObj, elements, state, stateManager, abortController) {
    const { trigger, dropdown } = elements;
    const { closeDropdown, toggleDropdown } = stateManager;
    const signal = abortController.signal;
    trigger.addEventListener(
      "click",
      (e) => {
        e.preventDefault();
        toggleDropdown();
      },
      { signal }
    );
    documentObj.addEventListener(
      "click",
      (e) => {
        if (!dropdown.contains(e.target)) {
          closeDropdown({ restoreFocus: false });
        }
      },
      { signal }
    );
    documentObj.addEventListener(
      "keydown",
      (e) => {
        if (e.key === "Escape" && dropdown.classList.contains("is-active")) {
          closeDropdown({ restoreFocus: true });
        }
      },
      { signal }
    );
    trigger.addEventListener(
      "keydown",
      (e) => handleTriggerKeydown(e, dropdown, state, stateManager),
      { signal }
    );
    for (const [index, item] of state.menuItems.entries()) {
      item.addEventListener(
        "keydown",
        (e) => handleMenuItemKeydown(e, index, item, state, stateManager),
        { signal }
      );
    }
  }
  function createCheckmarkIcon(doc) {
    const svg = doc.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "16");
    svg.setAttribute("height", "16");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "3");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    const polyline = doc.createElementNS("http://www.w3.org/2000/svg", "polyline");
    polyline.setAttribute("points", "20 6 9 17 4 12");
    svg.appendChild(polyline);
    return svg;
  }
  function createThemeItemElement(ctx, theme, familyMeta) {
    const { documentObj, baseUrl, currentThemeId, selectEl, closeDropdown, onThemeSelect } = ctx;
    const item = documentObj.createElement("button");
    item.type = "button";
    item.className = "dropdown-item theme-item";
    item.setAttribute("data-theme-id", theme.id);
    item.setAttribute("data-appearance", theme.appearance);
    item.setAttribute("role", "menuitemradio");
    item.setAttribute(
      "aria-label",
      `${familyMeta.name} ${theme.name} (${theme.appearance}). ${theme.description}`
    );
    item.setAttribute("tabindex", "-1");
    const isActive = theme.id === currentThemeId;
    setItemActiveState(item, isActive);
    if (theme.icon) {
      const icon = documentObj.createElement("img");
      icon.className = "theme-icon";
      icon.src = baseUrl ? `${baseUrl}/${theme.icon}` : theme.icon;
      icon.alt = `${familyMeta.name} ${theme.name}`;
      icon.width = 24;
      icon.height = 24;
      item.appendChild(icon);
    } else {
      const placeholder = documentObj.createElement("span");
      placeholder.className = "theme-icon theme-icon-placeholder";
      placeholder.setAttribute("aria-hidden", "true");
      item.appendChild(placeholder);
    }
    const copy = documentObj.createElement("div");
    copy.className = "theme-copy";
    const titleEl = documentObj.createElement("span");
    titleEl.className = "theme-title";
    titleEl.textContent = `${familyMeta.name} · ${theme.name}`;
    copy.appendChild(titleEl);
    const descriptionEl = documentObj.createElement("span");
    descriptionEl.className = "theme-description";
    descriptionEl.textContent = theme.description;
    copy.appendChild(descriptionEl);
    item.appendChild(copy);
    const check = documentObj.createElement("span");
    check.className = "theme-check";
    check.appendChild(createCheckmarkIcon(documentObj));
    item.appendChild(check);
    item.addEventListener("click", (e) => {
      e.preventDefault();
      onThemeSelect(theme.id);
      if (selectEl) {
        selectEl.value = theme.id;
        selectEl.dispatchEvent(new Event("change", { bubbles: true }));
      }
      closeDropdown({ restoreFocus: true });
    });
    return item;
  }
  function createFamilyGroup(ctx, familyKey, themes2, familyMeta, animationDelay) {
    const { documentObj } = ctx;
    if (themes2.length === 0) return null;
    const items = [];
    const group = documentObj.createElement("div");
    group.className = "theme-family-group";
    group.setAttribute("role", "group");
    group.setAttribute("aria-labelledby", `theme-family-${familyKey}`);
    if (group.style && typeof group.style.setProperty === "function") {
      group.style.setProperty("--animation-delay", `${animationDelay}ms`);
    }
    const header = documentObj.createElement("div");
    header.className = "theme-family-header";
    header.id = `theme-family-${familyKey}`;
    const headerTitle = documentObj.createElement("span");
    headerTitle.className = "theme-family-name";
    headerTitle.textContent = familyMeta.name;
    header.appendChild(headerTitle);
    group.appendChild(header);
    const themesContainer = documentObj.createElement("div");
    themesContainer.className = "theme-family-items";
    themes2.forEach((theme) => {
      const item = createThemeItemElement(ctx, theme, familyMeta);
      items.push(item);
      themesContainer.appendChild(item);
    });
    group.appendChild(themesContainer);
    return { group, items };
  }
  function populateDropdownMenu(ctx, dropdownMenu, themes2, themeFamilies) {
    const families = Object.keys(themeFamilies);
    let animationDelay = 0;
    families.forEach((familyKey) => {
      const familyThemes = themes2.filter((t) => t.family === familyKey);
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
  function wireNativeSelect(ctx, selectEl, themes2, defaultTheme) {
    const { documentObj, onThemeSelect } = ctx;
    while (selectEl.firstChild) {
      selectEl.removeChild(selectEl.firstChild);
    }
    themes2.forEach((theme) => {
      const option = documentObj.createElement("option");
      option.value = theme.id;
      option.textContent = theme.name;
      option.selected = theme.id === ctx.currentThemeId;
      selectEl.appendChild(option);
    });
    selectEl.disabled = false;
    selectEl.addEventListener("change", (event) => {
      const target = event.target;
      const selectedThemeId = target?.value || defaultTheme;
      onThemeSelect(selectedThemeId);
    });
  }
  function getDropdownElements(documentObj) {
    const dropdownMenu = documentObj.getElementById(DOM_IDS.THEME_FLAVOR_MENU);
    const trigger = documentObj.getElementById(
      DOM_IDS.THEME_FLAVOR_TRIGGER
    );
    const dropdown = trigger?.closest(DOM_SELECTORS.NAVBAR_DROPDOWN);
    const selectEl = documentObj.getElementById(
      DOM_IDS.THEME_FLAVOR_SELECT
    );
    if (!dropdownMenu || !trigger || !dropdown) {
      return null;
    }
    return { dropdownMenu, trigger, dropdown, selectEl };
  }
  function normalizePath(path) {
    return path.replace(/\/$/, "") || "/";
  }
  function initNavbar(documentObj) {
    const currentPath = documentObj.location.pathname;
    const normalizedCurrentPath = normalizePath(currentPath);
    const navbarItems = documentObj.querySelectorAll(DOM_SELECTORS.NAVBAR_ITEM);
    let matchingItem = null;
    const itemsToDeactivate = [];
    navbarItems.forEach((item) => {
      const link = item;
      if (!link.href) return;
      try {
        const normalizedLinkPath = normalizePath(new URL(link.href).pathname);
        if (normalizedCurrentPath === normalizedLinkPath) {
          matchingItem = item;
        } else {
          itemsToDeactivate.push(item);
        }
      } catch {
      }
    });
    for (const item of itemsToDeactivate) {
      item.classList.remove("is-active");
      item.removeAttribute("aria-current");
    }
    if (matchingItem) {
      matchingItem.classList.add("is-active");
      matchingItem.setAttribute("aria-current", "page");
    }
    const reportsLink = documentObj.querySelector(DOM_SELECTORS.NAV_REPORTS);
    if (reportsLink) {
      const reportPaths = [
        "/coverage",
        "/coverage-python",
        "/coverage-swift",
        "/coverage-ruby",
        "/playwright",
        "/playwright-examples",
        "/lighthouse"
      ];
      const isOnReportsPage = reportPaths.some(
        (path) => normalizedCurrentPath === path || normalizedCurrentPath.startsWith(path + "/")
      );
      if (isOnReportsPage) {
        reportsLink.classList.add("is-active");
      } else {
        reportsLink.classList.remove("is-active");
      }
    }
  }
  if (typeof window !== "undefined") {
    window.initNavbar = initNavbar;
  }
  function enhanceAccessibility(documentObj) {
    documentObj.querySelectorAll(DOM_SELECTORS.HIGHLIGHT_PRE).forEach((pre) => {
      if (!pre.hasAttribute("tabindex")) pre.setAttribute("tabindex", "0");
      if (!pre.hasAttribute("role")) pre.setAttribute("role", "region");
      if (!pre.hasAttribute("aria-label")) pre.setAttribute("aria-label", "Code block");
    });
  }
  async function initTheme(documentObj, windowObj) {
    migrateLegacyStorage(windowObj);
    const initialTheme = windowObj.__INITIAL_THEME__;
    const savedTheme = getSavedTheme(windowObj, getValidThemeIds());
    if (initialTheme && initialTheme === savedTheme) {
      const currentTheme = getCurrentThemeFromClasses(documentObj.documentElement);
      if (currentTheme === savedTheme) {
        const themeLinkId = `theme-${savedTheme}-css`;
        const themeLink = documentObj.getElementById(themeLinkId);
        if (!themeLink) {
          await applyTheme(documentObj, savedTheme);
        }
        return;
      }
    }
    await applyTheme(documentObj, savedTheme);
  }
  async function wireFlavorSelector(documentObj, windowObj) {
    const abortController = new AbortController();
    const elements = getDropdownElements(documentObj);
    if (!elements) {
      return { cleanup: () => abortController.abort() };
    }
    const { dropdownMenu, selectEl } = elements;
    const baseUrl = getBaseUrl(documentObj);
    const themes2 = getThemes();
    const state = {
      currentIndex: -1,
      menuItems: []
    };
    const currentThemeId = getSavedTheme(windowObj, getValidThemeIds()) || getCurrentTheme(documentObj, DEFAULT_THEME);
    const stateManager = createDropdownStateManager(elements, state);
    const ctx = {
      documentObj,
      baseUrl,
      currentThemeId,
      selectEl,
      menuItems: state.menuItems,
      closeDropdown: stateManager.closeDropdown,
      onThemeSelect: async (themeId) => {
        saveTheme(windowObj, themeId, getValidThemeIds());
        await applyTheme(documentObj, themeId);
      }
    };
    if (selectEl) {
      wireNativeSelect(ctx, selectEl, themes2, DEFAULT_THEME);
    }
    populateDropdownMenu(ctx, dropdownMenu, themes2, THEME_FAMILIES);
    wireDropdownEventHandlers(documentObj, elements, state, stateManager, abortController);
    stateManager.updateAriaExpanded(false);
    elements.dropdown.classList.remove("is-active");
    return { cleanup: () => abortController.abort() };
  }
  if (typeof document !== "undefined" && typeof window !== "undefined") {
    document.addEventListener("DOMContentLoaded", async () => {
      try {
        await initTheme(document, window);
        const { cleanup } = await wireFlavorSelector(document, window);
        enhanceAccessibility(document);
        const pagehideHandler = () => {
          cleanup();
          window.removeEventListener("pagehide", pagehideHandler);
        };
        window.addEventListener("pagehide", pagehideHandler);
      } catch (error) {
        logThemeError(ThemeErrors.INIT_FAILED(error));
      }
    });
  }
  exports.enhanceAccessibility = enhanceAccessibility;
  exports.initNavbar = initNavbar;
  exports.initTheme = initTheme;
  exports.wireFlavorSelector = wireFlavorSelector;
  Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
  return exports;
})({});
//# sourceMappingURL=theme-selector.js.map
