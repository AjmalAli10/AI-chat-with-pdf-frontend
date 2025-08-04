import axios from "axios";

// In development, use relative URLs (proxied by Vite)
// In production, use the full URL from environment variable
const API_BASE_URL = import.meta.env.DEV
  ? ""
  : import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 300000, // 5 minutes timeout for large files
  headers: {
    "Content-Type": "application/json",
  },
});

// Upload PDF with progress tracking
export const uploadPDF = async (file, onProgress, signal = null) => {
  const formData = new FormData();
  formData.append("pdf", file);

  try {
    console.log("Uploading file:", file.name, file.size, file.type);

    const response = await apiClient.post("/api/pdf/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      signal: signal, // Add abort signal
      onUploadProgress: (progressEvent) => {
        if (progressEvent.lengthComputable) {
          const progress = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100
          );
          console.log("Upload progress:", progress + "%");
          onProgress(progress);
        }
      },
    });

    console.log("Upload successful:", response.data);

    // If we reach here, the upload is complete but server might still be processing
    // Set progress to 100% to indicate upload completion
    onProgress(100);

    return response.data;
  } catch (error) {
    console.error("Upload error details:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      statusText: error.response?.statusText,
    });

    if (error.response) {
      // Server responded with error status
      const errorMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        "Upload failed";
      throw new Error(`${errorMessage} (${error.response.status})`);
    } else if (error.request) {
      // Network error - no response received
      throw new Error("Network error - no response received from server");
    } else {
      // Other error (like timeout, etc.)
      throw new Error(`Upload error: ${error.message}`);
    }
  }
};

// Send chat message
export const sendChatMessage = async (
  message,
  fileId = null,
  chatHistory = []
) => {
  try {
    const response = await apiClient.post("/api/chat/query", {
      query: message,
      fileId: fileId,
      chatHistory: chatHistory,
    });
    return response.data;
  } catch (error) {
    console.error("Chat API error:", error);
    if (error.response) {
      throw new Error(
        `Chat failed: ${error.response.status} - ${
          error.response.data?.message || "Unknown error"
        }`
      );
    } else if (error.request) {
      throw new Error("Network error - no response received");
    } else {
      throw new Error(`Chat error: ${error.message}`);
    }
  }
};

// Get PDF URL
export const getPDFUrl = (filename) => {
  return `${API_BASE_URL}/uploads/${filename}`;
};
