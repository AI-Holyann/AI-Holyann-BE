"use client";

import React from "react";
import { Phone, Video, MoreVertical, Menu } from "lucide-react";
import { Mentor } from "./types";
import { getRoleIcon, getRoleColor } from "./utils";

interface ChatHeaderProps {
  mentor: Mentor;
  onToggleMobileInfo?: () => void;
  onToggleMobileConversations?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  mentor,
  onToggleMobileInfo,
  onToggleMobileConversations,
}) => {
  const RoleIcon = getRoleIcon(mentor.roleCode);
  const roleColors = getRoleColor(mentor.roleCode);

  return (
    <div className="px-4 md:px-6 py-3 md:py-4 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between bg-white dark:bg-slate-800">
      <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
        {/* Mobile Menu Button */}
        {onToggleMobileConversations && (
          <button
            onClick={onToggleMobileConversations}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors text-gray-600 dark:text-slate-300 md:hidden"
          >
            <Menu size={20} />
          </button>
        )}
        <div className="relative">
          <img
            src={mentor.avatar}
            alt={mentor.name}
            className="w-11 h-11 rounded-full object-cover border-2 border-gray-100 dark:border-slate-700"
          />
          {mentor.isOnline && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-800" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-gray-900 dark:text-white truncate text-sm md:text-base">
            {mentor.name}
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${roleColors.bg} dark:bg-slate-700 ${roleColors.text} dark:text-slate-300 shrink-0`}
            >
              <RoleIcon size={12} />
              <span className="hidden sm:inline">{mentor.roleTitle}</span>
              <span className="sm:hidden">{mentor.roleCode}</span>
            </span>
            <span className="text-xs text-gray-500 dark:text-slate-400 hidden sm:inline">
              {mentor.isOnline
                ? "● Đang hoạt động"
                : `Hoạt động ${mentor.lastSeen}`}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1 md:gap-2 shrink-0">
        <button className="p-2 md:p-2.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors text-gray-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hidden sm:flex">
          <Phone size={20} />
        </button>
        <button className="p-2 md:p-2.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors text-gray-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hidden sm:flex">
          <Video size={20} />
        </button>
        {onToggleMobileInfo && (
          <button
            onClick={onToggleMobileInfo}
            className="p-2.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors text-gray-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 lg:hidden"
          >
            <MoreVertical size={20} />
          </button>
        )}
      </div>
    </div>
  );
};
