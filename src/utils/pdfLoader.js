// PDF loader utility for efficient loading and worker management
import * as pdfjsLib from "pdfjs-dist";

let pdfWorkerConfigured = false;

// Production-aware logging
const log = (message, type = "log") => {
  if (import.meta.env.PROD) {
    // Only log errors in production
    if (type === "error") {
      console.error(message);
    }
  } else {
    // Log everything in development
    console[type](message);
  }
};

export const configurePDFWorker = () => {
  if (typeof window !== "undefined" && !pdfWorkerConfigured) {
    try {
      // Debug environment detection
      log(
        `Environment detection: DEV=${import.meta.env.DEV}, PROD=${
          import.meta.env.PROD
        }`
      );
      log(`Current URL: ${window.location.href}`);

      // Force configure the worker before any PDF operations
      if (import.meta.env.DEV) {
        // Development: use local file from public directory
        const workerSrc = "/pdf.worker.min.js";
        pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;
        log(`PDF worker configured for development: ${workerSrc}`);
      } else {
        // Production: use CDN to avoid static file serving issues
        const workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
        pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;
        log(`PDF worker configured for production: ${workerSrc}`);
      }
      pdfWorkerConfigured = true;
      log("PDF worker configured successfully");
    } catch (error) {
      log("PDF worker configuration failed: " + error.message, "error");
      // Fallback to local file if CDN fails
      try {
        const fallbackSrc = "/pdf.worker.min.js";
        pdfjsLib.GlobalWorkerOptions.workerSrc = fallbackSrc;
        pdfWorkerConfigured = true;
        log(`PDF worker configured with local file fallback: ${fallbackSrc}`);
      } catch (fallbackError) {
        log(
          "PDF worker local file fallback also failed: " +
            fallbackError.message,
          "error"
        );
      }
    }
  } else if (pdfWorkerConfigured) {
    log("PDF worker already configured, skipping");
  }
};

export const preloadPDFComponents = () => {
  // Preload PDF components when user starts uploading
  return import("../components/PDFDocument");
};

export const validatePDFUrl = (url) => {
  if (!url) return false;
  if (typeof url === "string" && url.startsWith("blob:")) return true;
  if (typeof url === "string" && url.startsWith("http")) return true;
  if (url instanceof File) return true;
  return false;
};

export const createPDFUrl = (file) => {
  if (file instanceof File) {
    return URL.createObjectURL(file);
  }
  return file;
};

export const cleanupPDFUrl = (url) => {
  if (url && url.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
};

export const loadPDFDocument = async (url) => {
  try {
    const loadingTask = pdfjsLib.getDocument(url);
    return await loadingTask.promise;
  } catch (error) {
    console.error("Failed to load PDF document:", error);
    throw error;
  }
};
