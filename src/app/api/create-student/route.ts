import {NextRequest, NextResponse} from 'next/server'
import {supabaseAdmin} from '@/lib/supabase'

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

        // Check if student already exists
        const {data: existingStudent, error: checkError} = await supabaseAdmin
            .from('students')
            .select('user_id')
            .eq('user_id', user_id)
            .single()

        if (existingStudent) {
            return NextResponse.json({
                success: true,
                message: 'Student profile already exists',
                student_id: existingStudent.user_id
            })
        }

        // Create new student profile
        const {data: newStudent, error: createError} = await supabaseAdmin
            .from('students')
            .insert({
                user_id: user_id,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .select()
            .single()

        if (createError) {
            console.error('❌ Error creating student:', createError)
            return NextResponse.json({
                success: false,
                error: 'Failed to create student profile: ' + createError.message
            }, {status: 500})
        }

        console.log('✅ Student profile created:', newStudent)

        return NextResponse.json({
            success: true,
            message: 'Student profile created successfully',
            student_id: user_id
        })

    } catch (error: any) {
        console.error('❌ Error in create-student API:', error)
        return NextResponse.json({
            success: false,
            error: error.message || 'Internal server error'
        }, {status: 500})
    }
}
