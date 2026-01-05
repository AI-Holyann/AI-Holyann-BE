// filepath: d:\holyann-ai-web\src\hooks\useTestProgress.ts
'use client';

import {useState, useEffect, useCallback} from 'react';
import {TestType, TestResult} from '@/components/types';

export interface TestProgress {
    completedTests: TestType[];
    results: Partial<Record<TestType, TestResult>>;
    allCompleted: boolean;
}

export function useTestProgress(studentId?: string | null) {
    const [progress, setProgress] = useState<TestProgress>({
        completedTests: [],
        results: {},
        allCompleted: false
    });
    const [isLoaded, setIsLoaded] = useState(false);

    // Load progress from database on mount or when studentId changes
    useEffect(() => {
        const loadProgressFromDB = async () => {
            if (!studentId) {
                setIsLoaded(true);
                return;
            }

            try {
                const res = await fetch(`/api/tests/results/${studentId}`);
                const data = await res.json();

                if (!data.success) {
                    console.error('Failed to load progress:', data.error);
                    setIsLoaded(true);
                    return;
                }

                // Parse progress from API response
                const completedTests: TestType[] = [];
                const results: Partial<Record<TestType, TestResult>> = {};

                if (data.results?.mbti) {
                    completedTests.push('MBTI');
                    results['MBTI'] = {
                        type: 'MBTI',
                        scores: data.results.mbti.scores || {},
                        rawLabel: data.results.mbti.result_type,
                        description: ''
                    };
                }

                if (data.results?.riasec) {
                    completedTests.push('RIASEC');
                    results['RIASEC'] = {
                        type: 'RIASEC',
                        scores: data.results.riasec.scores || {},
                        rawLabel: data.results.riasec.result_code,
                        description: ''
                    };
                }

                if (data.results?.grit) {
                    completedTests.push('GRIT');
                    results['GRIT'] = {
                        type: 'GRIT',
                        scores: {Grit: data.results.grit.total_score},
                        rawLabel: data.results.grit.level,
                        description: data.results.grit.description || ''
                    };
                }

                setProgress({
                    completedTests,
                    results,
                    allCompleted: data.progress?.all_completed || false
                });

            } catch (e) {
                console.error('Failed to load test progress from DB:', e);
            } finally {
                setIsLoaded(true);
            }
        };

        loadProgressFromDB();
    }, [studentId]);

    const saveTestResult = useCallback((testType: TestType, result: TestResult) => {
        setProgress(prev => {
            const newCompletedTests = prev.completedTests.includes(testType)
                ? prev.completedTests
                : [...prev.completedTests, testType];

            const newResults = {
                ...prev.results,
                [testType]: result
            };

            return {
                completedTests: newCompletedTests,
                results: newResults,
                allCompleted: newCompletedTests.length >= 3
            };
        });

        // Note: Actual saving to DB is handled by the API calls in the page component
        // This hook now primarily serves as a client-side cache
    }, []);

    const isTestCompleted = useCallback((testType: TestType): boolean => {
        return progress.completedTests.includes(testType);
    }, [progress.completedTests]);

    const getTestResult = useCallback((testType: TestType): TestResult | undefined => {
        return progress.results[testType];
    }, [progress.results]);

    const getRemainingTests = useCallback((): TestType[] => {
        const allTests: TestType[] = ['MBTI', 'GRIT', 'RIASEC'];
        return allTests.filter(t => !progress.completedTests.includes(t));
    }, [progress.completedTests]);

    const getCompletedCount = useCallback((): number => {
        return progress.completedTests.length;
    }, [progress.completedTests]);

    const resetProgress = useCallback(async () => {
        // Reset local state immediately
        setProgress({
            completedTests: [],
            results: {},
            allCompleted: false
        });

        // Note: If you want to reset in DB, you'll need to add an API endpoint for that
        // For now, this just clears the client-side cache
    }, []);

    return {
        progress,
        isLoaded,
        saveTestResult,
        isTestCompleted,
        getTestResult,
        getRemainingTests,
        getCompletedCount,
        resetProgress
    };
}

