import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET /api/student-match-school - Get matching schools for current student
export async function GET(request: NextRequest) {
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

    // Get student_id from students table (student_id = user_id in students table)
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

    const studentId = student.user_id; // student_id = user_id in students table

    const searchParams = request.nextUrl.searchParams;
    const ai_matching = searchParams.get("ai_matching"); // Filter by REACH, MATCH, SAFETY

    // Build where clause
    const where: any = {
      student_id: studentId,
    };
    if (ai_matching) {
      where.ai_matching = ai_matching.toUpperCase();
    }

    // Fetch matching schools with university details
    const matches = await prisma.student_match_school.findMany({
      where,
      include: {
        university: {
          include: {
            _count: {
              select: {
                scholarships: true,
                faculties: true,
              },
            },
          },
        },
      },
      orderBy: [
        {
          match_score: "desc",
        },
        {
          ai_matching: "asc",
        },
      ],
    });

    return NextResponse.json({
      success: true,
      data: matches.map((match) => ({
        id: match.id,
        university_id: match.university_id,
        university_name: match.university.name,
        university_country: match.university.country,
        university_rank: match.university.rank,
        university_image: match.university.image_display_url,
        university_url: match.university.url_link,
        ai_matching: match.ai_matching,
        match_score: match.match_score,
        match_reason: match.match_reason,
        scholarships_count: match.university._count.scholarships,
        faculties_count: match.university._count.faculties,
        created_at: match.created_at,
      })),
    });
  } catch (error) {
    console.error("❌ [GET /api/student-match-school] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch matching schools",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
