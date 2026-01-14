import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import {
  Feature1InputPayload,
  Feature1OutputData,
  Feature1APIResponse,
  mapAnalysisToDatabase,
  isValidFeature1OutputData,
  normalizeFeature1OutputData,
  type SubjectScore,
  type AcademicAward,
  type LanguageCertificate,
  type StandardizedTest,
  type ExtracurricularAction,
  type NonAcademicAward,
  type PersonalProject,
  type Skill,
} from "@/lib/schemas/profile-analysis.schema";

// Helper functions to map Vietnamese values to valid enum values
function mapRole(role: string | null | undefined): string {
  if (!role) return "MEMBER";
  const roleUpper = role.toUpperCase();
  if (["LEADER", "CORE", "MEMBER", "HELP"].includes(roleUpper))
    return roleUpper;

  // Map Vietnamese to enum
  const roleMap: Record<string, string> = {
    "chủ tịch": "LEADER",
    "chu tich": "LEADER",
    "trưởng nhóm": "LEADER",
    "truong nhom": "LEADER",
    trưởng: "LEADER",
    truong: "LEADER",
    phó: "CORE",
    pho: "CORE",
    "phó chủ tịch": "CORE",
    "pho chu tich": "CORE",
    "nòng cốt": "CORE",
    "nong cot": "CORE",
    "thành viên": "MEMBER",
    "thanh vien": "MEMBER",
    "hỗ trợ": "HELP",
    "ho tro": "HELP",
    "tình nguyện": "MEMBER",
    "tinh nguyen": "MEMBER",
  };

  const roleLower = role.toLowerCase();
  for (const [key, value] of Object.entries(roleMap)) {
    if (roleLower.includes(key)) return value;
  }
  return "MEMBER";
}

function mapRegion(region: string | null | undefined): string {
  if (!region) return "school";
  const regionLower = region.toLowerCase();
  const validRegions = [
    "international",
    "national",
    "province",
    "city",
    "school",
    "local",
  ];
  if (validRegions.includes(regionLower)) return regionLower;

  // Map Vietnamese
  const regionMap: Record<string, string> = {
    "quốc tế": "international",
    "quoc te": "international",
    "quốc gia": "national",
    "quoc gia": "national",
    tỉnh: "province",
    tinh: "province",
    "thành phố": "city",
    "thanh pho": "city",
    trường: "school",
    truong: "school",
    "địa phương": "local",
    "dia phuong": "local",
  };

  for (const [key, value] of Object.entries(regionMap)) {
    if (regionLower.includes(key)) return value;
  }
  return "school";
}

function mapNonAcademicCategory(category: string | null | undefined): string {
  if (!category) return "art";
  const catLower = category.toLowerCase();
  if (["art", "sport"].includes(catLower)) return catLower;

  // Map Vietnamese
  if (
    catLower.includes("thể thao") ||
    catLower.includes("the thao") ||
    catLower.includes("sport")
  )
    return "sport";
  if (
    catLower.includes("nghệ thuật") ||
    catLower.includes("nghe thuat") ||
    catLower.includes("âm nhạc") ||
    catLower.includes("am nhac") ||
    catLower.includes("art") ||
    catLower.includes("music")
  )
    return "art";

  return "art"; // default
}

function mapProjectTopic(topic: string | null | undefined): string {
  if (!topic) return "Science/Tech";
  const validTopics = [
    "Science/Tech",
    "Research",
    "Culture/Business",
    "Sport/Art",
  ];
  if (validTopics.includes(topic)) return topic;

  const topicLower = topic.toLowerCase();
  if (
    topicLower.includes("khoa học") ||
    topicLower.includes("khoa hoc") ||
    topicLower.includes("công nghệ") ||
    topicLower.includes("cong nghe") ||
    topicLower.includes("tech") ||
    topicLower.includes("science")
  )
    return "Science/Tech";
  if (
    topicLower.includes("nghiên cứu") ||
    topicLower.includes("nghien cuu") ||
    topicLower.includes("research")
  )
    return "Research";
  if (
    topicLower.includes("văn hóa") ||
    topicLower.includes("van hoa") ||
    topicLower.includes("kinh doanh") ||
    topicLower.includes("business") ||
    topicLower.includes("culture")
  )
    return "Culture/Business";
  if (
    topicLower.includes("thể thao") ||
    topicLower.includes("the thao") ||
    topicLower.includes("nghệ thuật") ||
    topicLower.includes("nghe thuat") ||
    topicLower.includes("sport") ||
    topicLower.includes("art")
  )
    return "Sport/Art";

  return "Science/Tech";
}

function mapProficiency(proficiency: string | null | undefined): string {
  if (!proficiency) return "INTERMEDIATE";
  const profUpper = proficiency.toUpperCase();
  if (["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"].includes(profUpper))
    return profUpper;

  const profLower = proficiency.toLowerCase();
  if (
    profLower.includes("cơ bản") ||
    profLower.includes("co ban") ||
    profLower.includes("beginner")
  )
    return "BEGINNER";
  if (
    profLower.includes("trung bình") ||
    profLower.includes("trung binh") ||
    profLower.includes("intermediate")
  )
    return "INTERMEDIATE";
  if (
    profLower.includes("nâng cao") ||
    profLower.includes("nang cao") ||
    profLower.includes("advanced")
  )
    return "ADVANCED";
  if (
    profLower.includes("chuyên gia") ||
    profLower.includes("chuyen gia") ||
    profLower.includes("expert")
  )
    return "EXPERT";

  return "INTERMEDIATE";
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ student_id: string }> }
) {
  try {
    const { student_id: studentIdStr } = await context.params;
    const student_id = parseInt(studentIdStr);

    // 1. Fetch toàn bộ dữ liệu học sinh từ database
    const studentData = await prisma.students.findUnique({
      where: { user_id: studentIdStr },
      include: {
        student_backgrounds: {
          include: {
            academic_awards: true,
            non_academic_awards: true,
            academic_extracurriculars: true,
            non_academic_extracurriculars: true,
            work_experiences: true,
            research_experiences: true,
            subject_scores: true,
            personal_projects: true,
          },
        },
        student_academic_profiles: true,
        student_parents: true,
        student_skills: true,
      },
    });

    if (!studentData) {
      return NextResponse.json(
        { error: "Không tìm thấy thông tin học sinh" },
        { status: 404 }
      );
    }

    // Cho phép phân tích chỉ với GPA, không cần đầy đủ background
    const background = studentData.student_backgrounds;
    const academicProfile = studentData.student_academic_profiles;

    // Kiểm tra có GPA không (tối thiểu cần có GPA)
    const hasGPA = (() => {
      const gpaDetails = academicProfile?.gpa_transcript_details as
        | Record<string, string | number>
        | null
        | undefined;
      if (!gpaDetails) return false;
      return !!(
        gpaDetails.grade12 ||
        gpaDetails.grade11 ||
        gpaDetails.grade10 ||
        gpaDetails.grade9
      );
    })();

    if (!hasGPA) {
      return NextResponse.json(
        {
          error:
            "Vui lòng cập nhật thông tin GPA để sử dụng tính năng phân tích AI",
        },
        { status: 400 }
      );
    }

    // 2. Map dữ liệu database sang format Feature 1 yêu cầu (theo POSTMAN format)
    const feature1Payload: Feature1InputPayload = {
      academic: {
        // GPA từ transcript (priority: grade 12 -> 11 -> 10 -> 9)
        gpa: (() => {
          const gpaDetails = academicProfile?.gpa_transcript_details as
            | Record<string, string | number>
            | null
            | undefined;
          if (!gpaDetails) return 0;
          if (gpaDetails.grade12)
            return parseFloat(String(gpaDetails.grade12)) || 0;
          if (gpaDetails.grade11)
            return parseFloat(String(gpaDetails.grade11)) || 0;
          if (gpaDetails.grade10)
            return parseFloat(String(gpaDetails.grade10)) || 0;
          if (gpaDetails.grade9)
            return parseFloat(String(gpaDetails.grade9)) || 0;
          return 0;
        })(),

        // Subject scores (optional - có thể rỗng)
        subject_scores: (background?.subject_scores || []).map(
          (s): SubjectScore => ({
            subject: s.subject || "",
            score: s.score || 0,
            year: s.year || null,
            semester: s.semester ? String(s.semester) : null,
          })
        ),

        // Academic awards (optional - có thể rỗng)
        academic_awards: (background?.academic_awards || []).map(
          (a): AcademicAward => ({
            award_name: a.award_name || "",
            year: a.year || null,
            rank: a.rank || null,
            region: a.region || null,
            category: a.category || null,
            impact: a.description || null,
          })
        ),
      },

      language_and_standardized: {
        // Languages from academic profile
        languages: (() => {
          if (!academicProfile || !academicProfile.english_certificates) {
            return [];
          }
          const certs = academicProfile.english_certificates;
          if (!Array.isArray(certs)) {
            return [];
          }
          return certs
            .filter(
              (l) => l !== null && typeof l === "object" && !Array.isArray(l)
            )
            .map((l) => {
              const cert = l as Record<string, unknown>;
              return {
                language_name: (cert.type as string) || "",
                score: String(cert.score || ""),
              } as LanguageCertificate;
            });
        })(),

        // Standardized tests
        standardized_tests: (() => {
          if (!academicProfile || !academicProfile.standardized_tests) {
            return [];
          }
          const tests = academicProfile.standardized_tests;
          if (!Array.isArray(tests)) {
            return [];
          }
          return tests
            .filter(
              (t) => t !== null && typeof t === "object" && !Array.isArray(t)
            )
            .map((t) => {
              const test = t as Record<string, unknown>;
              return {
                test_name: (test.type as string) || "",
                score: String(test.score || ""),
              } as StandardizedTest;
            });
        })(),
      },

      action: {
        // Combine all extracurriculars into 'actions' array (optional - có thể rỗng)
        // Chỉ gửi các field cần thiết theo POSTMAN format: action_name, role, scale, region
        actions: [
          ...(background?.academic_extracurriculars ?? []).map(
            (e): ExtracurricularAction => ({
              action_name: e.activity_name || "",
              role: mapRole(e.role),
              scale: e.scale || 10,
              region: mapRegion(e.region),
            })
          ),
          ...(background?.non_academic_extracurriculars ?? []).map(
            (e): ExtracurricularAction => ({
              action_name: e.activity_name || "",
              role: mapRole(e.role),
              scale: e.scale || 10,
              region: mapRegion(e.region),
            })
          ),
        ],
      },

      // non_academic_awards must be an array directly (optional - có thể rỗng)
      non_academic_awards: (background?.non_academic_awards ?? []).map(
        (a): NonAcademicAward => ({
          award_name: a.award_name || "",
          category: mapNonAcademicCategory(a.category),
          year: a.year || null,
          rank: a.rank || null,
          region: mapRegion(a.region),
        })
      ),

      // personal_projects must be an array directly (optional - có thể rỗng)
      // Bao gồm cả research_experiences được map vào personal_projects với topic: "Research"
      personal_projects: [
        ...(background?.personal_projects ?? []).map(
          (p): PersonalProject => ({
            project_name: p.project_name || "",
            topic: mapProjectTopic(p.topic),
            description: p.description || null,
            duration_months: p.duration_months || null,
            impact: p.impact || null,
          })
        ),
        // Map research_experiences vào personal_projects với topic: "Research"
        ...(background?.research_experiences ?? []).map(
          (r): PersonalProject => {
            // Calculate duration_months from start_date and end_date
            let durationMonths: number | null = null;
            if (r.start_date && r.end_date) {
              const start = new Date(r.start_date);
              const end = new Date(r.end_date);
              const diffTime = Math.abs(end.getTime() - start.getTime());
              const diffMonths = Math.ceil(
                diffTime / (1000 * 60 * 60 * 24 * 30)
              );
              durationMonths = diffMonths;
            }

            return {
              project_name: r.project_title || "",
              topic: "Research",
              description: r.description || null,
              duration_months: durationMonths,
              impact: r.findings || null,
            };
          }
        ),
      ],

      skill: {
        skills: (studentData.student_skills || []).map(
          (s): Skill => ({
            skill_name: s.skill_name || "",
            proficiency: mapProficiency(s.proficiency),
            category: s.category || null,
          })
        ),
      },
    };

    // 3. Call AI API using centralized client
    const { callProfileAnalysis } = await import("@/lib/ai-api-client");

    let rawResponse: unknown;
    try {
      rawResponse = await callProfileAnalysis(feature1Payload);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      return NextResponse.json(
        {
          error: "Lỗi khi gọi API phân tích",
          details: errorMessage,
        },
        { status: 500 }
      );
    }

    // 4. Handle response format - API có thể trả về trực tiếp Feature1OutputData hoặc có wrapper
    let outputData: Feature1OutputData | null = null;
    let validationWarnings: string[] | undefined;

    // Kiểm tra xem có phải là Feature1OutputData trực tiếp không
    if (isValidFeature1OutputData(rawResponse)) {
      outputData = rawResponse;
    } else if (
      rawResponse &&
      typeof rawResponse === "object" &&
      "data" in rawResponse
    ) {
      // Có wrapper với success/data
      const wrappedResponse = rawResponse as Feature1APIResponse;
      if (!wrappedResponse.success || !wrappedResponse.data) {
        return NextResponse.json(
          {
            error: "Phân tích không thành công",
            details: wrappedResponse.error || "Không có dữ liệu trả về",
            validation_warnings: wrappedResponse.validation_warnings,
          },
          { status: 500 }
        );
      }
      outputData = wrappedResponse.data;
      validationWarnings = wrappedResponse.validation_warnings;
    } else {
      // Thử normalize
      const normalized = normalizeFeature1OutputData(rawResponse);
      if (!normalized) {
        console.error("❌ Invalid output data structure:", rawResponse);
        return NextResponse.json(
          {
            error: "Dữ liệu phân tích không hợp lệ",
            details: "Cấu trúc dữ liệu trả về không đúng định dạng",
          },
          { status: 500 }
        );
      }
      outputData = normalized;
      console.warn("⚠️ Output data was normalized due to validation issues");
    }

    if (!outputData) {
      return NextResponse.json(
        {
          error: "Không thể xử lý dữ liệu phân tích",
          details: "Dữ liệu trả về không hợp lệ",
        },
        { status: 500 }
      );
    }

    // 6. Save analysis result to database
    try {
      const dbInput = mapAnalysisToDatabase(
        studentIdStr,
        feature1Payload,
        outputData
      );

      await prisma.profile_analyses.create({
        data: {
          id: randomUUID(),
          student_id: studentIdStr,
          analysis_date: dbInput.analysis_date,
          academic_data: JSON.parse(JSON.stringify(dbInput.academic_data)),
          extracurricular_data: JSON.parse(
            JSON.stringify(dbInput.extracurricular_data)
          ),
          skill_data: JSON.parse(JSON.stringify(dbInput.skill_data)),
          overall_score: dbInput.overall_score,
          academic_score: dbInput.academic_score,
          extracurricular_score: dbInput.extracurricular_score,
          summary: dbInput.summary,
          swot_data: JSON.parse(JSON.stringify(dbInput.swot_data)),
        },
      });

      console.log("✅ Profile analysis saved to database");
    } catch (dbError) {
      console.error("❌ Error saving analysis to database:", dbError);
      // Continue even if DB save fails - still return the analysis result
    }

    return NextResponse.json({
      success: true,
      data: outputData,
    });
  } catch (error) {
    console.error("Error in analyze-profile API:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: "Lỗi server khi phân tích hồ sơ",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
