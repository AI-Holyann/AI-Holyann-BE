# DATABASE MIGRATION GUIDE - Feature 1 Integration

## Tổng quan thay đổi

Đã thêm 3 bảng mới và cập nhật 4 bảng hiện có để hỗ trợ đầy đủ yêu cầu của AI Feature 1.

### 📦 Bảng mới được tạo:

1. **subject_scores** - Điểm từng môn học
2. **personal_projects** - Dự án cá nhân
3. **student_skills** - Kỹ năng của học sinh

### 🔧 Bảng được cập nhật:

1. **academic_awards** - Thêm: `category`, `year`, `rank`, `region`
2. **non_academic_awards** - Thêm: `year`, `rank`, `region`
3. **academic_extracurriculars** - Thêm: `scale`, `region`
4. **non_academic_extracurriculars** - Thêm: `scale`, `region`

---

## 🚀 Các bước thực hiện Migration

### Bước 1: Chạy Prisma Migration

```powershell
cd d:\holyann-ai-web

# Generate Prisma Client mới
npx prisma generate

# Tạo migration
npx prisma migrate dev --name add_feature1_support

# Nếu có lỗi, có thể cần reset database (CẢNH BÁO: Mất dữ liệu)
# npx prisma migrate reset
```

### Bước 2: Kiểm tra Database

```powershell
# Xem database trong Prisma Studio
npx prisma studio
```

### Bước 3: Test API Endpoints

```powershell
# Test Subject Scores API
curl -X POST http://localhost:3000/api/students/{student_id}/subject-scores `
  -H "Content-Type: application/json" `
  -d '{"subject": "Toán", "score": 9.0, "year": 2024, "semester": 1}'

# Test Personal Projects API
curl -X POST http://localhost:3000/api/students/{student_id}/personal-projects `
  -H "Content-Type: application/json" `
  -d '{"project_name": "Test Project", "topic": "Science/Tech", "duration_months": 6}'

# Test Skills API
curl -X POST http://localhost:3000/api/students/{student_id}/skills `
  -H "Content-Type: application/json" `
  -d '{"skill_name": "Python", "proficiency": "ADVANCED", "category": "Hard"}'
```

---

## 📋 Mapping dữ liệu Web → Feature 1

### Academic (Học thuật)
```javascript
{
  "gpa": student_academic_profiles.gpa_transcript_details.gpa,
  "subject_scores": subject_scores[], // MỚI
  "academic_awards": academic_awards[] // ĐÃ CẬP NHẬT với category, year, rank, region
}
```

### Language_and_standardized
```javascript
{
  "languages": student_academic_profiles.english_certificates[],
  "standardized_tests": student_academic_profiles.standardized_tests[]
}
```

### Action (Hoạt động ngoại khóa)
```javascript
{
  "actions": [
    ...academic_extracurriculars.map(act => ({
      action_name: act.activity_name,
      role: act.role,
      scale: act.scale,  // MỚI
      region: act.region  // MỚI
    })),
    ...non_academic_extracurriculars.map(act => ({
      action_name: act.activity_name,
      role: act.role,
      scale: act.scale,  // MỚI
      region: act.region  // MỚI
    }))
  ]
}
```

### Non_academic_awards
```javascript
{
  "non_academic_awards": non_academic_awards.map(award => ({
    award_name: award.award_name,
    category: award.category,
    year: award.year,  // MỚI
    rank: award.rank,  // MỚI
    region: award.region  // MỚI
  }))
}
```

### Personal_projects
```javascript
{
  "personal_projects": personal_projects[] // MỚI
}
```

### Skill
```javascript
{
  "skills": student_skills[] // MỚI
}
```

---

## 🔍 Checklist kiểm tra

- [ ] Schema.prisma đã được cập nhật
- [ ] Migration đã chạy thành công
- [ ] 3 API endpoints mới đã được tạo
- [ ] API profile đã include các bảng mới
- [ ] Form AcademicInfoModal đã có các tab mới
- [ ] Form có đủ field theo yêu cầu F1
- [ ] Có thể lưu và load dữ liệu mới
- [ ] Test nhập liệu từ UI
- [ ] Dữ liệu lưu đúng format

---

## 🎯 Bước tiếp theo

### Tạo API mapping để chuyển đổi dữ liệu sang format Feature 1

Tạo file: `d:\holyann-ai-web\src\app\api\students\[student_id]\feature1-data\route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ student_id: string }> }
) {
    try {
        const { student_id } = await params;

        // Lấy toàn bộ dữ liệu
        const student = await prisma.students.findUnique({
            where: { user_id: student_id },
            include: {
                student_academic_profiles: true,
                student_backgrounds: {
                    include: {
                        academic_awards: true,
                        non_academic_awards: true,
                        academic_extracurriculars: true,
                        non_academic_extracurriculars: true,
                        subject_scores: true,
                        personal_projects: true,
                        work_experiences: true,
                        research_experiences: true,
                    }
                },
                student_skills: true,
            }
        });

        if (!student) {
            return NextResponse.json({ error: 'Student not found' }, { status: 404 });
        }

        // Map sang format Feature 1
        const feature1Data = {
            academic: {
                gpa: parseFloat(student.student_academic_profiles?.gpa_transcript_details?.gpa || '0'),
                subject_scores: student.student_backgrounds?.subject_scores?.map(s => ({
                    subject: s.subject,
                    score: s.score
                })) || [],
                academic_awards: student.student_backgrounds?.academic_awards?.map(a => ({
                    award_name: a.award_name,
                    year: a.year,
                    rank: a.rank,
                    region: a.region,
                    category: a.category
                })) || []
            },
            language_and_standardized: {
                languages: student.student_academic_profiles?.english_certificates || [],
                standardized_tests: student.student_academic_profiles?.standardized_tests || []
            },
            action: {
                actions: [
                    ...student.student_backgrounds?.academic_extracurriculars?.map(act => ({
                        action_name: act.activity_name,
                        role: act.role,
                        scale: act.scale,
                        region: act.region
                    })) || [],
                    ...student.student_backgrounds?.non_academic_extracurriculars?.map(act => ({
                        action_name: act.activity_name,
                        role: act.role,
                        scale: act.scale,
                        region: act.region
                    })) || []
                ]
            },
            non_academic_awards: student.student_backgrounds?.non_academic_awards?.map(a => ({
                award_name: a.award_name,
                category: a.category,
                year: a.year,
                rank: a.rank,
                region: a.region
            })) || [],
            personal_projects: student.student_backgrounds?.personal_projects?.map(p => ({
                project_name: p.project_name,
                topic: p.topic,
                description: p.description,
                duration_months: p.duration_months,
                impact: p.impact
            })) || [],
            skill: {
                skills: student.student_skills?.map(s => ({
                    skill_name: s.skill_name,
                    proficiency: s.proficiency
                })) || []
            }
        };

        return NextResponse.json(feature1Data);
    } catch (error) {
        console.error('Error mapping to Feature 1 format:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
```

---

## 📞 Test với Feature 1 AI Server

```bash
# Test gọi API từ Django server
curl http://localhost:3000/api/students/{student_id}/feature1-data

# Gửi data này đến Feature 1
curl -X POST http://localhost:8000/hoexapp/api/profile-analysis/ \
  -H "Content-Type: application/json" \
  -d @feature1_data.json
```

---

## ⚠️ Lưu ý quan trọng

1. **Backup database** trước khi chạy migration
2. **Test trên môi trường dev** trước
3. Kiểm tra **data type** match với Feature 1
4. Validate **required fields** trước khi gửi đến AI
5. Xử lý **null/undefined** values properly

---

## 🐛 Troubleshooting

### Lỗi: "Prisma Client không sync"
```powershell
npx prisma generate
```

### Lỗi: "Migration conflicts"
```powershell
# Reset database (Cảnh báo: Mất dữ liệu!)
npx prisma migrate reset
npx prisma migrate dev
```

### Lỗi: "API 404"
```powershell
# Restart Next.js server
npm run dev
```

### Lỗi: "Type mismatch"
- Kiểm tra lại schema.prisma
- Regenerate Prisma Client
- Restart TypeScript server trong VS Code

---

## ✅ Kết luận

Sau khi hoàn thành tất cả các bước trên:
- ✅ Database đã có đủ cấu trúc cho Feature 1
- ✅ Form nhập liệu đã đồng bộ với AI requirements
- ✅ API đã sẵn sàng để map dữ liệu
- ✅ Có thể test end-to-end với Feature 1

**Bước tiếp theo**: Tạo API feature1-data và test với Django server!
