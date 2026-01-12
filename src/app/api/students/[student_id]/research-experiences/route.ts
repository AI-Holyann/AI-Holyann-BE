import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

// Kinh nghiệm nghiên cứu
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

        const experiences = await prisma.research_experiences.findMany({
            where: { background_id: student_id },
            orderBy: { start_date: 'desc' }
        });

        return NextResponse.json(experiences);
    } catch (error) {
        console.error('❌ Error fetching research experiences:', error);
        return NextResponse.json(
            { error: 'Lỗi khi lấy kinh nghiệm nghiên cứu' },
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

        const experience = await prisma.research_experiences.create({
            data: {
                id: uuidv4(),
                background_id: student_id,
                project_title: body.project_title,
                institution: body.institution,
                supervisor_name: body.supervisor_name,
                role: body.role,
                start_date: body.start_date ? new Date(body.start_date) : undefined,
                end_date: body.end_date ? new Date(body.end_date) : undefined,
                is_current: body.is_current ?? false,
                research_field: body.research_field,
                description: body.description,
                methodologies: body.methodologies,
                findings: body.findings,
                publication_url: body.publication_url,
            }
        });

        return NextResponse.json({
            success: true,
            data: experience
        });
    } catch (error) {
        console.error('❌ Error creating research experience:', error);
        return NextResponse.json(
            { error: 'Lỗi khi tạo kinh nghiệm nghiên cứu' },
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

        await prisma.research_experiences.deleteMany({
            where: { background_id: student_id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('❌ Error deleting research experiences:', error);
        return NextResponse.json(
            { error: 'Lỗi khi xóa kinh nghiệm nghiên cứu' },
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

        const experience = await prisma.research_experiences.update({
            where: { id },
            data: {
                project_title: data.project_title,
                institution: data.institution,
                supervisor_name: data.supervisor_name,
                role: data.role,
                start_date: data.start_date ? new Date(data.start_date) : undefined,
                end_date: data.end_date ? new Date(data.end_date) : undefined,
                is_current: data.is_current,
                research_field: data.research_field,
                description: data.description,
                methodologies: data.methodologies,
                findings: data.findings,
                publication_url: data.publication_url,
            }
        });

        return NextResponse.json({
            success: true,
            data: experience
        });
    } catch (error) {
        console.error('❌ Error updating research experience:', error);
        return NextResponse.json(
            { error: 'Lỗi khi cập nhật kinh nghiệm nghiên cứu' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
