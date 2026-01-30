import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: {
        preset: resolve(__dirname, 'preset.ts'),
        colors: resolve(__dirname, 'colors.ts'),
      },
      formats: ['es'],
    },
    outDir: 'dist',
    emptyOutDir: true,
    minify: false,
    sourcemap: true,
  },
  resolve: {
    alias: {
      '@lgtm-hq/turbo-themes-core': resolve(__dirname, '../../core/dist/index.js'),
    },
  },
  plugins: [dts({ rollupTypes: true })],
});
