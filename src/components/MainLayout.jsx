import React, { memo, useState, useCallback } from "react";
import PDFViewer from "./PDFViewer";
import ChatInterface from "./ChatInterface";
import { sendChatMessage } from "../services/apiService";

// Memoized PDF Viewer component that only re-renders when pdfUrl changes
const MemoizedPDFViewer = memo(({ pdfUrl }) => (
  <div className="w-1/2 flex flex-col bg-white border-r border-gray-200">
    <div className="flex-1 overflow-hidden">
      <PDFViewer pdfUrl={pdfUrl} />
    </div>
  </div>
));

// Memoized Chat Interface component that manages its own state
const MemoizedChatInterface = memo(({ fileId, onUploadSuccess }) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);

  const handleSendMessage = useCallback(
    async (message) => {
      if (!fileId) return;

      const userMessage = {
        text: message,
        isUser: true,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      try {
        const response = await sendChatMessage(message, fileId, chatHistory);

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
    [fileId, chatHistory]
  );

  return (
    <div className="w-1/2 flex flex-col bg-white">
      <ChatInterface
        messages={messages}
        onSendMessage={handleSendMessage}
        onUploadSuccess={onUploadSuccess}
        isUploading={false}
        isLoading={isLoading}
      />
    </div>
  );
});

const MainLayout = ({ pdfUrl, fileId, onUploadNew, onUploadSuccess }) => {
  return (
    <div className="h-screen flex bg-white overflow-hidden">
      <MemoizedPDFViewer pdfUrl={pdfUrl} />
      <MemoizedChatInterface
        fileId={fileId}
        onUploadNew={onUploadNew}
        onUploadSuccess={onUploadSuccess}
      />
    </div>
  );
};

export default MainLayout;
