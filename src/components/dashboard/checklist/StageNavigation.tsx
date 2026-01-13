import React from 'react';
import {CheckCircle2, Lock, Circle} from 'lucide-react';
import {Stage} from '@/components/types';

interface StageNavigationProps {
    stages: Stage[];
    currentStageId: number;
    onSelectStage: (id: number) => void;
    completedStages: number[];
}

const StageNavigation: React.FC<StageNavigationProps> = ({stages, currentStageId, onSelectStage, completedStages}) => {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 h-fit sticky top-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6 uppercase tracking-wide">Lộ trình hồ sơ</h3>
            <div className="space-y-0 relative">
                {/* Vertical Line */}
                <div className="absolute left-3.5 top-2 bottom-6 w-0.5 bg-gray-100 dark:bg-slate-700 -z-10"></div>
                {stages.map((stage) => {
                    const isActive = stage.id === currentStageId;
                    const isCompleted = completedStages.includes(stage.id);
                    const isLocked = !stage.isUnlocked;
                    let Icon = Circle;
                    let colorClass = "text-gray-300 dark:text-slate-600 border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800";
                    let textClass: string;
                    if (isCompleted) {
                        Icon = CheckCircle2;
                        colorClass = "text-green-500 dark:text-green-400 border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/30";
                        textClass = "text-gray-700 dark:text-slate-300 font-medium";
                    } else if (isActive) {
                        Icon = Circle; // Using Dot indicator for active
                        colorClass = "text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/30 ring-4 ring-blue-50 dark:ring-blue-900/20";
                        textClass = "text-blue-700 dark:text-blue-300 font-bold";
                    } else if (isLocked) {
                        Icon = Lock;
                        colorClass = "text-gray-400 dark:text-slate-600 border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800";
                        textClass = "text-gray-400 dark:text-slate-500";
                    } else {
                        // Unlocked but not active or completed (rare case in this linear flow but good to handle)
                        textClass = "text-gray-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400";
                    }
                    return (
                        <div
                            key={stage.id}
                            className={`flex items-start gap-4 pb-8 last:pb-0 group ${!isLocked ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                            onClick={() => !isLocked && onSelectStage(stage.id)}
                        >
                            <div
                                className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 ${colorClass} transition-colors`}>
                                {isActive && !isCompleted ? (
                                    <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
                                ) : (
                                    <Icon size={isLocked ? 14 : 16}/>
                                )}
                            </div>
                            <div className="pt-1">
                                <h4 className={`text-sm ${textClass} transition-colors`}>
                                    GIAI ĐOẠN {stage.id}
                                </h4>
                                <p className={`text-base ${isActive ? 'text-gray-900 dark:text-white font-bold' : 'text-gray-500 dark:text-slate-400 font-medium'}`}>
                                    {stage.name}
                                </p>
                                {isActive && (
                                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 max-w-[200px] line-clamp-2">
                                        {stage.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
export default StageNavigation;