"use client";

import React, { useRef, useEffect } from "react";
import { Message } from "./types";
import { MessageBubble } from "./MessageBubble";

interface MessagesListProps {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  messagesContainerRef: React.RefObject<HTMLDivElement | null>;
  conversationId?: string;
}

export const MessagesList: React.FC<MessagesListProps> = ({
  messages,
  messagesEndRef,
  messagesContainerRef,
  conversationId,
}) => {
  // Auto scroll to bottom immediately when conversation changes
  useEffect(() => {
    if (!messagesContainerRef.current || !conversationId) return;

    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop =
          messagesContainerRef.current.scrollHeight;
      }
    });
  }, [conversationId, messagesContainerRef]);

  // Auto scroll to bottom when messages change - only scroll if user is near bottom
  useEffect(() => {
    if (
      !messagesContainerRef.current ||
      !messagesEndRef.current ||
      !conversationId
    )
      return;

    const container = messagesContainerRef.current;
    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      150;

    if (isNearBottom) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    }
  }, [messages, messagesContainerRef, messagesEndRef, conversationId]);

  return (
    <div
      ref={messagesContainerRef}
      className="flex-1 overflow-y-auto p-3 md:p-6 space-y-3 md:space-y-4 bg-gradient-to-b from-gray-50/50 dark:from-slate-900/50 to-white dark:to-slate-800 min-h-0"
    >
      {/* Date Separator */}
      <div className="flex items-center justify-center">
        <div className="px-3 md:px-4 py-1 md:py-1.5 bg-gray-100 dark:bg-slate-700 rounded-full text-xs text-gray-500 dark:text-slate-400 font-medium">
          Hôm nay
        </div>
      </div>

      {/* Messages */}
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};
