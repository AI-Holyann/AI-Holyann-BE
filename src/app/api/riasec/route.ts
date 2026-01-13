/**
 * RIASEC Assessment API (Feature 2 - Individual)
 * 
 * POST /api/riasec/
 * 
 * RIASEC assessment only
 */

import { NextRequest, NextResponse } from 'next/server';
import { callRIASECAssessment } from '@/lib/ai-api-client';

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
    if (keys.length !== 48) {
      return NextResponse.json(
        { error: 'answers must have exactly 48 answers (keys 1-48)', success: false },
        { status: 400 }
      );
    }

    // Validate keys are 1-48 and values are 1-5
    for (let i = 1; i <= 48; i++) {
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
    const result = await callRIASECAssessment(answers);

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('❌ [RIASEC API] Error:', error);
    return NextResponse.json(
      {
        error: error.message || 'Internal server error',
        success: false,
      },
      { status: 500 }
    );
  }
}
