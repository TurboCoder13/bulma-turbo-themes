/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("auto init", () => {
  const originalConsole = global.console;

  beforeEach(() => {
    // Mock document and window before importing the module so top-level code runs
    Object.defineProperty(global, "document", {
      value: {
        addEventListener: vi.fn(),
      },
      configurable: true,
    });
    Object.defineProperty(global, "window", {
      value: {},
      configurable: true,
    });

    global.console = { ...originalConsole, warn: vi.fn(), error: vi.fn() } as any;
  });

  afterEach(() => {
    global.console = originalConsole;
  });

  it("registers DOMContentLoaded handler and runs without throwing", async () => {
    // Dynamic import to trigger module top-level registration
    await import("../src/index.ts");
    const calls = (document.addEventListener as any).mock.calls;
    const domHandler = calls.find((c: any[]) => c[0] === "DOMContentLoaded")?.[1];
    expect(domHandler).toBeTypeOf("function");
    // Execute the handler; it should log warnings but not throw
    domHandler();
    expect((global.console as any).warn).toHaveBeenCalled();
  });
});
