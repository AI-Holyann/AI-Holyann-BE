# 🔧 KHẮC PHỤC LỖI 404 "NGƯỜI DÙNG KHÔNG TỒN TẠI" SAU KHI ĐĂNG NHẬP

## 📋 Vấn đề

Bạn đã đăng nhập thành công nhưng khi truy cập dashboard lại gặp lỗi:
```
{success: false, message: "Người dùng không tồn tại"}
```

## 🔍 Nguyên nhân

Khi đăng nhập/đăng ký, user được lưu vào database, nhưng có thể:
1. User chỉ tồn tại trong **Supabase** mà không có trong **Local DB (Prisma)**
2. User chỉ tồn tại trong **Local DB** mà không có trong **Supabase**
3. JWT token chứa `userId` không khớp với user trong database

Khi bạn truy cập dashboard:
- Frontend gửi request với JWT token
- Backend gọi `/api/auth/session` để verify
- API này tìm user theo `userId` từ token
- Nếu không tìm thấy trong cả 2 database → 404 error

---

## ✅ GIẢI PHÁP NHANH (KHUYÊN DÙNG)

### Bước 1: Chạy script đồng bộ users

```powershell
# Trong terminal tại thư mục project
npx ts-node sync-users.ts
```

Script này sẽ:
- Lấy tất cả users từ Supabase
- Đồng bộ vào Local DB (Prisma)
- Tạo student profiles nếu thiếu
- Hiển thị báo cáo chi tiết

**Output mẫu:**
```
🔄 Starting user sync from Supabase to Local DB...

✅ Found 3 users in Supabase

✅ Synced user: test@example.com (uuid-123)
  ✅ Created student profile for: test@example.com
⏭️  Skipping user (already exists): admin@example.com

========================================
SYNC SUMMARY:
✅ Successfully synced: 2 users
⏭️  Skipped (already exist): 1 users
❌ Errors: 0 users
========================================

✅ Sync verification passed! Databases are in sync.
```

### Bước 2: Restart dev server

```powershell
# Trong terminal đang chạy npm run dev, nhấn Ctrl+C để dừng
# Sau đó chạy lại:
npm run dev
```

### Bước 3: Clear browser cache và thử lại

1. Mở DevTools (F12)
2. Right-click vào nút Refresh → **Empty Cache and Hard Reload**
3. Hoặc: **Ctrl+Shift+Delete** → Clear browsing data
4. Truy cập lại: http://localhost:3000/dashboard

---

## 🔍 KIỂM TRA USER CỤ THỂ

Nếu bạn biết `userId` từ JWT token hoặc logs, có thể kiểm tra user đó:

```powershell
npx ts-node sync-users.ts --check <USER_ID>
```

**Ví dụ:**
```powershell
npx ts-node sync-users.ts --check 550e8400-e29b-41d4-a716-446655440000
```

**Output:**
```
🔍 Checking user: 550e8400-e29b-41d4-a716-446655440000
========================================
📍 Supabase:
  ✅ Found: test@example.com
     Role: STUDENT
     Provider: LOCAL

📍 Local DB (Prisma):
  ❌ Not found
========================================
```

Nếu thấy **Supabase: ✅** nhưng **Local DB: ❌**, chạy sync script ở Bước 1.

---

## 🛠️ GIẢI PHÁP THỦ CÔNG

### Cách 1: Xóa localStorage và đăng nhập lại

1. Mở DevTools (F12) → Console tab
2. Chạy lệnh:
```javascript
localStorage.clear();
location.reload();
```
3. Đăng nhập lại tại: http://localhost:3000/login

### Cách 2: Kiểm tra và sửa trong database

#### Kiểm tra Supabase:
1. Truy cập: https://supabase.com/dashboard/project/ahtvzqtykrenluzwajee
2. Vào **Table Editor** → `users`
3. Tìm user của bạn theo email
4. Copy `id` của user

#### Kiểm tra Local DB:
```powershell
npx prisma studio
```
1. Mở browser tại: http://localhost:5555
2. Click vào table `users`
3. Tìm user theo email
4. So sánh `id` với Supabase

#### Nếu thiếu trong Local DB:
Chạy sync script (Bước 1 ở trên)

---

## 🔐 GIẢI PHÁP DÀI HẠN

### 1. Đảm bảo có Service Role Key

File `.env` phải có:
```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Nếu chưa có, xem file `FIX_REGISTRATION_ERROR.md` hoặc chạy:
```powershell
.\setup-service-role-key.ps1
```

### 2. Đảm bảo RLS Policies đúng

Chạy SQL script trong Supabase SQL Editor:
```sql
-- Copy từ file: database/fix-rls-policies.sql
```

### 3. Code đã được cải thiện

Code hiện tại đã có:
- ✅ Fallback mechanism (Supabase ↔ Prisma)
- ✅ Auto-sync khi tìm user
- ✅ Detailed logging
- ✅ Error handling tốt hơn

---

## 📊 DEBUGGING

### Xem logs chi tiết

Khi gặp lỗi, check terminal logs:

```
✅ [Session] Token verified, userId: 550e8400-...
🔍 [DatabaseService] Finding user by ID: 550e8400-...
⚠️  [DatabaseService] User not found in Local DB by ID: 550e8400-...
🔄 [DatabaseService] Trying Supabase for user ID: 550e8400-...
❌ [DatabaseService] Supabase error: Row not found
❌ [Session] User not found in database: 550e8400-...
```

Nếu thấy:
- **"User not found in Local DB"** → Chạy sync script
- **"Supabase error: Row not found"** → User không tồn tại, cần đăng ký lại
- **"Token verification failed"** → Token hết hạn, đăng nhập lại

### Kiểm tra JWT token

Trong browser DevTools (F12) → Application tab → Local Storage:

```javascript
// Lấy token
const token = localStorage.getItem('auth_token');
console.log(token);

// Decode token (chỉ xem, không verify)
const payload = JSON.parse(atob(token.split('.')[1]));
console.log('User ID:', payload.userId);
console.log('Email:', payload.email);
console.log('Role:', payload.role);
```

Copy `userId` và kiểm tra bằng:
```powershell
npx ts-node sync-users.ts --check <USER_ID>
```

---

## ⚠️ LƯU Ý

### 1. Circuit Breaker
Nếu Local DB (Prisma) bị lỗi nhiều lần, circuit breaker sẽ mở:
```
⚠️ [DatabaseService] Local DB circuit breaker is open, using Supabase only
```

**Giải pháp:**
- Kiểm tra `DATABASE_URL` trong `.env`
- Test connection: `npx prisma db pull`
- Restart dev server

### 2. Dual Database Sync
Hệ thống sử dụng 2 databases:
- **Supabase** (primary) - Cloud database
- **Prisma/PostgreSQL** (secondary) - Local cache

**Best practices:**
- Supabase là source of truth
- Local DB là cache để tăng tốc
- Chạy sync định kỳ nếu cần

### 3. Token Expiration
JWT tokens có thời hạn 7 ngày. Nếu token hết hạn:
- Xóa localStorage và đăng nhập lại
- Hoặc implement refresh token mechanism

---

## 🧪 TEST SAU KHI SỬA

### Test flow hoàn chỉnh:

1. **Clear cache:**
```javascript
localStorage.clear();
```

2. **Đăng ký user mới:**
- Truy cập: http://localhost:3000/register
- Điền thông tin
- Submit

3. **Kiểm tra logs:**
```
✅ [DatabaseService] User created in Supabase: uuid-abc
✅ [DatabaseService] Synced to Local DB
✅ [DatabaseService] Student profile created
```

4. **Đăng nhập:**
- Truy cập: http://localhost:3000/login
- Nhập credentials
- Submit

5. **Verify dashboard:**
- Tự động redirect về `/dashboard`
- Không có lỗi 404
- Hiển thị thông tin user đúng

6. **Check databases:**
```powershell
# Check Supabase
npx ts-node sync-users.ts --check <USER_ID>

# Check Local DB
npx prisma studio
```

Cả 2 phải có user với cùng ID!

---

## 📞 HỖ TRỢ THÊM

### Files liên quan:
- `src/lib/services/database.service.ts` - Database operations
- `src/lib/services/auth.service.ts` - Authentication logic
- `src/app/api/auth/session/route.ts` - Session verification
- `sync-users.ts` - Sync script

### Commands hữu ích:

```powershell
# Xem schema database
npx prisma studio

# Pull schema từ database
npx prisma db pull

# Push schema lên database
npx prisma db push

# Generate Prisma Client
npx prisma generate

# Xem logs Supabase
# Truy cập: https://supabase.com/dashboard/project/ahtvzqtykrenluzwajee/logs/api-logs
```

---

## ✅ CHECKLIST

- [ ] Đã chạy sync script: `npx ts-node sync-users.ts`
- [ ] Đã verify users đồng bộ thành công
- [ ] Đã restart dev server
- [ ] Đã clear browser cache
- [ ] Đã test đăng nhập lại
- [ ] Không còn lỗi 404
- [ ] Dashboard hiển thị đúng

---

**Cập nhật:** 08/01/2026  
**Version:** 1.0.0  
**Script:** `sync-users.ts`

