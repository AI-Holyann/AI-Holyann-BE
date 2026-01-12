import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

// Thông tin phụ huynh
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ student_id: string }> }
) {
    try {
        const { student_id } = await params;

        const parents = await prisma.student_parents.findMany({
            where: { student_id }
        });

        return NextResponse.json(parents);
    } catch (error) {
        console.error('❌ Error fetching parents:', error);
        return NextResponse.json(
            { error: 'Lỗi khi lấy thông tin phụ huynh' },
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

        const parent = await prisma.student_parents.create({
            data: {
                id: uuidv4(),
                student_id,
                full_name: body.full_name,
                relationship: body.relationship,
                phone_number: body.phone_number,
                email: body.email,
                job_title: body.job_title,
            }
        });

        return NextResponse.json({
            success: true,
            data: parent
        });
    } catch (error) {
        console.error('❌ Error creating parent:', error);
        return NextResponse.json(
            { error: 'Lỗi khi tạo thông tin phụ huynh' },
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

        const parent = await prisma.student_parents.update({
            where: { id },
            data: {
                full_name: data.full_name,
                relationship: data.relationship,
                phone_number: data.phone_number,
                email: data.email,
                job_title: data.job_title,
            }
        });

        return NextResponse.json({
            success: true,
            data: parent
        });
    } catch (error) {
        console.error('❌ Error updating parent:', error);
        return NextResponse.json(
            { error: 'Lỗi khi cập nhật thông tin phụ huynh' },
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

        await prisma.student_parents.deleteMany({
            where: { student_id }
        });

        return NextResponse.json({
            success: true,
            message: 'Xóa thông tin phụ huynh thành công'
        });
    } catch (error) {
        console.error('❌ Error deleting parents:', error);
        return NextResponse.json(
            { error: 'Lỗi khi xóa thông tin phụ huynh' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
