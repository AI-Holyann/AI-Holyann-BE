import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ student_id: string }> }
) {
    try {
        const { student_id } = await params;
        const body = await request.json();

        const skill = await prisma.student_skills.create({
            data: {
                id: uuidv4(),
                student_id: student_id,
                skill_name: body.skill_name,
                proficiency: body.proficiency,
                category: body.category,
                created_at: new Date(),
                updated_at: new Date()
            }
        });

        return NextResponse.json(skill);
    } catch (error) {
        console.error('Error creating skill:', error);
        return NextResponse.json(
            { error: 'Failed to create skill' },
            { status: 500 }
        );
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ student_id: string }> }
) {
    try {
        const { student_id } = await params;

        const skills = await prisma.student_skills.findMany({
            where: { student_id },
            orderBy: { created_at: 'desc' }
        });

        return NextResponse.json(skills);
    } catch (error) {
        console.error('Error fetching skills:', error);
        return NextResponse.json(
            { error: 'Failed to fetch skills' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ student_id: string }> }
) {
    try {
        const { student_id } = await params;

        await prisma.student_skills.deleteMany({
            where: { student_id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting skills:', error);
        return NextResponse.json(
            { error: 'Failed to delete skills' },
            { status: 500 }
        );
    }
}
