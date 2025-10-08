export type ThemeMode = "theme";

interface ThemeFlavor {
  id: string;
  name: string;
  cssFile: string;
  icon?: string;
}

const THEMES: ThemeFlavor[] = [
  {
    id: "bulma-light",
    name: "Bulma Light",
    cssFile: "/assets/css/themes/bulma-light.css",
  },
  {
    id: "bulma-dark",
    name: "Bulma Dark",
    cssFile: "/assets/css/themes/bulma-dark.css",
  },
  {
    id: "catppuccin-latte",
    name: "Catppuccin Latte",
    cssFile: "/assets/css/themes/catppuccin-latte.css",
    icon: "/assets/img/catppuccin-latte.png",
  },
  {
    id: "catppuccin-frappe",
    name: "Catppuccin Frappé",
    cssFile: "/assets/css/themes/catppuccin-frappe.css",
    icon: "/assets/img/catppuccin-latte.png",
  },
  {
    id: "catppuccin-macchiato",
    name: "Catppuccin Macchiato",
    cssFile: "/assets/css/themes/catppuccin-macchiato.css",
    icon: "/assets/img/catppuccin-mocha.png",
  },
  {
    id: "catppuccin-mocha",
    name: "Catppuccin Mocha",
    cssFile: "/assets/css/themes/catppuccin-mocha.css",
    icon: "/assets/img/catppuccin-mocha.png",
  },
  {
    id: "dracula",
    name: "Dracula",
    cssFile: "/assets/css/themes/dracula.css",
    icon: "/assets/img/dracula-logo.png",
  },
  {
    id: "github-light",
    name: "GitHub Light",
    cssFile: "/assets/css/themes/github-light.css",
    icon: "/assets/img/github-logo-light.png",
  },
  {
    id: "github-dark",
    name: "GitHub Dark",
    cssFile: "/assets/css/themes/github-dark.css",
    icon: "/assets/img/github-logo-dark.png",
  },
];

const STORAGE_KEY = "bulma-theme-flavor";
const DEFAULT_THEME = "catppuccin-mocha";

function getBaseUrl(doc: Document): string {
  const baseElement = doc.querySelector("html[data-baseurl]");
  const raw = baseElement?.getAttribute("data-baseurl") || "";
  try {
    const u = new URL(raw, "http://localhost");
    // Only allow same-origin relative paths; strip origin used for parsing
    return u.origin === "http://localhost" ? u.pathname.replace(/\/\+$/, "") : "";
  } catch {
    return "";
  }
}

function applyTheme(doc: Document, themeId: string): void {
  const theme =
    THEMES.find((t) => t.id === themeId) || THEMES.find((t) => t.id === DEFAULT_THEME)!;
  const baseUrl = getBaseUrl(doc);
  const flavorLink = doc.getElementById("theme-flavor-css") as HTMLLinkElement | null;

  if (flavorLink) {
    // Build a safe URL relative to base
    try {
      const url = new URL(theme.cssFile, "http://localhost" + baseUrl);
      flavorLink.href = url.pathname;
    } catch {
      // Ignore invalid URL
    }
  }

  doc.documentElement.setAttribute("data-flavor", themeId);

  // Update trigger button icon
  const triggerIcon = doc.getElementById("theme-flavor-trigger-icon");
  if (triggerIcon && theme.icon) {
    // Clear existing content first
    while (triggerIcon.firstChild) {
      triggerIcon.removeChild(triggerIcon.firstChild);
    }
    // Create and append img element (CSP-friendly)
    const img = doc.createElement("img");
    if (theme.icon) {
      try {
        const url = new URL(theme.icon, "http://localhost" + baseUrl);
        img.src = url.pathname;
      } catch {
        // Ignore invalid URL
      }
    }
    img.alt = theme.name;
    triggerIcon.appendChild(img);
  }

  // Update active state in dropdown
  const dropdownItems = doc.querySelectorAll("#theme-flavor-items .dropdown-item");
  dropdownItems.forEach((item) => {
    if (item.getAttribute("data-theme-id") === themeId) {
      item.classList.add("is-active");
    } else {
      item.classList.remove("is-active");
    }
  });
}

export function initTheme(documentObj: Document, windowObj: Window): void {
  const savedTheme = windowObj.localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME;
  applyTheme(documentObj, savedTheme);
}

export function wireFlavorSelector(documentObj: Document, windowObj: Window): void {
  const baseUrl = getBaseUrl(documentObj);
  const dropdownContent = documentObj.getElementById("theme-flavor-items");
  const trigger = documentObj.querySelector(".theme-flavor-trigger");
  const dropdown = documentObj.getElementById("theme-flavor-dd");

  if (!dropdownContent || !trigger || !dropdown) {
    return;
  }

  // Populate dropdown with theme options
  THEMES.forEach((theme) => {
    const item = documentObj.createElement("a");
    item.href = "#";
    item.className = "dropdown-item";
    item.setAttribute("data-theme-id", theme.id);
    item.setAttribute("role", "menuitem");
    item.setAttribute("aria-label", theme.name);

    if (theme.icon) {
      const img = documentObj.createElement("img");
      try {
        const url = new URL(theme.icon, "http://localhost" + baseUrl);
        img.src = url.pathname;
      } catch {
        // Ignore invalid URL
      }
      img.alt = theme.name;
      img.title = theme.name;
      item.appendChild(img);
    } else {
      // Fallback: show first two letters with styled background
      const span = documentObj.createElement("span");
      span.textContent = theme.name.substring(0, 2);
      span.style.fontSize = "14px";
      span.style.fontWeight = "bold";
      span.style.color = "var(--theme-text, inherit)";
      item.appendChild(span);
    }

    item.addEventListener("click", (e) => {
      e.preventDefault();
      applyTheme(documentObj, theme.id);
      windowObj.localStorage.setItem(STORAGE_KEY, theme.id);
      dropdown.classList.remove("is-active");
    });

    dropdownContent.appendChild(item);
  });

  // Open dropdown on hover
  dropdown.addEventListener("mouseenter", () => {
    dropdown.classList.add("is-active");
  });

  // Close dropdown when mouse leaves
  dropdown.addEventListener("mouseleave", () => {
    dropdown.classList.remove("is-active");
  });

  // Toggle dropdown on trigger click (for touch devices)
  trigger.addEventListener("click", (e) => {
    e.preventDefault();
    dropdown.classList.toggle("is-active");
  });

  // Close dropdown when clicking outside
  documentObj.addEventListener("click", (e: MouseEvent) => {
    if (!dropdown.contains(e.target as Node)) {
      dropdown.classList.remove("is-active");
    }
  });

  // Keyboard navigation
  trigger.addEventListener("keydown", (e: Event) => {
    const key = (e as KeyboardEvent).key;
    if (key === "Enter" || key === " ") {
      e.preventDefault();
      dropdown.classList.toggle("is-active");
    }
  });
}

// Auto-initialize on DOMContentLoaded
if (typeof document !== "undefined" && typeof window !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    console.warn("Theme switcher initializing...");
    try {
      initTheme(document, window);
      wireFlavorSelector(document, window);
      console.warn("Theme switcher initialized successfully");
    } catch (error) {
      console.error("Theme switcher initialization failed:", error);
    }
  });
}
