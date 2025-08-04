import React, { useState, useRef, useEffect, memo } from "react";
import { Send, FileText, CheckCircle, Bot, User } from "lucide-react";
import UploadNewButton from "./UploadNewButton";
import TypingIndicator from "./TypingIndicator";
import { formatMessageContent } from "../utils/messageFormatter";

const ChatInterface = memo(
  ({ messages, onSendMessage, onUploadSuccess, isUploading, isLoading }) => {
    const [inputMessage, setInputMessage] = useState("");
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
      scrollToBottom();
    }, [messages]);

    const handleSubmit = (e) => {
      e.preventDefault();
      if (inputMessage.trim()) {
        onSendMessage(inputMessage);
        setInputMessage("");
      }
    };

    const handleKeyPress = (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        handleSubmit(e);
      }
    };

    const handleUploadSuccess = (fileId, fileName) => {
      onUploadSuccess(fileId, fileName);
    };

    return (
      <div className="h-full flex flex-col bg-white min-w-0 flex-shrink-0">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4 flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-gray-900">
                Your document is ready!
              </span>
            </div>
            <UploadNewButton
              onUploadSuccess={handleUploadSuccess}
              disabled={isUploading}
            />
          </div>
          <p className="text-sm text-gray-600 mb-2">
            You can now ask questions about your document. For example:
          </p>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• What is the main topic of this document?</li>
            <li>• Can you summarize the key points?</li>
            <li>• What are the conclusions or recommendations?</li>
          </ul>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-3 min-w-0">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Start a conversation about your document</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.isUser ? "justify-end" : "justify-start"
                }`}
              >
                {!message.isUser && (
                  <div className="flex items-start space-x-2">
                    {message.isError ? (
                      <svg
                        className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <Bot className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    )}
                    <div
                      className={`max-w-[85%] rounded-lg px-3 py-2 ${
                        message.isError
                          ? "bg-red-100 text-red-900 border border-red-300"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <div className="flex-1">
                        <div
                          className="text-sm"
                          dangerouslySetInnerHTML={{
                            __html: formatMessageContent(
                              message.text,
                              message.isUser
                            ),
                          }}
                        />
                        {message.timestamp && (
                          <p
                            className={`text-xs mt-1 ${
                              message.isError ? "text-red-600" : "text-gray-500"
                            }`}
                          >
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </p>
                        )}
                      </div>
                      {message.text.includes("File selected for chat") && (
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                )}
                {message.isUser && (
                  <div className="flex items-start space-x-2">
                    <div className="max-w-[85%] rounded-lg px-3 py-2 bg-blue-600 text-white">
                      <div className="flex-1">
                        <div
                          className="text-sm"
                          dangerouslySetInnerHTML={{
                            __html: formatMessageContent(
                              message.text,
                              message.isUser
                            ),
                          }}
                        />
                        {message.timestamp && (
                          <p className="text-xs mt-1 text-blue-200">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <User className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  </div>
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />

          {/* Typing Indicator */}
          {isLoading && <TypingIndicator />}
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 p-4">
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about the document..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              disabled={isUploading || isLoading}
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isUploading || isLoading}
              className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    );
  }
);

export default ChatInterface;
