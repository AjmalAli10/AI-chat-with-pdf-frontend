import React, { useState } from "react";
import { Upload } from "lucide-react";
import UploadConfirmModal from "./UploadConfirmModal";

const UploadNewButton = ({ onUploadSuccess, disabled }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        onClick={handleOpenModal}
        disabled={disabled}
        className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50"
      >
        <Upload className="w-4 h-4" />
        <span>Upload New</span>
      </button>

      {isModalOpen && (
        <UploadConfirmModal
          onUploadSuccess={onUploadSuccess}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default UploadNewButton;
