import { uploadPDF } from "../services/apiService";

export const handleFileUpload = async (file, onProgress, signal) => {
  try {
    console.log("Starting file upload:", file.name, file.size, file.type);

    const response = await uploadPDF(file, onProgress, signal);

    console.log("Upload response:", response);

    // Check if response has the expected structure
    if (response && (response.success || response.fileId)) {
      const fileId = response.fileId || response.data?.fileId;
      const fileName = response.fileName || response.data?.fileName;

      if (fileId && fileName) {
        return { success: true, fileId, fileName };
      } else {
        throw new Error("Invalid response format - missing fileId or fileName");
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
