import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { readFileSync, existsSync } from "fs";
import { basename } from "path";

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

// Custom plugin to copy PDF worker files
const copyPDFWorkerPlugin = () => {
  return {
    name: "copy-pdf-worker",
    generateBundle(options, bundle) {
      // Copy PDF.js worker files to the output directory
      const pdfWorkerFiles = [
        "node_modules/pdfjs-dist/build/pdf.worker.min.js",
        "node_modules/pdfjs-dist/build/pdf.worker.min.js.map",
      ];

      pdfWorkerFiles.forEach((filePath) => {
        try {
          if (existsSync(filePath)) {
            const fileName = basename(filePath);
            const source = readFileSync(filePath);

            bundle[fileName] = {
              type: "asset",
              fileName: fileName,
              source: source,
            };
          }
        } catch (error) {
          console.warn(`Could not copy PDF worker file: ${filePath}`, error);
        }
      });
    },
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), removeConsolePlugin(), copyPDFWorkerPlugin()],
  base: "/",
  build: {
    outDir: "dist",
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
  server: {
    historyApiFallback: true,
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
