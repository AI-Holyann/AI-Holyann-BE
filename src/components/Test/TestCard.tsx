import React from 'react';
import {ArrowRight, Brain, Briefcase, Activity, CheckCircle2} from 'lucide-react';
import {TestResult} from '../types';

interface TestCardProps {
    title: string;
    description: string;
    colorClass: string;
    iconType: 'MBTI' | 'RIASEC' | 'GRIT';
    onClick: () => void;
    onViewResult?: () => void;
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
            className={`bg-white rounded-xl shadow-sm border ${isCompleted ? 'border-green-200 bg-green-50/30' : 'border-gray-100'} p-6 flex flex-col h-full hover:shadow-md transition-shadow duration-300`}>
            <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg ${colorClass} flex items-center justify-center`}>
                    {getIcon()}
                </div>
                {isCompleted && (
                    <div
                        className="flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5"/>
                        Đã hoàn thành
                    </div>
                )}
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                {description}
            </p>

            {/* Hiển thị kết quả nếu đã hoàn thành */}
            {isCompleted && result && (
                <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-gray-500 uppercase">Kết quả</span>
                    </div>
                    <p className="text-lg font-bold text-blue-700">{result.rawLabel}</p>
                    {result.type === 'GRIT' && result.scores['Grit'] && (
                        <p className="text-sm text-gray-600 mt-1">Điểm: {result.scores['Grit']}/5.0</p>
                    )}
                </div>
            )}

            <div className="mt-auto">
                <button
                    onClick={isCompleted && onViewResult ? onViewResult : onClick}
                    className={`w-full py-2.5 px-4 font-medium rounded-lg border transition-colors flex items-center justify-center gap-2 group ${
                        isCompleted
                            ? 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200'
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                    }`}
                >
                    {isCompleted ? 'Xem kết quả' : 'Làm bài test'}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/>
                </button>
            </div>
        </div>
    );
};

export default TestCard;
