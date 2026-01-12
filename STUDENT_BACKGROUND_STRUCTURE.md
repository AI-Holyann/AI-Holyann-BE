# Cấu trúc Nền tảng Ngoại khóa Học viên

## Tổng quan

Hệ thống nền tảng ngoại khóa đã được tái cấu trúc từ một bảng đơn giản thành một hệ thống 7 bảng liên kết, cho phép lưu trữ chi tiết và có cấu trúc các thông tin về hoạt động ngoại khóa của học viên.

## Sơ đồ Cấu trúc

```
student_backgrounds (Hub - Bảng chính)
    ├── academic_awards (Giải thưởng học thuật)
    ├── non_academic_awards (Giải thưởng khác: Nghệ thuật, Âm nhạc, Thể thao...)
    ├── academic_extracurriculars (Hoạt động ngoại khóa liên quan đến ngành học)
    ├── non_academic_extracurriculars (Hoạt động ngoại khóa ngoài ngành học)
    ├── work_experiences (Kinh nghiệm làm việc)
    └── research_experiences (Kinh nghiệm nghiên cứu)
```

## Chi tiết Bảng

### 1. student_backgrounds (Bảng Hub)
**Mục đích**: Bảng trung tâm liên kết đến tất cả các bảng chi tiết

**Trường dữ liệu**:
- `student_id` (UUID, Primary Key, Foreign Key → students.user_id)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

**Relations**: Liên kết 1-N đến 6 bảng chi tiết

---

### 2. academic_awards (Giải thưởng học thuật)
**Mục đích**: Lưu các giải thưởng học thuật (Olympic, Cuộc thi toán, khoa học...)

**Trường dữ liệu**:
- `id` (UUID, Primary Key)
- `background_id` (UUID, Foreign Key → student_backgrounds.student_id)
- `award_name` (VARCHAR 255) - Tên giải thưởng
- `issuing_organization` (VARCHAR 255) - Tổ chức trao giải
- `award_level` (VARCHAR 100) - Cấp độ: Quốc tế, Quốc gia, Khu vực, Trường
- `award_date` (Date) - Ngày nhận giải
- `description` (Text) - Mô tả chi tiết
- `certificate_url` (String) - Link đến file chứng nhận
- `created_at`, `updated_at` (Timestamp)

**Ví dụ**:
```json
{
  "award_name": "Giải Nhất Olympic Toán Quốc gia",
  "issuing_organization": "Bộ Giáo dục và Đào tạo",
  "award_level": "Quốc gia",
  "award_date": "2024-05-15",
  "description": "Đạt giải Nhất cấp Quốc gia môn Toán"
}
```

---

### 3. non_academic_awards (Giải thưởng khác)
**Mục đích**: Lưu giải thưởng nghệ thuật, âm nhạc, thể thao, cộng đồng...

**Trường dữ liệu**:
- `id` (UUID, Primary Key)
- `background_id` (UUID, Foreign Key → student_backgrounds.student_id)
- `award_name` (VARCHAR 255) - Tên giải thưởng
- `category` (VARCHAR 100) - Loại: Nghệ thuật, Âm nhạc, Thể thao, Cộng đồng...
- `issuing_organization` (VARCHAR 255) - Tổ chức trao giải
- `award_level` (VARCHAR 100) - Cấp độ giải
- `award_date` (Date) - Ngày nhận giải
- `description` (Text) - Mô tả chi tiết
- `certificate_url` (String) - Link đến file chứng nhận
- `created_at`, `updated_at` (Timestamp)

**Ví dụ**:
```json
{
  "award_name": "Huy chương Vàng Piano",
  "category": "Âm nhạc",
  "issuing_organization": "Conservatory of Music",
  "award_level": "Quốc tế",
  "award_date": "2024-03-20"
}
```

---

### 4. academic_extracurriculars (Hoạt động ngoại khóa liên quan ngành học)
**Mục đích**: Lưu các hoạt động ngoại khóa liên quan đến ngành học dự định theo học

**Trường dữ liệu**:
- `id` (UUID, Primary Key)
- `background_id` (UUID, Foreign Key → student_backgrounds.student_id)
- `activity_name` (VARCHAR 255) - Tên hoạt động
- `organization` (VARCHAR 255) - Tổ chức/Câu lạc bộ
- `role` (VARCHAR 100) - Vai trò: Thành viên, Trưởng nhóm, Chủ tịch...
- `start_date`, `end_date` (Date) - Thời gian tham gia
- `hours_per_week` (Int) - Số giờ/tuần
- `weeks_per_year` (Int) - Số tuần/năm
- `description` (Text) - Mô tả hoạt động
- `achievements` (Text) - Thành tựu đạt được
- `related_to_major` (Boolean, default: true) - Liên quan đến ngành học
- `created_at`, `updated_at` (Timestamp)

**Ví dụ**:
```json
{
  "activity_name": "Câu lạc bộ Lập trình",
  "organization": "Trường THPT Chuyên",
  "role": "Chủ tịch",
  "start_date": "2023-09-01",
  "hours_per_week": 5,
  "weeks_per_year": 40,
  "description": "Tổ chức các buổi workshop về lập trình",
  "achievements": "Đã tổ chức 10+ workshop với hơn 200 học sinh tham gia",
  "related_to_major": true
}
```

---

### 5. non_academic_extracurriculars (Hoạt động ngoại khóa ngoài ngành học)
**Mục đích**: Lưu các hoạt động thể thao, nghệ thuật, tình nguyện, cộng đồng...

**Trường dữ liệu**:
- `id` (UUID, Primary Key)
- `background_id` (UUID, Foreign Key → student_backgrounds.student_id)
- `activity_name` (VARCHAR 255) - Tên hoạt động
- `category` (VARCHAR 100) - Loại: Thể thao, Nghệ thuật, Tình nguyện, Cộng đồng...
- `organization` (VARCHAR 255) - Tổ chức
- `role` (VARCHAR 100) - Vai trò
- `start_date`, `end_date` (Date) - Thời gian tham gia
- `hours_per_week` (Int) - Số giờ/tuần
- `weeks_per_year` (Int) - Số tuần/năm
- `description` (Text) - Mô tả hoạt động
- `achievements` (Text) - Thành tựu đạt được
- `impact` (Text) - Tác động đến cộng đồng/bản thân
- `created_at`, `updated_at` (Timestamp)

**Ví dụ**:
```json
{
  "activity_name": "Tình nguyện dạy học cho trẻ em vùng cao",
  "category": "Cộng đồng",
  "organization": "Nhóm tình nguyện ABC",
  "role": "Tình nguyện viên",
  "start_date": "2023-06-01",
  "end_date": "2023-08-31",
  "hours_per_week": 10,
  "description": "Dạy tiếng Anh và Toán cho trẻ em vùng cao",
  "impact": "Đã giúp 30+ em học sinh cải thiện kỹ năng tiếng Anh"
}
```

---

### 6. work_experiences (Kinh nghiệm làm việc)
**Mục đích**: Lưu kinh nghiệm làm việc part-time, internship, volunteer...

**Trường dữ liệu**:
- `id` (UUID, Primary Key)
- `background_id` (UUID, Foreign Key → student_backgrounds.student_id)
- `company_name` (VARCHAR 255) - Tên công ty
- `job_title` (VARCHAR 150) - Chức danh công việc
- `employment_type` (VARCHAR 50) - Loại: Full-time, Part-time, Internship, Volunteer
- `location` (VARCHAR 255) - Địa điểm
- `start_date`, `end_date` (Date) - Thời gian làm việc
- `is_current` (Boolean, default: false) - Đang làm việc
- `responsibilities` (Text) - Trách nhiệm công việc
- `achievements` (Text) - Thành tựu đạt được
- `skills_gained` (Text) - Kỹ năng học được
- `created_at`, `updated_at` (Timestamp)

**Ví dụ**:
```json
{
  "company_name": "Tech Startup XYZ",
  "job_title": "Software Engineer Intern",
  "employment_type": "Internship",
  "location": "Ho Chi Minh City",
  "start_date": "2024-06-01",
  "end_date": "2024-08-31",
  "is_current": false,
  "responsibilities": "Phát triển tính năng web app, viết test cases",
  "achievements": "Hoàn thành 3 features lớn, cải thiện performance 30%",
  "skills_gained": "React, Node.js, PostgreSQL, Git"
}
```

---

### 7. research_experiences (Kinh nghiệm nghiên cứu)
**Mục đích**: Lưu kinh nghiệm nghiên cứu khoa học, dự án nghiên cứu...

**Trường dữ liệu**:
- `id` (UUID, Primary Key)
- `background_id` (UUID, Foreign Key → student_backgrounds.student_id)
- `project_title` (VARCHAR 255) - Tên dự án nghiên cứu
- `institution` (VARCHAR 255) - Trường, Viện nghiên cứu, Lab
- `supervisor_name` (VARCHAR 150) - Tên giáo viên hướng dẫn
- `role` (VARCHAR 100) - Vai trò: Lead Researcher, Research Assistant...
- `start_date`, `end_date` (Date) - Thời gian nghiên cứu
- `is_current` (Boolean, default: false) - Đang nghiên cứu
- `research_field` (VARCHAR 255) - Lĩnh vực nghiên cứu
- `description` (Text) - Mô tả dự án
- `methodologies` (Text) - Phương pháp nghiên cứu sử dụng
- `findings` (Text) - Kết quả/Phát hiện
- `publication_url` (String) - Link đến bài báo (nếu có)
- `created_at`, `updated_at` (Timestamp)

**Ví dụ**:
```json
{
  "project_title": "Ứng dụng AI trong chẩn đoán bệnh",
  "institution": "University Research Lab",
  "supervisor_name": "Dr. Nguyen Van A",
  "role": "Research Assistant",
  "start_date": "2024-01-15",
  "end_date": "2024-05-30",
  "is_current": false,
  "research_field": "Artificial Intelligence, Healthcare",
  "description": "Nghiên cứu ứng dụng machine learning để chẩn đoán bệnh từ hình ảnh y khoa",
  "methodologies": "Deep Learning, CNN, Transfer Learning",
  "findings": "Đạt độ chính xác 92% trên dataset thử nghiệm",
  "publication_url": "https://example.com/paper"
}
```

---

## Ví dụ Query với Prisma

### 1. Tạo student background với các dữ liệu liên quan:

```typescript
const studentBackground = await prisma.student_backgrounds.create({
  data: {
    student_id: userId,
    academic_awards: {
      create: [
        {
          award_name: "Giải Nhất Olympic Toán",
          issuing_organization: "Bộ GD&ĐT",
          award_level: "Quốc gia",
          award_date: new Date("2024-05-15")
        }
      ]
    },
    work_experiences: {
      create: [
        {
          company_name: "Tech Company",
          job_title: "Software Engineer Intern",
          employment_type: "Internship",
          start_date: new Date("2024-06-01"),
          end_date: new Date("2024-08-31")
        }
      ]
    }
  }
});
```

### 2. Lấy toàn bộ thông tin nền tảng ngoại khóa của học viên:

```typescript
const studentBackground = await prisma.student_backgrounds.findUnique({
  where: { student_id: userId },
  include: {
    academic_awards: true,
    non_academic_awards: true,
    academic_extracurriculars: true,
    non_academic_extracurriculars: true,
    work_experiences: true,
    research_experiences: true
  }
});
```

### 3. Thêm một giải thưởng mới:

```typescript
const newAward = await prisma.academic_awards.create({
  data: {
    background_id: studentBackgroundId,
    award_name: "Giải Nhì Olympic Vật lý",
    issuing_organization: "Bộ GD&ĐT",
    award_level: "Quốc gia",
    award_date: new Date("2024-06-20")
  }
});
```

### 4. Update một kinh nghiệm làm việc:

```typescript
const updatedWork = await prisma.work_experiences.update({
  where: { id: workExperienceId },
  data: {
    is_current: false,
    end_date: new Date(),
    achievements: "Completed 5 major projects successfully"
  }
});
```

### 5. Xóa một hoạt động ngoại khóa:

```typescript
await prisma.academic_extracurriculars.delete({
  where: { id: activityId }
});
```

---

## Lợi ích của Cấu trúc Mới

1. **Có cấu trúc và rõ ràng**: Mỗi loại hoạt động có bảng riêng với các trường phù hợp
2. **Dễ mở rộng**: Có thể thêm nhiều records cho mỗi loại mà không giới hạn
3. **Query hiệu quả**: Có thể query riêng từng loại hoặc tất cả cùng lúc
4. **Dữ liệu có cấu trúc**: Thay vì lưu text tự do, giờ có các trường cụ thể để lưu từng thông tin
5. **Dễ validate**: Có thể áp dụng validation rules cho từng trường
6. **Hỗ trợ AI tốt hơn**: Dữ liệu có cấu trúc giúp AI phân tích chính xác hơn

---

## Migration

Migration đã được tạo tự động với tên: `20260106092053_restructure_student_backgrounds`

Để áp dụng migration (nếu chưa apply):
```bash
npx prisma migrate deploy
```

Để regenerate Prisma Client:
```bash
npx prisma generate
```

---

## Ghi chú

- Tất cả các bảng đều có `onDelete: Cascade`, nghĩa là khi xóa `student_backgrounds`, tất cả dữ liệu liên quan sẽ tự động xóa
- Các trường datetime hỗ trợ `start_date`, `end_date` để track thời gian
- Có trường `is_current` cho work_experiences và research_experiences để đánh dấu đang tiếp tục
- Có index trên `background_id` để tăng tốc độ query

