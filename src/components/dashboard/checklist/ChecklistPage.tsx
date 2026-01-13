'use client'

import React, {useState, useMemo, useCallback} from 'react';
import {useRouter} from 'next/navigation';
import {
    CheckSquare,
    Square,
    ArrowRight,
    Flag,
    Rocket,
    Trophy,
    AlertCircle,
    ChevronDown,
    UploadCloud,
    FileText,
    MessageSquare,
    Clock,
    Calendar,
    Loader2,
    Sparkles
} from 'lucide-react';
import {Task, Stage, StudentProfile} from '@/components/types';
import ProgressBar from './ProgressBar';
import StageNavigation from './StageNavigation';
import {scanCVWithAI} from '@/service/geminiService';

// Helper to calculate days remaining
const getDaysRemaining = (deadline: string) => {
    const parts = deadline.split('/');
    const date = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return {text: 'Quá hạn', color: 'text-red-600 bg-red-50 ring-red-100'};
    if (diffDays <= 7) return {text: `Còn ${diffDays} ngày`, color: 'text-orange-600 bg-orange-50 ring-orange-100'};
    return {text: 'Đang thực hiện', color: 'text-blue-600 bg-blue-50 ring-blue-100'};
};

const ChecklistPage: React.FC = () => {
    const [stages, setStages] = useState<Stage[]>([
        {id: 1, name: 'KHỞI ĐỘNG', description: 'Làm quen với HOEX, thiết lập hồ sơ & mục tiêu.', isUnlocked: true},
        {
            id: 2,
            name: 'PHÁT TRIỂN',
            description: 'Xây dựng hồ sơ học thuật, ngoại khóa và tài liệu ứng tuyển.',
            isUnlocked: false
        },
        {
            id: 3,
            name: 'VỀ ĐÍCH',
            description: 'Hoàn tất thủ tục visa, vé máy bay và chuẩn bị lên đường.',
            isUnlocked: false
        },
    ]);

    const [tasks, setTasks] = useState<Task[]>([
        // Stage 1 - Simplified with AI CV Scanning
        {
            id: '1-1',
            stageId: 1,
            title: 'Đọc nội quy của HOEX',
            deadline: '25/10/2023',
            isCompleted: false,
            category: 'Khởi động'
        },
        {
            id: '1-2',
            stageId: 1,
            title: 'Upload CV - AI sẽ tự động scan thông tin',
            deadline: '28/10/2023',
            isCompleted: false,
            requiresFile: true,
            category: 'Khởi động',
            feedback: 'Sau khi upload, AI sẽ tự động trích xuất: thông tin cá nhân, học vấn, kinh nghiệm, kỹ năng, và thành tích từ CV của bạn.'
        },
        // 3 task khám phá bản thân mới
        {
            id: '1-3',
            stageId: 1,
            title: 'Làm bài test MBTI - Khám phá kiểu tính cách',
            deadline: '30/10/2023',
            isCompleted: false,
            category: 'Khám phá bản thân',
            linkTo: '/dashboard/tests',
            feedback: 'Bài test MBTI giúp bạn hiểu rõ kiểu tính cách của mình, từ đó định hướng nghề nghiệp và môi trường học tập phù hợp.'
        },
        {
            id: '1-4',
            stageId: 1,
            title: 'Làm bài test Grit Scale - Đánh giá độ bền bỉ',
            deadline: '30/10/2023',
            isCompleted: false,
            category: 'Khám phá bản thân',
            linkTo: '/dashboard/tests',
            feedback: 'Grit Scale đo lường mức độ kiên trì và đam mê theo đuổi mục tiêu dài hạn của bạn.'
        },
        {
            id: '1-5',
            stageId: 1,
            title: 'Làm bài test Holland (RIASEC) - Xu hướng nghề nghiệp',
            deadline: '30/10/2023',
            isCompleted: false,
            category: 'Khám phá bản thân',
            linkTo: '/dashboard/tests',
            feedback: 'Holland Code giúp xác định xu hướng nghề nghiệp dựa trên 6 nhóm tính cách: Realistic, Investigative, Artistic, Social, Enterprising, Conventional.'
        },

        // Stage 2
        {
            id: '2-1',
            stageId: 2,
            category: 'Hồ sơ học thuật',
            title: 'Tải lên bảng điểm (Transcript)',
            deadline: '15/11/2023',
            isCompleted: false,
            requiresFile: true
        },
        {
            id: '2-2',
            stageId: 2,
            category: 'Hồ sơ học thuật',
            title: 'Tải lên chứng chỉ ngoại ngữ (IELTS/TOEFL)',
            deadline: '20/11/2023',
            isCompleted: false,
            requiresFile: true
        },
        {
            id: '2-3',
            stageId: 2,
            category: 'Hồ sơ học thuật',
            title: 'Cập nhật kỹ năng bổ trợ (Lập trình, nhạc cụ...)',
            deadline: '25/11/2023',
            isCompleted: false
        },
        {
            id: '2-4',
            stageId: 2,
            category: 'Tài liệu cần thiết',
            title: 'Tải lên CV/Resume chuẩn',
            deadline: '01/12/2023',
            isCompleted: false,
            requiresFile: true
        },
        {
            id: '2-5',
            stageId: 2,
            category: 'Tài liệu cần thiết',
            title: 'Hoàn thiện Sơ yếu lý lịch',
            deadline: '05/12/2023',
            isCompleted: false,
            requiresFile: true
        },
        {
            id: '2-6',
            stageId: 2,
            category: 'Tài liệu cần thiết',
            title: 'Viết bài luận chính (Personal Statement)',
            deadline: '15/12/2023',
            isCompleted: false,
            requiresFile: true
        },
        {
            id: '2-7',
            stageId: 2,
            category: 'Tài liệu cần thiết',
            title: 'Xin thư giới thiệu (LOR)',
            deadline: '20/12/2023',
            isCompleted: false,
            requiresFile: true
        },
        {
            id: '2-9',
            stageId: 2,
            category: 'Cá nhân hóa (Mục tiêu Mỹ)',
            title: 'Thi SAT/ACT hoặc bổ sung chứng chỉ chuẩn hóa',
            deadline: '10/01/2024',
            isCompleted: false,
            requiresFile: true
        },
        {
            id: '2-10',
            stageId: 2,
            category: 'Cá nhân hóa (Mục tiêu Mỹ)',
            title: 'Tham gia hoạt động ngoại khóa (Vai trò lãnh đạo)',
            deadline: '15/01/2024',
            isCompleted: false
        },
        {
            id: '2-11',
            stageId: 2,
            category: 'Cá nhân hóa (Mục tiêu Mỹ)',
            title: 'Chuẩn bị hồ sơ chứng minh tài chính',
            deadline: '20/01/2024',
            isCompleted: false,
            requiresFile: true
        },

        // Stage 3
        {
            id: '3-1',
            stageId: 3,
            title: 'Đặt vé máy bay',
            deadline: '01/06/2024',
            isCompleted: false,
            requiresFile: true
        },
        {
            id: '3-2',
            stageId: 3,
            title: 'Hoàn thiện hồ sơ Visa (Visa F-1 & Phỏng vấn)',
            deadline: '15/06/2024',
            isCompleted: false,
            requiresFile: true
        },
        {
            id: '3-3',
            stageId: 3,
            title: 'Kiểm tra danh sách đồ cần chuẩn bị trước khi bay',
            deadline: '01/07/2024',
            isCompleted: false
        },
    ]);

    const [activeStageId, setActiveStageId] = useState<number>(1);
    const [expandedTaskIds, setExpandedTaskIds] = useState<Set<string>>(new Set());
    const [uploadingCV, setUploadingCV] = useState(false);
    const [scanningCV, setScanningCV] = useState(false);
    const [scannedProfile, setScannedProfile] = useState<StudentProfile | null>(null);
    const [cvScanError, setCvScanError] = useState<string>('');

    const router = useRouter();

    const currentStageTasks = useMemo(() =>
            tasks.filter(t => t.stageId === activeStageId),
        [tasks, activeStageId]);

    const calculateProgress = useCallback((stageId: number) => {
        const stageTasks = tasks.filter(t => t.stageId === stageId);
        if (stageTasks.length === 0) return 0;
        const completed = stageTasks.filter(t => t.isCompleted).length;
        return (completed / stageTasks.length) * 100;
    }, [tasks]);

    const currentProgress = useMemo(() => calculateProgress(activeStageId), [activeStageId, calculateProgress]);

    const completedStages = useMemo(() => {
        return stages
            .filter(s => calculateProgress(s.id) === 100)
            .map(s => s.id);
    }, [stages, calculateProgress]);

    const handleToggleTask = (taskId: string) => {
        setTasks(prev => prev.map(t =>
            t.id === taskId ? {...t, isCompleted: !t.isCompleted} : t
        ));
    };

    const handleToggleExpand = (taskId: string) => {
        setExpandedTaskIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(taskId)) {
                newSet.delete(taskId);
            } else {
                newSet.add(taskId);
            }
            return newSet;
        });
    };

    // Handle task click - navigate to test page if task has linkTo and is not completed
    const handleTaskClick = (task: Task) => {
        if (task.linkTo && !task.isCompleted) {
            router.push(task.linkTo);
        } else {
            handleToggleExpand(task.id);
        }
    };

    const handleCVUpload = async (event: React.ChangeEvent<HTMLInputElement>, taskId: string) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploadingCV(true);
        setScanningCV(true);
        setCvScanError('');

        try {
            const text = await file.text();

            setTasks(prev => prev.map(t =>
                t.id === taskId ? {...t, uploadedFile: file.name} : t
            ));

            const profile = await scanCVWithAI(text);

            if (profile) {
                setScannedProfile(profile);
                setTasks(prev => prev.map(t =>
                    t.id === taskId ? {
                        ...t,
                        isCompleted: true,
                        feedback: `✅ AI đã scan thành công! Tìm thấy: ${profile.name}, GPA: ${profile.gpa}, ${profile.extracurriculars.length} hoạt động ngoại khóa, ${profile.achievements.length} thành tích.`
                    } : t
                ));
            } else {
                setCvScanError('Không thể scan CV. Vui lòng thử lại hoặc nhập thông tin thủ công.');
            }
        } catch (error) {
            console.error('Error uploading and scanning CV:', error);
            setCvScanError('Lỗi khi xử lý CV. Vui lòng thử lại.');
        } finally {
            setUploadingCV(false);
            setScanningCV(false);
        }
    };

    const handleUnlockNextStage = () => {
        const nextStageId = activeStageId + 1;
        if (nextStageId <= 3) {
            setStages(prev => prev.map(s =>
                s.id === nextStageId ? {...s, isUnlocked: true} : s
            ));
            setActiveStageId(nextStageId);
            window.scrollTo({top: 0, behavior: 'smooth'});
        }
    };

    const canAdvance = currentProgress >= 90 && activeStageId < 3 && !stages.find(s => s.id === activeStageId + 1)?.isUnlocked;
    const isNextStageAlreadyUnlocked = stages.find(s => s.id === activeStageId + 1)?.isUnlocked;

    const tasksByCategory = useMemo(() => {
        const groups: { [key: string]: Task[] } = {};
        currentStageTasks.forEach(task => {
            const cat = task.category || 'Chung';
            if (!groups[cat]) groups[cat] = [];
            groups[cat].push(task);
        });
        return groups;
    }, [currentStageTasks]);

    const orderedCategories = ['Khởi động', 'Khám phá bản thân', 'Chung', 'Hồ sơ học thuật', 'Tài liệu cần thiết', 'Cá nhân hóa (Mục tiêu Mỹ)'];

    return (
        <div className="w-full max-w-7xl mx-auto p-4 md:p-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Checklist Hồ sơ</h1>
                <p className="text-gray-500 dark:text-slate-400 mt-1">Quản lý các đầu việc cần làm để hoàn thiện hồ sơ du
                    học của bạn.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1">
                    <StageNavigation
                        stages={stages}
                        currentStageId={activeStageId}
                        onSelectStage={setActiveStageId}
                        completedStages={completedStages}
                    />
                </div>

                <div className="lg:col-span-3 space-y-6">
                    <div
                        className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 dark:border-slate-700">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`p-2 rounded-lg ${activeStageId === 1 ? 'bg-blue-100 text-blue-600' : activeStageId === 2 ? 'bg-purple-100 text-purple-600' : 'bg-green-100 text-green-600'}`}>
                                        {activeStageId === 1 ? <Rocket size={24}/> : activeStageId === 2 ?
                                            <AlertCircle size={24}/> : <Trophy size={24}/>}
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                                            Giai đoạn {activeStageId}: {stages[activeStageId - 1].name}
                                        </h2>
                                        <p className="text-sm text-gray-500 dark:text-slate-400 hidden md:block">
                                            {stages[activeStageId - 1].description}
                                        </p>
                                    </div>
                                </div>

                                {canAdvance && (
                                    <button
                                        onClick={handleUnlockNextStage}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md shadow-blue-200 transition-all font-medium animate-pulse"
                                    >
                                        Mở khóa Giai đoạn {activeStageId + 1} <ArrowRight size={18}/>
                                    </button>
                                )}

                                {!canAdvance && isNextStageAlreadyUnlocked && (
                                    <button
                                        onClick={() => setActiveStageId(activeStageId + 1)}
                                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-200 rounded-lg transition-all font-medium text-sm"
                                    >
                                        Đến Giai đoạn {activeStageId + 1} <ArrowRight size={16}/>
                                    </button>
                                )}
                            </div>
                            <ProgressBar percentage={currentProgress}/>
                        </div>

                        <div className="p-6 bg-gray-50/30 dark:bg-slate-900/30 min-h-[400px]">
                            {orderedCategories.filter(cat => tasksByCategory[cat]).map((category) => (
                                <div key={category} className="mb-8 last:mb-0">
                                    {category !== 'Chung' && (
                                        <h3 className="text-sm font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-3 ml-1 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-slate-600"></span>
                                            {category}
                                        </h3>
                                    )}

                                    <div className="space-y-3">
                                        {tasksByCategory[category].map((task) => {
                                            const deadlineStatus = getDaysRemaining(task.deadline);
                                            const isExpanded = expandedTaskIds.has(task.id);
                                            const needsFile = task.requiresFile;

                                            return (
                                                <div
                                                    key={task.id}
                                                                                    className={`group bg-white dark:bg-slate-800 border rounded-xl transition-all duration-300 cursor-pointer ${
                                                        task.isCompleted
                                                            ? 'border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50'
                                                            : `border-gray-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-lg ${isExpanded ? 'ring-1 ring-blue-300 dark:ring-blue-600 shadow-md' : 'hover:-translate-y-0.5'}`
                                                    } ${task.linkTo && !task.isCompleted ? 'hover:border-purple-400 dark:hover:border-purple-500 hover:ring-1 hover:ring-purple-200 dark:hover:ring-purple-800' : ''}`}
                                                    onClick={() => handleTaskClick(task)}
                                                >
                                                    <div className="flex items-center justify-between p-4">
                                                        <div className="flex items-center gap-4 flex-1">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleToggleTask(task.id);
                                                                }}
                                                                disabled={task.id === '1-2' && !task.uploadedFile}
                                                                title={task.id === '1-2' && !task.uploadedFile ? 'Vui lòng upload CV trước để hoàn thành task này' : ''}
                                                                className={`flex-shrink-0 transition-all duration-300 transform ${
                                                                    task.isCompleted
                                                                        ? 'text-blue-600 dark:text-blue-400 scale-100 rotate-0'
                                                                        : task.id === '1-2' && !task.uploadedFile
                                                                            ? 'text-gray-200 dark:text-slate-600 cursor-not-allowed'
                                                                            : 'text-gray-300 dark:text-slate-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 hover:scale-110'
                                                                }`}
                                                            >
                                                                {task.isCompleted ? (
                                                                    <CheckSquare size={24}
                                                                                 className="fill-blue-50 transition-all duration-300 ease-out"/>
                                                                ) : (
                                                                    <Square size={24}/>
                                                                )}
                                                            </button>

                                                            <span
                                                                className={`font-medium text-base transition-all duration-300 ${
                                                                    task.isCompleted ? 'text-gray-400 dark:text-slate-500 line-through decoration-gray-300 dark:decoration-slate-600' : 'text-gray-800 dark:text-slate-200'
                                                                }`}>
                                                                {task.title}
                                                            </span>
                                                            {task.linkTo && !task.isCompleted && (
                                                                <span
                                                                    className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                                                                    <Sparkles size={12}/>
                                                                    Làm bài test
                                                                </span>
                                                            )}
                                                        </div>

                                                        <div className="flex items-center ml-4">
                                                            <button
                                                                className={`p-1.5 rounded-full transition-all duration-200 ${
                                                                    isExpanded
                                                                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rotate-180'
                                                                        : 'bg-gray-50 dark:bg-slate-700 text-gray-400 dark:text-slate-400 group-hover:bg-gray-100 dark:group-hover:bg-slate-600 group-hover:text-gray-600 dark:group-hover:text-slate-300'
                                                                }`}
                                                            >
                                                                <ChevronDown size={20}/>
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div
                                                        className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                                        <div className="px-4 pb-6 md:px-6 md:pl-14 pt-0 space-y-5">
                                                            <div
                                                                className="flex flex-wrap items-center gap-y-2 gap-x-6 pb-4 border-b border-gray-100 dark:border-slate-700">
                                                                <div
                                                                    className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">
                                                                    <Calendar size={16} className="text-gray-400 dark:text-slate-500"/>
                                                                    <span>Hạn chót: <span
                                                                        className="font-semibold text-gray-800 dark:text-slate-200">{task.deadline}</span></span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <div
                                                                        className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ring-1 ring-inset ${
                                                                            task.isCompleted ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 ring-green-200 dark:ring-green-800' : deadlineStatus.color
                                                                        }`}>
                                                                        {task.isCompleted ? <CheckSquare size={12}/> :
                                                                            <Clock size={12}/>}
                                                                        {task.isCompleted ? 'Đã hoàn thành' : deadlineStatus.text}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {needsFile && (
                                                                <div>
                                                                    {task.id === '1-2' && !task.uploadedFile && !scanningCV && (
                                                                        <div
                                                                            className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 dark:border-blue-400 rounded">
                                                                            <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                                                                                ℹ️ Task này sẽ hoàn thành ngay khi bạn
                                                                                upload CV. AI sẽ tự động scan để trích
                                                                                xuất thông tin.
                                                                            </p>
                                                                        </div>
                                                                    )}
                                                                    {scanningCV && task.id === '1-2' ? (
                                                                        <div
                                                                            className="flex items-center justify-center p-8 bg-gradient-to-r from-purple-50 dark:from-purple-900/30 to-blue-50 dark:to-blue-900/30 border-2 border-purple-200 dark:border-purple-800 rounded-xl">
                                                                            <div
                                                                                className="flex flex-col items-center gap-4">
                                                                                <Loader2
                                                                                    className="w-10 h-10 text-purple-600 dark:text-purple-400 animate-spin"/>
                                                                                <div className="text-center">
                                                                                    <p className="text-base font-bold text-purple-700 dark:text-purple-300">AI
                                                                                        đang scan CV của bạn...</p>
                                                                                    <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">Vui
                                                                                        lòng đợi trong giây lát</p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ) : task.uploadedFile ? (
                                                                        <div
                                                                            className="p-4 bg-gradient-to-r from-green-50 dark:from-green-900/30 to-emerald-50 dark:to-emerald-900/30 border-2 border-green-200 dark:border-green-800 rounded-xl">
                                                                            <div
                                                                                className="flex items-center gap-3 mb-3">
                                                                                <div
                                                                                    className="p-2 bg-white dark:bg-slate-800 rounded-lg border border-green-200 dark:border-green-800 shadow-sm text-green-600 dark:text-green-400">
                                                                                    <FileText size={20}/>
                                                                                </div>
                                                                                <div className="flex-1">
                                                                                    <span
                                                                                        className="text-sm font-bold text-gray-800 dark:text-slate-200 block">{task.uploadedFile}</span>
                                                                                    <span
                                                                                        className="text-xs text-gray-500 dark:text-slate-400">CV đã được AI xử lý thành công</span>
                                                                                </div>
                                                                            </div>
                                                                            {scannedProfile && task.id === '1-2' && (
                                                                                <div
                                                                                    className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-green-100 dark:border-green-800">
                                                                                    <p className="text-xs font-bold text-green-700 dark:text-green-300 mb-2">✨
                                                                                        Thông tin đã trích xuất:</p>
                                                                                    <div
                                                                                        className="grid grid-cols-2 gap-2 text-xs">
                                                                                        <div><span
                                                                                            className="text-gray-500 dark:text-slate-400">Họ tên:</span>
                                                                                            <span
                                                                                                className="font-semibold dark:text-slate-200"> {scannedProfile.name}</span>
                                                                                        </div>
                                                                                        <div><span
                                                                                            className="text-gray-500 dark:text-slate-400">Email:</span>
                                                                                            <span
                                                                                                className="font-semibold dark:text-slate-200"> {scannedProfile.email}</span>
                                                                                        </div>
                                                                                        <div><span
                                                                                            className="text-gray-500 dark:text-slate-400">GPA:</span>
                                                                                            <span
                                                                                                className="font-semibold dark:text-slate-200"> {scannedProfile.gpa}/{scannedProfile.gpaScale}</span>
                                                                                        </div>
                                                                                        <div><span
                                                                                            className="text-gray-500 dark:text-slate-400">Tiếng Anh:</span>
                                                                                            <span
                                                                                                className="font-semibold dark:text-slate-200"> {scannedProfile.englishLevel}</span>
                                                                                        </div>
                                                                                        <div
                                                                                            className="col-span-2"><span
                                                                                            className="text-gray-500 dark:text-slate-400">Hoạt động ngoại khóa:</span>
                                                                                            <span
                                                                                                className="font-semibold dark:text-slate-200"> {scannedProfile.extracurriculars.length} hoạt động</span>
                                                                                        </div>
                                                                                        <div
                                                                                            className="col-span-2"><span
                                                                                            className="text-gray-500 dark:text-slate-400">Thành tích:</span>
                                                                                            <span
                                                                                                className="font-semibold dark:text-slate-200"> {scannedProfile.achievements.length} thành tích</span>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    ) : (
                                                                        <label htmlFor={`cv-upload-${task.id}`}
                                                                               className="relative border-2 border-dashed border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 hover:border-blue-300 dark:hover:border-blue-500 rounded-xl p-6 transition-colors cursor-pointer group/upload block">
                                                                            <input
                                                                                id={`cv-upload-${task.id}`}
                                                                                type="file"
                                                                                accept=".pdf,.doc,.docx,.txt"
                                                                                className="hidden"
                                                                                onChange={(e) => handleCVUpload(e, task.id)}
                                                                                disabled={uploadingCV}
                                                                            />
                                                                            <div
                                                                                className="flex flex-col items-center justify-center text-center gap-2">
                                                                                <div
                                                                                    className="p-3 bg-white dark:bg-slate-700 rounded-full shadow-sm text-gray-400 dark:text-slate-500 group-hover/upload:text-blue-500 dark:group-hover/upload:text-blue-400 transition-colors">
                                                                                    <UploadCloud size={24}/>
                                                                                </div>
                                                                                <div>
                                                                                    <p className="text-sm font-medium text-gray-600 dark:text-slate-300 group-hover/upload:text-blue-700 dark:group-hover/upload:text-blue-400">
                                                                                        {task.id === '1-2' ? 'Upload CV - AI sẽ tự động scan' : 'Upload file'}
                                                                                    </p>
                                                                                    <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">PDF,
                                                                                        DOCX, TXT lên tới 10MB</p>
                                                                                </div>
                                                                            </div>
                                                                        </label>
                                                                    )}
                                                                    {cvScanError && (
                                                                        <div
                                                                            className="mt-3 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
                                                                            <p className="text-xs text-red-700 dark:text-red-300">{cvScanError}</p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}

                                                            {task.category === 'Tài liệu cần thiết' && task.feedback && (
                                                                    <div className="mt-2">
                                                                    <div className="flex items-center gap-2 mb-2">
                                                                        <MessageSquare size={16}
                                                                                       className="text-orange-500 dark:text-orange-400"/>
                                                                        <span
                                                                            className="text-sm font-bold text-gray-700 dark:text-slate-300">Nhận xét từ người hướng dẫn</span>
                                                                    </div>
                                                                    <div
                                                                        className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800 rounded-xl p-4 relative">
                                                                        <div
                                                                            className="text-sm text-gray-800 dark:text-slate-200 leading-relaxed">
                                                                            {task.feedback}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {task.category === 'Khám phá bản thân' && (
                                                                <div className="mt-2">
                                                                    {task.feedback && (
                                                                        <div
                                                                            className="mb-4 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-xl">
                                                                            <div
                                                                                className="flex items-center gap-2 mb-2">
                                                                                <Sparkles size={16}
                                                                                          className="text-purple-500 dark:text-purple-400"/>
                                                                                <span
                                                                                    className="text-sm font-bold text-purple-700 dark:text-purple-300">Mô tả bài test</span>
                                                                            </div>
                                                                            <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed">
                                                                                {task.feedback}
                                                                            </p>
                                                                        </div>
                                                                    )}
                                                                    {task.linkTo && !task.isCompleted && (
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                router.push(task.linkTo!);
                                                                            }}
                                                                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-semibold shadow-lg shadow-purple-200 dark:shadow-purple-900/30 transition-all transform hover:scale-[1.02]"
                                                                        >
                                                                            <Sparkles size={18}/>
                                                                            Làm bài test ngay
                                                                            <ArrowRight size={18}/>
                                                                        </button>
                                                                    )}
                                                                    {task.isCompleted && (
                                                                        <div
                                                                            className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                                                                            <div className="flex items-center gap-2">
                                                                                <CheckSquare size={18}
                                                                                             className="text-green-600 dark:text-green-400"/>
                                                                                <span
                                                                                    className="text-sm font-bold text-green-700 dark:text-green-300">Bạn đã hoàn thành bài test này!</span>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}

                            {currentStageTasks.length === 0 && (
                                <div className="text-center py-12">
                                    <p className="text-gray-400 dark:text-slate-500">Không có công việc nào trong giai đoạn này.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {activeStageId === 1 && (
                            <div
                                className="bg-gradient-to-br from-purple-50 via-blue-50 to-white dark:from-purple-900/20 dark:via-blue-900/20 dark:to-slate-800 p-6 rounded-xl border-2 border-purple-200 dark:border-purple-700 shadow-lg">
                                <div className="flex items-start gap-3">
                                    <div
                                        className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg text-white">
                                        <Sparkles size={20}/>
                                    </div>
                                    <div>
                                        <h4 className="text-base font-bold text-gray-900 dark:text-white mb-2">✨ AI CV
                                            Scanning</h4>
                                        <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed mb-3">
                                            Upload CV của bạn và để AI tự động trích xuất <span
                                            className="font-bold">tất cả thông tin</span>:
                                        </p>
                                        <ul className="text-xs text-gray-600 dark:text-slate-400 space-y-1.5">
                                            <li className="flex items-start gap-2">
                                                <span className="text-purple-500 mt-0.5">✓</span>
                                                <span>Thông tin cá nhân (tên, email, số điện thoại, địa chỉ)</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-purple-500 mt-0.5">✓</span>
                                                <span>Học vấn (GPA, trình độ tiếng Anh, SAT)</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-purple-500 mt-0.5">✓</span>
                                                <span>Hoạt động ngoại khóa và vai trò</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-purple-500 mt-0.5">✓</span>
                                                <span>Thành tích và giải thưởng</span>
                                            </li>
                                        </ul>
                                        <div
                                            className="mt-4 p-3 bg-white dark:bg-slate-700 rounded-lg border border-purple-100 dark:border-purple-800">
                                            <p className="text-xs text-purple-700 dark:text-purple-300 font-semibold">
                                                💡 Tiết kiệm thời gian: Không cần nhập thủ công!
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div
                            className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-slate-800 p-5 rounded-xl border border-blue-100 dark:border-blue-800">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                                    <Flag size={20}/>
                                </div>
                                <div>
                                    <h4 className="font-bold text-blue-900 dark:text-blue-300 text-sm mb-1">Lời
                                        khuyên Giai đoạn {activeStageId}</h4>
                                    <p className="text-sm text-blue-800/80 dark:text-blue-200/80 leading-relaxed">
                                        {activeStageId === 1 && "Đây là giai đoạn nền tảng. Hãy dành thời gian hiểu rõ bản thân và tìm hiểu kỹ về các trường đại học mục tiêu."}
                                        {activeStageId === 2 && "Chất lượng hơn số lượng. Tập trung vào bài luận cá nhân và các hoạt động ngoại khóa có chiều sâu lãnh đạo."}
                                        {activeStageId === 3 && "Kiểm tra kỹ hạn visa và yêu cầu nhập cảnh. Đừng quên mang theo bản sao các giấy tờ quan trọng."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChecklistPage;

