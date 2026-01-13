"use client";

import React from "react";
import {
  X,
  Star,
  Award,
  BookOpen,
  FileText,
  Clock,
  GraduationCap,
  Sparkles,
  ChevronRight,
  Target,
  PenTool,
  Lightbulb,
} from "lucide-react";
import { Mentor } from "./types";
import { getRoleIcon, getRoleColor } from "./utils";

interface MentorInfoProps {
  mentor: Mentor;
  showMobileInfo: boolean;
  onCloseMobileInfo: () => void;
}

export const MentorInfo: React.FC<MentorInfoProps> = ({
  mentor,
  showMobileInfo,
  onCloseMobileInfo,
}) => {
  const RoleIcon = getRoleIcon(mentor.roleCode);
  const roleColors = getRoleColor(mentor.roleCode);

  return (
    <div
      className={`w-72 bg-white dark:bg-slate-800 border-l border-gray-200 dark:border-slate-700 flex flex-col h-full overflow-hidden ${
        showMobileInfo
          ? "fixed inset-y-0 right-0 z-50 shadow-2xl"
          : "hidden lg:flex"
      }`}
    >
      {/* Mobile Close Button */}
      {showMobileInfo && (
        <button
          onClick={onCloseMobileInfo}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full lg:hidden text-gray-600 dark:text-slate-300"
        >
          <X size={20} />
        </button>
      )}

      {/* Mentor Profile */}
      <div className="p-4 text-center border-b border-gray-200 dark:border-slate-700 shrink-0">
        <div className="relative inline-block mb-3">
          <img
            src={mentor.avatar}
            alt={mentor.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-white dark:border-slate-800 shadow-md mx-auto"
          />
          {mentor.isOnline && (
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-slate-800" />
          )}
        </div>
        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1.5">
          {mentor.name}
        </h3>
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${roleColors.bg} dark:bg-slate-700 ${roleColors.text} dark:text-slate-300`}
        >
          <RoleIcon size={12} />
          {mentor.roleCode}
        </span>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {/* Role Description */}
        <div className="p-3 border-b border-gray-200 dark:border-slate-700">
          <h4 className="text-xs font-bold text-gray-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
            <BookOpen size={14} className="text-blue-600 dark:text-blue-400" />
            Vai trò
          </h4>
          <p className="text-xs text-gray-600 dark:text-slate-400 leading-relaxed line-clamp-3">
            {mentor.description}
          </p>
        </div>

        {/* Achievements */}
        <div className="p-3 border-b border-gray-200 dark:border-slate-700">
          <h4 className="text-xs font-bold text-gray-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
            <Award size={14} className="text-yellow-500 dark:text-yellow-400" />
            Thành tựu
          </h4>
          <ul className="space-y-1.5">
            {mentor.achievements.slice(0, 3).map((achievement, index) => (
              <li
                key={index}
                className="flex items-start gap-1.5 text-xs text-gray-600 dark:text-slate-400"
              >
                <Star
                  size={12}
                  className="text-yellow-500 dark:text-yellow-400 mt-0.5 shrink-0"
                />
                <span className="line-clamp-2">{achievement}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Actions */}
        <div className="p-3 border-b border-gray-200 dark:border-slate-700">
          <h4 className="text-xs font-bold text-gray-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
            <Sparkles
              size={14}
              className="text-purple-500 dark:text-purple-400"
            />
            Thao tác nhanh
          </h4>
          <div className="space-y-1.5">
            <button className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 rounded-lg transition-colors group">
              <span className="flex items-center gap-1.5 text-xs text-gray-700 dark:text-slate-300">
                <FileText
                  size={14}
                  className="text-blue-500 dark:text-blue-400"
                />
                File đã gửi
              </span>
              <ChevronRight
                size={14}
                className="text-gray-400 dark:text-slate-500 group-hover:text-gray-600 dark:group-hover:text-slate-300"
              />
            </button>
            <button className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 rounded-lg transition-colors group">
              <span className="flex items-center gap-1.5 text-xs text-gray-700 dark:text-slate-300">
                <Clock
                  size={14}
                  className="text-orange-500 dark:text-orange-400"
                />
                Đặt lịch hẹn
              </span>
              <ChevronRight
                size={14}
                className="text-gray-400 dark:text-slate-500 group-hover:text-gray-600 dark:group-hover:text-slate-300"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Role Legend - Fixed at bottom */}
      <div className="p-3 border-t border-gray-200 dark:border-slate-700 shrink-0 bg-white dark:bg-slate-800">
        <h4 className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase mb-2 tracking-wider">
          Vai trò
        </h4>
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center gap-1.5 p-1.5 bg-blue-50 dark:bg-blue-900/30 rounded">
            <Target size={12} className="text-blue-600 dark:text-blue-400" />
            <span className="font-semibold text-blue-700 dark:text-blue-300">AS</span>
            <span className="text-blue-600 dark:text-blue-400 text-[10px]">- Chiến lược</span>
          </div>
          <div className="flex items-center gap-1.5 p-1.5 bg-purple-50 dark:bg-purple-900/30 rounded">
            <PenTool
              size={12}
              className="text-purple-600 dark:text-purple-400"
            />
            <span className="font-semibold text-purple-700 dark:text-purple-300">ACS</span>
            <span className="text-purple-600 dark:text-purple-400 text-[10px]">- Biên tập</span>
          </div>
          <div className="flex items-center gap-1.5 p-1.5 bg-emerald-50 dark:bg-emerald-900/30 rounded">
            <Lightbulb
              size={12}
              className="text-emerald-600 dark:text-emerald-400"
            />
            <span className="font-semibold text-emerald-700 dark:text-emerald-300">ARD</span>
            <span className="text-emerald-600 dark:text-emerald-400 text-[10px]">- Phát triển</span>
          </div>
        </div>
      </div>
    </div>
  );
};
