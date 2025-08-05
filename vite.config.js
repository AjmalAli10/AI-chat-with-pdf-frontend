import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Custom plugin to remove console logs except errors in production
const removeConsolePlugin = () => {
  return {
    name: "remove-console",
    transform(code, id) {
      if (id.includes("node_modules")) return;

      // Remove console.log, console.warn, console.info but keep console.error
      return code
        .replace(/console\.log\([^)]*\);?/g, "")
        .replace(/console\.warn\([^)]*\);?/g, "")
        .replace(/console\.info\([^)]*\);?/g, "")
        .replace(/console\.debug\([^)]*\);?/g, "");
    },
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), removeConsolePlugin()],
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
    minify: "esbuild",
    target: "es2015",
  },
  optimizeDeps: {
    include: ["pdfjs-dist"],
  },
  define: {
    global: "globalThis",
  },
  esbuild: {
    drop: ["console", "debugger"],
    pure: ["console.log", "console.warn", "console.info"],
  },
});
