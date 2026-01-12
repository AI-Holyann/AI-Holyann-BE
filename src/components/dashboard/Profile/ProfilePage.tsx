'use client';

import React, {useRef, useState} from 'react';
import {useRouter, usePathname} from 'next/navigation';
import {
    Mail, Phone, MapPin, Calendar,
    Award, BookOpen, GraduationCap, Globe,
    Edit3, FileText, Target, CheckCircle2, AlertCircle, UploadCloud, Trash2, File, Sparkles, User
} from 'lucide-react';
import {StudentProfile, DocumentType} from '../../types';
import {ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar} from 'recharts';

interface ProfilePageProps {
    profile: StudentProfile;
    onEditClick: () => void;
    onUploadDocument: (file: File, type: DocumentType) => void;
    onDeleteDocument: (id: string) => void;
    onAnalyzeProfile?: () => void;
}

// StatusBadge component - moved outside to avoid React hooks rules violation
const StatusBadge: React.FC<{ isComplete: boolean }> = ({isComplete}) => (
    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
        isComplete
            ? 'bg-green-50 text-green-700 border-green-200'
            : 'bg-red-100 text-red-700 border-red-300'
    }`}>
        {isComplete ? <CheckCircle2 size={12}/> : <AlertCircle size={12}/>}
        {isComplete ? 'Hoàn tất' : 'Cần bổ sung'}
    </div>
);

export const ProfilePage: React.FC<ProfilePageProps> = ({
                                                            profile,
                                                            onEditClick,
                                                            onUploadDocument,
                                                            onDeleteDocument,
                                                            onAnalyzeProfile
                                                        }) => {
    const router = useRouter();
    const pathname = usePathname();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedDocType, setSelectedDocType] = useState<DocumentType>('transcript');

    // Navigation items
    const navigationItems = [
        {name: 'Hồ Sơ', href: '/dashboard/profile', icon: User},
        {name: 'Trường Mục Tiêu', href: '/dashboard/profile/schools', icon: GraduationCap},
        {name: 'Cải Thiện Hồ Sơ', href: '/dashboard/profile/improve', icon: Sparkles},
    ];

    // Chart data
    const chartData = [
        {subject: 'Học thuật', A: (profile.gpa / profile.gpaScale) * 100, fullMark: 100},
        {subject: 'Ngoại ngữ', A: 85, fullMark: 100},
        {subject: 'Hoạt động', A: Math.min(profile.extracurriculars.length * 20, 100), fullMark: 100},
        {subject: 'Thành tích', A: Math.min(profile.achievements.length * 25, 100), fullMark: 100},
        {subject: 'Kỹ năng mềm', A: 70, fullMark: 100},
    ];

    // Helper checks for status
    const isPersonalComplete = Boolean(profile.name && profile.email && profile.phone && profile.address && profile.dob);
    const isAcademicComplete = Boolean(profile.gpa && profile.englishLevel && profile.targetMajor);
    const isActivitiesComplete = profile.extracurriculars.length > 0 && profile.achievements.length > 0;
    const isDocumentsComplete = profile.documents.length >= 2; // Arbitrary rule for example

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onUploadDocument(e.target.files[0], selectedDocType);
        }
    };

    const triggerUpload = (type: DocumentType) => {
        setSelectedDocType(type);
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const getDocTypeName = (type: DocumentType) => {
        switch (type) {
            case 'transcript':
                return 'Bảng điểm';
            case 'certificate':
                return 'Chứng chỉ';
            case 'letter':
                return 'Thư giới thiệu';
            case 'essay':
                return 'Bài luận';
            case 'other':
                return 'File khác';
            default:
                return 'Khác';
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

            {/* Hidden File Input */}
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
            />

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

            {/* HEADER WITH MAIN ACTIONS */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Hồ sơ học sinh</h1>
                    <p className="text-gray-500 mt-1">Quản lý toàn diện thông tin cá nhân và hồ sơ du học</p>
                </div>
                <div className="flex gap-3">
                    {onAnalyzeProfile && (
                        <button
                            onClick={onAnalyzeProfile}
                            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
                        >
                            <Sparkles size={18}/>
                            Phân tích hồ sơ AI
                        </button>
                    )}
                    <button
                        onClick={onEditClick}
                        className="flex items-center gap-2 bg-[var(--brand-blue)] hover:bg-[var(--brand-blue)]/90 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-md"
                    >
                        <Edit3 size={18}/>
                        Cập nhật hồ sơ
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* ================= LEFT COLUMN: PERSONAL INFO (3 cols) ================= */}
                <div className="lg:col-span-4 space-y-6">

                    {/* 1. Personal Identity Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="h-28 bg-gradient-to-r from-[var(--brand-blue)] to-[var(--tw-blue-500)]"></div>
                        <div className="px-6 pb-6 relative">
                            <div className="flex flex-col items-center -mt-12 mb-4">
                                <div
                                    className="w-24 h-24 rounded-full border-4 border-white overflow-hidden shadow-lg bg-white">
                                    <img src={profile.avatarUrl} alt={profile.name}
                                         className="w-full h-full object-cover"/>
                                </div>
                                <h2 className="mt-3 text-xl font-bold text-gray-900">{profile.name}</h2>
                                <p className="text-sm text-gray-500">Mã HS: {profile.id}</p>
                            </div>

                            <div className="border-t border-gray-100 pt-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Thông tin cá
                                        nhân</h3>
                                    <StatusBadge isComplete={isPersonalComplete}/>
                                </div>

                                <div className="space-y-3 text-sm text-gray-600">
                                    <div
                                        className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                        <div
                                            className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[var(--brand-blue)] flex-shrink-0">
                                            <Mail size={16}/></div>
                                        <span className="truncate font-medium">{profile.email}</span>
                                    </div>
                                    <div
                                        className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                        <div
                                            className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[var(--brand-blue)] flex-shrink-0">
                                            <Phone size={16}/></div>
                                        <span className="font-medium">{profile.phone}</span>
                                    </div>
                                    <div
                                        className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                        <div
                                            className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[var(--brand-blue)] flex-shrink-0">
                                            <Calendar size={16}/></div>
                                        <span className="font-medium">{profile.dob}</span>
                                    </div>
                                    <div
                                        className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                        <div
                                            className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[var(--brand-blue)] flex-shrink-0">
                                            <MapPin size={16}/></div>
                                        <span className="font-medium">{profile.address}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Radar Chart */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-base font-bold text-gray-900">Đánh giá tổng quan</h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => router.push('/dashboard/tests')}
                                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[var(--grit-strong)] to-[var(--tw-blue-500)] text-white rounded-md text-sm hover:from-[var(--grit-strong)] hover:to-[var(--tw-blue-500)] transition-colors shadow-md"
                                >
                                    <Target size={16}/>
                                    Khám phá bản thân
                                </button>
                                <button
                                    onClick={() => router.push('/dashboard/swotCard')}
                                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--brand-blue)] text-white rounded-md text-sm hover:bg-[var(--brand-blue)]/90 transition-colors"
                                >
                                    Xem chi tiết
                                </button>
                            </div>
                        </div>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
                                    <PolarGrid stroke="var(--muted-light)"/>
                                    <PolarAngleAxis dataKey="subject" tick={{fill: 'var(--tick-gray)', fontSize: 11}}/>
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false}/>
                                    <Radar
                                        name={profile.name}
                                        dataKey="A"
                                        stroke="var(--brand-blue)"
                                        strokeWidth={2}
                                        fill="var(--brand-blue)"
                                        fillOpacity={0.3}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>

                {/* ================= RIGHT COLUMN: DETAILED SECTIONS (9 cols) ================= */}
                <div className="lg:col-span-8 space-y-8">

                    {/* 2. ACADEMIC INFO SECTION */}
                    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div
                            className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <BookOpen className="text-[var(--brand-deep)]" size={20}/>
                                THÔNG TIN HỌC THUẬT
                            </h3>
                            <StatusBadge isComplete={isAcademicComplete}/>
                        </div>

                        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                <p className="text-sm text-blue-600 font-medium mb-1">GPA Hiện tại</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-bold text-blue-900">{profile.gpa}</span>
                                    <span className="text-sm text-blue-500">/ {profile.gpaScale}</span>
                                </div>
                            </div>

                            <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                                <p className="text-sm text-purple-600 font-medium mb-1">Trình độ ngoại ngữ</p>
                                <div className="flex items-center gap-2">
                                    <Globe size={20} className="text-purple-500"/>
                                    <span className="text-xl font-bold text-purple-900">{profile.englishLevel}</span>
                                </div>
                            </div>

                            <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                                <p className="text-sm text-orange-600 font-medium mb-1">Mục tiêu du học</p>
                                <div className="flex flex-col">
                                    <span className="font-bold text-orange-900">{profile.targetMajor}</span>
                                    <span className="text-xs text-orange-600">tại {profile.targetCountry}</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 3. ACTIVITIES & ACHIEVEMENTS SECTION */}
                    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div
                            className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <Award className="text-yellow-500" size={20}/>
                                HOẠT ĐỘNG & THÀNH TÍCH
                            </h3>
                            <StatusBadge isComplete={isActivitiesComplete}/>
                        </div>

                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Activities List */}
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                    Hoạt động ngoại khóa
                                </h4>
                                <div className="space-y-4">
                                    {profile.extracurriculars.length > 0 ? profile.extracurriculars.map(act => (
                                        <div key={act.id}
                                             className="pl-4 border-l-2 border-gray-200 hover:border-blue-400 transition-colors">
                                            <h5 className="font-bold text-gray-800 text-sm">{act.title}</h5>
                                            <div className="flex justify-between items-center mt-1">
                                                <span
                                                    className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{act.role}</span>
                                                <span className="text-xs text-gray-400">{act.year}</span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{act.description}</p>
                                        </div>
                                    )) : <p className="text-gray-400 italic text-sm">Chưa cập nhật hoạt động</p>}
                                </div>
                            </div>

                            {/* Achievements List */}
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                                    Giải thưởng & Chứng nhận
                                </h4>
                                <div className="space-y-2">
                                    {profile.achievements.length > 0 ? profile.achievements.map((ach, idx) => (
                                        <div key={idx}
                                             className="flex items-start gap-2 bg-yellow-50 p-2.5 rounded-lg border border-yellow-100">
                                            <GraduationCap className="text-yellow-600 mt-0.5 flex-shrink-0" size={16}/>
                                            <span className="text-sm text-gray-800">{ach}</span>
                                        </div>
                                    )) : <p className="text-gray-400 italic text-sm">Chưa cập nhật thành tích</p>}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 4. DOCUMENTS SECTION (NEW FEATURE) */}
                    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div
                            className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <FileText className="text-gray-600" size={20}/>
                                TÀI LIỆU ĐÍNH KÈM
                            </h3>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => router.push('/dashboard/profile/schools')}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg text-sm font-semibold hover:from-blue-600 hover:to-cyan-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                >
                                    <GraduationCap size={16}/>
                                    Trường mục tiêu
                                </button>
                                <button
                                    onClick={() => router.push('/dashboard/profile/improve')}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg text-sm font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                >
                                    <Target size={16}/>
                                    Cải thiện hồ sơ
                                </button>
                                <StatusBadge isComplete={isDocumentsComplete}/>
                            </div>
                        </div>

                        <div className="p-6">
                            {/* Upload Area */}
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
                                <button onClick={() => triggerUpload('transcript')}
                                        className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-blue-200 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors group">
                                    <div
                                        className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-2 shadow-sm text-blue-500 group-hover:scale-110 transition-transform">
                                        <UploadCloud size={20}/>
                                    </div>
                                    <span className="text-xs font-semibold text-blue-700">Tải lên Bảng điểm</span>
                                </button>
                                <button onClick={() => triggerUpload('certificate')}
                                        className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-purple-200 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors group">
                                    <div
                                        className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-2 shadow-sm text-purple-500 group-hover:scale-110 transition-transform">
                                        <UploadCloud size={20}/>
                                    </div>
                                    <span className="text-xs font-semibold text-purple-700">Tải lên Chứng chỉ</span>
                                </button>
                                <button onClick={() => triggerUpload('letter')}
                                        className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-green-200 rounded-xl bg-green-50 hover:bg-green-100 transition-colors group">
                                    <div
                                        className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-2 shadow-sm text-green-500 group-hover:scale-110 transition-transform">
                                        <UploadCloud size={20}/>
                                    </div>
                                    <span className="text-xs font-semibold text-green-700">Thư giới thiệu</span>
                                </button>
                                <button onClick={() => triggerUpload('essay')}
                                        className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-orange-200 rounded-xl bg-orange-50 hover:bg-orange-100 transition-colors group">
                                    <div
                                        className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-2 shadow-sm text-orange-500 group-hover:scale-110 transition-transform">
                                        <UploadCloud size={20}/>
                                    </div>
                                    <span className="text-xs font-semibold text-orange-700">Bài luận mẫu</span>
                                </button>
                                <button onClick={() => triggerUpload('other')}
                                        className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group">
                                    <div
                                        className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-2 shadow-sm text-gray-600 group-hover:scale-110 transition-transform">
                                        <UploadCloud size={20}/>
                                    </div>
                                    <span className="text-xs font-semibold text-gray-700">File khác</span>
                                </button>
                            </div>

                            {/* Document List */}
                            <div className="border rounded-xl overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên
                                            tài liệu
                                        </th>
                                        <th scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại
                                        </th>
                                        <th scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày
                                            tải lên
                                        </th>
                                        <th scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kích
                                            thước
                                        </th>
                                        <th scope="col" className="relative px-6 py-3"><span className="sr-only">Hành động</span>
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {profile.documents.length > 0 ? profile.documents.map((doc) => (
                                        <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div
                                                        className="flex-shrink-0 h-8 w-8 rounded bg-gray-100 flex items-center justify-center text-gray-500">
                                                        <File size={16}/>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div
                                                            className="text-sm font-medium text-gray-900">{doc.name}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                          <span
                              className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                            {getDocTypeName(doc.type)}
                          </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.uploadDate}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.size}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => onDeleteDocument(doc.id)}
                                                    className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-full transition-colors"
                                                >
                                                    <Trash2 size={16}/>
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-400">
                                                Chưa có tài liệu nào được tải lên. Hãy chọn các mục ở trên để thêm tài
                                                liệu.
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
};