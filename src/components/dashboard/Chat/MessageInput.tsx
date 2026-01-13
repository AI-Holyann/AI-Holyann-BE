"use client";

import React from "react";
import { Send, Paperclip, Image, Smile } from "lucide-react";

interface MessageInputProps {
  messageInput: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  messageInput,
  onInputChange,
  onSendMessage,
  onKeyPress,
}) => {
  return (
    <div className="p-3 md:p-4 border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
      <div className="flex items-end gap-2 md:gap-3">
        {/* Attachment Buttons */}
        <div className="flex items-center gap-0.5 md:gap-1">
          <button className="p-2 md:p-2.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors text-gray-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">
            <Paperclip size={18} className="md:w-5 md:h-5" />
          </button>
          <button className="p-2 md:p-2.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors text-gray-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">
            <Image size={18} className="md:w-5 md:h-5" />
          </button>
        </div>

        {/* Input Field */}
        <div className="flex-1 relative">
          <textarea
            value={messageInput}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyPress={onKeyPress}
            placeholder="Nhập tin nhắn..."
            rows={1}
            className="w-full px-3 md:px-4 py-2 md:py-3 bg-gray-100 dark:bg-slate-700 rounded-xl md:rounded-2xl border-0 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:bg-white dark:focus:bg-slate-600 resize-none text-sm transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400"
            style={{ minHeight: "44px", maxHeight: "120px" }}
          />
          <button className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 p-1 md:p-1.5 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-full transition-colors text-gray-500 dark:text-slate-400 hidden sm:block">
            <Smile size={18} className="md:w-5 md:h-5" />
          </button>
        </div>

        {/* Send Button */}
        <button
          onClick={onSendMessage}
          disabled={!messageInput.trim()}
          className={`p-2.5 md:p-3 rounded-full transition-all shrink-0 ${
            messageInput.trim()
              ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-blue-500/30 hover:scale-105"
              : "bg-gray-200 dark:bg-slate-700 text-gray-400 dark:text-slate-500 cursor-not-allowed"
          }`}
        >
          <Send size={18} className="md:w-5 md:h-5" />
        </button>
      </div>
    </div>
  );
};
