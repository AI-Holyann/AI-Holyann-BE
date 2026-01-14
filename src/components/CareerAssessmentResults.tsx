"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { ONETDatasetInfo } from "./CareerAssessmentResults/ONETDatasetInfo";

// Component-specific interface (camelCase for React)
interface CareerRecommendation {
  name: string;
  category: string;
  matchReason: string;
  careerPaths: string[];
  requiredSkills: string[];
  matchPercentage: number;
  riasecCode?: string;
  riasecScores?: Record<string, number>;
}

// Component-specific career groups type
type ComponentCareerGroups = Record<string, CareerRecommendation[]>;

interface CareerAssessment {
  mbti: {
    personality_type: string;
    confidence: number;
    dimension_scores: Record<string, number>;
  };
  grit: {
    score: number;
    level: string;
    description: string;
  };
  riasec: {
    code: string;
    scores: Record<string, number>;
    top3: [string, number][];
  };
}

interface CareerAssessmentResultsProps {
  studentId: string;
  onClose: () => void;
  autoLoad?: boolean; // Nếu true, tự động gọi API khi component mount và chưa có recommendations
}

function CareerAssessmentResults({
  studentId,
  onClose,
  autoLoad = false,
}: CareerAssessmentResultsProps) {
  const [loading, setLoading] = useState(false);
  const [checkingCache, setCheckingCache] = useState(true);
  const [assessment, setAssessment] = useState<CareerAssessment | null>(null);
  const [recommendations, setRecommendations] = useState<
    CareerRecommendation[]
  >([]);
  const [careerGroups, setCareerGroups] =
    useState<ComponentCareerGroups | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Kiểm tra xem đã có career recommendations trong DB chưa
  useEffect(() => {
    const loadCachedRecommendations = async () => {
      try {
        console.log("🔍 Checking for cached career recommendations...");
        const response = await fetch(`/api/tests/career/${studentId}`);
        const data = await response.json();

        if (
          data.success &&
          data.recommendations &&
          data.recommendations.length > 0
        ) {
          console.log(
            "✅ Found cached recommendations:",
            data.recommendations.length
          );
          // Transform DB data to component format
          const formattedRecs = data.recommendations.map((rec: any) => ({
            name: rec.job_title,
            category: rec.job_field || "",
            matchReason: rec.reasoning || "",
            careerPaths: [],
            requiredSkills: [],
            matchPercentage: Math.round(rec.match_percentage),
            riasecCode: rec.riasec_code || rec.riasecCode, // Support both formats
            riasecScores: rec.riasec_scores || rec.riasecScores, // Support both formats
          }));
          setRecommendations(formattedRecs);

          // Group by job_field (category) - luôn group để hiển thị theo nhóm
          const groups: ComponentCareerGroups = {};
          formattedRecs.forEach((rec: any) => {
            // Sử dụng job_field từ DB (đã map vào category ở dòng 82)
            // Nếu category rỗng hoặc null, group vào "Khác"
            const groupName =
              rec.category && rec.category.trim() !== ""
                ? rec.category
                : "Khác";
            if (!groups[groupName]) {
              groups[groupName] = [];
            }
            groups[groupName].push(rec);
          });

          // Luôn set careerGroups nếu có recommendations
          if (Object.keys(groups).length > 0) {
            setCareerGroups(groups);
          }
        } else {
          console.log("ℹ️ No cached recommendations found");
        }
      } catch (error) {
        console.error("❌ Error loading cached recommendations:", error);
      } finally {
        setCheckingCache(false);
      }
    };

    if (studentId) {
      loadCachedRecommendations();
    }
  }, [studentId]);

  // Auto load recommendations khi component được hiển thị và chưa có recommendations
  useEffect(() => {
    if (
      autoLoad &&
      studentId &&
      !checkingCache &&
      !loading &&
      !recommendations.length &&
      !error
    ) {
      console.log("🔄 Auto-loading career recommendations...");
      handleGetRecommendations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoLoad, studentId, checkingCache]);

  const handleGetRecommendations = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("🎯 Getting career recommendations for student:", studentId);

      // Call real API
      const response = await fetch("/api/career-assessment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ student_id: studentId }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error ||
            `API returned ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Không thể lấy đề xuất nghề nghiệp");
      }

      setAssessment(data.assessment);

      // Transform recommendations từ API format (snake_case) sang component format (camelCase)
      const transformedRecs = (data.recommendations || []).map((rec: any) => ({
        name: rec.title || rec.name,
        category: rec.job_field || rec.category || "",
        matchReason: rec.description || rec.matchReason || "",
        careerPaths: [],
        requiredSkills: [],
        matchPercentage: Math.round(
          rec.match_score || rec.matchPercentage || 0
        ),
        riasecCode: rec.riasec_code || rec.riasecCode,
        riasecScores: rec.riasec_scores || rec.riasecScores,
      }));
      setRecommendations(transformedRecs);

      // Handle career_groups if available - transform từ API response
      if (data.career_groups && typeof data.career_groups === "object") {
        // Transform career_groups từ API format sang component format
        const transformedGroups: ComponentCareerGroups = {};
        for (const [groupName, groupRecs] of Object.entries(
          data.career_groups
        )) {
          transformedGroups[groupName] = (groupRecs as any[]).map(
            (rec: any) => ({
              name: rec.title || rec.name,
              category: groupName,
              matchReason: rec.description || rec.matchReason || "",
              careerPaths: [],
              requiredSkills: [],
              matchPercentage: Math.round(
                rec.match_score || rec.matchPercentage || 0
              ),
              riasecCode: rec.riasec_code || rec.riasecCode,
              riasecScores: rec.riasec_scores || rec.riasecScores,
            })
          );
        }
        setCareerGroups(transformedGroups);
        console.log(
          "✅ Career groups received:",
          Object.keys(transformedGroups).length,
          "groups"
        );
      } else if (transformedRecs.length > 0) {
        // Nếu không có career_groups nhưng có recommendations, group theo category nếu có
        const groups: ComponentCareerGroups = {};
        transformedRecs.forEach((rec: any) => {
          const groupName = rec.category || "Khác";
          if (!groups[groupName]) {
            groups[groupName] = [];
          }
          groups[groupName].push(rec);
        });
        if (Object.keys(groups).length > 0) {
          setCareerGroups(groups);
        } else {
          setCareerGroups(null);
        }
      } else {
        setCareerGroups(null);
      }

      if (data.note) {
        console.log("ℹ️ Note:", data.note);
      }

      console.log(
        "✅ Career recommendations received:",
        data.recommendations?.length || 0
      );
    } catch (error: any) {
      console.error("❌ Career assessment error:", error);

      // Parse error message để hiển thị gần gũi hơn
      let errorMessage = "Đã xảy ra lỗi khi lấy đề xuất nghề nghiệp";
      let errorDescription = "Vui lòng thử lại sau";

      if (error.message) {
        const msg = error.message.toLowerCase();
        if (
          msg.includes("cannot connect") ||
          msg.includes("503") ||
          msg.includes("unavailable")
        ) {
          errorMessage = "Không thể kết nối đến dịch vụ phân tích";
          errorDescription = "Vui lòng kiểm tra kết nối mạng và thử lại sau";
        } else if (msg.includes("missing") || msg.includes("complete")) {
          errorMessage = "Chưa hoàn thành đủ bài test";
          errorDescription =
            "Vui lòng hoàn thành tất cả 3 bài test (MBTI, RIASEC, GRIT) trước";
        } else if (
          msg.includes("database") ||
          msg.includes("column") ||
          msg.includes("job_field")
        ) {
          errorMessage = "Lỗi cấu hình hệ thống";
          errorDescription = "Vui lòng liên hệ quản trị viên để được hỗ trợ";
        } else {
          errorDescription = error.message;
        }
      }

      setError(errorMessage);

      // Hiển thị toast notification
      toast.error(errorMessage, {
        description: errorDescription,
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600 bg-green-50";
    if (percentage >= 60) return "text-blue-600 bg-blue-50";
    if (percentage >= 40) return "text-yellow-600 bg-yellow-50";
    return "text-gray-600 bg-gray-50";
  };

  const getRIASECDescription = (code: string) => {
    const descriptions: Record<string, string> = {
      R: "Realistic - Thực tế",
      I: "Investigative - Nghiên cứu",
      A: "Artistic - Nghệ thuật",
      S: "Social - Xã hội",
      E: "Enterprising - Doanh nghiệp",
      C: "Conventional - Truyền thống",
    };
    return code
      .split("")
      .map((c) => descriptions[c] || c)
      .join(" + ");
  };

  // Show loading state while checking cache hoặc đang gọi API
  if (checkingCache || loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mt-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              Đang phân tích nghề nghiệp phù hợp
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              AI đang phân tích kết quả test của bạn...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Nếu không có recommendations và không đang loading, hiển thị empty state với nút
  if (!recommendations.length && !error) {
    return (
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 mt-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-indigo-600 dark:text-indigo-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            🎯 Khám phá nghề nghiệp phù hợp
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Dựa trên kết quả 3 bài test, chúng tôi sẽ đề xuất những nghề nghiệp
            phù hợp nhất với bạn
          </p>
          <button
            onClick={handleGetRecommendations}
            disabled={loading}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Đang phân tích...</span>
              </div>
            ) : (
              "Xem đề xuất nghề nghiệp"
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-6 py-4 rounded-xl">
          <div className="flex items-center space-x-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <span className="font-semibold">Lỗi:</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {assessment && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              📊 Tổng hợp kết quả đánh giá
            </h3>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 text-sm font-medium"
            >
              {showDetails ? "Ẩn chi tiết" : "Xem chi tiết"}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div className="font-semibold text-blue-900 dark:text-blue-300">
                MBTI
              </div>
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                {assessment.mbti.personality_type}
              </div>
              <div className="text-sm text-blue-600 dark:text-blue-400">
                Độ tin cậy: {(assessment.mbti.confidence * 100).toFixed(1)}%
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <div className="font-semibold text-green-900 dark:text-green-300">
                GRIT
              </div>
              <div className="text-2xl font-bold text-green-700 dark:text-green-400">
                {assessment.grit.score.toFixed(2)}/5.0
              </div>
              <div className="text-sm text-green-600 dark:text-green-400">
                {assessment.grit.level}
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
              <div className="font-semibold text-purple-900 dark:text-purple-300">
                RIASEC
              </div>
              <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">
                {assessment.riasec.code}
              </div>
              <div className="text-sm text-purple-600 dark:text-purple-400">
                {getRIASECDescription(assessment.riasec.code)}
              </div>
            </div>
          </div>

          {showDetails && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  MBTI Chi tiết:
                </h4>
                <div className="space-y-1 text-sm">
                  {Object.entries(assessment.mbti.dimension_scores).map(
                    ([dim, score]) => (
                      <div key={dim} className="flex justify-between">
                        <span>{dim}:</span>
                        <span>{(score * 100).toFixed(1)}%</span>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  RIASEC Top 3:
                </h4>
                <div className="space-y-1 text-sm">
                  {assessment.riasec.top3.map(([category, score], index) => (
                    <div key={category} className="flex justify-between">
                      <span>
                        {index + 1}. {category}:
                      </span>
                      <span>{score}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              🎯 Đề xuất nghề nghiệp ({recommendations.length} nghề)
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* O*NET Dataset Information */}
          <ONETDatasetInfo />

          {/* Display by career groups if available - Redesigned theo POSTMAN_TEST_OUTPUT.json */}
          {careerGroups && Object.keys(careerGroups).length > 0 ? (
            <div className="space-y-8">
              {Object.entries(careerGroups).map(([groupName, groupRecs]) => (
                <div
                  key={groupName}
                  className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 shadow-lg"
                >
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-indigo-200 dark:border-indigo-800">
                    <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {groupName}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {groupRecs.length} nghề nghiệp phù hợp
                      </p>
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {groupRecs.map((rec, index) => (
                      <div
                        key={index}
                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
                      >
                        {/* Header với match percentage */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h5 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                              {rec.name}
                            </h5>
                            {/* Job field badge */}
                            {rec.category && (
                              <div className="mb-2">
                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-purple-700 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-2.5 py-1 rounded-full">
                                  <svg
                                    className="w-3 h-3"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                    />
                                  </svg>
                                  {rec.category}
                                </span>
                              </div>
                            )}
                            {/* RIASEC Code */}
                            {rec.riasecCode && (
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900 px-2 py-1 rounded">
                                  {rec.riasecCode}
                                </span>
                                <span className="text-xs text-gray-600 dark:text-gray-400">
                                  {getRIASECDescription(rec.riasecCode)}
                                </span>
                              </div>
                            )}
                          </div>
                          <div
                            className={`px-3 py-1.5 rounded-full text-sm font-bold ${getMatchColor(
                              rec.matchPercentage
                            )} whitespace-nowrap ml-2 shrink-0`}
                          >
                            {rec.matchPercentage}%
                          </div>
                        </div>

                        {/* RIASEC Scores - Redesigned */}
                        {rec.riasecScores && (
                          <div className="mt-auto pt-3 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                                Điểm RIASEC
                              </p>
                            </div>
                            <div className="grid grid-cols-6 gap-1.5">
                              {Object.entries(rec.riasecScores).map(
                                ([code, score]) => (
                                  <div
                                    key={code}
                                    className="text-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg p-1.5 border border-gray-200 dark:border-gray-600"
                                  >
                                    <div className="text-xs font-bold text-gray-900 dark:text-white mb-0.5">
                                      {code}
                                    </div>
                                    <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                                      {typeof score === "number"
                                        ? score.toFixed(1)
                                        : score}
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Fallback: Display all recommendations in a redesigned grid */
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recommendations.map((rec, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
                >
                  {/* Header với match percentage */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                        {rec.name}
                      </h4>
                      {/* Job field badge */}
                      {rec.category && (
                        <div className="mb-2">
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-purple-700 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-2.5 py-1 rounded-full">
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                              />
                            </svg>
                            {rec.category}
                          </span>
                        </div>
                      )}
                      {/* RIASEC Code */}
                      {rec.riasecCode && (
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900 px-2 py-1 rounded">
                            {rec.riasecCode}
                          </span>
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {getRIASECDescription(rec.riasecCode)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div
                      className={`px-3 py-1.5 rounded-full text-sm font-bold ${getMatchColor(
                        rec.matchPercentage
                      )} whitespace-nowrap ml-2 shrink-0`}
                    >
                      {rec.matchPercentage}%
                    </div>
                  </div>

                  {/* RIASEC Scores - Redesigned */}
                  {rec.riasecScores && (
                    <div className="mt-auto pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                          Điểm RIASEC
                        </p>
                      </div>
                      <div className="grid grid-cols-6 gap-1.5">
                        {Object.entries(rec.riasecScores).map(
                          ([code, score]) => (
                            <div
                              key={code}
                              className="text-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg p-1.5 border border-gray-200 dark:border-gray-600"
                            >
                              <div className="text-xs font-bold text-gray-900 dark:text-white mb-0.5">
                                {code}
                              </div>
                              <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                                {typeof score === "number"
                                  ? score.toFixed(1)
                                  : score}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CareerAssessmentResults;
