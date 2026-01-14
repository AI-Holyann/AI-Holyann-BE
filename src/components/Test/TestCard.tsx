import React from 'react';
import {ArrowRight, Brain, Briefcase, Activity, CheckCircle2, RotateCcw} from 'lucide-react';
import {TestResult} from '../types';

interface TestCardProps {
    title: string;
    description: string;
    colorClass: string;
    iconType: 'MBTI' | 'RIASEC' | 'GRIT';
    onClick: () => void;
    onViewResult?: () => void;
    onReset?: () => void;
    isCompleted?: boolean;
    result?: TestResult;
}

const TestCard: React.FC<TestCardProps> = ({
                                               title,
                                               description,
                                               colorClass,
                                               iconType,
                                               onClick,
                                               onViewResult,
                                               onReset,
                                               isCompleted,
                                               result
                                           }) => {
    const getIcon = () => {
        switch (iconType) {
            case 'MBTI':
                return <Brain className="w-6 h-6 text-white"/>;
            case 'RIASEC':
                return <Briefcase className="w-6 h-6 text-white"/>;
            case 'GRIT':
                return <Activity className="w-6 h-6 text-white"/>;
            default:
                return <Brain className="w-6 h-6 text-white"/>;
        }
    };

    return (
        <div
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border ${isCompleted ? 'border-green-200 dark:border-green-700 bg-green-50/30 dark:bg-green-900/20' : 'border-gray-100 dark:border-gray-700'} p-6 flex flex-col h-full hover:shadow-md dark:hover:shadow-lg transition-shadow duration-300`}>
            <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg ${colorClass} flex items-center justify-center`}>
                    {getIcon()}
                </div>
                {isCompleted && (
                    <div
                        className="flex items-center gap-1.5 px-2.5 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 rounded-full text-xs font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5"/>
                        Đã hoàn thành
                    </div>
                )}
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">{title}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed">
                {description}
            </p>

            {/* Hiển thị kết quả nếu đã hoàn thành */}
            {isCompleted && result && (
                <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg border border-blue-100 dark:border-blue-800">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Kết quả</span>
                    </div>
                    <p className="text-lg font-bold text-blue-700 dark:text-blue-300">{result.rawLabel}</p>
                    {result.type === 'GRIT' && result.scores['Grit'] && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Điểm: {result.scores['Grit']}/5.0</p>
                    )}
                </div>
            )}

            <div className="mt-auto space-y-2">
                <button
                    onClick={isCompleted && onViewResult ? onViewResult : onClick}
                    className={`w-full py-2.5 px-4 font-medium rounded-lg border transition-colors flex items-center justify-center gap-2 group ${
                        isCompleted
                            ? 'bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700'
                            : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600'
                    }`}
                >
                    {isCompleted ? 'Xem kết quả' : 'Làm bài test'}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/>
                </button>
                
                {isCompleted && onReset && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onReset();
                        }}
                        className="w-full py-2 px-4 text-sm font-medium rounded-lg border border-orange-200 dark:border-orange-700 bg-orange-50 dark:bg-orange-900/30 hover:bg-orange-100 dark:hover:bg-orange-900/40 text-orange-700 dark:text-orange-300 transition-colors flex items-center justify-center gap-2 group"
                    >
                        <RotateCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300"/>
                        Làm lại
                    </button>
                )}
            </div>
        </div>
    );
};

export default TestCard;
