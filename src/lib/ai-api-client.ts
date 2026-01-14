/**
 * AI API Client Utility
 *
 * Centralized client for calling Django AI server endpoints
 * Uses AI_API_URL from environment variables
 */

const AI_API_BASE = process.env.AI_API_URL || "http://127.0.0.1:8000";

// Ensure base URL doesn't have trailing slash
const getBaseUrl = () => {
  const base = AI_API_BASE.replace(/\/+$/, "");
  // If AI_API_URL is just IP:port, add http://
  if (!base.startsWith("http://") && !base.startsWith("https://")) {
    return `http://${base}`;
  }
  return base;
};

const BASE_URL = getBaseUrl();

/**
 * Call AI API endpoint
 */
export async function callAIAPI<T = any>(
  endpoint: string,
  options: {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    body?: any;
    headers?: Record<string, string>;
  } = {}
): Promise<T> {
  const { method = "POST", body, headers = {} } = options;

  // Ensure endpoint starts with /
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${BASE_URL}${path}`;

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };

  const fetchOptions: RequestInit = {
    method,
    headers: requestHeaders,
    cache: "no-store", // Disable caching for AI API calls
  };

  if (body && method !== "GET") {
    fetchOptions.body = JSON.stringify(body);
  }

  try {
    console.log(`🤖 [AI API] ${method} ${url}`);
    if (body) {
      console.log(`📤 [AI API] Request body:`, JSON.stringify(body));
    }

    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      const errorText = await response.text();
      let errorData: any;
      try {
        errorData = errorText
          ? JSON.parse(errorText)
          : { error: "Unknown error" };
      } catch {
        errorData = { error: errorText || "Unknown error" };
      }

      console.error(`❌ [AI API] Error ${response.status}:`, errorData);
      throw new Error(
        errorData.error ||
          errorData.message ||
          `AI API returned ${response.status}`
      );
    }

    const data = await response.json();
    console.log(`✅ [AI API] Success`);
    return data;
  } catch (error) {
    console.error(`❌ [AI API] Request failed:`, error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to call AI API");
  }
}

/**
 * Feature 1: Profile Analysis
 */
export async function callProfileAnalysis(payload: any) {
  return callAIAPI("/hoexapp/api/profile-analysis/", {
    method: "POST",
    body: payload,
  });
}

import type {
  CareerAssessmentInput,
  CareerAssessmentOutput,
  MBTIInput,
  MBTIOutput,
  GritInput,
  GritOutput,
  RIASECInput,
  RIASECOutput,
} from "./schemas/career-assessment.schema";

/**
 * Feature 2: Career Assessment (Combined)
 */
export async function callCareerAssessment(
  payload: CareerAssessmentInput
): Promise<CareerAssessmentOutput> {
  return callAIAPI<CareerAssessmentOutput>("/hoexapp/api/career-assessment/", {
    method: "POST",
    body: payload,
  });
}

/**
 * Feature 2: MBTI Assessment Only
 */
export async function callMBTIAssessment(
  answers: number[]
): Promise<MBTIOutput> {
  const payload: MBTIInput = { answers };
  return callAIAPI<MBTIOutput>("/hoexapp/api/mbti/", {
    method: "POST",
    body: payload,
  });
}

/**
 * Feature 2: GRIT Scale Assessment Only
 */
export async function callGritAssessment(
  answers: Record<string, number>
): Promise<GritOutput> {
  const payload: GritInput = { answers };
  return callAIAPI<GritOutput>("/hoexapp/api/grit-scale/", {
    method: "POST",
    body: payload,
  });
}

/**
 * Feature 2: RIASEC Assessment Only
 */
export async function callRIASECAssessment(
  answers: Record<string, number>
): Promise<RIASECOutput> {
  const payload: RIASECInput = { answers };
  return callAIAPI<RIASECOutput>("/hoexapp/api/riasec/", {
    method: "POST",
    body: payload,
  });
}

/**
 * Feature 3: University Recommendation
 */
export async function callUniversityRecommendation(payload: {
  feature1_output: any;
  feature2_output: any;
  top_n?: number;
  min_match_score?: number;
  duration_months?: number;
  start_date?: string;
}) {
  return callAIAPI("/hoexapp/api/university-recommendation/", {
    method: "POST",
    body: payload,
  });
}
