import {NextRequest, NextResponse} from 'next/server';
import {prisma} from '@/lib/prisma';
import {calculateMBTIResult} from '@/data/mbti-questions';
import {calculateRIASECResult} from '@/data/riasec-questions';
import {calculateGritResult} from '@/data/grit-questions';

// ===========================================
// POST /api/tests/submit - Submit all answers at once
// ===========================================
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {test_id, student_id, test_type, answers} = body;

        // Validation
        if (!test_id || !student_id || !test_type || !answers) {
            return NextResponse.json({
                success: false,
                error: 'Missing required fields: test_id, student_id, test_type, answers'
            }, {status: 400});
        }

        if (!['mbti', 'riasec', 'grit'].includes(test_type)) {
            return NextResponse.json({
                success: false,
                error: 'Invalid test_type'
            }, {status: 400});
        }

        console.log('📝 [Submit Test] Submitting test:', {
            test_id,
            student_id,
            test_type,
            answersCount: Object.keys(answers).length
        });

        let result;

        switch (test_type) {
            case 'mbti':
                result = await submitMBTITest(test_id, student_id, answers);
                break;
            case 'riasec':
                result = await submitRIASECTest(test_id, student_id, answers);
                break;
            case 'grit':
                result = await submitGritTest(test_id, student_id, answers);
                break;
            default:
                return NextResponse.json({
                    success: false,
                    error: `Invalid test type: ${test_type}`
                }, {status: 400});
        }

        if (!result || !result.success) {
            return NextResponse.json(result, {status: 400});
        }

        console.log('✅ [Submit Test] Test completed successfully:', test_type);

        return NextResponse.json({
            success: true,
            message: 'Test submitted and completed successfully',
            result: result.data
        });

    } catch (error) {
        console.error('❌ [Submit Test] Error:', error);
        return NextResponse.json({
            success: false,
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, {status: 500});
    }
}

// ===========================================
// Submit MBTI Test
// ===========================================
async function submitMBTITest(test_id: string, student_id: string, answers: Record<number, number>) {
    // Validate answers count
    const answersCount = Object.keys(answers).length;
    if (answersCount !== 60) {
        return {
            success: false,
            error: `MBTI test requires 60 answers, received ${answersCount}`
        };
    }

    // Validate answer range (-3 to 3 from UI)
    for (const [key, value] of Object.entries(answers)) {
        if (value < -3 || value > 3) {
            return {
                success: false,
                error: `MBTI answer must be between -3 and 3, received ${value} for question ${key}`
            };
        }
    }

    // Convert to array format for database (0-indexed)
    const answersArray: number[] = [];
    for (let i = 1; i <= 60; i++) {
        answersArray.push(answers[i] || 0);
    }

    // Note: We don't calculate MBTI result here anymore
    // The accurate MBTI type will be predicted by AI model in career-assessment API
    // We only store the answers for later AI processing

    // Update database - save answers only, result will come from AI
    await prisma.mbti_tests.update({
        where: {id: test_id},
        data: {
            answers: answersArray,
            status: 'COMPLETED',
            result_type: null, // Will be updated by AI model
            score_e: null,
            score_i: null,
            score_s: null,
            score_n: null,
            score_t: null,
            score_f: null,
            score_j: null,
            score_p: null,
            current_step: 60,
            updated_at: new Date()
        }
    });

    console.log('✅ [MBTI] Answers saved, waiting for AI prediction');

    return {
        success: true,
        data: {
            message: 'Answers saved successfully. MBTI result will be calculated by AI.',
            answers_count: answersArray.length
        }
    };
}

// ===========================================
// Submit RIASEC Test
// ===========================================
async function submitRIASECTest(test_id: string, student_id: string, answers: Record<number, number>) {
    // Validate answers count
    const answersCount = Object.keys(answers).length;
    if (answersCount !== 48) {
        return {
            success: false,
            error: `RIASEC test requires 48 answers, received ${answersCount}`
        };
    }

    // Validate answer range (1 to 5)
    for (const [key, value] of Object.entries(answers)) {
        if (value < 1 || value > 5) {
            return {
                success: false,
                error: `RIASEC answer must be between 1 and 5, received ${value} for question ${key}`
            };
        }
    }

    // Convert to object format for database (string keys)
    const answersObject: Record<string, number> = {};
    for (let i = 1; i <= 48; i++) {
        answersObject[i.toString()] = answers[i] || 1;
    }

    // Call AI Server for accurate RIASEC calculation
    console.log('🔄 [RIASEC] Calling AI server for calculation...');
    
    try {
        const aiResponse = await fetch('http://localhost:8000/hoexapp/api/riasec-result/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                riasec_answers: answers
            })
        });

        if (aiResponse.ok) {
            const aiResult = await aiResponse.json();
            
            if (aiResult.success) {
                console.log('✅ [RIASEC] AI calculation successful:', {
                    code: aiResult.riasec.code,
                    scores: aiResult.riasec.scores
                });

                // Update database with AI results (raw scores 8-40)
                await prisma.riasec_tests.update({
                    where: {id: test_id},
                    data: {
                        answers: answersObject,
                        status: 'COMPLETED',
                        result_code: aiResult.riasec.code,
                        score_realistic: aiResult.riasec.scores.Realistic,
                        score_investigative: aiResult.riasec.scores.Investigative,
                        score_artistic: aiResult.riasec.scores.Artistic,
                        score_social: aiResult.riasec.scores.Social,
                        score_enterprising: aiResult.riasec.scores.Enterprising,
                        score_conventional: aiResult.riasec.scores.Conventional,
                        top_3_types: aiResult.riasec.top3.map(([category, _]: [string, number]) => category),
                        current_step: 48,
                        updated_at: new Date()
                    }
                });

                return {
                    success: true,
                    data: {
                        result_code: aiResult.riasec.code,
                        scores: aiResult.riasec.scores,
                        top_3: aiResult.riasec.top3.map(([category, score]: [string, number]) => ({
                            category,
                            score,
                            info: {
                                name: category,
                                name_vi: category
                            }
                        }))
                    }
                };
            }
        }
        
        console.warn('⚠️ [RIASEC] AI server failed, using local fallback calculation');
    } catch (error) {
        console.error('❌ [RIASEC] AI server error:', error);
        console.log('🔄 [RIASEC] Using local fallback calculation');
    }

    // Fallback: Calculate results locally using boolean conversion
    const booleanAnswers: Record<number, boolean> = {};
    for (let i = 1; i <= 48; i++) {
        booleanAnswers[i] = (answers[i] || 1) >= 4;
    }

    const calculatedResult = calculateRIASECResult(booleanAnswers);

    console.log('📊 [RIASEC] Local calculation:', {
        result_code: calculatedResult.hollandCode,
        scores: calculatedResult.scores,
        percentages: calculatedResult.percentages
    });

    // Update database with local calculation (percentages 0-100)
    await prisma.riasec_tests.update({
        where: {id: test_id},
        data: {
            answers: answersObject,
            status: 'COMPLETED',
            result_code: calculatedResult.hollandCode,
            score_realistic: calculatedResult.percentages.R,
            score_investigative: calculatedResult.percentages.I,
            score_artistic: calculatedResult.percentages.A,
            score_social: calculatedResult.percentages.S,
            score_enterprising: calculatedResult.percentages.E,
            score_conventional: calculatedResult.percentages.C,
            top_3_types: calculatedResult.topThree.map(t => t.category),
            current_step: 48,
            updated_at: new Date()
        }
    });

    console.log('✅ [RIASEC] Calculated result (fallback):', calculatedResult.hollandCode);

    return {
        success: true,
        data: {
            result_code: calculatedResult.hollandCode,
            scores: calculatedResult.percentages,
            top_3: calculatedResult.topThree
        }
    };
}

// ===========================================
// Submit GRIT Test
// ===========================================
async function submitGritTest(test_id: string, student_id: string, answers: Record<number, number>) {
    // Validate answers count
    const answersCount = Object.keys(answers).length;
    if (answersCount !== 12) {
        return {
            success: false,
            error: `GRIT test requires 12 answers, received ${answersCount}`
        };
    }

    // Validate answer range (1 to 5)
    for (const [key, value] of Object.entries(answers)) {
        if (value < 1 || value > 5) {
            return {
                success: false,
                error: `GRIT answer must be between 1 and 5, received ${value} for question ${key}`
            };
        }
    }

    // Convert to object format for database (string keys)
    const answersObject: Record<string, number> = {};
    for (let i = 1; i <= 12; i++) {
        answersObject[i.toString()] = answers[i] || 1;
    }

    // Calculate results
    const calculatedResult = calculateGritResult(answers);

    // Update database
    await prisma.grit_tests.update({
        where: {id: test_id},
        data: {
            answers: answersObject,
            status: 'COMPLETED',
            total_score: calculatedResult.gritScore,
            passion_score: calculatedResult.passionScore,
            perseverance_score: calculatedResult.perseveranceScore,
            level: calculatedResult.level.level,
            description: calculatedResult.level.description,
            current_step: 12,
            updated_at: new Date()
        }
    });

    console.log('✅ [GRIT] Calculated result:', calculatedResult.level.level);

    return {
        success: true,
        data: {
            total_score: calculatedResult.gritScore,
            passion_score: calculatedResult.passionScore,
            perseverance_score: calculatedResult.perseveranceScore,
            level: calculatedResult.level.level,
            description: calculatedResult.level.description
        }
    };
}

