/**
 * Service để quản lý Student Background và các dữ liệu ngoại khóa
 */

import { randomUUID } from 'crypto';
import { prisma } from '../prisma';
import type {
  AcademicAward,
  NonAcademicAward,
  AcademicExtracurricular,
  NonAcademicExtracurricular,
  WorkExperience,
  ResearchExperience,
  StudentBackground,
} from '../types/student-background';

// ============================================
// STUDENT BACKGROUND (Hub)
// ============================================

/**
 * Lấy toàn bộ thông tin nền tảng ngoại khóa của học viên
 */
export async function getStudentBackground(studentId: string) {
  return await prisma.student_backgrounds.findUnique({
    where: { student_id: studentId },
    include: {
      academic_awards: {
        orderBy: { award_date: 'desc' },
      },
      non_academic_awards: {
        orderBy: { award_date: 'desc' },
      },
      academic_extracurriculars: {
        orderBy: { start_date: 'desc' },
      },
      non_academic_extracurriculars: {
        orderBy: { start_date: 'desc' },
      },
      work_experiences: {
        orderBy: { start_date: 'desc' },
      },
      research_experiences: {
        orderBy: { start_date: 'desc' },
      },
    },
  });
}

/**
 * Tạo student background hub (nếu chưa tồn tại)
 */
export async function createOrGetStudentBackground(studentId: string) {
  const existing = await prisma.student_backgrounds.findUnique({
    where: { student_id: studentId },
  });

  if (existing) {
    return existing;
  }

  return await prisma.student_backgrounds.create({
    data: {
      student_id: studentId,
    },
  });
}

/**
 * Xóa toàn bộ student background (cascade sẽ xóa tất cả dữ liệu liên quan)
 */
export async function deleteStudentBackground(studentId: string) {
  return await prisma.student_backgrounds.delete({
    where: { student_id: studentId },
  });
}

// ============================================
// ACADEMIC AWARDS
// ============================================

/**
 * Thêm giải thưởng học thuật
 */
export async function addAcademicAward(
  studentId: string,
  data: Omit<AcademicAward, 'id' | 'background_id' | 'created_at' | 'updated_at'>
) {
  // Đảm bảo student background đã tồn tại
  await createOrGetStudentBackground(studentId);

  return await prisma.academic_awards.create({
    data: {
      id: randomUUID(),
      background_id: studentId,
      ...data,
    },
  });
}

/**
 * Lấy danh sách giải thưởng học thuật
 */
export async function getAcademicAwards(studentId: string) {
  return await prisma.academic_awards.findMany({
    where: { background_id: studentId },
    orderBy: { award_date: 'desc' },
  });
}

/**
 * Cập nhật giải thưởng học thuật
 */
export async function updateAcademicAward(
  awardId: string,
  data: Partial<Omit<AcademicAward, 'id' | 'background_id'>>
) {
  return await prisma.academic_awards.update({
    where: { id: awardId },
    data: {
      ...data,
      updated_at: new Date(),
    },
  });
}

/**
 * Xóa giải thưởng học thuật
 */
export async function deleteAcademicAward(awardId: string) {
  return await prisma.academic_awards.delete({
    where: { id: awardId },
  });
}

// ============================================
// NON-ACADEMIC AWARDS
// ============================================

/**
 * Thêm giải thưởng khác
 */
export async function addNonAcademicAward(
  studentId: string,
  data: Omit<NonAcademicAward, 'id' | 'background_id' | 'created_at' | 'updated_at'>
) {
  await createOrGetStudentBackground(studentId);

  return await prisma.non_academic_awards.create({
    data: {
      id: randomUUID(),
      background_id: studentId,
      ...data,
    },
  });
}

/**
 * Lấy danh sách giải thưởng khác
 */
export async function getNonAcademicAwards(studentId: string) {
  return await prisma.non_academic_awards.findMany({
    where: { background_id: studentId },
    orderBy: { award_date: 'desc' },
  });
}

/**
 * Cập nhật giải thưởng khác
 */
export async function updateNonAcademicAward(
  awardId: string,
  data: Partial<Omit<NonAcademicAward, 'id' | 'background_id'>>
) {
  return await prisma.non_academic_awards.update({
    where: { id: awardId },
    data: {
      ...data,
      updated_at: new Date(),
    },
  });
}

/**
 * Xóa giải thưởng khác
 */
export async function deleteNonAcademicAward(awardId: string) {
  return await prisma.non_academic_awards.delete({
    where: { id: awardId },
  });
}

// ============================================
// ACADEMIC EXTRACURRICULARS
// ============================================

/**
 * Thêm hoạt động ngoại khóa liên quan ngành học
 */
export async function addAcademicExtracurricular(
  studentId: string,
  data: Omit<AcademicExtracurricular, 'id' | 'background_id' | 'created_at' | 'updated_at'>
) {
  await createOrGetStudentBackground(studentId);

  return await prisma.academic_extracurriculars.create({
    data: {
      id: randomUUID(),
      background_id: studentId,
      ...data,
    },
  });
}

/**
 * Lấy danh sách hoạt động ngoại khóa liên quan ngành học
 */
export async function getAcademicExtracurriculars(studentId: string) {
  return await prisma.academic_extracurriculars.findMany({
    where: { background_id: studentId },
    orderBy: { start_date: 'desc' },
  });
}

/**
 * Cập nhật hoạt động ngoại khóa liên quan ngành học
 */
export async function updateAcademicExtracurricular(
  activityId: string,
  data: Partial<Omit<AcademicExtracurricular, 'id' | 'background_id'>>
) {
  return await prisma.academic_extracurriculars.update({
    where: { id: activityId },
    data: {
      ...data,
      updated_at: new Date(),
    },
  });
}

/**
 * Xóa hoạt động ngoại khóa liên quan ngành học
 */
export async function deleteAcademicExtracurricular(activityId: string) {
  return await prisma.academic_extracurriculars.delete({
    where: { id: activityId },
  });
}

// ============================================
// NON-ACADEMIC EXTRACURRICULARS
// ============================================

/**
 * Thêm hoạt động ngoại khóa ngoài ngành học
 */
export async function addNonAcademicExtracurricular(
  studentId: string,
  data: Omit<NonAcademicExtracurricular, 'id' | 'background_id' | 'created_at' | 'updated_at'>
) {
  await createOrGetStudentBackground(studentId);

  return await prisma.non_academic_extracurriculars.create({
    data: {
      id: randomUUID(),
      background_id: studentId,
      ...data,
    },
  });
}

/**
 * Lấy danh sách hoạt động ngoại khóa ngoài ngành học
 */
export async function getNonAcademicExtracurriculars(studentId: string) {
  return await prisma.non_academic_extracurriculars.findMany({
    where: { background_id: studentId },
    orderBy: { start_date: 'desc' },
  });
}

/**
 * Cập nhật hoạt động ngoại khóa ngoài ngành học
 */
export async function updateNonAcademicExtracurricular(
  activityId: string,
  data: Partial<Omit<NonAcademicExtracurricular, 'id' | 'background_id'>>
) {
  return await prisma.non_academic_extracurriculars.update({
    where: { id: activityId },
    data: {
      ...data,
      updated_at: new Date(),
    },
  });
}

/**
 * Xóa hoạt động ngoại khóa ngoài ngành học
 */
export async function deleteNonAcademicExtracurricular(activityId: string) {
  return await prisma.non_academic_extracurriculars.delete({
    where: { id: activityId },
  });
}

// ============================================
// WORK EXPERIENCES
// ============================================

/**
 * Thêm kinh nghiệm làm việc
 */
export async function addWorkExperience(
  studentId: string,
  data: Omit<WorkExperience, 'id' | 'background_id' | 'created_at' | 'updated_at'>
) {
  await createOrGetStudentBackground(studentId);

  // Nếu đây là công việc hiện tại, set tất cả các công việc khác thành không hiện tại
  if (data.is_current) {
    await prisma.work_experiences.updateMany({
      where: { background_id: studentId, is_current: true },
      data: { is_current: false },
    });
  }

  return await prisma.work_experiences.create({
    data: {
      id: randomUUID(),
      background_id: studentId,
      ...data,
    },
  });
}

/**
 * Lấy danh sách kinh nghiệm làm việc
 */
export async function getWorkExperiences(studentId: string) {
  return await prisma.work_experiences.findMany({
    where: { background_id: studentId },
    orderBy: [
      { is_current: 'desc' }, // Current jobs first
      { start_date: 'desc' },
    ],
  });
}

/**
 * Cập nhật kinh nghiệm làm việc
 */
export async function updateWorkExperience(
  workId: string,
  data: Partial<Omit<WorkExperience, 'id' | 'background_id'>>
) {
  // Nếu set is_current = true, cập nhật tất cả các công việc khác
  if (data.is_current === true) {
    const work = await prisma.work_experiences.findUnique({
      where: { id: workId },
    });

    if (work) {
      await prisma.work_experiences.updateMany({
        where: {
          background_id: work.background_id,
          is_current: true,
          id: { not: workId },
        },
        data: { is_current: false },
      });
    }
  }

  return await prisma.work_experiences.update({
    where: { id: workId },
    data: {
      ...data,
      updated_at: new Date(),
    },
  });
}

/**
 * Xóa kinh nghiệm làm việc
 */
export async function deleteWorkExperience(workId: string) {
  return await prisma.work_experiences.delete({
    where: { id: workId },
  });
}

// ============================================
// RESEARCH EXPERIENCES
// ============================================

/**
 * Thêm kinh nghiệm nghiên cứu
 */
export async function addResearchExperience(
  studentId: string,
  data: Omit<ResearchExperience, 'id' | 'background_id' | 'created_at' | 'updated_at'>
) {
  await createOrGetStudentBackground(studentId);

  return await prisma.research_experiences.create({
    data: {
      id: randomUUID(),
      background_id: studentId,
      ...data,
    },
  });
}

/**
 * Lấy danh sách kinh nghiệm nghiên cứu
 */
export async function getResearchExperiences(studentId: string) {
  return await prisma.research_experiences.findMany({
    where: { background_id: studentId },
    orderBy: [
      { is_current: 'desc' }, // Current research first
      { start_date: 'desc' },
    ],
  });
}

/**
 * Cập nhật kinh nghiệm nghiên cứu
 */
export async function updateResearchExperience(
  researchId: string,
  data: Partial<Omit<ResearchExperience, 'id' | 'background_id'>>
) {
  return await prisma.research_experiences.update({
    where: { id: researchId },
    data: {
      ...data,
      updated_at: new Date(),
    },
  });
}

/**
 * Xóa kinh nghiệm nghiên cứu
 */
export async function deleteResearchExperience(researchId: string) {
  return await prisma.research_experiences.delete({
    where: { id: researchId },
  });
}

// ============================================
// BULK OPERATIONS
// ============================================

/**
 * Tạo student background với nhiều dữ liệu cùng lúc
 */
export async function createStudentBackgroundWithData(
  studentId: string,
  data: {
    academic_awards?: Omit<AcademicAward, 'id' | 'background_id' | 'created_at' | 'updated_at'>[];
    non_academic_awards?: Omit<NonAcademicAward, 'id' | 'background_id' | 'created_at' | 'updated_at'>[];
    academic_extracurriculars?: Omit<AcademicExtracurricular, 'id' | 'background_id' | 'created_at' | 'updated_at'>[];
    non_academic_extracurriculars?: Omit<NonAcademicExtracurricular, 'id' | 'background_id' | 'created_at' | 'updated_at'>[];
    work_experiences?: Omit<WorkExperience, 'id' | 'background_id' | 'created_at' | 'updated_at'>[];
    research_experiences?: Omit<ResearchExperience, 'id' | 'background_id' | 'created_at' | 'updated_at'>[];
  }
) {
  return await prisma.student_backgrounds.create({
    data: {
      student_id: studentId,
      academic_awards: data.academic_awards ? { 
        create: data.academic_awards.map(award => ({ ...award, id: randomUUID() })) 
      } : undefined,
      non_academic_awards: data.non_academic_awards ? { 
        create: data.non_academic_awards.map(award => ({ ...award, id: randomUUID() })) 
      } : undefined,
      academic_extracurriculars: data.academic_extracurriculars ? { 
        create: data.academic_extracurriculars.map(activity => ({ ...activity, id: randomUUID() })) 
      } : undefined,
      non_academic_extracurriculars: data.non_academic_extracurriculars ? { 
        create: data.non_academic_extracurriculars.map(activity => ({ ...activity, id: randomUUID() })) 
      } : undefined,
      work_experiences: data.work_experiences ? { 
        create: data.work_experiences.map(work => ({ ...work, id: randomUUID() })) 
      } : undefined,
      research_experiences: data.research_experiences ? { 
        create: data.research_experiences.map(research => ({ ...research, id: randomUUID() })) 
      } : undefined,
    },
    include: {
      academic_awards: true,
      non_academic_awards: true,
      academic_extracurriculars: true,
      non_academic_extracurriculars: true,
      work_experiences: true,
      research_experiences: true,
    },
  });
}

/**
 * Lấy thống kê về background của học viên
 */
export async function getBackgroundStatistics(studentId: string) {
  const [
    academicAwardsCount,
    nonAcademicAwardsCount,
    academicActivitiesCount,
    nonAcademicActivitiesCount,
    workExperiencesCount,
    researchExperiencesCount,
  ] = await Promise.all([
    prisma.academic_awards.count({ where: { background_id: studentId } }),
    prisma.non_academic_awards.count({ where: { background_id: studentId } }),
    prisma.academic_extracurriculars.count({ where: { background_id: studentId } }),
    prisma.non_academic_extracurriculars.count({ where: { background_id: studentId } }),
    prisma.work_experiences.count({ where: { background_id: studentId } }),
    prisma.research_experiences.count({ where: { background_id: studentId } }),
  ]);

  return {
    totalAwards: academicAwardsCount + nonAcademicAwardsCount,
    academicAwards: academicAwardsCount,
    nonAcademicAwards: nonAcademicAwardsCount,
    totalActivities: academicActivitiesCount + nonAcademicActivitiesCount,
    academicActivities: academicActivitiesCount,
    nonAcademicActivities: nonAcademicActivitiesCount,
    workExperiences: workExperiencesCount,
    researchExperiences: researchExperiencesCount,
  };
}

