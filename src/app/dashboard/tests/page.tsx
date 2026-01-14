"use client";

import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import AuthHeader from "@/components/dashboard/AuthHeader";
import TestSelection from "@/components/Test/TestSelection";
import TestView from "@/components/Test/TestView";
import ResultView from "@/components/Test/ResultView";
import CareerAssessmentResults from "@/components/CareerAssessmentResults";
import {
  TestType,
  Question,
  TestResult,
  MajorRecommendation,
} from "@/components/types";
import { MBTI_QUESTIONS, GRIT_QUESTIONS, RIASEC_QUESTIONS } from "@/constants";
import {
  calculateMBTIResult as calculateMBTIScores,
  MBTI_TYPE_DESCRIPTIONS,
} from "@/data/mbti-questions";
import {
  calculateRIASECResult as calculateRIASECScores,
  getHollandCodeDescription,
  RIASEC_CATEGORIES,
} from "@/data/riasec-questions";
import {
  calculateGritResult as calculateGritScores,
  GRIT_COMPONENTS,
} from "@/data/grit-questions";
import { getMajorRecommendations } from "@/service/geminiService";
import { useTestProgress } from "@/hooks/useTestProgress";
import { useSession } from "next-auth/react";

type ViewState = "selection" | "test" | "result";

export default function TestsPage() {
  const [viewState, setViewState] = useState<ViewState>("selection");
  const [currentTestType, setCurrentTestType] = useState<TestType | null>(null);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [recommendations, setRecommendations] = useState<MajorRecommendation[]>(
    []
  );
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const { data: session } = useSession();

  const [currentTestId, setCurrentTestId] = useState<string | null>(null);
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [careerRecs, setCareerRecs] = useState<MajorRecommendation[]>([]);
  const [showCareerAssessment, setShowCareerAssessment] = useState(false);

  // State để lưu remainingTests tại thời điểm hoàn thành test (để tránh async state issue)
  const [currentRemainingTests, setCurrentRemainingTests] = useState<
    TestType[]
  >([]);
  const [currentAllCompleted, setCurrentAllCompleted] = useState(false);

  // Memoize studentId để tránh re-render không cần thiết
  const studentId = useMemo(() => {
    // 1. Thử lấy từ NextAuth session trước
    const sessionUserId =
      (session?.user as any)?.id || (session?.user as any)?.user_id;
    if (sessionUserId) {
      console.log("✅ Got student ID from NextAuth session:", sessionUserId);
      return sessionUserId as string;
    }

    // 2. Thử lấy từ localStorage session (cho local auth)
    if (typeof window !== "undefined") {
      try {
        const localSession = localStorage.getItem("session");
        if (localSession) {
          const parsed = JSON.parse(localSession);
          const localUserId = parsed.user?.id || parsed.user?.user_id;
          if (localUserId) {
            console.log(
              "✅ Got student ID from localStorage session:",
              localUserId
            );
            return localUserId as string;
          }
        }
      } catch (e) {
        console.warn("Could not parse session from localStorage:", e);
      }

      // 3. Fallback: thử lấy từ localStorage user (legacy)
      try {
        const saved = localStorage.getItem("user");
        if (saved) {
          const parsed = JSON.parse(saved);
          const legacyUserId = parsed.id || parsed.user_id;
          if (legacyUserId) {
            console.log(
              "✅ Got student ID from localStorage user (legacy):",
              legacyUserId
            );
            return legacyUserId as string;
          }
        }
      } catch (e) {
        console.warn("Could not parse user from localStorage:", e);
      }
    }

    console.warn("❌ Could not find student ID from any source");
    return null;
  }, [session]);

  // Student profile should be created automatically during registration
  // No need to create it here - if missing, it's a data sync issue that should be fixed at the source

  // Hook để quản lý tiến độ test - giờ lấy từ database
  const { progress, isLoaded, saveTestResult } = useTestProgress(studentId);

  const getStudentId = () => studentId;

  // Đồng bộ remainingTests và allCompleted từ progress hook
  useEffect(() => {
    setCurrentAllCompleted(progress.allCompleted);
    const allTests: TestType[] = ["MBTI", "GRIT", "RIASEC"];
    setCurrentRemainingTests(
      allTests.filter((t) => !progress.completedTests.includes(t))
    );
  }, [progress]);

  // Không tự động gọi API career-assessment nữa - chỉ gọi khi bấm nút "Đề xuất nghề nghiệp"

  const handleStartTest = async (type: TestType) => {
    const studentId = getStudentId();
    if (!studentId) {
      toast.error("Không tìm thấy thông tin người dùng", {
        description: "Vui lòng đăng nhập lại để tiếp tục",
      });
      return;
    }

    console.log("🚀 Starting test:", type, "for student:", studentId);

    try {
      const res = await fetch("/api/tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: studentId,
          test_type: type.toLowerCase(),
        }),
      });

      console.log("API Responseeeeeee:", res);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("API Error:", res.status, errorText);
        toast.error("Không thể bắt đầu bài test", {
          description: `Lỗi server (${res.status}). Vui lòng thử lại sau.`,
        });
        return;
      }

      const data = await res.json();
      console.log("API Response:", data);

      if (!data.success) {
        console.error("Test creation failed:", data.error);
        toast.error("Không thể bắt đầu bài test", {
          description: data.error || "Đã xảy ra lỗi không xác định",
        });
        return;
      }

      setCurrentTestId(data.test_id);
      setCurrentQuestions(data.questions || getQuestionsForTest(type));
      setCurrentTestType(type);
      setViewState("test");

      toast.success("Bắt đầu bài test thành công", {
        description: `Bạn đã bắt đầu làm bài test ${type}. Chúc bạn làm bài tốt!`,
      });
    } catch (e) {
      console.error("Start test failed", e);
      toast.error("Không thể bắt đầu bài test", {
        description: "Vui lòng kiểm tra kết nối mạng và thử lại",
      });
    }
  };

  const getQuestionsForTest = (type: TestType): Question[] => {
    if (currentTestType === type && currentQuestions.length)
      return currentQuestions;
    switch (type) {
      case "MBTI":
        return MBTI_QUESTIONS;
      case "GRIT":
        return GRIT_QUESTIONS;
      case "RIASEC":
        return RIASEC_QUESTIONS;
      default:
        return [];
    }
  };

  const submitAnswersToApi = async (
    answers: Record<number, string | number | boolean>,
    testType: TestType
  ) => {
    if (!currentTestId) return;
    const studentId = getStudentId();
    if (!studentId) {
      console.error("No student ID found");
      return;
    }

    console.log("📤 [Submit] Submitting all answers at once:", {
      test_id: currentTestId,
      test_type: testType,
      count: Object.keys(answers).length,
    });

    // Gửi TẤT CẢ đáp án trong 1 API call duy nhất
    const response = await fetch("/api/tests/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        test_id: currentTestId,
        student_id: studentId,
        test_type: testType.toLowerCase(),
        answers: answers, // Gửi toàn bộ object
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      console.error("❌ [Submit] Failed:", data.error);
      toast.error("Nộp bài test thất bại", {
        description:
          data.error || "Đã xảy ra lỗi khi nộp bài. Vui lòng thử lại.",
      });
      throw new Error(data.error || "Failed to submit test");
    }

    console.log("✅ [Submit] Success:", data.result);
    toast.success("Nộp bài test thành công", {
      description: "Đáp án của bạn đã được lưu. Đang xử lý kết quả...",
    });
    return data.result;
  };

  const calculateMBTIResult = (
    answers: Record<number, string | number | boolean>
  ): TestResult => {
    // Chuyển đổi answers sang Record<number, number> cho hàm tính điểm
    const numericAnswers: Record<number, number> = {};
    Object.entries(answers).forEach(([key, value]) => {
      numericAnswers[Number(key)] = Number(value);
    });

    // Sử dụng hàm tính điểm từ file mbti-questions.ts
    const result = calculateMBTIScores(numericAnswers);
    const typeInfo = MBTI_TYPE_DESCRIPTIONS[result.type];

    console.log("📊 [MBTI Result]", {
      type: result.type,
      percentages: result.percentages,
      rawScores: result.scores,
    });

    return {
      type: "MBTI",
      scores: result.percentages,
      rawLabel: result.type,
      description: typeInfo
        ? `${typeInfo.title} (${typeInfo.nickname}) - ${typeInfo.description}`
        : `Kết quả MBTI của bạn: ${result.type}`,
    };
  };

  const calculateGritResult = (
    answers: Record<number, string | number | boolean>
  ): TestResult => {
    // Chuyển đổi answers sang Record<number, number> cho hàm tính điểm
    const numericAnswers: Record<number, number> = {};
    Object.entries(answers).forEach(([key, value]) => {
      numericAnswers[Number(key)] = Number(value);
    });

    // Sử dụng hàm tính điểm từ file grit-questions.ts
    const result = calculateGritScores(numericAnswers);

    console.log("📊 [GRIT Result]", {
      gritScore: result.gritScore,
      passionScore: result.passionScore,
      perseveranceScore: result.perseveranceScore,
      level: result.level.level,
    });

    // Tạo description chi tiết
    const passionInfo = GRIT_COMPONENTS.passion;
    const perseveranceInfo = GRIT_COMPONENTS.perseverance;

    const description = `${result.level.level} (${result.level.level_en}): ${result.level.description}

📊 Chi tiết điểm số:
• ${passionInfo.name_vi} (${passionInfo.name}): ${result.passionScore}/5.0 - ${result.passionLevel.level}
• ${perseveranceInfo.name_vi} (${perseveranceInfo.name}): ${result.perseveranceScore}/5.0 - ${result.perseveranceLevel.level}`;

    return {
      type: "GRIT",
      scores: {
        Grit: result.gritScore,
        [passionInfo.name_vi]: result.passionScore,
        [perseveranceInfo.name_vi]: result.perseveranceScore,
      },
      rawLabel: result.level.level,
      description: description,
    };
  };

  const calculateRIASECResult = (
    answers: Record<number, string | number | boolean>
  ): TestResult => {
    // Chuyển đổi answers sang Record<number, boolean> cho hàm tính điểm
    const booleanAnswers: Record<number, boolean> = {};
    Object.entries(answers).forEach(([key, value]) => {
      // Xử lý cả boolean trực tiếp và các giá trị khác
      booleanAnswers[Number(key)] =
        value === true || value === "true" || value === 1;
    });

    // Sử dụng hàm tính điểm từ file riasec-questions.ts
    const result = calculateRIASECScores(booleanAnswers);
    const codeInfo = getHollandCodeDescription(result.hollandCode);

    console.log("📊 [RIASEC Result]", {
      hollandCode: result.hollandCode,
      percentages: result.percentages,
      topThree: result.topThree,
    });

    // Tạo description từ top 3 categories
    const topCategoriesDesc = result.topThree
      .map((t) => `${RIASEC_CATEGORIES[t.category].name_vi} (${t.category})`)
      .join(" - ");

    return {
      type: "RIASEC",
      scores: result.percentages,
      rawLabel: result.hollandCode,
      description: `${codeInfo.title}: ${codeInfo.description}\n\nXu hướng chính: ${topCategoriesDesc}`,
    };
  };

  const handleTestComplete = async (
    answers: Record<number, string | number | boolean>
  ) => {
    if (!currentTestType) return;
    const studentId = getStudentId();
    if (!studentId || !currentTestId) {
      alert("Không tìm thấy student_id hoặc test_id. Vui lòng thử lại.");
      return;
    }

    try {
      // Gửi đáp án và nhận kết quả ngay từ API submit
      // API submit sẽ gọi MBTI API từ server-ai và lưu scores vào DB
      toast.info("Đang phân tích kết quả bằng AI...", {
        description: "Vui lòng đợi trong giây lát...",
      });

      const apiResult = await submitAnswersToApi(answers, currentTestType);

      // For MBTI, API submit đã gọi MBTI API và lưu scores vào DB
      if (currentTestType === "MBTI") {
        if (apiResult && apiResult.result_type && apiResult.scores) {
          console.log(
            "✅ [MBTI] AI prediction received from submit API:",
            apiResult.result_type
          );

          const typeInfo = MBTI_TYPE_DESCRIPTIONS[apiResult.result_type] || {
            title: apiResult.result_type,
            description: "Đang cập nhật mô tả...",
          };

          setTestResult({
            type: "MBTI",
            scores: apiResult.scores,
            rawLabel: apiResult.result_type,
            description: typeInfo.description,
          });
          saveTestResult("MBTI", {
            type: "MBTI",
            scores: apiResult.scores,
            rawLabel: apiResult.result_type,
            description: typeInfo.description,
          });

          toast.success("Phân tích MBTI hoàn tất", {
            description: `Loại tính cách của bạn: ${apiResult.result_type}`,
          });
        } else {
          // API submit failed - don't use fallback, show error
          throw new Error(
            apiResult?.error ||
              "Không thể phân tích MBTI. Vui lòng thử lại sau."
          );
        }
      }
      // For other tests, use API result or local calculation
      else {
        let computedResult: TestResult | null = null;

        if (apiResult) {
          if (currentTestType === "RIASEC" && apiResult.result_code) {
            computedResult = {
              type: "RIASEC",
              scores: apiResult.scores || {},
              rawLabel: apiResult.result_code,
              description: "",
            };
          } else if (
            currentTestType === "GRIT" &&
            apiResult.total_score !== undefined
          ) {
            computedResult = {
              type: "GRIT",
              scores: {
                Grit: apiResult.total_score,
                "Đam mê": apiResult.passion_score || 0,
                "Kiên trì": apiResult.perseverance_score || 0,
              },
              rawLabel: apiResult.level,
              description: apiResult.description || "",
            };
          }
        }

        // Fall back local calc nếu API không trả về kết quả
        if (!computedResult) {
          console.warn("⚠️ API did not return result, calculating locally");
          switch (currentTestType) {
            case "RIASEC":
              computedResult = calculateRIASECResult(answers);
              break;
            case "GRIT":
              computedResult = calculateGritResult(answers);
              break;
          }
        }

        if (computedResult) {
          setTestResult(computedResult);
          saveTestResult(currentTestType, computedResult);
        }
      }

      // Cập nhật remainingTests & allCompleted tạm thời
      const allTests: TestType[] = ["MBTI", "GRIT", "RIASEC"];
      const newCompleted = progress.completedTests.includes(currentTestType)
        ? progress.completedTests
        : [...progress.completedTests, currentTestType];
      const remaining = allTests.filter(
        (t) => !newCompleted.includes(t)
      ) as TestType[];
      setCurrentRemainingTests(remaining);
      const newAllCompleted = newCompleted.length >= 3;
      setCurrentAllCompleted(newAllCompleted);

      setViewState("result");

      // Nếu đã đủ 3 bài, chỉ cập nhật DB, không tự động gọi API career-assessment
      if (newAllCompleted) {
        try {
          await fetch("/api/tests/complete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ student_id: studentId }),
          });

          toast.success("Hoàn thành tất cả bài test!", {
            description:
              'Bạn đã hoàn thành tất cả 3 bài test. Bấm nút "Đề xuất nghề nghiệp" để xem gợi ý.',
          });
        } catch (e) {
          console.error("Complete all tests error", e);
          toast.error("Lỗi khi cập nhật trạng thái", {
            description: "Vui lòng thử lại sau hoặc liên hệ hỗ trợ",
          });
        }
      } else {
        setCareerRecs([]);
      }
    } catch (error: any) {
      console.error("❌ Test submission error:", error);

      // Show specific error message for MBTI API failures
      if (currentTestType === "MBTI") {
        toast.error("Không thể phân tích MBTI", {
          description:
            error.message ||
            "Không thể kết nối đến server AI. Vui lòng kiểm tra kết nối và thử lại.",
        });
      } else {
        toast.error("Có lỗi xảy ra khi nộp bài test", {
          description:
            error.message ||
            "Vui lòng thử lại sau. Nếu vấn đề vẫn tiếp tục, hãy liên hệ hỗ trợ.",
        });
      }
    }
  };

  const fetchCareerRecommendations = async (studentId: string) => {
    try {
      const res = await fetch(`/api/tests/career/${studentId}`);
      const data = await res.json();
      if (data.success) {
        const recs: MajorRecommendation[] = (data.recommendations || []).map(
          (r: any) => ({
            name: r.job_title,
            category: "",
            matchReason: r.reasoning,
            careerPaths: [],
            requiredSkills: [],
            matchPercentage: r.match_percentage,
          })
        );
        setCareerRecs(recs);
        setRecommendations(recs);

        if (recs.length > 0) {
          toast.success("Đã tạo gợi ý nghề nghiệp", {
            description: `Tìm thấy ${recs.length} nghề nghiệp phù hợp với bạn`,
          });
        }
      } else {
        toast.warning("Chưa có gợi ý nghề nghiệp", {
          description: "Vui lòng hoàn thành tất cả các bài test để nhận gợi ý",
        });
      }
    } catch (e) {
      console.error("Fetch career recs error", e);
      toast.error("Không thể tải gợi ý nghề nghiệp", {
        description: "Vui lòng thử lại sau",
      });
    }
  };

  const handleBackToSelection = () => {
    setViewState("selection");
    setCurrentTestType(null);
    setCurrentTestId(null);
    setTestResult(null);
    setRecommendations([]);
  };

  const handleStartNextTest = (type: TestType) => {
    setCurrentTestType(null);
    setTestResult(null);
    setRecommendations([]);
    handleStartTest(type);
  };

  const handleViewAllRecommendations = async () => {
    const studentId = getStudentId();
    if (!studentId) {
      toast.error("Không tìm thấy thông tin người dùng", {
        description: "Vui lòng đăng nhập lại để tiếp tục",
      });
      return;
    }

    // Hiển thị CareerAssessmentResults component và trigger load
    setShowCareerAssessment(true);
    setViewState("selection");

    // Scroll to CareerAssessmentResults component
    setTimeout(() => {
      const element = document.getElementById("career-assessment-results");
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const handleViewResult = (type: TestType) => {
    // Lấy kết quả đã lưu từ progress và hiển thị
    const result = progress.results[type];
    if (result) {
      setTestResult(result);
      setCurrentTestType(type);
      setViewState("result");
      toast.success("Đã tải kết quả", {
        description: `Đang hiển thị kết quả bài test ${type}`,
      });
    } else {
      console.warn("No saved result found for", type);
      toast.error("Không tìm thấy kết quả", {
        description: `Chưa có kết quả cho bài test ${type}. Vui lòng làm bài test trước.`,
      });
    }
  };

  const handleResetTest = async (type: TestType) => {
    const studentId = getStudentId();
    if (!studentId) {
      toast.error("Không tìm thấy thông tin người dùng", {
        description: "Vui lòng đăng nhập lại để tiếp tục",
      });
      return;
    }

    // Xác nhận trước khi reset
    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn làm lại bài test ${type}? Kết quả cũ sẽ bị xóa và bạn sẽ phải làm lại từ đầu.`
    );

    if (!confirmed) return;

    try {
      toast.info("Đang xóa kết quả test cũ...", {
        description: `Đang reset bài test ${type}...`,
      });

      const testTypeLower = type.toLowerCase();
      const response = await fetch(`/api/tests/${testTypeLower}/${studentId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Không thể reset test");
      }

      // Refresh progress để cập nhật UI
      // Force reload bằng cách trigger useEffect
      window.location.reload(); // Simple approach - reload page to refresh state

      toast.success("Đã reset test thành công", {
        description: `Bạn có thể làm lại bài test ${type} ngay bây giờ`,
      });
    } catch (error: any) {
      console.error("Reset test error:", error);
      toast.error("Không thể reset test", {
        description: error.message || "Đã xảy ra lỗi. Vui lòng thử lại sau.",
      });
    }
  };

  // Loading state khi chưa load xong từ localStorage
  if (!isLoaded) {
    return (
      <>
        <AuthHeader />
        <main className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <AuthHeader />
      <main className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {viewState === "selection" && (
            <>
              <TestSelection
                onStartTest={handleStartTest}
                onViewResult={handleViewResult}
                onResetTest={handleResetTest}
                completedTests={progress.completedTests}
                testResults={progress.results}
                onViewRecommendations={handleViewAllRecommendations}
              />

              {/* Career Assessment Results - chỉ hiển thị khi bấm nút hoặc đã có recommendations */}
              {currentAllCompleted && studentId && showCareerAssessment && (
                <div id="career-assessment-results" className="mt-8">
                  <CareerAssessmentResults
                    studentId={studentId}
                    onClose={() => setShowCareerAssessment(false)}
                    autoLoad={true}
                  />
                </div>
              )}
            </>
          )}

          {viewState === "test" && currentTestType && (
            <TestView
              testType={currentTestType}
              questions={getQuestionsForTest(currentTestType)}
              onBack={handleBackToSelection}
              onComplete={handleTestComplete}
            />
          )}

          {viewState === "result" && (
            <ResultView
              result={testResult}
              recommendations={careerRecs.length ? careerRecs : recommendations}
              loadingRecommendations={loadingRecommendations}
              onBackToDashboard={handleBackToSelection}
              remainingTests={currentRemainingTests}
              onStartNextTest={handleStartNextTest}
              allTestsCompleted={currentAllCompleted}
              onViewAllRecommendations={handleViewAllRecommendations}
            />
          )}
        </div>
      </main>
    </>
  );
}
