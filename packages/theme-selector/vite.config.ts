import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: 'index',
    },
    outDir: 'dist',
    emptyOutDir: true,
    minify: false,
    sourcemap: true,
  },
  resolve: {
    alias: {
      '@lgtm-hq/turbo-themes-core': resolve(__dirname, '../core/dist/index.js'),
    },
  },
  plugins: [dts({ rollupTypes: true })],
});
