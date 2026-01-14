import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateMBTIResult } from "@/data/mbti-questions";
import { calculateRIASECResult } from "@/data/riasec-questions";
import { calculateGritResult } from "@/data/grit-questions";

// ===========================================
// POST /api/tests/submit - Submit all answers at once
// ===========================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { test_id, student_id, test_type, answers } = body;

    // Validation
    if (!test_id || !student_id || !test_type || !answers) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing required fields: test_id, student_id, test_type, answers",
        },
        { status: 400 }
      );
    }

    if (!["mbti", "riasec", "grit"].includes(test_type)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid test_type",
        },
        { status: 400 }
      );
    }

    console.log("📝 [Submit Test] Submitting test:", {
      test_id,
      student_id,
      test_type,
      answersCount: Object.keys(answers).length,
    });

    let result;

    switch (test_type) {
      case "mbti":
        result = await submitMBTITest(test_id, student_id, answers);
        break;
      case "riasec":
        result = await submitRIASECTest(test_id, student_id, answers);
        break;
      case "grit":
        result = await submitGritTest(test_id, student_id, answers);
        break;
      default:
        return NextResponse.json(
          {
            success: false,
            error: `Invalid test type: ${test_type}`,
          },
          { status: 400 }
        );
    }

    if (!result || !result.success) {
      // Return appropriate status code based on error type
      const errorMessage = result?.error || "Test submission failed";
      // Type assertion for result with optional details
      const resultWithDetails = result as {
        success: boolean;
        error?: string;
        details?: string;
      };
      const details = resultWithDetails.details;
      const statusCode =
        (details && details.includes("kết nối")) ||
        errorMessage.includes("kết nối")
          ? 503 // Service Unavailable for connection errors
          : 400; // Bad Request for validation errors

      const response: { success: boolean; error: string; details?: string } = {
        success: false,
        error: errorMessage,
      };
      if (details) {
        response.details = details;
      }

      return NextResponse.json(response, { status: statusCode });
    }

    console.log("✅ [Submit Test] Test completed successfully:", test_type);

    return NextResponse.json({
      success: true,
      message: "Test submitted and completed successfully",
      result: result.data,
    });
  } catch (error) {
    console.error("❌ [Submit Test] Error:", error);
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
// Submit MBTI Test
// ===========================================
async function submitMBTITest(
  test_id: string,
  student_id: string,
  answers: Record<number, number>
) {
  // Validate answers count
  const answersCount = Object.keys(answers).length;
  if (answersCount !== 60) {
    return {
      success: false,
      error: `MBTI test requires 60 answers, received ${answersCount}`,
    };
  }

  // Validate answer range (-3 to 3 from UI)
  for (const [key, value] of Object.entries(answers)) {
    if (value < -3 || value > 3) {
      return {
        success: false,
        error: `MBTI answer must be between -3 and 3, received ${value} for question ${key}`,
      };
    }
  }

  // Convert to array format for database (0-indexed)
  const answersArray: number[] = [];
  for (let i = 1; i <= 60; i++) {
    answersArray.push(answers[i] || 0);
  }

  // Call MBTI API from server-ai to get accurate prediction
  console.log("🤖 [MBTI] Calling MBTI API from server-ai...");

  try {
    const { callMBTIAssessment } = await import("@/lib/ai-api-client");
    const aiResult = await callMBTIAssessment(answersArray);

    if (!aiResult.success || !aiResult.mbti) {
      throw new Error("Invalid response from MBTI API");
    }

    const mbtiResult = aiResult.mbti;
    const dimensions = mbtiResult.dimension_scores;

    // Convert probabilities (0-1) to percentages (0-100) and round
    const detailedScores = {
      E: Math.round((dimensions.E || 0) * 100),
      I: Math.round((dimensions.I || 0) * 100),
      S: Math.round((dimensions.S || 0) * 100),
      N: Math.round((dimensions.N || 0) * 100),
      T: Math.round((dimensions.T || 0) * 100),
      F: Math.round((dimensions.F || 0) * 100),
      J: Math.round((dimensions.J || 0) * 100),
      P: Math.round((dimensions.P || 0) * 100),
    };

    // Update database with AI prediction and scores
    await prisma.mbti_tests.update({
      where: { id: test_id },
      data: {
        answers: answersArray,
        status: "COMPLETED",
        result_type: mbtiResult.personality_type,
        score_e: detailedScores.E,
        score_i: detailedScores.I,
        score_s: detailedScores.S,
        score_n: detailedScores.N,
        score_t: detailedScores.T,
        score_f: detailedScores.F,
        score_j: detailedScores.J,
        score_p: detailedScores.P,
        current_step: 60,
        completed_at: new Date(),
        updated_at: new Date(),
      },
    });

    console.log("✅ [MBTI] AI prediction saved:", {
      type: mbtiResult.personality_type,
      confidence: mbtiResult.confidence,
      scores: detailedScores,
    });

    return {
      success: true,
      data: {
        result_type: mbtiResult.personality_type,
        scores: detailedScores,
        dimension_scores: dimensions,
        confidence: mbtiResult.confidence,
      },
    };
  } catch (error: any) {
    console.error("❌ [MBTI] AI API error:", error);

    // If AI API fails, return error - don't save incomplete data
    return {
      success: false,
      error:
        "Không thể kết nối đến server AI để dự đoán MBTI. Vui lòng kiểm tra kết nối và thử lại.",
      details: error.message || "Unknown error",
    };
  }
}

// ===========================================
// Submit RIASEC Test
// ===========================================
async function submitRIASECTest(
  test_id: string,
  student_id: string,
  answers: Record<number, number>
) {
  // Validate answers count
  const answersCount = Object.keys(answers).length;
  if (answersCount !== 48) {
    return {
      success: false,
      error: `RIASEC test requires 48 answers, received ${answersCount}`,
    };
  }

  // Validate answer range (1 to 5)
  for (const [key, value] of Object.entries(answers)) {
    if (value < 1 || value > 5) {
      return {
        success: false,
        error: `RIASEC answer must be between 1 and 5, received ${value} for question ${key}`,
      };
    }
  }

  // Convert to object format for database (string keys)
  const answersObject: Record<string, number> = {};
  for (let i = 1; i <= 48; i++) {
    answersObject[i.toString()] = answers[i] || 1;
  }

  // Call RIASEC API from server-ai to get accurate calculation
  console.log("🤖 [RIASEC] Calling RIASEC API from server-ai...");

  try {
    const { callRIASECAssessment } = await import("@/lib/ai-api-client");
    const aiResult = await callRIASECAssessment(answersObject);

    if (!aiResult.success || !aiResult.riasec) {
      throw new Error("Invalid response from RIASEC API");
    }

    const riasecResult = aiResult.riasec;

    console.log("✅ [RIASEC] AI calculation successful:", {
      code: riasecResult.code,
      scores: riasecResult.scores,
    });

    // Update database with AI results
    await prisma.riasec_tests.update({
      where: { id: test_id },
      data: {
        answers: answersObject,
        status: "COMPLETED",
        result_code: riasecResult.code,
        score_realistic: riasecResult.scores.Realistic,
        score_investigative: riasecResult.scores.Investigative,
        score_artistic: riasecResult.scores.Artistic,
        score_social: riasecResult.scores.Social,
        score_enterprising: riasecResult.scores.Enterprising,
        score_conventional: riasecResult.scores.Conventional,
        top_3_types: riasecResult.top3.map(
          ([category, _]: [string, number]) => category
        ),
        current_step: 48,
        completed_at: new Date(),
        updated_at: new Date(),
      },
    });

    return {
      success: true,
      data: {
        result_code: riasecResult.code,
        scores: riasecResult.scores,
        top_3: riasecResult.top3.map(([category, score]: [string, number]) => ({
          category,
          score,
          info: {
            name: category,
            name_vi: category,
          },
        })),
      },
    };
  } catch (error: any) {
    console.error("❌ [RIASEC] AI API error:", error);

    // If AI API fails, return error - don't save incomplete data
    return {
      success: false,
      error:
        "Không thể kết nối đến server AI để tính toán RIASEC. Vui lòng kiểm tra kết nối và thử lại.",
      details: error.message || "Unknown error",
    };
  }
}

// ===========================================
// Submit GRIT Test
// ===========================================
async function submitGritTest(
  test_id: string,
  student_id: string,
  answers: Record<number, number>
) {
  // Validate answers count
  const answersCount = Object.keys(answers).length;
  if (answersCount !== 12) {
    return {
      success: false,
      error: `GRIT test requires 12 answers, received ${answersCount}`,
    };
  }

  // Validate answer range (1 to 5)
  for (const [key, value] of Object.entries(answers)) {
    if (value < 1 || value > 5) {
      return {
        success: false,
        error: `GRIT answer must be between 1 and 5, received ${value} for question ${key}`,
      };
    }
  }

  // Convert to object format for database (string keys)
  const answersObject: Record<string, number> = {};
  for (let i = 1; i <= 12; i++) {
    answersObject[i.toString()] = answers[i] || 1;
  }

  // Calculate results
  const calculatedResult = calculateGritResult(answers);

  // Update database
  await prisma.grit_tests.update({
    where: { id: test_id },
    data: {
      answers: answersObject,
      status: "COMPLETED",
      total_score: calculatedResult.gritScore,
      passion_score: calculatedResult.passionScore,
      perseverance_score: calculatedResult.perseveranceScore,
      level: calculatedResult.level.level,
      description: calculatedResult.level.description,
      current_step: 12,
      updated_at: new Date(),
    },
  });

  console.log("✅ [GRIT] Calculated result:", calculatedResult.level.level);

  return {
    success: true,
    data: {
      total_score: calculatedResult.gritScore,
      passion_score: calculatedResult.passionScore,
      perseverance_score: calculatedResult.perseveranceScore,
      level: calculatedResult.level.level,
      description: calculatedResult.level.description,
    },
  };
}
