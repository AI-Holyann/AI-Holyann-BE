"use client";

import React from "react";
import { Edit3, Sparkles } from "lucide-react";

interface ProfileHeaderProps {
  onEditClick: () => void;
  onAnalyzeProfile?: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  onEditClick,
  onAnalyzeProfile,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Hồ sơ học sinh
        </h1>
        <p className="text-gray-500 dark:text-slate-400 mt-1">
          Quản lý toàn diện thông tin cá nhân và hồ sơ du học
        </p>
      </div>
      <div className="flex gap-3">
        {onAnalyzeProfile && (
          <button
            onClick={onAnalyzeProfile}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
          >
            <Sparkles size={18} />
            Phân tích hồ sơ AI
          </button>
        )}
        <button
          onClick={onEditClick}
          className="flex items-center gap-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-md"
        >
          <Edit3 size={18} />
          Cập nhật hồ sơ
        </button>
      </div>
    </div>
  );
};
