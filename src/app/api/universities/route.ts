import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/universities - Get list of all universities
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const country = searchParams.get("country");
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "100");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Build where clause
    const where: any = {};
    if (country) {
      where.country = country;
    }
    if (status) {
      where.status = status;
    }

    // Fetch universities
    const [universities, total] = await Promise.all([
      prisma.university.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: {
          rank: "asc",
        },
        include: {
          _count: {
            select: {
              scholarships: true,
              faculties: true,
            },
          },
        },
      }),
      prisma.university.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: universities.map((uni) => ({
        id: uni.id,
        name: uni.name,
        country: uni.country,
        description: uni.description,
        rank: uni.rank,
        status: uni.status,
        url_link: uni.url_link,
        image_display_url: uni.image_display_url,
        scholarships_count: uni._count.scholarships,
        faculties_count: uni._count.faculties,
      })),
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    console.error("❌ [GET /api/universities] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch universities",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
