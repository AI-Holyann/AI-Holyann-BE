# 🔧 Fix: GRIT Chart hiển thị "Duy trì hứng thú" = 0

## ❌ Vấn đề

**Hiện tượng:**
- Biểu đồ GRIT hiển thị "Duy trì hứng thú" = 0
- Nhưng database có `perseverance_score` = 2.67
- "Bền bỉ nỗ lực" cũng hiển thị sai

**Nguyên nhân:**
Code trong `ResultChart.tsx` đang tìm sai tên field:
```typescript
// ❌ SAI
{name: 'Bền bỉ nỗ lực', score: result.scores.Perseverance || 0}
{name: 'Duy trì hứng thú', score: result.scores.Consistency || 0}
```

Nhưng trong `result.scores` từ `page.tsx`, data được lưu với tên tiếng Việt:
```typescript
// ✅ ĐÚNG (từ page.tsx)
scores: {
    Grit: result.gritScore,
    'Kiên trì': result.perseveranceScore,  // perseverance
    'Đam mê': result.passionScore          // passion (consistency of interest)
}
```

---

## ✅ Đã fix

### **1. Cập nhật ResultChart.tsx**

**Dòng 38-41 (Grit Breakdown Data):**
```typescript
// TRƯỚC
const gritBreakdownData = result.type === 'GRIT' ? [
    {name: 'Bền bỉ nỗ lực', score: result.scores.Perseverance || 0, fill: 'var(--grit-perseverance)'},
    {name: 'Duy trì hứng thú', score: result.scores.Consistency || 0, fill: 'var(--grit-consistency)'},
] : [];

// SAU
const gritBreakdownData = result.type === 'GRIT' ? [
    {name: 'Kiên trì', score: result.scores['Kiên trì'] || result.scores.Perseverance || 0, fill: 'var(--grit-perseverance)'},
    {name: 'Đam mê', score: result.scores['Đam mê'] || result.scores.Passion || 0, fill: 'var(--grit-consistency)'},
] : [];
```

**Dòng 136-140 (Description):**
```typescript
// TRƯỚC
<p><span className="font-bold text-purple-600">Bền bỉ nỗ lực:</span> Khả năng làm việc chăm chỉ trước thử thách.</p>
<p className="mt-1"><span className="font-bold text-pink-500">Duy trì hứng thú:</span> Khả năng giữ vững mục tiêu qua thời gian dài.</p>

// SAU
<p><span className="font-bold text-purple-600">Kiên trì:</span> Khả năng làm việc chăm chỉ trước thử thách.</p>
<p className="mt-1"><span className="font-bold text-pink-500">Đam mê:</span> Tính nhất quán trong sở thích và mục tiêu qua thời gian dài.</p>
```

---

## 📊 GRIT Components Mapping

Theo `grit-questions.ts`:

| Component | English | Tiếng Việt | Database Field |
|-----------|---------|------------|----------------|
| **Perseverance** | Perseverance of Effort | **Kiên trì** | `perseverance_score` |
| **Passion** | Consistency of Interest | **Đam mê** | `passion_score` |

### **Luồng data:**

```
Database (grit_tests)
  ↓
  passion_score: 2.67
  perseverance_score: 2.67
  ↓
API Response (/api/tests/submit)
  ↓
  result.passion_score: 2.67
  result.perseverance_score: 2.67
  ↓
page.tsx (calculateGritResult / handleTestComplete)
  ↓
  scores: {
    Grit: 3.42,
    'Đam mê': 2.67,     // passion
    'Kiên trì': 2.67    // perseverance
  }
  ↓
ResultChart.tsx
  ↓
  gritBreakdownData: [
    {name: 'Kiên trì', score: 2.67},    ✅ Hiển thị đúng
    {name: 'Đam mê', score: 2.67}       ✅ Hiển thị đúng
  ]
```

---

## 🧪 Test

### **1. Refresh browser**
```
Ctrl + Shift + R (hard refresh)
```

### **2. Check biểu đồ GRIT**
Sau khi làm xong GRIT test, biểu đồ phải hiển thị:
- ✅ **Kiên trì:** 2.67 (hoặc giá trị từ DB)
- ✅ **Đam mê:** 2.67 (hoặc giá trị từ DB)

### **3. Verify trong Console**
```javascript
// Mở Console tại trang kết quả GRIT
// Check TestResult object
console.log('Scores:', result.scores);
// Expected output:
// {
//   Grit: 3.42,
//   'Kiên trì': 2.67,
//   'Đam mê': 2.67
// }
```

---

## 🔍 Root Cause Analysis

### **Tại sao có vấn đề này?**

1. **Naming inconsistency:**
   - Database dùng: `passion_score`, `perseverance_score`
   - page.tsx lưu vào TestResult với keys tiếng Việt: `'Đam mê'`, `'Kiên trì'`
   - ResultChart.tsx tìm với keys tiếng Anh: `Consistency`, `Perseverance`

2. **Language mixing:**
   - GRIT_COMPONENTS dùng tiếng Việt (`name_vi`)
   - TestResult.scores sử dụng `name_vi` làm key
   - ResultChart không biết về convention này

### **Giải pháp dài hạn:**

**Option 1: Standardize to English keys**
```typescript
// page.tsx
scores: {
    Grit: result.gritScore,
    Passion: result.passionScore,
    Perseverance: result.perseveranceScore
}

// ResultChart.tsx
{name: 'Đam mê', score: result.scores.Passion}
{name: 'Kiên trì', score: result.scores.Perseverance}
```

**Option 2: Use consistent Vietnamese keys**
```typescript
// Keep current approach but document it clearly
// All GRIT scores use Vietnamese keys from GRIT_COMPONENTS.name_vi
```

**Current fix sử dụng fallback:**
```typescript
result.scores['Kiên trì'] || result.scores.Perseverance || 0
// Cố gắng tìm cả 2 variants
```

---

## 📝 Files Changed

### **Modified:**
- ✅ `src/components/Test/ResultChart.tsx`
  - Line 38-41: Fixed gritBreakdownData to use Vietnamese keys
  - Line 136-140: Updated descriptions to match actual names

---

## ✅ Verification Checklist

- [x] Code updated in ResultChart.tsx
- [x] Vietnamese keys match page.tsx output
- [x] Fallback to English keys for compatibility
- [x] Descriptions updated
- [ ] Browser hard refresh
- [ ] Test with existing GRIT result
- [ ] Test with new GRIT submission
- [ ] Verify chart displays correct values

---

## 🎯 Expected Result

**Trước:**
```
Biểu đồ:
  Bền bỉ nỗ lực: 0 ❌
  Duy trì hứng thú: 0 ❌

Database:
  passion_score: 2.67 ✅
  perseverance_score: 2.67 ✅
```

**Sau:**
```
Biểu đồ:
  Kiên trì: 2.67 ✅
  Đam mê: 2.67 ✅

Database:
  passion_score: 2.67 ✅
  perseverance_score: 2.67 ✅
```

---

## 📞 Quick Debug

Nếu vẫn thấy 0, check:

```javascript
// 1. Check TestResult object
console.log('Result:', result);
console.log('Scores:', result.scores);

// 2. Check specific keys
console.log('Kiên trì:', result.scores['Kiên trì']);
console.log('Đam mê:', result.scores['Đam mê']);
console.log('Perseverance:', result.scores.Perseverance);
console.log('Passion:', result.scores.Passion);

// 3. Check all keys
console.log('All keys:', Object.keys(result.scores));
```

---

**Status:** ✅ **FIXED**  
**Fixed on:** January 8, 2026  
**Impact:** Visual bug - Chart không hiển thị đúng data  
**Solution:** Match Vietnamese key names between page.tsx và ResultChart.tsx

