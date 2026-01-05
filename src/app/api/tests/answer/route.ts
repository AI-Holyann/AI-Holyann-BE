// filepath: d:\holyann-ai-web\src\app\api\tests\answer\route.ts
import {NextRequest, NextResponse} from 'next/server';
import {prisma} from '@/lib/prisma';

// ===========================================
// POST /api/tests/answer - Lưu câu trả lời
// ===========================================
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {test_id, test_type, question_number, answer} = body;

        // Validation
        if (!test_id || !test_type || question_number === undefined || answer === undefined) {
            return NextResponse.json({
                success: false,
                error: 'Missing required fields: test_id, test_type, question_number, answer'
            }, {status: 400});
        }

        if (!['mbti', 'riasec', 'grit'].includes(test_type)) {
            return NextResponse.json({
                success: false,
                error: 'Invalid test_type'
            }, {status: 400});
        }

        // Validate answer range
        if (test_type === 'mbti' && (answer < -3 || answer > 3)) {
            return NextResponse.json({
                success: false,
                error: 'MBTI answer must be between -3 and 3'
            }, {status: 400});
        }

        if (test_type === 'riasec' && (answer < 1 || answer > 5)) {
            return NextResponse.json({
                success: false,
                error: 'RIASEC answer must be between 1 and 5'
            }, {status: 400});
        }

        if (test_type === 'grit' && (answer < 1 || answer > 5)) {
            return NextResponse.json({
                success: false,
                error: 'GRIT answer must be between 1 and 5'
            }, {status: 400});
        }

        const nextStep = question_number + 1;
        const totalQuestions = getTotalQuestions(test_type);
        const isCompleted = nextStep >= totalQuestions;

        switch (test_type) {
            case 'mbti':
                const mbtiTest = await prisma.mbti_tests.findUnique({where: {id: test_id}});
                if (!mbtiTest) {
                    return NextResponse.json({success: false, error: 'Test not found'}, {status: 404});
                }
                // MBTI: Array of 60 numbers from -3 to 3
                const mbtiAnswers = (mbtiTest.answers as number[]) || new Array(60).fill(0);
                mbtiAnswers[question_number] = answer;

                await prisma.mbti_tests.update({
                    where: {id: test_id},
                    data: {
                        answers: mbtiAnswers,
                        current_step: nextStep,
                        updated_at: new Date()
                    }
                });
                break;

            case 'riasec':
                const riasecTest = await prisma.riasec_tests.findUnique({where: {id: test_id}});
                if (!riasecTest) {
                    return NextResponse.json({success: false, error: 'Test not found'}, {status: 404});
                }
                // RIASEC: Object with keys "1"-"48", values 1-5
                const riasecAnswers = (riasecTest.answers as Record<string, number>) || {};
                riasecAnswers[String(question_number + 1)] = answer;

                await prisma.riasec_tests.update({
                    where: {id: test_id},
                    data: {
                        answers: riasecAnswers,
                        current_step: nextStep,
                        updated_at: new Date()
                    }
                });
                break;

            case 'grit':
                const gritTest = await prisma.grit_tests.findUnique({where: {id: test_id}});
                if (!gritTest) {
                    return NextResponse.json({success: false, error: 'Test not found'}, {status: 404});
                }
                // GRIT: Object with keys "1"-"12", values 1-5
                const gritAnswers = (gritTest.answers as Record<string, number>) || {};
                gritAnswers[String(question_number + 1)] = answer;

                await prisma.grit_tests.update({
                    where: {id: test_id},
                    data: {
                        answers: gritAnswers,
                        current_step: nextStep,
                        updated_at: new Date()
                    }
                });
                break;
        }

        return NextResponse.json({
            success: true,
            current_step: nextStep,
            total_questions: totalQuestions,
            is_completed: isCompleted,
            message: isCompleted ? 'Test completed! Call /api/tests/complete to get results.' : 'Answer saved'
        });

    } catch (error) {
        console.error('Error saving answer:', error);
        return NextResponse.json({
            success: false,
            error: 'Internal server error'
        }, {status: 500});
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
