import React from 'react';
import {Sparkles, Trophy, ArrowRight} from 'lucide-react';
import TestCard from './TestCard';
import {TestType, TestResult} from '../types';
import {TEST_DESCRIPTIONS} from '@/constants';

interface TestSelectionProps {
    onStartTest: (type: TestType) => void;
    completedTests?: TestType[];
    testResults?: Partial<Record<TestType, TestResult>>;
    onViewRecommendations?: () => void;
}

const TestSelection: React.FC<TestSelectionProps> = ({
                                                         onStartTest,
                                                         completedTests = [],
                                                         testResults = {},
                                                         onViewRecommendations
                                                     }) => {
    const allCompleted = completedTests.length >= 3;
    const completedCount = completedTests.length;

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-500"/>
                    Khám phá bản thân
                </h2>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                        Hoàn thành: <span className="font-bold text-blue-600">{completedCount}/3</span>
                    </span>
                    {completedCount > 0 && (
                        <div className="flex gap-1">
                            {[1, 2, 3].map(i => (
                                <div
                                    key={i}
                                    className={`w-2.5 h-2.5 rounded-full ${i <= completedCount ? 'bg-green-500' : 'bg-gray-200'}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Banner khi hoàn thành tất cả */}
            {allCompleted && (
                <div
                    className="mb-6 p-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/20 rounded-xl">
                                <Trophy className="w-8 h-8"/>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">🎉 Chúc mừng!</h3>
                                <p className="text-green-100">Bạn đã hoàn thành tất cả các bài test khám phá bản
                                    thân</p>
                            </div>
                        </div>
                        <button
                            onClick={onViewRecommendations}
                            className="flex items-center gap-2 px-6 py-3 bg-white text-green-700 rounded-xl font-bold hover:bg-green-50 transition-colors shadow-md"
                        >
                            <Sparkles className="w-5 h-5"/>
                            Xem đề xuất ngành nghề
                            <ArrowRight className="w-5 h-5"/>
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <TestCard
                    title={TEST_DESCRIPTIONS.MBTI.title}
                    description={TEST_DESCRIPTIONS.MBTI.desc}
                    colorClass={TEST_DESCRIPTIONS.MBTI.color}
                    iconType="MBTI"
                    onClick={() => onStartTest('MBTI')}
                    isCompleted={completedTests.includes('MBTI')}
                    result={testResults['MBTI']}
                />
                <TestCard
                    title={TEST_DESCRIPTIONS.GRIT.title}
                    description={TEST_DESCRIPTIONS.GRIT.desc}
                    colorClass={TEST_DESCRIPTIONS.GRIT.color}
                    iconType="GRIT"
                    onClick={() => onStartTest('GRIT')}
                    isCompleted={completedTests.includes('GRIT')}
                    result={testResults['GRIT']}
                />
                <TestCard
                    title={TEST_DESCRIPTIONS.RIASEC.title}
                    description={TEST_DESCRIPTIONS.RIASEC.desc}
                    colorClass={TEST_DESCRIPTIONS.RIASEC.color}
                    iconType="RIASEC"
                    onClick={() => onStartTest('RIASEC')}
                    isCompleted={completedTests.includes('RIASEC')}
                    result={testResults['RIASEC']}
                />
            </div>
        </div>
    );
};

export default TestSelection;
