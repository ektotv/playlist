/// <reference types="vitest" />
import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { copyFileSync } from 'node:fs';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'playlist',
      fileName: 'playlist',
    },
  },
  plugins: [
    dts({
      afterBuild: () => {
        // To ensure the package is supported by all consumers, we must
        // export types that are read as ESM. To do this, there must be
        // duplicate types with the correct extension supplied in the
        // package.json exports field.
        copyFileSync('dist/index.d.ts', 'dist/index.d.mts');
      },
      rollupTypes: true,
      insertTypesEntry: true,
    }),
  ],
  test: {
    coverage: {
      provider: 'v8',
    },
  },
});
