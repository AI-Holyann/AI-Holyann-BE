'use client';

import React, {useEffect, useMemo, useState} from 'react';
import AuthHeader from '@/components/dashboard/AuthHeader';
import TestSelection from '@/components/Test/TestSelection';
import TestView from '@/components/Test/TestView';
import ResultView from '@/components/Test/ResultView';
import CareerAssessmentResults from '@/components/CareerAssessmentResults';
import {TestType, Question, TestResult, MajorRecommendation} from '@/components/types';
import {MBTI_QUESTIONS, GRIT_QUESTIONS, RIASEC_QUESTIONS} from '@/constants';
import {calculateMBTIResult as calculateMBTIScores, MBTI_TYPE_DESCRIPTIONS} from '@/data/mbti-questions';
import {
    calculateRIASECResult as calculateRIASECScores,
    getHollandCodeDescription,
    RIASEC_CATEGORIES
} from '@/data/riasec-questions';
import {calculateGritResult as calculateGritScores, GRIT_COMPONENTS} from '@/data/grit-questions';
import {getMajorRecommendations} from '@/service/geminiService';
import {useTestProgress} from '@/hooks/useTestProgress';
import {useSession} from 'next-auth/react'

type ViewState = 'selection' | 'test' | 'result';

export default function TestsPage() {
    const [viewState, setViewState] = useState<ViewState>('selection');
    const [currentTestType, setCurrentTestType] = useState<TestType | null>(null);
    const [testResult, setTestResult] = useState<TestResult | null>(null);
    const [recommendations, setRecommendations] = useState<MajorRecommendation[]>([]);
    const [loadingRecommendations, setLoadingRecommendations] = useState(false);
    const {data: session} = useSession()

    const [currentTestId, setCurrentTestId] = useState<string | null>(null)
    const [currentQuestions, setCurrentQuestions] = useState<Question[]>([])
    const [careerRecs, setCareerRecs] = useState<MajorRecommendation[]>([])
    const [showCareerAssessment, setShowCareerAssessment] = useState(false)

    // State để lưu remainingTests tại thời điểm hoàn thành test (để tránh async state issue)
    const [currentRemainingTests, setCurrentRemainingTests] = useState<TestType[]>([]);
    const [currentAllCompleted, setCurrentAllCompleted] = useState(false);

    // Memoize studentId để tránh re-render không cần thiết
    const studentId = useMemo(() => {
        // 1. Thử lấy từ NextAuth session trước
        const sessionUserId = (session?.user as any)?.id || (session?.user as any)?.user_id
        if (sessionUserId) {
            console.log('✅ Got student ID from NextAuth session:', sessionUserId)
            return sessionUserId as string
        }

        // 2. Thử lấy từ localStorage session (cho local auth)
        if (typeof window !== 'undefined') {
            try {
                const localSession = localStorage.getItem('session')
                if (localSession) {
                    const parsed = JSON.parse(localSession)
                    const localUserId = parsed.user?.id || parsed.user?.user_id
                    if (localUserId) {
                        console.log('✅ Got student ID from localStorage session:', localUserId)
                        return localUserId as string
                    }
                }
            } catch (e) {
                console.warn('Could not parse session from localStorage:', e)
            }

            // 3. Fallback: thử lấy từ localStorage user (legacy)
            try {
                const saved = localStorage.getItem('user')
                if (saved) {
                    const parsed = JSON.parse(saved)
                    const legacyUserId = parsed.id || parsed.user_id
                    if (legacyUserId) {
                        console.log('✅ Got student ID from localStorage user (legacy):', legacyUserId)
                        return legacyUserId as string
                    }
                }
            } catch (e) {
                console.warn('Could not parse user from localStorage:', e)
            }
        }

        console.warn('❌ Could not find student ID from any source')
        return null
    }, [session]);

    // Tự động tạo student profile nếu chưa có
    useEffect(() => {
        const ensureStudentProfile = async () => {
            if (studentId && session) {
                try {
                    const response = await fetch('/api/create-student', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({user_id: studentId})
                    })
                    const data = await response.json()
                    if (!data.success) {
                        console.error('Failed to ensure student profile:', data.error)
                    } else {
                        console.log('✅ Student profile ensured')
                    }
                } catch (error) {
                    console.error('Error ensuring student profile:', error)
                }
            }
        }

        ensureStudentProfile()
    }, [studentId, session])

    // Hook để quản lý tiến độ test - giờ lấy từ database
    const {
        progress,
        isLoaded,
        saveTestResult,
    } = useTestProgress(studentId);

    const getStudentId = () => studentId;

    // Đồng bộ remainingTests và allCompleted từ progress hook
    useEffect(() => {
        setCurrentAllCompleted(progress.allCompleted);
        const allTests: TestType[] = ['MBTI', 'GRIT', 'RIASEC'];
        setCurrentRemainingTests(allTests.filter(t => !progress.completedTests.includes(t)));
    }, [progress]);

    // Lấy career recommendations nếu đã hoàn thành tất cả tests
    useEffect(() => {
        if (studentId && progress.allCompleted && isLoaded) {
            fetchCareerRecommendations(studentId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [studentId, progress.allCompleted, isLoaded]);

    const handleStartTest = async (type: TestType) => {
        const studentId = getStudentId()
        if (!studentId) {
            alert('Không tìm thấy thông tin user. Vui lòng đăng nhập lại.')
            return
        }

        console.log('🚀 Starting test:', type, 'for student:', studentId)

        try {
            const res = await fetch('/api/tests', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({student_id: studentId, test_type: type.toLowerCase()})
            })

            if (!res.ok) {
                const errorText = await res.text()
                console.error('API Error:', res.status, errorText)
                alert(`Lỗi server (${res.status}): ${errorText}`)
                return
            }

            const data = await res.json()
            console.log('API Response:', data)

            if (!data.success) {
                console.error('Test creation failed:', data.error)
                alert(data.error || 'Không thể bắt đầu bài test')
                return
            }

            setCurrentTestId(data.test_id)
            setCurrentQuestions(data.questions || getQuestionsForTest(type))
            setCurrentTestType(type)
            setViewState('test')

        } catch (e) {
            console.error('Start test failed', e)
            alert('Không thể bắt đầu bài test. Kiểm tra kết nối.')
        }
    }

    const getQuestionsForTest = (type: TestType): Question[] => {
        if (currentTestType === type && currentQuestions.length) return currentQuestions
        switch (type) {
            case 'MBTI':
                return MBTI_QUESTIONS
            case 'GRIT':
                return GRIT_QUESTIONS
            case 'RIASEC':
                return RIASEC_QUESTIONS
            default:
                return []
        }
    }

    const submitAnswersToApi = async (answers: Record<number, string | number | boolean>, testType: TestType) => {
        if (!currentTestId) return
        const entries = Object.entries(answers)
        for (const [key, val] of entries) {
            await fetch('/api/tests/answer', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    test_id: currentTestId,
                    test_type: testType.toLowerCase(),
                    question_number: Number(key) - 1, // API expects 0-based
                    answer: val
                })
            })
        }
    }

    const calculateMBTIResult = (answers: Record<number, string | number | boolean>): TestResult => {
        // Chuyển đổi answers sang Record<number, number> cho hàm tính điểm
        const numericAnswers: Record<number, number> = {};
        Object.entries(answers).forEach(([key, value]) => {
            numericAnswers[Number(key)] = Number(value);
        });

        // Sử dụng hàm tính điểm từ file mbti-questions.ts
        const result = calculateMBTIScores(numericAnswers);
        const typeInfo = MBTI_TYPE_DESCRIPTIONS[result.type];

        return {
            type: 'MBTI',
            scores: result.percentages,
            rawLabel: result.type,
            description: typeInfo
                ? `${typeInfo.title} (${typeInfo.nickname}) - ${typeInfo.description}`
                : `Kết quả MBTI của bạn: ${result.type}`
        };
    };

    const calculateGritResult = (answers: Record<number, string | number | boolean>): TestResult => {
        // Chuyển đổi answers sang Record<number, number> cho hàm tính điểm
        const numericAnswers: Record<number, number> = {};
        Object.entries(answers).forEach(([key, value]) => {
            numericAnswers[Number(key)] = Number(value);
        });

        // Sử dụng hàm tính điểm từ file grit-questions.ts
        const result = calculateGritScores(numericAnswers);

        // Tạo description chi tiết
        const passionInfo = GRIT_COMPONENTS.passion;
        const perseveranceInfo = GRIT_COMPONENTS.perseverance;

        const description = `${result.level.level} (${result.level.level_en}): ${result.level.description}

📊 Chi tiết điểm số:
• ${passionInfo.name_vi} (${passionInfo.name}): ${result.passionScore}/5.0 - ${result.passionLevel.level}
• ${perseveranceInfo.name_vi} (${perseveranceInfo.name}): ${result.perseveranceScore}/5.0 - ${result.perseveranceLevel.level}`;

        return {
            type: 'GRIT',
            scores: {
                Grit: result.gritScore,
                [passionInfo.name_vi]: result.passionScore,
                [perseveranceInfo.name_vi]: result.perseveranceScore
            },
            rawLabel: result.level.level,
            description: description
        };
    };

    const calculateRIASECResult = (answers: Record<number, string | number | boolean>): TestResult => {
        // Chuyển đổi answers sang Record<number, boolean> cho hàm tính điểm
        const booleanAnswers: Record<number, boolean> = {};
        Object.entries(answers).forEach(([key, value]) => {
            // Xử lý cả boolean trực tiếp và các giá trị khác
            booleanAnswers[Number(key)] = value === true || value === 'true' || value === 1;
        });

        // Sử dụng hàm tính điểm từ file riasec-questions.ts
        const result = calculateRIASECScores(booleanAnswers);
        const codeInfo = getHollandCodeDescription(result.hollandCode);

        // Tạo description từ top 3 categories
        const topCategoriesDesc = result.topThree
            .map(t => `${RIASEC_CATEGORIES[t.category].name_vi} (${t.category})`)
            .join(' - ');

        return {
            type: 'RIASEC',
            scores: result.percentages,
            rawLabel: result.hollandCode,
            description: `${codeInfo.title}: ${codeInfo.description}\n\nXu hướng chính: ${topCategoriesDesc}`
        };
    };

    const handleTestComplete = async (answers: Record<number, string | number | boolean>) => {
        if (!currentTestType) return
        const studentId = getStudentId()
        if (!studentId || !currentTestId) {
            alert('Không tìm thấy student_id hoặc test_id. Vui lòng thử lại.')
            return
        }

        // Lưu đáp án lên API
        await submitAnswersToApi(answers, currentTestType)

        // Gọi complete cho test hiện tại
        let computedResult: TestResult | null = null
        try {
            const res = await fetch('/api/tests/complete', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({student_id: studentId, test_type: currentTestType.toLowerCase()})
            })
            const data = await res.json()
            if (data.success) {
                if (currentTestType === 'MBTI' && data.result) {
                    computedResult = {
                        type: 'MBTI',
                        scores: data.result.scores || {},
                        rawLabel: data.result.result_type,
                        description: ''
                    }
                } else if (currentTestType === 'RIASEC' && data.result) {
                    computedResult = {
                        type: 'RIASEC',
                        scores: data.result.scores || {},
                        rawLabel: data.result.result_code,
                        description: ''
                    }
                } else if (currentTestType === 'GRIT' && data.result) {
                    computedResult = {
                        type: 'GRIT',
                        scores: {Grit: data.result.total_score},
                        rawLabel: data.result.level,
                        description: data.result.description
                    }
                }
            }
        } catch (e) {
            console.error('Complete test error', e)
        }

        // Fall back local calc nếu API không trả
        if (!computedResult) {
            switch (currentTestType) {
                case 'MBTI':
                    computedResult = calculateMBTIResult(answers)
                    break
                case 'RIASEC':
                    computedResult = calculateRIASECResult(answers)
                    break
                case 'GRIT':
                    computedResult = calculateGritResult(answers)
                    break
            }
        }

        setTestResult(computedResult)
        saveTestResult(currentTestType, computedResult)

        // Cập nhật remainingTests & allCompleted tạm thời
        const allTests: TestType[] = ['MBTI', 'GRIT', 'RIASEC']
        const newCompleted = progress.completedTests.includes(currentTestType)
            ? progress.completedTests
            : [...progress.completedTests, currentTestType]
        const remaining = allTests.filter(t => !newCompleted.includes(t)) as TestType[]
        setCurrentRemainingTests(remaining)
        const newAllCompleted = newCompleted.length >= 3
        setCurrentAllCompleted(newAllCompleted)

        setViewState('result')

        // Nếu đã đủ 3 bài, gọi complete all để lấy career recs và cập nhật DB
        if (newAllCompleted) {
            try {
                await fetch('/api/tests/complete', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({student_id: studentId})
                })
                await fetchCareerRecommendations(studentId)
            } catch (e) {
                console.error('Complete all tests error', e)
            }
        } else {
            setCareerRecs([])
        }
    }

    const fetchCareerRecommendations = async (studentId: string) => {
        try {
            const res = await fetch(`/api/tests/career/${studentId}`)
            const data = await res.json()
            if (data.success) {
                const recs: MajorRecommendation[] = (data.recommendations || []).map((r: any) => ({
                    name: r.job_title,
                    category: '',
                    matchReason: r.reasoning,
                    careerPaths: [],
                    requiredSkills: [],
                    matchPercentage: r.match_percentage
                }))
                setCareerRecs(recs)
                setRecommendations(recs)
            }
        } catch (e) {
            console.error('Fetch career recs error', e)
        }
    }

    const handleBackToSelection = () => {
        setViewState('selection');
        setCurrentTestType(null);
        setCurrentTestId(null)
        setTestResult(null);
        setRecommendations([]);
    };

    const handleStartNextTest = (type: TestType) => {
        setCurrentTestType(null)
        setTestResult(null)
        setRecommendations([])
        handleStartTest(type)
    };

    const handleViewAllRecommendations = async () => {
        const studentId = getStudentId()
        if (!studentId) return
        await fetchCareerRecommendations(studentId)
        setViewState('selection')
    };

    // Loading state khi chưa load xong từ localStorage
    if (!isLoaded) {
        return (
            <>
                <AuthHeader/>
                <main
                    className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-center">
                        <div
                            className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    </div>
                </main>
            </>
        );
    }

    return (
        <>
            <AuthHeader/>
            <main
                className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {viewState === 'selection' && (
                        <TestSelection
                            onStartTest={handleStartTest}
                            completedTests={progress.completedTests}
                            testResults={progress.results}
                            onViewRecommendations={handleViewAllRecommendations}
                        />
                    )}

                    {viewState === 'test' && currentTestType && (
                        <TestView
                            testType={currentTestType}
                            questions={getQuestionsForTest(currentTestType)}
                            onBack={handleBackToSelection}
                            onComplete={handleTestComplete}
                        />
                    )}

                    {viewState === 'result' && (
                        <ResultView
                            result={testResult}
                            recommendations={careerRecs.length ? careerRecs : recommendations}
                            loadingRecommendations={loadingRecommendations}
                            onBackToDashboard={handleBackToSelection}
                            remainingTests={currentRemainingTests}
                            onStartNextTest={handleStartNextTest}
                            allTestsCompleted={currentAllCompleted}
                            onViewAllRecommendations={handleViewAllRecommendations}
                        />
                    )}

                    {/* Career Assessment Results - hiển thị khi hoàn thành tất cả 3 bài test */}
                    {currentAllCompleted && studentId && (
                        <CareerAssessmentResults
                            studentId={studentId}
                            onClose={() => setShowCareerAssessment(false)}
                        />
                    )}
                </div>
            </main>
        </>
    );
}
