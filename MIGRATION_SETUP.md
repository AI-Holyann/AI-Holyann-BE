# Migration Setup Guide

Hướng dẫn thiết lập và chạy database migrations cho dự án Hoex.

## Tổng quan

Dự án sử dụng Prisma Migrate để quản lý database schema và migrations. Tất cả các migration files được lưu trong thư mục `prisma/migrations/`.

## Cấu trúc Migrations

### 1. Migration: Drop Universities và Tạo Bảng Mới
**File**: `20260116085144_drop_universities_and_create_new_tables/migration.sql`

**Mô tả**: 
- Drop bảng `universities` cũ
- Tạo bảng `university` mới với UUID
- Tạo bảng `scholarship`
- Tạo bảng `faculty`
- Cập nhật `student_applications` để reference `university` (UUID)

**Cấu trúc bảng mới**:

#### `university`
- `id` (UUID, Primary Key)
- `name` (VARCHAR(255))
- `country` (VARCHAR(100))
- `description` (TEXT)
- `detail_information` (TEXT)
- `deadline` (JSONB) - Lưu ED, RD, EA dates
- `requirements` (TEXT)
- `status` (VARCHAR(50))
- `rank` (INTEGER)
- `url_link` (VARCHAR(500))
- `image_display_url` (VARCHAR(500))
- `created_at`, `updated_at` (TIMESTAMP)

**Lưu ý**: Cột `ai-matching` đã được xóa khỏi bảng `university`. Thông tin matching được lưu trong bảng `student_match_school`.

#### `scholarship`
- `id` (UUID, Primary Key)
- `universities_id` (UUID, Foreign Key → `university.id`)
- `name` (VARCHAR(255))
- `description` (TEXT)
- `deadline` (TIMESTAMP)
- `url_web` (VARCHAR(500))
- `created_at`, `updated_at` (TIMESTAMP)

#### `faculty`
- `id` (UUID, Primary Key)
- `university_id` (UUID, Foreign Key → `university.id`)
- `name` (VARCHAR(255))
- `description` (TEXT)
- `type` (VARCHAR(100))
- `url_web` (VARCHAR(500))
- `created_at`, `updated_at` (TIMESTAMP)

#### `student_match_school`
- `id` (UUID, Primary Key)
- `student_id` (UUID, Foreign Key → `students.user_id`)
- `university_id` (UUID, Foreign Key → `university.id`)
- `ai_matching` (VARCHAR(50)) - SchoolCategory: REACH, MATCH, SAFETY
- `match_score` (DECIMAL(5, 2)) - Điểm matching (0-100)
- `match_reason` (TEXT) - Lý do matching
- `created_at`, `updated_at` (TIMESTAMP)

**Lưu ý**: 
- Mỗi record đại diện cho một matching giữa student và university
- Unique constraint trên `(student_id, university_id)` để tránh duplicate
- Indexes trên `student_id`, `university_id`, và `ai_matching` để tối ưu query
- Tách thành bảng riêng thay vì JSONB để tối ưu performance và dễ query/filter

### 2. Migration: Insert Demo Universities Data
**File**: `20260116090000_insert_universities_demo_data/migration.sql`

**Mô tả**: 
- Insert 40 universities từ CSV demo data
- Không bao gồm cột `ai-matching` (đã được xóa)

### 3. Migration: Remove AI-Matching và Tạo Student Match School
**File**: `20260116090200_remove_ai_matching_and_create_student_match_school/migration.sql`

**Mô tả**: 
- Xóa cột `ai-matching` khỏi bảng `university`
- Tạo bảng `student_match_school` để lưu kết quả matching
- Mỗi record đại diện cho một matching giữa student và university
- Tách thành bảng riêng thay vì JSONB để tối ưu performance và dễ query

## Cách Chạy Migrations

### Development Environment

1. **Kiểm tra trạng thái migrations**:
   ```bash
   npx prisma migrate status
   ```

2. **Apply tất cả migrations chưa được apply**:
   ```bash
   npx prisma migrate deploy
   ```

3. **Hoặc sử dụng migrate dev (interactive)**:
   ```bash
   npx prisma migrate dev
   ```

### Production Environment

**LƯU Ý**: Chỉ sử dụng `migrate deploy` trong production, không dùng `migrate dev`.

```bash
npx prisma migrate deploy
```

### Sau khi chạy migration

1. **Generate Prisma Client** để cập nhật types:
   ```bash
   npx prisma generate
   ```

2. **Kiểm tra database** trên Supabase Dashboard để xác nhận các bảng đã được tạo.

## Rollback Migrations

**CẢNH BÁO**: Prisma Migrate không hỗ trợ rollback tự động. Nếu cần rollback:

1. **Tạo migration mới** để revert changes
2. **Hoặc restore từ backup** database

## Troubleshooting

### Migration đã được apply nhưng chưa thấy trong Supabase

1. Kiểm tra connection string trong `.env`:
   ```env
   DATABASE_URL="postgresql://..."
   DIRECT_URL="postgresql://..."
   ```

2. Verify migration đã được apply:
   ```bash
   npx prisma migrate status
   ```

3. Kiểm tra bảng `_prisma_migrations` trong database:
   ```sql
   SELECT * FROM "_prisma_migrations" ORDER BY finished_at DESC;
   ```

### Lỗi Foreign Key Constraint

Nếu gặp lỗi foreign key khi drop bảng:
- Migration đã tự động handle bằng cách drop constraints trước
- Nếu vẫn lỗi, kiểm tra xem có bảng nào khác đang reference không

### Lỗi Column Name với Dấu Gạch Ngang

**Lưu ý**: Cột `ai-matching` đã được xóa khỏi bảng `university`. Nếu cần sử dụng dấu gạch ngang trong tên cột, cần dùng quotes trong SQL:
```sql
"ai-matching"
```

Trong Prisma schema, sử dụng `@map("ai-matching")` để map.

## Best Practices

1. **Luôn backup database** trước khi chạy migration trong production
2. **Test migrations** trong development environment trước
3. **Review migration SQL** trước khi apply
4. **Không edit migrations đã được apply** - tạo migration mới thay vì sửa cũ
5. **Commit migration files** vào version control

## Tham khảo

- [Prisma Migrate Documentation](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
