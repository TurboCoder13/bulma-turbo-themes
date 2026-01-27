import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      // More specific paths must come before less specific ones
      '@lgtm-hq/turbo-themes-core/css/mappings': resolve(__dirname, 'packages/core/src/themes/css/mappings.ts'),
      '@lgtm-hq/turbo-themes-core/themes/types': resolve(__dirname, 'packages/core/src/themes/types.ts'),
      '@lgtm-hq/turbo-themes-core/tokens': resolve(__dirname, 'packages/core/src/tokens/index.ts'),
      '@lgtm-hq/turbo-themes-core': resolve(__dirname, 'packages/core/src/index.ts'),
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },
  test: {
    environment: 'happy-dom',
    environmentOptions: {
      happyDOM: {
        settings: {
          disableCSSFileLoading: true,
          handleDisabledFileLoadingAsSuccess: true,
        },
      },
    },
    setupFiles: ['./test/setup.ts'],
    include: ['test/**/*.test.ts', 'test/**/*.test.tsx', 'test/**/*.spec.ts', 'packages/*/test/**/*.test.ts', 'packages/adapters/*/test/**/*.test.ts'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/_site/**', 'apps/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov', 'json-summary'],
      reportsDirectory: './coverage',
      all: true,
      include: ['src/**/*.ts', 'packages/*/src/**/*.ts', 'packages/adapters/*/src/**/*.ts'],
      exclude: [
        'node_modules/**',
        'dist/**',
        '_site/**',
        '**/*.config.ts',
        '**/*.config.js',
        '**/*.d.ts',
        '**/*.js',
        '**/*.map',
        'scripts/**',
        '.github/**',
        'coverage/**',
        'test/**',
        'e2e/**',
        'packages/core/src/themes/packs/**/*.synced.ts',
        'packages/core/src/themes/types.ts',
        // Re-export only files (no runtime logic to test)
        'packages/core/src/index.ts',
        'packages/core/src/themes/registry.ts',
        'packages/core/src/themes/factories/index.ts',
        // Re-export and type-only files (no runtime logic)
        'packages/core/src/themes/css/global-overrides.ts',
        'packages/core/src/themes/css/types.ts',
        'packages/theme-selector/src/types.ts',
        'src/index.ts',
        // Root src/ legacy files (covered by packages/ or type-only)
        'src/themes/css.ts',
        'src/themes/types.ts',
        'src/tokens/index.ts',
      ],
      thresholds: {
        lines: 85,
        functions: 85,
        branches: 84,
        statements: 85,
      },
    },
  },
});
