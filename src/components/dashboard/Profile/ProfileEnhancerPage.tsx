'use client';

import React, {useState} from 'react';
import { toast } from 'sonner';
import {
    TrendingUp, Users, BookOpen, Code, AlertCircle, CheckCircle2,
    Upload, FileText, Sparkles, Target, ArrowRight, Lightbulb,
    Award, Globe, BarChart3, MessageSquare, Eye, Shield
} from 'lucide-react';

// Types
interface RecommendationCard {
    id: string;
    category: 'extracurricular' | 'academic' | 'skill' | 'language';
    icon: React.ElementType;
    problem: string;
    solution: string;
    actionText: string;
    actionUrl: string;
    color: string;
    bgColor: string;
    borderColor: string;
}

interface CVCheckItem {
    name: string;
    status: 'success' | 'warning' | 'error';
    message: string;
}

interface EssayAnalysis {
    sentiment: string;
    structure: string;
    plagiarism: string;
    suggestion: string;
}

export const ProfileEnhancerPage: React.FC = () => {
    // States
    const [cvFile, setCvFile] = useState<File | null>(null);
    const [cvScore, setCvScore] = useState<number | null>(null);
    const [cvChecklist, setCvChecklist] = useState<CVCheckItem[]>([]);
    const [essayText, setEssayText] = useState('');
    const [essayAnalysis, setEssayAnalysis] = useState<EssayAnalysis | null>(null);
    const [isAnalyzingEssay, setIsAnalyzingEssay] = useState(false);


    // Mock Data - Recommendations
    const recommendations: RecommendationCard[] = [
        {
            id: '1',
            category: 'extracurricular',
            icon: Users,
            problem: 'Hồ sơ thiếu vai trò lãnh đạo trong hoạt động ngoại khóa',
            solution: 'Tham gia cuộc thi Hùng biện cấp thành phố (City Debate Open 2025)',
            actionText: 'Xem chi tiết cuộc thi',
            actionUrl: '#',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200'
        },
        {
            id: '2',
            category: 'academic',
            icon: Code,
            problem: 'Điểm GPA môn Toán tốt nhưng thiếu ứng dụng thực tế',
            solution: 'Hoàn thành khóa học "Python for Data Science" trên Coursera',
            actionText: 'Đến khóa học',
            actionUrl: '#',
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
            borderColor: 'border-orange-200'
        },
        {
            id: '3',
            category: 'skill',
            icon: Globe,
            problem: 'Thiếu chứng chỉ ngoại ngữ quốc tế',
            solution: 'Đăng ký thi IELTS hoặc TOEFL trong 3 tháng tới',
            actionText: 'Xem lộ trình luyện thi',
            actionUrl: '#',
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
            borderColor: 'border-purple-200'
        },
        {
            id: '4',
            category: 'extracurricular',
            icon: Award,
            problem: 'Cần thêm hoạt động tình nguyện cộng đồng',
            solution: 'Tham gia dự án "Thắp sáng ước mơ" - Dạy học miễn phí cho trẻ em vùng cao',
            actionText: 'Tìm hiểu thêm',
            actionUrl: '#',
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200'
        }
    ];

    // Handle CV Upload
    const handleCVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            
            // Validate file size (5MB max)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('File quá lớn', {
                    description: 'Vui lòng chọn file nhỏ hơn 5MB',
                });
                return;
            }
            
            // Validate file type
            const allowedTypes = ['.pdf', '.doc', '.docx'];
            const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
            if (!allowedTypes.includes(fileExtension)) {
                toast.error('Định dạng file không hợp lệ', {
                    description: 'Vui lòng chọn file PDF, DOC hoặc DOCX',
                });
                return;
            }
            
            setCvFile(file);
            toast.info('Đang phân tích CV', {
                description: 'AI đang phân tích CV của bạn...',
            });

            // Simulate AI analysis
            setTimeout(() => {
                setCvScore(7.5);
                setCvChecklist([
                    {
                        name: 'Sử dụng Action Verbs',
                        status: 'success',
                        message: 'Tốt! CV sử dụng nhiều động từ hành động mạnh mẽ.'
                    },
                    {
                        name: 'Định lượng thành tích',
                        status: 'warning',
                        message: 'Hãy thay "tăng doanh thu" bằng "tăng 20% doanh thu".'
                    },
                    {
                        name: 'Cấu trúc rõ ràng',
                        status: 'success',
                        message: 'Layout CV dễ đọc, phân chia mục rõ ràng.'
                    },
                    {
                        name: 'Độ dài phù hợp',
                        status: 'success',
                        message: 'CV có độ dài 1 trang - phù hợp cho sinh viên.'
                    },
                    {
                        name: 'Từ khóa ngành nghề',
                        status: 'warning',
                        message: 'Nên bổ sung thêm các từ khóa chuyên ngành như "Data Analysis", "Project Management".'
                    }
                ]);
                
                toast.success('Phân tích CV hoàn tất', {
                    description: `CV của bạn đạt ${7.5}/10 điểm. Xem chi tiết bên dưới.`,
                });
            }, 1500);
        }
    };

    // Handle Essay Analysis
    const handleEssayAnalysis = () => {
        if (!essayText.trim()) {
            toast.error('Vui lòng nhập nội dung bài luận', {
                description: 'Bạn cần nhập bài luận trước khi phân tích',
            });
            return;
        }

        setIsAnalyzingEssay(true);
        toast.info('Đang phân tích bài luận', {
            description: 'AI đang phân tích cấu trúc, cảm xúc và độ đạo văn...',
        });

        // Simulate AI analysis
        setTimeout(() => {
            setEssayAnalysis({
                sentiment: 'Tích cực / Truyền cảm hứng',
                structure: 'Mở - Thân - Kết rõ ràng',
                plagiarism: 'An toàn (0% trùng lặp)',
                suggestion: 'Thử áp dụng kỹ thuật "Show Don\'t Tell" ở đoạn 2. Thay vì nói "Tôi là người có trách nhiệm", hãy kể một câu chuyện cụ thể thể hiện điều đó.'
            });
            setIsAnalyzingEssay(false);
            
            toast.success('Phân tích bài luận hoàn tất', {
                description: 'Đã hoàn tất phân tích. Xem kết quả và gợi ý cải thiện bên dưới.',
            });
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">


                {/* HEADER & GROWTH METRICS */}
                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div
                            className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                            <Sparkles className="text-white" size={24}/>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Lộ Trình Cải Thiện Hồ Sơ AI</h1>
                            <p className="text-gray-600 mt-1">
                                Dựa trên mục tiêu vào trường <span className="font-semibold text-blue-600">University of Melbourne</span>,
                                dưới đây là các đề xuất tối ưu cho bạn.
                            </p>
                        </div>
                    </div>

                    {/* Growth Metrics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        {/* Current Strength Card */}
                        <div
                            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 mb-1">Sức mạnh hồ sơ hiện tại</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-bold text-gray-900">65%</span>
                                        <span className="text-sm text-gray-500">/ 100%</span>
                                    </div>
                                </div>
                                <div
                                    className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-lg">
                                    <BarChart3 className="text-white" size={28}/>
                                </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full transition-all duration-1000"
                                    style={{width: '65%'}}
                                ></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-3">Cần cải thiện để đạt mục tiêu</p>
                        </div>

                        {/* Potential After Improvement Card */}
                        <div
                            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
                            <div
                                className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <p className="text-sm font-medium text-blue-100 mb-1">Tiềm năng sau cải
                                            thiện</p>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-4xl font-bold">85%</span>
                                            <span
                                                className="inline-flex items-center gap-1 text-sm bg-green-400 text-green-900 px-2 py-0.5 rounded-full font-semibold">
                        <TrendingUp size={14}/>
                        +20%
                      </span>
                                        </div>
                                    </div>
                                    <div
                                        className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                        <Target className="text-white" size={28}/>
                                    </div>
                                </div>
                                <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-green-400 to-emerald-400 rounded-full transition-all duration-1000"
                                        style={{width: '85%'}}
                                    ></div>
                                </div>
                                <p className="text-xs text-blue-100 mt-3">Khả năng trúng tuyển cao</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SMART RECOMMENDATIONS SECTION */}
                <section className="mb-10">
                    <div className="flex items-center gap-3 mb-6">
                        <Lightbulb className="text-yellow-500" size={28}/>
                        <h2 className="text-2xl font-bold text-gray-900">Gợi Ý Chiến Lược Thông Minh</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {recommendations.map((rec) => {
                            const IconComponent = rec.icon;
                            return (
                                <div
                                    key={rec.id}
                                    className={`bg-white rounded-2xl border-2 ${rec.borderColor} p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
                                >
                                    <div className="flex items-start gap-4 mb-4">
                                        <div
                                            className={`w-12 h-12 rounded-xl ${rec.bgColor} flex items-center justify-center flex-shrink-0`}>
                                            <IconComponent className={rec.color} size={24}/>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <AlertCircle size={16} className="text-red-500"/>
                                                <span className="text-sm font-semibold text-red-600">Vấn đề</span>
                                            </div>
                                            <p className="text-sm text-gray-700 mb-3">{rec.problem}</p>
                                        </div>
                                    </div>

                                    <div className={`${rec.bgColor} rounded-xl p-4 mb-4`}>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Sparkles size={16} className={rec.color}/>
                                            <span className={`text-sm font-semibold ${rec.color}`}>Giải pháp AI</span>
                                        </div>
                                        <p className="text-sm text-gray-800 font-medium">{rec.solution}</p>
                                    </div>

                                    <button
                                        className={`w-full ${rec.color.replace('text-', 'bg-')} text-white px-4 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-md`}
                                    >
                                        {rec.actionText}
                                        <ArrowRight size={16}/>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* AI TOOLS GRID SECTION */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div
                            className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                            <Sparkles className="text-white" size={20}/>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Công Cụ Hỗ Trợ AI</h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                        {/* CV ASSISTANT */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                        <FileText className="text-white" size={20}/>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">Trợ lý CV</h3>
                                        <p className="text-xs text-blue-100">Phân tích và tối ưu CV của bạn</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                {/* Upload Area */}
                                <div className="mb-6">
                                    <label
                                        htmlFor="cv-upload"
                                        className="block w-full border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer group"
                                    >
                                        <div className="flex flex-col items-center">
                                            <div
                                                className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                                <Upload className="text-blue-500" size={28}/>
                                            </div>
                                            <p className="text-sm font-semibold text-gray-700 mb-1">
                                                {cvFile ? cvFile.name : 'Kéo thả file CV hoặc nhấn để chọn'}
                                            </p>
                                            <p className="text-xs text-gray-500">Hỗ trợ PDF, DOCX (Tối đa 5MB)</p>
                                        </div>
                                    </label>
                                    <input
                                        id="cv-upload"
                                        type="file"
                                        className="hidden"
                                        accept=".pdf,.doc,.docx"
                                        onChange={handleCVUpload}
                                    />
                                </div>

                                {/* CV Analysis Results */}
                                {cvScore !== null && (
                                    <div className="space-y-4">
                                        {/* Score Display */}
                                        <div
                                            className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-5 border border-blue-100">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm text-gray-600 mb-1">Điểm CV của bạn</p>
                                                    <div className="flex items-baseline gap-2">
                                                        <span
                                                            className="text-4xl font-bold text-blue-600">{cvScore}</span>
                                                        <span className="text-lg text-gray-500">/ 10</span>
                                                    </div>
                                                </div>
                                                <div className="relative w-20 h-20">
                                                    <svg className="transform -rotate-90 w-20 h-20">
                                                        <circle
                                                            cx="40"
                                                            cy="40"
                                                            r="32"
                                                            stroke="currentColor"
                                                            strokeWidth="6"
                                                            fill="none"
                                                            className="text-gray-200"
                                                        />
                                                        <circle
                                                            cx="40"
                                                            cy="40"
                                                            r="32"
                                                            stroke="currentColor"
                                                            strokeWidth="6"
                                                            fill="none"
                                                            strokeDasharray={`${2 * Math.PI * 32}`}
                                                            strokeDashoffset={`${2 * Math.PI * 32 * (1 - cvScore / 10)}`}
                                                            className="text-blue-500"
                                                            strokeLinecap="round"
                                                        />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Checklist */}
                                        <div className="space-y-3">
                                            <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Phân
                                                tích chi tiết</h4>
                                            {cvChecklist.map((item, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`flex items-start gap-3 p-3 rounded-lg border ${
                                                        item.status === 'success'
                                                            ? 'bg-green-50 border-green-200'
                                                            : item.status === 'warning'
                                                                ? 'bg-yellow-50 border-yellow-200'
                                                                : 'bg-red-50 border-red-200'
                                                    }`}
                                                >
                                                    {item.status === 'success' ? (
                                                        <CheckCircle2 className="text-green-600 flex-shrink-0 mt-0.5"
                                                                      size={18}/>
                                                    ) : (
                                                        <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5"
                                                                     size={18}/>
                                                    )}
                                                    <div className="flex-1">
                                                        <p className="text-sm font-semibold text-gray-800 mb-0.5">{item.name}</p>
                                                        <p className="text-xs text-gray-600">{item.message}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ESSAY REVIEWER */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                        <MessageSquare className="text-white" size={20}/>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">Review Bài Luận</h3>
                                        <p className="text-xs text-purple-100">Phân tích và cải thiện bài essay</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                {/* Essay Input */}
                                <div className="mb-4">
                  <textarea
                      value={essayText}
                      onChange={(e) => setEssayText(e.target.value)}
                      placeholder="Dán bài luận của bạn vào đây..."
                      className="w-full h-48 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none resize-none text-sm text-gray-700 placeholder-gray-400"
                  />
                                </div>

                                <button
                                    onClick={handleEssayAnalysis}
                                    disabled={!essayText.trim() || isAnalyzingEssay}
                                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:from-purple-600 hover:to-pink-600 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isAnalyzingEssay ? (
                                        <>
                                            <div
                                                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Đang phân tích...
                                        </>
                                    ) : (
                                        <>
                                            <Eye size={18}/>
                                            Phân tích ngay
                                        </>
                                    )}
                                </button>

                                {/* Essay Analysis Results */}
                                {essayAnalysis && (
                                    <div className="mt-6 space-y-4">
                                        <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Kết quả
                                            phân tích</h4>

                                        {/* Analysis Cards */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Sparkles size={14} className="text-blue-600"/>
                                                    <span className="text-xs font-semibold text-blue-600">Cảm xúc</span>
                                                </div>
                                                <p className="text-sm font-medium text-gray-800">{essayAnalysis.sentiment}</p>
                                            </div>

                                            <div className="bg-green-50 border border-green-100 rounded-lg p-3">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <BookOpen size={14} className="text-green-600"/>
                                                    <span
                                                        className="text-xs font-semibold text-green-600">Cấu trúc</span>
                                                </div>
                                                <p className="text-sm font-medium text-gray-800">{essayAnalysis.structure}</p>
                                            </div>

                                            <div
                                                className="col-span-2 bg-emerald-50 border border-emerald-100 rounded-lg p-3">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Shield size={14} className="text-emerald-600"/>
                                                    <span className="text-xs font-semibold text-emerald-600">Check đạo văn</span>
                                                </div>
                                                <p className="text-sm font-medium text-gray-800">{essayAnalysis.plagiarism}</p>
                                            </div>
                                        </div>

                                        {/* Suggestion Box */}
                                        <div
                                            className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-4">
                                            <div className="flex items-start gap-3">
                                                <div
                                                    className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center flex-shrink-0">
                                                    <Lightbulb className="text-white" size={16}/>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-yellow-800 mb-1 uppercase tracking-wide">Gợi
                                                        ý cải thiện</p>
                                                    <p className="text-sm text-gray-700 leading-relaxed">{essayAnalysis.suggestion}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </section>

            </div>
        </div>
    );
};

