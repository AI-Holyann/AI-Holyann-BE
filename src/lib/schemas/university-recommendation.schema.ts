/**
 * University Recommendation Schema (Feature 3)
 * 
 * Based on POSTMAN_TEST_INPUT.json and POSTMAN_TEST_OUTPUT.json
 * Covers API endpoint: /api/university-recommendation/
 */

// ============================================================================
// INPUT SCHEMAS
// ============================================================================

/**
 * University Recommendation Input
 * Used for /api/university-recommendation/
 */
export interface UniversityRecommendationInput {
  feature1_output: Feature1Output; // From Profile Analysis
  feature2_output: Feature2Output; // From Career Assessment
  top_n?: number; // Optional, default 50
  min_match_score?: number; // Optional, default 30.0
  duration_months?: number; // Optional, default 12
  start_date?: string; // Optional, ISO date string (YYYY-MM-DD)
}

/**
 * Feature 1 Output (Profile Analysis)
 * Simplified version - only what Feature 3 needs
 */
export interface Feature1Output {
  summary: {
    success: boolean;
    total_pillar_scores: {
      aca: number;
      lan: number;
      hdnk: number;
      skill: number;
    };
    main_spike: string;
    sharpness: string;
  };
  "A. Đánh giá điểm số (Weighted Score Evaluation)"?: {
    "Khu vực": Array<{
      Vùng: string;
      "Điểm số (Score)": number;
      "Xếp loại (Rating)": string;
    }>;
  };
  "B. Phân tích SWOT"?: {
    "Strengths (Điểm mạnh)": string[];
    "Weaknesses (Điểm yếu)": string[];
    "Opportunities (Cơ hội)": string[];
    "Threats (Thách thức)": string[];
  };
  "C. Nhận diện Spike (Yếu tố cốt lõi)"?: {
    "Loại Spike hiện tại": string;
    "Bằng chứng định hình": string[];
    "Độ sắc (Sharpness)": string;
    "Nhận xét": string;
  };
  "D. Điểm số gốc (Pillar Scores)"?: {
    "Học thuật (Aca)": number;
    "Ngôn ngữ (Lan)": number;
    "Hoạt động ngoại khóa (HDNK)": number;
    "Kỹ năng (Skill)": number;
  };
}

/**
 * Feature 2 Output (Career Assessment)
 * Simplified version - only what Feature 3 needs
 */
export interface Feature2Output {
  success: boolean;
  assessment: {
    mbti: {
      personality_type: string;
      dimension_scores?: Record<string, number>;
      confidence?: number;
    };
    grit: {
      score: number;
      level: string;
      description?: string;
    };
    riasec: {
      code: string;
      scores: Record<string, number>;
      top3?: Array<[string, number]>;
    };
  };
  recommendations?: Array<{
    title: string;
    match_score: number;
    riasec_code: string;
    description?: string;
  }>;
}

// ============================================================================
// OUTPUT SCHEMAS
// ============================================================================

/**
 * Scholarship Information
 */
export interface ScholarshipInfo {
  merit_based: boolean;
  need_based: boolean;
  amount_range: string; // e.g., "$5000-$50000"
}

/**
 * University Recommendation Item
 */
export interface UniversityRecommendation {
  id: number | string; // Can be database ID or AI-generated ID
  name: string;
  country: string;
  state?: string;
  ranking: number;
  match_score: number;
  match_reasons: string[];
  website_url?: string;
  logo_url?: string;
  essay_requirements?: string;
  scholarship_info?: ScholarshipInfo;
}

/**
 * University Category (REACH, MATCH, SAFETY)
 */
export interface UniversityCategory {
  count: number;
  description: string;
  universities: UniversityRecommendation[];
}

/**
 * Roadmap Milestone
 */
export interface RoadmapMilestone {
  month: number;
  name: string;
  description: string;
}

/**
 * Roadmap Monthly Plan
 */
export interface RoadmapMonthlyPlan {
  month: number;
  month_name: string;
  focus_areas: string[];
  tasks: string[];
  goals: string[];
  priority: string; // e.g., "HIGH", "MEDIUM", "LOW"
}

/**
 * Roadmap
 */
export interface Roadmap {
  start_date: string; // ISO date string
  duration_months: number;
  overall_goals: string[];
  key_milestones: RoadmapMilestone[];
  monthly_plans: RoadmapMonthlyPlan[];
}

/**
 * Summary
 */
export interface UniversityRecommendationSummary {
  total_matched: number;
  reach_count: number;
  match_count: number;
  safety_count: number;
}

/**
 * University Recommendation Output
 * Response from /api/university-recommendation/
 */
export interface UniversityRecommendationOutput {
  success: boolean;
  universities: {
    REACH: UniversityCategory;
    MATCH: UniversityCategory;
    SAFETY: UniversityCategory;
  };
  roadmap: Roadmap;
  summary: UniversityRecommendationSummary;
  error?: string;
  details?: unknown;
}

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Type guard to check if value is a valid number (not NaN, not Infinity)
 */
export function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && !isNaN(value) && isFinite(value);
}

/**
 * Type guard to check if value is a non-empty string
 */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * Type guard to check if value is a valid array
 */
export function isValidArray<T>(
  value: unknown,
  itemGuard?: (item: unknown) => item is T
): value is T[] {
  if (!Array.isArray(value)) return false;
  if (itemGuard) {
    return value.every(itemGuard);
  }
  return true;
}

/**
 * Validate ScholarshipInfo structure
 */
export function isValidScholarshipInfo(
  value: unknown
): value is ScholarshipInfo {
  if (!value || typeof value !== "object") return false;
  const info = value as Record<string, unknown>;
  return (
    typeof info.merit_based === "boolean" &&
    typeof info.need_based === "boolean" &&
    isNonEmptyString(info.amount_range)
  );
}

/**
 * Validate UniversityRecommendation structure
 */
export function isValidUniversityRecommendation(
  value: unknown
): value is UniversityRecommendation {
  if (!value || typeof value !== "object") return false;
  const uni = value as Record<string, unknown>;
  return (
    (typeof uni.id === "number" || typeof uni.id === "string") &&
    isNonEmptyString(uni.name) &&
    isNonEmptyString(uni.country) &&
    isValidNumber(uni.ranking) &&
    isValidNumber(uni.match_score) &&
    isValidArray(uni.match_reasons, isNonEmptyString)
  );
}

/**
 * Validate UniversityCategory structure
 */
export function isValidUniversityCategory(
  value: unknown
): value is UniversityCategory {
  if (!value || typeof value !== "object") return false;
  const category = value as Record<string, unknown>;
  return (
    typeof category.count === "number" &&
    isNonEmptyString(category.description) &&
    isValidArray(category.universities, isValidUniversityRecommendation)
  );
}

/**
 * Validate RoadmapMilestone structure
 */
export function isValidRoadmapMilestone(
  value: unknown
): value is RoadmapMilestone {
  if (!value || typeof value !== "object") return false;
  const milestone = value as Record<string, unknown>;
  return (
    typeof milestone.month === "number" &&
    isNonEmptyString(milestone.name) &&
    isNonEmptyString(milestone.description)
  );
}

/**
 * Validate RoadmapMonthlyPlan structure
 */
export function isValidRoadmapMonthlyPlan(
  value: unknown
): value is RoadmapMonthlyPlan {
  if (!value || typeof value !== "object") return false;
  const plan = value as Record<string, unknown>;
  return (
    typeof plan.month === "number" &&
    isNonEmptyString(plan.month_name) &&
    isValidArray(plan.focus_areas, isNonEmptyString) &&
    isValidArray(plan.tasks, isNonEmptyString) &&
    isValidArray(plan.goals, isNonEmptyString) &&
    isNonEmptyString(plan.priority)
  );
}

/**
 * Validate Roadmap structure
 */
export function isValidRoadmap(value: unknown): value is Roadmap {
  if (!value || typeof value !== "object") return false;
  const roadmap = value as Record<string, unknown>;
  return (
    isNonEmptyString(roadmap.start_date) &&
    typeof roadmap.duration_months === "number" &&
    isValidArray(roadmap.overall_goals, isNonEmptyString) &&
    isValidArray(roadmap.key_milestones, isValidRoadmapMilestone) &&
    isValidArray(roadmap.monthly_plans, isValidRoadmapMonthlyPlan)
  );
}

/**
 * Validate UniversityRecommendationSummary structure
 */
export function isValidSummary(
  value: unknown
): value is UniversityRecommendationSummary {
  if (!value || typeof value !== "object") return false;
  const summary = value as Record<string, unknown>;
  return (
    typeof summary.total_matched === "number" &&
    typeof summary.reach_count === "number" &&
    typeof summary.match_count === "number" &&
    typeof summary.safety_count === "number"
  );
}

/**
 * Validate UniversityRecommendationInput structure
 */
export function isValidUniversityRecommendationInput(
  input: unknown
): input is UniversityRecommendationInput {
  if (typeof input !== "object" || input === null) return false;
  const obj = input as Record<string, unknown>;
  return (
    typeof obj.feature1_output === "object" &&
    obj.feature1_output !== null &&
    typeof obj.feature2_output === "object" &&
    obj.feature2_output !== null &&
    (obj.top_n === undefined ||
      (typeof obj.top_n === "number" && obj.top_n > 0)) &&
    (obj.min_match_score === undefined ||
      (typeof obj.min_match_score === "number" &&
        obj.min_match_score >= 0 &&
        obj.min_match_score <= 100)) &&
    (obj.duration_months === undefined ||
      (typeof obj.duration_months === "number" && obj.duration_months > 0)) &&
    (obj.start_date === undefined || isNonEmptyString(obj.start_date))
  );
}

/**
 * Normalize UniversityRecommendationOutput (handle missing fields, null values)
 */
export function normalizeUniversityRecommendationOutput(
  value: unknown
): UniversityRecommendationOutput | null {
  if (typeof value !== "object" || value === null) return null;

  const data = value as Record<string, unknown>;

  // Check success flag
  if (data.success !== true) return null;

  // Validate universities
  const universities = data.universities;
  if (
    !universities ||
    typeof universities !== "object" ||
    Array.isArray(universities)
  ) {
    return null;
  }

  const universitiesData = universities as Record<string, unknown>;

  // Validate REACH, MATCH, SAFETY categories
  const reach = universitiesData.REACH;
  const match = universitiesData.MATCH;
  const safety = universitiesData.SAFETY;

  if (!isValidUniversityCategory(reach)) return null;
  if (!isValidUniversityCategory(match)) return null;
  if (!isValidUniversityCategory(safety)) return null;

  // Validate roadmap
  const roadmap = data.roadmap;
  if (!isValidRoadmap(roadmap)) return null;

  // Validate summary
  const summary = data.summary;
  if (!isValidSummary(summary)) return null;

  return {
    success: true,
    universities: {
      REACH: reach,
      MATCH: match,
      SAFETY: safety,
    },
    roadmap,
    summary,
    error: typeof data.error === "string" ? data.error : undefined,
    details: data.details,
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get total count of universities across all categories
 */
export function getTotalUniversitiesCount(
  output: UniversityRecommendationOutput
): number {
  return (
    output.universities.REACH.count +
    output.universities.MATCH.count +
    output.universities.SAFETY.count
  );
}

/**
 * Get all universities as a flat array
 */
export function getAllUniversities(
  output: UniversityRecommendationOutput
): UniversityRecommendation[] {
  return [
    ...output.universities.REACH.universities,
    ...output.universities.MATCH.universities,
    ...output.universities.SAFETY.universities,
  ];
}

/**
 * Get universities by category
 */
export function getUniversitiesByCategory(
  output: UniversityRecommendationOutput,
  category: "REACH" | "MATCH" | "SAFETY"
): UniversityRecommendation[] {
  return output.universities[category].universities;
}

/**
 * Sort universities by match score (descending)
 */
export function sortUniversitiesByMatchScore(
  universities: UniversityRecommendation[]
): UniversityRecommendation[] {
  return [...universities].sort((a, b) => b.match_score - a.match_score);
}
