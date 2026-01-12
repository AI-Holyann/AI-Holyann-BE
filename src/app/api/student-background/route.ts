/**
 * API Example: Endpoint để quản lý Student Background
 * File này demo cách sử dụng service và types đã tạo
 */

import { NextRequest, NextResponse } from 'next/server';
import * as BackgroundService from '@/lib/services/student-background.service';

// ============================================
// GET: Lấy toàn bộ thông tin background
// ============================================
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');

    if (!studentId) {
      return NextResponse.json(
        { error: 'Student ID is required' },
        { status: 400 }
      );
    }

    // Lấy toàn bộ thông tin
    const background = await BackgroundService.getStudentBackground(studentId);

    if (!background) {
      return NextResponse.json(
        { error: 'Student background not found' },
        { status: 404 }
      );
    }

    // Lấy thống kê
    const statistics = await BackgroundService.getBackgroundStatistics(studentId);

    return NextResponse.json({
      background,
      statistics,
    });
  } catch (error) {
    console.error('Error fetching student background:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================
// POST: Thêm một item mới
// ============================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, type, data } = body;

    if (!studentId || !type || !data) {
      return NextResponse.json(
        { error: 'Missing required fields: studentId, type, data' },
        { status: 400 }
      );
    }

    let result;

    switch (type) {
      case 'academic_award':
        result = await BackgroundService.addAcademicAward(studentId, data);
        break;

      case 'non_academic_award':
        result = await BackgroundService.addNonAcademicAward(studentId, data);
        break;

      case 'academic_extracurricular':
        result = await BackgroundService.addAcademicExtracurricular(studentId, data);
        break;

      case 'non_academic_extracurricular':
        result = await BackgroundService.addNonAcademicExtracurricular(studentId, data);
        break;

      case 'work_experience':
        result = await BackgroundService.addWorkExperience(studentId, data);
        break;

      case 'research_experience':
        result = await BackgroundService.addResearchExperience(studentId, data);
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid type' },
          { status: 400 }
        );
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error adding background item:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================
// PUT: Cập nhật một item
// ============================================
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { itemId, type, data } = body;

    if (!itemId || !type || !data) {
      return NextResponse.json(
        { error: 'Missing required fields: itemId, type, data' },
        { status: 400 }
      );
    }

    let result;

    switch (type) {
      case 'academic_award':
        result = await BackgroundService.updateAcademicAward(itemId, data);
        break;

      case 'non_academic_award':
        result = await BackgroundService.updateNonAcademicAward(itemId, data);
        break;

      case 'academic_extracurricular':
        result = await BackgroundService.updateAcademicExtracurricular(itemId, data);
        break;

      case 'non_academic_extracurricular':
        result = await BackgroundService.updateNonAcademicExtracurricular(itemId, data);
        break;

      case 'work_experience':
        result = await BackgroundService.updateWorkExperience(itemId, data);
        break;

      case 'research_experience':
        result = await BackgroundService.updateResearchExperience(itemId, data);
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid type' },
          { status: 400 }
        );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating background item:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================
// DELETE: Xóa một item
// ============================================
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('itemId');
    const type = searchParams.get('type');

    if (!itemId || !type) {
      return NextResponse.json(
        { error: 'Missing required parameters: itemId, type' },
        { status: 400 }
      );
    }

    switch (type) {
      case 'academic_award':
        await BackgroundService.deleteAcademicAward(itemId);
        break;

      case 'non_academic_award':
        await BackgroundService.deleteNonAcademicAward(itemId);
        break;

      case 'academic_extracurricular':
        await BackgroundService.deleteAcademicExtracurricular(itemId);
        break;

      case 'non_academic_extracurricular':
        await BackgroundService.deleteNonAcademicExtracurricular(itemId);
        break;

      case 'work_experience':
        await BackgroundService.deleteWorkExperience(itemId);
        break;

      case 'research_experience':
        await BackgroundService.deleteResearchExperience(itemId);
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid type' },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting background item:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

