import {NextRequest, NextResponse} from 'next/server'
import {AuthService} from '@/lib/services/auth.service'
import {LoginData} from '@/lib/types/auth.types'

export async function POST(request: NextRequest) {
    try {
        const body: LoginData = await request.json()

        // Validation
        if (!body.email || !body.password) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Vui lòng điền đầy đủ thông tin'
                },
                {status: 400}
            )
        }

        const result = await AuthService.login(body)

        if (!result.success) {
            return NextResponse.json(result, {status: 401})
        }

        // Create response with enhanced user data
        const response = NextResponse.json({
            success: true,
            message: result.message,
            token: result.token,
            user: {
                id: result.user!.id,
                user_id: result.user!.id,  // Alias for compatibility
                email: result.user!.email,
                full_name: result.user!.full_name,
                name: result.user!.full_name,  // NextAuth compatibility
                role: result.user!.role,
                avatar_url: result.user!.avatar_url,
                image: result.user!.avatar_url  // NextAuth compatibility
            },
            session: {
                user: {
                    id: result.user!.id,
                    user_id: result.user!.id,
                    email: result.user!.email,
                    name: result.user!.full_name,
                    full_name: result.user!.full_name,
                    role: result.user!.role,
                    image: result.user!.avatar_url,
                    accessToken: result.token
                }
            }
        }, {status: 200})

        // Set HTTP-only cookie for token (optional, for server-side auth)
        response.cookies.set('auth-token', result.token!, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7 // 7 days
        })

        return response
    } catch (error) {
        console.error('Error in login API:', error)
        return NextResponse.json(
            {
                success: false,
                message: 'Đã xảy ra lỗi server'
            },
            {status: 500}
        )
    }
}
