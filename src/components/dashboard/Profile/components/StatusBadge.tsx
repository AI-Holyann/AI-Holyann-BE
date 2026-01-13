"use client";

import React from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface StatusBadgeProps {
  isComplete: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ isComplete }) => (
  <div
    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
      isComplete
        ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
        : "bg-red-100 text-red-700 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800"
    }`}
  >
    {isComplete ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
    {isComplete ? "Hoàn tất" : "Cần bổ sung"}
  </div>
);
