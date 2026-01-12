import React from 'react';
import {Sparkles, Trophy, ArrowRight} from 'lucide-react';
import TestCard from './TestCard';
import {TestType, TestResult} from '../types';
import {TEST_DESCRIPTIONS} from '@/constants';

interface TestSelectionProps {
    onStartTest: (type: TestType) => void;
    onViewResult: (type: TestType) => void;
    completedTests?: TestType[];
    testResults?: Partial<Record<TestType, TestResult>>;
    onViewRecommendations?: () => void;
}

const TestSelection: React.FC<TestSelectionProps> = ({
                                                         onStartTest,
                                                         onViewResult,
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <TestCard
                    title={TEST_DESCRIPTIONS.MBTI.title}
                    description={TEST_DESCRIPTIONS.MBTI.desc}
                    colorClass={TEST_DESCRIPTIONS.MBTI.color}
                    iconType="MBTI"
                    onClick={() => onStartTest('MBTI')}
                    onViewResult={() => onViewResult('MBTI')}
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
                    isCompleted={completedTests.includes('RIASEC')}
                    result={testResults['RIASEC']}
                />
            </div>
        </div>
    );
};

export default TestSelection;
