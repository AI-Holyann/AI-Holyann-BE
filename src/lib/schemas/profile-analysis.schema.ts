/**
 * Schema types for Profile Analysis
 * Based on Feature 1 API response structure and database schema
 */

// ============ Input Types (from POSTMAN_INPUT_TEST.json) ============

export interface SubjectScore {
  subject: string;
  score: number;
  year?: number | null;
  semester?: string | null;
}

export interface AcademicAward {
  award_name: string;
  year?: number | null;
  rank?: number | null;
  region?: string | null;
  category?: string | null;
  impact?: string | null;
}

export interface ResearchExperience {
  topic: string;
  role?: string | null;
  duration_months?: number | null;
  description?: string | null;
  achievements?: string | null;
}

export interface LanguageCertificate {
  language_name: string;
  score: string;
}

export interface StandardizedTest {
  test_name: string;
  score: string;
}

export interface ExtracurricularAction {
  action_name: string;
  role: string;
  scale: number;
  region: string;
  duration_months?: number | null;
  description?: string | null;
  achievements?: string | null;
}

export interface NonAcademicAward {
  award_name: string;
  category: string;
  year?: number | null;
  rank?: number | null;
  region?: string | null;
}

export interface PersonalProject {
  project_name: string;
  topic: string;
  description?: string | null;
  duration_months?: number | null;
  impact?: string | null;
}

export interface Skill {
  skill_name: string;
  proficiency: string;
  category?: string | null;
}

export interface Feature1InputPayload {
  academic: {
    gpa: number;
    subject_scores: SubjectScore[];
    academic_awards: AcademicAward[];
  };
  language_and_standardized: {
    languages: LanguageCertificate[];
    standardized_tests: StandardizedTest[];
  };
  action: {
    actions: ExtracurricularAction[];
  };
  non_academic_awards: NonAcademicAward[];
  personal_projects: PersonalProject[];
  skill: {
    skills: Skill[];
  };
}

// ============ Output Types (from Feature 1 API response) ============

export interface RegionScoreDetail {
  "Học thuật (Aca)": number;
  "Ngôn ngữ (Lan)": number;
  "Hoạt động ngoại khóa (HDNK)": number;
  "Kỹ năng (Skill)": number;
}

export interface RegionScore {
  Vùng: string;
  "Điểm số (Score)": number;
  "Xếp loại (Rating)": string;
  "Chi tiết": RegionScoreDetail;
}

export interface SpikeDetail {
  name: string;
  score: number;
  sharpness: string;
  evidence_count: number;
  breakdown: Record<string, number>;
}

export interface SpikeAnalysis {
  "Loại Spike hiện tại": string;
  "Spike ID": string;
  "Điểm số": number;
  "Bằng chứng định hình": string[];
  "Độ sắc (Sharpness)": string;
  "Chi tiết điểm (Breakdown)": Record<string, number>;
  "Nhận xét": string;
  "Tất cả Spike Scores": Record<string, SpikeDetail>;
}

export interface SWOTAnalysis {
  "Strengths (Điểm mạnh)": string[];
  "Weaknesses (Điểm yếu)": string[];
  "Opportunities (Cơ hội)": string[];
  "Threats (Thách thức)": string[];
}

export interface PillarScores {
  "Học thuật (Aca)": number;
  "Ngôn ngữ (Lan)": number;
  "Hoạt động ngoại khóa (HDNK)": number;
  "Kỹ năng (Skill)": number;
}

export interface AnalysisSummary {
  success: boolean;
  total_pillar_scores: {
    aca: number;
    lan: number;
    hdnk: number;
    skill: number;
  };
  main_spike: string;
  sharpness: string;
}

export interface Feature1OutputData {
  "A. Đánh giá điểm số (Weighted Score Evaluation)": {
    "Khu vực": RegionScore[];
  };
  "B. Phân tích SWOT": SWOTAnalysis;
  "C. Nhận diện Spike (Yếu tố cốt lõi)": SpikeAnalysis;
  "D. Điểm số gốc (Pillar Scores)": PillarScores;
  summary: AnalysisSummary;
}

export interface Feature1APIResponse {
  success?: boolean;
  data?: Feature1OutputData;
  validation_warnings?: string[];
  error?: string;
  details?: unknown;
}

// ============ Database Types ============

export interface ProfileAnalysisCreateInput {
  student_id: string;
  analysis_date?: Date;
  academic_data: {
    pillar_scores: PillarScores;
    regional_scores: RegionScore[];
    input_data: Feature1InputPayload["academic"];
  };
  extracurricular_data: {
    actions: ExtracurricularAction[];
    non_academic_awards: NonAcademicAward[];
    personal_projects: PersonalProject[];
  };
  skill_data: {
    skills: Skill[];
  };
  overall_score: number;
  academic_score: number;
  extracurricular_score: number;
  summary: string;
  swot_data: SWOTAnalysis;
}

export interface ProfileAnalysisRecord {
  id: string;
  student_id: string;
  analysis_date: Date;
  academic_data: ProfileAnalysisCreateInput["academic_data"];
  extracurricular_data: ProfileAnalysisCreateInput["extracurricular_data"];
  skill_data: ProfileAnalysisCreateInput["skill_data"];
  overall_score: number | null;
  academic_score: number | null;
  extracurricular_score: number | null;
  summary: string | null;
  swot_data: SWOTAnalysis | null;
  created_at: Date | null;
}

// ============ Helper Functions ============

/**
 * Calculate overall score from regional scores
 */
export function calculateOverallScore(regionalScores: RegionScore[]): number {
  if (regionalScores.length === 0) return 0;
  const total = regionalScores.reduce(
    (sum, region) => sum + region["Điểm số (Score)"],
    0
  );
  return total / regionalScores.length;
}

/**
 * Extract academic score from pillar scores
 */
export function extractAcademicScore(pillarScores: PillarScores): number {
  return pillarScores["Học thuật (Aca)"];
}

/**
 * Extract extracurricular score from pillar scores
 */
export function extractExtracurricularScore(
  pillarScores: PillarScores
): number {
  return pillarScores["Hoạt động ngoại khóa (HDNK)"];
}

/**
 * Generate summary text from analysis data
 */
export function generateSummary(analysisData: Feature1OutputData): string {
  const { summary, "C. Nhận diện Spike (Yếu tố cốt lõi)": spike } =
    analysisData;

  const parts: string[] = [];

  if (summary.main_spike) {
    parts.push(`Spike chính: ${summary.main_spike}`);
  }

  if (summary.sharpness) {
    parts.push(`Độ sắc: ${summary.sharpness}`);
  }

  if (spike["Nhận xét"]) {
    parts.push(`Nhận xét: ${spike["Nhận xét"]}`);
  }

  return parts.join(". ") || "Phân tích hồ sơ hoàn tất";
}

/**
 * Map Feature 1 output to database input format
 */
export function mapAnalysisToDatabase(
  studentId: string,
  inputPayload: Feature1InputPayload,
  outputData: Feature1OutputData
): ProfileAnalysisCreateInput {
  const pillarScores = outputData["D. Điểm số gốc (Pillar Scores)"];
  const regionalScores =
    outputData["A. Đánh giá điểm số (Weighted Score Evaluation)"]["Khu vực"];
  const swotData = outputData["B. Phân tích SWOT"];

  return {
    student_id: studentId,
    analysis_date: new Date(),
    academic_data: {
      pillar_scores: pillarScores,
      regional_scores: regionalScores,
      input_data: inputPayload.academic,
    },
    extracurricular_data: {
      actions: inputPayload.action.actions,
      non_academic_awards: inputPayload.non_academic_awards,
      personal_projects: inputPayload.personal_projects,
    },
    skill_data: {
      skills: inputPayload.skill.skills,
    },
    overall_score: calculateOverallScore(regionalScores),
    academic_score: extractAcademicScore(pillarScores),
    extracurricular_score: extractExtracurricularScore(pillarScores),
    summary: generateSummary(outputData),
    swot_data: swotData,
  };
}

// ============ Validation & Type Guards ============

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
 * Validate RegionScore structure
 */
export function isValidRegionScore(value: unknown): value is RegionScore {
  if (!value || typeof value !== "object") return false;
  const region = value as Record<string, unknown>;
  return (
    isNonEmptyString(region.Vùng) &&
    isValidNumber(region["Điểm số (Score)"]) &&
    isNonEmptyString(region["Xếp loại (Rating)"]) &&
    isValidRegionScoreDetail(region["Chi tiết"])
  );
}

/**
 * Validate RegionScoreDetail structure
 */
export function isValidRegionScoreDetail(
  value: unknown
): value is RegionScoreDetail {
  if (!value || typeof value !== "object") return false;
  const detail = value as Record<string, unknown>;
  return (
    isValidNumber(detail["Học thuật (Aca)"]) &&
    isValidNumber(detail["Ngôn ngữ (Lan)"]) &&
    isValidNumber(detail["Hoạt động ngoại khóa (HDNK)"]) &&
    isValidNumber(detail["Kỹ năng (Skill)"])
  );
}

/**
 * Validate SpikeDetail structure
 */
export function isValidSpikeDetail(value: unknown): value is SpikeDetail {
  if (!value || typeof value !== "object") return false;
  const spike = value as Record<string, unknown>;
  return (
    isNonEmptyString(spike.name) &&
    isValidNumber(spike.score) &&
    isNonEmptyString(spike.sharpness) &&
    typeof spike.evidence_count === "number" &&
    spike.evidence_count >= 0 &&
    isValidBreakdown(spike.breakdown)
  );
}

/**
 * Validate breakdown object (Record<string, number>)
 */
export function isValidBreakdown(
  value: unknown
): value is Record<string, number> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const breakdown = value as Record<string, unknown>;
  return Object.values(breakdown).every((v) => isValidNumber(v));
}

/**
 * Validate SpikeAnalysis structure
 */
export function isValidSpikeAnalysis(value: unknown): value is SpikeAnalysis {
  if (!value || typeof value !== "object") return false;
  const spike = value as Record<string, unknown>;
  return (
    isNonEmptyString(spike["Loại Spike hiện tại"]) &&
    isNonEmptyString(spike["Spike ID"]) &&
    isValidNumber(spike["Điểm số"]) &&
    isValidArray(spike["Bằng chứng định hình"], isNonEmptyString) &&
    isNonEmptyString(spike["Độ sắc (Sharpness)"]) &&
    isValidBreakdown(spike["Chi tiết điểm (Breakdown)"]) &&
    isNonEmptyString(spike["Nhận xét"]) &&
    isValidAllSpikeScores(spike["Tất cả Spike Scores"])
  );
}

/**
 * Validate all spike scores object
 */
export function isValidAllSpikeScores(
  value: unknown
): value is Record<string, SpikeDetail> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const scores = value as Record<string, unknown>;
  return Object.values(scores).every(isValidSpikeDetail);
}

/**
 * Validate SWOTAnalysis structure
 */
export function isValidSWOTAnalysis(value: unknown): value is SWOTAnalysis {
  if (!value || typeof value !== "object") return false;
  const swot = value as Record<string, unknown>;
  return (
    isValidArray(swot["Strengths (Điểm mạnh)"], isNonEmptyString) &&
    isValidArray(swot["Weaknesses (Điểm yếu)"], isNonEmptyString) &&
    isValidArray(swot["Opportunities (Cơ hội)"], isNonEmptyString) &&
    isValidArray(swot["Threats (Thách thức)"], isNonEmptyString)
  );
}

/**
 * Validate PillarScores structure
 */
export function isValidPillarScores(value: unknown): value is PillarScores {
  if (!value || typeof value !== "object") return false;
  const pillars = value as Record<string, unknown>;
  return (
    isValidNumber(pillars["Học thuật (Aca)"]) &&
    isValidNumber(pillars["Ngôn ngữ (Lan)"]) &&
    isValidNumber(pillars["Hoạt động ngoại khóa (HDNK)"]) &&
    isValidNumber(pillars["Kỹ năng (Skill)"])
  );
}

/**
 * Validate AnalysisSummary structure
 */
export function isValidAnalysisSummary(
  value: unknown
): value is AnalysisSummary {
  if (!value || typeof value !== "object") return false;
  const summary = value as Record<string, unknown>;
  const totalScores = summary.total_pillar_scores as Record<string, unknown>;
  return (
    typeof summary.success === "boolean" &&
    totalScores &&
    typeof totalScores === "object" &&
    isValidNumber(totalScores.aca) &&
    isValidNumber(totalScores.lan) &&
    isValidNumber(totalScores.hdnk) &&
    isValidNumber(totalScores.skill) &&
    isNonEmptyString(summary.main_spike) &&
    isNonEmptyString(summary.sharpness)
  );
}

/**
 * Validate Feature1OutputData structure with comprehensive checks
 */
export function isValidFeature1OutputData(
  value: unknown
): value is Feature1OutputData {
  if (!value || typeof value !== "object") return false;
  const data = value as Record<string, unknown>;

  // Check section A
  const sectionA = data["A. Đánh giá điểm số (Weighted Score Evaluation)"];
  if (
    !sectionA ||
    typeof sectionA !== "object" ||
    !isValidArray(
      (sectionA as Record<string, unknown>)["Khu vực"],
      isValidRegionScore
    )
  ) {
    return false;
  }

  // Check section B
  if (!isValidSWOTAnalysis(data["B. Phân tích SWOT"])) {
    return false;
  }

  // Check section C
  if (!isValidSpikeAnalysis(data["C. Nhận diện Spike (Yếu tố cốt lõi)"])) {
    return false;
  }

  // Check section D
  if (!isValidPillarScores(data["D. Điểm số gốc (Pillar Scores)"])) {
    return false;
  }

  // Check summary
  if (!isValidAnalysisSummary(data.summary)) {
    return false;
  }

  return true;
}

/**
 * Normalize and validate Feature1OutputData, providing defaults for missing fields
 */
export function normalizeFeature1OutputData(
  value: unknown
): Feature1OutputData | null {
  if (!value || typeof value !== "object") return null;

  try {
    const data = value as Record<string, unknown>;

    // Normalize section A - ensure Khu vực is an array
    const sectionA = data["A. Đánh giá điểm số (Weighted Score Evaluation)"];
    const khuVuc =
      sectionA && typeof sectionA === "object"
        ? (sectionA as Record<string, unknown>)["Khu vực"]
        : [];
    const normalizedKhuVuc = Array.isArray(khuVuc)
      ? khuVuc.filter(isValidRegionScore)
      : [];

    // Normalize section B - ensure all arrays exist
    const swot =
      (data["B. Phân tích SWOT"] as Record<string, unknown> | undefined) ||
      ({} as Record<string, unknown>);
    const normalizedSWOT: SWOTAnalysis = {
      "Strengths (Điểm mạnh)": Array.isArray(swot["Strengths (Điểm mạnh)"])
        ? (swot["Strengths (Điểm mạnh)"] as unknown[]).filter(isNonEmptyString)
        : [],
      "Weaknesses (Điểm yếu)": Array.isArray(swot["Weaknesses (Điểm yếu)"])
        ? (swot["Weaknesses (Điểm yếu)"] as unknown[]).filter(isNonEmptyString)
        : [],
      "Opportunities (Cơ hội)": Array.isArray(swot["Opportunities (Cơ hội)"])
        ? (swot["Opportunities (Cơ hội)"] as unknown[]).filter(isNonEmptyString)
        : [],
      "Threats (Thách thức)": Array.isArray(swot["Threats (Thách thức)"])
        ? (swot["Threats (Thách thức)"] as unknown[]).filter(isNonEmptyString)
        : [],
    };

    // Normalize section C - ensure breakdown is valid
    const spike =
      (data["C. Nhận diện Spike (Yếu tố cốt lõi)"] as
        | Record<string, unknown>
        | undefined) || ({} as Record<string, unknown>);
    const normalizedBreakdown = isValidBreakdown(
      spike["Chi tiết điểm (Breakdown)"]
    )
      ? (spike["Chi tiết điểm (Breakdown)"] as Record<string, number>)
      : {};
    const normalizedEvidence = Array.isArray(spike["Bằng chứng định hình"])
      ? (spike["Bằng chứng định hình"] as unknown[]).filter(isNonEmptyString)
      : [];

    // Normalize all spike scores
    const allSpikes =
      (spike["Tất cả Spike Scores"] as Record<string, unknown> | undefined) ||
      ({} as Record<string, unknown>);
    const normalizedAllSpikes: Record<string, SpikeDetail> = {};
    if (
      allSpikes &&
      typeof allSpikes === "object" &&
      !Array.isArray(allSpikes)
    ) {
      Object.entries(allSpikes).forEach(([key, value]) => {
        if (isValidSpikeDetail(value)) {
          normalizedAllSpikes[key] = value;
        }
      });
    }

    const normalizedSpike: SpikeAnalysis = {
      "Loại Spike hiện tại": isNonEmptyString(spike["Loại Spike hiện tại"])
        ? (spike["Loại Spike hiện tại"] as string)
        : "Unknown",
      "Spike ID": isNonEmptyString(spike["Spike ID"])
        ? (spike["Spike ID"] as string)
        : "0",
      "Điểm số": isValidNumber(spike["Điểm số"])
        ? (spike["Điểm số"] as number)
        : 0,
      "Bằng chứng định hình": normalizedEvidence,
      "Độ sắc (Sharpness)": isNonEmptyString(spike["Độ sắc (Sharpness)"])
        ? (spike["Độ sắc (Sharpness)"] as string)
        : "Low",
      "Chi tiết điểm (Breakdown)": normalizedBreakdown,
      "Nhận xét": isNonEmptyString(spike["Nhận xét"])
        ? (spike["Nhận xét"] as string)
        : "",
      "Tất cả Spike Scores": normalizedAllSpikes,
    };

    // Normalize section D
    const pillars =
      (data["D. Điểm số gốc (Pillar Scores)"] as
        | Record<string, unknown>
        | undefined) || ({} as Record<string, unknown>);
    const normalizedPillars: PillarScores = {
      "Học thuật (Aca)": isValidNumber(pillars["Học thuật (Aca)"])
        ? (pillars["Học thuật (Aca)"] as number)
        : 0,
      "Ngôn ngữ (Lan)": isValidNumber(pillars["Ngôn ngữ (Lan)"])
        ? (pillars["Ngôn ngữ (Lan)"] as number)
        : 0,
      "Hoạt động ngoại khóa (HDNK)": isValidNumber(
        pillars["Hoạt động ngoại khóa (HDNK)"]
      )
        ? (pillars["Hoạt động ngoại khóa (HDNK)"] as number)
        : 0,
      "Kỹ năng (Skill)": isValidNumber(pillars["Kỹ năng (Skill)"])
        ? (pillars["Kỹ năng (Skill)"] as number)
        : 0,
    };

    // Normalize summary
    const summary =
      (data.summary as Record<string, unknown> | undefined) ||
      ({} as Record<string, unknown>);
    const totalScores =
      (summary.total_pillar_scores as Record<string, unknown> | undefined) ||
      ({} as Record<string, unknown>);
    const normalizedSummary: AnalysisSummary = {
      success: typeof summary.success === "boolean" ? summary.success : true,
      total_pillar_scores: {
        aca: isValidNumber(totalScores.aca) ? (totalScores.aca as number) : 0,
        lan: isValidNumber(totalScores.lan) ? (totalScores.lan as number) : 0,
        hdnk: isValidNumber(totalScores.hdnk)
          ? (totalScores.hdnk as number)
          : 0,
        skill: isValidNumber(totalScores.skill)
          ? (totalScores.skill as number)
          : 0,
      },
      main_spike: isNonEmptyString(summary.main_spike)
        ? (summary.main_spike as string)
        : "Unknown",
      sharpness: isNonEmptyString(summary.sharpness)
        ? (summary.sharpness as string)
        : "Low",
    };

    const normalized: Feature1OutputData = {
      "A. Đánh giá điểm số (Weighted Score Evaluation)": {
        "Khu vực": normalizedKhuVuc,
      },
      "B. Phân tích SWOT": normalizedSWOT,
      "C. Nhận diện Spike (Yếu tố cốt lõi)": normalizedSpike,
      "D. Điểm số gốc (Pillar Scores)": normalizedPillars,
      summary: normalizedSummary,
    };

    return normalized;
  } catch (error) {
    console.error("Error normalizing Feature1OutputData:", error);
    return null;
  }
}
