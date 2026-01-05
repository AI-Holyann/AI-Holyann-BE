// filepath: d:\holyann-ai-web\src\app\api\tests\career\[student_id]\route.ts
import {NextRequest, NextResponse} from 'next/server';
import {prisma} from '@/lib/prisma';

// ===========================================
// GET /api/tests/career/[student_id] - Lấy gợi ý nghề nghiệp
// ===========================================
export async function GET(
    request: NextRequest,
    {params}: { params: Promise<{ student_id: string }> }
) {
    try {
        const {student_id} = await params;

        // Kiểm tra student tồn tại
        const student = await prisma.students.findUnique({
            where: {user_id: student_id}
        });

        if (!student) {
            return NextResponse.json({
                success: false,
                error: 'Student not found'
            }, {status: 404});
        }

        // Kiểm tra đã hoàn thành tất cả tests chưa
        if (!student.assessments_completed) {
            return NextResponse.json({
                success: false,
                error: 'Please complete all tests (MBTI, RIASEC, GRIT) first'
            }, {status: 400});
        }

        // Lấy career recommendations
        const recommendations = await prisma.career_matches.findMany({
            where: {student_id},
            orderBy: {match_percentage: 'desc'}
        });

        return NextResponse.json({
            success: true,
            student_id,
            recommendations: recommendations.map(rec => ({
                id: rec.id,
                job_title: rec.job_title,
                match_percentage: rec.match_percentage,
                reasoning: rec.reasoning,
                created_at: rec.created_at
            })),
            total: recommendations.length
        });

    } catch (error) {
        console.error('Error getting career recommendations:', error);
        return NextResponse.json({
            success: false,
            error: 'Internal server error'
        }, {status: 500});
    }
}

