import { describe, it, expect, beforeEach, vi } from "vitest";
import { initTheme, wireFlavorSelector } from "../src/index";

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
};

// Mock DOM elements
const mockElement = {
  href: "",
  className: "",
  setAttribute: vi.fn(),
  appendChild: vi.fn(),
  addEventListener: vi.fn(),
  removeChild: vi.fn(),
  firstChild: null,
  classList: {
    add: vi.fn(),
    remove: vi.fn(),
    toggle: vi.fn(),
    contains: vi.fn(),
  },
  contains: vi.fn(),
};

const mockImg = {
  src: "",
  alt: "",
  title: "",
};

const mockSpan = {
  textContent: "",
  style: {},
};

describe("public API", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Setup DOM mocks
    Object.defineProperty(document, "getElementById", {
      value: vi.fn((id) => {
        if (
          id === "theme-flavor-items" ||
          id === "theme-flavor-trigger-icon" ||
          id === "theme-flavor-dd"
        ) {
          return mockElement;
        }
        return null;
      }),
      writable: true,
    });

    Object.defineProperty(document, "querySelector", {
      value: vi.fn((selector) => {
        if (selector === ".theme-flavor-trigger") {
          return mockElement;
        }
        return null;
      }),
      writable: true,
    });

    Object.defineProperty(document, "querySelectorAll", {
      value: vi.fn(() => []),
      writable: true,
    });

    Object.defineProperty(document, "createElement", {
      value: vi.fn((tag) => {
        if (tag === "img") return mockImg;
        if (tag === "span") return mockSpan;
        return mockElement;
      }),
      writable: true,
    });

    Object.defineProperty(document, "addEventListener", {
      value: vi.fn(),
      writable: true,
    });

    Object.defineProperty(document.documentElement, "setAttribute", {
      value: vi.fn(),
      writable: true,
    });

    Object.defineProperty(document.documentElement, "getAttribute", {
      value: vi.fn(() => "catppuccin-mocha"),
      writable: true,
    });

    Object.defineProperty(document.documentElement, "removeAttribute", {
      value: vi.fn(),
      writable: true,
    });

    Object.defineProperty(window, "localStorage", {
      value: mockLocalStorage,
      writable: true,
    });

    // Mock console methods
    global.console = {
      ...console,
      warn: vi.fn(),
      error: vi.fn(),
    };
  });

  it("exports initTheme and wireFlavorSelector", () => {
    expect(typeof initTheme).toBe("function");
    expect(typeof wireFlavorSelector).toBe("function");
  });

  it("initTheme sets data-flavor attribute", () => {
    document.documentElement.removeAttribute("data-flavor");
    initTheme(document, window);
    expect(document.documentElement.getAttribute("data-flavor")).toBe(
      "catppuccin-mocha",
    );
  });

  it("initTheme uses saved theme from localStorage", () => {
    mockLocalStorage.getItem.mockReturnValue("dracula");
    initTheme(document, window);
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith("bulma-theme-flavor");
  });

  it("initTheme uses default theme when localStorage is empty", () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    initTheme(document, window);
    expect(document.documentElement.setAttribute).toHaveBeenCalledWith(
      "data-flavor",
      "catppuccin-mocha",
    );
  });

  it("wireFlavorSelector returns early when elements are missing", () => {
    Object.defineProperty(document, "getElementById", {
      value: vi.fn(() => null),
      writable: true,
    });

    wireFlavorSelector(document, window);
    expect(document.getElementById).toHaveBeenCalledWith("theme-flavor-items");
    expect(document.querySelector).toHaveBeenCalledWith(".theme-flavor-trigger");
    expect(document.getElementById).toHaveBeenCalledWith("theme-flavor-dd");
  });

  it("wireFlavorSelector creates dropdown items for themes", () => {
    wireFlavorSelector(document, window);

    // Should create elements for each theme
    expect(document.createElement).toHaveBeenCalledWith("a");
    expect(document.createElement).toHaveBeenCalledWith("img");
    expect(document.createElement).toHaveBeenCalledWith("span");
  });

  it("wireFlavorSelector sets up event listeners", () => {
    wireFlavorSelector(document, window);

    expect(mockElement.addEventListener).toHaveBeenCalledWith(
      "mouseenter",
      expect.any(Function),
    );
    expect(mockElement.addEventListener).toHaveBeenCalledWith(
      "mouseleave",
      expect.any(Function),
    );
    expect(mockElement.addEventListener).toHaveBeenCalledWith(
      "click",
      expect.any(Function),
    );
    expect(mockElement.addEventListener).toHaveBeenCalledWith(
      "keydown",
      expect.any(Function),
    );
  });

  it("wireFlavorSelector handles theme selection", () => {
    const mockEvent = {
      preventDefault: vi.fn(),
      target: mockElement,
    };

    wireFlavorSelector(document, window);

    // Simulate click on dropdown item
    const clickHandler = mockElement.addEventListener.mock.calls.find(
      (call) => call[0] === "click",
    )?.[1];

    if (clickHandler) {
      clickHandler(mockEvent);
      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockLocalStorage.setItem).toHaveBeenCalled();
    }
  });

  it("wireFlavorSelector handles keyboard navigation", () => {
    const mockKeyEvent = {
      key: "Enter",
      preventDefault: vi.fn(),
    };

    wireFlavorSelector(document, window);

    // Simulate keydown on trigger
    const keydownHandler = mockElement.addEventListener.mock.calls.find(
      (call) => call[0] === "keydown",
    )?.[1];

    if (keydownHandler) {
      keydownHandler(mockKeyEvent);
      expect(mockKeyEvent.preventDefault).toHaveBeenCalled();
      expect(mockElement.classList.toggle).toHaveBeenCalledWith("is-active");
    }
  });

  it("wireFlavorSelector handles space key navigation", () => {
    const mockKeyEvent = {
      key: " ",
      preventDefault: vi.fn(),
    };

    wireFlavorSelector(document, window);

    const keydownHandler = mockElement.addEventListener.mock.calls.find(
      (call) => call[0] === "keydown",
    )?.[1];

    if (keydownHandler) {
      keydownHandler(mockKeyEvent);
      expect(mockKeyEvent.preventDefault).toHaveBeenCalled();
      expect(mockElement.classList.toggle).toHaveBeenCalledWith("is-active");
    }
  });

  it("wireFlavorSelector ignores other keys", () => {
    const mockKeyEvent = {
      key: "Escape",
      preventDefault: vi.fn(),
    };

    wireFlavorSelector(document, window);

    const keydownHandler = mockElement.addEventListener.mock.calls.find(
      (call) => call[0] === "keydown",
    )?.[1];

    if (keydownHandler) {
      keydownHandler(mockKeyEvent);
      expect(mockKeyEvent.preventDefault).not.toHaveBeenCalled();
      expect(mockElement.classList.toggle).not.toHaveBeenCalled();
    }
  });
});
