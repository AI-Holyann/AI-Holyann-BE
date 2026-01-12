'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    Mail, 
    Phone, 
    Calendar, 
    MapPin, 
    Edit, 
    Upload, 
    Plus,
    Award,
    Briefcase,
    FlaskConical,
    Users
} from 'lucide-react';
import AcademicInfoModal from './AcademicInfoModal';
import Image from 'next/image';

interface StudentProfileProps {
    studentId: string;
}

export default function StudentProfile({ studentId }: StudentProfileProps) {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showAcademicModal, setShowAcademicModal] = useState(false);
    const [uploadMode, setUploadMode] = useState<'manual' | 'cv' | null>(null);

    useEffect(() => {
        fetchProfile();
    }, [studentId]);

    const fetchProfile = async () => {
        try {
            const res = await fetch(`/api/students/${studentId}/profile`);
            const data = await res.json();
            setProfile(data);
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>;
    }

    if (!profile) {
        return <div>Không tìm thấy thông tin học sinh</div>;
    }

    const hasAcademicData = profile.background || profile.academicProfile;

    return (
        <div className="container mx-auto p-6 max-w-7xl">
            <h1 className="text-3xl font-bold mb-8">Hồ sơ học sinh</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Personal Info */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Avatar and Basic Info Card */}
                    <Card>
                        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-t-lg">
                            <div className="flex flex-col items-center">
                                <div className="w-24 h-24 rounded-full overflow-hidden bg-white mb-4">
                                    {profile.basicInfo.avatar_url ? (
                                        <Image 
                                            src={profile.basicInfo.avatar_url} 
                                            alt={profile.basicInfo.full_name}
                                            width={96}
                                            height={96}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600 text-3xl font-bold">
                                            {profile.basicInfo.full_name?.charAt(0) || 'N'}
                                        </div>
                                    )}
                                </div>
                                <h2 className="text-xl font-bold">{profile.basicInfo.full_name}</h2>
                            </div>
                        </CardHeader>
                        <CardContent className="mt-6">
                            <div className="space-y-4">
                                <div className="flex items-start justify-between">
                                    <h3 className="font-semibold text-gray-700 mb-3">THÔNG TIN CÁ NHÂN</h3>
                                    <Badge 
                                        variant={profile.basicInfo.status === 'Hoàn tất' ? 'default' : 'secondary'}
                                        className={profile.basicInfo.status === 'Hoàn tất' ? 'bg-green-500' : 'bg-yellow-500'}
                                    >
                                        {profile.basicInfo.status}
                                    </Badge>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <Mail className="w-5 h-5 text-blue-600" />
                                        <span className="text-sm">{profile.basicInfo.email || 'Chưa cập nhật'}</span>
                                    </div>

                                    <div className="flex items-center gap-3 text-gray-700">
                                        <Phone className="w-5 h-5 text-blue-600" />
                                        <span className="text-sm">{profile.basicInfo.phone_number || 'Chưa cập nhật'}</span>
                                    </div>

                                    <div className="flex items-center gap-3 text-gray-700">
                                        <Calendar className="w-5 h-5 text-blue-600" />
                                        <span className="text-sm">
                                            {profile.basicInfo.date_of_birth 
                                                ? new Date(profile.basicInfo.date_of_birth).toLocaleDateString('vi-VN') 
                                                : 'Chưa cập nhật'}
                                        </span>
                                    </div>

                                    <div className="flex items-start gap-3 text-gray-700">
                                        <MapPin className="w-5 h-5 text-blue-600 mt-1" />
                                        <span className="text-sm">{profile.basicInfo.current_address || 'Chưa cập nhật'}</span>
                                    </div>
                                </div>

                                <Button 
                                    variant="outline" 
                                    className="w-full mt-4"
                                    onClick={() => {/* TODO: Open edit modal */}}
                                >
                                    <Edit className="w-4 h-4 mr-2" />
                                    Cập nhật hồ sơ
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Assessment Overview */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Đánh giá tổng quan</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Kỹ năng mềm</span>
                                    <div className="w-24 h-24">
                                        <svg viewBox="0 0 100 100" className="transform -rotate-90">
                                            <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="8"/>
                                            <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="8" 
                                                strokeDasharray="251.2" strokeDashoffset="62.8"/>
                                        </svg>
                                    </div>
                                </div>
                                <div className="text-center text-sm text-gray-500 italic">
                                    Biểu đồ radar sẽ được hiển thị ở đây
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Academic Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Academic Info Header */}
                    <Card>
                        <CardHeader className="border-b">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Award className="w-5 h-5 text-blue-600" />
                                    <CardTitle>THÔNG TIN HỌC THUẬT</CardTitle>
                                </div>
                                <Badge 
                                    variant={profile.status.overallStatus === 'Hoàn tất' ? 'default' : 'secondary'}
                                    className={profile.status.overallStatus === 'Hoàn tất' ? 'bg-green-500' : 'bg-yellow-500'}
                                >
                                    {profile.status.overallStatus}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="mt-6">
                            {!hasAcademicData ? (
                                <div className="text-center py-12">
                                    <h3 className="text-lg font-semibold mb-6">
                                        Bạn muốn bổ sung thông tin của mình bằng cách nào?
                                    </h3>
                                    <div className="flex gap-4 justify-center">
                                        <Button 
                                            onClick={() => {
                                                setUploadMode('manual');
                                                setShowAcademicModal(true);
                                            }}
                                            className="bg-blue-600 hover:bg-blue-700"
                                        >
                                            <Edit className="w-4 h-4 mr-2" />
                                            Điền thủ công
                                        </Button>
                                        <Button 
                                            onClick={() => {
                                                setUploadMode('cv');
                                                // TODO: Open CV upload
                                            }}
                                            variant="outline"
                                        >
                                            <Upload className="w-4 h-4 mr-2" />
                                            Upload CV
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {/* Student Goals Section */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-purple-50 rounded-lg">
                                            <p className="text-sm text-purple-600 font-medium mb-1">Trình độ ngôn ngữ</p>
                                            <p className="text-lg font-bold text-purple-900">
                                                {profile.academicProfile?.english_certificates?.type || 'IELTS 7.5'}
                                            </p>
                                        </div>
                                        <div className="p-4 bg-orange-50 rounded-lg">
                                            <p className="text-sm text-orange-600 font-medium mb-1">Mục tiêu du học</p>
                                            <p className="text-lg font-bold text-orange-900">
                                                {profile.studentInfo?.intended_major || 'Computer Science'}
                                            </p>
                                            <p className="text-xs text-orange-600">
                                                tại {profile.studentInfo?.target_country || 'Canada'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Activities & Achievements */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                                                <Award className="w-4 h-4" />
                                                HOẠT ĐỘNG & THÀNH TÍCH
                                            </h3>
                                            <Button 
                                                variant="ghost" 
                                                size="sm"
                                                onClick={() => setShowAcademicModal(true)}
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                        </div>

                                        {/* Academic Awards */}
                                        {profile.background?.academic_awards?.length > 0 && (
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                                                    <Award className="w-3 h-3" />
                                                    Giải thưởng học thuật
                                                </h4>
                                                <div className="space-y-2">
                                                    {profile.background.academic_awards.map((award: any) => (
                                                        <div key={award.id} className="p-3 bg-yellow-50 rounded border-l-4 border-yellow-400">
                                                            <p className="font-medium text-sm">{award.award_name}</p>
                                                            <p className="text-xs text-gray-600">{award.issuing_organization}</p>
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                {new Date(award.award_date).getFullYear()}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Extracurriculars */}
                                        {profile.background?.academic_extracurriculars?.length > 0 && (
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                                                    <Users className="w-3 h-3" />
                                                    Hoạt động ngoại khóa
                                                </h4>
                                                <div className="space-y-2">
                                                    {profile.background.academic_extracurriculars.map((activity: any) => (
                                                        <div key={activity.id} className="p-3 bg-green-50 rounded border-l-4 border-green-400">
                                                            <p className="font-medium text-sm">{activity.activity_name}</p>
                                                            <p className="text-xs text-gray-600">{activity.role} - {activity.organization}</p>
                                                            <p className="text-xs text-gray-500 mt-1">{activity.description}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Work Experience */}
                                        {profile.background?.work_experiences?.length > 0 && (
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                                                    <Briefcase className="w-3 h-3" />
                                                    Kinh nghiệm làm việc
                                                </h4>
                                                <div className="space-y-2">
                                                    {profile.background.work_experiences.map((work: any) => (
                                                        <div key={work.id} className="p-3 bg-blue-50 rounded border-l-4 border-blue-400">
                                                            <p className="font-medium text-sm">{work.job_title}</p>
                                                            <p className="text-xs text-gray-600">{work.company_name}</p>
                                                            <p className="text-xs text-gray-500 mt-1">{work.responsibilities}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Research Experience */}
                                        {profile.background?.research_experiences?.length > 0 && (
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                                                    <FlaskConical className="w-3 h-3" />
                                                    Kinh nghiệm nghiên cứu
                                                </h4>
                                                <div className="space-y-2">
                                                    {profile.background.research_experiences.map((research: any) => (
                                                        <div key={research.id} className="p-3 bg-purple-50 rounded border-l-4 border-purple-400">
                                                            <p className="font-medium text-sm">{research.project_title}</p>
                                                            <p className="text-xs text-gray-600">{research.role} - {research.institution}</p>
                                                            <p className="text-xs text-gray-500 mt-1">{research.description}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Add More Button */}
                                        <Button 
                                            variant="outline" 
                                            className="w-full"
                                            onClick={() => setShowAcademicModal(true)}
                                        >
                                            <Plus className="w-4 h-4 mr-2" />
                                            Thêm thông tin
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Documents Section */}
                    <Card>
                        <CardHeader className="border-b">
                            <CardTitle className="flex items-center gap-2">
                                <Upload className="w-5 h-5 text-blue-600" />
                                TÀI LIỆU ĐÍNH KÈM
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="mt-6">
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                <button className="p-6 border-2 border-dashed rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors flex flex-col items-center justify-center">
                                    <Upload className="w-8 h-8 text-blue-600 mb-2" />
                                    <span className="text-xs text-center">Tải lên bảng điểm</span>
                                </button>
                                <button className="p-6 border-2 border-dashed rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors flex flex-col items-center justify-center">
                                    <Upload className="w-8 h-8 text-purple-600 mb-2" />
                                    <span className="text-xs text-center">Tải lên chứng chỉ</span>
                                </button>
                                <button className="p-6 border-2 border-dashed rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors flex flex-col items-center justify-center">
                                    <Upload className="w-8 h-8 text-green-600 mb-2" />
                                    <span className="text-xs text-center">Thư giới thiệu</span>
                                </button>
                                <button className="p-6 border-2 border-dashed rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors flex flex-col items-center justify-center">
                                    <Upload className="w-8 h-8 text-orange-600 mb-2" />
                                    <span className="text-xs text-center">Bài luận mẫu</span>
                                </button>
                                <button className="p-6 border-2 border-dashed rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors flex flex-col items-center justify-center">
                                    <Upload className="w-8 h-8 text-gray-600 mb-2" />
                                    <span className="text-xs text-center">File khác</span>
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 text-center mt-4">
                                Chưa có tài liệu nào được tải lên. Hãy chọn các mục ở trên để thêm tài liệu.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Academic Info Modal */}
            {showAcademicModal && (
                <AcademicInfoModal
                    studentId={studentId}
                    onClose={() => {
                        setShowAcademicModal(false);
                        setUploadMode(null);
                        fetchProfile();
                    }}
                    initialData={profile}
                />
            )}
        </div>
    );
}
