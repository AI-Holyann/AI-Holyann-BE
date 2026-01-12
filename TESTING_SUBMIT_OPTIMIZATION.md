# 🧪 Hướng dẫn Test Flow Mới

## 📝 Cách test tối ưu hóa mới

### **1. Kiểm tra API endpoint mới**

#### Test với cURL (PowerShell):
```powershell
# Test MBTI submission
$body = @{
    test_id = "your-test-id-here"
    student_id = "your-student-id-here"
    test_type = "mbti"
    answers = @{
        1 = -2
        2 = 1
        3 = 0
        # ... 60 câu
    }
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/tests/submit" -Method POST -ContentType "application/json" -Body $body
```

#### Test với Browser Console:
```javascript
// 1. Mở dashboard/tests page
// 2. Mở DevTools Console
// 3. Tạo mock answers
const mockAnswers = {};
for (let i = 1; i <= 60; i++) {
    mockAnswers[i] = Math.floor(Math.random() * 7) - 3; // -3 to 3
}

// 4. Gửi test
fetch('/api/tests/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        test_id: 'your-test-id',
        student_id: 'your-student-id',
        test_type: 'mbti',
        answers: mockAnswers
    })
})
.then(r => r.json())
.then(console.log)
```

---

### **2. Test Manual qua UI**

#### **MBTI Test:**
1. ✅ Login vào hệ thống
2. ✅ Vào trang `/dashboard/tests`
3. ✅ Click "Bắt đầu" MBTI test
4. ✅ Trả lời hết 60 câu hỏi (chọn nhanh bất kỳ)
5. ✅ Mở DevTools → Network tab
6. ✅ Kiểm tra:
   - Chỉ có **1 request** đến `/api/tests/submit` (không phải 60 requests)
   - Request payload chứa tất cả 60 answers
   - Response trả về `result_type` (VD: "INTJ")
   - Response trả về `scores` object
7. ✅ Check màn hình kết quả hiển thị đúng

#### **RIASEC Test:**
1. ✅ Làm tương tự, 48 câu
2. ✅ Check chỉ có 1 request
3. ✅ Check response có `result_code` (VD: "RIA")

#### **GRIT Test:**
1. ✅ Làm tương tự, 12 câu
2. ✅ Check chỉ có 1 request
3. ✅ Check response có `total_score` và `level`

---

### **3. Kiểm tra Database**

#### **Supabase Dashboard:**
1. Vào Supabase dashboard
2. Table Editor → `mbti_tests`
3. Tìm test vừa làm (theo `student_id`)
4. Kiểm tra:
   - ✅ `answers` field có array 60 số (-3 đến 3)
   - ✅ `status` = "COMPLETED"
   - ✅ `result_type` có giá trị (VD: "INTJ")
   - ✅ `score_e`, `score_i`, etc. có giá trị
   - ✅ `current_step` = 60

#### **SQL Query:**
```sql
-- Check MBTI test
SELECT 
    id, 
    student_id, 
    status, 
    result_type,
    jsonb_array_length(answers) as answer_count,
    current_step,
    created_at,
    updated_at
FROM mbti_tests
WHERE student_id = 'your-student-id'
ORDER BY created_at DESC
LIMIT 1;

-- Check RIASEC test
SELECT 
    id, 
    student_id, 
    status, 
    result_code,
    jsonb_object_keys(answers) as answer_keys,
    current_step
FROM riasec_tests
WHERE student_id = 'your-student-id'
ORDER BY created_at DESC
LIMIT 1;

-- Check GRIT test
SELECT 
    id, 
    student_id, 
    status, 
    total_score,
    level,
    current_step
FROM grit_tests
WHERE student_id = 'your-student-id'
ORDER BY created_at DESC
LIMIT 1;
```

---

### **4. Performance Testing**

#### **Network Analysis:**
1. Mở DevTools → Network tab
2. Filter: XHR/Fetch
3. Clear all
4. Làm 1 bài test hoàn chỉnh
5. **Expected results:**
   - `/api/tests` - 1 request (create test)
   - `/api/tests/submit` - 1 request (submit all answers)
   - **Total: 2 requests** (not 61!)

#### **Timing Analysis:**
```javascript
// Trong browser console
console.time('Test Submission')

// Làm test (hoặc dùng mock)
await fetch('/api/tests/submit', { ... })

console.timeEnd('Test Submission')
// Expected: < 1000ms (< 1 giây)
```

#### **Old vs New Comparison:**

| Metric | Old Flow | New Flow | Improvement |
|--------|----------|----------|-------------|
| Requests (MBTI) | 60 | 1 | 98.3% ↓ |
| Time to submit | 5-10s | <1s | ~90% faster |
| Payload size | 60 x ~100B | 1 x ~5KB | More efficient |
| Error handling | Complex (60 points of failure) | Simple (1 point) | Much better |

---

### **5. Error Handling Tests**

#### **Test Invalid Input:**
```javascript
// Test 1: Thiếu test_id
fetch('/api/tests/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        student_id: 'test',
        test_type: 'mbti',
        answers: {}
    })
})
// Expected: 400 error, "Missing required fields"

// Test 2: Wrong answer count
fetch('/api/tests/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        test_id: 'test',
        student_id: 'test',
        test_type: 'mbti',
        answers: { 1: 0, 2: 1 } // Only 2 answers
    })
})
// Expected: 400 error, "MBTI test requires 60 answers"

// Test 3: Out of range answer
fetch('/api/tests/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        test_id: 'test',
        student_id: 'test',
        test_type: 'mbti',
        answers: { 1: 10 } // Out of range
    })
})
// Expected: 400 error, "MBTI answer must be between -3 and 3"
```

#### **Test Network Failure:**
1. Mở DevTools → Network tab
2. Set throttling to "Offline"
3. Làm test, submit
4. Expected: Error message hiển thị "Có lỗi xảy ra..."
5. Check localStorage có lưu answers không (for recovery)

---

### **6. Integration Tests**

#### **Complete User Flow:**
```javascript
// Scenario: User làm đủ 3 bài test
async function testCompleteFlow() {
    // 1. Login
    await fetch('/api/auth/login', { ... })
    
    // 2. Start MBTI
    const mbtiStart = await fetch('/api/tests', {
        method: 'POST',
        body: JSON.stringify({ student_id: 'test', test_type: 'mbti' })
    })
    const { test_id: mbtiId } = await mbtiStart.json()
    
    // 3. Submit MBTI (1 request!)
    const mbtiResult = await fetch('/api/tests/submit', {
        method: 'POST',
        body: JSON.stringify({
            test_id: mbtiId,
            student_id: 'test',
            test_type: 'mbti',
            answers: generateMockAnswers(60, -3, 3)
        })
    })
    console.log('MBTI:', await mbtiResult.json())
    
    // 4. Start RIASEC
    const riasecStart = await fetch('/api/tests', {
        method: 'POST',
        body: JSON.stringify({ student_id: 'test', test_type: 'riasec' })
    })
    const { test_id: riasecId } = await riasecStart.json()
    
    // 5. Submit RIASEC (1 request!)
    const riasecResult = await fetch('/api/tests/submit', {
        method: 'POST',
        body: JSON.stringify({
            test_id: riasecId,
            student_id: 'test',
            test_type: 'riasec',
            answers: generateMockAnswers(48, 1, 5)
        })
    })
    console.log('RIASEC:', await riasecResult.json())
    
    // 6. Start GRIT
    const gritStart = await fetch('/api/tests', {
        method: 'POST',
        body: JSON.stringify({ student_id: 'test', test_type: 'grit' })
    })
    const { test_id: gritId } = await gritStart.json()
    
    // 7. Submit GRIT (1 request!)
    const gritResult = await fetch('/api/tests/submit', {
        method: 'POST',
        body: JSON.stringify({
            test_id: gritId,
            student_id: 'test',
            test_type: 'grit',
            answers: generateMockAnswers(12, 1, 5)
        })
    })
    console.log('GRIT:', await gritResult.json())
    
    // 8. Complete all and get career recommendations
    const complete = await fetch('/api/tests/complete', {
        method: 'POST',
        body: JSON.stringify({ student_id: 'test' })
    })
    console.log('Career Recs:', await complete.json())
}

function generateMockAnswers(count, min, max) {
    const answers = {}
    for (let i = 1; i <= count; i++) {
        answers[i] = Math.floor(Math.random() * (max - min + 1)) + min
    }
    return answers
}

// Run test
testCompleteFlow()
```

---

### **7. Monitoring & Logging**

#### **Check Server Logs:**
```bash
# Tìm logs trong console
# Expected output:
📤 [Submit Test] Submitting test: { test_id: '...', student_id: '...', test_type: 'mbti', answersCount: 60 }
✅ [MBTI] Calculated result: INTJ
✅ [Submit Test] Test completed successfully: mbti
```

#### **Check Browser Console:**
```javascript
// Expected logs:
📤 [Submit] Submitting all answers at once: { test_id: '...', test_type: 'MBTI', count: 60 }
✅ [Submit] Success: { result_type: 'INTJ', scores: {...} }
```

---

### **8. Rollback Plan (If Issues)**

Nếu có vấn đề với flow mới:

1. **Quick Fix:** Comment out new code, uncomment old code
```typescript
// New (có vấn đề)
// const result = await submitAnswersToApi(answers, currentTestType)

// Old (fallback)
await submitAnswersToApiOld(answers, currentTestType)
const res = await fetch('/api/tests/complete', ...)
```

2. **Temporary Disable:** Rename API route
```bash
# Rename to disable
mv src/app/api/tests/submit/route.ts src/app/api/tests/submit/route.ts.disabled
```

3. **Feature Flag:**
```typescript
const USE_NEW_SUBMIT_FLOW = process.env.NEXT_PUBLIC_USE_NEW_SUBMIT === 'true'

if (USE_NEW_SUBMIT_FLOW) {
    await submitAnswersToApi(answers, currentTestType)
} else {
    await submitAnswersToApiOld(answers, currentTestType)
}
```

---

## ✅ Test Checklist

### **Unit Tests:**
- [ ] `/api/tests/submit` với valid MBTI data
- [ ] `/api/tests/submit` với valid RIASEC data
- [ ] `/api/tests/submit` với valid GRIT data
- [ ] Error: Missing required fields
- [ ] Error: Invalid test_type
- [ ] Error: Wrong answer count
- [ ] Error: Out of range answers
- [ ] MBTI scale conversion (-3 to 3 → 1 to 5)
- [ ] RIASEC scale conversion (1-5 → boolean)

### **Integration Tests:**
- [ ] Complete MBTI flow end-to-end
- [ ] Complete RIASEC flow end-to-end
- [ ] Complete GRIT flow end-to-end
- [ ] All 3 tests → Career recommendations
- [ ] Database correctly updated
- [ ] Results display correctly in UI

### **Performance Tests:**
- [ ] Network tab shows only 1 submit request (not 60)
- [ ] Submit time < 1 second
- [ ] No timeout errors
- [ ] Works on slow network

### **Edge Cases:**
- [ ] Network failure during submit
- [ ] Invalid session/student_id
- [ ] Test already completed
- [ ] Concurrent submissions
- [ ] Browser refresh during test

---

## 🐛 Known Issues & Solutions

### **Issue 1: TypeScript errors in page.tsx**
```
Module '"@/components/types"' has no exported member 'TestResult'
```
**Solution:** Import from correct location or define locally

### **Issue 2: MBTI scale mismatch**
```
UI sends -3 to 3, but calculation expects 1-5
```
**Solution:** ✅ Fixed in submit API with conversion logic

### **Issue 3: RIASEC boolean conversion**
```
UI sends 1-5, but calculation expects boolean
```
**Solution:** ✅ Fixed in submit API (>=4 is true)

---

## 📞 Support

Nếu gặp vấn đề:
1. Check server logs
2. Check browser console
3. Check Network tab (DevTools)
4. Check database records
5. Try rollback plan

**Status:** ✅ Ready for testing
**Last Updated:** January 8, 2026

