import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    include: ['test/**/*.test.ts', 'test/**/*.spec.ts'],
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
      ],
      thresholds: {
        lines: 85,
        functions: 85,
        branches: 85,
        statements: 85,
      },
    },
  },
});
