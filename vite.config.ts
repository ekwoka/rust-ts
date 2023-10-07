/// <reference types="vitest" />
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  root: 'src',
  define: {
    'import.meta.vitest': 'undefined',
  },
  build: {
    outDir: '../dist',
  },
  test: {
    root: './',
    globals: true,
    includeSource: [],
    reporters: ['dot'],
    deps: {},
  },
});
