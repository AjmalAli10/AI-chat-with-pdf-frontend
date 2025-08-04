// PDF loader utility for efficient loading and worker management
import * as pdfjsLib from "pdfjs-dist";

let pdfWorkerConfigured = false;

export const configurePDFWorker = () => {
  if (typeof window !== "undefined" && !pdfWorkerConfigured) {
    try {
      // Configure PDF.js worker to use local worker
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
      pdfWorkerConfigured = true;
    } catch (error) {
      console.warn("PDF worker configuration failed:", error);
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
