import { NextRequest, NextResponse } from "next/server";
import type {
  CareerAssessmentInput,
  CareerAssessmentOutput,
  CareerGroups,
  CareerRecommendation,
} from "@/lib/schemas/career-assessment.schema";
import { normalizeCareerAssessmentOutput } from "@/lib/schemas/career-assessment.schema";

export async function POST(request: NextRequest) {
  try {
    const { student_id } = await request.json();

    if (!student_id) {
      return NextResponse.json(
        {
          success: false,
          error: "student_id is required",
        },
        { status: 400 }
      );
    }

    // Get test results from database
    const testResults = await getStudentTestResults(student_id);

    if (!testResults.mbti || !testResults.riasec || !testResults.grit) {
      console.error("❌ [Career Assessment] Missing tests:", {
        mbti: !!testResults.mbti,
        riasec: !!testResults.riasec,
        grit: !!testResults.grit,
      });
      return NextResponse.json(
        {
          success: false,
          error:
            "Student must complete all 3 tests (MBTI, RIASEC, GRIT) before getting career recommendations",
        },
        { status: 400 }
      );
    }

    // Transform test results to external API format
    const externalRequest: CareerAssessmentInput = {
      mbti_answers: transformMBTIAnswers(testResults.mbti.answers),
      grit_answers: transformGritAnswers(testResults.grit.answers),
      riasec_answers: transformRIASECAnswers(testResults.riasec.answers),
      top_n: 10,
      min_match_score: 50.0,
    };

    // Call AI API using centralized client
    const { callCareerAssessment } = await import("@/lib/ai-api-client");

    let externalResult: CareerAssessmentOutput;
    try {
      const rawResult = await callCareerAssessment(externalRequest);

      // Normalize and validate response
      const normalized = normalizeCareerAssessmentOutput(rawResult);
      if (!normalized) {
        console.error("❌ [Career Assessment] Invalid response format");
        return NextResponse.json(
          {
            success: false,
            error: "Invalid response format from AI server",
          },
          { status: 500 }
        );
      }

      externalResult = normalized;
    } catch (error) {
      console.error("❌ [Career Assessment] Failed to call AI API:", error);
      return NextResponse.json(
        {
          success: false,
          error:
            "Cannot connect to AI server. Make sure Django server is running.",
          details: error instanceof Error ? error.message : String(error),
        },
        { status: 503 }
      );
    }

    if (!externalResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Career assessment failed",
        },
        { status: 500 }
      );
    }

    // Transform career_groups - keep original CareerRecommendation format
    let careerGroups: CareerGroups | undefined;
    const jobFieldMap = new Map<string, string>(); // Map job title -> job_field (group name)

    if (externalResult.career_groups) {
      careerGroups = {} as CareerGroups;
      for (const [groupName, groupRecs] of Object.entries(
        externalResult.career_groups
      )) {
        // Map job title to job_field (group name) for all recommendations in this group
        (groupRecs as CareerRecommendation[]).forEach((rec) => {
          jobFieldMap.set(rec.title, groupName);
        });

        // Keep original CareerRecommendation format
        careerGroups[groupName] = groupRecs as CareerRecommendation[];
      }
    }

    // Transform response to our format - include job_field from career_groups
    const recommendations = externalResult.recommendations.map((rec) => {
      const jobField = jobFieldMap.get(rec.title) || null; // Get group name from map
      return {
        name: rec.title,
        category: jobField || rec.riasec_code, // Use job_field (group name) if available, fallback to riasec_code
        matchReason:
          rec.description ||
          `Phù hợp ${rec.match_score.toFixed(1)}% với kết quả test của bạn`,
        careerPaths: [],
        requiredSkills: [],
        matchPercentage: Math.round(rec.match_score),
        riasecCode: rec.riasec_code,
        riasecScores: rec.riasec_scores,
      };
    });

    // Store assessment results with career groups
    // Truyền jobFieldMap để đảm bảo mapping chính xác từ title -> group name
    // jobFieldMap đã được tạo từ career_groups với mapping: title -> group name
    await storeCareerAssessment(
      student_id,
      externalResult.assessment,
      recommendations,
      careerGroups,
      jobFieldMap
    );

    return NextResponse.json({
      success: true,
      assessment: externalResult.assessment,
      recommendations,
      career_groups: careerGroups, // Include career groups in response
      message: `Found ${recommendations.length} career recommendations`,
    });
  } catch (error: any) {
    console.error("❌ [Career Assessment] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}

// Helper functions to get test results from database
async function getStudentTestResults(studentId: string) {
  let mbtiTest = null;
  let riasecTest = null;
  let gritTest = null;

  try {
    // Try Prisma first
    const { prisma } = await import("@/lib/prisma");

    const [mbti, riasec, grit] = await Promise.all([
      prisma.mbti_tests.findFirst({
        where: { student_id: studentId, status: "COMPLETED" },
        orderBy: { updated_at: "desc" },
      }),
      prisma.riasec_tests.findFirst({
        where: { student_id: studentId, status: "COMPLETED" },
        orderBy: { updated_at: "desc" },
      }),
      prisma.grit_tests.findFirst({
        where: { student_id: studentId, status: "COMPLETED" },
        orderBy: { updated_at: "desc" },
      }),
    ]);

    mbtiTest = mbti;
    riasecTest = riasec;
    gritTest = grit;
  } catch (prismaError) {
    // Fallback to Supabase
    try {
      const { supabaseAdmin } = await import("@/lib/supabase");

      const [mbtiQuery, riasecQuery, gritQuery] = await Promise.all([
        supabaseAdmin
          .from("mbti_tests")
          .select("*")
          .eq("student_id", studentId)
          .eq("status", "COMPLETED")
          .order("updated_at", { ascending: false })
          .limit(1),
        supabaseAdmin
          .from("riasec_tests")
          .select("*")
          .eq("student_id", studentId)
          .eq("status", "COMPLETED")
          .order("updated_at", { ascending: false })
          .limit(1),
        supabaseAdmin
          .from("grit_tests")
          .select("*")
          .eq("student_id", studentId)
          .eq("status", "COMPLETED")
          .order("updated_at", { ascending: false })
          .limit(1),
      ]);

      mbtiTest = mbtiQuery.data?.[0] || null;
      riasecTest = riasecQuery.data?.[0] || null;
      gritTest = gritQuery.data?.[0] || null;
    } catch (supabaseError) {
      console.error(
        "❌ Supabase also failed:",
        (supabaseError as Error).message
      );
    }
  }

  if (!mbtiTest || !riasecTest || !gritTest) {
    const missing = [];
    if (!mbtiTest) missing.push("MBTI");
    if (!riasecTest) missing.push("RIASEC");
    if (!gritTest) missing.push("GRIT");

    throw new Error(
      `Missing completed tests: ${missing.join(
        ", "
      )}. Please complete all tests first.`
    );
  }

  return {
    mbti: mbtiTest,
    riasec: riasecTest,
    grit: gritTest,
  };
}

// Transform MBTI answers from our format to external API format
function transformMBTIAnswers(answers: any): number[] {
  // External API expects 60 numbers in range [-3, 3]
  // You'll need to map your MBTI answer format to this
  if (Array.isArray(answers) && answers.length === 60) {
    return answers.map((a) => Math.max(-3, Math.min(3, Number(a) || 0)));
  }

  // If answers is an object, convert to array
  if (typeof answers === "object" && answers !== null) {
    const answerArray: number[] = [];
    for (let i = 1; i <= 60; i++) {
      const value = answers[i] || answers[i.toString()] || 0;
      answerArray.push(Math.max(-3, Math.min(3, Number(value))));
    }
    return answerArray;
  }

  // Fallback: return neutral answers
  return new Array(60).fill(0);
}

// Transform GRIT answers from our format to external API format
function transformGritAnswers(answers: any): Record<string, number> {
  // External API expects object with keys "1"-"12", values 1-5
  const transformed: Record<string, number> = {};

  if (typeof answers === "object" && answers !== null) {
    for (let i = 1; i <= 12; i++) {
      const key = i.toString();
      const value = answers[i] || answers[key] || 3;
      transformed[key] = Math.max(1, Math.min(5, Number(value)));
    }
  } else {
    // Fallback: neutral answers
    for (let i = 1; i <= 12; i++) {
      transformed[i.toString()] = 3;
    }
  }

  return transformed;
}

// Transform RIASEC answers from our format to external API format
function transformRIASECAnswers(answers: any): Record<string, number> {
  // External API expects object with keys "1"-"48", values 1-5
  // Database stores 1-5 scale directly, so we just pass it through
  const transformed: Record<string, number> = {};

  if (typeof answers === "object" && answers !== null) {
    for (let i = 1; i <= 48; i++) {
      const key = i.toString();
      const value = answers[i] || answers[key];

      // If value is a number (1-5 scale from database), use it directly
      if (typeof value === "number") {
        transformed[key] = Math.max(1, Math.min(5, value));
      }
      // If somehow it's boolean (legacy), convert: true -> 5, false -> 1
      else if (typeof value === "boolean") {
        transformed[key] = value ? 5 : 1;
      }
      // Fallback: neutral answer
      else {
        transformed[key] = 3;
      }
    }
  } else {
    // Fallback: neutral answers
    for (let i = 1; i <= 48; i++) {
      transformed[i.toString()] = 3;
    }
  }

  return transformed;
}

// Store career assessment results with career groups
async function storeCareerAssessment(
  studentId: string,
  assessment: any,
  recommendations: any[],
  careerGroups?: CareerGroups,
  jobFieldMap?: Map<string, string> // Map job title -> group name (job_field) từ career_groups
) {
  try {
    const { prisma } = await import("@/lib/prisma");
    const { randomUUID } = await import("crypto");

    console.log(
      "📦 [Career Assessment] Storing results for student:",
      studentId
    );
    console.log("   Recommendations:", recommendations.length);
    if (careerGroups) {
      console.log("   Career groups:", Object.keys(careerGroups).length);
    }
    if (jobFieldMap) {
      console.log("   Job field map size:", jobFieldMap.size);
    }

    // Xóa career_matches cũ của student này
    await prisma.career_matches.deleteMany({
      where: { student_id: studentId },
    });
    console.log("🗑️ [Career Assessment] Deleted old career matches");

    // Sử dụng jobFieldMap đã được tạo sẵn, hoặc tạo lại từ careerGroups nếu không có
    let finalJobFieldMap = jobFieldMap || new Map<string, string>();
    if (!jobFieldMap && careerGroups) {
      for (const [groupName, groupRecs] of Object.entries(careerGroups)) {
        for (const rec of groupRecs) {
          // CareerRecommendation has 'title' field
          finalJobFieldMap.set(rec.title, groupName);
        }
      }
    }

    // Lưu career_matches với job_field = group name
    // Sử dụng jobFieldMap để lấy job_field (group name) chính xác từ job title
    const careerMatches = recommendations.map((rec: any) => {
      // Lấy job title - rec.name đã được set từ rec.title trong transform
      const jobTitle = rec.name || rec.title;

      // Lấy job_field (group name) từ map dựa trên job title
      // jobFieldMap maps: title -> group name (e.g., "Patternmakers, Wood" -> "Kỹ thuật")
      // jobFieldMap được tạo từ career_groups với key = rec.title
      const jobField = finalJobFieldMap.get(jobTitle) || null;

      console.log(`  💼 ${jobTitle} -> job_field: ${jobField || "null"}`);

      return {
        id: randomUUID(),
        student_id: studentId,
        job_title: jobTitle,
        match_percentage: rec.matchPercentage,
        reasoning: rec.matchReason || null,
        job_field: jobField, // Group name từ career_groups (e.g., "Kỹ thuật", "Công nghệ thông tin")
      };
    });

    if (careerMatches.length > 0) {
      try {
        await prisma.career_matches.createMany({
          data: careerMatches,
        });
      } catch (dbError: any) {
        // Nếu lỗi do column job_field không tồn tại, thử lưu lại không có job_field
        const errorMessage = dbError.message || String(dbError);
        if (
          errorMessage.includes("job_field") ||
          errorMessage.includes("does not exist")
        ) {
          // Tạo lại data không có job_field
          const careerMatchesWithoutJobField = careerMatches.map(
            ({ job_field, ...rest }) => rest
          );

          await prisma.career_matches.createMany({
            data: careerMatchesWithoutJobField,
          });
        } else {
          throw dbError; // Re-throw nếu không phải lỗi job_field
        }
      }
    }
  } catch (error) {
    console.error("❌ [Career Assessment] Error storing results:", error);
    throw error; // Re-throw để caller biết có lỗi
  }
}
