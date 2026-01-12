import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Tạo hoặc cập nhật academic profile
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ student_id: string }> }
) {
    try {
        const { student_id } = await params;
        const body = await request.json();

        const academicProfile = await prisma.student_academic_profiles.upsert({
            where: { student_id },
            update: {
                gpa_transcript_details: body.gpa_transcript_details || undefined,
                english_certificates: body.english_certificates || undefined,
                standardized_tests: body.standardized_tests || undefined,
            },
            create: {
                student_id,
                gpa_transcript_details: body.gpa_transcript_details || {},
                english_certificates: body.english_certificates || {},
                standardized_tests: body.standardized_tests || {},
            }
        });

        return NextResponse.json({
            success: true,
            data: academicProfile
        });
    } catch (error) {
        console.error('❌ Error saving academic profile:', error);
        return NextResponse.json(
            { error: 'Lỗi khi lưu thông tin học thuật' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ student_id: string }> }
) {
    try {
        const { student_id } = await params;

        const academicProfile = await prisma.student_academic_profiles.findUnique({
            where: { student_id }
        });

        return NextResponse.json(academicProfile || {});
    } catch (error) {
        console.error('❌ Error fetching academic profile:', error);
        return NextResponse.json(
            { error: 'Lỗi khi lấy thông tin học thuật' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
