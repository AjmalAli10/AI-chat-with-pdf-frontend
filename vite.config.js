import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "^/api/.*": {
        target: "https://ai-chat-with-pdf-backend.vercel.app",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path,
      },
      "^/uploads/.*": {
        target: "https://ai-chat-with-pdf-backend.vercel.app",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          pdfjs: ["pdfjs-dist"],
          vendor: ["react", "react-dom"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: ["pdfjs-dist"],
  },
  define: {
    global: "globalThis",
  },
});
