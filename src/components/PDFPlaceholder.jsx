import React from "react";
import { FileText } from "lucide-react";

const PDFPlaceholder = () => {
  return (
    <div className="flex items-center justify-center h-full bg-gray-50">
      <div className="text-center">
        <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <p className="text-gray-500 text-lg font-medium">PDF Viewer</p>
        <p className="text-gray-400 text-sm">Upload a PDF to view it here</p>
      </div>
    </div>
  );
};

export default PDFPlaceholder;
