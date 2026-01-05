import {NextRequest, NextResponse} from 'next/server'
import {supabaseAdmin} from '@/lib/supabase'
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

        console.log('🔧 Fixing student profile for user_id:', user_id)

        // 1. First check if user exists
        const {data: user, error: userError} = await supabaseAdmin
            .from('users')
            .select('id, full_name, email, role')
            .eq('id', user_id)
            .single()

        if (userError || !user) {
            return NextResponse.json({
                success: false,
                error: 'User not found'
            }, {status: 404})
        }

        console.log('✅ User found:', user.full_name, user.role)

        // 2. Check if student profile already exists
        const {data: existingStudent} = await supabaseAdmin
            .from('students')
            .select('user_id')
            .eq('user_id', user_id)
            .single()

        if (existingStudent) {
            return NextResponse.json({
                success: true,
                message: 'Student profile already exists',
                student_id: user_id,
                user: user
            })
        }

        // 3. Create student profile in Supabase
        const studentData = {
            user_id: user_id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            assessments_completed: false
        }

        const {data: newStudent, error: createError} = await supabaseAdmin
            .from('students')
            .insert(studentData)
            .select()
            .single()

        if (createError) {
            console.error('❌ Error creating student in Supabase:', createError)
            return NextResponse.json({
                success: false,
                error: 'Failed to create student in Supabase: ' + createError.message
            }, {status: 500})
        }

        console.log('✅ Student profile created in Supabase')

        // 4. Try to create in local DB (Prisma) - with error handling
        try {
            await prisma.students.create({
                data: studentData
            })
            console.log('✅ Student profile created in Local DB')
        } catch (prismaError: any) {
            console.warn('⚠️ Could not create in Local DB (but Supabase is OK):', prismaError.message)
            // Continue - Supabase is the primary source
        }

        return NextResponse.json({
            success: true,
            message: 'Student profile created successfully',
            student_id: user_id,
            user: user
        })

    } catch (error: any) {
        console.error('❌ Error in fix-student API:', error)
        return NextResponse.json({
            success: false,
            error: error.message || 'Internal server error'
        }, {status: 500})
    }
}
