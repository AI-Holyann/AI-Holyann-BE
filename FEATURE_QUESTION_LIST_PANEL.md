# 🎯 Feature: Question List Panel - Danh sách câu hỏi

## ✨ Tính năng mới

Thêm **Question List Panel** - một sidebar hiển thị tất cả các câu hỏi với trạng thái và đáp án đã chọn.

### **Trước:**
- ❌ Không biết đã trả lời câu nào
- ❌ Không biết còn thiếu câu nào
- ❌ Phải tua tuần tự để kiểm tra

### **Sau:**
- ✅ **Grid hiển thị tất cả câu hỏi**
- ✅ **Trạng thái rõ ràng:** Đã trả lời (xanh lá) / Chưa trả lời (xám)
- ✅ **Hiển thị đáp án** đã chọn trên mỗi ô
- ✅ **Click để jump** đến câu bất kỳ
- ✅ **Highlight câu hiện tại** (xanh dương + pulse effect)
- ✅ **Responsive:** Sidebar cố định (desktop) / Overlay (mobile)

---

## 🎨 UI Design

### **Desktop Layout:**
```
┌──────────────────────────────────────────────────────────┐
│  ┌────────────┐  ┌──────────────────────────────────┐   │
│  │ Danh sách  │  │ Main Content                     │   │
│  │ câu hỏi    │  │                                  │   │
│  │            │  │ [Question text]                  │   │
│  │ ✓ 25/60    │  │                                  │   │
│  │            │  │ [Answer buttons]                 │   │
│  │ [1][2][3]  │  │                                  │   │
│  │ [4][5][6]  │  │ [← Trước] [Sau →]               │   │
│  │ [7][8]...  │  │                                  │   │
│  │            │  │                                  │   │
│  │ Sticky     │  │                                  │   │
│  └────────────┘  └──────────────────────────────────┘   │
└──────────────────────────────────────────────────────────┘
```

### **Mobile Layout:**
```
┌──────────────────────────────┐
│ Main Content                 │
│                              │
│ [Danh sách câu] button       │
│                              │
│ [Question]                   │
│ [Answers]                    │
│ [Navigation]                 │
└──────────────────────────────┘

(Click button → Slide-in panel từ trái)
```

---

## 🎯 Question List Panel

### **Header:**
```
┌──────────────────────────────┐
│ 📋 Danh sách câu hỏi      [X]│
│ ✓ 25 / 60 câu                │
└──────────────────────────────┘
```

### **Grid Layout (5 columns):**
```
┌────┬────┬────┬────┬────┐
│ 1  │ 2  │ 3  │ 4  │ 5  │
│ ✓  │ ✓  │ ●  │    │ ✓  │  (● = current)
│ -2 │ 0  │    │    │ 3  │  (đáp án)
├────┼────┼────┼────┼────┤
│ 6  │ 7  │ 8  │ 9  │ 10 │
│ ✓  │    │ ✓  │ ✓  │    │
│ 1  │    │ 2  │ 4  │    │
└────┴────┴────┴────┴────┘
```

### **Status Colors:**

**Current Question (đang làm):**
- 🔵 Blue 600 background
- 🟡 Yellow pulse dot (top-right corner)
- Scale 110%
- Ring effect

**Answered (đã trả lời):**
- 🟢 Green 100 background
- Green 700 text
- Green 300 border
- Shows answer value

**Unanswered (chưa trả lời):**
- ⚪ Gray 100 background
- Gray 400 text
- Gray 200 border

---

## 🔧 Technical Implementation

### **State Management:**
```typescript
const [showQuestionList, setShowQuestionList] = useState(false);

// Handler to jump to specific question
const handleJumpToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
    setShowQuestionList(false); // Auto-close on mobile
};

// Format answer display
const getAnswerDisplay = (questionId: number) => {
    const answer = answers[questionId];
    if (answer === undefined) return null;
    return answer; // Return -3 to 3 for MBTI, 1-5 for others
};
```

### **Question Button Component:**
```typescript
<button
    onClick={() => handleJumpToQuestion(index)}
    className={`
        ${isCurrent ? 'current-styles' : 
          isAnswered ? 'answered-styles' : 
          'unanswered-styles'}
    `}
>
    <span>{index + 1}</span>
    {isAnswered && <span>{answerValue}</span>}
    {isCurrent && <span className="pulse-dot" />}
</button>
```

### **Responsive Behavior:**

**Desktop (≥1024px):**
```typescript
// Sticky sidebar, always visible
className="lg:sticky lg:translate-x-0"
```

**Mobile (<1024px):**
```typescript
// Fixed overlay, slide from left
className="fixed -translate-x-full"  // Hidden
className="fixed translate-x-0"     // Shown

// With backdrop
{showQuestionList && (
    <div className="fixed inset-0 bg-black bg-opacity-50" 
         onClick={() => setShowQuestionList(false)} />
)}
```

---

## 🎮 User Interaction

### **Desktop:**
1. Sidebar luôn hiển thị bên trái
2. Click vào số câu hỏi → Jump đến câu đó
3. Không cần đóng/mở

### **Mobile:**
1. Click nút **"Danh sách câu"** (top-right)
2. Panel slide in từ trái
3. Backdrop (dark overlay) xuất hiện
4. Click câu hỏi → Jump và auto-close
5. Click backdrop hoặc [X] → Close

---

## 📊 Visual Indicators

### **Question Number:**
```css
.question-number {
    font-size: 0.75rem;  /* text-xs */
    font-weight: 600;    /* font-semibold */
}
```

### **Answer Value:**
```css
.answer-value {
    font-size: 0.625rem; /* text-[10px] */
    margin-top: 0.125rem;
    opacity: 0.8;
}
```

### **Current Indicator (Pulse Dot):**
```css
.pulse-dot {
    position: absolute;
    top: -0.25rem;
    right: -0.25rem;
    width: 0.75rem;
    height: 0.75rem;
    background: rgb(250 204 21); /* yellow-400 */
    border-radius: 9999px;
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

---

## ✅ Features

### **Core Features:**
- ✅ Grid layout 5 columns
- ✅ Scrollable (600px max height on desktop)
- ✅ Click to jump to any question
- ✅ Visual status (answered/unanswered/current)
- ✅ Show answer value on answered questions
- ✅ Progress counter (X/Y câu)

### **Responsive:**
- ✅ Sticky sidebar on desktop
- ✅ Slide-in panel on mobile
- ✅ Toggle button on mobile
- ✅ Backdrop overlay
- ✅ Auto-close after selection

### **Animations:**
- ✅ Smooth slide transitions
- ✅ Pulse effect on current question
- ✅ Scale on hover
- ✅ Fade in/out backdrop

---

## 🧪 Testing

### **Test Desktop:**
```
1. Vào /dashboard/tests
2. Bắt đầu bài GRIT (12 câu, dễ test)
3. Thấy sidebar bên trái ✅
4. Chọn vài câu
5. Thấy màu xanh lá + đáp án hiển thị ✅
6. Click câu số 8 → Jump đến câu 8 ✅
7. Thấy câu 8 có màu xanh dương + pulse ✅
```

### **Test Mobile (hoặc resize browser < 1024px):**
```
1. Sidebar ẩn đi ✅
2. Thấy nút "Danh sách câu" (top-right) ✅
3. Click nút → Panel slide in ✅
4. Backdrop (màn tối) xuất hiện ✅
5. Click câu số 5 → Jump và panel đóng lại ✅
6. Click backdrop → Panel đóng ✅
```

### **Test Progress Tracking:**
```
1. Làm câu 1, 3, 5, 7
2. Check sidebar:
   - Câu 1,3,5,7: Xanh lá + hiển thị đáp án ✅
   - Câu 2,4,6,8: Xám (chưa trả lời) ✅
   - Header: "✓ 4 / 12 câu" ✅
```

### **Test Jump Functionality:**
```
1. Đang ở câu 10
2. Click câu 3 trong sidebar
3. Main content hiển thị câu 3 ✅
4. Thấy đáp án cũ (nếu đã chọn) ✅
5. Có thể đổi đáp án ✅
```

---

## 🎨 Style Details

### **Panel Container:**
```css
.question-list-panel {
    width: 20rem;              /* w-80 on mobile, w-72 on desktop */
    background: white;
    border-right: 1px solid rgb(229 231 235);
    box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25); /* desktop */
    border-radius: 1rem;       /* lg:rounded-2xl */
}
```

### **Header Gradient:**
```css
.panel-header {
    background: linear-gradient(to right, rgb(239 246 255), rgb(250 245 255));
    padding: 1rem;
    border-bottom: 1px solid rgb(229 231 235);
}
```

### **Grid Container:**
```css
.questions-grid {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 0.5rem;
    padding: 1rem;
    overflow-y: auto;
    height: calc(100vh - 120px);  /* mobile */
    height: 600px;                /* desktop */
}
```

### **Question Button States:**

**Current:**
```css
.question-current {
    background: rgb(37 99 235);      /* blue-600 */
    color: white;
    ring: 4px solid rgb(191 219 254); /* blue-200 */
    scale: 1.1;
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}
```

**Answered:**
```css
.question-answered {
    background: rgb(220 252 231);    /* green-100 */
    color: rgb(21 128 61);           /* green-700 */
    border: 2px solid rgb(134 239 172); /* green-300 */
}

.question-answered:hover {
    background: rgb(187 247 208);    /* green-200 */
    scale: 1.05;
}
```

**Unanswered:**
```css
.question-unanswered {
    background: rgb(243 244 246);    /* gray-100 */
    color: rgb(156 163 175);         /* gray-400 */
    border: 2px solid rgb(229 231 235); /* gray-200 */
}

.question-unanswered:hover {
    background: rgb(229 231 235);    /* gray-200 */
    scale: 1.05;
}
```

---

## 📱 Mobile Optimization

### **Toggle Button:**
```tsx
<button className="lg:hidden flex items-center gap-2 px-4 py-2 
                   bg-blue-600 text-white rounded-xl">
    <List size={20}/>
    Danh sách câu
</button>
```

### **Panel Animation:**
```css
/* Hidden state */
transform: translateX(-100%);
transition: transform 300ms ease-in-out;

/* Shown state */
transform: translateX(0);
```

### **Backdrop:**
```tsx
<div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
     onClick={() => setShowQuestionList(false)} />
```

### **Z-index Layers:**
```css
.backdrop { z-index: 40; }
.panel { z-index: 50; }
```

---

## 🔄 Integration with Existing Features

### **Works with Navigation:**
- ✅ Previous/Next buttons vẫn hoạt động
- ✅ Jump từ list → Navigation buttons update
- ✅ Current question luôn sync

### **Works with Answer Selection:**
- ✅ Chọn đáp án → Grid update ngay lập tức
- ✅ Đổi đáp án → Grid update value
- ✅ Status color change real-time

### **Works with Validation:**
- ✅ Nộp bài → Check based on answers state
- ✅ Warning hiển thị số câu chưa trả lời
- ✅ Có thể dùng list để kiểm tra câu nào thiếu

---

## 📊 Performance

### **Rendering:**
- Efficient: Only re-renders when answers change
- Grid uses map() with keys
- No unnecessary re-renders

### **Scrolling:**
- Smooth scroll on list
- Virtualization not needed (max 60 items)

### **Memory:**
- Lightweight: Just button elements
- No heavy images or assets

---

## 🚀 Future Enhancements (Optional)

### **1. Question Preview on Hover:**
```tsx
<Tooltip content={question.text}>
    <button>...</button>
</Tooltip>
```

### **2. Quick Navigation:**
```tsx
// Jump to first unanswered
<button onClick={jumpToFirstUnanswered}>
    Câu tiếp theo chưa trả lời →
</button>
```

### **3. Filter View:**
```tsx
// Show only: All | Answered | Unanswered
<SegmentedControl 
    options={['Tất cả', 'Đã trả lời', 'Chưa trả lời']}
    onChange={setFilter}
/>
```

### **4. Export Progress:**
```tsx
// Save progress to localStorage
const saveProgress = () => {
    localStorage.setItem('test_progress', JSON.stringify({
        testId, currentIndex, answers
    }));
};
```

### **5. Keyboard Shortcuts:**
```tsx
// Press number key to jump
useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
        const num = parseInt(e.key);
        if (num >= 1 && num <= 9) {
            handleJumpToQuestion(num - 1);
        }
    };
    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
}, []);
```

---

## 📝 Summary

**Feature:** Question List Panel  
**Type:** UI Enhancement  
**Impact:** ⭐⭐⭐⭐⭐ (High - Major UX improvement)  
**Complexity:** Medium  
**Status:** ✅ **COMPLETED**

**Benefits:**
- ✅ Better overview of test progress
- ✅ Easy navigation to any question
- ✅ Visual feedback on completion
- ✅ Quick identification of unanswered questions
- ✅ Mobile-friendly

**Files Changed:**
- ✅ `src/components/Test/TestView.tsx`

**Ready to test!** 🎯

---

**Date:** January 8, 2026

