"use client";

import React, { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import AuthHeader from "@/components/dashboard/AuthHeader";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { SwotData, StudentProfile } from "@/components/types";
import { SwotCard } from "@/components/dashboard/Profile/SwotCard";
import { Feature1OutputData } from "@/lib/schemas/profile-analysis.schema";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  ShieldCheck,
  AlertOctagon,
  Zap,
  Target,
  Sparkles,
  Loader2,
  ArrowLeft,
  GraduationCap,
  Globe,
  Trophy,
  BrainCircuit,
} from "lucide-react";

/**
 * Map Feature1OutputData to SwotData format
 */
function mapFeature1ToSwotData(analysisData: Feature1OutputData): SwotData {
  const swot = analysisData["B. Phân tích SWOT"];
  const spike = analysisData["C. Nhận diện Spike (Yếu tố cốt lõi)"];
  const summary = analysisData.summary;

  // Map SWOT data
  const strengths = swot["Strengths (Điểm mạnh)"] || [];
  const weaknesses = swot["Weaknesses (Điểm yếu)"] || [];
  const opportunities = swot["Opportunities (Cơ hội)"] || [];
  const threats = swot["Threats (Thách thức)"] || [];

  // Generate strategic advice from SWOT and spike analysis
  const strategicAdvice = [];

  // Priority 1: Use Opportunities as strategic advice (they are actionable)
  if (opportunities.length > 0) {
    opportunities.slice(0, 2).forEach((opp, idx) => {
      strategicAdvice.push({
        title: `Cơ hội ${idx + 1}`,
        description: opp,
      });
    });
  }

  // Priority 2: Add spike analysis if available
  if (spike["Nhận xét"] && strategicAdvice.length < 3) {
    strategicAdvice.push({
      title: `Phát triển ${spike["Loại Spike hiện tại"]}`,
      description: spike["Nhận xét"].replace(/"/g, ""),
    });
  }

  // Priority 3: Add strength-based advice if still need more
  if (strengths.length > 0 && strategicAdvice.length < 3) {
    strategicAdvice.push({
      title: "Tận dụng điểm mạnh",
      description: strengths[0] || "",
    });
  }

  // Map scores from summary.total_pillar_scores (aca, lan, hdnk, skill)
  // These are already normalized values
  const totalScores = summary.total_pillar_scores;

  // Normalize to 0-100 scale if needed
  const normalizeScore = (score: number): number => {
    // If score > 100, assume it's on 0-1000 scale and divide by 10
    if (score > 100) {
      return Math.min(100, Math.round(score / 10));
    }
    return Math.min(100, Math.round(score));
  };

  const scores = {
    academic: normalizeScore(totalScores.aca),
    language: normalizeScore(totalScores.lan),
    skills: normalizeScore(totalScores.skill),
    extracurricular: normalizeScore(totalScores.hdnk),
    leadership: normalizeScore(totalScores.hdnk), // Use extracurricular as proxy for leadership (for backward compatibility)
  };

  return {
    strengths,
    weaknesses,
    opportunities,
    threats,
    strategicAdvice: strategicAdvice.slice(0, 3), // Limit to 3 items
    scores,
  };
}

export default function SwotCardPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [swotData, setSwotData] = useState<SwotData | null>(null);
  const [analyzed, setAnalyzed] = useState(false);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  // Get student ID from session - memoized to prevent unnecessary recalculations
  const studentId = useMemo(() => {
    // Try NextAuth session first
    const sessionUserId =
      (session?.user as any)?.id || (session?.user as any)?.user_id;
    if (sessionUserId) {
      return sessionUserId as string;
    }

    // Try localStorage session (for local auth) - only in browser
    if (typeof window !== "undefined") {
      try {
        const localSession = localStorage.getItem("session");
        if (localSession) {
          const parsed = JSON.parse(localSession);
          const localUserId = parsed?.user_id || parsed?.userId || parsed?.id;
          if (localUserId) {
            return localUserId;
          }
        }
      } catch (e) {
        console.warn("Could not parse session from localStorage:", e);
      }
    }

    return null;
  }, [session?.user]);

  // Fetch profile data
  useEffect(() => {
    if (!studentId) {
      setProfileLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        setProfileLoading(true);
        const response = await fetch(`/api/students/${studentId}/profile`);

        if (!response.ok) {
          throw new Error("Không thể tải thông tin học sinh");
        }

        const data = await response.json();

        // Map API data to StudentProfile interface
        const mappedProfile: StudentProfile = {
          id: studentId.substring(0, 8).toUpperCase(),
          name: data.basicInfo.full_name || "Chưa cập nhật",
          email: data.basicInfo.email || "Chưa cập nhật",
          phone: data.basicInfo.phone_number || "Chưa cập nhật",
          address: data.basicInfo.current_address || "Chưa cập nhật",
          dob: data.basicInfo.date_of_birth
            ? new Date(data.basicInfo.date_of_birth).toLocaleDateString("vi-VN")
            : "Chưa cập nhật",
          avatarUrl: data.basicInfo.avatar_url || "/images/avatars/avt.jpg",
          gpa: (() => {
            const gpaDetails = data.academicProfile?.gpa_transcript_details;
            if (!gpaDetails) return 0;
            if (gpaDetails.grade12)
              return parseFloat(String(gpaDetails.grade12)) || 0;
            if (gpaDetails.grade11)
              return parseFloat(String(gpaDetails.grade11)) || 0;
            if (gpaDetails.grade10)
              return parseFloat(String(gpaDetails.grade10)) || 0;
            if (gpaDetails.grade9)
              return parseFloat(String(gpaDetails.grade9)) || 0;
            return 0;
          })(),
          gpaScale: 10,
          englishLevel: data.academicProfile?.english_level || "Chưa cập nhật",
          targetMajor: data.basicInfo.intended_major || "Chưa cập nhật",
          targetCountry: data.basicInfo.target_country || "Chưa cập nhật",
          extracurriculars: [],
          achievements: [],
          documents: [],
        };

        setProfile(mappedProfile);
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Không thể tải thông tin học sinh");
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, [studentId]);

  const handleAnalysis = async () => {
    if (!studentId) {
      toast.error("Không tìm thấy thông tin học sinh", {
        description: "Vui lòng đăng nhập lại để tiếp tục",
      });
      return;
    }

    setLoading(true);
    toast.info("Đang phân tích SWOT", {
      description: "AI đang phân tích hồ sơ của bạn để tạo báo cáo SWOT...",
    });

    try {
      const response = await fetch(
        `/api/students/${studentId}/analyze-profile`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setSwotData(null);
        setAnalyzed(false);
        toast.error("Phân tích SWOT thất bại", {
          description: data.error || "Vui lòng thử lại sau",
        });
        return;
      }

      // Handle response format - có thể có wrapper success/data hoặc trả về trực tiếp
      let analysisData: Feature1OutputData;
      if (data && typeof data === "object" && "data" in data && data.data) {
        // Có wrapper
        analysisData = data.data as Feature1OutputData;
      } else {
        // Trả về trực tiếp
        analysisData = data as Feature1OutputData;
      }

      // Map Feature1OutputData to SwotData
      const mappedSwotData = mapFeature1ToSwotData(analysisData);
      setSwotData(mappedSwotData);
      setAnalyzed(true);

      toast.success("Phân tích SWOT hoàn tất", {
        description: "Đã tạo báo cáo phân tích SWOT chi tiết cho hồ sơ của bạn",
      });
    } catch (error) {
      console.error("Analysis failed", error);
      setSwotData(null);
      setAnalyzed(false);

      toast.error("Không thể kết nối API", {
        description:
          error instanceof Error ? error.message : "Lỗi không xác định",
      });
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data format - chỉ 4 mục: Học thuật, Ngoại ngữ, Hoạt động, Kỹ năng
  const chartData = swotData?.scores
    ? [
        {
          subject: "Học thuật",
          A: swotData.scores.academic || 0,
          fullMark: 100,
        },
        {
          subject: "Ngoại ngữ",
          A: swotData.scores.language || 0,
          fullMark: 100,
        },
        {
          subject: "Hoạt động",
          A: swotData.scores.extracurricular || 0,
          fullMark: 100,
        },
        {
          subject: "Kỹ năng",
          A: swotData.scores.skills || 0,
          fullMark: 100,
        },
      ]
    : [
        { subject: "Học thuật", A: 0, fullMark: 100 },
        { subject: "Ngoại ngữ", A: 0, fullMark: 100 },
        { subject: "Hoạt động", A: 0, fullMark: 100 },
        { subject: "Kỹ năng", A: 0, fullMark: 100 },
      ];

  // Loading state for profile
  if (profileLoading) {
    return (
      <div className="min-h-screen flex flex-col font-sans bg-white dark:bg-slate-950">
        <AuthHeader />
        <main className="flex-grow flex items-center justify-center p-6">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-[var(--brand-deep)] animate-spin mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              Đang tải thông tin...
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white dark:bg-slate-950">
      <AuthHeader />

      <main className="flex-grow p-4 sm:p-6 max-w-7xl mx-auto w-full space-y-4 sm:space-y-6">
        {/* Navigation & Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex-1">
            <button
              onClick={() => router.back()}
              className="flex items-center text-sm text-gray-500 hover:text-[var(--brand-deep)] mb-2 transition-colors"
            >
              <ArrowLeft size={16} className="mr-1" /> Quay lại hồ sơ
            </button>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Phân tích SWOT & Định hướng
            </h2>
          </div>

          {!analyzed && !loading && (
            <button
              onClick={handleAnalysis}
              className="bg-[var(--brand-deep)] hover:bg-[var(--brand-deep-darker)] text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 font-medium text-sm sm:text-base w-full sm:w-auto"
            >
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" /> Tạo phân tích AI
            </button>
          )}
        </div>

        {/* Profile Summary Card - Context for the Analysis */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4 sm:gap-6 items-center sm:items-start">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-200 dark:bg-slate-700 overflow-hidden flex-shrink-0 border-2 border-white dark:border-slate-800 shadow-sm">
            <img
              src={
                profile?.avatarUrl ||
                "https://api.dicebear.com/9.x/notionists/svg?seed=Student"
              }
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-grow text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              {profile?.name || "Chưa cập nhật"}
            </h3>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-3 mt-2">
              {profile?.gpa !== undefined && profile.gpa > 0 && (
                <span className="px-2 sm:px-3 py-1 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200 text-xs font-semibold rounded-full flex items-center gap-1">
                  <GraduationCap size={12} /> GPA: {profile.gpa.toFixed(1)}
                </span>
              )}
              {profile?.englishLevel && (
                <span className="px-2 sm:px-3 py-1 bg-purple-50 dark:bg-purple-900 text-purple-700 dark:text-purple-200 text-xs font-semibold rounded-full flex items-center gap-1">
                  <Globe size={12} /> {profile.englishLevel}
                </span>
              )}
              {profile?.targetMajor && (
                <span className="px-2 sm:px-3 py-1 bg-orange-50 dark:bg-orange-900 text-orange-700 dark:text-orange-200 text-xs font-semibold rounded-full flex items-center gap-1">
                  <Trophy size={12} /> {profile.targetMajor}
                </span>
              )}
            </div>
          </div>
          {analyzed && swotData && (
            <div className="text-center sm:text-right w-full sm:w-auto">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Điểm đánh giá chung
              </p>
              <div className="text-2xl sm:text-3xl font-bold text-[var(--brand-deep)]">
                {swotData?.scores
                  ? Math.round(
                      (swotData.scores.academic +
                        swotData.scores.language +
                        swotData.scores.extracurricular +
                        swotData.scores.skills) /
                        4
                    )
                  : "--"}
                <span className="text-base sm:text-lg text-gray-400 dark:text-gray-500 font-normal">
                  /100
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-8 sm:p-12 text-center">
            <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-[var(--brand-deep)] animate-spin mx-auto mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">
              Đang phân tích hồ sơ...
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
              Hệ thống đang tổng hợp dữ liệu và so sánh với tiêu chuẩn du học.
            </p>
          </div>
        )}

        {/* Results Dashboard */}
        {analyzed && swotData && (
          <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-700">
            {/* Top Row: Chart + Strategy */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Radar Chart */}
              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-3 sm:p-4 lg:col-span-1 flex flex-col items-center">
                <h4 className="w-full font-bold text-sm sm:text-base text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2 border-b border-gray-100 dark:border-slate-700 pb-2 sm:pb-3">
                  <BrainCircuit
                    size={16}
                    className="sm:w-[18px] sm:h-[18px] text-[#0f6093]"
                  />
                  <span className="truncate">Biểu đồ năng lực</span>
                </h4>
                <div className="w-full h-[250px] sm:h-[300px] -ml-2 sm:-ml-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart
                      cx="50%"
                      cy="50%"
                      outerRadius="75%"
                      data={chartData}
                    >
                      <PolarGrid stroke="#E2E8F0" />
                      <PolarAngleAxis
                        dataKey="subject"
                        tick={{
                          fill: "#64748B",
                          fontSize: 10,
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
                        name="Học sinh"
                        dataKey="A"
                        stroke="#0f6093"
                        fill="#0f6093"
                        fillOpacity={0.5}
                      />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Strategic Advice */}
              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-4 sm:p-6 lg:col-span-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-yellow-400 opacity-5 rounded-bl-full pointer-events-none"></div>

                <h4 className="font-bold text-base sm:text-lg text-gray-800 dark:text-gray-200 mb-4 sm:mb-6 flex items-center gap-2">
                  <span className="p-1 sm:p-1.5 bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400 rounded-lg">
                    <Sparkles size={16} className="sm:w-[18px] sm:h-[18px]" />
                  </span>
                  Chiến lược trọng tâm
                </h4>

                <div className="grid gap-3 sm:gap-4">
                  {swotData.strategicAdvice.length > 0 ? (
                    swotData.strategicAdvice.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-blue-100 dark:hover:border-blue-800 transition-colors"
                      >
                        <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#0f6093] text-white flex items-center justify-center font-bold text-xs sm:text-sm shadow-sm">
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white mb-1">
                            {item.title}
                          </h5>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed break-words">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                      Chưa có chiến lược cụ thể. Vui lòng phân tích lại hồ sơ.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* SWOT Matrix Grid */}
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 flex flex-wrap items-center gap-2">
                <span>Chi tiết Ma trận SWOT</span>
                <span className="text-xs font-normal text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded-full border border-gray-200 dark:border-slate-700">
                  Được tạo bởi AI
                </span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Strengths */}
                <SwotCard
                  title="Strengths (Điểm mạnh)"
                  items={swotData.strengths || []}
                  icon={<ShieldCheck size={18} className="sm:w-5 sm:h-5" />}
                  variant="success"
                />

                {/* Weaknesses */}
                <SwotCard
                  title="Weaknesses (Điểm yếu)"
                  items={swotData.weaknesses || []}
                  icon={<AlertOctagon size={18} className="sm:w-5 sm:h-5" />}
                  variant="danger"
                />

                {/* Opportunities */}
                <SwotCard
                  title="Opportunities (Cơ hội)"
                  items={swotData.opportunities || []}
                  icon={<Zap size={18} className="sm:w-5 sm:h-5" />}
                  variant="info"
                />

                {/* Threats */}
                <SwotCard
                  title="Threats (Thách thức)"
                  items={swotData.threats || []}
                  icon={<Target size={18} className="sm:w-5 sm:h-5" />}
                  variant="warning"
                />
              </div>
            </div>

            <div className="flex justify-center pt-6 sm:pt-8 pb-8 sm:pb-10">
              <button
                onClick={handleAnalysis}
                disabled={loading}
                className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 hover:text-[#0f6093] dark:hover:text-[#2b8cc9] flex items-center gap-2 transition-colors px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-gray-500 dark:disabled:hover:text-gray-400"
              >
                <Loader2
                  size={12}
                  className={`sm:w-[14px] sm:h-[14px] ${
                    loading ? "animate-spin" : ""
                  }`}
                />
                {loading ? "Đang làm mới..." : "Làm mới kết quả phân tích"}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
