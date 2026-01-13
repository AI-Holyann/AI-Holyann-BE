import {NextRequest, NextResponse} from 'next/server';
import {prisma} from '@/lib/prisma';

/**
 * POST /api/ai/predict-mbti
 * Call AI model to predict MBTI and update database
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {test_id} = body;

        if (!test_id) {
            return NextResponse.json({
                success: false,
                error: 'Missing test_id'
            }, {status: 400});
        }

        console.log('🤖 [AI Predict MBTI] Starting prediction for test:', test_id);

        // Get test data from database
        const test = await prisma.mbti_tests.findUnique({
            where: {id: test_id}
        });

        if (!test) {
            return NextResponse.json({
                success: false,
                error: 'Test not found'
            }, {status: 404});
        }

        // Type check and validate answers
        if (!test.answers || !Array.isArray(test.answers) || test.answers.length !== 60) {
            return NextResponse.json({
                success: false,
                error: 'Invalid test data: missing or incomplete answers'
            }, {status: 400});
        }

        // Convert Prisma.JsonArray to number[]
        const mbtiAnswersArray: number[] = test.answers.map((val: any) => {
            const num = Number(val);
            return isNaN(num) ? 0 : Math.max(-3, Math.min(3, num));
        });

        // Prepare data for AI server
        // Note: We need to send dummy GRIT and RIASEC data since AI expects all three
        const aiPayload = {
            mbti_answers: mbtiAnswersArray,
            grit_answers: Object.fromEntries(Array.from({length: 12}, (_, i) => [i + 1, 3])),
            riasec_answers: Object.fromEntries(Array.from({length: 48}, (_, i) => [i + 1, 3])),
            top_n: 0, // We don't need career recommendations
            min_match_score: 100 // Set high to skip career matching
        };

        console.log('📤 [AI Predict MBTI] Calling AI server...');

        // Call AI server using centralized client
        const { callCareerAssessment } = await import('@/lib/ai-api-client');
        
        let aiResult;
        try {
            aiResult = await callCareerAssessment(aiPayload);
        } catch (error: any) {
            console.error('❌ [AI Predict MBTI] AI server error:', error);
            return NextResponse.json({
                success: false,
                error: 'AI server error',
                details: error.message || 'Unknown error'
            }, {status: 500});
        }

        if (!aiResult.success || !aiResult.assessment?.mbti) {
            return NextResponse.json({
                success: false,
                error: 'Invalid AI response',
                details: aiResult
            }, {status: 500});
        }

        const mbtiResult = aiResult.assessment.mbti;
        
        // Parse dimension scores from AI response
        // AI returns individual trait probabilities (0.0 to 1.0) for each of 8 traits:
        // { "E": 0.313, "I": 0.687, "S": 0.177, "N": 0.823, "T": 0.816, "F": 0.184, "J": 0.795, "P": 0.205 }
        const dimensions = mbtiResult.dimension_scores;

        // Convert probabilities (0-1) to percentages (0-100) and round
        const detailedScores = {
            E: Math.round((dimensions.E || 0) * 100),
            I: Math.round((dimensions.I || 0) * 100),
            S: Math.round((dimensions.S || 0) * 100),
            N: Math.round((dimensions.N || 0) * 100),
            T: Math.round((dimensions.T || 0) * 100),
            F: Math.round((dimensions.F || 0) * 100),
            J: Math.round((dimensions.J || 0) * 100),
            P: Math.round((dimensions.P || 0) * 100)
        };

        // Update database with AI prediction
        await prisma.mbti_tests.update({
            where: {id: test_id},
            data: {
                result_type: mbtiResult.personality_type,
                score_e: detailedScores.E,
                score_i: detailedScores.I,
                score_s: detailedScores.S,
                score_n: detailedScores.N,
                score_t: detailedScores.T,
                score_f: detailedScores.F,
                score_j: detailedScores.J,
                score_p: detailedScores.P,
                updated_at: new Date()
            }
        });

        console.log('✅ [AI Predict MBTI] Result saved:', {
            type: mbtiResult.personality_type,
            confidence: mbtiResult.confidence,
            scores: detailedScores
        });

        // Return response matching career-assessment format exactly
        return NextResponse.json({
            success: true,
            result: {
                personality_type: mbtiResult.personality_type,
                confidence: mbtiResult.confidence,
                dimension_scores: dimensions, // Raw AI scores (-1 to 1)
                scores: detailedScores, // Percentage scores (0-100)
                percentages: detailedScores // Alias for compatibility
            }
        });

    } catch (error) {
        console.error('❌ [AI Predict MBTI] Error:', error);
        return NextResponse.json({
            success: false,
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, {status: 500});
    }
}
