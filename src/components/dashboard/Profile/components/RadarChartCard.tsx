"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Target } from "lucide-react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from "recharts";
import { StudentProfile } from "../../../types";

interface RadarChartCardProps {
  profile: StudentProfile;
  chartData: Array<{
    subject: string;
    A: number;
    fullMark: number;
  }>;
}

export const RadarChartCard: React.FC<RadarChartCardProps> = ({
  profile,
  chartData,
}) => {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial dark mode
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    checkDarkMode();

    // Watch for dark mode changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-5">
      <div className="mb-4">
        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3">
          Đánh giá tổng quan
        </h3>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => router.push("/dashboard/tests")}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-md text-sm hover:from-purple-700 hover:to-blue-600 transition-colors shadow-md whitespace-nowrap"
          >
            <Target size={16} />
            Khám phá bản thân
          </button>
          <button
            onClick={() => router.push("/dashboard/swotCard")}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md text-sm hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors whitespace-nowrap"
          >
            Xem chi tiết
          </button>
        </div>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
            <PolarGrid stroke={isDark ? "#475569" : "#E2E8F0"} />
            <PolarAngleAxis
              dataKey="subject"
              tick={{
                fill: isDark ? "#94a3b8" : "#64748B",
                fontSize: 12,
                fontWeight: 500,
              }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={false}
              axisLine={false}
            />
            <Radar
              name={profile.name}
              dataKey="A"
              stroke={isDark ? "#60a5fa" : "#0f6093"}
              strokeWidth={2}
              fill={isDark ? "#60a5fa" : "#0f6093"}
              fillOpacity={0.5}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const value =
                    typeof payload[0].value === "number"
                      ? payload[0].value.toFixed(1)
                      : payload[0].value;
                  return (
                    <div
                      className={`${
                        isDark
                          ? "bg-slate-800 border-slate-700"
                          : "bg-white border-gray-200"
                      } border rounded-lg p-3 shadow-lg`}
                    >
                      <p
                        className={`text-sm font-semibold ${
                          isDark ? "text-white" : "text-gray-900"
                        } mb-1`}
                      >
                        {payload[0].payload.subject}
                      </p>
                      <p
                        className={`text-sm ${
                          isDark ? "text-blue-400" : "text-blue-600"
                        } font-medium`}
                      >
                        Điểm: {value}%
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
