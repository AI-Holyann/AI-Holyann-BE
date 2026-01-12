# HƯỚNG DẪN SỬA LỖI PERMISSION DENIED KHI ĐĂNG KÝ

## 🔴 Vấn đề
Lỗi: **"Supabase insert failed: permission denied for schema public (code: 42501)"**

## 🔍 Nguyên nhân
1. File `.env` thiếu `SUPABASE_SERVICE_ROLE_KEY`
2. RLS (Row Level Security) policies chưa được cấu hình đúng trên Supabase

## ✅ Giải pháp

### Bước 1: Lấy Service Role Key từ Supabase

1. Truy cập: https://supabase.com/dashboard/project/ahtvzqtykrenluzwajee
2. Vào **Settings** → **API**
3. Tìm mục **Project API keys**
4. Copy key có label **"service_role"** (secret key - KHÔNG ĐƯỢC SHARE)

### Bước 2: Thêm vào file `.env`

Mở file `d:\holyann-ai-web\.env` và thêm dòng sau (thay `YOUR_SERVICE_ROLE_KEY` bằng key vừa copy):

```env
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY_HERE
```

**Ví dụ:**
```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodHZ6cXR5a3Jlbmx1endhamVlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjcyODI3OCwiZXhwIjoyMDgyMzA0Mjc4fQ.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### Bước 3: Chạy SQL Script để fix RLS Policies

1. Truy cập: https://supabase.com/dashboard/project/ahtvzqtykrenluzwajee/sql/new
2. Copy nội dung file `database/fix-rls-policies.sql`
3. Paste vào SQL Editor và click **RUN**
4. Kiểm tra kết quả trả về "RLS Policies fixed successfully!"

### Bước 4: Restart Dev Server

```powershell
# Dừng server hiện tại (Ctrl+C)
# Sau đó chạy lại:
npm run dev
```

### Bước 5: Test đăng ký lại

1. Truy cập: http://localhost:3000/register
2. Điền thông tin và click **Tạo Tài Khoản**
3. Kiểm tra kết quả

## 🔒 Lưu ý bảo mật

**QUAN TRỌNG:** `SUPABASE_SERVICE_ROLE_KEY` là key có full quyền truy cập database, **KHÔNG BAO GIỜ:**
- Commit key này lên Git
- Share key này cho người khác
- Sử dụng key này ở client-side (browser)

File `.env` phải được thêm vào `.gitignore` để tránh leak keys.

## 📝 Kiểm tra

Sau khi làm xong các bước trên, bạn có thể verify bằng cách:

```sql
-- Chạy trong Supabase SQL Editor
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename IN ('users', 'students');
```

Phải thấy các policies:
- `Allow public user registration`
- `Allow public user lookup`
- `Allow student profile creation`

## 🆘 Nếu vẫn lỗi

1. Kiểm tra console log xem có message gì không
2. Verify Service Role Key đã đúng chưa
3. Kiểm tra RLS policies đã được tạo chưa
4. Clear browser cache và cookies
5. Restart lại dev server

## 📞 Liên hệ

Nếu vẫn gặp vấn đề, check logs chi tiết tại:
- Browser Console (F12)
- Terminal logs (server logs)
- Supabase Dashboard → Logs → API Logs

