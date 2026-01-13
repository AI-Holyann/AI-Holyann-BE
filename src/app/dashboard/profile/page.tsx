'use client';

import React, {useState, useEffect, useMemo} from 'react';
import {ProfilePage} from '@/components/dashboard/Profile/ProfilePage';
import AcademicInfoModal from '@/components/AcademicInfoModal';
import ProfileAnalysisModal from '@/components/ProfileAnalysisModal';
import AuthHeader from '@/components/dashboard/AuthHeader';
import {StudentProfile} from '@/components/types';
import {useSession} from 'next-auth/react';

export default function ProfilePageWrapper() {
    const {data: session} = useSession();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
    const [profile, setProfile] = useState<StudentProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<any>(null);
    const [analysisLoading, setAnalysisLoading] = useState(false);

    // Get student ID from session - memoized to prevent unnecessary recalculations
    const studentId = useMemo(() => {
        // Try NextAuth session first
        const sessionUserId = (session?.user as any)?.id || (session?.user as any)?.user_id;
        if (sessionUserId) {
            return sessionUserId as string;
        }

        // Try localStorage session (for local auth)
        try {
            const localSession = localStorage.getItem('session');
            if (localSession) {
                const parsed = JSON.parse(localSession);
                const localUserId = parsed?.user_id || parsed?.userId || parsed?.id;
                if (localUserId) {
                    return localUserId;
                }
            }
        } catch (e) {
            console.warn('Could not parse session from localStorage:', e);
        }

        return null;
    }, [session?.user]);

    // Get student ID from session (for use in handlers)
    const getStudentId = (): string | null => {
        return studentId;
    };

    // Fetch profile data from API
    useEffect(() => {
        // Skip if session is still loading
        if (session === undefined) {
            return;
        }

        // Skip if no studentId
        if (!studentId) {
            setError('Không tìm thấy thông tin học sinh. Vui lòng đăng nhập lại.');
            setLoading(false);
            return;
        }

        // Skip if already loaded
        if (profile && !loading) {
            return;
        }

        const fetchProfile = async () => {

            try {
                setLoading(true);
                const response = await fetch(`/api/students/${studentId}/profile`);
                
                if (!response.ok) {
                    throw new Error('Không thể tải thông tin học sinh');
                }

                const data = await response.json();
                
                // Map API data to StudentProfile interface
                const mappedProfile: StudentProfile = {
                    id: studentId.substring(0, 8).toUpperCase(),
                    name: data.basicInfo.full_name || 'Chưa cập nhật',
                    email: data.basicInfo.email || 'Chưa cập nhật',
                    phone: data.basicInfo.phone_number || 'Chưa cập nhật',
                    address: data.basicInfo.current_address || 'Chưa cập nhật',
                    dob: data.basicInfo.date_of_birth 
                        ? new Date(data.basicInfo.date_of_birth).toLocaleDateString('vi-VN')
                        : 'Chưa cập nhật',
                    avatarUrl: data.basicInfo.avatar_url || '/images/avatars/avt.jpg',
                    
                    // GPA hiện tại: Lấy GPA lớp 12, nếu không có thì lấy lớp 11
                    gpa: (() => {
                        const gpaDetails = data.academicProfile?.gpa_transcript_details;
                        if (!gpaDetails) return 0;
                        
                        // Ưu tiên lớp 12
                        if (gpaDetails.grade12) {
                            return parseFloat(gpaDetails.grade12) || 0;
                        }
                        
                        // Fallback lớp 11
                        if (gpaDetails.grade11) {
                            return parseFloat(gpaDetails.grade11) || 0;
                        }
                        
                        // Fallback khác
                        return parseFloat(gpaDetails.grade10 || gpaDetails.grade9 || '0') || 0;
                    })(),
                    
                    gpaScale: 10.0,
                    englishLevel: data.academicProfile?.english_certificates?.[0]?.type 
                        ? `${data.academicProfile.english_certificates[0].type} ${data.academicProfile.english_certificates[0].score}`
                        : 'Chưa cập nhật',
                    targetMajor: data.studentInfo?.intended_major || 'Chưa xác định',
                    targetCountry: data.studentInfo?.target_country || 'Chưa xác định',
                    
                    // Map extracurriculars
                    extracurriculars: [
                        ...(data.background?.academic_extracurriculars?.map((act: any) => ({
                            id: act.id,
                            title: act.activity_name,
                            role: act.role || 'Thành viên',
                            year: act.start_date ? new Date(act.start_date).getFullYear().toString() : '',
                            description: act.description || ''
                        })) || []),
                        ...(data.background?.non_academic_extracurriculars?.map((act: any) => ({
                            id: act.id,
                            title: act.activity_name,
                            role: act.role || 'Thành viên',
                            year: act.start_date ? new Date(act.start_date).getFullYear().toString() : '',
                            description: act.description || ''
                        })) || [])
                    ],
                    
                    // Map achievements
                    achievements: [
                        ...(data.background?.academic_awards?.map((award: any) => 
                            `${award.award_name} - ${award.issuing_organization || ''}`
                        ) || []),
                        ...(data.background?.non_academic_awards?.map((award: any) => 
                            `${award.award_name} - ${award.issuing_organization || ''}`
                        ) || [])
                    ],
                    
                    documents: []
                };

                setProfile(mappedProfile);
                setError(null);
            } catch (err) {
                console.error('Error fetching profile:', err);
                setError('Có lỗi xảy ra khi tải thông tin học sinh');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [studentId]);

    const handleEditClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSaveProfile = async (updatedProfile: StudentProfile) => {
        const studentId = getStudentId();
        if (!studentId) return;

        try {
            const response = await fetch(`/api/students/${studentId}/profile`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userInfo: {
                        full_name: updatedProfile.name,
                        phone_number: updatedProfile.phone,
                        avatar_url: updatedProfile.avatarUrl,
                    },
                    studentInfo: {
                        date_of_birth: updatedProfile.dob,
                        current_address: updatedProfile.address,
                        intended_major: updatedProfile.targetMajor,
                        target_country: updatedProfile.targetCountry,
                    }
                })
            });

            if (response.ok) {
                setProfile(updatedProfile);
                alert('Cập nhật thông tin thành công!');
            } else {
                alert('Có lỗi xảy ra khi cập nhật thông tin');
            }
        } catch (error) {
            console.error('Error saving profile:', error);
            alert('Có lỗi xảy ra khi cập nhật thông tin');
        }
    };

    const handleUploadDocument = async (file: File, type: string) => {
        const studentId = getStudentId();
        if (!studentId) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`/api/students/${studentId}/upload-cv`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Document uploaded:', result);
                alert('Tải tài liệu thành công!');
            } else {
                alert('Có lỗi xảy ra khi tải tài liệu');
            }
        } catch (error) {
            console.error('Error uploading document:', error);
            alert('Có lỗi xảy ra khi tải tài liệu');
        }
    };

    const handleDeleteDocument = (id: string) => {
        console.log('Delete document:', id);
        // TODO: Implement delete document API call
    };

    const handleAnalyzeProfile = async () => {
        const studentId = getStudentId();
        if (!studentId) {
            alert('Không tìm thấy thông tin học sinh');
            return;
        }

        setIsAnalysisModalOpen(true);
        setAnalysisLoading(true);
        setAnalysisResult(null);

        try {
            const response = await fetch(`/api/students/${studentId}/analyze-profile`, {
                method: 'POST',
            });

            const data = await response.json();

            if (!response.ok) {
                setAnalysisResult({
                    error: data.error || 'Có lỗi xảy ra khi phân tích hồ sơ',
                    details: data.details,
                });
            } else {
                setAnalysisResult(data);
            }
        } catch (error: any) {
            console.error('Error analyzing profile:', error);
            setAnalysisResult({
                error: 'Có lỗi xảy ra khi kết nối đến server phân tích',
                details: error.message,
            });
        } finally {
            setAnalysisLoading(false);
        }
    };

    // Loading state
    if (loading) {
        return (
            <>
                <AuthHeader/>
                <main className="min-h-screen bg-white dark:bg-slate-900">
                    <div className="flex justify-center items-center h-screen">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                </main>
            </>
        );
    }

    // Error state
    if (error || !profile) {
        return (
            <>
                <AuthHeader/>
                <main className="min-h-screen bg-white dark:bg-slate-900">
                    <div className="flex flex-col justify-center items-center h-screen">
                        <div className="text-red-600 text-xl mb-4">{error || 'Không tìm thấy thông tin học sinh'}</div>
                        <button 
                            onClick={() => window.location.reload()}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Tải lại trang
                        </button>
                    </div>
                </main>
            </>
        );
    }

    return (
        <>
            <AuthHeader/>
            <main className="min-h-screen bg-white dark:bg-gray-900">
                <ProfilePage
                    profile={profile}
                    onEditClick={handleEditClick}
                    onUploadDocument={handleUploadDocument}
                    onDeleteDocument={handleDeleteDocument}
                    onAnalyzeProfile={handleAnalyzeProfile}
                />
                {isModalOpen && profile && (
                    <AcademicInfoModal
                        studentId={getStudentId() || ''}
                        onClose={handleCloseModal}
                    />
                )}
                <ProfileAnalysisModal
                    isOpen={isAnalysisModalOpen}
                    onClose={() => setIsAnalysisModalOpen(false)}
                    result={analysisResult}
                    loading={analysisLoading}
                />
            </main>
        </>
    );
}