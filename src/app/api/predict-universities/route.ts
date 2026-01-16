import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { callUniversityRecommendation } from "@/lib/ai-api-client";
import { randomUUID } from "crypto";
import type {
  UniversityRecommendationInput,
  UniversityRecommendationOutput,
} from "@/lib/schemas/university-recommendation.schema";
import { normalizeUniversityRecommendationOutput } from "@/lib/schemas/university-recommendation.schema";

// POST /api/predict-universities - Predict matching universities for current student
export async function POST(request: NextRequest) {
  try {
    // Get current user session
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id || (session.user as any).user_id;
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "User ID not found",
        },
        { status: 400 }
      );
    }

    // Get student_id from students table
    const student = await prisma.students.findUnique({
      where: { user_id: userId },
      select: { user_id: true },
    });

    if (!student) {
      return NextResponse.json(
        {
          success: false,
          error: "Student profile not found",
        },
        { status: 404 }
      );
    }

    const studentId = student.user_id;

    // Get optional parameters from request
    const body = await request.json().catch(() => ({}));
    const top_n = body.top_n || 50;
    const min_match_score = body.min_match_score || 30.0;
    const duration_months = body.duration_months || 12;
    const start_date =
      body.start_date || new Date().toISOString().split("T")[0];

    // Get feature1_output (profile analysis)
    const profileAnalysis = await prisma.profile_analyses.findFirst({
      where: { student_id: studentId },
      orderBy: { created_at: "desc" },
    });

    if (!profileAnalysis) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Profile analysis not found. Please complete profile analysis first.",
        },
        { status: 400 }
      );
    }

    // Reconstruct feature1_output from profile_analyses fields
    // The database stores data in separate fields, we need to reconstruct the full output format
    let feature1_output: any;
    try {
      const academicData = profileAnalysis.academic_data as any;
      const swotData = profileAnalysis.swot_data as any;

      // Extract pillar scores from academic_data
      const pillarScores = academicData?.pillar_scores || {};
      const regionalScores = academicData?.regional_scores || [];

      // Reconstruct summary from stored data
      const summary = {
        success: true,
        total_pillar_scores: {
          aca:
            pillarScores["Học thuật (Aca)"] ||
            profileAnalysis.academic_score ||
            0,
          lan: pillarScores["Ngôn ngữ (Lan)"] || 0,
          hdnk:
            pillarScores["Hoạt động ngoại khóa (HDNK)"] ||
            profileAnalysis.extracurricular_score ||
            0,
          skill: pillarScores["Kỹ năng (Skill)"] || 0,
        },
        main_spike:
          profileAnalysis.summary?.split("Spike chính: ")[1]?.split(".")[0] ||
          "Unknown",
        sharpness: profileAnalysis.summary?.includes("Độ sắc: High")
          ? "High"
          : profileAnalysis.summary?.includes("Độ sắc: Medium")
          ? "Medium"
          : "Low",
      };

      // Reconstruct feature1_output structure
      feature1_output = {
        summary,
        "A. Đánh giá điểm số (Weighted Score Evaluation)":
          regionalScores.length > 0
            ? {
                "Khu vực": regionalScores,
              }
            : undefined,
        "B. Phân tích SWOT":
          swotData && Object.keys(swotData).length > 0 ? swotData : undefined,
        "D. Điểm số gốc (Pillar Scores)":
          pillarScores && Object.keys(pillarScores).length > 0
            ? pillarScores
            : {
                "Học thuật (Aca)": profileAnalysis.academic_score || 0,
                "Ngôn ngữ (Lan)": 0,
                "Hoạt động ngoại khóa (HDNK)":
                  profileAnalysis.extracurricular_score || 0,
                "Kỹ năng (Skill)": 0,
              },
      };
    } catch (e) {
      console.error("Error reconstructing feature1_output:", e);
      return NextResponse.json(
        {
          success: false,
          error: "Invalid profile analysis data format",
        },
        { status: 400 }
      );
    }

    // Get feature2_output (career assessment)
    const [mbtiTest, riasecTest, gritTest] = await Promise.all([
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

    if (!mbtiTest || !riasecTest || !gritTest) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Please complete all tests (MBTI, RIASEC, GRIT) before getting university recommendations.",
        },
        { status: 400 }
      );
    }

    // Build feature2_output from test results
    // Map database fields to Feature 2 output format
    const feature2_output = {
      success: true,
      assessment: {
        mbti: {
          personality_type: mbtiTest.result_type || "UNKNOWN",
          dimension_scores: {
            E: mbtiTest.score_e || 0,
            I: mbtiTest.score_i || 0,
            S: mbtiTest.score_s || 0,
            N: mbtiTest.score_n || 0,
            T: mbtiTest.score_t || 0,
            F: mbtiTest.score_f || 0,
            J: mbtiTest.score_j || 0,
            P: mbtiTest.score_p || 0,
          },
          confidence: 0.5, // Default confidence
        },
        grit: {
          score: gritTest.total_score || 0,
          level: gritTest.level || "Trung bình",
          description: gritTest.description || "",
        },
        riasec: {
          code: riasecTest.result_code || "",
          scores: {
            Realistic: riasecTest.score_realistic || 0,
            Investigative: riasecTest.score_investigative || 0,
            Artistic: riasecTest.score_artistic || 0,
            Social: riasecTest.score_social || 0,
            Enterprising: riasecTest.score_enterprising || 0,
            Conventional: riasecTest.score_conventional || 0,
          },
          top3: (riasecTest.top_3_types as Array<[string, number]>) || [],
        },
      },
      recommendations: [], // Can be empty for feature3
    };

    // Call AI API
    console.log("🤖 [Predict Universities] Calling AI API...");
    const requestPayload: UniversityRecommendationInput = {
      feature1_output,
      feature2_output,
      top_n,
      min_match_score,
      duration_months,
      start_date,
    };

    const rawResult = await callUniversityRecommendation(requestPayload);

    // Normalize and validate response
    const aiResult = normalizeUniversityRecommendationOutput(rawResult);
    if (!aiResult) {
      console.error("❌ [Predict Universities] Invalid response format");
      return NextResponse.json(
        {
          success: false,
          error: "Invalid response format from AI server",
        },
        { status: 500 }
      );
    }

    if (!aiResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: aiResult.error || "Failed to get university recommendations",
        },
        { status: 500 }
      );
    }

    // Store results in student_match_school table
    console.log("💾 [Predict Universities] Storing results...");

    // Delete old matches
    await prisma.student_match_school.deleteMany({
      where: { student_id: studentId },
    });

    // Prepare matches to insert
    const matchesToInsert: any[] = [];
    const universities = aiResult.universities || {};

    for (const [category, categoryData] of Object.entries(universities)) {
      const categoryUpper = category.toUpperCase(); // REACH, MATCH, SAFETY
      const universitiesList = (categoryData as any).universities || [];

      for (const uni of universitiesList) {
        // Find university by name or id
        let university = null;

        if (uni.id) {
          // Try to find by id (if it's a database id)
          university = await prisma.university.findFirst({
            where: {
              OR: [
                { id: uni.id.toString() },
                { name: { contains: uni.name, mode: "insensitive" } },
              ],
            },
          });
        } else {
          // Find by name
          university = await prisma.university.findFirst({
            where: {
              name: { contains: uni.name, mode: "insensitive" },
            },
          });
        }

        if (university) {
          matchesToInsert.push({
            id: randomUUID(),
            student_id: studentId,
            university_id: university.id,
            ai_matching: categoryUpper,
            match_score: uni.match_score || 0,
            match_reason: Array.isArray(uni.match_reasons)
              ? uni.match_reasons.join("; ")
              : uni.match_reasons || null,
          });
        } else {
          console.warn(
            `⚠️ [Predict Universities] University not found: ${uni.name}`
          );
        }
      }
    }

    // Insert matches
    if (matchesToInsert.length > 0) {
      await prisma.student_match_school.createMany({
        data: matchesToInsert,
        skipDuplicates: true,
      });
      console.log(
        `✅ [Predict Universities] Stored ${matchesToInsert.length} matches`
      );
    }

    return NextResponse.json({
      success: true,
      data: aiResult,
      stored_count: matchesToInsert.length,
      message: `Found ${matchesToInsert.length} matching universities`,
    });
  } catch (error: any) {
    console.error("❌ [Predict Universities] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to predict universities",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
