/**
 * University Recommendation API (Feature 3)
 * 
 * POST /api/university-recommendation/
 * 
 * Accepts output from Feature 1 and Feature 2, returns university recommendations
 * categorized as REACH, MATCH, SAFETY with roadmap
 */

import { NextRequest, NextResponse } from 'next/server';
import { callUniversityRecommendation } from '@/lib/ai-api-client';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    // Validate required fields
    if (!payload.feature1_output) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          errors: ['feature1_output thiếu field'],
        },
        { status: 400 }
      );
    }

    if (!payload.feature2_output) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          errors: ['feature2_output thiếu field'],
        },
        { status: 400 }
      );
    }

    if (!payload.feature1_output.summary) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          errors: ["feature1_output thiếu field 'summary'"],
        },
        { status: 400 }
      );
    }

    if (!payload.feature2_output.assessment) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          errors: ["feature2_output.assessment thiếu field"],
        },
        { status: 400 }
      );
    }

    if (!payload.feature2_output.assessment.mbti) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          errors: ["feature2_output.assessment thiếu 'mbti'"],
        },
        { status: 400 }
      );
    }

    // Set defaults for optional parameters
    const requestPayload = {
      feature1_output: payload.feature1_output,
      feature2_output: payload.feature2_output,
      top_n: payload.top_n || 50,
      min_match_score: payload.min_match_score || 30.0,
      duration_months: payload.duration_months || 12,
      start_date: payload.start_date || new Date().toISOString().split('T')[0],
    };

    // Call AI API
    const result = await callUniversityRecommendation(requestPayload);

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('❌ [University Recommendation API] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Không tìm thấy universities phù hợp',
      },
      { status: 500 }
    );
  }
}
