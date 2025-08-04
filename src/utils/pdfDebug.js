// PDF debugging utilities

export const enablePDFDebug = () => {
  if (typeof window !== "undefined") {
    localStorage.debug = "pdf:*";
    console.log("PDF debugging enabled");
  }
};

export const disablePDFDebug = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("debug");
    console.log("PDF debugging disabled");
  }
};

export const logPDFError = (error, context = "") => {
  console.error(`PDF Error${context ? ` (${context})` : ""}:`, error);

  // Log additional details for common errors
  if (error.name === "InvalidPDFException") {
    console.error("The PDF file appears to be corrupted or invalid");
  } else if (error.name === "MissingPDFException") {
    console.error("The PDF file could not be found or accessed");
  } else if (error.name === "UnexpectedResponseException") {
    console.error("The server returned an unexpected response");
  }
};

export const validatePDFUrl = (url) => {
  if (!url) {
    console.warn("PDF URL is empty or null");
    return false;
  }

  if (typeof url !== "string") {
    console.warn("PDF URL is not a string:", typeof url);
    return false;
  }

  if (url.startsWith("blob:")) {
    console.log("PDF URL is a blob URL");
    return true;
  }

  if (url.startsWith("http")) {
    console.log("PDF URL is an HTTP URL");
    return true;
  }

  console.warn("PDF URL format not recognized:", url);
  return false;
};
