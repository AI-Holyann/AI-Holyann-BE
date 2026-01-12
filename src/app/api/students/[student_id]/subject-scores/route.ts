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

        // Ensure background exists
        let background = await prisma.student_backgrounds.findUnique({
            where: { student_id }
        });

        if (!background) {
            background = await prisma.student_backgrounds.create({
                data: {
                    student_id,
                    created_at: new Date(),
                    updated_at: new Date()
                }
            });
        }

        const subjectScore = await prisma.subject_scores.create({
            data: {
                id: uuidv4(),
                background_id: student_id,
                subject: body.subject,
                score: parseFloat(body.score),
                year: body.year ? parseInt(body.year) : null,
                semester: body.semester ? parseInt(body.semester) : null,
                created_at: new Date(),
                updated_at: new Date()
            }
        });

        return NextResponse.json(subjectScore);
    } catch (error) {
        console.error('Error creating subject score:', error);
        return NextResponse.json(
            { error: 'Failed to create subject score' },
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

        const subjectScores = await prisma.subject_scores.findMany({
            where: { background_id: student_id },
            orderBy: { created_at: 'desc' }
        });

        return NextResponse.json(subjectScores);
    } catch (error) {
        console.error('Error fetching subject scores:', error);
        return NextResponse.json(
            { error: 'Failed to fetch subject scores' },
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

        await prisma.subject_scores.deleteMany({
            where: { background_id: student_id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting subject scores:', error);
        return NextResponse.json(
            { error: 'Failed to delete subject scores' },
            { status: 500 }
        );
    }
}
