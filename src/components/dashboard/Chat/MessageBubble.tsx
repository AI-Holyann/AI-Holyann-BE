"use client";

import React from "react";
import { CheckCheck } from "lucide-react";
import { Message } from "./types";
import { formatMessageTime } from "./utils";

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  return (
    <div
      className={`flex items-end gap-2 ${
        message.isMine ? "flex-row-reverse" : ""
      }`}
    >
      {!message.isMine && (
        <img
          src={message.senderAvatar}
          alt={message.senderName}
          className="w-7 h-7 md:w-8 md:h-8 rounded-full object-cover shrink-0"
        />
      )}
      <div
        className={`max-w-[75%] md:max-w-[70%] ${
          message.isMine ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`px-3 py-2 md:px-4 md:py-3 rounded-xl md:rounded-2xl ${
            message.isMine
              ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md"
              : "bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-800 dark:text-slate-200 rounded-bl-md shadow-sm"
          }`}
        >
          <p className="text-sm leading-relaxed break-words">{message.content}</p>
        </div>
        <div
          className={`flex items-center gap-1 mt-1 ${
            message.isMine ? "justify-end" : "justify-start"
          }`}
        >
          <span className="text-xs text-gray-400 dark:text-slate-500">
            {formatMessageTime(message.timestamp)}
          </span>
          {message.isMine && (
            <CheckCheck
              size={14}
              className={
                message.isRead
                  ? "text-blue-500 dark:text-blue-400"
                  : "text-gray-400 dark:text-slate-500"
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};
