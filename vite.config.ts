import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
  },
  build: {
    target: "esnext",
    // WASM 文件需要放置在静态资源目录
    assetsInlineLimit: 0,
  },
  optimizeDeps: {
    exclude: [
      "@jsquash/jpeg",
      "@jsquash/webp",
      "@jsquash/png",
      "@jsquash/oxipng",
      "@jsquash/avif",
    ],
  },
  worker: {
    format: "es",
  },
});
