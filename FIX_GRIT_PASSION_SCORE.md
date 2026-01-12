# 🔧 Fix: Lỗi "Unknown argument `passion_score`"

## ❌ Vấn đề

Khi submit GRIT test, API trả về lỗi:
```
Unknown argument `passion_score`. Available options are marked with ?.
```

**Nguyên nhân:** Database schema `grit_tests` thiếu 2 trường:
- `passion_score` (Điểm Đam mê)
- `perseverance_score` (Điểm Kiên trì)

---

## ✅ Đã fix

### **1. Cập nhật Schema**
Đã thêm 2 trường vào `prisma/schema.prisma`:

```prisma
model grit_tests {
  id           String     @id @default(uuid()) @db.Uuid
  student_id   String     @unique @db.Uuid
  student      students   @relation(...)
  
  status       TestStatus @default(IN_PROGRESS)
  current_step Int        @default(0)
  answers      Json       @default("{}")
  
  // --- KẾT QUẢ ---
  total_score         Float?
  passion_score       Float?  // ✅ MỚI
  perseverance_score  Float?  // ✅ MỚI
  level               String?    @db.VarChar(50)
  description         String?    @db.Text
  completed_at        DateTime?  @db.Timestamp(6)
  updated_at          DateTime?  @default(now()) @db.Timestamp(6)
}
```

### **2. Migration**
Đã tạo và apply migration:
```bash
npx prisma migrate dev --name add_grit_component_scores
```

Migration file: `prisma/migrations/20260108082102_add_grit_component_scores/migration.sql`

### **3. Regenerate Prisma Client**
```bash
# Đã stop dev server
Stop-Process -Name node -Force

# Đã regenerate Prisma client
npx prisma generate

# Đã restart dev server
npm run dev
```

---

## 🧪 Test lại

### **1. Test Submit GRIT**
```javascript
// Mở Console tại /dashboard/tests
const mockAnswers = {};
for (let i = 1; i <= 12; i++) {
    mockAnswers[i] = Math.floor(Math.random() * 5) + 1;
}

fetch('/api/tests/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        test_id: 'YOUR_TEST_ID',
        student_id: 'YOUR_STUDENT_ID',
        test_type: 'grit',
        answers: mockAnswers
    })
})
.then(r => r.json())
.then(result => {
    console.log('✅ Result:', result);
    if (result.success) {
        console.log('🎯 Total Score:', result.result.total_score);
        console.log('💖 Passion Score:', result.result.passion_score);
        console.log('💪 Perseverance Score:', result.result.perseverance_score);
        console.log('📊 Level:', result.result.level);
    }
})
```

### **2. Test qua UI**
```
1. Vào http://localhost:3000/dashboard/tests
2. Click "Bắt đầu" GRIT test
3. Làm hết 12 câu
4. ✅ Check: Không còn lỗi "Unknown argument"
5. ✅ Check: Kết quả hiển thị passion_score và perseverance_score
```

### **3. Verify Database**
```sql
-- Kiểm tra schema đã update chưa
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'grit_tests' 
  AND column_name IN ('passion_score', 'perseverance_score');

-- Expected output:
--   column_name        | data_type
-- ---------------------+-----------
--   passion_score      | double precision
--   perseverance_score | double precision
```

---

## 📊 Response Format (Mới)

Sau khi fix, API `/api/tests/submit` với GRIT test sẽ trả về:

```json
{
    "success": true,
    "message": "Test submitted and completed successfully",
    "result": {
        "total_score": 3.42,
        "passion_score": 3.33,          // ✅ MỚI
        "perseverance_score": 3.5,       // ✅ MỚI
        "level": "Trung bình",
        "description": "Có nghị lực ở mức độ cơ bản..."
    }
}
```

---

## 🔄 Migration Details

### **Migration SQL:**
```sql
-- AlterTable
ALTER TABLE "grit_tests" 
ADD COLUMN "passion_score" DOUBLE PRECISION,
ADD COLUMN "perseverance_score" DOUBLE PRECISION;
```

### **Migration Applied:**
```
✅ Migration: 20260108082102_add_grit_component_scores
✅ Database: postgres (Supabase)
✅ Status: Applied successfully
```

---

## ⚠️ Nếu vẫn còn lỗi

### **1. Restart lại hoàn toàn:**
```powershell
# Stop tất cả Node processes
Stop-Process -Name node -Force

# Clear Prisma cache
Remove-Item -Recurse -Force node_modules\.prisma

# Regenerate
npx prisma generate

# Restart dev server
npm run dev
```

### **2. Check Prisma client version:**
```bash
npx prisma -v
# Expected: 5.10.2 hoặc cao hơn
```

### **3. Verify schema:**
```bash
npx prisma validate
# Expected: ✔ Schema is valid
```

### **4. Check database connection:**
```bash
npx prisma db pull
# Expected: ✔ Introspected X models
```

---

## 📝 Files Changed

### **Modified:**
- ✅ `prisma/schema.prisma` - Added passion_score, perseverance_score
- ✅ `node_modules/@prisma/client` - Regenerated with new schema

### **Created:**
- ✅ `prisma/migrations/20260108082102_add_grit_component_scores/`
- ✅ `restart-and-generate.bat` - Helper script để restart & regenerate

---

## 🎯 Summary

**Problem:** 
```
❌ Unknown argument `passion_score`
```

**Solution:**
```
✅ Added passion_score and perseverance_score to grit_tests schema
✅ Applied migration to database
✅ Regenerated Prisma client
✅ Restarted dev server
```

**Status:** 
```
🎉 FIXED! GRIT test submission now works correctly
```

---

## 📞 Quick Commands

```bash
# Check migration status
npx prisma migrate status

# View database schema
npx prisma studio

# Reset database (⚠️ USE WITH CAUTION)
npx prisma migrate reset

# Generate client
npx prisma generate
```

---

**Fixed on:** January 8, 2026  
**Migration:** 20260108082102_add_grit_component_scores  
**Status:** ✅ Resolved

