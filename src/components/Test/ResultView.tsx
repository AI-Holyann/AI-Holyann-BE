import React from 'react';
import {
    RotateCcw,
    Sparkles,
    BookOpen,
    Briefcase,
    Target,
    TrendingUp,
    ArrowRight,
    Brain,
    Activity,
    Trophy
} from 'lucide-react';
import {TestResult, MajorRecommendation, TestType} from '../types';
import ResultChart from './ResultChart';
import {TEST_DESCRIPTIONS} from '@/constants';

interface ResultViewProps {
    result: TestResult | null;
    recommendations: MajorRecommendation[];
    loadingRecommendations: boolean;
    onBackToDashboard: () => void;
    // New props for test progress
    remainingTests?: TestType[];
    onStartNextTest?: (type: TestType) => void;
    allTestsCompleted?: boolean;
    onViewAllRecommendations?: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({
                                                   result,
                                                   recommendations,
                                                   loadingRecommendations,
                                                   onBackToDashboard,
                                                   remainingTests = [],
                                                   onStartNextTest,
                                                   allTestsCompleted = false,
                                                   onViewAllRecommendations
                                               }) => {
    if (!result) return null;

    const getTestIcon = (type: TestType) => {
        switch (type) {
            case 'MBTI':
                return <Brain className="w-5 h-5"/>;
            case 'GRIT':
                return <Activity className="w-5 h-5"/>;
            case 'RIASEC':
                return <Briefcase className="w-5 h-5"/>;
        }
    };

    const getTestColor = (type: TestType) => {
        switch (type) {
            case 'MBTI':
                return 'bg-blue-500 hover:bg-blue-600';
            case 'GRIT':
                return 'bg-purple-500 hover:bg-purple-600';
            case 'RIASEC':
                return 'bg-emerald-500 hover:bg-emerald-600';
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <button
                onClick={onBackToDashboard}
                className="text-gray-500 hover:text-gray-900 flex items-center gap-2 text-sm font-medium"
            >
                <RotateCcw size={16}/> Quay về trang chủ
            </button>

            {/* Chart Section - Full Width */}
            <div className="w-full">
                <ResultChart result={result}/>
            </div>
        </div>
    );
};

export default ResultView;