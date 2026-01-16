"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import {
  GraduationCap,
  MapPin,
  Calendar,
  DollarSign,
  FileText,
  ChevronDown,
  ChevronUp,
  Star,
  Award,
  AlertCircle,
  CheckCircle2,
  Target,
  TrendingUp,
  Shield,
  Sparkles,
  User,
} from "lucide-react";

// Types
type DeadlineType = {
  type: "ED" | "ED2" | "EA" | "RD";
  date: string;
};

interface School {
  id: string;
  name: string;
  rank: string;
  location: string;
  deadlines: DeadlineType[];
  scholarshipDeadline?: string;
  requirements: string;
  category: "Dream" | "Match" | "Safety";
  status?: "Đang tìm hiểu" | "Đang viết luận" | "Đã nộp";
  isHighlight?: boolean;
}

// Transform API data to School format
const transformMatchToSchool = (match: any): School => {
  // Map ai_matching to category
  const categoryMap: Record<string, School["category"]> = {
    REACH: "Dream",
    MATCH: "Match",
    SAFETY: "Safety",
  };

  // Parse deadline from university detail if available
  let deadlines: DeadlineType[] = [];
  // Note: We'll need to fetch university detail to get deadlines
  // For now, we'll use empty array

  return {
    id: match.university_id,
    name: match.university_name,
    rank: match.university_rank ? `#${match.university_rank}` : "N/A",
    location: match.university_country || "N/A",
    deadlines: deadlines,
    requirements: "Thông tin sẽ được cập nhật",
    category: categoryMap[match.ai_matching] || "Match",
    status: "Đang tìm hiểu",
    isHighlight:
      match.match_score && parseFloat(match.match_score.toString()) > 80,
  };
};

// Get badge colors based on deadline type
const getDeadlineBadgeColor = (type: DeadlineType["type"]) => {
  switch (type) {
    case "ED":
    case "ED2":
      return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-300 dark:border-red-800";
    case "EA":
      return "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-800";
    case "RD":
      return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800";
    default:
      return "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 border-gray-300 dark:border-slate-600";
  }
};

// Get status badge color
const getStatusBadgeColor = (status?: School["status"]) => {
  switch (status) {
    case "Đang tìm hiểu":
      return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-800";
    case "Đang viết luận":
      return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800";
    case "Đã nộp":
      return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-800";
    default:
      return "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 border-gray-300 dark:border-slate-600";
  }
};

// Get category config
const getCategoryConfig = (category: School["category"]) => {
  switch (category) {
    case "Dream":
      return {
        title: "Dream Schools",
        subtitle: "Trường mơ ước - Thử thách cao",
        icon: Star,
        color: "from-purple-500 to-pink-500",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
        iconBg: "bg-purple-100",
        iconColor: "text-purple-600",
      };
    case "Match":
      return {
        title: "Match Schools",
        subtitle: "Trường phù hợp - Khả năng cao",
        icon: Target,
        color: "from-blue-500 to-cyan-500",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
      };
    case "Safety":
      return {
        title: "Safety Schools",
        subtitle: "Trường an toàn - Dự phòng",
        icon: Shield,
        color: "from-green-500 to-emerald-500",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
      };
  }
};

// School Category Section Component
const SchoolCategorySection: React.FC<{
  category: School["category"];
  schools: School[];
}> = ({ category, schools: propSchools }) => {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(true);
  const schools = propSchools.filter((s) => s.category === category);
  const config = getCategoryConfig(category);
  const IconComponent = config.icon;

  return (
    <div
      className={`bg-white dark:bg-slate-800 rounded-2xl shadow-sm border-2 ${config.borderColor} dark:border-slate-700 overflow-hidden`}
    >
      {/* Section Header */}
      <div
        className={`bg-gradient-to-r ${config.color} px-6 py-4 cursor-pointer hover:opacity-90 transition-opacity`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <IconComponent className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{config.title}</h3>
              <p className="text-sm text-white/90">{config.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-white bg-white/20 px-3 py-1 rounded-full">
              {schools.length} trường
            </span>
            {isExpanded ? (
              <ChevronUp className="text-white" size={24} />
            ) : (
              <ChevronDown className="text-white" size={24} />
            )}
          </div>
        </div>
      </div>

      {/* Schools Table */}
      {isExpanded && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr
                className={`${config.bgColor} dark:bg-slate-900 border-b-2 ${config.borderColor} dark:border-slate-700`}
              >
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider">
                  Trường
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider">
                  Hạn Nộp
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider">
                  Học Bổng
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider">
                  Yêu Cầu
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider">
                  Trạng Thái
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
              {schools.map((school) => (
                <tr
                  key={school.id}
                  onClick={() =>
                    router.push(`/dashboard/universities/${school.id}`)
                  }
                  className={`hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors cursor-pointer ${
                    school.isHighlight
                      ? "bg-green-50/50 dark:bg-green-900/20"
                      : ""
                  }`}
                >
                  {/* School Info */}
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg ${config.iconBg} flex items-center justify-center flex-shrink-0`}
                      >
                        <GraduationCap className={config.iconColor} size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white text-sm mb-1">
                          {school.name}
                        </p>
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${config.iconBg} dark:bg-slate-700 ${config.iconColor} dark:text-slate-300`}
                          >
                            {school.rank}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-slate-400">
                            <MapPin size={12} />
                            {school.location}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Deadlines */}
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {school.deadlines.map((deadline, idx) => (
                        <span
                          key={idx}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold border ${getDeadlineBadgeColor(
                            deadline.type
                          )}`}
                        >
                          <Calendar size={12} />
                          {deadline.type}: {deadline.date}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Scholarship */}
                  <td className="px-6 py-4">
                    {school.scholarshipDeadline ? (
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                          <DollarSign
                            className="text-yellow-600 dark:text-yellow-400"
                            size={16}
                          />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-yellow-700 dark:text-yellow-300">
                            Full-Ride
                          </p>
                          <p className="text-xs text-gray-600 dark:text-slate-400">
                            {school.scholarshipDeadline}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 dark:text-slate-500 italic">
                        Không có
                      </span>
                    )}
                  </td>

                  {/* Requirements */}
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-2">
                      <FileText
                        className="text-gray-400 dark:text-slate-500 flex-shrink-0 mt-0.5"
                        size={14}
                      />
                      <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed">
                        {school.requirements}
                      </p>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <select
                      value={school.status || "Đang tìm hiểu"}
                      onChange={(e) => {
                        // Handle status change
                        console.log("Status changed:", e.target.value);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 ${getStatusBadgeColor(
                        school.status
                      )}`}
                    >
                      <option value="Đang tìm hiểu">Đang tìm hiểu</option>
                      <option value="Đang viết luận">Đang viết luận</option>
                      <option value="Đã nộp">Đã nộp</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Main Component
export const TargetSchoolsPage: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPredicting, setIsPredicting] = useState(false);

  useEffect(() => {
    fetchMatchingSchools();
  }, []);

  const fetchMatchingSchools = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/student-match-school");
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch matching schools");
      }

      // Transform API data to School format
      const transformedSchools = result.data.map(transformMatchToSchool);

      // Fetch university details for deadlines
      const schoolsWithDeadlines = await Promise.all(
        transformedSchools.map(async (school: School) => {
          try {
            const uniResponse = await fetch(`/api/universities/${school.id}`);
            const uniResult = await uniResponse.json();

            if (uniResult.success && uniResult.data) {
              const deadline = uniResult.data.deadline;
              const deadlines: DeadlineType[] = [];

              if (deadline) {
                if (deadline.ED)
                  deadlines.push({ type: "ED", date: formatDate(deadline.ED) });
                if (deadline.EA)
                  deadlines.push({ type: "EA", date: formatDate(deadline.EA) });
                if (deadline.RD)
                  deadlines.push({ type: "RD", date: formatDate(deadline.RD) });
              }

              return {
                ...school,
                deadlines,
                requirements:
                  uniResult.data.requirements || school.requirements,
              };
            }
          } catch (e) {
            console.warn(`Failed to fetch details for ${school.id}:`, e);
          }
          return school;
        })
      );

      setSchools(schoolsWithDeadlines);
    } catch (error: any) {
      console.error("Error fetching matching schools:", error);
      toast.error("Không thể tải danh sách trường phù hợp", {
        description: error.message,
      });
      // Fallback to empty array
      setSchools([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const handlePredictUniversities = async () => {
    try {
      setIsPredicting(true);
      const response = await fetch("/api/predict-universities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          top_n: 50,
          min_match_score: 30.0,
          duration_months: 12,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to predict universities");
      }

      // Show success message
      toast.success("Dự đoán thành công!", {
        description: `Đã tìm thấy ${result.stored_count || 0} trường phù hợp`,
      });

      // Refresh the schools list
      await fetchMatchingSchools();
    } catch (error: any) {
      console.error("Error predicting universities:", error);
      toast.error("Không thể dự đoán trường phù hợp", {
        description: error.message || "Vui lòng thử lại sau",
      });
    } finally {
      setIsPredicting(false);
    }
  };

  const dreamCount = schools.filter((s) => s.category === "Dream").length;
  const matchCount = schools.filter((s) => s.category === "Match").length;
  const safetyCount = schools.filter((s) => s.category === "Safety").length;
  const totalCount = schools.length;

  // Navigation items
  const navigationItems = [
    { name: "Hồ Sơ", href: "/dashboard/profile", icon: User },
    {
      name: "Trường Mục Tiêu",
      href: "/dashboard/profile/schools",
      icon: GraduationCap,
    },
    {
      name: "Cải Thiện Hồ Sơ",
      href: "/dashboard/profile/improve",
      icon: Sparkles,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* NAVIGATION TABS */}
        <div className="mb-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-2">
            <div className="flex items-center gap-2">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = pathname === item.href;
                return (
                  <button
                    key={item.href}
                    onClick={() => router.push(item.href)}
                    className={`
                                            flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200
                                            ${
                                              isActive
                                                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                                                : "text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white"
                                            }
                                        `}
                  >
                    <IconComponent size={18} />
                    {item.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Page Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0f4c81] to-blue-600 flex items-center justify-center shadow-lg">
                <GraduationCap className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                  Danh Sách Trường Mục Tiêu
                </h1>
                <p className="text-gray-600 dark:text-slate-400 mt-1">
                  Quản lý và theo dõi tiến độ hồ sơ du học của bạn
                </p>
              </div>
            </div>
            <button
              onClick={handlePredictUniversities}
              disabled={loading || isPredicting}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPredicting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang xử lý...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Dự đoán trường phù hợp</span>
                </>
              )}
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-slate-400 mb-1">
                    Tổng số trường
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {totalCount}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-slate-700 flex items-center justify-center">
                  <Award
                    className="text-gray-600 dark:text-slate-300"
                    size={24}
                  />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 dark:from-purple-900/20 to-pink-50 dark:to-pink-900/20 rounded-xl shadow-sm border border-purple-200 dark:border-purple-800 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-1">
                    Dream
                  </p>
                  <p className="text-3xl font-bold text-purple-900 dark:text-purple-300">
                    {dreamCount}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Star
                    className="text-purple-600 dark:text-purple-400"
                    size={24}
                  />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 dark:from-blue-900/20 to-cyan-50 dark:to-cyan-900/20 rounded-xl shadow-sm border border-blue-200 dark:border-blue-800 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">
                    Match
                  </p>
                  <p className="text-3xl font-bold text-blue-900 dark:text-blue-300">
                    {matchCount}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Target
                    className="text-blue-600 dark:text-blue-400"
                    size={24}
                  />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 dark:from-green-900/20 to-emerald-50 dark:to-emerald-900/20 rounded-xl shadow-sm border border-green-200 dark:border-green-800 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-1">
                    Safety
                  </p>
                  <p className="text-3xl font-bold text-green-900 dark:text-green-300">
                    {safetyCount}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Shield
                    className="text-green-600 dark:text-green-400"
                    size={24}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Info Banner */}
          <div className="mt-6 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 dark:border-blue-400 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle
                className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
                size={20}
              />
              <div>
                <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">
                  Lời khuyên về phân bổ trường
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-200">
                  Chiến lược tối ưu:{" "}
                  <span className="font-semibold">3-4 Dream</span> (reach
                  schools),
                  <span className="font-semibold"> 4-5 Match</span> (target
                  schools),
                  <span className="font-semibold"> 2-3 Safety</span> (safety
                  schools). Đảm bảo cân bằng để tối đa hóa cơ hội trúng tuyển!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-indigo-200 dark:border-indigo-800 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin"></div>
          </div>
        ) : totalCount === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700">
            <GraduationCap className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
              Chưa có trường đại học phù hợp
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Hoàn thành các bài test để nhận đề xuất trường phù hợp
            </p>
          </div>
        ) : (
          /* School Categories */
          <div className="space-y-6">
            <SchoolCategorySection category="Dream" schools={schools} />
            <SchoolCategorySection category="Match" schools={schools} />
            <SchoolCategorySection category="Safety" schools={schools} />
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-slate-400">
            💡 Tip: Nhấn vào tên trường để xem chi tiết và cập nhật trạng thái
            ứng tuyển
          </p>
        </div>
      </div>
    </div>
  );
};
