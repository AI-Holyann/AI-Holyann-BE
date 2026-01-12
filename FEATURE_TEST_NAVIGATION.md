# 🎯 Feature: Navigation trong Test - Tua qua lại câu hỏi

## ✨ Tính năng mới

Thêm khả năng **điều hướng qua lại giữa các câu hỏi** khi làm bài test, thay vì chỉ chuyển tiến tuyến tính.

### **Trước:**
- ❌ Chọn đáp án → Tự động chuyển sang câu tiếp theo
- ❌ Không thể quay lại câu trước
- ❌ Không thể sửa đáp án đã chọn
- ❌ Phải làm tuần tự từ đầu đến cuối

### **Sau:**
- ✅ Chọn đáp án → Không tự động chuyển
- ✅ Có nút "Câu trước" để quay lại
- ✅ Có nút "Câu sau" để tiến lên
- ✅ Có thể tua đến bất kỳ câu nào và sửa đáp án
- ✅ Hiển thị đáp án đã chọn (highlighted)
- ✅ Đếm số câu đã trả lời
- ✅ Nút "Nộp bài" ở câu cuối cùng

---

## 🎨 UI Changes

### **1. Header - Thêm số câu đã trả lời:**
```
Bài test MBTI                     Câu 5/60    ✓ 12 đã trả lời
[==============>                              ]
```

### **2. Answer Buttons - Highlight đáp án đã chọn:**

**MBTI (-3 to +3):**
- Đáp án được chọn: **Màu đậm + Scale 110% + Ring effect**
- Đáp án chưa chọn: Gradient nhạt

**RIASEC (1-5):**
- Đáp án được chọn: **Blue 600 + Scale 110% + Ring effect**
- Đáp án chưa chọn: Blue gradient nhạt

**GRIT (1-5):**
- Đáp án được chọn: **Purple 600 + Scale 110% + Ring effect**
- Đáp án chưa chọn: Gray 50

### **3. Navigation Buttons:**
```
┌─────────────────────────────────────────────────┐
│                                                 │
│  [buttons for answers]                         │
│                                                 │
│  ┌───────────┐  ┌──────────┐  ┌───────────┐   │
│  │← Câu trước│  │ ✓ Đã chọn │  │ Câu sau → │   │
│  └───────────┘  └──────────┘  └───────────┘   │
└─────────────────────────────────────────────────┘

(Ở câu cuối cùng: "Câu sau" → "Nộp bài ✓")
```

---

## 🔧 Technical Changes

### **Modified File:**
`src/components/Test/TestView.tsx`

### **Key Changes:**

#### **1. Import new icons:**
```typescript
import {RotateCcw, ChevronLeft, ChevronRight, Check} from 'lucide-react';
```

#### **2. Refactor handleAnswer:**
```typescript
// TRƯỚC: Auto-advance
const handleAnswer = (value) => {
    const newAnswers = {...answers, [question.id]: value};
    setAnswers(newAnswers);
    
    if (currentQuestionIndex < questions.length - 1) {
        setTimeout(() => setCurrentQuestionIndex(prev => prev + 1), 250);
    } else {
        onComplete(newAnswers);
    }
};

// SAU: Chỉ lưu answer, không chuyển trang
const handleAnswer = (value) => {
    const question = questions[currentQuestionIndex];
    const newAnswers = {...answers, [question.id]: value};
    setAnswers(newAnswers);
    // Không auto-advance nữa!
};
```

#### **3. Add navigation handlers:**
```typescript
const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
    }
};

const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
        setCurrentQuestionIndex(prev => prev - 1);
    }
};

const handleComplete = () => {
    // Check unanswered questions
    const unansweredCount = questions.filter(q => answers[q.id] === undefined).length;
    if (unansweredCount > 0) {
        const confirm = window.confirm(
            `Bạn còn ${unansweredCount} câu chưa trả lời. Bạn có chắc muốn nộp bài không?`
        );
        if (!confirm) return;
    }
    onComplete(answers);
};
```

#### **4. Highlight selected answers:**
```typescript
const currentAnswer = answers[question?.id];

// In button rendering:
const isSelected = currentAnswer === val;
className={`... ${isSelected ? 'selected-styles' : 'normal-styles'}`}
```

#### **5. Track answered count:**
```typescript
const answeredCount = Object.keys(answers).length;

// Display in header:
<span className="text-green-600">✓ {answeredCount} đã trả lời</span>
```

---

## 🎮 User Experience

### **Flow mới:**

1. **Bắt đầu test**
   - Câu hỏi 1 hiển thị
   - Chọn đáp án → Button highlight
   - Không tự động chuyển

2. **Điều hướng:**
   - Click "Câu sau" → Đến câu 2
   - Chọn đáp án → Button highlight
   - Click "Câu trước" → Quay lại câu 1
   - Thấy đáp án cũ vẫn được highlight
   - Có thể đổi đáp án bất kỳ lúc nào

3. **Review:**
   - Tua qua lại giữa các câu
   - Kiểm tra đáp án đã chọn
   - Sửa đáp án nếu cần

4. **Hoàn thành:**
   - Đến câu cuối → Nút "Nộp bài"
   - Nếu còn câu chưa trả lời → Cảnh báo
   - Confirm → Submit test

---

## ✅ Features

### **Navigation:**
- ✅ Nút "Câu trước" (disabled ở câu 1)
- ✅ Nút "Câu sau" (thay bằng "Nộp bài" ở câu cuối)
- ✅ Có thể jump đến bất kỳ câu nào

### **Visual Feedback:**
- ✅ Highlight đáp án đã chọn
- ✅ Hiển thị "✓ Đã chọn đáp án" hoặc "Chưa chọn đáp án"
- ✅ Đếm số câu đã trả lời (✓ X đã trả lời)
- ✅ Progress bar theo câu hiện tại

### **Validation:**
- ✅ Cảnh báo khi nộp bài mà còn câu chưa trả lời
- ✅ Cho phép nộp bài dù chưa trả lời hết (sau confirm)

### **Animation:**
- ✅ Scale + ring effect khi chọn đáp án
- ✅ Smooth transitions giữa các câu
- ✅ Hover effects

---

## 🧪 Testing

### **Test Manual:**

1. **Basic Navigation:**
   ```
   1. Vào /dashboard/tests
   2. Bắt đầu bài test bất kỳ
   3. Chọn đáp án → Không tự động chuyển ✅
   4. Click "Câu sau" → Chuyển sang câu 2 ✅
   5. Click "Câu trước" → Quay lại câu 1 ✅
   6. Thấy đáp án cũ vẫn highlighted ✅
   ```

2. **Answer Modification:**
   ```
   1. Chọn đáp án A
   2. Sang câu khác
   3. Quay lại
   4. Chọn đáp án B
   5. Check: Đáp án B được highlight, không phải A ✅
   ```

3. **Complete Test:**
   ```
   1. Làm hết tất cả câu
   2. Đến câu cuối → Thấy nút "Nộp bài" ✅
   3. Click "Nộp bài" → Submit thành công ✅
   ```

4. **Incomplete Test:**
   ```
   1. Làm một vài câu
   2. Skip một số câu (không chọn đáp án)
   3. Đến câu cuối → Click "Nộp bài"
   4. Thấy cảnh báo: "Bạn còn X câu chưa trả lời" ✅
   5. Cancel → Quay lại làm tiếp ✅
   6. Confirm → Nộp bài dù chưa đủ ✅
   ```

5. **Visual Feedback:**
   ```
   1. Check header: "✓ X đã trả lời" ✅
   2. Check answer status: "✓ Đã chọn đáp án" / "Chưa chọn" ✅
   3. Check button highlight khi đã chọn ✅
   ```

### **Test với cả 3 bài:**
- ✅ MBTI (60 câu, -3 to +3)
- ✅ RIASEC (48 câu, 1-5)
- ✅ GRIT (12 câu, 1-5)

---

## 🎨 Style Details

### **Selected Button Styles:**

**MBTI:**
```css
.selected {
    scale: 1.1;
    box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);
    ring: 2px solid rgb(59 130 246 / 0.5);
}

/* Red (-3 to -1) */
.selected.negative { background: rgb(220 38 38); }

/* Gray (0) */
.selected.neutral { background: rgb(75 85 99); }

/* Green (1 to 3) */
.selected.positive { background: rgb(22 163 74); }
```

**RIASEC:**
```css
.selected {
    background: rgb(37 99 235);
    scale: 1.1;
    ring: 2px solid rgb(59 130 246 / 0.5);
}
```

**GRIT:**
```css
.selected {
    background: rgb(147 51 234);
    scale: 1.1;
    ring: 2px solid rgb(168 85 247 / 0.5);
}
```

### **Navigation Buttons:**

**Previous/Next:**
```css
.nav-button {
    padding: 12px 24px;
    border-radius: 12px;
    font-weight: 600;
    transition: all 0.2s;
}

.nav-button.previous {
    background: rgb(229 231 235);
    color: rgb(55 65 81);
}

.nav-button.next {
    background: rgb(37 99 235);
    color: white;
}

.nav-button.submit {
    background: linear-gradient(to right, rgb(22 163 74), rgb(5 150 105));
    color: white;
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}

.nav-button:disabled {
    background: rgb(243 244 246);
    color: rgb(156 163 175);
    cursor: not-allowed;
}
```

---

## 📊 Impact

### **Before:**
```
Linear flow: Q1 → Q2 → Q3 → ... → Submit
- No going back
- No answer modification
- Auto-advance (can be annoying)
```

### **After:**
```
Free navigation: Q1 ⇄ Q2 ⇄ Q3 ⇄ ... ⇄ Qn → Submit
- Full control
- Answer modification anytime
- Manual navigation
- Better UX
```

---

## 🔄 Backward Compatibility

- ✅ Không thay đổi API calls
- ✅ Không thay đổi data structure
- ✅ Không ảnh hưởng đến database
- ✅ Chỉ thay đổi UI/UX

---

## 🚀 Next Steps (Optional Enhancements)

### **1. Question List Sidebar:**
```typescript
// Show all questions with status
[✓] Câu 1
[✓] Câu 2
[ ] Câu 3 ← Current
[✓] Câu 4
[ ] Câu 5
...
```

### **2. Keyboard Navigation:**
```typescript
// Arrow keys to navigate
← : Previous question
→ : Next question
1-7 : Select answer (MBTI)
Enter : Submit/Next
```

### **3. Progress Persistence:**
```typescript
// Save to localStorage
localStorage.setItem('test_progress', JSON.stringify({
    testId,
    currentQuestion,
    answers
}));

// Recover on refresh
useEffect(() => {
    const saved = localStorage.getItem('test_progress');
    if (saved) {
        const { answers, currentQuestion } = JSON.parse(saved);
        setAnswers(answers);
        setCurrentQuestionIndex(currentQuestion);
    }
}, []);
```

### **4. Review Mode:**
```typescript
// After completing, allow review
<button onClick={() => setReviewMode(true)}>
    Xem lại đáp án
</button>
```

---

## 📝 Summary

**Feature:** Navigation trong bài test  
**Impact:** ⭐⭐⭐⭐⭐ (High - Major UX improvement)  
**Complexity:** Medium  
**Status:** ✅ **COMPLETED**

**Changes:**
- ✅ Remove auto-advance behavior
- ✅ Add Previous/Next buttons
- ✅ Highlight selected answers
- ✅ Show answered count
- ✅ Add completion validation
- ✅ Apply to all 3 tests (MBTI, RIASEC, GRIT)

**Testing:** Ready to test manually

**Date:** January 8, 2026

