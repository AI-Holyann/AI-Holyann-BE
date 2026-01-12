// filepath: d:\holyann-ai-web\src\app\api\tests\[test_type]\[student_id]\route.ts
import {NextRequest, NextResponse} from 'next/server';
import {prisma} from '@/lib/prisma';
import {MBTI_QUESTIONS_SORTED} from '@/data/mbti-questions';
import {RIASEC_QUESTIONS_V2} from '@/data/riasec-questions';
import {GRIT_QUESTIONS_SORTED} from '@/data/grit-questions';

// ===========================================
// GET /api/tests/[test_type]/[student_id] - Lấy tiến trình test
// ===========================================
export async function GET(
    request: NextRequest,
    {params}: { params: Promise<{ test_type: string; student_id: string }> }
) {
    try {
        const {test_type, student_id} = await params;

        if (!['mbti', 'riasec', 'grit'].includes(test_type)) {
            return NextResponse.json({
                success: false,
                error: 'Invalid test_type'
            }, {status: 400});
        }

        const test = await findTest(test_type, student_id);

        if (!test) {
            return NextResponse.json({
                success: false,
                error: 'Test not found. Start a new test first.'
            }, {status: 404});
        }

        return NextResponse.json({
            success: true,
            test_id: test.id,
            status: test.status,
            current_step: test.current_step,
            total_questions: getTotalQuestions(test_type),
            answers: test.answers,
            questions: getQuestions(test_type),
            // Kết quả nếu đã hoàn thành
            result: test.status === 'COMPLETED' ? getTestResult(test_type, test) : null
        });

    } catch (error) {
        console.error('Error getting test progress:', error);
        return NextResponse.json({
            success: false,
            error: 'Internal server error'
        }, {status: 500});
    }
}

// ===========================================
// HELPER FUNCTIONS
// ===========================================
async function findTest(test_type: string, student_id: string) {
    switch (test_type) {
        case 'mbti':
            return await prisma.mbti_tests.findUnique({where: {student_id}});
        case 'riasec':
            return await prisma.riasec_tests.findUnique({where: {student_id}});
        case 'grit':
            return await prisma.grit_tests.findUnique({where: {student_id}});
        default:
            return null;
    }
}

function getTotalQuestions(test_type: string): number {
    switch (test_type) {
        case 'mbti':
            return 60;
        case 'riasec':
            return 48;
        case 'grit':
            return 12;
        default:
            return 0;
    }
}

function getQuestions(test_type: string): any[] {
    switch (test_type) {
        case 'mbti':
            return MBTI_QUESTIONS_SORTED.map(q => ({id: q.id, text: q.text, dimension: q.dimension}));
        case 'riasec':
            return RIASEC_QUESTIONS_V2.map(q => ({id: q.id, text: q.text, category: q.category}));
        case 'grit':
            return GRIT_QUESTIONS_SORTED.map(q => ({
                id: q.id,
                text: q.text,
                component: q.component,
                reverse: q.reverse
            }));
        default:
            return [];
    }
}

function getTestResult(test_type: string, test: any) {
    switch (test_type) {
        case 'mbti':
            return {
                result_type: test.result_type,
                scores: {
                    E: test.score_e, I: test.score_i,
                    S: test.score_s, N: test.score_n,
                    T: test.score_t, F: test.score_f,
                    J: test.score_j, P: test.score_p
                }
            };
        case 'riasec':
            return {
                result_code: test.result_code,
                scores: {
                    R: test.score_realistic,
                    I: test.score_investigative,
                    A: test.score_artistic,
                    S: test.score_social,
                    E: test.score_enterprising,
                    C: test.score_conventional
                },
                top_3: test.top_3_types
            };
        case 'grit':
            return {
                total_score: test.total_score,
                level: test.level,
                description: test.description
            };
        default:
            return null;
    }
}

