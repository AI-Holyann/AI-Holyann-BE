# Career Assessment API - Integration Guide

## 🌐 API Endpoint

```
POST http://127.0.0.1:8000/hoexapp/api/career-assessment/
```

## 📤 Request Example

### Headers
```json
{
  "Content-Type": "application/json"
}
```

### Body Structure
```typescript
interface CareerAssessmentRequest {
  mbti_answers: number[];        // Array of 60 integers from -3 to 3
  grit_answers: {                // Object with keys "1" to "12", values 1-5
    [key: string]: number;
  };
  riasec_answers: {              // Object with keys "1" to "48", values 1-5
    [key: string]: number;
  };
  top_n?: number;                // Optional, default 10
  min_match_score?: number;      // Optional, default 50.0
}
```

### Complete Request Example
```json
{
  "mbti_answers": [
    2, 1, -1, 3, 0, -2, 1, 2, -1, 0,
    1, -1, 2, 0, -2, 1, 2, -1, 0, 1,
    -1, 2, 0, -2, 1, 2, -1, 0, 1, -1,
    2, 0, -2, 1, 2, -1, 0, 1, -1, 2,
    0, -2, 1, 2, -1, 0, 1, -1, 2, 0,
    -2, 1, 2, -1, 0, 1, -1, 2, 0, -2
  ],
  "grit_answers": {
    "1": 4,
    "2": 3,
    "3": 2,
    "4": 5,
    "5": 3,
    "6": 4,
    "7": 2,
    "8": 3,
    "9": 4,
    "10": 5,
    "11": 2,
    "12": 4
  },
  "riasec_answers": {
    "1": 4, "2": 3, "3": 5, "4": 2, "5": 4, "6": 3,
    "7": 5, "8": 2, "9": 4, "10": 3, "11": 5, "12": 2,
    "13": 4, "14": 3, "15": 5, "16": 2, "17": 4, "18": 3,
    "19": 5, "20": 2, "21": 4, "22": 3, "23": 5, "24": 2,
    "25": 4, "26": 3, "27": 5, "28": 2, "29": 4, "30": 3,
    "31": 5, "32": 2, "33": 4, "34": 3, "35": 5, "36": 2,
    "37": 4, "38": 3, "39": 5, "40": 2, "41": 4, "42": 3,
    "43": 5, "44": 2, "45": 4, "46": 3, "47": 5, "48": 2
  },
  "top_n": 10,
  "min_match_score": 50.0
}
```

## 📥 Response Example

### Success Response (200 OK)
```json
{
  "success": true,
  "assessment": {
    "mbti": {
      "personality_type": "ENTP",
      "dimension_scores": {
        "E": 0.8319699931889772,
        "I": 0.1680300123989582,
        "S": 0.15060307877138257,
        "N": 0.8493969268165529,
        "T": 0.8347318270243704,
        "F": 0.16526817856356502,
        "J": 0.1755153937265277,
        "P": 0.8244846118614078
      },
      "confidence": 0.68619704246521
    },
    "grit": {
      "score": 3.92,
      "level": "Trên trung bình",
      "description": "Bạn có nghị lực khá tốt nhưng vẫn còn cải thiện được."
    },
    "riasec": {
      "code": "RIA",
      "scores": {
        "Realistic": 28.0,
        "Investigative": 28.0,
        "Artistic": 28.0,
        "Social": 28.0,
        "Enterprising": 28.0,
        "Conventional": 28.0
      },
      "top3": [
        ["Realistic", 28.0],
        ["Investigative", 28.0],
        ["Artistic", 28.0]
      ]
    }
  },
  "recommendations": [
    {
      "title": "Software Developers, Applications",
      "match_score": 95.5,
      "riasec_code": "IRC",
      "description": "Điểm RIASEC: R=2.3, I=7.0, A=3.7, S=2.7, E=3.3, C=4.3",
      "riasec_scores": {
        "R": 2.3,
        "I": 7.0,
        "A": 3.7,
        "S": 2.7,
        "E": 3.3,
        "C": 4.3
      }
    },
    {
      "title": "Data Scientists",
      "match_score": 92.8,
      "riasec_code": "IRA",
      "description": "Điểm RIASEC: R=3.0, I=7.0, A=4.0, S=2.3, E=2.7, C=5.0",
      "riasec_scores": {
        "R": 3.0,
        "I": 7.0,
        "A": 4.0,
        "S": 2.3,
        "E": 2.7,
        "C": 5.0
      }
    },
    {
      "title": "Computer Systems Engineers/Architects",
      "match_score": 90.2,
      "riasec_code": "IRC",
      "description": "Điểm RIASEC: R=2.7, I=6.7, A=3.3, S=3.0, E=4.0, C=4.7",
      "riasec_scores": {
        "R": 2.7,
        "I": 6.7,
        "A": 3.3,
        "S": 3.0,
        "E": 4.0,
        "C": 4.7
      }
    }
  ]
}
```

### Error Response (400 Bad Request)
```json
{
  "success": false,
  "error": "Invalid input: mbti_answers must contain exactly 60 values"
}
```

### Error Response (500 Internal Server Error)
```json
{
  "success": false,
  "error": "Internal server error: Model prediction failed"
}
```

## 🔄 Data Transformation from Database

### From Database to API Format

```typescript
// Assuming you have test results from database:
interface DBTestResults {
  mbti_test: {
    answers: any; // JSON field containing question_id -> answer_value
  };
  grit_test: {
    answers: any; // JSON object with keys 1-12
  };
  riasec_test: {
    answers: any; // JSON object with keys 1-48
  };
}

// Transform function
function transformToAPIRequest(dbResults: DBTestResults): CareerAssessmentRequest {
  // MBTI: Convert to array of 60 values (-3 to 3)
  const mbtiAnswers = Array(60).fill(0);
  if (typeof dbResults.mbti_test.answers === 'object') {
    Object.entries(dbResults.mbti_test.answers).forEach(([key, value]) => {
      const index = parseInt(key) - 1;
      mbtiAnswers[index] = Number(value);
    });
  }

  // GRIT: Already in correct format (object with string keys)
  const gritAnswers = {};
  if (typeof dbResults.grit_test.answers === 'object') {
    Object.entries(dbResults.grit_test.answers).forEach(([key, value]) => {
      gritAnswers[key] = Number(value);
    });
  }

  // RIASEC: Convert to object with string keys
  const riasecAnswers = {};
  if (typeof dbResults.riasec_test.answers === 'object') {
    Object.entries(dbResults.riasec_test.answers).forEach(([key, value]) => {
      riasecAnswers[key] = Number(value);
    });
  }

  return {
    mbti_answers: mbtiAnswers,
    grit_answers: gritAnswers,
    riasec_answers: riasecAnswers,
    top_n: 10,
    min_match_score: 50.0
  };
}
```

## 🚀 Next.js API Route Example

Create: `src/app/api/career-recommendations/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { student_id } = await request.json();

    if (!student_id) {
      return NextResponse.json(
        { success: false, error: 'student_id is required' },
        { status: 400 }
      );
    }

    // Fetch all test results from database
    const [mbti, grit, riasec] = await Promise.all([
      prisma.mbti_tests.findUnique({
        where: { student_id },
        select: { answers: true, status: true }
      }),
      prisma.grit_tests.findUnique({
        where: { student_id },
        select: { answers: true, status: true }
      }),
      prisma.riasec_tests.findUnique({
        where: { student_id },
        select: { answers: true, status: true }
      })
    ]);

    // Validate all tests are completed
    if (!mbti || mbti.status !== 'COMPLETED') {
      return NextResponse.json(
        { success: false, error: 'MBTI test not completed' },
        { status: 400 }
      );
    }
    if (!grit || grit.status !== 'COMPLETED') {
      return NextResponse.json(
        { success: false, error: 'GRIT test not completed' },
        { status: 400 }
      );
    }
    if (!riasec || riasec.status !== 'COMPLETED') {
      return NextResponse.json(
        { success: false, error: 'RIASEC test not completed' },
        { status: 400 }
      );
    }

    // Transform data to API format
    const mbtiAnswers = Array(60).fill(0);
    if (Array.isArray(mbti.answers)) {
      mbti.answers.forEach((value: number, index: number) => {
        mbtiAnswers[index] = value;
      });
    } else if (typeof mbti.answers === 'object') {
      Object.entries(mbti.answers).forEach(([key, value]) => {
        const index = parseInt(key) - 1;
        mbtiAnswers[index] = Number(value);
      });
    }

    const gritAnswers: Record<string, number> = {};
    if (typeof grit.answers === 'object') {
      Object.entries(grit.answers as Record<string, any>).forEach(([key, value]) => {
        gritAnswers[key] = Number(value);
      });
    }

    const riasecAnswers: Record<string, number> = {};
    if (typeof riasec.answers === 'object') {
      Object.entries(riasec.answers as Record<string, any>).forEach(([key, value]) => {
        riasecAnswers[key] = Number(value);
      });
    }

    // Call Django API
    const aiApiUrl = process.env.AI_API_URL || 'http://127.0.0.1:8000/hoexapp/api/career-assessment/';
    
    const response = await fetch(aiApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mbti_answers: mbtiAnswers,
        grit_answers: gritAnswers,
        riasec_answers: riasecAnswers,
        top_n: 10,
        min_match_score: 50.0
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('AI API Error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to get career recommendations' },
        { status: 500 }
      );
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error: any) {
    console.error('Error getting career recommendations:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## 🎯 Client-side Usage Example

```typescript
// In your React component
async function getCareerRecommendations(studentId: string) {
  try {
    const response = await fetch('/api/career-recommendations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ student_id: studentId })
    });

    const data = await response.json();

    if (data.success) {
      console.log('MBTI Result:', data.data.assessment.mbti);
      console.log('GRIT Score:', data.data.assessment.grit.score);
      console.log('RIASEC Code:', data.data.assessment.riasec.code);
      console.log('Career Recommendations:', data.data.recommendations);
      
      // Use the data in your UI
      setRecommendations(data.data.recommendations);
    } else {
      console.error('Error:', data.error);
    }
  } catch (error) {
    console.error('Failed to fetch recommendations:', error);
  }
}
```

## 📊 Response Data Structure

```typescript
interface CareerAssessmentResponse {
  success: boolean;
  assessment: {
    mbti: {
      personality_type: string;          // e.g., "ENTP"
      dimension_scores: {
        E: number; I: number;            // 0-1 (confidence scores)
        S: number; N: number;
        T: number; F: number;
        J: number; P: number;
      };
      confidence: number;                // Overall confidence 0-1
    };
    grit: {
      score: number;                     // 1-5
      level: string;                     // Vietnamese description
      description: string;
    };
    riasec: {
      code: string;                      // 3-letter Holland Code
      scores: {
        Realistic: number;
        Investigative: number;
        Artistic: number;
        Social: number;
        Enterprising: number;
        Conventional: number;
      };
      top3: [string, number][];          // Top 3 categories with scores
    };
  };
  recommendations: Array<{
    title: string;                       // Career name
    match_score: number;                 // 0-100
    riasec_code: string;                 // Career's Holland Code
    description: string;
    riasec_scores: {
      R: number; I: number; A: number;
      S: number; E: number; C: number;
    };
  }>;
}
```

## ⚙️ Environment Variables

Add to `.env` or `.env.local`:

```bash
# AI Career Assessment API (Django Server)
AI_API_URL=http://127.0.0.1:8000/hoexapp/api/career-assessment/
```

## ✅ Testing Checklist

- [ ] Django server is running on port 8000
- [ ] All 3 tests (MBTI, GRIT, RIASEC) are completed in database
- [ ] Answers are stored in correct format
- [ ] Next.js API route is created
- [ ] Environment variable is set
- [ ] Error handling is implemented
- [ ] Loading states are shown to user
- [ ] Results are displayed properly

## 🐛 Common Issues

**Issue**: "Connection refused" error
- **Fix**: Make sure Django server is running: `python manage.py runserver`

**Issue**: "Test not completed" error
- **Fix**: Check database that all 3 tests have status = 'COMPLETED'

**Issue**: "Invalid input" error
- **Fix**: Verify answers format matches API requirements (60 for MBTI, 12 for GRIT, 48 for RIASEC)

**Issue**: Empty recommendations
- **Fix**: Lower `min_match_score` or check if user's test results are valid
