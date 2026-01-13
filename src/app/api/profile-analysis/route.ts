/**
 * Profile Analysis API (Feature 1)
 * 
 * POST /api/profile-analysis/
 * 
 * Direct endpoint to call Django AI server for profile analysis
 * Accepts the same payload format as described in POSTMAN_GUIDE.md
 */

import { NextRequest, NextResponse } from 'next/server';
import { callProfileAnalysis } from '@/lib/ai-api-client';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    // Validate required fields
    if (!payload.academic) {
      return NextResponse.json(
        { error: 'Thiếu phần bắt buộc: academic', success: false },
        { status: 400 }
      );
    }

    if (!payload.academic.gpa) {
      return NextResponse.json(
        { error: 'Thiếu GPA trong phần academic', success: false },
        { status: 400 }
      );
    }

    // Call AI API
    const result = await callProfileAnalysis(payload);

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('❌ [Profile Analysis API] Error:', error);
    return NextResponse.json(
      {
        error: error.message || 'Lỗi khi phân tích hồ sơ',
        success: false,
      },
      { status: 500 }
    );
  }
}
