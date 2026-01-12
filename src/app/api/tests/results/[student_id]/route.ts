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
                mbti: mbtiCompleted && mbti ? {
                    result_type: mbti.result_type || null,
                    scores: {
                        E: mbti.score_e ?? 0, I: mbti.score_i ?? 0,
                        S: mbti.score_s ?? 0, N: mbti.score_n ?? 0,
                        T: mbti.score_t ?? 0, F: mbti.score_f ?? 0,
                        J: mbti.score_j ?? 0, P: mbti.score_p ?? 0
                    },
                    completed_at: mbti.completed_at || null
                } : null,
                riasec: riasecCompleted && riasec ? {
                    result_code: riasec.result_code || null,
                    scores: {
                        R: riasec.score_realistic ?? 0,
                        I: riasec.score_investigative ?? 0,
                        A: riasec.score_artistic ?? 0,
                        S: riasec.score_social ?? 0,
                        E: riasec.score_enterprising ?? 0,
                        C: riasec.score_conventional ?? 0
                    },
                    top_3: riasec.top_3_types || null,
                    completed_at: riasec.completed_at || null
                } : null,
                grit: gritCompleted && grit ? {
                    total_score: grit.total_score ?? 0,
                    passion_score: grit.passion_score ?? 0,
                    perseverance_score: grit.perseverance_score ?? 0,
                    level: grit.level || null,
                    description: grit.description || null,
                    completed_at: grit.completed_at || null
                } : null
            }
        });

    } catch (error) {
        console.error('❌ [Results API] Error getting results:', error);
        console.error('❌ [Results API] Error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
        });
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Internal server error'
        }, {status: 500});
    }
}

