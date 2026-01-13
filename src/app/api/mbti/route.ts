/**
 * MBTI Assessment API (Feature 2 - Individual)
 * 
 * POST /api/mbti/
 * 
 * MBTI personality assessment only
 */

import { NextRequest, NextResponse } from 'next/server';
import { callMBTIAssessment } from '@/lib/ai-api-client';

export async function POST(request: NextRequest) {
  try {
    const { answers } = await request.json();

    // Validate input
    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: 'answers must be an array', success: false },
        { status: 400 }
      );
    }

    if (answers.length !== 60) {
      return NextResponse.json(
        { error: 'answers must have exactly 60 values', success: false },
        { status: 400 }
      );
    }

    // Validate answer range [-3, 3]
    for (let i = 0; i < answers.length; i++) {
      const val = Number(answers[i]);
      if (isNaN(val) || val < -3 || val > 3) {
        return NextResponse.json(
          {
            error: `Answer at index ${i} must be between -3 and 3`,
            success: false,
          },
          { status: 400 }
        );
      }
    }

    // Call AI API
    const result = await callMBTIAssessment(answers);

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('❌ [MBTI API] Error:', error);
    return NextResponse.json(
      {
        error: error.message || 'MBTI model could not be loaded. Check if Personality_Model.h5 exists in config/ folder.',
        success: false,
      },
      { status: 500 }
    );
  }
}
