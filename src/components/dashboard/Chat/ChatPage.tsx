"use client";

import React, { useState, useRef, useEffect } from "react";
import { Conversation, Message } from "./types";
import { CONVERSATIONS } from "./data";
import { ConversationList } from "./ConversationList";
import { ChatHeader } from "./ChatHeader";
import { MessagesList } from "./MessagesList";
import { MessageInput } from "./MessageInput";
import { MentorInfo } from "./MentorInfo";

// Main Component
export const ChatPage: React.FC = () => {
  const [conversations] = useState<Conversation[]>(CONVERSATIONS);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation>(CONVERSATIONS[0]);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileInfo, setShowMobileInfo] = useState(false);
  const [showMobileConversations, setShowMobileConversations] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: "student",
      senderName: "Bạn",
      senderAvatar: "/images/avatars/avt.jpg",
      content: messageInput,
      timestamp: new Date(),
      isRead: false,
      isMine: true,
    };

    // Add message to conversation (in real app, this would be an API call)
    selectedConversation.messages.push(newMessage);
    setMessageInput("");

    // Force scroll to bottom after sending message
    setTimeout(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop =
          messagesContainerRef.current.scrollHeight;
      }
    }, 50);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setShowMobileConversations(false); // Close mobile menu after selection
  };

  return (
    <div className="h-[calc(100vh-4rem)] md:h-[calc(100vh-theme(spacing.16))] bg-gray-50 dark:bg-slate-900 flex overflow-hidden relative">
      {/* ========== LEFT SIDEBAR - Conversation List ========== */}
      <ConversationList
        conversations={conversations}
        selectedConversationId={selectedConversation.id}
        searchQuery={searchQuery}
        onSelectConversation={handleSelectConversation}
        onSearchChange={setSearchQuery}
        showMobile={showMobileConversations}
        onCloseMobile={() => setShowMobileConversations(false)}
      />

      {/* Mobile Overlay */}
      {showMobileConversations && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setShowMobileConversations(false)}
        />
      )}

      {/* ========== MAIN CHAT AREA ========== */}
      <div className="flex-1 flex flex-col bg-white dark:bg-slate-800 min-h-0 w-full md:w-auto">
        <ChatHeader
          mentor={selectedConversation.mentor}
          onToggleMobileInfo={() => setShowMobileInfo(!showMobileInfo)}
          onToggleMobileConversations={() =>
            setShowMobileConversations(!showMobileConversations)
          }
        />

        <MessagesList
          messages={selectedConversation.messages}
          messagesEndRef={messagesEndRef}
          messagesContainerRef={messagesContainerRef}
          conversationId={selectedConversation.id}
        />

        <MessageInput
          messageInput={messageInput}
          onInputChange={setMessageInput}
          onSendMessage={handleSendMessage}
          onKeyPress={handleKeyPress}
        />
      </div>

      {/* ========== RIGHT SIDEBAR - Mentor Info ========== */}
      <MentorInfo
        mentor={selectedConversation.mentor}
        showMobileInfo={showMobileInfo}
        onCloseMobileInfo={() => setShowMobileInfo(false)}
      />
    </div>
  );
};

export default ChatPage;
