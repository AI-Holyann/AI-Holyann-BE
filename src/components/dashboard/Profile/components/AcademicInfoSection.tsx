"use client";

import React from "react";
import { BookOpen, Globe } from "lucide-react";
import { StudentProfile } from "../../../types";
import { StatusBadge } from "./StatusBadge";

interface AcademicInfoSectionProps {
  profile: StudentProfile;
  isComplete: boolean;
}

export const AcademicInfoSection: React.FC<AcademicInfoSectionProps> = ({
  profile,
  isComplete,
}) => {
  return (
    <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center bg-gray-50 dark:bg-slate-900">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <BookOpen className="text-[var(--brand-deep)]" size={20} />
          THÔNG TIN HỌC THUẬT
        </h3>
        <StatusBadge isComplete={isComplete} />
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
          <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">
            GPA Hiện tại
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-blue-900 dark:text-blue-200">
              {profile.gpa}
            </span>
            <span className="text-sm text-blue-500 dark:text-blue-400">
              / {profile.gpaScale}
            </span>
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-800">
          <p className="text-sm text-purple-600 dark:text-purple-400 font-medium mb-1">
            Trình độ ngoại ngữ
          </p>
          <div className="flex items-center gap-2">
            <Globe size={20} className="text-purple-500 dark:text-purple-400" />
            <span className="text-xl font-bold text-purple-900 dark:text-purple-200">
              {profile.englishLevel}
            </span>
          </div>
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-100 dark:border-orange-800">
          <p className="text-sm text-orange-600 dark:text-orange-400 font-medium mb-1">
            Mục tiêu du học
          </p>
          <div className="flex flex-col">
            <span className="font-bold text-orange-900 dark:text-orange-200">
              {profile.targetMajor}
            </span>
            <span className="text-xs text-orange-600 dark:text-orange-400">
              tại {profile.targetCountry}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
