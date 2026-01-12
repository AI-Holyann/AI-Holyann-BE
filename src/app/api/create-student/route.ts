import {NextRequest, NextResponse} from 'next/server'
import {prisma} from '@/lib/prisma'

export async function POST(request: NextRequest) {
    try {
        const {user_id} = await request.json()

        if (!user_id) {
            return NextResponse.json({
                success: false,
                error: 'user_id is required'
            }, {status: 400})
        }

        console.log('🔍 Creating student profile for user_id:', user_id)

        // Check if student already exists using Prisma
        const existingStudent = await prisma.students.findUnique({
            where: {user_id}
        })

        if (existingStudent) {
            console.log('✅ Student profile already exists')
            return NextResponse.json({
                success: true,
                message: 'Student profile already exists',
                student_id: existingStudent.user_id
            })
        }

        // Create new student profile using Prisma (bypasses RLS)
        const newStudent = await prisma.students.create({
            data: {
                user_id: user_id,
                created_at: new Date(),
                updated_at: new Date()
            }
        })

        console.log('✅ Student profile created:', newStudent)

        return NextResponse.json({
            success: true,
            message: 'Student profile created successfully',
            student_id: user_id
        })

    } catch (error: unknown) {
        console.error('❌ Error in create-student API:', error)
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Internal server error'
        }, {status: 500})
    }
}
