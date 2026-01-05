import {NextRequest, NextResponse} from 'next/server'

export async function GET() {
    try {
        // Test basic Prisma connection
        const {prisma} = await import('@/lib/prisma')

        console.log('🔍 Testing Prisma connection...')

        // Simple query to test connection
        const userCount = await prisma.users.count()

        return NextResponse.json({
            success: true,
            message: 'Prisma connection successful',
            userCount
        })
    } catch (error: any) {
        console.error('❌ Prisma test error:', error)
        return NextResponse.json({
            success: false,
            error: error.message,
            stack: error.stack
        }, {status: 500})
    }
}
