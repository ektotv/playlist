/// <reference types="vitest" />
import { defineConfig } from "vite";
import { resolve } from "node:path";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/main.ts"),
      name: "playlist",
      fileName: "playlist",
    },
  },
  plugins: [
    dts({
      rollupTypes: true,
      insertTypesEntry: true,
    }),
  ],
  test: {
    coverage: {
      provider: "v8",
    },
  },
});
