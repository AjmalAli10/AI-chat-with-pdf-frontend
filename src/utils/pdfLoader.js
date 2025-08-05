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
      // The worker file is in the public directory and will be served from the root
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
      pdfWorkerConfigured = true;
      log("PDF worker configured successfully");
    } catch (error) {
      log("PDF worker configuration failed: " + error.message, "error");
      // Fallback to CDN if local configuration fails
      try {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
        pdfWorkerConfigured = true;
        log("PDF worker configured with CDN fallback");
      } catch (fallbackError) {
        log(
          "PDF worker CDN fallback also failed: " + fallbackError.message,
          "error"
        );
      }
    }
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
