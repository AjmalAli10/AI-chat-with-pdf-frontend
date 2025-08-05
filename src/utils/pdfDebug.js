// PDF debugging utilities

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

export const enablePDFDebug = () => {
  if (typeof window !== "undefined") {
    localStorage.debug = "pdf:*";
    log("PDF debugging enabled");
  }
};

export const disablePDFDebug = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("debug");
    log("PDF debugging disabled");
  }
};

export const logPDFError = (error, context = "") => {
  log(`PDF Error${context ? ` (${context})` : ""}: ${error.message}`, "error");

  // Log additional details for common errors
  if (error.name === "InvalidPDFException") {
    log("The PDF file appears to be corrupted or invalid", "error");
  } else if (error.name === "MissingPDFException") {
    log("The PDF file could not be found or accessed", "error");
  } else if (error.name === "UnexpectedResponseException") {
    log("The server returned an unexpected response", "error");
  }
};

export const validatePDFUrl = (url) => {
  if (!url) {
    log("PDF URL is empty or null", "warn");
    return false;
  }

  if (typeof url !== "string") {
    log("PDF URL is not a string: " + typeof url, "warn");
    return false;
  }

  if (url.startsWith("blob:")) {
    log("PDF URL is a blob URL");
    return true;
  }

  if (url.startsWith("http")) {
    log("PDF URL is an HTTP URL");
    return true;
  }

  log("PDF URL format not recognized: " + url, "warn");
  return false;
};
