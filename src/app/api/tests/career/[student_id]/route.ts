// filepath: d:\holyann-ai-web\src\app\api\tests\career\[student_id]\route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ===========================================
// GET /api/tests/career/[student_id] - Lấy gợi ý nghề nghiệp
// ===========================================
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ student_id: string }> }
) {
  try {
    const { student_id } = await params;

    // Kiểm tra student tồn tại
    const student = await prisma.students.findUnique({
      where: { user_id: student_id },
    });

    if (!student) {
      return NextResponse.json(
        {
          success: false,
          error: "Student not found",
        },
        { status: 404 }
      );
    }

    // Kiểm tra đã hoàn thành tất cả tests chưa
    if (!student.assessments_completed) {
      return NextResponse.json(
        {
          success: false,
          error: "Please complete all tests (MBTI, RIASEC, GRIT) first",
        },
        { status: 400 }
      );
    }

    // Lấy career recommendations
    // Xử lý trường hợp job_field chưa có trong database
    let recommendations;
    try {
      recommendations = await prisma.career_matches.findMany({
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
        const { prisma: prismaClient } = await import("@/lib/prisma");
        recommendations = (await prismaClient.$queryRaw`
                    SELECT id, student_id, job_title, match_percentage, reasoning, created_at
                    FROM career_matches
                    WHERE student_id = ${student_id}::uuid
                    ORDER BY match_percentage DESC
                `) as any[];
      } else {
        throw error;
      }
    }

    return NextResponse.json({
      success: true,
      student_id,
      recommendations: recommendations.map((rec: any) => ({
        id: rec.id,
        job_title: rec.job_title,
        match_percentage: rec.match_percentage,
        reasoning: rec.reasoning,
        job_field: rec.job_field || null, // Có thể null nếu dùng raw query
        created_at: rec.created_at,
      })),
      total: recommendations.length,
    });
  } catch (error) {
    console.error("Error getting career recommendations:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
