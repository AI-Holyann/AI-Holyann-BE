// filepath: d:\holyann-ai-web\src\app\api\tests\results\[student_id]\route.ts
import {NextRequest, NextResponse} from 'next/server';
import {prisma} from '@/lib/prisma';

// ===========================================
// GET /api/tests/results/[student_id] - Lấy kết quả tổng hợp
// ===========================================
export async function GET(
    request: NextRequest,
    {params}: { params: Promise<{ student_id: string }> }
) {
    try {
        const {student_id} = await params;

        // Lấy tất cả kết quả
        const [mbti, riasec, grit, student] = await Promise.all([
            prisma.mbti_tests.findUnique({where: {student_id}}),
            prisma.riasec_tests.findUnique({where: {student_id}}),
            prisma.grit_tests.findUnique({where: {student_id}}),
            prisma.students.findUnique({where: {user_id: student_id}})
        ]);

        if (!student) {
            return NextResponse.json({
                success: false,
                error: 'Student not found'
            }, {status: 404});
        }

        const mbtiCompleted = mbti?.status === 'COMPLETED';
        const riasecCompleted = riasec?.status === 'COMPLETED';
        const gritCompleted = grit?.status === 'COMPLETED';
        const allCompleted = mbtiCompleted && riasecCompleted && gritCompleted;

        return NextResponse.json({
            success: true,
            student_id,
            progress: {
                mbti: mbti ? {status: mbti.status, current_step: mbti.current_step} : null,
                riasec: riasec ? {status: riasec.status, current_step: riasec.current_step} : null,
                grit: grit ? {status: grit.status, current_step: grit.current_step} : null,
                completed_count: [mbtiCompleted, riasecCompleted, gritCompleted].filter(Boolean).length,
                all_completed: allCompleted
            },
            results: {
                mbti: mbtiCompleted ? {
                    result_type: mbti!.result_type,
                    scores: {
                        E: mbti!.score_e, I: mbti!.score_i,
                        S: mbti!.score_s, N: mbti!.score_n,
                        T: mbti!.score_t, F: mbti!.score_f,
                        J: mbti!.score_j, P: mbti!.score_p
                    },
                    completed_at: mbti!.completed_at
                } : null,
                riasec: riasecCompleted ? {
                    result_code: riasec!.result_code,
                    scores: {
                        R: riasec!.score_realistic,
                        I: riasec!.score_investigative,
                        A: riasec!.score_artistic,
                        S: riasec!.score_social,
                        E: riasec!.score_enterprising,
                        C: riasec!.score_conventional
                    },
                    top_3: riasec!.top_3_types,
                    completed_at: riasec!.completed_at
                } : null,
                grit: gritCompleted ? {
                    total_score: grit!.total_score,
                    level: grit!.level,
                    description: grit!.description,
                    completed_at: grit!.completed_at
                } : null
            }
        });

    } catch (error) {
        console.error('Error getting results:', error);
        return NextResponse.json({
            success: false,
            error: 'Internal server error'
        }, {status: 500});
    }
}

