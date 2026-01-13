/**
 * Test Script - Demo cách sử dụng Student Background Service
 * Chạy script này để test các functions
 */

import { randomUUID } from 'crypto';
import { prisma } from './src/lib/prisma';
import * as BackgroundService from './src/lib/services/student-background.service';

async function testStudentBackgroundSystem() {
  console.log('🚀 Bắt đầu test Student Background System...\n');

  try {
    // 1. Tạo một user test
    console.log('1️⃣ Tạo test user...');
    const testUser = await prisma.users.create({
      data: {
        id: randomUUID(),
        full_name: 'Nguyen Van Test',
        email: `test${Date.now()}@example.com`,
        role: 'STUDENT',
      },
    });
    console.log('✅ User created:', testUser.id);

    // 2. Tạo student profile
    console.log('\n2️⃣ Tạo student profile...');
    const student = await prisma.students.create({
      data: {
        user_id: testUser.id,
        current_school: 'THPT Chuyên Test',
        current_grade: '12',
        intended_major: 'Computer Science',
      },
    });
    console.log('✅ Student created:', student.user_id);

    // 3. Thêm giải thưởng học thuật
    console.log('\n3️⃣ Thêm giải thưởng học thuật...');
    const award1 = await BackgroundService.addAcademicAward(student.user_id, {
      award_name: 'Giải Nhất Olympic Toán Quốc gia',
      issuing_organization: 'Bộ Giáo dục và Đào tạo',
      award_level: 'NATIONAL',
      award_date: new Date('2024-05-15'),
      description: 'Đạt giải Nhất Olympic Toán học cấp Quốc gia năm 2024',
    });
    console.log('✅ Academic award added:', award1.id);

    // 4. Thêm giải thưởng nghệ thuật
    console.log('\n4️⃣ Thêm giải thưởng nghệ thuật...');
    const award2 = await BackgroundService.addNonAcademicAward(student.user_id, {
      award_name: 'Huy chương Vàng Piano',
      category: 'MUSIC',
      issuing_organization: 'Conservatory of Music',
      award_level: 'INTERNATIONAL',
      award_date: new Date('2024-03-20'),
      description: 'Giải vàng cuộc thi Piano quốc tế',
    });
    console.log('✅ Non-academic award added:', award2.id);

    // 5. Thêm hoạt động ngoại khóa liên quan ngành học
    console.log('\n5️⃣ Thêm hoạt động ngoại khóa (liên quan ngành học)...');
    const activity1 = await BackgroundService.addAcademicExtracurricular(student.user_id, {
      activity_name: 'Câu lạc bộ Lập trình',
      organization: 'THPT Chuyên',
      role: 'Chủ tịch',
      start_date: new Date('2023-09-01'),
      end_date: new Date('2024-06-30'),
      hours_per_week: 5,
      weeks_per_year: 40,
      description: 'Tổ chức các workshop về lập trình cho học sinh',
      achievements: 'Đã tổ chức 10+ workshop với 200+ học sinh tham gia',
      related_to_major: true,
    });
    console.log('✅ Academic extracurricular added:', activity1.id);

    // 6. Thêm hoạt động tình nguyện
    console.log('\n6️⃣ Thêm hoạt động tình nguyện...');
    const activity2 = await BackgroundService.addNonAcademicExtracurricular(student.user_id, {
      activity_name: 'Dạy học cho trẻ em vùng cao',
      category: 'COMMUNITY',
      organization: 'Nhóm tình nguyện ABC',
      role: 'Tình nguyện viên',
      start_date: new Date('2023-06-01'),
      end_date: new Date('2023-08-31'),
      hours_per_week: 10,
      weeks_per_year: 12,
      description: 'Dạy tiếng Anh và Toán cho trẻ em vùng cao',
      impact: 'Đã giúp 30+ em học sinh cải thiện kỹ năng tiếng Anh',
    });
    console.log('✅ Non-academic extracurricular added:', activity2.id);

    // 7. Thêm kinh nghiệm làm việc
    console.log('\n7️⃣ Thêm kinh nghiệm làm việc...');
    const work = await BackgroundService.addWorkExperience(student.user_id, {
      company_name: 'Tech Startup XYZ',
      job_title: 'Software Engineer Intern',
      employment_type: 'INTERNSHIP',
      location: 'Ho Chi Minh City',
      start_date: new Date('2024-06-01'),
      end_date: new Date('2024-08-31'),
      is_current: false,
      responsibilities: 'Phát triển tính năng web app, viết unit tests, code review',
      achievements: 'Hoàn thành 3 features lớn, cải thiện performance 30%',
      skills_gained: 'React, Node.js, PostgreSQL, Git, Agile',
    });
    console.log('✅ Work experience added:', work.id);

    // 8. Thêm kinh nghiệm nghiên cứu
    console.log('\n8️⃣ Thêm kinh nghiệm nghiên cứu...');
    const research = await BackgroundService.addResearchExperience(student.user_id, {
      project_title: 'Ứng dụng AI trong chẩn đoán bệnh',
      institution: 'University Research Lab',
      supervisor_name: 'Dr. Nguyen Van A',
      role: 'Research Assistant',
      start_date: new Date('2024-01-15'),
      end_date: new Date('2024-05-30'),
      is_current: false,
      research_field: 'Artificial Intelligence, Healthcare',
      description: 'Nghiên cứu ứng dụng machine learning để chẩn đoán bệnh từ hình ảnh y khoa',
      methodologies: 'Deep Learning, CNN, Transfer Learning',
      findings: 'Đạt độ chính xác 92% trên dataset thử nghiệm',
    });
    console.log('✅ Research experience added:', research.id);

    // 9. Lấy toàn bộ thông tin background
    console.log('\n9️⃣ Lấy toàn bộ thông tin background...');
    const background = await BackgroundService.getStudentBackground(student.user_id);
    console.log('✅ Background retrieved successfully!');
    console.log('   - Academic awards:', background?.academic_awards.length);
    console.log('   - Non-academic awards:', background?.non_academic_awards.length);
    console.log('   - Academic activities:', background?.academic_extracurriculars.length);
    console.log('   - Non-academic activities:', background?.non_academic_extracurriculars.length);
    console.log('   - Work experiences:', background?.work_experiences.length);
    console.log('   - Research experiences:', background?.research_experiences.length);

    // 10. Lấy thống kê
    console.log('\n🔟 Lấy thống kê...');
    const stats = await BackgroundService.getBackgroundStatistics(student.user_id);
    console.log('✅ Statistics:');
    console.log('   - Total awards:', stats.totalAwards);
    console.log('   - Total activities:', stats.totalActivities);
    console.log('   - Work experiences:', stats.workExperiences);
    console.log('   - Research experiences:', stats.researchExperiences);

    // 11. Test update
    console.log('\n1️⃣1️⃣ Test update giải thưởng...');
    await BackgroundService.updateAcademicAward(award1.id, {
      description: 'Updated: Đạt giải Nhất Olympic Toán học cấp Quốc gia năm 2024 với số điểm tuyệt đối',
    });
    console.log('✅ Award updated successfully!');

    // 12. Clean up (optional - comment out nếu muốn giữ data)
    console.log('\n1️⃣2️⃣ Cleaning up test data...');
    await prisma.students.delete({
      where: { user_id: student.user_id },
    });
    await prisma.users.delete({
      where: { id: testUser.id },
    });
    console.log('✅ Test data cleaned up!');

    console.log('\n✨ TẤT CẢ TESTS ĐÃ PASS! ✨\n');
  } catch (error) {
    console.error('❌ Error during testing:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Chạy test
testStudentBackgroundSystem()
  .then(() => {
    console.log('🎉 Test script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Test script failed:', error);
    process.exit(1);
  });

