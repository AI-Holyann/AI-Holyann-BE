import {NextRequest, NextResponse} from 'next/server';
import {prisma} from '@/lib/prisma';

const AI_API_URL = process.env.AI_API_URL || 'http://127.0.0.1:8000/hoexapp/api/career-assessment/';

// ===========================================
// DELETE /api/tests/career/[student_id]/reset - Xóa và tạo lại career recommendations
// ===========================================
export async function DELETE(
    request: NextRequest,
    {params}: { params: Promise<{ student_id: string }> }
) {
    try {
        const {student_id} = await params;

        console.log(`🔄 [Career Reset] Resetting career recommendations for student ${student_id}...`);

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

        // Xóa career_matches cũ
        const deleteResult = await prisma.career_matches.deleteMany({
            where: {student_id}
        });

        console.log(`🗑️ [Career Reset] Deleted ${deleteResult.count} old recommendations`);

        // Lấy test results
        const [mbtiTest, riasecTest, gritTest] = await Promise.all([
            prisma.mbti_tests.findUnique({where: {student_id}}),
            prisma.riasec_tests.findUnique({where: {student_id}}),
            prisma.grit_tests.findUnique({where: {student_id}})
        ]);

        if (!mbtiTest || !riasecTest || !gritTest) {
            return NextResponse.json({
                success: false,
                error: 'Missing test data'
            }, {status: 400});
        }

        // Gọi AI API để tạo recommendations mới
        console.log(`🤖 [Career Reset] Calling AI API to generate new recommendations...`);

        let careerRecommendations = [];
        try {
            const aiResponse = await callAICareerAssessment(
                mbtiTest.answers,
                riasecTest.answers,
                gritTest.answers
            );

            if (aiResponse.success && aiResponse.recommendations) {
                console.log(`✅ [Career Reset] AI returned ${aiResponse.recommendations.length} recommendations`);

                // Lưu career_matches mới
                const careerMatches = aiResponse.recommendations.map((rec: any) => ({
                    id: crypto.randomUUID(),
                    student_id,
                    job_title: rec.title || rec.job_title,
                    match_percentage: rec.match_score || rec.match_percentage,
                    reasoning: rec.description || rec.reasoning
                }));

                await prisma.career_matches.createMany({data: careerMatches});
                console.log(`💾 [Career Reset] Saved ${careerMatches.length} new recommendations`);

                careerRecommendations = aiResponse.recommendations;
            } else {
                console.warn('⚠️ [Career Reset] AI API returned no recommendations');
                return NextResponse.json({
                    success: false,
                    error: 'AI API returned no recommendations'
                }, {status: 500});
            }
        } catch (error) {
            console.error('❌ [Career Reset] Error calling AI API:', error);
            return NextResponse.json({
                success: false,
                error: 'Failed to generate new recommendations',
                details: error instanceof Error ? error.message : 'Unknown error'
            }, {status: 500});
        }

        return NextResponse.json({
            success: true,
            message: 'Career recommendations reset successfully',
            student_id,
            old_count: deleteResult.count,
            new_count: careerRecommendations.length,
            recommendations: careerRecommendations
        });

    } catch (error) {
        console.error('Error resetting career recommendations:', error);
        return NextResponse.json({
            success: false,
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, {status: 500});
    }
}

// ===========================================
// Call AI Career Assessment API
// ===========================================
async function callAICareerAssessment(mbti_answers: unknown, riasec_answers: unknown, grit_answers: unknown) {
    try {
        const response = await fetch(AI_API_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                mbti_answers,
                riasec_answers,
                grit_answers,
                top_n: 10,
                min_match_score: 50.0
            })
        });

        if (!response.ok) {
            console.error(`AI API returned ${response.status}`);
            return {success: false, error: `AI API returned ${response.status}`};
        }

        return await response.json();
    } catch (error) {
        console.error('AI API Error:', error);
        return {success: false, error: 'AI API unavailable'};
    }
}
