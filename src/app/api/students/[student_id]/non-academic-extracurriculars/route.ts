import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

// Hoạt động ngoại khóa phi học thuật
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

        const activities = await prisma.non_academic_extracurriculars.findMany({
            where: { background_id: student_id },
            orderBy: { start_date: 'desc' }
        });

        return NextResponse.json(activities);
    } catch (error) {
        console.error('❌ Error fetching non-academic extracurriculars:', error);
        return NextResponse.json(
            { error: 'Lỗi khi lấy hoạt động ngoại khóa phi học thuật' },
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

        const activity = await prisma.non_academic_extracurriculars.create({
            data: {
                id: uuidv4(),
                background_id: student_id,
                activity_name: body.activity_name,
                category: body.category,
                organization: body.organization,
                role: body.role,
                start_date: body.start_date ? new Date(body.start_date) : undefined,
                end_date: body.end_date ? new Date(body.end_date) : undefined,
                hours_per_week: body.hours_per_week,
                weeks_per_year: body.weeks_per_year,
                description: body.description,
                achievements: body.achievements,
                impact: body.impact,
            }
        });

        return NextResponse.json({
            success: true,
            data: activity
        });
    } catch (error) {
        console.error('❌ Error creating non-academic extracurricular:', error);
        return NextResponse.json(
            { error: 'Lỗi khi tạo hoạt động ngoại khóa phi học thuật' },
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

        await prisma.non_academic_extracurriculars.deleteMany({
            where: { background_id: student_id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('❌ Error deleting non-academic extracurriculars:', error);
        return NextResponse.json(
            { error: 'Lỗi khi xóa hoạt động ngoại khóa phi học thuật' },
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

        const activity = await prisma.non_academic_extracurriculars.update({
            where: { id },
            data: {
                activity_name: data.activity_name,
                category: data.category,
                organization: data.organization,
                role: data.role,
                start_date: data.start_date ? new Date(data.start_date) : undefined,
                end_date: data.end_date ? new Date(data.end_date) : undefined,
                hours_per_week: data.hours_per_week,
                weeks_per_year: data.weeks_per_year,
                description: data.description,
                achievements: data.achievements,
                impact: data.impact,
            }
        });

        return NextResponse.json({
            success: true,
            data: activity
        });
    } catch (error) {
        console.error('❌ Error updating non-academic extracurricular:', error);
        return NextResponse.json(
            { error: 'Lỗi khi cập nhật hoạt động ngoại khóa phi học thuật' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
