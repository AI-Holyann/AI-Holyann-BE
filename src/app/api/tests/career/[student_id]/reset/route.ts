import {NextRequest, NextResponse} from 'next/server';
import {prisma} from '@/lib/prisma';
import type {CareerAssessmentOutput} from '@/lib/schemas/career-assessment.schema';

// ===========================================
// DELETE /api/tests/career/[student_id]/reset - Xóa và tạo lại career recommendations
// ===========================================
export async function DELETE(
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

        // Xóa career_matches cũ
        const deleteResult = await prisma.career_matches.deleteMany({
            where: {student_id}
        });

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
        let careerRecommendations: any[] = [];
        try {
            const aiResponse = await callAICareerAssessment(
                mbtiTest.answers,
                riasecTest.answers,
                gritTest.answers
            );

            // Type guard: kiểm tra success và recommendations tồn tại
            if (aiResponse.success && 'recommendations' in aiResponse && Array.isArray(aiResponse.recommendations) && aiResponse.recommendations.length > 0) {
                // Tạo map từ job title -> job_field (nhóm ngành) từ career_groups
                const jobFieldMap = new Map<string, string>()
                if ('career_groups' in aiResponse && aiResponse.career_groups) {
                    for (const [groupName, groupRecs] of Object.entries(aiResponse.career_groups)) {
                        for (const rec of groupRecs as any[]) {
                            jobFieldMap.set(rec.title || rec.name, groupName)
                        }
                    }
                }

                // Lưu career_matches mới với job_field (group name từ career_groups)
                const careerMatches = aiResponse.recommendations.map((rec: any) => ({
                    id: crypto.randomUUID(),
                    student_id,
                    job_title: rec.title || rec.job_title,
                    match_percentage: rec.match_score || rec.match_percentage,
                    reasoning: rec.description || rec.reasoning,
                    job_field: jobFieldMap.get(rec.title || rec.job_title) || null // Group name từ career_groups
                }));

                try {
                    await prisma.career_matches.createMany({data: careerMatches});
                } catch (dbError: any) {
                    // Nếu lỗi do column job_field không tồn tại, thử lưu lại không có job_field
                    const errorMessage = dbError.message || String(dbError);
                    if (errorMessage.includes('job_field') || errorMessage.includes('does not exist')) {
                        const careerMatchesWithoutJobField = careerMatches.map(({ job_field, ...rest }) => rest);
                        await prisma.career_matches.createMany({data: careerMatchesWithoutJobField});
                    } else {
                        throw dbError;
                    }
                }

                careerRecommendations = aiResponse.recommendations;
            } else {
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
async function callAICareerAssessment(
    mbti_answers: unknown, 
    riasec_answers: unknown, 
    grit_answers: unknown
): Promise<CareerAssessmentOutput | {success: false, error: string}> {
    try {
        const { callCareerAssessment } = await import('@/lib/ai-api-client');
        
        // Transform answers to expected format
        const mbtiArray = Array.isArray(mbti_answers) 
            ? mbti_answers.map(a => Math.max(-3, Math.min(3, Number(a) || 0)))
            : new Array(60).fill(0);
        
        const gritObj: Record<string, number> = {};
        if (typeof grit_answers === 'object' && grit_answers !== null) {
            for (let i = 1; i <= 12; i++) {
                const key = i.toString();
                const value = (grit_answers as any)[i] || (grit_answers as any)[key] || 3;
                gritObj[key] = Math.max(1, Math.min(5, Number(value)));
            }
        } else {
            for (let i = 1; i <= 12; i++) {
                gritObj[i.toString()] = 3;
            }
        }
        
        const riasecObj: Record<string, number> = {};
        if (typeof riasec_answers === 'object' && riasec_answers !== null) {
            for (let i = 1; i <= 48; i++) {
                const key = i.toString();
                const value = (riasec_answers as any)[i] || (riasec_answers as any)[key];
                if (typeof value === 'boolean') {
                    riasecObj[key] = value ? 5 : 1;
                } else {
                    riasecObj[key] = Math.max(1, Math.min(5, Number(value) || 3));
                }
            }
        } else {
            for (let i = 1; i <= 48; i++) {
                riasecObj[i.toString()] = 3;
            }
        }
        
        return await callCareerAssessment({
            mbti_answers: mbtiArray,
            grit_answers: gritObj,
            riasec_answers: riasecObj,
            top_n: 10,
            min_match_score: 50.0
        });
    } catch (error) {
        console.error('AI API Error:', error);
        return {success: false, error: 'AI API unavailable'};
    }
}
