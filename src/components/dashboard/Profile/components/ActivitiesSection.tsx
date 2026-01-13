"use client";

import React from "react";
import { Award, GraduationCap } from "lucide-react";
import { StudentProfile } from "../../../types";
import { StatusBadge } from "./StatusBadge";

interface ActivitiesSectionProps {
  profile: StudentProfile;
  isComplete: boolean;
}

export const ActivitiesSection: React.FC<ActivitiesSectionProps> = ({
  profile,
  isComplete,
}) => {
  return (
    <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center bg-gray-50 dark:bg-slate-900">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Award className="text-yellow-500" size={20} />
          HOẠT ĐỘNG & THÀNH TÍCH
        </h3>
        <StatusBadge isComplete={isComplete} />
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Activities List */}
        <div>
          <h4 className="font-semibold text-gray-800 dark:text-slate-200 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            Hoạt động ngoại khóa
          </h4>
          <div className="space-y-4">
            {profile.extracurriculars.length > 0 ? (
              profile.extracurriculars.map((act) => (
                <div
                  key={act.id}
                  className="pl-4 border-l-2 border-gray-200 dark:border-slate-600 hover:border-blue-400 transition-colors"
                >
                  <h5 className="font-bold text-gray-800 dark:text-slate-200 text-sm">
                    {act.title}
                  </h5>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded">
                      {act.role}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-slate-500">
                      {act.year}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {act.description}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-400 dark:text-slate-500 italic text-sm">
                Chưa cập nhật hoạt động
              </p>
            )}
          </div>
        </div>

        {/* Achievements List */}
        <div>
          <h4 className="font-semibold text-gray-800 dark:text-slate-200 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
            Giải thưởng & Chứng nhận
          </h4>
          <div className="space-y-2">
            {profile.achievements.length > 0 ? (
              profile.achievements.map((ach, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 bg-yellow-50 dark:bg-yellow-900/20 p-2.5 rounded-lg border border-yellow-100 dark:border-yellow-900/30"
                >
                  <GraduationCap
                    className="text-yellow-600 dark:text-yellow-400 mt-0.5 shrink-0"
                    size={16}
                  />
                  <span className="text-sm text-gray-800 dark:text-slate-200">
                    {ach}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-400 dark:text-slate-500 italic text-sm">
                Chưa cập nhật thành tích
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
