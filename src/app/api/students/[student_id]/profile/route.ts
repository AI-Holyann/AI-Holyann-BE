import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ student_id: string }> }
) {
    try {
        const { student_id } = await params;

        // Lấy thông tin từ users và students
        const user = await prisma.users.findUnique({
            where: { id: student_id },
            include: {
                students: {
                    include: {
                        student_backgrounds: {
                            include: {
                                academic_awards: true,
                                academic_extracurriculars: true,
                                non_academic_awards: true,
                                non_academic_extracurriculars: true,
                                research_experiences: true,
                                work_experiences: true,
                                subject_scores: true,
                                personal_projects: true,
                            }
                        },
                        student_academic_profiles: true,
                        student_parents: true,
                        student_skills: true,
                    }
                }
            }
        });

        if (!user) {
            return NextResponse.json(
                { error: 'Không tìm thấy học sinh' },
                { status: 404 }
            );
        }

        // Kiểm tra thông tin cơ bản đã đủ chưa
        const basicInfoComplete = !!(
            user.full_name &&
            user.email &&
            user.phone_number &&
            user.students?.date_of_birth
        );

        // Kiểm tra thông tin học thuật đã đủ chưa
        const academicProfile = user.students?.student_academic_profiles;
        const hasAcademicInfo = !!(
            academicProfile?.gpa_transcript_details ||
            academicProfile?.english_certificates ||
            academicProfile?.standardized_tests
        );

        const background = user.students?.student_backgrounds;
        const hasExtracurriculars = !!(
            background?.academic_extracurriculars?.length ||
            background?.non_academic_extracurriculars?.length ||
            background?.academic_awards?.length ||
            background?.non_academic_awards?.length ||
            background?.work_experiences?.length ||
            background?.research_experiences?.length
        );

        const response = {
            basicInfo: {
                full_name: user.full_name,
                email: user.email,
                phone_number: user.phone_number,
                date_of_birth: user.students?.date_of_birth,
                current_address: user.students?.current_address,
                avatar_url: user.avatar_url,
                status: basicInfoComplete ? 'Hoàn tất' : 'Cần bổ sung'
            },
            studentInfo: {
                current_school: user.students?.current_school,
                current_grade: user.students?.current_grade,
                intended_major: user.students?.intended_major,
                target_country: user.students?.target_country,
                yearly_budget: user.students?.yearly_budget,
                talents: user.students?.talents,
                hobbies: user.students?.hobbies,
                personal_desire: user.students?.personal_desire,
            },
            academicProfile: academicProfile || null,
            background: background || null,
            parents: user.students?.student_parents || [],
            status: {
                basicInfoComplete,
                hasAcademicInfo,
                hasExtracurriculars,
                overallStatus: (basicInfoComplete && hasAcademicInfo && hasExtracurriculars) 
                    ? 'Hoàn tất' 
                    : 'Cần bổ sung'
            }
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('❌ Error fetching student profile:', error);
        return NextResponse.json(
            { error: 'Lỗi khi lấy thông tin học sinh' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}

// Cập nhật thông tin cơ bản
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ student_id: string }> }
) {
    try {
        const { student_id } = await params;
        const body = await request.json();
        const { basicInfo, studentInfo } = body;

        // Cập nhật bảng users (từ basicInfo)
        if (basicInfo) {
            const userUpdate: any = {};
            if (basicInfo.full_name) userUpdate.full_name = basicInfo.full_name;
            if (basicInfo.phone_number) userUpdate.phone_number = basicInfo.phone_number;
            if (basicInfo.email) userUpdate.email = basicInfo.email;
            
            if (Object.keys(userUpdate).length > 0) {
                await prisma.users.update({
                    where: { id: student_id },
                    data: userUpdate
                });
            }

            // Cập nhật students từ basicInfo
            const studentBasicUpdate: any = {};
            if (basicInfo.current_school) studentBasicUpdate.current_school = basicInfo.current_school;
            if (basicInfo.current_grade) studentBasicUpdate.current_grade = basicInfo.current_grade;
            if (basicInfo.current_address) studentBasicUpdate.current_address = basicInfo.current_address;
            if (basicInfo.talents) studentBasicUpdate.talents = basicInfo.talents;
            if (basicInfo.hobbies) studentBasicUpdate.hobbies = basicInfo.hobbies;

            if (Object.keys(studentBasicUpdate).length > 0) {
                await prisma.students.update({
                    where: { user_id: student_id },
                    data: studentBasicUpdate
                });
            }
        }

        // Cập nhật bảng students
        if (studentInfo) {
            await prisma.students.upsert({
                where: { user_id: student_id },
                update: {
                    date_of_birth: studentInfo.date_of_birth ? new Date(studentInfo.date_of_birth) : undefined,
                    current_address: studentInfo.current_address || undefined,
                    current_school: studentInfo.current_school || undefined,
                    current_grade: studentInfo.current_grade || undefined,
                    intended_major: studentInfo.intended_major || undefined,
                    target_country: studentInfo.target_country || undefined,
                    yearly_budget: studentInfo.yearly_budget ? studentInfo.yearly_budget : null,
                    talents: studentInfo.talents || undefined,
                    hobbies: studentInfo.hobbies || undefined,
                    personal_desire: studentInfo.personal_desire || undefined,
                },
                create: {
                    user_id: student_id,
                    date_of_birth: studentInfo.date_of_birth ? new Date(studentInfo.date_of_birth) : undefined,
                    current_address: studentInfo.current_address || undefined,
                    current_school: studentInfo.current_school || undefined,
                    current_grade: studentInfo.current_grade || undefined,
                    intended_major: studentInfo.intended_major || undefined,
                    target_country: studentInfo.target_country || undefined,
                    yearly_budget: studentInfo.yearly_budget ? studentInfo.yearly_budget : null,
                    talents: studentInfo.talents || undefined,
                    hobbies: studentInfo.hobbies || undefined,
                    personal_desire: studentInfo.personal_desire || undefined,
                }
            });
        }

        return NextResponse.json({ 
            success: true,
            message: 'Cập nhật thông tin thành công' 
        });
    } catch (error) {
        console.error('❌ Error updating student profile:', error);
        return NextResponse.json(
            { error: 'Lỗi khi cập nhật thông tin' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
