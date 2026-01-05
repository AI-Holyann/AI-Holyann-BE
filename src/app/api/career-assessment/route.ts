import {NextRequest, NextResponse} from 'next/server'

// Types for external API
interface ExternalCareerAssessmentRequest {
    mbti_answers: number[]
    grit_answers: Record<string, number>
    riasec_answers: Record<string, number>
    top_n?: number
    min_match_score?: number
}

interface ExternalCareerAssessmentResponse {
    success: boolean
    assessment: {
        mbti: {
            personality_type: string
            confidence: number
            dimension_scores: {
                E: number, I: number
                S: number, N: number
                T: number, F: number
                J: number, P: number
            }
        }
        grit: {
            score: number
            level: string
            description: string
        }
        riasec: {
            code: string
            scores: Record<string, number>
            top3: [string, number][]
        }
    }
    recommendations: Array<{
        title: string
        match_score: number
        riasec_code: string
        riasec_scores: Record<string, number>
    }>
}

export async function POST(request: NextRequest) {
    try {
        const {student_id} = await request.json()

        if (!student_id) {
            return NextResponse.json({
                success: false,
                error: 'student_id is required'
            }, {status: 400})
        }

        console.log('🎯 [Career Assessment] Starting career assessment for student:', student_id)
        console.log('   Student ID type:', typeof student_id)
        console.log('   Student ID length:', student_id.length)

        // Get test results from database
        const testResults = await getStudentTestResults(student_id)

        if (!testResults.mbti || !testResults.riasec || !testResults.grit) {
            console.error('❌ [Career Assessment] Missing tests:', {
                mbti: !!testResults.mbti,
                riasec: !!testResults.riasec,
                grit: !!testResults.grit
            })
            return NextResponse.json({
                success: false,
                error: 'Student must complete all 3 tests (MBTI, RIASEC, GRIT) before getting career recommendations'
            }, {status: 400})
        }

        console.log('✅ [Career Assessment] All tests found:', {
            mbti: testResults.mbti.status,
            riasec: testResults.riasec.status,
            grit: testResults.grit.status
        })

        // Transform test results to external API format
        const externalRequest: ExternalCareerAssessmentRequest = {
            mbti_answers: transformMBTIAnswers(testResults.mbti.answers),
            grit_answers: transformGritAnswers(testResults.grit.answers),
            riasec_answers: transformRIASECAnswers(testResults.riasec.answers),
            top_n: 10,
            min_match_score: 50.0
        }

        console.log('📤 [Career Assessment] Calling external API with:', {
            mbti_count: externalRequest.mbti_answers.length,
            grit_count: Object.keys(externalRequest.grit_answers).length,
            riasec_count: Object.keys(externalRequest.riasec_answers).length
        })

        // Get AI API URL from environment variable
        const aiApiUrl = process.env.AI_API_URL || 'http://127.0.0.1:8000/hoexapp/api/career-assessment/'
        console.log('🤖 [Career Assessment] AI API URL:', aiApiUrl)

        // Call external career assessment API
        const externalResponse = await fetch(aiApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(externalRequest)
        })

        if (!externalResponse.ok) {
            console.error('❌ [Career Assessment] External API error:', externalResponse.status)
            return NextResponse.json({
                success: false,
                error: 'External career assessment service unavailable'
            }, {status: 503})
        }

        const externalResult: ExternalCareerAssessmentResponse = await externalResponse.json()

        if (!externalResult.success) {
            return NextResponse.json({
                success: false,
                error: 'Career assessment failed'
            }, {status: 500})
        }

        console.log('📥 [Career Assessment] Received recommendations:', externalResult.recommendations.length)

        // Transform response to our format
        const recommendations = externalResult.recommendations.map(rec => ({
            name: rec.title,
            category: rec.riasec_code,
            matchReason: `Phù hợp ${rec.match_score.toFixed(1)}% với kết quả test của bạn`,
            careerPaths: [],
            requiredSkills: [],
            matchPercentage: Math.round(rec.match_score),
            riasecCode: rec.riasec_code,
            riasecScores: rec.riasec_scores
        }))

        // Store assessment results (optional)
        await storeCareerAssessment(student_id, externalResult.assessment, recommendations)

        return NextResponse.json({
            success: true,
            assessment: externalResult.assessment,
            recommendations,
            message: `Found ${recommendations.length} career recommendations`
        })

    } catch (error: any) {
        console.error('❌ [Career Assessment] Error:', error)
        return NextResponse.json({
            success: false,
            error: error.message || 'Internal server error'
        }, {status: 500})
    }
}

// Helper functions to get test results from database
async function getStudentTestResults(studentId: string) {
    let mbtiTest = null
    let riasecTest = null
    let gritTest = null

    try {
        // Try Prisma first
        const {prisma} = await import('@/lib/prisma')

        const [mbti, riasec, grit] = await Promise.all([
            prisma.mbti_tests.findFirst({
                where: {student_id: studentId, status: 'COMPLETED'},
                orderBy: {updated_at: 'desc'}
            }),
            prisma.riasec_tests.findFirst({
                where: {student_id: studentId, status: 'COMPLETED'},
                orderBy: {updated_at: 'desc'}
            }),
            prisma.grit_tests.findFirst({
                where: {student_id: studentId, status: 'COMPLETED'},
                orderBy: {updated_at: 'desc'}
            })
        ])

        mbtiTest = mbti
        riasecTest = riasec
        gritTest = grit

        console.log('✅ [Career Assessment] Got test results from Prisma:', {
            mbti: !!mbtiTest,
            riasec: !!riasecTest,
            grit: !!gritTest
        })

    } catch (prismaError) {
        console.warn('❌ Prisma failed, trying Supabase:', (prismaError as Error).message)

        // Fallback to Supabase
        try {
            const {supabaseAdmin} = await import('@/lib/supabase')

            const [mbtiQuery, riasecQuery, gritQuery] = await Promise.all([
                supabaseAdmin
                    .from('mbti_tests')
                    .select('*')
                    .eq('student_id', studentId)
                    .eq('status', 'COMPLETED')
                    .order('updated_at', {ascending: false})
                    .limit(1),
                supabaseAdmin
                    .from('riasec_tests')
                    .select('*')
                    .eq('student_id', studentId)
                    .eq('status', 'COMPLETED')
                    .order('updated_at', {ascending: false})
                    .limit(1),
                supabaseAdmin
                    .from('grit_tests')
                    .select('*')
                    .eq('student_id', studentId)
                    .eq('status', 'COMPLETED')
                    .order('updated_at', {ascending: false})
                    .limit(1)
            ])

            mbtiTest = mbtiQuery.data?.[0] || null
            riasecTest = riasecQuery.data?.[0] || null
            gritTest = gritQuery.data?.[0] || null

            console.log('✅ [Career Assessment] Got test results from Supabase:', {
                mbti: !!mbtiTest,
                riasec: !!riasecTest,
                grit: !!gritTest
            })

        } catch (supabaseError) {
            console.error('❌ Supabase also failed:', (supabaseError as Error).message)
        }
    }

    if (!mbtiTest || !riasecTest || !gritTest) {
        const missing = []
        if (!mbtiTest) missing.push('MBTI')
        if (!riasecTest) missing.push('RIASEC')
        if (!gritTest) missing.push('GRIT')

        throw new Error(`Missing completed tests: ${missing.join(', ')}. Please complete all tests first.`)
    }

    return {
        mbti: mbtiTest,
        riasec: riasecTest,
        grit: gritTest
    }
}

// Transform MBTI answers from our format to external API format
function transformMBTIAnswers(answers: any): number[] {
    // External API expects 60 numbers in range [-3, 3]
    // You'll need to map your MBTI answer format to this
    if (Array.isArray(answers) && answers.length === 60) {
        return answers.map(a => Math.max(-3, Math.min(3, Number(a) || 0)))
    }

    // If answers is an object, convert to array
    if (typeof answers === 'object' && answers !== null) {
        const answerArray: number[] = []
        for (let i = 1; i <= 60; i++) {
            const value = answers[i] || answers[i.toString()] || 0
            answerArray.push(Math.max(-3, Math.min(3, Number(value))))
        }
        return answerArray
    }

    // Fallback: return neutral answers
    console.warn('Invalid MBTI answers format, using neutral answers')
    return new Array(60).fill(0)
}

// Transform GRIT answers from our format to external API format
function transformGritAnswers(answers: any): Record<string, number> {
    // External API expects object with keys "1"-"12", values 1-5
    const transformed: Record<string, number> = {}

    if (typeof answers === 'object' && answers !== null) {
        for (let i = 1; i <= 12; i++) {
            const key = i.toString()
            const value = answers[i] || answers[key] || 3
            transformed[key] = Math.max(1, Math.min(5, Number(value)))
        }
    } else {
        // Fallback: neutral answers
        for (let i = 1; i <= 12; i++) {
            transformed[i.toString()] = 3
        }
    }

    return transformed
}

// Transform RIASEC answers from our format to external API format
function transformRIASECAnswers(answers: any): Record<string, number> {
    // External API expects object with keys "1"-"48", values 1-5
    const transformed: Record<string, number> = {}

    if (typeof answers === 'object' && answers !== null) {
        for (let i = 1; i <= 48; i++) {
            const key = i.toString()
            const value = answers[i] || answers[key]
            // Convert boolean to 1-5 scale: true/1 -> 4, false/0 -> 2
            if (typeof value === 'boolean') {
                transformed[key] = value ? 4 : 2
            } else {
                transformed[key] = Math.max(1, Math.min(5, Number(value) || 2))
            }
        }
    } else {
        // Fallback: neutral answers
        for (let i = 1; i <= 48; i++) {
            transformed[i.toString()] = 2
        }
    }

    return transformed
}

// Store career assessment results (optional)
async function storeCareerAssessment(studentId: string, assessment: any, recommendations: any[]) {
    try {
        // You can implement this to store results in your database
        console.log('📦 [Career Assessment] Storing results for student:', studentId)
        // Implementation depends on your database schema
    } catch (error) {
        console.error('Error storing career assessment:', error)
        // Don't throw - this is optional
    }
}
