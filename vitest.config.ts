import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "happy-dom",
    include: ["test/**/*.test.ts", "test/**/*.spec.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov", "json-summary"],
      reportsDirectory: "./coverage",
      include: ["src/**/*.ts"],
      exclude: [
        "node_modules/**",
        "dist/**",
        "_site/**",
        "**/*.config.ts",
        "**/*.config.js",
        "scripts/**",
        ".github/**",
        "coverage/**",
        "test/**",
        "src/themes/packs/**/*.synced.ts",
      ],
      thresholds: {
        lines: 50,
        functions: 70,
        branches: 40,
        statements: 50,
      },
    },
  },
});
