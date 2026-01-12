/**
 * Type definitions và helper functions cho Student Background
 */

// ============================================
// ENUMS & CONSTANTS
// ============================================

export const AWARD_LEVELS = {
  INTERNATIONAL: 'Quốc tế',
  NATIONAL: 'Quốc gia',
  REGIONAL: 'Khu vực',
  SCHOOL: 'Trường',
} as const;

export const NON_ACADEMIC_CATEGORIES = {
  ART: 'Nghệ thuật',
  MUSIC: 'Âm nhạc',
  SPORTS: 'Thể thao',
  COMMUNITY: 'Cộng đồng',
  OTHER: 'Khác',
} as const;

export const EXTRACURRICULAR_CATEGORIES = {
  SPORTS: 'Thể thao',
  ART: 'Nghệ thuật',
  VOLUNTEER: 'Tình nguyện',
  COMMUNITY: 'Cộng đồng',
  LEADERSHIP: 'Lãnh đạo',
  OTHER: 'Khác',
} as const;

export const EMPLOYMENT_TYPES = {
  FULL_TIME: 'Full-time',
  PART_TIME: 'Part-time',
  INTERNSHIP: 'Internship',
  VOLUNTEER: 'Volunteer',
  FREELANCE: 'Freelance',
} as const;

export const ROLES = {
  MEMBER: 'Thành viên',
  TEAM_LEADER: 'Trưởng nhóm',
  PRESIDENT: 'Chủ tịch',
  VICE_PRESIDENT: 'Phó chủ tịch',
  SECRETARY: 'Thư ký',
  TREASURER: 'Thủ quỹ',
  LEAD_RESEARCHER: 'Lead Researcher',
  RESEARCH_ASSISTANT: 'Research Assistant',
} as const;

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface AcademicAward {
  id?: string;
  background_id?: string;
  award_name: string;
  issuing_organization?: string;
  award_level?: keyof typeof AWARD_LEVELS;
  award_date?: Date;
  description?: string;
  certificate_url?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface NonAcademicAward {
  id?: string;
  background_id?: string;
  award_name: string;
  category?: keyof typeof NON_ACADEMIC_CATEGORIES;
  issuing_organization?: string;
  award_level?: keyof typeof AWARD_LEVELS;
  award_date?: Date;
  description?: string;
  certificate_url?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface AcademicExtracurricular {
  id?: string;
  background_id?: string;
  activity_name: string;
  organization?: string;
  role?: string;
  start_date?: Date;
  end_date?: Date;
  hours_per_week?: number;
  weeks_per_year?: number;
  description?: string;
  achievements?: string;
  related_to_major?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface NonAcademicExtracurricular {
  id?: string;
  background_id?: string;
  activity_name: string;
  category?: keyof typeof EXTRACURRICULAR_CATEGORIES;
  organization?: string;
  role?: string;
  start_date?: Date;
  end_date?: Date;
  hours_per_week?: number;
  weeks_per_year?: number;
  description?: string;
  achievements?: string;
  impact?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface WorkExperience {
  id?: string;
  background_id?: string;
  company_name: string;
  job_title: string;
  employment_type?: keyof typeof EMPLOYMENT_TYPES;
  location?: string;
  start_date?: Date;
  end_date?: Date;
  is_current?: boolean;
  responsibilities?: string;
  achievements?: string;
  skills_gained?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface ResearchExperience {
  id?: string;
  background_id?: string;
  project_title: string;
  institution?: string;
  supervisor_name?: string;
  role?: string;
  start_date?: Date;
  end_date?: Date;
  is_current?: boolean;
  research_field?: string;
  description?: string;
  methodologies?: string;
  findings?: string;
  publication_url?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface StudentBackground {
  student_id: string;
  created_at?: Date;
  updated_at?: Date;
  academic_awards?: AcademicAward[];
  non_academic_awards?: NonAcademicAward[];
  academic_extracurriculars?: AcademicExtracurricular[];
  non_academic_extracurriculars?: NonAcademicExtracurricular[];
  work_experiences?: WorkExperience[];
  research_experiences?: ResearchExperience[];
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Tính tổng số giờ tham gia hoạt động ngoại khóa
 */
export function calculateTotalActivityHours(
  activities: (AcademicExtracurricular | NonAcademicExtracurricular)[]
): number {
  return activities.reduce((total, activity) => {
    const hours = (activity.hours_per_week || 0) * (activity.weeks_per_year || 0);
    return total + hours;
  }, 0);
}

/**
 * Lấy danh sách các kỹ năng từ kinh nghiệm làm việc
 */
export function extractSkills(experiences: WorkExperience[]): string[] {
  const skills = new Set<string>();

  experiences.forEach(exp => {
    if (exp.skills_gained) {
      const skillList = exp.skills_gained.split(',').map(s => s.trim());
      skillList.forEach(skill => skills.add(skill));
    }
  });

  return Array.from(skills);
}

/**
 * Kiểm tra xem có kinh nghiệm nghiên cứu hiện tại không
 */
export function hasOngoingResearch(experiences: ResearchExperience[]): boolean {
  return experiences.some(exp => exp.is_current === true);
}

/**
 * Lấy kinh nghiệm làm việc hiện tại
 */
export function getCurrentWork(experiences: WorkExperience[]): WorkExperience | undefined {
  return experiences.find(exp => exp.is_current === true);
}

/**
 * Đếm tổng số giải thưởng theo cấp độ
 */
export function countAwardsByLevel(
  awards: (AcademicAward | NonAcademicAward)[]
): Record<string, number> {
  const counts: Record<string, number> = {
    [AWARD_LEVELS.INTERNATIONAL]: 0,
    [AWARD_LEVELS.NATIONAL]: 0,
    [AWARD_LEVELS.REGIONAL]: 0,
    [AWARD_LEVELS.SCHOOL]: 0,
  };

  awards.forEach(award => {
    if (award.award_level) {
      counts[award.award_level] = (counts[award.award_level] || 0) + 1;
    }
  });

  return counts;
}

/**
 * Lấy tất cả hoạt động được sắp xếp theo thời gian (mới nhất trước)
 */
export function sortActivitiesByDate<T extends { start_date?: Date }>(
  activities: T[]
): T[] {
  return [...activities].sort((a, b) => {
    if (!a.start_date) return 1;
    if (!b.start_date) return -1;
    return b.start_date.getTime() - a.start_date.getTime();
  });
}

/**
 * Tính thời gian tham gia (theo tháng)
 */
export function calculateDuration(startDate?: Date, endDate?: Date): number {
  if (!startDate) return 0;

  const end = endDate || new Date();
  const diffTime = Math.abs(end.getTime() - startDate.getTime());
  const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));

  return diffMonths;
}

/**
 * Format thời gian cho UI (VD: "Jan 2023 - Dec 2023")
 */
export function formatDateRange(
  startDate?: Date,
  endDate?: Date,
  isCurrent?: boolean
): string {
  if (!startDate) return '';

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN', { month: 'short', year: 'numeric' });
  };

  const start = formatDate(startDate);
  const end = isCurrent ? 'Hiện tại' : (endDate ? formatDate(endDate) : 'Hiện tại');

  return `${start} - ${end}`;
}

/**
 * Kiểm tra xem background có đầy đủ thông tin không
 */
export function isBackgroundComplete(background: StudentBackground): {
  isComplete: boolean;
  missingCategories: string[];
} {
  const categories = [
    { name: 'Giải thưởng học thuật', items: background.academic_awards },
    { name: 'Hoạt động ngoại khóa', items: background.academic_extracurriculars },
  ];

  const missingCategories = categories
    .filter(cat => !cat.items || cat.items.length === 0)
    .map(cat => cat.name);

  return {
    isComplete: missingCategories.length === 0,
    missingCategories,
  };
}

/**
 * Tạo summary text cho background
 */
export function generateBackgroundSummary(background: StudentBackground): string {
  const parts: string[] = [];

  if (background.academic_awards && background.academic_awards.length > 0) {
    parts.push(`${background.academic_awards.length} giải thưởng học thuật`);
  }

  if (background.non_academic_awards && background.non_academic_awards.length > 0) {
    parts.push(`${background.non_academic_awards.length} giải thưởng khác`);
  }

  const totalActivities =
    (background.academic_extracurriculars?.length || 0) +
    (background.non_academic_extracurriculars?.length || 0);

  if (totalActivities > 0) {
    parts.push(`${totalActivities} hoạt động ngoại khóa`);
  }

  if (background.work_experiences && background.work_experiences.length > 0) {
    parts.push(`${background.work_experiences.length} kinh nghiệm làm việc`);
  }

  if (background.research_experiences && background.research_experiences.length > 0) {
    parts.push(`${background.research_experiences.length} dự án nghiên cứu`);
  }

  return parts.length > 0 ? parts.join(', ') : 'Chưa có thông tin';
}

// ============================================
// VALIDATION FUNCTIONS
// ============================================

export function validateAcademicAward(award: Partial<AcademicAward>): string[] {
  const errors: string[] = [];

  if (!award.award_name || award.award_name.trim() === '') {
    errors.push('Tên giải thưởng là bắt buộc');
  }

  if (award.award_date && award.award_date > new Date()) {
    errors.push('Ngày nhận giải không thể ở tương lai');
  }

  return errors;
}

export function validateWorkExperience(work: Partial<WorkExperience>): string[] {
  const errors: string[] = [];

  if (!work.company_name || work.company_name.trim() === '') {
    errors.push('Tên công ty là bắt buộc');
  }

  if (!work.job_title || work.job_title.trim() === '') {
    errors.push('Chức danh là bắt buộc');
  }

  if (work.start_date && work.end_date && !work.is_current) {
    if (work.end_date < work.start_date) {
      errors.push('Ngày kết thúc phải sau ngày bắt đầu');
    }
  }

  return errors;
}

export function validateResearchExperience(research: Partial<ResearchExperience>): string[] {
  const errors: string[] = [];

  if (!research.project_title || research.project_title.trim() === '') {
    errors.push('Tên dự án nghiên cứu là bắt buộc');
  }

  if (research.start_date && research.end_date && !research.is_current) {
    if (research.end_date < research.start_date) {
      errors.push('Ngày kết thúc phải sau ngày bắt đầu');
    }
  }

  return errors;
}

