// PDF utility functions for optimization and handling

export const validatePDFFile = (file) => {
  const maxSize = 50 * 1024 * 1024; // 50MB limit to match backend
  const allowedTypes = ["application/pdf"];

  if (!file) {
    return { valid: false, error: "No file selected" };
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: "Please select a valid PDF file" };
  }

  if (file.size > maxSize) {
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
    return {
      valid: false,
      error: `File size (${fileSizeMB}MB) exceeds the 50MB limit. Please select a smaller PDF file.`,
    };
  }

  return { valid: true };
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const optimizePDFForUpload = (file) => {
  // This function can be extended to add client-side PDF optimization
  // For now, we just validate the file
  return validatePDFFile(file);
};

export const createObjectURL = (file) => {
  return URL.createObjectURL(file);
};

export const revokeObjectURL = (url) => {
  if (url && url.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
};
