// filepath: d:\holyann-ai-web\src\app\api\tests\complete\route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateMBTIResult } from "@/data/mbti-questions";
import { calculateRIASECResult } from "@/data/riasec-questions";
import { calculateGritResult } from "@/data/grit-questions";
import type { CareerAssessmentOutput } from "@/lib/schemas/career-assessment.schema";

// Use centralized AI API client instead of direct fetch

// ===========================================
// POST /api/tests/complete - Hoàn thành test và tính kết quả
// ===========================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { student_id, test_type } = body;

    // Validation
    if (!student_id) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing student_id",
        },
        { status: 400 }
      );
    }

    // Nếu có test_type, tính điểm cho test đó
    if (test_type) {
      const result = await completeIndividualTest(student_id, test_type);
      return NextResponse.json(result);
    }

    // Nếu không có test_type, kiểm tra và hoàn thành tất cả
    const allResults = await completeAllTests(student_id);
    return NextResponse.json(allResults);
  } catch (error) {
    console.error("Error completing test:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// ===========================================
// Hoàn thành một test cụ thể
// ===========================================
async function completeIndividualTest(student_id: string, test_type: string) {
  switch (test_type) {
    case "mbti":
      return await completeMBTITest(student_id);
    case "riasec":
      return await completeRIASECTest(student_id);
    case "grit":
      return await completeGritTest(student_id);
    default:
      return { success: false, error: "Invalid test_type" };
  }
}

// ===========================================
// Hoàn thành tất cả tests và gọi AI
// ===========================================
async function completeAllTests(student_id: string) {
  // Lấy tất cả 3 bài test
  const [mbtiTest, riasecTest, gritTest] = await Promise.all([
    prisma.mbti_tests.findUnique({ where: { student_id } }),
    prisma.riasec_tests.findUnique({ where: { student_id } }),
    prisma.grit_tests.findUnique({ where: { student_id } }),
  ]);

  // Kiểm tra đã làm đủ 3 bài test chưa
  if (!mbtiTest || !riasecTest || !gritTest) {
    const missing = [];
    if (!mbtiTest) missing.push("MBTI");
    if (!riasecTest) missing.push("RIASEC");
    if (!gritTest) missing.push("GRIT");
    return {
      success: false,
      error: `Missing tests: ${missing.join(", ")}. Complete all tests first.`,
      missing_tests: missing,
    };
  }

  // Tính điểm cho từng test nếu chưa completed
  let mbtiResult, riasecResult, gritResult;

  if (mbtiTest.status !== "COMPLETED") {
    const res = await completeMBTITest(student_id);
    mbtiResult = res.result;
  } else {
    mbtiResult = {
      result_type: mbtiTest.result_type,
      scores: {
        E: mbtiTest.score_e,
        I: mbtiTest.score_i,
        S: mbtiTest.score_s,
        N: mbtiTest.score_n,
        T: mbtiTest.score_t,
        F: mbtiTest.score_f,
        J: mbtiTest.score_j,
        P: mbtiTest.score_p,
      },
    };
  }

  if (riasecTest.status !== "COMPLETED") {
    const res = await completeRIASECTest(student_id);
    riasecResult = res.result;
  } else {
    riasecResult = {
      result_code: riasecTest.result_code,
      scores: {
        R: riasecTest.score_realistic,
        I: riasecTest.score_investigative,
        A: riasecTest.score_artistic,
        S: riasecTest.score_social,
        E: riasecTest.score_enterprising,
        C: riasecTest.score_conventional,
      },
      top_3: riasecTest.top_3_types,
    };
  }

  if (gritTest.status !== "COMPLETED") {
    const res = await completeGritTest(student_id);
    gritResult = res.result;
  } else {
    gritResult = {
      total_score: gritTest.total_score,
      level: gritTest.level,
      description: gritTest.description,
    };
  }

  // Cập nhật student.assessments_completed
  await prisma.students.update({
    where: { user_id: student_id },
    data: { assessments_completed: true },
  });

  // Kiểm tra xem đã có career recommendations chưa
  // Xử lý trường hợp job_field chưa có trong database
  let existingMatches: any[];
  try {
    existingMatches = await prisma.career_matches.findMany({
      where: { student_id },
      orderBy: { match_percentage: "desc" },
    });
  } catch (error: any) {
    // Nếu lỗi do job_field không tồn tại, dùng raw query
    const errorMessage = error.message || String(error);
    if (
      errorMessage.includes("job_field") ||
      errorMessage.includes("does not exist")
    ) {
      existingMatches = (await prisma.$queryRaw`
                SELECT id, student_id, job_title, match_percentage, reasoning, created_at
                FROM career_matches
                WHERE student_id = ${student_id}::uuid
                ORDER BY match_percentage DESC
            `) as any[];
    } else {
      throw error;
    }
  }

  let careerRecommendations: any[] = [];

  if (existingMatches.length > 0) {
    // Đã có recommendations rồi, chỉ trả về từ database
    careerRecommendations = existingMatches.map((match: any) => ({
      title: match.job_title,
      match_score: match.match_percentage,
      description: match.reasoning,
      riasec_code: null,
      riasec_scores: null,
    }));
  } else {
    // Chưa có recommendations, gọi AI API lần đầu tiên
    try {
      const aiResponse = await callAICareerAssessment(
        mbtiTest.answers,
        riasecTest.answers,
        gritTest.answers
      );

      // Type guard: kiểm tra success và recommendations tồn tại
      if (
        aiResponse.success &&
        "recommendations" in aiResponse &&
        Array.isArray(aiResponse.recommendations) &&
        aiResponse.recommendations.length > 0
      ) {
        // Tạo map từ job title -> job_field (nhóm ngành) từ career_groups
        const jobFieldMap = new Map<string, string>();
        if ("career_groups" in aiResponse && aiResponse.career_groups) {
          for (const [groupName, groupRecs] of Object.entries(
            aiResponse.career_groups
          )) {
            for (const rec of groupRecs as any[]) {
              jobFieldMap.set(rec.title || rec.name, groupName);
            }
          }
        }

        // Lưu career_matches vào database (lần đầu tiên và duy nhất) với job_field
        const careerMatches = aiResponse.recommendations.map((rec: any) => ({
          id: crypto.randomUUID(),
          student_id,
          job_title: rec.title || rec.job_title,
          match_percentage: rec.match_score || rec.match_percentage,
          reasoning: rec.description || rec.reasoning,
          job_field: jobFieldMap.get(rec.title || rec.job_title) || null, // Group name từ career_groups
        }));

        try {
          await prisma.career_matches.createMany({ data: careerMatches });
        } catch (dbError: any) {
          // Nếu lỗi do column job_field không tồn tại, thử lưu lại không có job_field
          const errorMessage = dbError.message || String(dbError);
          if (
            errorMessage.includes("job_field") ||
            errorMessage.includes("does not exist")
          ) {
            const careerMatchesWithoutJobField = careerMatches.map(
              ({ job_field, ...rest }) => rest
            ) as Array<{
              id: string;
              student_id: string;
              job_title: string;
              match_percentage: number;
              reasoning: string | null;
            }>;
            await prisma.career_matches.createMany({
              data: careerMatchesWithoutJobField,
            });
          } else {
            throw dbError;
          }
        }

        careerRecommendations = aiResponse.recommendations;
      }
    } catch (error) {
      // Không fail nếu AI API không available
    }
  }

  return {
    success: true,
    message: "All tests completed!",
    assessment: {
      mbti: mbtiResult,
      riasec: riasecResult,
      grit: gritResult,
    },
    recommendations: careerRecommendations,
    is_cached: existingMatches.length > 0, // Cho biết data từ cache hay mới
  };
}

// ===========================================
// Complete MBTI Test
// ===========================================
async function completeMBTITest(student_id: string) {
  const test = await prisma.mbti_tests.findUnique({ where: { student_id } });
  if (!test) {
    return { success: false, error: "MBTI test not found" };
  }

  const answers = test.answers as number[];
  if (answers.length < 60) {
    return {
      success: false,
      error: `MBTI test incomplete. Answered ${answers.length}/60`,
    };
  }

  // Convert answers array to Record<number, number>
  const answersRecord: Record<number, number> = {};
  answers.forEach((val, idx) => {
    answersRecord[idx + 1] = val;
  });

  const result = calculateMBTIResult(answersRecord);

  await prisma.mbti_tests.update({
    where: { id: test.id },
    data: {
      status: "COMPLETED",
      result_type: result.type,
      score_e: result.percentages.E,
      score_i: result.percentages.I,
      score_s: result.percentages.S,
      score_n: result.percentages.N,
      score_t: result.percentages.T,
      score_f: result.percentages.F,
      score_j: result.percentages.J,
      score_p: result.percentages.P,
      completed_at: new Date(),
    },
  });

  return {
    success: true,
    test_type: "mbti",
    result: {
      result_type: result.type,
      scores: result.percentages,
      dimensions: result.dimensions,
    },
  };
}

// ===========================================
// Complete RIASEC Test
// ===========================================
async function completeRIASECTest(student_id: string) {
  const test = await prisma.riasec_tests.findUnique({ where: { student_id } });
  if (!test) {
    return { success: false, error: "RIASEC test not found" };
  }

  const answers = test.answers as Record<string, boolean>;
  if (Object.keys(answers).length < 48) {
    return {
      success: false,
      error: `RIASEC test incomplete. Answered ${
        Object.keys(answers).length
      }/48`,
    };
  }

  // Convert to Record<number, boolean>
  const answersRecord: Record<number, boolean> = {};
  Object.entries(answers).forEach(([key, val]) => {
    answersRecord[Number(key)] = val;
  });

  const result = calculateRIASECResult(answersRecord);

  await prisma.riasec_tests.update({
    where: { id: test.id },
    data: {
      status: "COMPLETED",
      result_code: result.hollandCode,
      score_realistic: result.percentages.R,
      score_investigative: result.percentages.I,
      score_artistic: result.percentages.A,
      score_social: result.percentages.S,
      score_enterprising: result.percentages.E,
      score_conventional: result.percentages.C,
      top_3_types: result.topThree.map((t) => [t.category, t.score]),
      completed_at: new Date(),
    },
  });

  return {
    success: true,
    test_type: "riasec",
    result: {
      result_code: result.hollandCode,
      scores: result.percentages,
      top_3: result.topThree,
    },
  };
}

// ===========================================
// Complete GRIT Test
// ===========================================
async function completeGritTest(student_id: string) {
  const test = await prisma.grit_tests.findUnique({ where: { student_id } });
  if (!test) {
    return { success: false, error: "GRIT test not found" };
  }

  const answers = test.answers as Record<string, number>;
  if (Object.keys(answers).length < 12) {
    return {
      success: false,
      error: `GRIT test incomplete. Answered ${Object.keys(answers).length}/12`,
    };
  }

  // Convert to Record<number, number>
  const answersRecord: Record<number, number> = {};
  Object.entries(answers).forEach(([key, val]) => {
    answersRecord[Number(key)] = val;
  });

  const result = calculateGritResult(answersRecord);

  await prisma.grit_tests.update({
    where: { id: test.id },
    data: {
      status: "COMPLETED",
      total_score: result.gritScore,
      level: result.level.level,
      description: result.level.description,
      completed_at: new Date(),
    },
  });

  return {
    success: true,
    test_type: "grit",
    result: {
      total_score: result.gritScore,
      passion_score: result.passionScore,
      perseverance_score: result.perseveranceScore,
      level: result.level.level,
      description: result.level.description,
    },
  };
}

// ===========================================
// Call AI Career Assessment API
// ===========================================
async function callAICareerAssessment(
  mbti_answers: unknown,
  riasec_answers: unknown,
  grit_answers: unknown
): Promise<CareerAssessmentOutput | { success: false; error: string }> {
  try {
    const { callCareerAssessment } = await import("@/lib/ai-api-client");

    // Transform answers to expected format
    const mbtiArray = Array.isArray(mbti_answers)
      ? mbti_answers.map((a) => Math.max(-3, Math.min(3, Number(a) || 0)))
      : new Array(60).fill(0);

    const gritObj: Record<string, number> = {};
    if (typeof grit_answers === "object" && grit_answers !== null) {
      for (let i = 1; i <= 12; i++) {
        const key = i.toString();
        const value =
          (grit_answers as any)[i] || (grit_answers as any)[key] || 3;
        gritObj[key] = Math.max(1, Math.min(5, Number(value)));
      }
    } else {
      for (let i = 1; i <= 12; i++) {
        gritObj[i.toString()] = 3;
      }
    }

    const riasecObj: Record<string, number> = {};
    if (typeof riasec_answers === "object" && riasec_answers !== null) {
      for (let i = 1; i <= 48; i++) {
        const key = i.toString();
        const value =
          (riasec_answers as any)[i] || (riasec_answers as any)[key];
        if (typeof value === "boolean") {
          riasecObj[key] = value ? 5 : 1;
        } else {
          riasecObj[key] = Math.max(1, Math.min(5, Number(value) || 3));
        }
      }
    } else {
      for (let i = 1; i <= 48; i++) {
        riasecObj[i.toString()] = 3;
      }
    }

    return await callCareerAssessment({
      mbti_answers: mbtiArray,
      grit_answers: gritObj,
      riasec_answers: riasecObj,
      top_n: 10,
      min_match_score: 50.0,
    });
  } catch (error) {
    console.error("AI API Error:", error);
    return { success: false, error: "AI API unavailable" };
  }
}
