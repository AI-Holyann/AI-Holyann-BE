'use client';

import React, {useState} from 'react';
import {useRouter, usePathname} from 'next/navigation';
import {
    GraduationCap, MapPin, Calendar, DollarSign, FileText,
    ChevronDown, ChevronUp, Star, Award, AlertCircle, CheckCircle2,
    Target, TrendingUp, Shield, Sparkles, User
} from 'lucide-react';

// Types
type DeadlineType = {
    type: 'ED' | 'ED2' | 'EA' | 'RD';
    date: string
};

interface School {
    id: string;
    name: string;
    rank: string;
    location: string;
    deadlines: DeadlineType[];
    scholarshipDeadline?: string;
    requirements: string;
    category: 'Dream' | 'Match' | 'Safety';
    status?: 'Đang tìm hiểu' | 'Đang viết luận' | 'Đã nộp';
    isHighlight?: boolean;
}

// Mock Data
const SCHOOLS_DATA: School[] = [
    // DREAM SCHOOLS
    {
        id: 'd1',
        name: 'Stanford University',
        rank: '#3 US',
        location: 'California, USA',
        deadlines: [
            {type: 'ED', date: '01/11/2025'},
            {type: 'RD', date: '05/01/2026'}
        ],
        scholarshipDeadline: '01/12/2025',
        requirements: 'Why Stanford Essay + 2 Short Essays',
        category: 'Dream',
        status: 'Đang tìm hiểu'
    },
    {
        id: 'd2',
        name: 'Massachusetts Institute of Technology',
        rank: '#2 US',
        location: 'Massachusetts, USA',
        deadlines: [
            {type: 'EA', date: '01/11/2025'},
            {type: 'RD', date: '01/01/2026'}
        ],
        requirements: '5 Short Essays',
        category: 'Dream',
        status: 'Đang tìm hiểu'
    },
    {
        id: 'd3',
        name: 'Harvard University',
        rank: '#1 US',
        location: 'Massachusetts, USA',
        deadlines: [
            {type: 'ED', date: '01/11/2025'},
            {type: 'RD', date: '01/01/2026'}
        ],
        scholarshipDeadline: '15/11/2025',
        requirements: 'Optional Essay',
        category: 'Dream',
        status: 'Đang viết luận'
    },
    {
        id: 'd4',
        name: 'Yale University',
        rank: '#5 US',
        location: 'Connecticut, USA',
        deadlines: [
            {type: 'ED', date: '01/11/2025'},
            {type: 'EA', date: '01/11/2025'},
            {type: 'RD', date: '02/01/2026'}
        ],
        requirements: 'Why Yale + 3 Short Essays',
        category: 'Dream',
        status: 'Đang tìm hiểu'
    },

    // MATCH SCHOOLS
    {
        id: 'm1',
        name: 'University of Michigan',
        rank: '#21 US',
        location: 'Michigan, USA',
        deadlines: [
            {type: 'EA', date: '01/11/2025'},
            {type: 'RD', date: '01/02/2026'}
        ],
        scholarshipDeadline: '15/11/2025',
        requirements: 'Why Michigan Essay',
        category: 'Match',
        status: 'Đang viết luận',
        isHighlight: true
    },
    {
        id: 'm2',
        name: 'University of California, Berkeley',
        rank: '#15 US',
        location: 'California, USA',
        deadlines: [
            {type: 'RD', date: '30/11/2025'}
        ],
        requirements: '4 Personal Insight Questions',
        category: 'Match',
        status: 'Đang viết luận'
    },
    {
        id: 'm3',
        name: 'New York University',
        rank: '#25 US',
        location: 'New York, USA',
        deadlines: [
            {type: 'ED', date: '01/11/2025'},
            {type: 'ED2', date: '01/01/2026'},
            {type: 'RD', date: '05/01/2026'}
        ],
        scholarshipDeadline: '01/12/2025',
        requirements: 'Why NYU Essay',
        category: 'Match',
        status: 'Đang tìm hiểu'
    },
    {
        id: 'm4',
        name: 'University of Southern California',
        rank: '#28 US',
        location: 'California, USA',
        deadlines: [
            {type: 'ED', date: '15/11/2025'},
            {type: 'RD', date: '15/01/2026'}
        ],
        requirements: '3 Short Essays',
        category: 'Match',
        status: 'Đang tìm hiểu'
    },

    // SAFETY SCHOOLS
    {
        id: 's1',
        name: 'Pennsylvania State University',
        rank: '#60 US',
        location: 'Pennsylvania, USA',
        deadlines: [
            {type: 'EA', date: '01/11/2025'},
            {type: 'RD', date: '15/01/2026'}
        ],
        requirements: 'Optional Essay',
        category: 'Safety',
        status: 'Đã nộp'
    },
    {
        id: 's2',
        name: 'University of Washington',
        rank: '#40 US',
        location: 'Washington, USA',
        deadlines: [
            {type: 'EA', date: '15/11/2025'},
            {type: 'RD', date: '15/01/2026'}
        ],
        scholarshipDeadline: '01/12/2025',
        requirements: 'Personal Statement',
        category: 'Safety',
        status: 'Đang viết luận'
    },
    {
        id: 's3',
        name: 'University of Illinois Urbana-Champaign',
        rank: '#35 US',
        location: 'Illinois, USA',
        deadlines: [
            {type: 'EA', date: '01/11/2025'},
            {type: 'RD', date: '02/01/2026'}
        ],
        requirements: '2 Short Essays',
        category: 'Safety',
        status: 'Đang tìm hiểu'
    }
];

// Get badge colors based on deadline type
const getDeadlineBadgeColor = (type: DeadlineType['type']) => {
    switch (type) {
        case 'ED':
        case 'ED2':
            return 'bg-red-100 text-red-700 border-red-300';
        case 'EA':
            return 'bg-orange-100 text-orange-700 border-orange-300';
        case 'RD':
            return 'bg-blue-100 text-blue-700 border-blue-300';
        default:
            return 'bg-gray-100 text-gray-700 border-gray-300';
    }
};

// Get status badge color
const getStatusBadgeColor = (status?: School['status']) => {
    switch (status) {
        case 'Đang tìm hiểu':
            return 'bg-yellow-100 text-yellow-700 border-yellow-300';
        case 'Đang viết luận':
            return 'bg-blue-100 text-blue-700 border-blue-300';
        case 'Đã nộp':
            return 'bg-green-100 text-green-700 border-green-300';
        default:
            return 'bg-gray-100 text-gray-700 border-gray-300';
    }
};

// Get category config
const getCategoryConfig = (category: School['category']) => {
    switch (category) {
        case 'Dream':
            return {
                title: 'Dream Schools',
                subtitle: 'Trường mơ ước - Thử thách cao',
                icon: Star,
                color: 'from-purple-500 to-pink-500',
                bgColor: 'bg-purple-50',
                borderColor: 'border-purple-200',
                iconBg: 'bg-purple-100',
                iconColor: 'text-purple-600'
            };
        case 'Match':
            return {
                title: 'Match Schools',
                subtitle: 'Trường phù hợp - Khả năng cao',
                icon: Target,
                color: 'from-blue-500 to-cyan-500',
                bgColor: 'bg-blue-50',
                borderColor: 'border-blue-200',
                iconBg: 'bg-blue-100',
                iconColor: 'text-blue-600'
            };
        case 'Safety':
            return {
                title: 'Safety Schools',
                subtitle: 'Trường an toàn - Dự phòng',
                icon: Shield,
                color: 'from-green-500 to-emerald-500',
                bgColor: 'bg-green-50',
                borderColor: 'border-green-200',
                iconBg: 'bg-green-100',
                iconColor: 'text-green-600'
            };
    }
};

// School Category Section Component
const SchoolCategorySection: React.FC<{ category: School['category'] }> = ({category}) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const schools = SCHOOLS_DATA.filter(s => s.category === category);
    const config = getCategoryConfig(category);
    const IconComponent = config.icon;

    return (
        <div className={`bg-white rounded-2xl shadow-sm border-2 ${config.borderColor} overflow-hidden`}>
            {/* Section Header */}
            <div
                className={`bg-gradient-to-r ${config.color} px-6 py-4 cursor-pointer hover:opacity-90 transition-opacity`}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <IconComponent className="text-white" size={24}/>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">{config.title}</h3>
                            <p className="text-sm text-white/90">{config.subtitle}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-white bg-white/20 px-3 py-1 rounded-full">
              {schools.length} trường
            </span>
                        {isExpanded ? (
                            <ChevronUp className="text-white" size={24}/>
                        ) : (
                            <ChevronDown className="text-white" size={24}/>
                        )}
                    </div>
                </div>
            </div>

            {/* Schools Table */}
            {isExpanded && (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                        <tr className={`${config.bgColor} border-b-2 ${config.borderColor}`}>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                Trường
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                Hạn Nộp
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                Học Bổng
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                Yêu Cầu
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                Trạng Thái
                            </th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {schools.map((school) => (
                            <tr
                                key={school.id}
                                className={`hover:bg-gray-50 transition-colors ${school.isHighlight ? 'bg-green-50/50' : ''}`}
                            >
                                {/* School Info */}
                                <td className="px-6 py-4">
                                    <div className="flex items-start gap-3">
                                        <div
                                            className={`w-10 h-10 rounded-lg ${config.iconBg} flex items-center justify-center flex-shrink-0`}>
                                            <GraduationCap className={config.iconColor} size={20}/>
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 text-sm mb-1">{school.name}</p>
                                            <div className="flex items-center gap-2">
                          <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${config.iconBg} ${config.iconColor}`}>
                            {school.rank}
                          </span>
                                                <span className="flex items-center gap-1 text-xs text-gray-500">
                            <MapPin size={12}/>
                                                    {school.location}
                          </span>
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                {/* Deadlines */}
                                <td className="px-6 py-4">
                                    <div className="flex flex-wrap gap-2">
                                        {school.deadlines.map((deadline, idx) => (
                                            <span
                                                key={idx}
                                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold border ${getDeadlineBadgeColor(deadline.type)}`}
                                            >
                          <Calendar size={12}/>
                                                {deadline.type}: {deadline.date}
                        </span>
                                        ))}
                                    </div>
                                </td>

                                {/* Scholarship */}
                                <td className="px-6 py-4">
                                    {school.scholarshipDeadline ? (
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center">
                                                <DollarSign className="text-yellow-600" size={16}/>
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-yellow-700">Full-Ride</p>
                                                <p className="text-xs text-gray-600">{school.scholarshipDeadline}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <span className="text-xs text-gray-400 italic">Không có</span>
                                    )}
                                </td>

                                {/* Requirements */}
                                <td className="px-6 py-4">
                                    <div className="flex items-start gap-2">
                                        <FileText className="text-gray-400 flex-shrink-0 mt-0.5" size={14}/>
                                        <p className="text-sm text-gray-600 leading-relaxed">{school.requirements}</p>
                                    </div>
                                </td>

                                {/* Status */}
                                <td className="px-6 py-4">
                                    <select
                                        value={school.status || 'Đang tìm hiểu'}
                                        onChange={(e) => {
                                            // Handle status change
                                            console.log('Status changed:', e.target.value);
                                        }}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 ${getStatusBadgeColor(school.status)}`}
                                    >
                                        <option value="Đang tìm hiểu">Đang tìm hiểu</option>
                                        <option value="Đang viết luận">Đang viết luận</option>
                                        <option value="Đã nộp">Đã nộp</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

// Main Component
export const TargetSchoolsPage: React.FC = () => {
    const router = useRouter();
    const pathname = usePathname();

    const dreamCount = SCHOOLS_DATA.filter(s => s.category === 'Dream').length;
    const matchCount = SCHOOLS_DATA.filter(s => s.category === 'Match').length;
    const safetyCount = SCHOOLS_DATA.filter(s => s.category === 'Safety').length;
    const totalCount = SCHOOLS_DATA.length;

    // Navigation items
    const navigationItems = [
        {name: 'Hồ Sơ', href: '/dashboard/profile', icon: User},
        {name: 'Trường Mục Tiêu', href: '/dashboard/profile/schools', icon: GraduationCap},
        {name: 'Cải Thiện Hồ Sơ', href: '/dashboard/profile/improve', icon: Sparkles},
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* NAVIGATION TABS */}
                <div className="mb-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
                        <div className="flex items-center gap-2">
                            {navigationItems.map((item) => {
                                const IconComponent = item.icon;
                                const isActive = pathname === item.href;
                                return (
                                    <button
                                        key={item.href}
                                        onClick={() => router.push(item.href)}
                                        className={`
                                            flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200
                                            ${isActive
                                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                        }
                                        `}
                                    >
                                        <IconComponent size={18}/>
                                        {item.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Page Header */}
                <div className="mb-10">
                    <div className="flex items-center gap-4 mb-6">
                        <div
                            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0f4c81] to-blue-600 flex items-center justify-center shadow-lg">
                            <GraduationCap className="text-white" size={28}/>
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900">Danh Sách Trường Mục Tiêu</h1>
                            <p className="text-gray-600 mt-1">
                                Quản lý và theo dõi tiến độ hồ sơ du học của bạn
                            </p>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 mb-1">Tổng số trường</p>
                                    <p className="text-3xl font-bold text-gray-900">{totalCount}</p>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                                    <Award className="text-gray-600" size={24}/>
                                </div>
                            </div>
                        </div>

                        <div
                            className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-sm border border-purple-200 p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-purple-600 mb-1">Dream</p>
                                    <p className="text-3xl font-bold text-purple-900">{dreamCount}</p>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                                    <Star className="text-purple-600" size={24}/>
                                </div>
                            </div>
                        </div>

                        <div
                            className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl shadow-sm border border-blue-200 p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-blue-600 mb-1">Match</p>
                                    <p className="text-3xl font-bold text-blue-900">{matchCount}</p>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                                    <Target className="text-blue-600" size={24}/>
                                </div>
                            </div>
                        </div>

                        <div
                            className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-sm border border-green-200 p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-green-600 mb-1">Safety</p>
                                    <p className="text-3xl font-bold text-green-900">{safetyCount}</p>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                                    <Shield className="text-green-600" size={24}/>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Info Banner */}
                    <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20}/>
                            <div>
                                <p className="text-sm font-semibold text-blue-900 mb-1">Lời khuyên về phân bổ trường</p>
                                <p className="text-sm text-blue-700">
                                    Chiến lược tối ưu: <span className="font-semibold">3-4 Dream</span> (reach schools),
                                    <span className="font-semibold"> 4-5 Match</span> (target schools),
                                    <span className="font-semibold"> 2-3 Safety</span> (safety schools).
                                    Đảm bảo cân bằng để tối đa hóa cơ hội trúng tuyển!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* School Categories */}
                <div className="space-y-6">
                    <SchoolCategorySection category="Dream"/>
                    <SchoolCategorySection category="Match"/>
                    <SchoolCategorySection category="Safety"/>
                </div>

                {/* Footer Note */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500">
                        💡 Tip: Nhấn vào tên trường để xem chi tiết và cập nhật trạng thái ứng tuyển
                    </p>
                </div>

            </div>
        </div>
    );
};

