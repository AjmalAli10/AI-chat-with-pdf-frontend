import { useState, useCallback } from "react";
import { uploadPDF, sendChatMessage, getPDFUrl } from "../services/apiService";

export const useAppState = () => {
  const [currentPDF, setCurrentPDF] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);

  const handleFileUpload = useCallback(async (file) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      console.log("Starting file upload:", file.name, file.size, file.type);

      const response = await uploadPDF(file, setUploadProgress);

      console.log("Upload response:", response);

      if (response.success) {
        setCurrentPDF(response.data.fileId);
        const url = getPDFUrl(response.data.fileName);
        setPdfUrl(url);
        setMessages([]); // Clear previous chat messages
        setChatHistory([]); // Clear chat history

        // Add success message
        setMessages((prev) => [
          ...prev,
          {
            text: `📄 Uploaded: ${response.data.originalName}`,
            isUser: false,
            timestamp: new Date().toISOString(),
          },
        ]);

        setMessages((prev) => [
          ...prev,
          {
            text: `Document type: ${response.data.documentType}`,
            isUser: false,
            timestamp: new Date().toISOString(),
          },
        ]);

        setMessages((prev) => [
          ...prev,
          {
            text: `✅ File selected for chat. You can now ask questions about this document.`,
            isUser: false,
            timestamp: new Date().toISOString(),
          },
        ]);
      } else {
        throw new Error(response.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload failed:", error);

      // Provide more specific error messages
      let errorMessage = "Upload failed. Please try again.";

      if (error.message.includes("Only PDF files are allowed")) {
        errorMessage = "Please select a valid PDF file.";
      } else if (error.message.includes("Network error")) {
        errorMessage = "Network error. Please check your connection.";
      } else if (error.message.includes("timeout")) {
        errorMessage = "Upload timed out. Please try again.";
      } else if (error.message.includes("413")) {
        errorMessage = "File is too large. Please select a smaller PDF file.";
      }

      alert(errorMessage);

      // Add error message to chat
      setMessages((prev) => [
        ...prev,
        {
          text: `❌ Upload failed: ${errorMessage}`,
          isUser: false,
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, []);

  const handleSendMessage = useCallback(
    async (message) => {
      if (!currentPDF) return;

      const userMessage = {
        text: message,
        isUser: true,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      try {
        const response = await sendChatMessage(
          message,
          currentPDF,
          chatHistory
        );

        if (response.success) {
          const botMessage = {
            text:
              response.response || "Sorry, I could not process your request.",
            isUser: false,
            timestamp: new Date().toISOString(),
          };

          setMessages((prev) => [...prev, botMessage]);

          // Update chat history for context
          const newHistory = [
            ...chatHistory,
            { role: "user", content: message },
            { role: "assistant", content: response.response },
          ];
          setChatHistory(newHistory);
        } else {
          throw new Error(response.message || "Chat failed");
        }
      } catch (error) {
        console.error("Chat error:", error);

        const errorMessage = {
          text: "Sorry, there was an error processing your message. Please try again.",
          isUser: false,
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [currentPDF, chatHistory]
  );

  const handleUploadNew = useCallback(() => {
    setCurrentPDF(null);
    setPdfUrl(null);
    setMessages([]);
    setChatHistory([]);
  }, []);

  return {
    currentPDF,
    pdfUrl,
    messages,
    isUploading,
    uploadProgress,
    isLoading,
    handleFileUpload,
    handleSendMessage,
    handleUploadNew,
  };
};
