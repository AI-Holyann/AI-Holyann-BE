# 🔧 KHẮC PHỤC LỖI ĐĂNG KÝ - PERMISSION DENIED

## 📋 Tổng quan

Lỗi **"Supabase insert failed: permission denied for schema public (code: 42501)"** khi thực hiện đăng ký tài khoản.

### Nguyên nhân chính:
1. ❌ **Thiếu `SUPABASE_SERVICE_ROLE_KEY`** trong file `.env`
2. ❌ **RLS (Row Level Security) Policies** chưa được cấu hình đúng

---

## ✅ GIẢI PHÁP 1: CẤU HÌNH SERVICE ROLE KEY (KHUYÊN DÙNG)

### Bước 1: Chạy script tự động

```powershell
cd d:\holyann-ai-web
.\setup-service-role-key.ps1
```

Script sẽ hướng dẫn bạn:
1. Truy cập Supabase Dashboard
2. Copy Service Role Key
3. Tự động thêm vào file `.env`

### Bước 2: Chạy SQL Script để fix RLS

1. Truy cập: https://supabase.com/dashboard/project/ahtvzqtykrenluzwajee/sql/new
2. Copy toàn bộ nội dung file: `database/fix-rls-policies.sql`
3. Paste vào SQL Editor
4. Click **RUN**
5. Kiểm tra message: "RLS Policies fixed successfully!"

### Bước 3: Restart Dev Server

```powershell
# Dừng server (Ctrl+C trong terminal đang chạy npm run dev)
# Sau đó:
npm run dev
```

### Bước 4: Test lại

Truy cập: http://localhost:3000/register và thử đăng ký.

---

## ✅ GIẢI PHÁP 2: CẤU HÌNH THỦ CÔNG

### Bước 1: Lấy Service Role Key

1. Truy cập: https://supabase.com/dashboard/project/ahtvzqtykrenluzwajee
2. Vào: **Settings** → **API**
3. Tìm **Project API keys**
4. Copy key có label **"service_role"** (secret key)

### Bước 2: Thêm vào .env

Mở file `d:\holyann-ai-web\.env` và thêm dòng:

```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodHZ6cXR5a3Jlbmx1endhamVlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjcyODI3OCwiZXhwIjoyMDgyMzA0Mjc4fQ.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### Bước 3-4: Giống Giải pháp 1

---

## ✅ GIẢI PHÁP 3: SỬ DỤNG FALLBACK (ĐÃ TỰ ĐỘNG)

Code đã được cập nhật để tự động fallback sang Prisma (Local DB) nếu Supabase bị lỗi permission.

**Ưu điểm:**
- Không cần cấu hình Service Role Key
- Vẫn tạo được user trong Local DB

**Nhược điểm:**
- Không đồng bộ lên Supabase
- Chỉ nên dùng cho môi trường development

---

## 🔒 LƯU Ý BẢO MẬT

### ⚠️ QUAN TRỌNG

**SUPABASE_SERVICE_ROLE_KEY** là key có **FULL quyền truy cập** vào database!

**KHÔNG BAO GIỜ:**
- ❌ Commit key này lên Git
- ❌ Share key này cho người khác
- ❌ Sử dụng key này ở client-side (browser)
- ❌ Để lộ key trong screenshots, video demos

**PHẢI:**
- ✅ Giữ key trong file `.env` (local only)
- ✅ Đảm bảo `.env` có trong `.gitignore`
- ✅ Chỉ dùng key này ở server-side
- ✅ Rotate key định kỳ (6 tháng/năm)

---

## 🧪 KIỂM TRA SAU KHI SỬA

### 1. Verify Environment Variables

```powershell
# Kiểm tra .env có SUPABASE_SERVICE_ROLE_KEY chưa
Get-Content .env | Select-String "SUPABASE_SERVICE_ROLE_KEY"
```

Phải thấy output: `SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...`

### 2. Verify RLS Policies

Chạy trong Supabase SQL Editor:

```sql
SELECT schemaname, tablename, policyname, cmd, roles
FROM pg_policies
WHERE tablename IN ('users', 'students')
ORDER BY tablename, policyname;
```

Phải thấy các policies:
- `Allow public user registration` (INSERT)
- `Allow public user lookup` (SELECT)
- `Allow student profile creation` (INSERT)

### 3. Test Registration

1. Mở: http://localhost:3000/register
2. Điền form:
   - Họ và Tên: `Test User`
   - Email: `test@example.com`
   - Mật khẩu: `password123`
3. Click **Tạo Tài Khoản**
4. Kiểm tra kết quả

**Kết quả mong đợi:**
- ✅ Redirect về trang login
- ✅ Message: "Đăng ký thành công"
- ✅ User xuất hiện trong Supabase Table Editor

---

## 🐛 TROUBLESHOOTING

### Lỗi: "SUPABASE_SERVICE_ROLE_KEY is not defined"

**Nguyên nhân:** File `.env` chưa được load hoặc key chưa được thêm.

**Giải pháp:**
1. Restart dev server
2. Kiểm tra file `.env` có tồn tại không
3. Verify key đã được thêm đúng format

### Lỗi: "Invalid API key"

**Nguyên nhân:** Service Role Key bị sai hoặc copy thiếu.

**Giải pháp:**
1. Re-copy key từ Supabase Dashboard
2. Đảm bảo không có space/newline thừa
3. Key phải bắt đầu bằng `eyJ...`

### Lỗi: "User created but not syncing"

**Nguyên nhân:** Local DB (Prisma) có vấn đề connection.

**Giải pháp:**
1. Check `DATABASE_URL` trong `.env`
2. Test Prisma connection: `npx prisma db pull`
3. Xem logs trong terminal

### Vẫn thấy lỗi permission denied

**Giải pháp:**
1. Kiểm tra lại SQL script đã chạy chưa
2. Verify policies bằng SQL query ở trên
3. Clear browser cache và cookies
4. Thử đăng ký với email khác

---

## 📚 TÀI LIỆU THAM KHẢO

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase API Keys Guide](https://supabase.com/docs/guides/api/api-keys)
- [Prisma + Supabase Best Practices](https://www.prisma.io/docs/guides/database/supabase)

---

## 📞 HỖ TRỢ

Nếu vẫn gặp vấn đề sau khi thử tất cả giải pháp trên:

1. **Check logs:**
   - Browser Console (F12)
   - Terminal logs (server)
   - Supabase Dashboard → Logs → API Logs

2. **Thông tin cần cung cấp:**
   - Screenshot lỗi từ browser console
   - Terminal logs khi submit form đăng ký
   - Kết quả query kiểm tra RLS policies

3. **Files liên quan:**
   - `src/lib/services/database.service.ts`
   - `src/lib/services/auth.service.ts`
   - `src/app/api/auth/register/route.ts`
   - `.env` (KHÔNG share nội dung, chỉ confirm có key nào)

---

## ✅ CHECKLIST

- [ ] Đã thêm `SUPABASE_SERVICE_ROLE_KEY` vào `.env`
- [ ] Đã chạy SQL script `fix-rls-policies.sql`
- [ ] Đã restart dev server
- [ ] Đã test đăng ký thành công
- [ ] Đã verify user trong Supabase Table Editor
- [ ] Đã đảm bảo `.env` có trong `.gitignore`

---

**Cập nhật:** 08/01/2026
**Version:** 1.0.0

