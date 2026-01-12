import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

// Kinh nghiệm làm việc
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ student_id: string }> }
) {
    try {
        const { student_id } = await params;

        await prisma.student_backgrounds.upsert({
            where: { student_id },
            update: {},
            create: { student_id }
        });

        const experiences = await prisma.work_experiences.findMany({
            where: { background_id: student_id },
            orderBy: { start_date: 'desc' }
        });

        return NextResponse.json(experiences);
    } catch (error) {
        console.error('❌ Error fetching work experiences:', error);
        return NextResponse.json(
            { error: 'Lỗi khi lấy kinh nghiệm làm việc' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ student_id: string }> }
) {
    try {
        const { student_id } = await params;
        const body = await request.json();

        await prisma.student_backgrounds.upsert({
            where: { student_id },
            update: {},
            create: { student_id }
        });

        const experience = await prisma.work_experiences.create({
            data: {
                id: uuidv4(),
                background_id: student_id,
                company_name: body.company_name,
                job_title: body.job_title,
                employment_type: body.employment_type,
                location: body.location,
                start_date: body.start_date ? new Date(body.start_date) : undefined,
                end_date: body.end_date ? new Date(body.end_date) : undefined,
                is_current: body.is_current ?? false,
                responsibilities: body.responsibilities,
                achievements: body.achievements,
                skills_gained: body.skills_gained,
            }
        });

        return NextResponse.json({
            success: true,
            data: experience
        });
    } catch (error) {
        console.error('❌ Error creating work experience:', error);
        return NextResponse.json(
            { error: 'Lỗi khi tạo kinh nghiệm làm việc' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ student_id: string }> }
) {
    try {
        const { student_id } = await params;

        await prisma.work_experiences.deleteMany({
            where: { background_id: student_id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('❌ Error deleting work experiences:', error);
        return NextResponse.json(
            { error: 'Lỗi khi xóa kinh nghiệm làm việc' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...data } = body;

        const experience = await prisma.work_experiences.update({
            where: { id },
            data: {
                company_name: data.company_name,
                job_title: data.job_title,
                employment_type: data.employment_type,
                location: data.location,
                start_date: data.start_date ? new Date(data.start_date) : undefined,
                end_date: data.end_date ? new Date(data.end_date) : undefined,
                is_current: data.is_current,
                responsibilities: data.responsibilities,
                achievements: data.achievements,
                skills_gained: data.skills_gained,
            }
        });

        return NextResponse.json({
            success: true,
            data: experience
        });
    } catch (error) {
        console.error('❌ Error updating work experience:', error);
        return NextResponse.json(
            { error: 'Lỗi khi cập nhật kinh nghiệm làm việc' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
