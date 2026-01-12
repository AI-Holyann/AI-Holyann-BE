// filepath: d:\holyann-ai-web\src\app\api\tests\route.ts
import {NextRequest, NextResponse} from 'next/server';
import {prisma} from '@/lib/prisma';
import {supabaseAdmin} from '@/lib/supabase';
import {MBTI_QUESTIONS_SORTED} from '@/data/mbti-questions';
import {RIASEC_QUESTIONS_V2} from '@/data/riasec-questions';
import {GRIT_QUESTIONS_SORTED} from '@/data/grit-questions';
import {randomUUID} from 'crypto';

// ===========================================
// POST /api/tests - Bắt đầu test mới hoặc lấy test đang dở
// ===========================================
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {student_id, test_type} = body;

        console.log('📝 [API /tests] POST request:', {student_id, test_type});

        // Validation
        if (!student_id || !test_type) {
            console.error('❌ [API /tests] Missing required fields:', {student_id, test_type});
            return NextResponse.json({
                success: false,
                error: 'Missing student_id or test_type'
            }, {status: 400});
        }

        if (!['mbti', 'riasec', 'grit'].includes(test_type)) {
            return NextResponse.json({
                success: false,
                error: 'Invalid test_type. Must be: mbti, riasec, or grit'
            }, {status: 400});
        }

        // Kiểm tra student tồn tại, nếu không thì tạo mới
        let student = null;

        // 1. Thử tìm trong Prisma Local DB trước
        try {
            student = await prisma.students.findUnique({
                where: {user_id: student_id}
            });
        } catch (prismaError: any) {
            console.warn('⚠️ Prisma query failed, trying Supabase:', prismaError.message);
        }

        // 2. Nếu không tìm thấy trong Prisma, thử Supabase
        if (!student) {
            try {
                const {data: supabaseStudent} = await supabaseAdmin
                    .from('students')
                    .select('user_id, created_at, updated_at')
                    .eq('user_id', student_id)
                    .single();

                if (supabaseStudent) {
                    student = supabaseStudent;
                    console.log('✅ Found student in Supabase:', student_id);
                }
            } catch (supabaseError: any) {
                console.log('📝 Student not found in either DB, will create new one');
            }
        }

        // 3. Nếu vẫn không tìm thấy, tạo mới
        if (!student) {
            console.log('🔧 Creating new student profile for:', student_id);

            const studentData = {
                user_id: student_id,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                assessments_completed: false
            };

            // Tạo trong Supabase trước (primary source)
            try {
                const {data: newSupabaseStudent, error: supabaseError} = await supabaseAdmin
                    .from('students')
                    .insert(studentData)
                    .select()
                    .single();

                if (supabaseError) throw supabaseError;
                student = newSupabaseStudent;
                console.log('✅ Student created in Supabase');
            } catch (supabaseCreateError: any) {
                console.error('❌ Failed to create student in Supabase:', supabaseCreateError.message);
                return NextResponse.json({
                    success: false,
                    error: 'Failed to create student profile: ' + supabaseCreateError.message
                }, {status: 500});
            }

            // Thử tạo trong Prisma Local DB (best effort)
            try {
                await prisma.students.create({
                    data: {
                        user_id: student_id,
                        created_at: new Date(),
                        updated_at: new Date(),
                        assessments_completed: false
                    }
                });
                console.log('✅ Student also created in Local DB');
            } catch (prismaCreateError: any) {
                console.warn('⚠️ Could not create in Local DB (but Supabase OK):', prismaCreateError.message);
                // Continue - Supabase is working
            }
        }

        // Kiểm tra test đang dở
        const existingTest = await findExistingTest(test_type, student_id);

        if (existingTest) {
            return NextResponse.json({
                success: true,
                test_id: existingTest.id,
                status: existingTest.status,
                current_step: existingTest.current_step,
                total_questions: getTotalQuestions(test_type),
                message: existingTest.status === 'COMPLETED' ? 'Test already completed' : 'Continuing existing test',
                answers: existingTest.answers,
                questions: getQuestions(test_type)
            });
        }

        // Tạo test mới
        let test;
        const questions = getQuestions(test_type);
        const totalQuestions = getTotalQuestions(test_type);

        switch (test_type) {
            case 'mbti':
                test = await prisma.mbti_tests.create({
                    data: {
                        id: randomUUID(),
                        student_id,
                        status: 'IN_PROGRESS',
                        current_step: 0,
                        answers: []
                    }
                });
                break;

            case 'riasec':
                test = await prisma.riasec_tests.create({
                    data: {
                        id: randomUUID(),
                        student_id,
                        status: 'IN_PROGRESS',
                        current_step: 0,
                        answers: {}
                    }
                });
                break;

            case 'grit':
                test = await prisma.grit_tests.create({
                    data: {
                        id: randomUUID(),
                        student_id,
                        status: 'IN_PROGRESS',
                        current_step: 0,
                        answers: {}
                    }
                });
                break;
        }

        return NextResponse.json({
            success: true,
            test_id: test!.id,
            status: test!.status,
            current_step: 0,
            total_questions: totalQuestions,
            questions
        }, {status: 201});

    } catch (error: any) {
        console.error('❌ Error starting test:', error);
        console.error('❌ Error stack:', error?.stack);
        return NextResponse.json({
            success: false,
            error: error?.message || 'Internal server error',
            details: process.env.NODE_ENV === 'development' ? error?.stack : undefined
        }, {status: 500});
    }
}

// ===========================================
// HELPER FUNCTIONS
// ===========================================
async function findExistingTest(test_type: string, student_id: string) {
    switch (test_type) {
        case 'mbti':
            return await prisma.mbti_tests.findFirst({
                where: {
                    student_id,
                    status: {in: ['IN_PROGRESS', 'COMPLETED']}
                }
            });
        case 'riasec':
            return await prisma.riasec_tests.findFirst({
                where: {
                    student_id,
                    status: {in: ['IN_PROGRESS', 'COMPLETED']}
                }
            });
        case 'grit':
            return await prisma.grit_tests.findFirst({
                where: {
                    student_id,
                    status: {in: ['IN_PROGRESS', 'COMPLETED']}
                }
            });
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

function getQuestions(test_type: string): { id: number; text: string; [key: string]: unknown }[] {
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

