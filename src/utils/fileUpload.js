import { uploadPDF } from "../services/apiService";

export const handleFileUpload = async (file, onProgress, signal) => {
  try {
    console.log("Starting file upload:", file.name, file.size, file.type);

    const response = await uploadPDF(file, onProgress, signal);

    console.log("Upload response:", response);

    // Check if response has the expected structure
    if (response && response.success) {
      const fileId = response.data?.fileId;
      const blobUrl = response.data?.blobUrl;

      if (fileId && blobUrl) {
        return {
          success: true,
          fileId,
          blobUrl,
          originalName: response.data?.originalName,
          documentType: response.data?.documentType,
          totalPages: response.data?.totalPages,
          sections: response.data?.sections,
          chunks: response.data?.chunks,
          summary: response.data?.summary,
          suggestions: response.data?.suggestions,
        };
      } else {
        throw new Error("Invalid response format - missing fileId or blobUrl");
      }
    } else {
      throw new Error(response?.message || "Upload failed");
    }
  } catch (error) {
    if (error.name === "AbortError") {
      console.log("Upload was aborted by user");
      return { success: false, aborted: true };
    }
    console.error("Upload failed:", error);
    throw error;
  }
};
