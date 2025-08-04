import React, { useState } from "react";
import PDFUpload from "./components/PDFUpload";
import MainLayout from "./components/MainLayout";
import ErrorBoundary from "./components/ErrorBoundary";
import { getPDFUrl } from "./services/apiService";
import "./App.css";

function App() {
  const [currentPDF, setCurrentPDF] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);

  const handleUploadSuccess = (fileId, fileName) => {
    setCurrentPDF(fileId);
    const url = getPDFUrl(fileName);
    setPdfUrl(url);
  };

  const handleUploadNew = () => {
    setCurrentPDF(null);
    setPdfUrl(null);
  };

  return (
    <ErrorBoundary>
      <div className="App">
        {!currentPDF ? (
          <PDFUpload onUploadSuccess={handleUploadSuccess} />
        ) : (
          <MainLayout
            pdfUrl={pdfUrl}
            fileId={currentPDF}
            onUploadNew={handleUploadNew}
            onUploadSuccess={(fileId, fileName) => {
              setCurrentPDF(fileId);
              const url = getPDFUrl(fileName);
              setPdfUrl(url);
            }}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;
