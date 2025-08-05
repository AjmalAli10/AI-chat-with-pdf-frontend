import React, { useEffect, useState, useRef, useCallback } from "react";
import * as pdfjsLib from "pdfjs-dist";
import LoadingSpinner from "./LoadingSpinner";
import { logPDFError, validatePDFUrl } from "../utils/pdfDebug";
import { configurePDFWorker } from "../utils/pdfLoader";

// Configure PDF worker on component mount
configurePDFWorker();

// Production-aware logging
const log = (message, type = "log") => {
  if (import.meta.env.PROD) {
    // Only log errors in production
    if (type === "error") {
      console.error(message);
    }
  } else {
    // Log everything in development
    console[type](message);
  }
};

const PDFDocument = ({ pdfUrl, onDocumentLoadSuccess, onLoadError }) => {
  const [pdfDocument, setPdfDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [renderedPages, setRenderedPages] = useState([]);
  const canvasRefs = useRef({});
  const renderTaskRefs = useRef({});
  const isRenderingRef = useRef(false);

  // Cleanup function for rendering tasks
  const cleanupRenderTasks = useCallback(() => {
    Object.values(renderTaskRefs.current).forEach((task) => {
      if (task) {
        task.cancel();
      }
    });
    renderTaskRefs.current = {};
    isRenderingRef.current = false;
  }, []);

  useEffect(() => {
    const loadPDF = async () => {
      // Don't load if no URL is provided
      if (!pdfUrl) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        setRenderedPages([]);

        // Validate PDF URL
        if (!validatePDFUrl(pdfUrl)) {
          throw new Error("Invalid PDF URL");
        }

        // Load the PDF document
        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;

        setPdfDocument(pdf);

        if (onDocumentLoadSuccess) {
          onDocumentLoadSuccess();
        }

        setLoading(false);
      } catch (error) {
        log("Failed to load PDF: " + error.message, "error");
        logPDFError(error, "PDFDocument.loadPDF");
        setError(error);
        setLoading(false);
        if (onLoadError) {
          onLoadError(error);
        }
      }
    };

    loadPDF();
  }, [pdfUrl, onDocumentLoadSuccess, onLoadError]);

  // Render a single page with high quality
  const renderPage = useCallback(async (page, pageNumber) => {
    const canvasKey = `page-${pageNumber}`;
    const canvas = canvasRefs.current[canvasKey];

    if (!canvas) {
      log(
        `Canvas not available for page ${pageNumber} - this should not happen with the retry mechanism`,
        "warn"
      );
      return null;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      log(`Failed to get canvas context for page ${pageNumber}`, "error");
      return null;
    }

    // Use a smaller scale to ensure content fits without clipping
    const scale = 1.0; // Use 1.0 scale to see full content
    const viewport = page.getViewport({ scale });

    // Set canvas dimensions with high DPI for crisp rendering
    const pixelRatio = window.devicePixelRatio || 1;
    canvas.width = viewport.width * pixelRatio;
    canvas.height = viewport.height * pixelRatio;
    canvas.style.width = viewport.width + "px";
    canvas.style.height = viewport.height + "px";

    // Scale the context to account for the pixel ratio
    context.scale(pixelRatio, pixelRatio);

    // Clear the canvas
    context.clearRect(0, 0, viewport.width, viewport.height);

    // Render the page with high quality settings
    const renderContext = {
      canvasContext: context,
      viewport: viewport,
      enableWebGL: true,
      renderInteractiveForms: false,
    };

    try {
      renderTaskRefs.current[canvasKey] = page.render(renderContext);
      await renderTaskRefs.current[canvasKey].promise;
      renderTaskRefs.current[canvasKey] = null;

      return {
        pageNumber,
        canvasKey,
        width: viewport.width,
        height: viewport.height,
      };
    } catch (error) {
      log(`Failed to render page ${pageNumber}: ${error.message}`, "error");
      return null;
    }
  }, []);

  useEffect(() => {
    const renderAllPages = async () => {
      if (!pdfDocument || isRenderingRef.current) return;

      try {
        // Cancel any ongoing render tasks
        cleanupRenderTasks();

        // Set rendering flag
        isRenderingRef.current = true;

        const totalPages = pdfDocument.numPages;
        const pages = [];

        // Wait for canvas elements to be created in the DOM
        await new Promise((resolve) => setTimeout(resolve, 200));

        // Render pages sequentially to avoid memory issues
        for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
          try {
            // Wait for canvas to be available
            let retries = 0;
            const maxRetries = 10;

            while (
              !canvasRefs.current[`page-${pageNumber}`] &&
              retries < maxRetries
            ) {
              await new Promise((resolve) => setTimeout(resolve, 100));
              retries++;
            }

            if (!canvasRefs.current[`page-${pageNumber}`]) {
              log(
                `Canvas for page ${pageNumber} not available after ${maxRetries} retries`,
                "warn"
              );
              continue;
            }

            const page = await pdfDocument.getPage(pageNumber);
            const renderedPage = await renderPage(page, pageNumber);

            if (renderedPage) {
              pages.push(renderedPage);
              // Update state after each page for progressive loading
              setRenderedPages((prev) => [...prev, renderedPage]);
            }
          } catch (error) {
            log(`Failed to render page ${pageNumber}:`, "error");
            logPDFError(error, `PDFDocument.renderPage-${pageNumber}`);
          }
        }

        isRenderingRef.current = false;
      } catch (error) {
        log("Failed to render PDF pages:", "error");
        logPDFError(error, "PDFDocument.renderAllPages");
        setError(error);
        isRenderingRef.current = false;
      }
    };

    renderAllPages();
  }, [pdfDocument, cleanupRenderTasks, renderPage]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupRenderTasks();
    };
  }, [cleanupRenderTasks]);

  // Don't render anything if no PDF URL is provided
  if (!pdfUrl) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-gray-500">No PDF selected</div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="md" color="blue" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-500 mb-2">Failed to load PDF</div>
          <div className="text-sm text-gray-500">{error.message}</div>
        </div>
      </div>
    );
  }

  if (!pdfDocument) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-gray-500">Loading PDF...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-2 w-full">
      {Array.from({ length: pdfDocument.numPages }, (_, index) => {
        const pageNumber = index + 1;
        const canvasKey = `page-${pageNumber}`;
        const renderedPage = renderedPages.find(
          (p) => p.pageNumber === pageNumber
        );

        return (
          <div key={canvasKey} className="w-full flex flex-col items-center">
            <div className="text-sm text-gray-600 mb-1 text-center">
              Page {pageNumber} of {pdfDocument.numPages}
            </div>
            <div className="w-full overflow-x-auto">
              <div className="inline-block">
                <canvas
                  ref={(el) => {
                    canvasRefs.current[canvasKey] = el;
                  }}
                  className="border border-gray-200 rounded-lg shadow-sm"
                  style={{
                    imageRendering: "high-quality",
                    display: "block",
                  }}
                />
              </div>
            </div>
            {!renderedPage && (
              <div className="flex items-center justify-center h-16">
                <LoadingSpinner size="sm" color="blue" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PDFDocument;
