import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

// Giải thưởng phi học thuật
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

        const awards = await prisma.non_academic_awards.findMany({
            where: { background_id: student_id },
            orderBy: { award_date: 'desc' }
        });

        return NextResponse.json(awards);
    } catch (error) {
        console.error('❌ Error fetching non-academic awards:', error);
        return NextResponse.json(
            { error: 'Lỗi khi lấy giải thưởng phi học thuật' },
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

        const award = await prisma.non_academic_awards.create({
            data: {
                id: uuidv4(),
                background_id: student_id,
                award_name: body.award_name,
                category: body.category,
                issuing_organization: body.issuing_organization,
                award_level: body.award_level,
                award_date: body.award_date ? new Date(body.award_date) : undefined,
                description: body.description,
                certificate_url: body.certificate_url,
            }
        });

        return NextResponse.json({
            success: true,
            data: award
        });
    } catch (error) {
        console.error('❌ Error creating non-academic award:', error);
        return NextResponse.json(
            { error: 'Lỗi khi tạo giải thưởng phi học thuật' },
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

        await prisma.non_academic_awards.deleteMany({
            where: { background_id: student_id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('❌ Error deleting non-academic awards:', error);
        return NextResponse.json(
            { error: 'Lỗi khi xóa giải thưởng phi học thuật' },
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

        const award = await prisma.non_academic_awards.update({
            where: { id },
            data: {
                award_name: data.award_name,
                category: data.category,
                issuing_organization: data.issuing_organization,
                award_level: data.award_level,
                award_date: data.award_date ? new Date(data.award_date) : undefined,
                description: data.description,
                certificate_url: data.certificate_url,
            }
        });

        return NextResponse.json({
            success: true,
            data: award
        });
    } catch (error) {
        console.error('❌ Error updating non-academic award:', error);
        return NextResponse.json(
            { error: 'Lỗi khi cập nhật giải thưởng phi học thuật' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
