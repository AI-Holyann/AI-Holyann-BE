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

        const personalProject = await prisma.personal_projects.create({
            data: {
                id: uuidv4(),
                background_id: student_id,
                project_name: body.project_name,
                topic: body.topic,
                description: body.description,
                duration_months: body.duration_months,
                impact: body.impact,
                created_at: new Date(),
                updated_at: new Date()
            }
        });

        return NextResponse.json(personalProject);
    } catch (error) {
        console.error('Error creating personal project:', error);
        return NextResponse.json(
            { error: 'Failed to create personal project' },
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

        const personalProjects = await prisma.personal_projects.findMany({
            where: { background_id: student_id },
            orderBy: { created_at: 'desc' }
        });

        return NextResponse.json(personalProjects);
    } catch (error) {
        console.error('Error fetching personal projects:', error);
        return NextResponse.json(
            { error: 'Failed to fetch personal projects' },
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

        await prisma.personal_projects.deleteMany({
            where: { background_id: student_id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting personal projects:', error);
        return NextResponse.json(
            { error: 'Failed to delete personal projects' },
            { status: 500 }
        );
    }
}
