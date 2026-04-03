import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  base: '/',
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8787",
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: [
      {
        find: "@/integrations",
        replacement: fileURLToPath(new URL("./integrations", import.meta.url)),
      },
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src", import.meta.url)),
      },
    ],
  },
  build: {
    outDir: 'build',
    sourcemap: true,
  },
});
