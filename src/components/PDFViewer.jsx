import React, { useState, memo } from "react";
import LoadingSpinner from "./LoadingSpinner";
import PDFPlaceholder from "./PDFPlaceholder";
import PDFDocument from "./PDFDocument";

const PDFViewer = memo(({ pdfUrl }) => {
  const [loading, setLoading] = useState(true);

  const onDocumentLoadSuccess = () => {
    setLoading(false);
  };

  if (!pdfUrl) {
    return <PDFPlaceholder />;
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* PDF Content */}
      <div className="flex-1 overflow-y-auto overflow-x-auto p-2">
        {loading && (
          <div className="flex items-center justify-center h-full">
            <LoadingSpinner size="md" color="purple" />
          </div>
        )}

        <div className="w-full h-full">
          <PDFDocument
            pdfUrl={pdfUrl}
            onDocumentLoadSuccess={onDocumentLoadSuccess}
            onLoadError={(error) => {
              console.error("PDF load error:", error);
              setLoading(false);
            }}
          />
        </div>
      </div>
    </div>
  );
});

export default PDFViewer;
