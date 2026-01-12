# 🎯 HƯỚNG DẪN KHẮC PHỤC LỖI HOÀN CHỈNH

## 📋 Tổng quan tình hình

Bạn đang gặp **2 vấn đề chính**:

### 1. ❌ Lỗi đăng ký: "Supabase insert failed: permission denied"
**Nguyên nhân:** Thiếu `SUPABASE_SERVICE_ROLE_KEY` + RLS policies chưa đúng

### 2. ❌ Lỗi 404 sau đăng nhập: "Người dùng không tồn tại"
**Nguyên nhân:** User chỉ tồn tại trong 1 trong 2 database (Supabase hoặc Prisma)

---

## ✅ GIẢI PHÁP TOÀN DIỆN (THEO THỨ TỰ)

### **BƯỚC 1: Thêm SUPABASE_SERVICE_ROLE_KEY** ⭐ QUAN TRỌNG NHẤT

#### Cách A: Tự động (Khuyên dùng)
```powershell
.\setup-service-role-key.ps1
```

#### Cách B: Thủ công
1. Truy cập: https://supabase.com/dashboard/project/ahtvzqtykrenluzwajee
2. Vào **Settings** → **API**
3. Copy key **"service_role"** (secret, màu đỏ)
4. Mở file `.env`
5. Thêm dòng sau ngay sau `NEXT_PUBLIC_SUPABASE_ANON_KEY`:

```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...YOUR_KEY_HERE
```

6. **Lưu file!**

---

### **BƯỚC 2: Fix RLS Policies trong Supabase**

1. Truy cập: https://supabase.com/dashboard/project/ahtvzqtykrenluzwajee/sql/new

2. Mở file: `d:\holyann-ai-web\database\fix-rls-policies.sql`

3. Copy **TOÀN BỘ** nội dung file

4. Paste vào Supabase SQL Editor

5. Click **RUN** (hoặc nhấn Ctrl+Enter)

6. Đợi kết quả: `RLS Policies fixed successfully!`

**Nội dung SQL (backup nếu file không mở được):**

```sql
-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- Allow public INSERT for registration
DROP POLICY IF EXISTS "Allow public user registration" ON public.users;
CREATE POLICY "Allow public user registration"
ON public.users FOR INSERT TO public WITH CHECK (true);

-- Allow public SELECT for login
DROP POLICY IF EXISTS "Allow public user lookup" ON public.users;
CREATE POLICY "Allow public user lookup"
ON public.users FOR SELECT TO public USING (true);

-- Allow users to update own profile
DROP POLICY IF EXISTS "Allow users to update own profile" ON public.users;
CREATE POLICY "Allow users to update own profile"
ON public.users FOR UPDATE TO public
USING (auth.uid()::text = id)
WITH CHECK (auth.uid()::text = id);

-- Student policies
DROP POLICY IF EXISTS "Allow student profile creation" ON public.students;
CREATE POLICY "Allow student profile creation"
ON public.students FOR INSERT TO public WITH CHECK (true);

DROP POLICY IF EXISTS "Allow users to read own student profile" ON public.students;
CREATE POLICY "Allow users to read own student profile"
ON public.students FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Allow users to update own student profile" ON public.students;
CREATE POLICY "Allow users to update own student profile"
ON public.students FOR UPDATE TO public
USING (auth.uid()::text = user_id)
WITH CHECK (auth.uid()::text = user_id);

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.users TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.students TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
```

---

### **BƯỚC 3: Đồng bộ Users giữa Supabase và Local DB**

```powershell
npx ts-node sync-users.ts
```

**Output mong đợi:**
```
🔄 Starting user sync from Supabase to Local DB...
✅ Found X users in Supabase
✅ Synced user: test@example.com
  ✅ Created student profile for: test@example.com
========================================
SYNC SUMMARY:
✅ Successfully synced: X users
========================================
✅ Sync verification passed!
```

**Nếu lỗi "permission denied":**
- Quay lại Bước 1, kiểm tra `SUPABASE_SERVICE_ROLE_KEY`
- Verify key đúng (phải bắt đầu bằng `eyJ...`)

---

### **BƯỚC 4: Restart Dev Server**

```powershell
# Trong terminal đang chạy npm run dev:
# 1. Nhấn Ctrl+C để dừng
# 2. Chạy lại:
npm run dev
```

---

### **BƯỚC 5: Clear Browser Cache và Test**

1. **Clear cache:**
   - Mở DevTools (F12)
   - Right-click nút Refresh → **Empty Cache and Hard Reload**
   - Hoặc: Ctrl+Shift+Delete → Clear all

2. **Clear localStorage:**
   - F12 → Console tab
   - Chạy: `localStorage.clear(); location.reload();`

3. **Test đăng ký:**
   - http://localhost:3000/register
   - Điền thông tin
   - Submit
   - **Không còn lỗi permission denied**

4. **Test đăng nhập:**
   - http://localhost:3000/login
   - Nhập credentials
   - Submit
   - **Redirect về dashboard thành công**
   - **Không còn lỗi 404**

---

## 🧪 KIỂM TRA SAU KHI HOÀN TẤT

### Check 1: Verify Service Role Key
```powershell
Get-Content .env | Select-String "SUPABASE_SERVICE_ROLE_KEY"
```
✅ Phải thấy: `SUPABASE_SERVICE_ROLE_KEY=eyJ...`

### Check 2: Verify RLS Policies
Chạy trong Supabase SQL Editor:
```sql
SELECT tablename, policyname, cmd 
FROM pg_policies 
WHERE tablename IN ('users', 'students')
ORDER BY tablename, policyname;
```
✅ Phải thấy các policies: `Allow public user registration`, `Allow public user lookup`, etc.

### Check 3: Verify User Sync
```powershell
npx prisma studio
```
1. Mở: http://localhost:5555
2. Click table `users`
3. So sánh với Supabase Table Editor
✅ Số lượng users phải khớp nhau

### Check 4: Test Registration Flow
1. Clear localStorage
2. Đăng ký user mới
3. Check terminal logs:
```
✅ [DatabaseService] User created in Supabase: uuid-xxx
✅ [DatabaseService] Synced to Local DB
✅ [DatabaseService] Student profile created
```

### Check 5: Test Login Flow
1. Đăng nhập
2. Check không có lỗi 404
3. Dashboard hiển thị đúng thông tin user
4. Check logs:
```
✅ [Session] Token verified, userId: xxx
✅ [DatabaseService] Found user by ID in Local DB: xxx
```

---

## 📊 DEBUGGING

### Nếu vẫn lỗi đăng ký:

**Check logs terminal:**
```
❌ [DatabaseService] Supabase error: permission denied
```
→ Quay lại Bước 1 và 2

### Nếu vẫn lỗi 404:

**Check user có trong database không:**
```powershell
# Lấy userId từ browser console:
# F12 → Console → 
const token = localStorage.getItem('auth_token');
const payload = JSON.parse(atob(token.split('.')[1]));
console.log('User ID:', payload.userId);

# Sau đó check user:
npx ts-node sync-users.ts --check <USER_ID>
```

**Output mong đợi:**
```
📍 Supabase:
  ✅ Found: your-email@example.com

📍 Local DB (Prisma):
  ✅ Found: your-email@example.com
```

Nếu một trong hai là ❌, chạy lại Bước 3!

### Nếu sync script lỗi:

**Lỗi: "Invalid API key"**
- Service Role Key bị sai
- Copy lại từ Supabase

**Lỗi: "permission denied"**
- Chưa có Service Role Key
- Hoặc đang dùng Anon Key (sai loại)
- Verify key phải có role: "service_role"

**Lỗi: "Cannot connect to database"**
- Check `DATABASE_URL` trong `.env`
- Test: `npx prisma db pull`

---

## 🔒 LƯU Ý BẢO MẬT

### ⚠️ SUPABASE_SERVICE_ROLE_KEY

Key này có **TOÀN QUYỀN** truy cập database!

**KHÔNG BAO GIỜ:**
- ❌ Commit lên Git
- ❌ Share công khai
- ❌ Dùng ở client-side
- ❌ Post trong screenshots

**PHẢI:**
- ✅ Giữ trong `.env` (local only)
- ✅ `.env` nằm trong `.gitignore`
- ✅ Chỉ dùng server-side
- ✅ Rotate định kỳ

### 🔍 Verify .gitignore

```powershell
Get-Content .gitignore | Select-String ".env"
```
✅ Phải thấy: `.env` hoặc `.env*`

---

## 📁 FILES QUAN TRỌNG

### Documentation:
- `FIX_SESSION_404_ERROR.md` - Hướng dẫn fix lỗi 404
- `FIX_REGISTRATION_ERROR.md` - Hướng dẫn fix lỗi đăng ký
- `REGISTRATION_FIX_GUIDE.md` - Hướng dẫn toàn diện
- `THIS_FILE.md` - Tài liệu bạn đang đọc

### Scripts:
- `setup-service-role-key.ps1` - Tự động thêm Service Role Key
- `sync-users.ts` - Đồng bộ users
- `database/fix-rls-policies.sql` - Fix RLS policies

### Source Code (đã được sửa):
- `src/lib/services/database.service.ts` - Có fallback mechanism
- `src/lib/services/auth.service.ts` - Enhanced authentication
- `src/app/api/auth/session/route.ts` - Better logging
- `src/lib/supabase.ts` - Supabase client config

---

## ✅ CHECKLIST HOÀN CHỈNH

- [ ] **Bước 1:** Đã thêm `SUPABASE_SERVICE_ROLE_KEY` vào `.env`
- [ ] **Bước 2:** Đã chạy SQL script `fix-rls-policies.sql` trong Supabase
- [ ] **Bước 3:** Đã chạy `npx ts-node sync-users.ts` thành công
- [ ] **Bước 4:** Đã restart dev server
- [ ] **Bước 5:** Đã clear browser cache
- [ ] **Check 1:** Verify Service Role Key tồn tại
- [ ] **Check 2:** Verify RLS policies đã được tạo
- [ ] **Check 3:** Verify users đã đồng bộ
- [ ] **Check 4:** Test đăng ký thành công
- [ ] **Check 5:** Test đăng nhập không lỗi 404
- [ ] **Security:** Đảm bảo `.env` trong `.gitignore`

---

## 🎓 HIỂU RÕ VẤN ĐỀ

### Tại sao có 2 databases?

Hệ thống dùng **dual database architecture**:

1. **Supabase (Cloud):**
   - Primary database
   - Source of truth
   - Có RLS protection
   - Cần Service Role Key để bypass RLS

2. **Prisma/PostgreSQL (Local):**
   - Secondary database
   - Cache layer
   - Tăng tốc queries
   - Fallback khi Supabase fail

### Tại sao cần Service Role Key?

- Anon Key: Chỉ có quyền theo RLS policies
- Service Role Key: **Bypass RLS**, full access
- Đăng ký cần tạo user → cần Service Role Key

### Tại sao lỗi 404 xảy ra?

**Flow đăng nhập:**
1. User đăng nhập → nhận JWT token
2. Token chứa `userId`
3. Dashboard load → verify token
4. Tìm user theo `userId` trong database
5. **Nếu không tìm thấy → 404**

**Nguyên nhân:**
- User tạo trong Supabase nhưng sync fail → không có trong Prisma
- `findUserById()` tìm trong Prisma trước → không thấy → lỗi
- **Giải pháp:** Sync users từ Supabase sang Prisma

---

## 🆘 LIÊN HỆ HỖ TRỢ

Nếu vẫn gặp vấn đề sau khi làm hết các bước:

### Thông tin cần cung cấp:

1. **Terminal logs** khi chạy sync script
2. **Browser console errors** (F12)
3. **Output của:** `npx ts-node sync-users.ts --check <USER_ID>`
4. **Screenshot** lỗi (blur Service Role Key nếu có)

### Check logs:

```powershell
# Server logs - terminal đang chạy npm run dev

# Supabase logs - truy cập:
# https://supabase.com/dashboard/project/ahtvzqtykrenluzwajee/logs/api-logs

# Browser console - F12 → Console tab
```

---

## 🚀 SAU KHI HOÀN TẤT

Bạn sẽ có:
- ✅ Đăng ký thành công không lỗi permission
- ✅ Đăng nhập thành công không lỗi 404
- ✅ Users đồng bộ giữa 2 databases
- ✅ Dashboard hoạt động bình thường
- ✅ Hệ thống authentication ổn định

---

**Cập nhật:** 08/01/2026  
**Version:** 2.0.0  
**Tổng hợp:** Toàn bộ giải pháp cho lỗi đăng ký và lỗi 404

