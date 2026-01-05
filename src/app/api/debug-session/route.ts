import {NextRequest, NextResponse} from 'next/server'

export async function GET(request: NextRequest) {
    try {
        const cookies = request.cookies
        const authToken = cookies.get('auth-token')

        return NextResponse.json({
            success: true,
            cookies: {
                'auth-token': authToken?.value ? 'Present' : 'Not found'
            },
            message: 'Debug info retrieved'
        })
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, {status: 500})
    }
}