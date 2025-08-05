import React, { useState, useCallback, useRef } from "react";
import { Cloud, FileText, Upload } from "lucide-react";
import { validatePDFFile } from "../utils/pdfUtils";
import { handleFileUpload } from "../utils/fileUpload";

const PDFUpload = ({ onUploadSuccess }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const uploadAbortController = useRef(null);

  const handleFileUploadLocal = async (file) => {
    // Cancel any ongoing upload
    if (uploadAbortController.current) {
      uploadAbortController.current.abort();
    }

    // Create new abort controller
    uploadAbortController.current = new AbortController();

    setIsUploading(true);
    setIsProcessing(false);
    setUploadProgress(0);
    setError(null);

    // Set a timeout for the entire operation
    const timeoutId = setTimeout(() => {
      if (uploadAbortController.current) {
        uploadAbortController.current.abort();
        setError(
          "Upload timed out. Please try again with a smaller file or check your connection."
        );
      }
    }, 120000); // 2 minutes timeout

    try {
      const result = await handleFileUpload(
        file,
        (progress) => {
          setUploadProgress(progress);
          // If progress reaches 100%, we're likely in server processing phase
          if (progress === 100) {
            setIsProcessing(true);
          }
        },
        uploadAbortController.current.signal
      );

      clearTimeout(timeoutId);

      if (result.success) {
        onUploadSuccess(result.fileId, null, result.blobUrl);
      } else if (result.aborted) {
        // Upload was aborted, don't show error
        return;
      }
    } catch (error) {
      clearTimeout(timeoutId);
      console.error("Upload failed:", error);
      setError(`Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
      setIsProcessing(false);
      setUploadProgress(0);
      uploadAbortController.current = null;
    }
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    setError(null);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      console.log("File dropped:", files[0]);
      const validation = validatePDFFile(files[0]);
      console.log("Validation result:", validation);
      if (validation.valid) {
        handleFileUploadLocal(files[0]);
      } else {
        setError(validation.error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileSelect = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("File selected:", file);
      setError(null);
      const validation = validatePDFFile(file);
      console.log("Validation result:", validation);
      if (validation.valid) {
        handleFileUploadLocal(file);
      } else {
        setError(validation.error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-md w-full px-4">
        <div
          className={`relative bg-white rounded-lg border-2 border-dashed border-black p-8 text-center transition-all duration-200 ${
            isDragOver ? "border-gray-600" : ""
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {isUploading ? (
            <div className="space-y-6">
              <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center">
                <FileText className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {isProcessing ? "Processing PDF..." : "Uploading PDF..."}
                </h3>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">
                  {isProcessing
                    ? "Server is processing your PDF..."
                    : `${uploadProgress}%`}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="w-16 h-16 mx-auto flex items-center justify-center">
                <Cloud className="w-8 h-8 text-black" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-black mb-2">
                  Choose a file or drag & drop it here
                </h3>
                <p className="text-sm text-black mb-6">
                  PDF format, up to 50MB
                </p>
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}
                <button
                  onClick={() => document.getElementById("pdf-upload").click()}
                  className="px-4 py-2 bg-white border border-black rounded-lg text-black hover:bg-gray-50 focus:outline-none focus:border-black transition-all duration-200"
                >
                  Browse File
                </button>
              </div>
            </div>
          )}

          <input
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            className="hidden"
            id="pdf-upload"
          />
        </div>
      </div>
    </div>
  );
};

export default PDFUpload;
