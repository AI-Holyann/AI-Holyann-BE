import {NextRequest, NextResponse} from 'next/server'
import {JWTService} from '@/lib/services/jwt.service'
import {DatabaseService} from '@/lib/services/database.service'

/**
 * GET /api/auth/session
 * Lấy thông tin session từ token
 */
export async function GET(request: NextRequest) {
    try {
        // Lấy token từ header Authorization hoặc cookie
        const authHeader = request.headers.get('Authorization')
        const token = authHeader?.replace('Bearer ', '') || request.cookies.get('auth-token')?.value

        if (!token) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Không tìm thấy token xác thực'
                },
                {status: 401}
            )
        }

        // Xác thực token
        const payload = JWTService.verifyToken(token)
        if (!payload) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Token không hợp lệ hoặc đã hết hạn'
                },
                {status: 401}
            )
        }

        // Lấy thông tin user từ database
        const user = await DatabaseService.findUserById(payload.userId)
        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Người dùng không tồn tại'
                },
                {status: 404}
            )
        }

        // Lấy thông tin student nếu user có role STUDENT
        let studentInfo = null
        if (user.role === 'STUDENT') {
            try {
                const {prisma} = await import('@/lib/prisma')
                const student = await prisma.students.findUnique({
                    where: {user_id: user.id}
                })

                if (student) {
                    studentInfo = {
                        current_school: student.current_school,
                        current_grade: student.current_grade,
                        intended_major: student.intended_major,
                        target_country: student.target_country,
                        assessments_completed: student.assessments_completed
                    }
                }
            } catch (error) {
                console.warn('⚠️ Could not fetch student info:', error)
            }
        }

        // Trả về thông tin session đầy đủ
        return NextResponse.json({
            success: true,
            token,
            user: {
                id: user.id,
                user_id: user.id,  // Alias cho compatibility
                email: user.email,
                full_name: user.full_name,
                name: user.full_name,  // NextAuth compatibility
                role: user.role,
                avatar_url: user.avatar_url,
                image: user.avatar_url,  // NextAuth compatibility
                phone_number: user.phone_number,
                auth_provider: user.auth_provider,
                is_active: user.is_active,
                created_at: user.created_at
            },
            student: studentInfo,
            session: {
                user: {
                    id: user.id,
                    user_id: user.id,
                    email: user.email,
                    name: user.full_name,
                    full_name: user.full_name,
                    role: user.role,
                    image: user.avatar_url,
                    accessToken: token
                },
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
            }
        })

    } catch (error) {
        console.error('❌ Error in session API:', error)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json(
            {
                success: false,
                message: 'Đã xảy ra lỗi khi lấy thông tin session',
                error: errorMessage
            },
            {status: 500}
        )
    }
}

