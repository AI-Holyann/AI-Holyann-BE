/**
 * GRIT Scale Assessment API (Feature 2 - Individual)
 * 
 * POST /api/grit-scale/
 * 
 * GRIT Scale assessment only
 */

import { NextRequest, NextResponse } from 'next/server';
import { callGritAssessment } from '@/lib/ai-api-client';

export async function POST(request: NextRequest) {
  try {
    const { answers } = await request.json();

    // Validate input
    if (!answers || typeof answers !== 'object') {
      return NextResponse.json(
        { error: 'answers must be an object', success: false },
        { status: 400 }
      );
    }

    const keys = Object.keys(answers);
    if (keys.length !== 12) {
      return NextResponse.json(
        { error: 'answers must have exactly 12 answers (keys 1-12)', success: false },
        { status: 400 }
      );
    }

    // Validate keys are 1-12 and values are 1-5
    for (let i = 1; i <= 12; i++) {
      const key = i.toString();
      if (!(key in answers)) {
        return NextResponse.json(
          { error: `Missing answer for key ${key}`, success: false },
          { status: 400 }
        );
      }

      const val = Number(answers[key]);
      if (isNaN(val) || val < 1 || val > 5) {
        return NextResponse.json(
          { error: `Answer for key ${key} must be between 1 and 5`, success: false },
          { status: 400 }
        );
      }
    }

    // Call AI API
    const result = await callGritAssessment(answers);

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('❌ [GRIT Scale API] Error:', error);
    return NextResponse.json(
      {
        error: error.message || 'Internal server error',
        success: false,
      },
      { status: 500 }
    );
  }
}
