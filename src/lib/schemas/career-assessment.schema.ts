/**
 * Career Assessment Schema (Feature 2)
 * 
 * Based on POSTMAN_GUIDE.md and POSTMAN_TEST_INPUT.json / POSTMAN_TEST_OUTPUT.json
 * Covers 4 API endpoints:
 * - /api/career-assessment/ (Combined)
 * - /api/mbti/ (MBTI only)
 * - /api/grit-scale/ (GRIT only)
 * - /api/riasec/ (RIASEC only)
 */

// ============================================================================
// INPUT SCHEMAS
// ============================================================================

/**
 * Combined Career Assessment Input
 * Used for /api/career-assessment/
 */
export interface CareerAssessmentInput {
  mbti_answers: number[]; // Exactly 60 integers from -3 to 3
  grit_answers: Record<string, number>; // Keys "1"-"12", values 1-5
  riasec_answers: Record<string, number>; // Keys "1"-"48", values 1-5
  top_n?: number; // Optional, default 10
  min_match_score?: number; // Optional, default 50.0
}

/**
 * MBTI Assessment Input
 * Used for /api/mbti/
 */
export interface MBTIInput {
  answers: number[]; // Exactly 60 integers from -3 to 3
}

/**
 * GRIT Scale Assessment Input
 * Used for /api/grit-scale/
 */
export interface GritInput {
  answers: Record<string, number>; // Keys "1"-"12", values 1-5
}

/**
 * RIASEC Assessment Input
 * Used for /api/riasec/
 */
export interface RIASECInput {
  answers: Record<string, number>; // Keys "1"-"48", values 1-5
}

// ============================================================================
// OUTPUT SCHEMAS
// ============================================================================

/**
 * MBTI Assessment Result
 */
export interface MBTIResult {
  personality_type: string; // e.g., "INTJ", "ENTP"
  dimension_scores: {
    E: number; // Extroversion
    I: number; // Introversion
    S: number; // Sensing
    N: number; // Intuition
    T: number; // Thinking
    F: number; // Feeling
    J: number; // Judging
    P: number; // Perceiving
  };
  confidence: number; // 0-1
}

/**
 * GRIT Assessment Result
 */
export interface GritResult {
  score: number; // Overall grit score
  level: string; // e.g., "Cao", "Trên trung bình"
  description: string; // Description in Vietnamese
}

/**
 * RIASEC Assessment Result
 */
export interface RIASECResult {
  code: string; // Holland code, e.g., "RIA", "RIE"
  scores: {
    Realistic: number;
    Investigative: number;
    Artistic: number;
    Social: number;
    Enterprising: number;
    Conventional: number;
  };
  top3: Array<[string, number]>; // e.g., [["Investigative", 150.0], ["Realistic", 120.0], ["Artistic", 80.0]]
}

/**
 * Career Recommendation Item
 */
export interface CareerRecommendation {
  title: string; // Job title, e.g., "Software Developer"
  match_score: number; // Match percentage, e.g., 85.5
  riasec_code: string; // Holland code, e.g., "RIA"
  description: string; // e.g., "Điểm RIASEC: R=4.5, I=5.2, A=3.1, S=2.0, E=1.5, C=2.8"
  riasec_scores: {
    R: number;
    I: number;
    A: number;
    S: number;
    E: number;
    C: number;
  };
}

/**
 * Career Groups - Recommendations grouped by industry
 * Key: Industry name in Vietnamese (e.g., "Công nghệ thông tin", "Kinh tế", "Y tế")
 * Value: Array of CareerRecommendation items
 */
export type CareerGroups = Record<string, CareerRecommendation[]>;

/**
 * Combined Assessment Result
 * Used for /api/career-assessment/
 */
export interface CombinedAssessmentResult {
  mbti: MBTIResult;
  grit: GritResult;
  riasec: RIASECResult;
}

/**
 * Combined Career Assessment Output
 * Response from /api/career-assessment/
 */
export interface CareerAssessmentOutput {
  success: boolean;
  assessment: CombinedAssessmentResult;
  recommendations: CareerRecommendation[]; // Sorted by match_score
  career_groups?: CareerGroups; // NEW: Grouped by industry
}

/**
 * MBTI Assessment Output
 * Response from /api/mbti/
 */
export interface MBTIOutput {
  success: boolean;
  mbti: MBTIResult;
}

/**
 * GRIT Assessment Output
 * Response from /api/grit-scale/
 */
export interface GritOutput {
  success: boolean;
  grit: GritResult;
}

/**
 * RIASEC Assessment Output
 * Response from /api/riasec/
 */
export interface RIASECOutput {
  success: boolean;
  riasec: RIASECResult;
}

// ============================================================================
// ERROR RESPONSES
// ============================================================================

export interface APIErrorResponse {
  error: string;
  details?: string;
}

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Validate MBTI answers array
 */
export function isValidMBTIAnswers(answers: unknown): answers is number[] {
  if (!Array.isArray(answers)) return false;
  if (answers.length !== 60) return false;
  return answers.every(
    (a) => typeof a === "number" && a >= -3 && a <= 3
  );
}

/**
 * Validate GRIT answers object
 */
export function isValidGritAnswers(
  answers: unknown
): answers is Record<string, number> {
  if (typeof answers !== "object" || answers === null) return false;
  const keys = Object.keys(answers);
  if (keys.length !== 12) return false;
  for (let i = 1; i <= 12; i++) {
    const key = i.toString();
    if (!(key in answers)) return false;
    const value = (answers as Record<string, unknown>)[key];
    if (typeof value !== "number" || value < 1 || value > 5) return false;
  }
  return true;
}

/**
 * Validate RIASEC answers object
 */
export function isValidRIASECAnswers(
  answers: unknown
): answers is Record<string, number> {
  if (typeof answers !== "object" || answers === null) return false;
  const keys = Object.keys(answers);
  if (keys.length !== 48) return false;
  for (let i = 1; i <= 48; i++) {
    const key = i.toString();
    if (!(key in answers)) return false;
    const value = (answers as Record<string, unknown>)[key];
    if (typeof value !== "number" || value < 1 || value > 5) return false;
  }
  return true;
}

/**
 * Validate Career Assessment Input
 */
export function isValidCareerAssessmentInput(
  input: unknown
): input is CareerAssessmentInput {
  if (typeof input !== "object" || input === null) return false;
  const obj = input as Record<string, unknown>;
  return (
    isValidMBTIAnswers(obj.mbti_answers) &&
    isValidGritAnswers(obj.grit_answers) &&
    isValidRIASECAnswers(obj.riasec_answers) &&
    (obj.top_n === undefined ||
      (typeof obj.top_n === "number" && obj.top_n > 0)) &&
    (obj.min_match_score === undefined ||
      (typeof obj.min_match_score === "number" &&
        obj.min_match_score >= 0 &&
        obj.min_match_score <= 100))
  );
}

/**
 * Normalize Career Assessment Output (handle missing fields, null values)
 */
export function normalizeCareerAssessmentOutput(
  value: unknown
): CareerAssessmentOutput | null {
  if (typeof value !== "object" || value === null) return null;

  const data = value as Record<string, unknown>;

  // Check success flag
  if (data.success !== true) return null;

  // Validate assessment
  const assessment = data.assessment;
  if (typeof assessment !== "object" || assessment === null) return null;

  const assessmentData = assessment as Record<string, unknown>;

  // Validate MBTI
  const mbti = assessmentData.mbti;
  if (
    typeof mbti !== "object" ||
    mbti === null ||
    typeof (mbti as Record<string, unknown>).personality_type !== "string"
  ) {
    return null;
  }

  // Validate GRIT
  const grit = assessmentData.grit;
  if (
    typeof grit !== "object" ||
    grit === null ||
    typeof (grit as Record<string, unknown>).score !== "number"
  ) {
    return null;
  }

  // Validate RIASEC
  const riasec = assessmentData.riasec;
  if (
    typeof riasec !== "object" ||
    riasec === null ||
    typeof (riasec as Record<string, unknown>).code !== "string"
  ) {
    return null;
  }

  // Validate recommendations array
  const recommendations = data.recommendations;
  if (!Array.isArray(recommendations)) return null;

  const normalizedRecommendations: CareerRecommendation[] = recommendations
    .filter((rec) => {
      return (
        typeof rec === "object" &&
        rec !== null &&
        typeof (rec as Record<string, unknown>).title === "string" &&
        typeof (rec as Record<string, unknown>).match_score === "number"
      );
    })
    .map((rec) => {
      const recData = rec as Record<string, unknown>;
      return {
        title: String(recData.title || ""),
        match_score: Number(recData.match_score || 0),
        riasec_code: String(recData.riasec_code || ""),
        description: String(recData.description || ""),
        riasec_scores: {
          R: Number((recData.riasec_scores as Record<string, unknown>)?.R || 0),
          I: Number((recData.riasec_scores as Record<string, unknown>)?.I || 0),
          A: Number((recData.riasec_scores as Record<string, unknown>)?.A || 0),
          S: Number((recData.riasec_scores as Record<string, unknown>)?.S || 0),
          E: Number((recData.riasec_scores as Record<string, unknown>)?.E || 0),
          C: Number((recData.riasec_scores as Record<string, unknown>)?.C || 0),
        },
      };
    });

  // Validate career_groups (optional)
  let normalizedCareerGroups: CareerGroups | undefined;
  const careerGroups = data.career_groups;
  if (careerGroups !== undefined) {
    if (
      typeof careerGroups === "object" &&
      careerGroups !== null &&
      !Array.isArray(careerGroups)
    ) {
      normalizedCareerGroups = {} as CareerGroups;
      for (const [groupName, groupRecs] of Object.entries(careerGroups)) {
        if (Array.isArray(groupRecs)) {
          normalizedCareerGroups[groupName] = groupRecs
            .filter((rec) => {
              return (
                typeof rec === "object" &&
                rec !== null &&
                typeof (rec as Record<string, unknown>).title === "string"
              );
            })
            .map((rec) => {
              const recData = rec as Record<string, unknown>;
              return {
                title: String(recData.title || ""),
                match_score: Number(recData.match_score || 0),
                riasec_code: String(recData.riasec_code || ""),
                description: String(recData.description || ""),
                riasec_scores: {
                  R: Number(
                    (recData.riasec_scores as Record<string, unknown>)?.R || 0
                  ),
                  I: Number(
                    (recData.riasec_scores as Record<string, unknown>)?.I || 0
                  ),
                  A: Number(
                    (recData.riasec_scores as Record<string, unknown>)?.A || 0
                  ),
                  S: Number(
                    (recData.riasec_scores as Record<string, unknown>)?.S || 0
                  ),
                  E: Number(
                    (recData.riasec_scores as Record<string, unknown>)?.E || 0
                  ),
                  C: Number(
                    (recData.riasec_scores as Record<string, unknown>)?.C || 0
                  ),
                },
              };
            });
        }
      }
    }
  }

  return {
    success: true,
    assessment: {
      mbti: mbti as MBTIResult,
      grit: grit as GritResult,
      riasec: riasec as RIASECResult,
    },
    recommendations: normalizedRecommendations,
    career_groups: normalizedCareerGroups,
  };
}
