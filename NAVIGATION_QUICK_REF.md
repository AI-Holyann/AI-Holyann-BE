# 🎴 Test Navigation - Quick Reference Card

## 🔄 Test Flow

```
START TEST → IN_PROGRESS → LOCAL STATE → SUBMIT ALL → COMPLETED
    ↓             ↓              ↓            ↓           ↓
   API        DB Record    React State    Calc &     Show Result
  /tests       created      (answers)     Save DB
```

---

## 🎯 Key Concepts

### 1. **Single Submit Pattern**
```typescript
// ❌ OLD: Submit per question (60+ API calls)
questions.forEach(q => {
    await submitAnswer(q.id, answer)
})

// ✅ NEW: Submit once (2 API calls only)
const answers = { 1: 4, 2: 3, ..., 12: 5 }
await submitTest(testId, answers)
```

### 2. **Local State First**
```typescript
// Answers stored in React state
const [answers, setAnswers] = useState<Record<number, number>>({})

// Update locally (no API call)
setAnswers(prev => ({ ...prev, [questionId]: value }))

// Submit all at once
await fetch('/api/tests/submit', { 
    body: JSON.stringify({ answers }) 
})
```

### 3. **Navigation Freedom**
```typescript
// Jump to any question
setCurrentQuestionIndex(targetIndex)

// Edit any answer
setAnswers(prev => ({ ...prev, [questionId]: newValue }))
// → Overwrites old value
```

---

## 📊 Component Hierarchy

```
TestsPage.tsx (parent)
├── TestSelection.tsx (test list)
├── TestView.tsx (test UI) ⭐
│   ├── Question List Panel (sidebar)
│   ├── Progress Bar
│   ├── Question Display
│   ├── Answer Options (Likert scale)
│   └── Navigation Buttons
└── ResultView.tsx (results)
    └── ResultChart.tsx (visualization)
```

**⭐ Key**: `TestView.tsx` handles ALL navigation logic

---

## 🔑 Key States

```typescript
// TestsPage.tsx
const [currentTestId, setCurrentTestId] = useState<string | null>(null)
const [currentQuestions, setCurrentQuestions] = useState<Question[]>([])

// TestView.tsx
const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
const [answers, setAnswers] = useState<Record<number, number>>({})
const [showQuestionList, setShowQuestionList] = useState(false)
```

---

## 🎨 Visual States

| State | Color | Symbol | Condition |
|-------|-------|--------|-----------|
| Current | 🟦 Blue | Pulsing dot | `index === currentQuestionIndex` |
| Answered | 🟩 Green | Shows answer | `answers[q.id] !== undefined` |
| Unanswered | ⬜ Gray | - | `answers[q.id] === undefined` |

---

## 🔄 Data Flow

### Start Test
```typescript
POST /api/tests
├── Input: { student_id, test_type }
├── Action: Create test record (status=IN_PROGRESS)
└── Output: { test_id, questions }
```

### Answer Question (Local Only)
```typescript
handleAnswer(value)
├── setAnswers({ ...answers, [q.id]: value })
└── // No API call!
```

### Navigate
```typescript
// Previous/Next
handleNext() → setCurrentQuestionIndex(prev => prev + 1)
handlePrevious() → setCurrentQuestionIndex(prev => prev - 1)

// Jump to specific question
handleJumpToQuestion(index) → setCurrentQuestionIndex(index)
```

### Submit Test
```typescript
POST /api/tests/submit
├── Input: { test_id, student_id, test_type, answers }
├── Action: 
│   ├── Calculate scores
│   ├── Update DB (status=COMPLETED)
│   └── Return results
└── Output: { result_type, scores, ... }
```

---

## 🐛 Common Issues

### Issue 1: Answers not saved
```typescript
// ❌ Wrong: Direct mutation
answers[questionId] = value

// ✅ Correct: Immutable update
setAnswers(prev => ({ ...prev, [questionId]: value }))
```

### Issue 2: Key mismatch
```typescript
// ❌ API returns: { passion_score: 2.67 }
// ❌ Component expects: { 'Đam mê': 2.67 }

// ✅ Fix: Map in page.tsx
scores: {
    'Đam mê': apiResult.passion_score,
    'Kiên trì': apiResult.perseverance_score
}
```

### Issue 3: Panel not visible (mobile)
```css
/* Desktop: always visible */
@media (min-width: 1024px) {
    .question-panel { display: block; }
}

/* Mobile: toggle with button */
.question-panel {
    transform: translateX(-100%);
}
.question-panel.open {
    transform: translateX(0);
}
```

---

## 📐 Layout Structure

```
┌─────────────────────────────────────────────┐
│ Header                                      │
├──────────────┬──────────────────────────────┤
│  Question    │  Main Content                │
│  List Panel  │  ┌────────────────────────┐  │
│  (fixed)     │  │ Progress Bar           │  │
│              │  ├────────────────────────┤  │
│  [🟦1] [🟩2]  │  │ Question Text          │  │
│  [🟩3] [⬜4]  │  ├────────────────────────┤  │
│  [⬜5] [⬜6]  │  │ Answer Options         │  │
│  ...         │  │ ⭕ 1  ⭕ 2  ⭕ 3  ⭕ 4  ⭕ 5 │  │
│              │  ├────────────────────────┤  │
│              │  │ [⬅️] [Status] [➡️]       │  │
│              │  └────────────────────────┘  │
└──────────────┴──────────────────────────────┘
```

---

## 🎯 Test Types Config

```typescript
const TEST_CONFIG = {
    MBTI: {
        questionCount: 60,
        scale: [-3, -2, -1, 0, 1, 2, 3],
        scaleType: 'disagreement-agreement',
        color: 'blue'
    },
    GRIT: {
        questionCount: 12,
        scale: [1, 2, 3, 4, 5],
        scaleType: 'not-like-me-to-very-like-me',
        color: 'purple'
    },
    RIASEC: {
        questionCount: 48,
        scale: [1, 2, 3, 4, 5],
        scaleType: 'dislike-to-like',
        color: 'green'
    }
}
```

---

## 📝 Key Functions

### Navigation
```typescript
handleNext() // Move to next question
handlePrevious() // Move to previous question
handleJumpToQuestion(index) // Jump to specific question
```

### Answer Management
```typescript
handleAnswer(value) // Update answer for current question
getAnswerDisplay(questionId) // Get display value for answered question
```

### Submission
```typescript
handleComplete() // Validate & submit test
submitAnswersToApi(answers, testType) // API call
```

---

## 🔧 Customization Points

### 1. Question List Panel Position
```typescript
// src/components/Test/TestView.tsx
// Line 95: Change position/size
className="w-80 lg:w-72 flex-shrink-0"
```

### 2. Progress Bar Style
```typescript
// Line 18-25: Customize appearance
<div className="bg-gray-200 rounded-full h-2.5">
    <div className="bg-blue-600 h-2.5 rounded-full" 
         style={{width: `${percentage}%`}} />
</div>
```

### 3. Answer Button Colors
```typescript
// Line 240-280: MBTI scale colors
${val < 0 ? 'bg-red-...' : val === 0 ? 'bg-gray-...' : 'bg-green-...'}
```

---

## 🚀 Performance Tips

1. **Memoize expensive computations**
```typescript
const questionsForType = useMemo(() => 
    getQuestionsForTest(testType), 
    [testType]
)
```

2. **Debounce panel toggle** (mobile)
```typescript
const [showPanel, setShowPanel] = useState(false)
const handleToggle = useDebounce(() => setShowPanel(prev => !prev), 100)
```

3. **Lazy load charts**
```typescript
const ResultChart = lazy(() => import('./ResultChart'))
```

---

## 📦 Dependencies

```json
{
  "react": "^19.0.0",
  "lucide-react": "^0.468.0", // Icons
  "recharts": "^2.15.0"       // Charts
}
```

---

## 🔗 Related Files

- **Logic**: `src/app/dashboard/tests/page.tsx`
- **UI**: `src/components/Test/TestView.tsx`
- **API**: `src/app/api/tests/submit/route.ts`
- **Types**: `src/components/types.ts`
- **Constants**: `src/constants.ts`
- **Data**: `src/data/grit-questions.ts`

---

## 📚 Documentation

- [FIX_TEST_ERRORS_SUMMARY.md](./FIX_TEST_ERRORS_SUMMARY.md) - Bug fixes
- [NAVIGATION_USER_GUIDE.md](./NAVIGATION_USER_GUIDE.md) - User guide
- [TEST_SUBMIT_OPTIMIZATION.md](./TEST_SUBMIT_OPTIMIZATION.md) - Submit optimization

---

## ✅ Testing Checklist

### Manual Testing
- [ ] Start test → Test record created in DB
- [ ] Answer question → State updated locally
- [ ] Click Previous → Navigate back
- [ ] Click Next → Navigate forward
- [ ] Click question number → Jump to question
- [ ] Edit answer → Old answer overwritten
- [ ] Submit test → All answers sent to API
- [ ] View result → Scores display correctly

### Edge Cases
- [ ] Submit with unanswered questions → Show confirm dialog
- [ ] Navigate from first question → Previous button disabled
- [ ] Navigate from last question → Show Submit button
- [ ] Refresh page mid-test → Data lost (expected)
- [ ] Network error on submit → Show error message

---

**🎉 Happy Developing!**

