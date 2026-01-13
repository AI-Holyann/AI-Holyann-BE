"use client";

import React from "react";
import { MessageCircle, Search, X } from "lucide-react";
import { Conversation } from "./types";
import { getRoleIcon, getRoleColor, formatTime } from "./utils";

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId: string;
  searchQuery: string;
  onSelectConversation: (conversation: Conversation) => void;
  onSearchChange: (query: string) => void;
  showMobile?: boolean;
  onCloseMobile?: () => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedConversationId,
  searchQuery,
  onSelectConversation,
  onSearchChange,
  showMobile = false,
  onCloseMobile,
}) => {
  const filteredConversations = conversations.filter(
    (conv) =>
      conv.mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.mentor.roleTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className={`w-full md:w-80 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 flex flex-col fixed md:relative inset-y-0 left-0 z-50 md:z-auto transform transition-transform duration-300 ease-in-out ${
        showMobile ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0`}
    >
      {/* Header */}
      <div className="p-3 md:p-4 border-b border-gray-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <MessageCircle
              className="text-blue-600 dark:text-blue-400"
              size={20}
            />
            <span className="hidden sm:inline">Trao Đổi</span>
            <span className="sm:hidden">Chat</span>
          </h2>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors text-gray-600 dark:text-slate-300 md:hidden"
            >
              <X size={20} />
            </button>
          )}
        </div>
        {/* Search */}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500"
            size={16}
          />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 md:pl-10 pr-3 md:pr-4 py-2 md:py-2.5 bg-gray-100 dark:bg-slate-700 rounded-lg md:rounded-xl border-0 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:bg-white dark:focus:bg-slate-600 transition-all text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400"
          />
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.map((conv) => {
          const ConvIcon = getRoleIcon(conv.mentor.roleCode);
          const convColors = getRoleColor(conv.mentor.roleCode);
          const isSelected = selectedConversationId === conv.id;

          return (
            <div
              key={conv.id}
              onClick={() => onSelectConversation(conv)}
              className={`p-3 md:p-4 cursor-pointer border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors ${
                isSelected
                  ? "bg-blue-50 dark:bg-blue-900/30 border-l-4 border-l-blue-500 dark:border-l-blue-400"
                  : ""
              }`}
            >
              <div className="flex items-start gap-2 md:gap-3">
                {/* Avatar */}
                <div className="relative shrink-0">
                  <img
                    src={conv.mentor.avatar}
                    alt={conv.mentor.name}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-white dark:border-slate-800 shadow-sm"
                  />
                  {conv.mentor.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white dark:border-slate-800" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3
                      className={`font-semibold truncate ${
                        isSelected
                          ? "text-blue-700 dark:text-blue-300"
                          : "text-gray-900 dark:text-white"
                      }`}
                    >
                      {conv.mentor.name}
                    </h3>
                    <span className="text-xs text-gray-500 dark:text-slate-400 shrink-0 ml-2">
                      {formatTime(conv.lastMessageTime)}
                    </span>
                  </div>

                  {/* Role Badge */}
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${convColors.bg} ${convColors.text}`}
                    >
                      <ConvIcon size={12} />
                      {conv.mentor.roleCode}
                    </span>
                  </div>

                  {/* Last Message */}
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 dark:text-slate-300 truncate pr-2">
                      {conv.lastMessage}
                    </p>
                    {conv.unreadCount > 0 && (
                      <span className="shrink-0 w-5 h-5 bg-blue-600 dark:bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
