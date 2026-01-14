import React from 'react';
import {Sparkles, Trophy, ArrowRight} from 'lucide-react';
import TestCard from './TestCard';
import {TestType, TestResult} from '../types';
import {TEST_DESCRIPTIONS} from '@/constants';

interface TestSelectionProps {
    onStartTest: (type: TestType) => void;
    onViewResult: (type: TestType) => void;
    onResetTest?: (type: TestType) => void;
    completedTests?: TestType[];
    testResults?: Partial<Record<TestType, TestResult>>;
    onViewRecommendations?: () => void;
}

const TestSelection: React.FC<TestSelectionProps> = ({
                                                         onStartTest,
                                                         onViewResult,
                                                         onResetTest,
                                                         completedTests = [],
                                                         testResults = {},
                                                         onViewRecommendations
                                                     }) => {
    const allCompleted = completedTests.length >= 3;
    const completedCount = completedTests.length;

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-500 dark:text-yellow-400"/>
                    Khám phá bản thân
                </h2>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        Hoàn thành: <span className="font-bold text-blue-600 dark:text-blue-400">{completedCount}/3</span>
                    </span>
                    {completedCount > 0 && (
                        <div className="flex gap-1">
                            {[1, 2, 3].map(i => (
                                <div
                                    key={i}
                                    className={`w-2.5 h-2.5 rounded-full ${i <= completedCount ? 'bg-green-500 dark:bg-green-400' : 'bg-gray-200 dark:bg-gray-700'}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <TestCard
                    title={TEST_DESCRIPTIONS.MBTI.title}
                    description={TEST_DESCRIPTIONS.MBTI.desc}
                    colorClass={TEST_DESCRIPTIONS.MBTI.color}
                    iconType="MBTI"
                    onClick={() => onStartTest('MBTI')}
                    onViewResult={() => onViewResult('MBTI')}
                    onReset={onResetTest ? () => onResetTest('MBTI') : undefined}
                    isCompleted={completedTests.includes('MBTI')}
                    result={testResults['MBTI']}
                />
                <TestCard
                    title={TEST_DESCRIPTIONS.GRIT.title}
                    description={TEST_DESCRIPTIONS.GRIT.desc}
                    colorClass={TEST_DESCRIPTIONS.GRIT.color}
                    iconType="GRIT"
                    onClick={() => onStartTest('GRIT')}
                    onViewResult={() => onViewResult('GRIT')}
                    onReset={onResetTest ? () => onResetTest('GRIT') : undefined}
                    isCompleted={completedTests.includes('GRIT')}
                    result={testResults['GRIT']}
                />
                <TestCard
                    title={TEST_DESCRIPTIONS.RIASEC.title}
                    description={TEST_DESCRIPTIONS.RIASEC.desc}
                    colorClass={TEST_DESCRIPTIONS.RIASEC.color}
                    iconType="RIASEC"
                    onClick={() => onStartTest('RIASEC')}
                    onViewResult={() => onViewResult('RIASEC')}
                    onReset={onResetTest ? () => onResetTest('RIASEC') : undefined}
                    isCompleted={completedTests.includes('RIASEC')}
                    result={testResults['RIASEC']}
                />
            </div>

            {/* Nút Đề xuất nghề nghiệp - chỉ hiện khi đã hoàn thành tất cả 3 bài test */}
            {allCompleted && onViewRecommendations && (
                <div className="mt-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 dark:from-indigo-600 dark:via-purple-600 dark:to-pink-600 rounded-2xl p-6 shadow-lg dark:shadow-xl">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-2xl font-bold text-white mb-2 flex items-center justify-center md:justify-start gap-2">
                                <Trophy className="w-6 h-6" />
                                🎯 Đề xuất nghề nghiệp
                            </h3>
                            <p className="text-indigo-100 dark:text-indigo-200 text-sm md:text-base">
                                Dựa trên kết quả 3 bài test, chúng tôi sẽ phân tích và đề xuất những nghề nghiệp phù hợp nhất với bạn
                            </p>
                        </div>
                        <button
                            onClick={onViewRecommendations}
                            className="bg-white dark:bg-gray-100 text-indigo-600 dark:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-gray-200 font-semibold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg dark:shadow-xl flex items-center gap-2 whitespace-nowrap"
                        >
                            <ArrowRight className="w-5 h-5" />
                            Xem đề xuất nghề nghiệp
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TestSelection;
