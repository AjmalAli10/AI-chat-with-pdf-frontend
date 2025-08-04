import { Bot } from "lucide-react";

// Typing Indicator Component
const TypingIndicator = () => (
  <div className="flex justify-start">
    <div className="flex items-start space-x-2">
      <Bot className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
      <div className="max-w-[85%] rounded-lg px-3 py-2 bg-purple-50 text-purple-900 border border-purple-200">
        <div className="flex items-center space-x-1">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            <div
              className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default TypingIndicator;
