


import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Helper functions to map Vietnamese values to valid enum values
function mapRole(role: string | null | undefined): string {
  if (!role) return 'MEMBER';
  const roleUpper = role.toUpperCase();
  if (['LEADER', 'CORE', 'MEMBER', 'HELP'].includes(roleUpper)) return roleUpper;
  
  // Map Vietnamese to enum
  const roleMap: Record<string, string> = {
    'chủ tịch': 'LEADER', 'chu tich': 'LEADER',
    'trưởng nhóm': 'LEADER', 'truong nhom': 'LEADER',
    'trưởng': 'LEADER', 'truong': 'LEADER',
    'phó': 'CORE', 'pho': 'CORE',
    'phó chủ tịch': 'CORE', 'pho chu tich': 'CORE',
    'nòng cốt': 'CORE', 'nong cot': 'CORE',
    'thành viên': 'MEMBER', 'thanh vien': 'MEMBER',
    'hỗ trợ': 'HELP', 'ho tro': 'HELP',
    'tình nguyện': 'MEMBER', 'tinh nguyen': 'MEMBER',
  };
  
  const roleLower = role.toLowerCase();
  for (const [key, value] of Object.entries(roleMap)) {
    if (roleLower.includes(key)) return value;
  }
  return 'MEMBER';
}

function mapRegion(region: string | null | undefined): string {
  if (!region) return 'school';
  const regionLower = region.toLowerCase();
  const validRegions = ['international', 'national', 'province', 'city', 'school', 'local'];
  if (validRegions.includes(regionLower)) return regionLower;
  
  // Map Vietnamese
  const regionMap: Record<string, string> = {
    'quốc tế': 'international', 'quoc te': 'international',
    'quốc gia': 'national', 'quoc gia': 'national',
    'tỉnh': 'province', 'tinh': 'province',
    'thành phố': 'city', 'thanh pho': 'city',
    'trường': 'school', 'truong': 'school',
    'địa phương': 'local', 'dia phuong': 'local',
  };
  
  for (const [key, value] of Object.entries(regionMap)) {
    if (regionLower.includes(key)) return value;
  }
  return 'school';
}

function mapNonAcademicCategory(category: string | null | undefined): string {
  if (!category) return 'art';
  const catLower = category.toLowerCase();
  if (['art', 'sport'].includes(catLower)) return catLower;
  
  // Map Vietnamese
  if (catLower.includes('thể thao') || catLower.includes('the thao') || catLower.includes('sport')) return 'sport';
  if (catLower.includes('nghệ thuật') || catLower.includes('nghe thuat') || catLower.includes('âm nhạc') || catLower.includes('am nhac') || catLower.includes('art') || catLower.includes('music')) return 'art';
  
  return 'art'; // default
}

function mapProjectTopic(topic: string | null | undefined): string {
  if (!topic) return 'Science/Tech';
  const validTopics = ['Science/Tech', 'Research', 'Culture/Business', 'Sport/Art'];
  if (validTopics.includes(topic)) return topic;
  
  const topicLower = topic.toLowerCase();
  if (topicLower.includes('khoa học') || topicLower.includes('khoa hoc') || topicLower.includes('công nghệ') || topicLower.includes('cong nghe') || topicLower.includes('tech') || topicLower.includes('science')) return 'Science/Tech';
  if (topicLower.includes('nghiên cứu') || topicLower.includes('nghien cuu') || topicLower.includes('research')) return 'Research';
  if (topicLower.includes('văn hóa') || topicLower.includes('van hoa') || topicLower.includes('kinh doanh') || topicLower.includes('business') || topicLower.includes('culture')) return 'Culture/Business';
  if (topicLower.includes('thể thao') || topicLower.includes('the thao') || topicLower.includes('nghệ thuật') || topicLower.includes('nghe thuat') || topicLower.includes('sport') || topicLower.includes('art')) return 'Sport/Art';
  
  return 'Science/Tech';
}

function mapProficiency(proficiency: string | null | undefined): string {
  if (!proficiency) return 'INTERMEDIATE';
  const profUpper = proficiency.toUpperCase();
  if (['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'].includes(profUpper)) return profUpper;
  
  const profLower = proficiency.toLowerCase();
  if (profLower.includes('cơ bản') || profLower.includes('co ban') || profLower.includes('beginner')) return 'BEGINNER';
  if (profLower.includes('trung bình') || profLower.includes('trung binh') || profLower.includes('intermediate')) return 'INTERMEDIATE';
  if (profLower.includes('nâng cao') || profLower.includes('nang cao') || profLower.includes('advanced')) return 'ADVANCED';
  if (profLower.includes('chuyên gia') || profLower.includes('chuyen gia') || profLower.includes('expert')) return 'EXPERT';
  
  return 'INTERMEDIATE';
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
          }
        },
        student_academic_profiles: true,
        student_parents: true,
        student_skills: true,
      }
    });

    if (!studentData || !studentData.student_backgrounds) {
      return NextResponse.json(
        { error: 'Không tìm thấy dữ liệu học sinh' },
        { status: 404 }
      );
    }

    const background = studentData.student_backgrounds;
    const academicProfile = studentData.student_academic_profiles;

    // 2. Map dữ liệu database sang format Feature 1 yêu cầu
    const feature1Payload = {
      academic: {
        // GPA từ transcript (priority: grade 12 -> 11 -> 10 -> 9)
        gpa: (() => {
          const gpaDetails = academicProfile?.gpa_transcript_details as any;
          if (gpaDetails?.grade12) return parseFloat(gpaDetails.grade12);
          if (gpaDetails?.grade11) return parseFloat(gpaDetails.grade11);
          if (gpaDetails?.grade10) return parseFloat(gpaDetails.grade10);
          if (gpaDetails?.grade9) return parseFloat(gpaDetails.grade9);
          return 0;
        })(),
        gpa_scale: 10.0, // Thang điểm 10

        // Subject scores
        subject_scores: (background.subject_scores || []).map((s: any) => ({
          subject: s.subject,
          score: s.score,
          year: s.year,
          semester: s.semester,
        })),

        // Academic awards
        academic_awards: (background.academic_awards || []).map((a: any) => ({
          award_name: a.award_name,
          year: a.year,
          rank: a.rank,
          region: a.region,
          category: a.category,
          impact: a.impact,
        })),

        // Research experiences
        research_experiences: (background.research_experiences || []).map((r: any) => ({
          topic: r.project_title,
          role: r.role,
          duration_months: r.duration_months,
          description: r.description,
          achievements: r.achievements,
        })),
      },

      language_and_standardized: {
        // Languages from academic profile
        languages: (academicProfile?.english_certificates || []).map((l: any) => ({
          language_name: l.type,
          score: l.score,
        })),

        // Standardized tests
        standardized_tests: (academicProfile?.standardized_tests || []).map((t: any) => ({
          test_name: t.type,
          score: t.score,
        })),
      },

      action: {
        // Combine all extracurriculars into 'actions' array
        actions: [
          ...(background.academic_extracurriculars || []).map((e: any) => ({
            action_name: e.activity_name,
            role: mapRole(e.role),
            scale: e.scale || 10,
            region: mapRegion(e.region),
            duration_months: e.duration_months,
            description: e.description,
            achievements: e.achievements,
          })),
          ...(background.non_academic_extracurriculars || []).map((e: any) => ({
            action_name: e.activity_name,
            role: mapRole(e.role),
            scale: e.scale || 10,
            region: mapRegion(e.region),
            duration_months: e.duration_months,
            description: e.description,
            achievements: e.achievements,
          })),
        ],
      },

      // non_academic_awards must be an array directly
      non_academic_awards: (background.non_academic_awards || []).map((a: any) => ({
        award_name: a.award_name,
        category: mapNonAcademicCategory(a.category),
        year: a.year,
        rank: a.rank,
        region: mapRegion(a.region),
      })),

      // personal_projects must be an array directly
      personal_projects: (background.personal_projects || []).map((p: any) => ({
        project_name: p.project_name,
        topic: mapProjectTopic(p.topic),
        description: p.description,
        duration_months: p.duration_months,
        impact: p.impact,
      })),

      skill: {
        skills: (studentData.student_skills || []).map((s: any) => ({
          skill_name: s.skill_name,
          proficiency: mapProficiency(s.proficiency),
          category: s.category,
        })),
      },
    };

    // 3. Call Django API
    // DJANGO_API_URL should be base URL like http://localhost:8000
    // We always append /hoexapp/api/profile-analysis/
    const djangoHost = (process.env.DJANGO_API_URL || 'http://localhost:8000').replace(/\/+$/, '').replace(/\/hoexapp\/?$/, '');
    const profileApiUrl = `${djangoHost}/hoexapp/api/profile-analysis/`;

    const response = await fetch(profileApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Disable caching so every request hits Django directly
      cache: 'no-store',
      body: JSON.stringify(feature1Payload),
    });

    if (!response.ok) {
      const rawError = await response.text();
      let errorData: any;
      try {
        errorData = rawError ? JSON.parse(rawError) : { error: 'Unknown error' };
      } catch {
        errorData = { error: rawError || 'Unknown error' };
      }
      return NextResponse.json(
        { 
          error: 'Lỗi khi gọi API phân tích',
          details: errorData,
          target: profileApiUrl,
        },
        { status: response.status }
      );
    }

    // 4. Return kết quả
    const analysisResult = await response.json();

    return NextResponse.json({
      success: true,
      data: analysisResult,
    });

  } catch (error: any) {
    console.error('Error in analyze-profile API:', error);
    return NextResponse.json(
      { 
        error: 'Lỗi server khi phân tích hồ sơ',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
