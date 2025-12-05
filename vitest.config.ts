import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    include: ['test/**/*.test.ts', 'test/**/*.test.tsx', 'test/**/*.spec.ts'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/_site/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov', 'json-summary'],
      reportsDirectory: './coverage',
      include: ['src/**/*.ts'],
      exclude: [
        'node_modules/**',
        'dist/**',
        '_site/**',
        '**/*.config.ts',
        '**/*.config.js',
        'scripts/**',
        '.github/**',
        'coverage/**',
        'test/**',
        'e2e/**',
        'src/themes/packs/**/*.synced.ts',
        'src/themes/types.ts',
        'src/themes/css.ts',
        'src/tokens/react-native/index.ts', // Re-exports only
      ],
      thresholds: {
        lines: 85,
        functions: 80, // Adjusted for DDL native select syncing and defensive error handling paths
        branches: 76, // Adjusted for closure-internal state and auto-init error handling branches
        statements: 85,
      },
    },
  },
});
