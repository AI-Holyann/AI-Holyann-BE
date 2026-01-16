import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/universities/[id] - Get university detail with scholarships and faculties
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "University ID is required",
        },
        { status: 400 }
      );
    }

    // Fetch university with related data
    const university = await prisma.university.findUnique({
      where: { id },
      include: {
        scholarships: {
          orderBy: {
            deadline: "asc",
          },
        },
        faculties: {
          orderBy: {
            name: "asc",
          },
        },
      },
    });

    if (!university) {
      return NextResponse.json(
        {
          success: false,
          error: "University not found",
        },
        { status: 404 }
      );
    }

    // Parse deadline JSONB
    let deadline = null;
    if (university.deadline) {
      try {
        deadline =
          typeof university.deadline === "string"
            ? JSON.parse(university.deadline)
            : university.deadline;
      } catch (e) {
        console.warn("Failed to parse deadline JSON:", e);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        id: university.id,
        name: university.name,
        country: university.country,
        description: university.description,
        detail_information: university.detail_information,
        deadline,
        requirements: university.requirements,
        status: university.status,
        rank: university.rank,
        url_link: university.url_link,
        image_display_url: university.image_display_url,
        scholarships: university.scholarships.map((sch) => ({
          id: sch.id,
          name: sch.name,
          description: sch.description,
          deadline: sch.deadline,
          url_web: sch.url_web,
        })),
        faculties: university.faculties.map((fac) => ({
          id: fac.id,
          name: fac.name,
          description: fac.description,
          type: fac.type,
          url_web: fac.url_web,
        })),
        created_at: university.created_at,
        updated_at: university.updated_at,
      },
    });
  } catch (error) {
    console.error("❌ [GET /api/universities/[id]] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch university details",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
