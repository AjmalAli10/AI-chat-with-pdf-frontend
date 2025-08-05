import React, { useRef, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { handleFileUpload } from "../utils/fileUpload";

const UploadConfirmModal = ({ onUploadSuccess, onClose }) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleClose = () => {
    onClose();
  };

  const handleFileUploadLocal = async (file) => {
    setIsUploading(true);
    try {
      const result = await handleFileUpload(file, () => {}, null);

      if (result.success) {
        onUploadSuccess(result.fileId, null, result.blobUrl);
      } else if (result.aborted) {
        // Upload was aborted, don't show error
        return;
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center space-x-3 p-6 pb-4">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Upload New PDF?
          </h3>
        </div>

        {/* Body */}
        <div className="px-6 pb-6">
          <p className="text-gray-600 text-sm leading-relaxed">
            This will end your current chat session. Are you sure you want to
            upload a new PDF?
          </p>
        </div>

        {/* Actions */}
        <div className="flex space-x-3 px-6 pb-6">
          <button
            onClick={handleClose}
            disabled={isUploading}
            className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isUploading ? "Uploading..." : "Upload New PDF"}
          </button>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={(event) => {
            const file = event.target.files[0];
            if (file) {
              handleFileUploadLocal(file);
            }
          }}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default UploadConfirmModal;
