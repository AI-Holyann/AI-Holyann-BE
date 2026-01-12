'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Save } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AcademicInfoModalProps {
    studentId: string;
    onClose: () => void;
}

export default function AcademicInfoModal({ studentId, onClose }: AcademicInfoModalProps) {
    const [activeTab, setActiveTab] = useState('basic');
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    // Basic Info State
    const [basicInfo, setBasicInfo] = useState({
        full_name: '',
        current_school: '',
        current_grade: '',
        current_address: '',
        phone_number: '',
        email: '',
        talents: '',
        hobbies: ''
    });

    // Academic Info State
    const [gpaData, setGpaData] = useState({
        grade9: '',
        grade10: '',
        grade11: '',
        grade12: ''
    });

    const [englishCerts, setEnglishCerts] = useState<any[]>([{ type: '', score: '', date: '' }]);
    const [standardizedTests, setStandardizedTests] = useState<any[]>([{ type: '', score: '', date: '' }]);
    const [intendedMajor, setIntendedMajor] = useState('');

    // Profile Info State
    const [academicAwards, setAcademicAwards] = useState<any[]>([{ award_name: '', issuing_organization: '', award_level: '', award_date: '', description: '', category: '', year: '', rank: '', region: '' }]);
    const [nonAcademicAwards, setNonAcademicAwards] = useState<any[]>([{ award_name: '', category: '', issuing_organization: '', award_level: '', award_date: '', description: '', year: '', rank: '', region: '' }]);
    const [academicActivities, setAcademicActivities] = useState<any[]>([{ activity_name: '', organization: '', role: '', start_date: '', end_date: '', description: '', scale: '', region: '' }]);
    const [nonAcademicActivities, setNonAcademicActivities] = useState<any[]>([{ activity_name: '', organization: '', role: '', start_date: '', end_date: '', description: '', scale: '', region: '' }]);
    const [workExperiences, setWorkExperiences] = useState<any[]>([{ company_name: '', job_title: '', start_date: '', end_date: '', description: '' }]);
    const [researchExperiences, setResearchExperiences] = useState<any[]>([{ project_title: '', institution: '', role: '', start_date: '', end_date: '', description: '' }]);
    
    // NEW: Additional State for Feature 1
    const [subjectScores, setSubjectScores] = useState<any[]>([{ subject: '', score: '', year: '', semester: '' }]);
    const [personalProjects, setPersonalProjects] = useState<any[]>([{ project_name: '', topic: '', description: '', duration_months: '', impact: '' }]);
    const [skills, setSkills] = useState<any[]>([{ skill_name: '', proficiency: '', category: '' }]);
    
    const [studentGoals, setStudentGoals] = useState({
        target_country: '',
        yearly_budget: '',
        personal_desire: ''
    });

    // Parents Info State
    const [parentsInfo, setParentsInfo] = useState<any[]>([{ full_name: '', relationship: '', phone_number: '', email: '' }]);

    // Fetch student data when modal opens
    useEffect(() => {
        const fetchStudentData = async () => {
            if (!studentId) return;

            try {
                setLoading(true);
                const response = await fetch(`/api/students/${studentId}/profile`);
                
                if (!response.ok) {
                    throw new Error('Failed to fetch student data');
                }

                const data = await response.json();
                
                // Populate Basic Info
                setBasicInfo({
                    full_name: data.basicInfo?.full_name || '',
                    current_school: data.studentInfo?.current_school || '',
                    current_grade: data.studentInfo?.current_grade || '',
                    current_address: data.basicInfo?.current_address || '',
                    phone_number: data.basicInfo?.phone_number || '',
                    email: data.basicInfo?.email || '',
                    talents: data.studentInfo?.talents || '',
                    hobbies: data.studentInfo?.hobbies || ''
                });

                // Populate GPA Data
                setGpaData({
                    grade9: data.academicProfile?.gpa_transcript_details?.grade9 || '',
                    grade10: data.academicProfile?.gpa_transcript_details?.grade10 || '',
                    grade11: data.academicProfile?.gpa_transcript_details?.grade11 || '',
                    grade12: data.academicProfile?.gpa_transcript_details?.grade12 || ''
                });

                // Populate English Certificates
                if (data.academicProfile?.english_certificates?.length > 0) {
                    setEnglishCerts(data.academicProfile.english_certificates);
                }

                // Populate Standardized Tests
                if (data.academicProfile?.standardized_tests?.length > 0) {
                    setStandardizedTests(data.academicProfile.standardized_tests);
                }

                // Populate Intended Major
                setIntendedMajor(data.studentInfo?.intended_major || '');

                // Populate Academic Awards
                if (data.background?.academic_awards?.length > 0) {
                    setAcademicAwards(data.background.academic_awards.map((a: any) => ({
                        ...a,
                        award_name: a.award_name || '',
                        issuing_organization: a.issuing_organization || '',
                        award_level: a.award_level || '',
                        award_date: a.award_date || '',
                        description: a.description || '',
                        category: a.category || '',
                        year: a.year || '',
                        rank: a.rank || '',
                        region: a.region || ''
                    })));
                }

                // Populate Non-Academic Awards
                if (data.background?.non_academic_awards?.length > 0) {
                    setNonAcademicAwards(data.background.non_academic_awards.map((a: any) => ({
                        ...a,
                        award_name: a.award_name || '',
                        category: a.category || '',
                        issuing_organization: a.issuing_organization || '',
                        award_level: a.award_level || '',
                        award_date: a.award_date || '',
                        description: a.description || '',
                        year: a.year || '',
                        rank: a.rank || '',
                        region: a.region || ''
                    })));
                }

                // Populate Academic Activities
                if (data.background?.academic_extracurriculars?.length > 0) {
                    setAcademicActivities(data.background.academic_extracurriculars.map((a: any) => ({
                        ...a,
                        activity_name: a.activity_name || '',
                        organization: a.organization || '',
                        role: a.role || '',
                        start_date: a.start_date || '',
                        end_date: a.end_date || '',
                        description: a.description || '',
                        scale: a.scale || '',
                        region: a.region || ''
                    })));
                }

                // Populate Non-Academic Activities
                if (data.background?.non_academic_extracurriculars?.length > 0) {
                    setNonAcademicActivities(data.background.non_academic_extracurriculars.map((a: any) => ({
                        ...a,
                        activity_name: a.activity_name || '',
                        organization: a.organization || '',
                        role: a.role || '',
                        start_date: a.start_date || '',
                        end_date: a.end_date || '',
                        description: a.description || '',
                        scale: a.scale || '',
                        region: a.region || ''
                    })));
                }

                // Populate Work Experiences
                if (data.background?.work_experiences?.length > 0) {
                    setWorkExperiences(data.background.work_experiences.map((w: any) => ({
                        ...w,
                        company_name: w.company_name || '',
                        job_title: w.job_title || '',
                        start_date: w.start_date || '',
                        end_date: w.end_date || '',
                        description: w.description || ''
                    })));
                }

                // Populate Research Experiences
                if (data.background?.research_experiences?.length > 0) {
                    setResearchExperiences(data.background.research_experiences.map((r: any) => ({
                        ...r,
                        project_title: r.project_title || '',
                        institution: r.institution || '',
                        role: r.role || '',
                        start_date: r.start_date || '',
                        end_date: r.end_date || '',
                        description: r.description || ''
                    })));
                }

                // Populate Student Goals
                setStudentGoals({
                    target_country: data.studentInfo?.target_country || '',
                    yearly_budget: data.studentInfo?.yearly_budget || '',
                    personal_desire: data.studentInfo?.personal_desire || ''
                });

                // Populate Parents Info
                if (data.parents?.length > 0) {
                    setParentsInfo(data.parents.map((p: any) => ({
                        ...p,
                        full_name: p.full_name || '',
                        relationship: p.relationship || '',
                        phone_number: p.phone_number || '',
                        email: p.email || ''
                    })));
                }

                // Populate NEW: Subject Scores
                if (data.background?.subject_scores?.length > 0) {
                    setSubjectScores(data.background.subject_scores.map((s: any) => ({
                        ...s,
                        subject: s.subject || '',
                        score: s.score || '',
                        year: s.year || '',
                        semester: s.semester || ''
                    })));
                }

                // Populate NEW: Personal Projects
                if (data.background?.personal_projects?.length > 0) {
                    setPersonalProjects(data.background.personal_projects.map((p: any) => ({
                        ...p,
                        project_name: p.project_name || '',
                        topic: p.topic || '',
                        description: p.description || '',
                        duration_months: p.duration_months || '',
                        impact: p.impact || ''
                    })));
                }

                // Populate NEW: Skills
                if (data.skills?.length > 0) {
                    setSkills(data.skills.map((s: any) => ({
                        ...s,
                        skill_name: s.skill_name || '',
                        proficiency: s.proficiency || '',
                        category: s.category || ''
                    })));
                }

            } catch (error) {
                console.error('Error fetching student data:', error);
                alert('Có lỗi xảy ra khi tải thông tin học sinh');
            } finally {
                setLoading(false);
            }
        };

        fetchStudentData();
    }, [studentId]);

    const handleSaveAll = async () => {
        setSaving(true);
        try {
            // Save Basic Info & Goals
            await fetch(`/api/students/${studentId}/profile`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    basicInfo,
                    studentInfo: {
                        ...studentGoals,
                        intended_major: intendedMajor
                    }
                })
            });

            // Save Academic Profile
            await fetch(`/api/students/${studentId}/academic`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    gpa_transcript_details: gpaData,
                    english_certificates: englishCerts.filter(c => c.type),
                    standardized_tests: standardizedTests.filter(t => t.type)
                })
            });

            // STRATEGY: DELETE ALL old data, then INSERT all current data (no duplicates)
            
            // 1. Delete all existing data
            const deleteResults = await Promise.all([
                fetch(`/api/students/${studentId}/academic-awards`, { method: 'DELETE' }),
                fetch(`/api/students/${studentId}/non-academic-awards`, { method: 'DELETE' }),
                fetch(`/api/students/${studentId}/academic-extracurriculars`, { method: 'DELETE' }),
                fetch(`/api/students/${studentId}/non-academic-extracurriculars`, { method: 'DELETE' }),
                fetch(`/api/students/${studentId}/work-experiences`, { method: 'DELETE' }),
                fetch(`/api/students/${studentId}/research-experiences`, { method: 'DELETE' }),
                fetch(`/api/students/${studentId}/parents`, { method: 'DELETE' }),
                fetch(`/api/students/${studentId}/subject-scores`, { method: 'DELETE' }),
                fetch(`/api/students/${studentId}/personal-projects`, { method: 'DELETE' }),
                fetch(`/api/students/${studentId}/skills`, { method: 'DELETE' })
            ]);

            // Check for delete errors
            const failedDeletes = deleteResults.filter(r => !r.ok);
            if (failedDeletes.length > 0) {
                console.error('Some delete operations failed:', failedDeletes);
                // Continue anyway - data will be replaced
            }

            // 2. Insert all current data from form
            for (const award of academicAwards.filter(a => a.award_name)) {
                await fetch(`/api/students/${studentId}/academic-awards`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(award)
                });
            }

            for (const award of nonAcademicAwards.filter(a => a.award_name)) {
                await fetch(`/api/students/${studentId}/non-academic-awards`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(award)
                });
            }

            for (const activity of academicActivities.filter(a => a.activity_name)) {
                await fetch(`/api/students/${studentId}/academic-extracurriculars`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(activity)
                });
            }

            for (const activity of nonAcademicActivities.filter(a => a.activity_name)) {
                await fetch(`/api/students/${studentId}/non-academic-extracurriculars`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(activity)
                });
            }

            for (const work of workExperiences.filter(w => w.company_name)) {
                await fetch(`/api/students/${studentId}/work-experiences`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(work)
                });
            }

            for (const research of researchExperiences.filter(r => r.project_title)) {
                await fetch(`/api/students/${studentId}/research-experiences`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(research)
                });
            }

            for (const parent of parentsInfo.filter(p => p.full_name)) {
                await fetch(`/api/students/${studentId}/parents`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(parent)
                });
            }

            for (const score of subjectScores.filter(s => s.subject && s.score)) {
                await fetch(`/api/students/${studentId}/subject-scores`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        subject: score.subject,
                        score: score.score,
                        year: score.year || null,
                        semester: score.semester || null
                    })
                });
            }

            for (const project of personalProjects.filter(p => p.project_name)) {
                await fetch(`/api/students/${studentId}/personal-projects`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        project_name: project.project_name,
                        topic: project.topic || null,
                        description: project.description || null,
                        duration_months: project.duration_months || null,
                        impact: project.impact || null
                    })
                });
            }

            for (const skill of skills.filter(s => s.skill_name)) {
                await fetch(`/api/students/${studentId}/skills`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        skill_name: skill.skill_name,
                        proficiency: skill.proficiency || null,
                        category: skill.category || null
                    })
                });
            }

            alert('Lưu thông tin thành công!');
            window.location.reload();
        } catch (error) {
            console.error('Error saving data:', error);
            alert('Có lỗi xảy ra khi lưu thông tin');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl">Cập nhật hồ sơ học sinh</DialogTitle>
                </DialogHeader>

                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <span className="ml-4 text-gray-600">Đang tải thông tin học sinh...</span>
                    </div>
                ) : (
                    <>
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <TabsList className="grid grid-cols-4 w-full">
                                <TabsTrigger value="basic">Thông tin liên lạc</TabsTrigger>
                                <TabsTrigger value="academic">Học tập</TabsTrigger>
                                <TabsTrigger value="profile">Hồ sơ</TabsTrigger>
                                <TabsTrigger value="parents">Phụ huynh</TabsTrigger>
                            </TabsList>

                    {/* Tab 1: Thông tin liên lạc của học viên */}
                    <TabsContent value="basic" className="space-y-4 mt-6">
                        <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg">
                            <h3 className="font-bold text-blue-900 mb-4 text-lg">THÔNG TIN LIÊN LẠC CỦA HỌC VIÊN</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm font-medium">Họ và tên học viên *</Label>
                                    <Input 
                                        value={basicInfo.full_name}
                                        disabled
                                        placeholder="Nhập họ tên đầy đủ"
                                        className="mt-1 opacity-60 cursor-not-allowed"
                                    />
                                </div>
                                <div>
                                    <Label className="text-sm font-medium">Lớp - Trường đang theo học</Label>
                                    <div className="grid grid-cols-2 gap-2 mt-1">
                                        <Input 
                                            value={basicInfo.current_grade}
                                            onChange={(e) => setBasicInfo({...basicInfo, current_grade: e.target.value})}
                                            placeholder="VD: 12"
                                        />
                                        <Input 
                                            value={basicInfo.current_school}
                                            onChange={(e) => setBasicInfo({...basicInfo, current_school: e.target.value})}
                                            placeholder="Tên trường"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium">Nơi ở hiện tại</Label>
                                    <Input 
                                        value={basicInfo.current_address}
                                        onChange={(e) => setBasicInfo({...basicInfo, current_address: e.target.value})}
                                        placeholder="Địa chỉ"
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label className="text-sm font-medium">Số điện thoại</Label>
                                    <Input 
                                        value={basicInfo.phone_number}
                                        onChange={(e) => setBasicInfo({...basicInfo, phone_number: e.target.value})}
                                        placeholder="0XXXXXXXXX"
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label className="text-sm font-medium">Email cá nhân</Label>
                                    <Input 
                                        type="email"
                                        value={basicInfo.email}
                                        disabled
                                        placeholder="email@example.com"
                                        className="mt-1 opacity-60 cursor-not-allowed"
                                    />
                                </div>
                                <div>
                                    <Label className="text-sm font-medium">Năng khiếu</Label>
                                    <Input 
                                        value={basicInfo.talents}
                                        onChange={(e) => setBasicInfo({...basicInfo, talents: e.target.value})}
                                        placeholder="VD: Toán học, Vẽ, ..."
                                        className="mt-1"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <Label className="text-sm font-medium">Sở thích</Label>
                                    <Textarea 
                                        value={basicInfo.hobbies}
                                        onChange={(e) => setBasicInfo({...basicInfo, hobbies: e.target.value})}
                                        placeholder="Mô tả sở thích của bạn..."
                                        className="mt-1"
                                        rows={3}
                                    />
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Tab 2: Học tập */}
                    <TabsContent value="academic" className="space-y-4 mt-6">
                        {/* GPA */}
                        <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg">
                            <h3 className="font-bold text-blue-900 mb-4 text-lg">GPA (Lớp 9, 10, 11, 12)</h3>
                            <div className="grid grid-cols-4 gap-4">
                                {['grade9', 'grade10', 'grade11', 'grade12'].map((grade, idx) => (
                                    <div key={grade}>
                                        <Label className="text-sm">Lớp {9 + idx}</Label>
                                        <Input 
                                            type="number" 
                                            step="0.01"
                                            max="10"
                                            value={gpaData[grade as keyof typeof gpaData]}
                                            onChange={(e) => setGpaData({...gpaData, [grade]: e.target.value})}
                                            placeholder="0.00"
                                            className="mt-1"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Chứng chỉ Tiếng Anh */}
                        <div className="bg-purple-50 border-l-4 border-purple-600 p-6 rounded-lg">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-purple-900 text-lg">CHỨNG CHỈ TIẾNG ANH (IELTS, DET, TOEFL,...)</h3>
                                <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => setEnglishCerts([...englishCerts, { type: '', score: '', date: '' }])}
                                >
                                    <Plus className="w-4 h-4 mr-1" />
                                    Thêm
                                </Button>
                            </div>
                            {englishCerts.map((cert, index) => (
                                <div key={index} className="grid grid-cols-4 gap-3 mb-3 items-end">
                                    <div>
                                        <Label className="text-sm">Loại chứng chỉ</Label>
                                        <Select 
                                            value={cert.type}
                                            onValueChange={(value) => {
                                                const newCerts = [...englishCerts];
                                                newCerts[index].type = value;
                                                setEnglishCerts(newCerts);
                                            }}
                                        >
                                            <SelectTrigger className="mt-1">
                                                <SelectValue placeholder="Chọn" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="IELTS">IELTS</SelectItem>
                                                <SelectItem value="TOEFL">TOEFL</SelectItem>
                                                <SelectItem value="DET">DET (Duolingo)</SelectItem>
                                                <SelectItem value="TOEIC">TOEIC</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label className="text-sm">Điểm số</Label>
                                        <Input 
                                            placeholder="VD: 7.5"
                                            value={cert.score}
                                            onChange={(e) => {
                                                const newCerts = [...englishCerts];
                                                newCerts[index].score = e.target.value;
                                                setEnglishCerts(newCerts);
                                            }}
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-sm">Ngày thi</Label>
                                        <Input 
                                            type="date"
                                            value={cert.date}
                                            onChange={(e) => {
                                                const newCerts = [...englishCerts];
                                                newCerts[index].date = e.target.value;
                                                setEnglishCerts(newCerts);
                                            }}
                                            className="mt-1"
                                        />
                                    </div>
                                    <Button 
                                        size="sm" 
                                        variant="ghost"
                                        onClick={() => setEnglishCerts(englishCerts.filter((_, i) => i !== index))}
                                    >
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                    </Button>
                                </div>
                            ))}
                        </div>

                        {/* Bài thi chuẩn hóa */}
                        <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-lg">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-green-900 text-lg">BÀI THI CHUẨN HÓA (SAT, ACT,...)</h3>
                                <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => setStandardizedTests([...standardizedTests, { type: '', score: '', date: '' }])}
                                >
                                    <Plus className="w-4 h-4 mr-1" />
                                    Thêm
                                </Button>
                            </div>
                            {standardizedTests.map((test, index) => (
                                <div key={index} className="grid grid-cols-4 gap-3 mb-3 items-end">
                                    <div>
                                        <Label className="text-sm">Loại bài thi</Label>
                                        <Select 
                                            value={test.type}
                                            onValueChange={(value) => {
                                                const newTests = [...standardizedTests];
                                                newTests[index].type = value;
                                                setStandardizedTests(newTests);
                                            }}
                                        >
                                            <SelectTrigger className="mt-1">
                                                <SelectValue placeholder="Chọn" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="SAT">SAT</SelectItem>
                                                <SelectItem value="ACT">ACT</SelectItem>
                                                <SelectItem value="AP">AP</SelectItem>
                                                <SelectItem value="IB">IB</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label className="text-sm">Điểm số</Label>
                                        <Input 
                                            placeholder="VD: 1450"
                                            value={test.score}
                                            onChange={(e) => {
                                                const newTests = [...standardizedTests];
                                                newTests[index].score = e.target.value;
                                                setStandardizedTests(newTests);
                                            }}
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-sm">Ngày thi</Label>
                                        <Input 
                                            type="date"
                                            value={test.date}
                                            onChange={(e) => {
                                                const newTests = [...standardizedTests];
                                                newTests[index].date = e.target.value;
                                                setStandardizedTests(newTests);
                                            }}
                                            className="mt-1"
                                        />
                                    </div>
                                    <Button 
                                        size="sm" 
                                        variant="ghost"
                                        onClick={() => setStandardizedTests(standardizedTests.filter((_, i) => i !== index))}
                                    >
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                    </Button>
                                </div>
                            ))}
                        </div>

                        {/* NEW: Điểm từng môn học */}
                        <div className="bg-indigo-50 border-l-4 border-indigo-600 p-6 rounded-lg">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-indigo-900 text-lg">ĐIỂM TỪNG MÔN HỌC (Subject Scores)</h3>
                                <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => setSubjectScores([...subjectScores, { subject: '', score: '', year: '', semester: '' }])}
                                >
                                    <Plus className="w-4 h-4 mr-1" />
                                    Thêm
                                </Button>
                            </div>
                            {subjectScores.map((score, index) => (
                                <div key={index} className="grid grid-cols-5 gap-3 mb-3 items-end">
                                    <div>
                                        <Label className="text-sm">Môn học</Label>
                                        <Input 
                                            value={score.subject}
                                            onChange={(e) => {
                                                const newScores = [...subjectScores];
                                                newScores[index].subject = e.target.value;
                                                setSubjectScores(newScores);
                                            }}
                                            placeholder="VD: Toán, Vật Lý"
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-sm">Điểm</Label>
                                        <Input 
                                            type="number"
                                            step="0.1"
                                            max="10"
                                            value={score.score}
                                            onChange={(e) => {
                                                const newScores = [...subjectScores];
                                                newScores[index].score = e.target.value;
                                                setSubjectScores(newScores);
                                            }}
                                            placeholder="0.0"
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-sm">Năm</Label>
                                        <Input 
                                            type="number"
                                            value={score.year}
                                            onChange={(e) => {
                                                const newScores = [...subjectScores];
                                                newScores[index].year = e.target.value;
                                                setSubjectScores(newScores);
                                            }}
                                            placeholder="2024"
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-sm">Học kỳ</Label>
                                        <Select 
                                            value={score.semester}
                                            onValueChange={(value) => {
                                                const newScores = [...subjectScores];
                                                newScores[index].semester = value;
                                                setSubjectScores(newScores);
                                            }}
                                        >
                                            <SelectTrigger className="mt-1">
                                                <SelectValue placeholder="Chọn" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="1">HK1</SelectItem>
                                                <SelectItem value="2">HK2</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Button 
                                        size="sm" 
                                        variant="ghost"
                                        onClick={() => setSubjectScores(subjectScores.filter((_, i) => i !== index))}
                                    >
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                    </Button>
                                </div>
                            ))}
                        </div>

                        {/* Ngành dự định học */}
                        <div className="bg-orange-50 border-l-4 border-orange-600 p-6 rounded-lg">
                            <h3 className="font-bold text-orange-900 mb-4 text-lg">NGÀNH DỰ ĐỊNH HỌC</h3>
                            <Textarea 
                                value={intendedMajor}
                                onChange={(e) => setIntendedMajor(e.target.value)}
                                placeholder="Nhập ngành học bạn dự định theo đuổi..."
                                rows={3}
                            />
                        </div>
                    </TabsContent>

                    {/* Tab 3: Hồ sơ */}
                    <TabsContent value="profile" className="space-y-4 mt-6">
                        {/* Giải thưởng học thuật */}
                        <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6 rounded-lg">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-yellow-900 text-lg">GIẢI THƯỞNG HỌC THUẬT</h3>
                                <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => setAcademicAwards([...academicAwards, { award_name: '', issuing_organization: '', award_level: '', award_date: '', description: '', category: '', year: '', rank: '', region: '' }])}
                                >
                                    <Plus className="w-4 h-4 mr-1" />
                                    Thêm
                                </Button>
                            </div>
                            {academicAwards.map((award, index) => (
                                <div key={index} className="bg-white p-4 rounded-lg mb-3 border">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <Label className="text-sm">Tên giải thưởng</Label>
                                            <Input 
                                                value={award.award_name}
                                                onChange={(e) => {
                                                    const newAwards = [...academicAwards];
                                                    newAwards[index].award_name = e.target.value;
                                                    setAcademicAwards(newAwards);
                                                }}
                                                placeholder="VD: Học sinh giỏi Toán"
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-sm">Tổ chức trao</Label>
                                            <Input 
                                                value={award.issuing_organization}
                                                onChange={(e) => {
                                                    const newAwards = [...academicAwards];
                                                    newAwards[index].issuing_organization = e.target.value;
                                                    setAcademicAwards(newAwards);
                                                }}
                                                placeholder="VD: Sở GD&ĐT"
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-sm">Loại (Category)</Label>
                                            <Select 
                                                value={award.category}
                                                onValueChange={(value) => {
                                                    const newAwards = [...academicAwards];
                                                    newAwards[index].category = value;
                                                    setAcademicAwards(newAwards);
                                                }}
                                            >
                                                <SelectTrigger className="mt-1">
                                                    <SelectValue placeholder="Chọn" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="science">Khoa học/Logic</SelectItem>
                                                    <SelectItem value="social">Xã hội</SelectItem>
                                                    <SelectItem value="language">Ngôn ngữ</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label className="text-sm">Cấp giải (Region)</Label>
                                            <Select 
                                                value={award.region}
                                                onValueChange={(value) => {
                                                    const newAwards = [...academicAwards];
                                                    newAwards[index].region = value;
                                                    setAcademicAwards(newAwards);
                                                }}
                                            >
                                                <SelectTrigger className="mt-1">
                                                    <SelectValue placeholder="Chọn" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="international">Quốc tế</SelectItem>
                                                    <SelectItem value="national">Quốc gia</SelectItem>
                                                    <SelectItem value="province">Tỉnh/Thành</SelectItem>
                                                    <SelectItem value="city">Thành phố</SelectItem>
                                                    <SelectItem value="school">Trường</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label className="text-sm">Hạng (Rank)</Label>
                                            <Input 
                                                type="number"
                                                value={award.rank}
                                                onChange={(e) => {
                                                    const newAwards = [...academicAwards];
                                                    newAwards[index].rank = e.target.value;
                                                    setAcademicAwards(newAwards);
                                                }}
                                                placeholder="VD: 1, 2, 3"
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-sm">Năm</Label>
                                            <Input 
                                                type="number"
                                                value={award.year}
                                                onChange={(e) => {
                                                    const newAwards = [...academicAwards];
                                                    newAwards[index].year = e.target.value;
                                                    setAcademicAwards(newAwards);
                                                }}
                                                placeholder="2024"
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-sm">Cấp độ</Label>
                                            <Select 
                                                value={award.award_level}
                                                onValueChange={(value) => {
                                                    const newAwards = [...academicAwards];
                                                    newAwards[index].award_level = value;
                                                    setAcademicAwards(newAwards);
                                                }}
                                            >
                                                <SelectTrigger className="mt-1">
                                                    <SelectValue placeholder="Chọn" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Quốc tế">Quốc tế</SelectItem>
                                                    <SelectItem value="Quốc gia">Quốc gia</SelectItem>
                                                    <SelectItem value="Khu vực">Khu vực</SelectItem>
                                                    <SelectItem value="Tỉnh/Thành phố">Tỉnh/Thành phố</SelectItem>
                                                    <SelectItem value="Trường">Trường</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label className="text-sm">Ngày nhận</Label>
                                            <Input 
                                                type="date"
                                                value={award.award_date}
                                                onChange={(e) => {
                                                    const newAwards = [...academicAwards];
                                                    newAwards[index].award_date = e.target.value;
                                                    setAcademicAwards(newAwards);
                                                }}
                                                className="mt-1"
                                            />
                                        </div>
                                        <div className="col-span-2 flex gap-2">
                                            <div className="flex-1">
                                                <Label className="text-sm">Mô tả</Label>
                                                <Textarea 
                                                    value={award.description}
                                                    onChange={(e) => {
                                                        const newAwards = [...academicAwards];
                                                        newAwards[index].description = e.target.value;
                                                        setAcademicAwards(newAwards);
                                                    }}
                                                    placeholder="Mô tả chi tiết..."
                                                    className="mt-1"
                                                    rows={2}
                                                />
                                            </div>
                                            <Button 
                                                size="sm" 
                                                variant="ghost"
                                                onClick={() => setAcademicAwards(academicAwards.filter((_, i) => i !== index))}
                                                className="mt-6"
                                            >
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Các giải thưởng khác */}
                        <div className="bg-pink-50 border-l-4 border-pink-600 p-6 rounded-lg">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-pink-900 text-lg">CÁC GIẢI THƯỞNG KHÁC (Nghệ thuật, thể thao,...)</h3>
                                <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => setNonAcademicAwards([...nonAcademicAwards, { award_name: '', category: '', issuing_organization: '', award_level: '', award_date: '', description: '', year: '', rank: '', region: '' }])}
                                >
                                    <Plus className="w-4 h-4 mr-1" />
                                    Thêm
                                </Button>
                            </div>
                            {nonAcademicAwards.map((award, index) => (
                                <div key={index} className="bg-white p-4 rounded-lg mb-3 border">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <Label className="text-sm">Tên giải thưởng</Label>
                                            <Input 
                                                value={award.award_name}
                                                onChange={(e) => {
                                                    const newAwards = [...nonAcademicAwards];
                                                    newAwards[index].award_name = e.target.value;
                                                    setNonAcademicAwards(newAwards);
                                                }}
                                                placeholder="VD: Giải nhất bóng đá"
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-sm">Lĩnh vực</Label>
                                            <Select 
                                                value={award.category}
                                                onValueChange={(value) => {
                                                    const newAwards = [...nonAcademicAwards];
                                                    newAwards[index].category = value;
                                                    setNonAcademicAwards(newAwards);
                                                }}
                                            >
                                                <SelectTrigger className="mt-1">
                                                    <SelectValue placeholder="Chọn" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="sport">Thể thao</SelectItem>
                                                    <SelectItem value="art">Nghệ thuật / Âm nhạc</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label className="text-sm">Tổ chức trao</Label>
                                            <Input 
                                                value={award.issuing_organization}
                                                onChange={(e) => {
                                                    const newAwards = [...nonAcademicAwards];
                                                    newAwards[index].issuing_organization = e.target.value;
                                                    setNonAcademicAwards(newAwards);
                                                }}
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-sm">Ngày nhận</Label>
                                            <Input 
                                                type="date"
                                                value={award.award_date}
                                                onChange={(e) => {
                                                    const newAwards = [...nonAcademicAwards];
                                                    newAwards[index].award_date = e.target.value;
                                                    setNonAcademicAwards(newAwards);
                                                }}
                                                className="mt-1"
                                            />
                                        </div>
                                        <div className="col-span-2 flex gap-2">
                                            <div className="flex-1">
                                                <Label className="text-sm">Mô tả</Label>
                                                <Textarea 
                                                    value={award.description}
                                                    onChange={(e) => {
                                                        const newAwards = [...nonAcademicAwards];
                                                        newAwards[index].description = e.target.value;
                                                        setNonAcademicAwards(newAwards);
                                                    }}
                                                    className="mt-1"
                                                    rows={2}
                                                />
                                            </div>
                                            <Button 
                                                size="sm" 
                                                variant="ghost"
                                                onClick={() => setNonAcademicAwards(nonAcademicAwards.filter((_, i) => i !== index))}
                                                className="mt-6"
                                            >
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Hoạt động ngoại khóa liên quan đến ngành học */}
                        <div className="bg-indigo-50 border-l-4 border-indigo-600 p-6 rounded-lg">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-indigo-900 text-lg">HOẠT ĐỘNG NGOẠI KHÓA LIÊN QUAN ĐẾN NGÀNH HỌC</h3>
                                <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => setAcademicActivities([...academicActivities, { activity_name: '', organization: '', role: '', start_date: '', end_date: '', description: '', scale: '', region: '' }])}
                                >
                                    <Plus className="w-4 h-4 mr-1" />
                                    Thêm
                                </Button>
                            </div>
                            {academicActivities.map((activity, index) => (
                                <div key={index} className="bg-white p-4 rounded-lg mb-3 border">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <Label className="text-sm">Tên hoạt động</Label>
                                            <Input 
                                                value={activity.activity_name}
                                                onChange={(e) => {
                                                    const newActivities = [...academicActivities];
                                                    newActivities[index].activity_name = e.target.value;
                                                    setAcademicActivities(newActivities);
                                                }}
                                                placeholder="VD: CLB Toán học"
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-sm">Tổ chức</Label>
                                            <Input 
                                                value={activity.organization}
                                                onChange={(e) => {
                                                    const newActivities = [...academicActivities];
                                                    newActivities[index].organization = e.target.value;
                                                    setAcademicActivities(newActivities);
                                                }}
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-sm">Vai trò</Label>
                                            <Select 
                                                value={activity.role}
                                                onValueChange={(value) => {
                                                    const newActivities = [...academicActivities];
                                                    newActivities[index].role = value;
                                                    setAcademicActivities(newActivities);
                                                }}
                                            >
                                                <SelectTrigger className="mt-1">
                                                    <SelectValue placeholder="Chọn vai trò" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="LEADER">Trưởng nhóm / Chủ tịch</SelectItem>
                                                    <SelectItem value="CORE">Thành viên nòng cốt</SelectItem>
                                                    <SelectItem value="MEMBER">Thành viên</SelectItem>
                                                    <SelectItem value="HELP">Hỗ trợ</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <Label className="text-sm">Từ</Label>
                                                <Input 
                                                    type="date"
                                                    value={activity.start_date}
                                                    onChange={(e) => {
                                                        const newActivities = [...academicActivities];
                                                        newActivities[index].start_date = e.target.value;
                                                        setAcademicActivities(newActivities);
                                                    }}
                                                    className="mt-1"
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-sm">Đến</Label>
                                                <Input 
                                                    type="date"
                                                    value={activity.end_date}
                                                    onChange={(e) => {
                                                        const newActivities = [...academicActivities];
                                                        newActivities[index].end_date = e.target.value;
                                                        setAcademicActivities(newActivities);
                                                    }}
                                                    className="mt-1"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-span-2 flex gap-2">
                                            <div className="flex-1">
                                                <Label className="text-sm">Mô tả</Label>
                                                <Textarea 
                                                    value={activity.description}
                                                    onChange={(e) => {
                                                        const newActivities = [...academicActivities];
                                                        newActivities[index].description = e.target.value;
                                                        setAcademicActivities(newActivities);
                                                    }}
                                                    className="mt-1"
                                                    rows={2}
                                                />
                                            </div>
                                            <Button 
                                                size="sm" 
                                                variant="ghost"
                                                onClick={() => setAcademicActivities(academicActivities.filter((_, i) => i !== index))}
                                                className="mt-6"
                                            >
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Hoạt động ngoại khóa ngoài ngành học */}
                        <div className="bg-teal-50 border-l-4 border-teal-600 p-6 rounded-lg">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-teal-900 text-lg">HOẠT ĐỘNG NGOẠI KHÓA NGOÀI NGÀNH HỌC</h3>
                                <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => setNonAcademicActivities([...nonAcademicActivities, { activity_name: '', organization: '', role: '', start_date: '', end_date: '', description: '', scale: '', region: '' }])}
                                >
                                    <Plus className="w-4 h-4 mr-1" />
                                    Thêm
                                </Button>
                            </div>
                            {nonAcademicActivities.map((activity, index) => (
                                <div key={index} className="bg-white p-4 rounded-lg mb-3 border">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <Label className="text-sm">Tên hoạt động</Label>
                                            <Input 
                                                value={activity.activity_name}
                                                onChange={(e) => {
                                                    const newActivities = [...nonAcademicActivities];
                                                    newActivities[index].activity_name = e.target.value;
                                                    setNonAcademicActivities(newActivities);
                                                }}
                                                placeholder="VD: Thiện nguyện"
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-sm">Tổ chức</Label>
                                            <Input 
                                                value={activity.organization}
                                                onChange={(e) => {
                                                    const newActivities = [...nonAcademicActivities];
                                                    newActivities[index].organization = e.target.value;
                                                    setNonAcademicActivities(newActivities);
                                                }}
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-sm">Vai trò</Label>
                                            <Select 
                                                value={activity.role}
                                                onValueChange={(value) => {
                                                    const newActivities = [...nonAcademicActivities];
                                                    newActivities[index].role = value;
                                                    setNonAcademicActivities(newActivities);
                                                }}
                                            >
                                                <SelectTrigger className="mt-1">
                                                    <SelectValue placeholder="Chọn vai trò" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="LEADER">Trưởng nhóm / Chủ tịch</SelectItem>
                                                    <SelectItem value="CORE">Thành viên nòng cốt</SelectItem>
                                                    <SelectItem value="MEMBER">Thành viên</SelectItem>
                                                    <SelectItem value="HELP">Hỗ trợ</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <Label className="text-sm">Từ</Label>
                                                <Input 
                                                    type="date"
                                                    value={activity.start_date}
                                                    onChange={(e) => {
                                                        const newActivities = [...nonAcademicActivities];
                                                        newActivities[index].start_date = e.target.value;
                                                        setNonAcademicActivities(newActivities);
                                                    }}
                                                    className="mt-1"
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-sm">Đến</Label>
                                                <Input 
                                                    type="date"
                                                    value={activity.end_date}
                                                    onChange={(e) => {
                                                        const newActivities = [...nonAcademicActivities];
                                                        newActivities[index].end_date = e.target.value;
                                                        setNonAcademicActivities(newActivities);
                                                    }}
                                                    className="mt-1"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-span-2 flex gap-2">
                                            <div className="flex-1">
                                                <Label className="text-sm">Mô tả</Label>
                                                <Textarea 
                                                    value={activity.description}
                                                    onChange={(e) => {
                                                        const newActivities = [...nonAcademicActivities];
                                                        newActivities[index].description = e.target.value;
                                                        setNonAcademicActivities(newActivities);
                                                    }}
                                                    className="mt-1"
                                                    rows={2}
                                                />
                                            </div>
                                            <Button 
                                                size="sm" 
                                                variant="ghost"
                                                onClick={() => setNonAcademicActivities(nonAcademicActivities.filter((_, i) => i !== index))}
                                                className="mt-6"
                                            >
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Kinh nghiệm làm việc */}
                        <div className="bg-cyan-50 border-l-4 border-cyan-600 p-6 rounded-lg">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-cyan-900 text-lg">KINH NGHIỆM LÀM VIỆC</h3>
                                <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => setWorkExperiences([...workExperiences, { company_name: '', job_title: '', start_date: '', end_date: '', description: '' }])}
                                >
                                    <Plus className="w-4 h-4 mr-1" />
                                    Thêm
                                </Button>
                            </div>
                            {workExperiences.map((work, index) => (
                                <div key={index} className="bg-white p-4 rounded-lg mb-3 border">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <Label className="text-sm">Tên công ty</Label>
                                            <Input 
                                                value={work.company_name}
                                                onChange={(e) => {
                                                    const newWorks = [...workExperiences];
                                                    newWorks[index].company_name = e.target.value;
                                                    setWorkExperiences(newWorks);
                                                }}
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-sm">Vị trí</Label>
                                            <Input 
                                                value={work.job_title}
                                                onChange={(e) => {
                                                    const newWorks = [...workExperiences];
                                                    newWorks[index].job_title = e.target.value;
                                                    setWorkExperiences(newWorks);
                                                }}
                                                className="mt-1"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <Label className="text-sm">Từ</Label>
                                                <Input 
                                                    type="date"
                                                    value={work.start_date}
                                                    onChange={(e) => {
                                                        const newWorks = [...workExperiences];
                                                        newWorks[index].start_date = e.target.value;
                                                        setWorkExperiences(newWorks);
                                                    }}
                                                    className="mt-1"
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-sm">Đến</Label>
                                                <Input 
                                                    type="date"
                                                    value={work.end_date}
                                                    onChange={(e) => {
                                                        const newWorks = [...workExperiences];
                                                        newWorks[index].end_date = e.target.value;
                                                        setWorkExperiences(newWorks);
                                                    }}
                                                    className="mt-1"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-span-2 flex gap-2">
                                            <div className="flex-1">
                                                <Label className="text-sm">Mô tả công việc</Label>
                                                <Textarea 
                                                    value={work.description}
                                                    onChange={(e) => {
                                                        const newWorks = [...workExperiences];
                                                        newWorks[index].description = e.target.value;
                                                        setWorkExperiences(newWorks);
                                                    }}
                                                    className="mt-1"
                                                    rows={2}
                                                />
                                            </div>
                                            <Button 
                                                size="sm" 
                                                variant="ghost"
                                                onClick={() => setWorkExperiences(workExperiences.filter((_, i) => i !== index))}
                                                className="mt-6"
                                            >
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Kinh nghiệm nghiên cứu */}
                        <div className="bg-violet-50 border-l-4 border-violet-600 p-6 rounded-lg">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-violet-900 text-lg">KINH NGHIỆM NGHIÊN CỨU</h3>
                                <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => setResearchExperiences([...researchExperiences, { project_title: '', institution: '', role: '', start_date: '', end_date: '', description: '' }])}
                                >
                                    <Plus className="w-4 h-4 mr-1" />
                                    Thêm
                                </Button>
                            </div>
                            {researchExperiences.map((research, index) => (
                                <div key={index} className="bg-white p-4 rounded-lg mb-3 border">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <Label className="text-sm">Tên đề tài</Label>
                                            <Input 
                                                value={research.project_title}
                                                onChange={(e) => {
                                                    const newResearches = [...researchExperiences];
                                                    newResearches[index].project_title = e.target.value;
                                                    setResearchExperiences(newResearches);
                                                }}
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-sm">Cơ quan/Trường</Label>
                                            <Input 
                                                value={research.institution}
                                                onChange={(e) => {
                                                    const newResearches = [...researchExperiences];
                                                    newResearches[index].institution = e.target.value;
                                                    setResearchExperiences(newResearches);
                                                }}
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-sm">Vai trò</Label>
                                            <Input 
                                                value={research.role}
                                                onChange={(e) => {
                                                    const newResearches = [...researchExperiences];
                                                    newResearches[index].role = e.target.value;
                                                    setResearchExperiences(newResearches);
                                                }}
                                                placeholder="VD: Trưởng nhóm"
                                                className="mt-1"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <Label className="text-sm">Từ</Label>
                                                <Input 
                                                    type="date"
                                                    value={research.start_date}
                                                    onChange={(e) => {
                                                        const newResearches = [...researchExperiences];
                                                        newResearches[index].start_date = e.target.value;
                                                        setResearchExperiences(newResearches);
                                                    }}
                                                    className="mt-1"
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-sm">Đến</Label>
                                                <Input 
                                                    type="date"
                                                    value={research.end_date}
                                                    onChange={(e) => {
                                                        const newResearches = [...researchExperiences];
                                                        newResearches[index].end_date = e.target.value;
                                                        setResearchExperiences(newResearches);
                                                    }}
                                                    className="mt-1"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-span-2 flex gap-2">
                                            <div className="flex-1">
                                                <Label className="text-sm">Mô tả nghiên cứu</Label>
                                                <Textarea 
                                                    value={research.description}
                                                    onChange={(e) => {
                                                        const newResearches = [...researchExperiences];
                                                        newResearches[index].description = e.target.value;
                                                        setResearchExperiences(newResearches);
                                                    }}
                                                    className="mt-1"
                                                    rows={2}
                                                />
                                            </div>
                                            <Button 
                                                size="sm" 
                                                variant="ghost"
                                                onClick={() => setResearchExperiences(researchExperiences.filter((_, i) => i !== index))}
                                                className="mt-6"
                                            >
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* NEW: Dự án cá nhân */}
                        <div className="bg-cyan-50 border-l-4 border-cyan-600 p-6 rounded-lg">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-cyan-900 text-lg">DỰ ÁN CÁ NHÂN (Personal Projects)</h3>
                                <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => setPersonalProjects([...personalProjects, { project_name: '', topic: '', description: '', duration_months: '', impact: '' }])}
                                >
                                    <Plus className="w-4 h-4 mr-1" />
                                    Thêm
                                </Button>
                            </div>
                            {personalProjects.map((project, index) => (
                                <div key={index} className="bg-white p-4 rounded-lg mb-3 border">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <Label className="text-sm">Tên dự án</Label>
                                            <Input 
                                                value={project.project_name}
                                                onChange={(e) => {
                                                    const newProjects = [...personalProjects];
                                                    newProjects[index].project_name = e.target.value;
                                                    setPersonalProjects(newProjects);
                                                }}
                                                placeholder="VD: Ứng dụng quản lý thư viện"
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-sm">Chủ đề</Label>
                                            <Select 
                                                value={project.topic}
                                                onValueChange={(value) => {
                                                    const newProjects = [...personalProjects];
                                                    newProjects[index].topic = value;
                                                    setPersonalProjects(newProjects);
                                                }}
                                            >
                                                <SelectTrigger className="mt-1">
                                                    <SelectValue placeholder="Chọn" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Science/Tech">Science/Tech</SelectItem>
                                                    <SelectItem value="Research">Research</SelectItem>
                                                    <SelectItem value="Culture/Business">Culture/Business</SelectItem>
                                                    <SelectItem value="Art">Art</SelectItem>
                                                    <SelectItem value="Social">Social</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label className="text-sm">Thời gian (tháng)</Label>
                                            <Input 
                                                type="number"
                                                value={project.duration_months}
                                                onChange={(e) => {
                                                    const newProjects = [...personalProjects];
                                                    newProjects[index].duration_months = e.target.value;
                                                    setPersonalProjects(newProjects);
                                                }}
                                                placeholder="VD: 6"
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-sm">Tác động / Impact</Label>
                                            <Input 
                                                value={project.impact}
                                                onChange={(e) => {
                                                    const newProjects = [...personalProjects];
                                                    newProjects[index].impact = e.target.value;
                                                    setPersonalProjects(newProjects);
                                                }}
                                                placeholder="VD: 500+ users"
                                                className="mt-1"
                                            />
                                        </div>
                                        <div className="col-span-2 flex gap-2">
                                            <div className="flex-1">
                                                <Label className="text-sm">Mô tả</Label>
                                                <Textarea 
                                                    value={project.description}
                                                    onChange={(e) => {
                                                        const newProjects = [...personalProjects];
                                                        newProjects[index].description = e.target.value;
                                                        setPersonalProjects(newProjects);
                                                    }}
                                                    placeholder="Mô tả chi tiết về dự án..."
                                                    className="mt-1"
                                                    rows={2}
                                                />
                                            </div>
                                            <Button 
                                                size="sm" 
                                                variant="ghost"
                                                onClick={() => setPersonalProjects(personalProjects.filter((_, i) => i !== index))}
                                                className="mt-6"
                                            >
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* NEW: Kỹ năng */}
                        <div className="bg-lime-50 border-l-4 border-lime-600 p-6 rounded-lg">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-lime-900 text-lg">KỸ NĂNG (Skills)</h3>
                                <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => setSkills([...skills, { skill_name: '', proficiency: '', category: '' }])}
                                >
                                    <Plus className="w-4 h-4 mr-1" />
                                    Thêm
                                </Button>
                            </div>
                            {skills.map((skill, index) => (
                                <div key={index} className="grid grid-cols-4 gap-3 mb-3 items-end">
                                    <div>
                                        <Label className="text-sm">Tên kỹ năng</Label>
                                        <Input 
                                            value={skill.skill_name}
                                            onChange={(e) => {
                                                const newSkills = [...skills];
                                                newSkills[index].skill_name = e.target.value;
                                                setSkills(newSkills);
                                            }}
                                            placeholder="VD: Python Programming"
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-sm">Trình độ</Label>
                                        <Select 
                                            value={skill.proficiency}
                                            onValueChange={(value) => {
                                                const newSkills = [...skills];
                                                newSkills[index].proficiency = value;
                                                setSkills(newSkills);
                                            }}
                                        >
                                            <SelectTrigger className="mt-1">
                                                <SelectValue placeholder="Chọn" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="BEGINNER">Sơ cấp</SelectItem>
                                                <SelectItem value="INTERMEDIATE">Trung cấp</SelectItem>
                                                <SelectItem value="ADVANCED">Cao cấp</SelectItem>
                                                <SelectItem value="EXPERT">Chuyên gia</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label className="text-sm">Loại kỹ năng</Label>
                                        <Select 
                                            value={skill.category}
                                            onValueChange={(value) => {
                                                const newSkills = [...skills];
                                                newSkills[index].category = value;
                                                setSkills(newSkills);
                                            }}
                                        >
                                            <SelectTrigger className="mt-1">
                                                <SelectValue placeholder="Chọn" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Hard">Kỹ năng cứng (Hard)</SelectItem>
                                                <SelectItem value="Soft">Kỹ năng mềm (Soft)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Button 
                                        size="sm" 
                                        variant="ghost"
                                        onClick={() => setSkills(skills.filter((_, i) => i !== index))}
                                    >
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                    </Button>
                                </div>
                            ))}
                        </div>

                        {/* Mục tiêu */}
                        <div className="bg-gray-50 border-l-4 border-gray-600 p-6 rounded-lg">
                            <h3 className="font-bold text-gray-900 mb-4 text-lg">THÔNG TIN KHÁC</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm">Quốc gia dự định du học</Label>
                                    <Input 
                                        value={studentGoals.target_country}
                                        onChange={(e) => setStudentGoals({...studentGoals, target_country: e.target.value})}
                                        placeholder="VD: Hoa Kỳ, Anh, Úc..."
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label className="text-sm">Ngân sách gia đình trong vòng 1 năm</Label>
                                    <Input 
                                        value={studentGoals.yearly_budget}
                                        onChange={(e) => setStudentGoals({...studentGoals, yearly_budget: e.target.value})}
                                        placeholder="VD: 30,000 USD"
                                        className="mt-1"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <Label className="text-sm">Mong muốn cá nhân</Label>
                                    <Textarea 
                                        value={studentGoals.personal_desire}
                                        onChange={(e) => setStudentGoals({...studentGoals, personal_desire: e.target.value})}
                                        placeholder="Mô tả mong muốn và mục tiêu cá nhân..."
                                        className="mt-1"
                                        rows={3}
                                    />
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Tab 4: Phụ huynh */}
                    <TabsContent value="parents" className="space-y-4 mt-6">
                        <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-blue-900 text-lg">THÔNG TIN LIÊN LẠC CỦA PHỤ HUYNH/NGƯỜI GIÁM HỘ</h3>
                                <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => setParentsInfo([...parentsInfo, { full_name: '', relationship: '', phone_number: '', email: '' }])}
                                >
                                    <Plus className="w-4 h-4 mr-1" />
                                    Thêm
                                </Button>
                            </div>
                            {parentsInfo.map((parent, index) => (
                                <div key={index} className="bg-white p-6 rounded-lg mb-4 border">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-sm font-medium">Họ và tên phụ huynh/người giám hộ</Label>
                                            <Input 
                                                value={parent.full_name}
                                                onChange={(e) => {
                                                    const newParents = [...parentsInfo];
                                                    newParents[index].full_name = e.target.value;
                                                    setParentsInfo(newParents);
                                                }}
                                                placeholder="Nhập họ tên đầy đủ"
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium">Mối quan hệ với học viên</Label>
                                            <Select 
                                                value={parent.relationship}
                                                onValueChange={(value) => {
                                                    const newParents = [...parentsInfo];
                                                    newParents[index].relationship = value;
                                                    setParentsInfo(newParents);
                                                }}
                                            >
                                                <SelectTrigger className="mt-1">
                                                    <SelectValue placeholder="Chọn" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Bố">Bố</SelectItem>
                                                    <SelectItem value="Mẹ">Mẹ</SelectItem>
                                                    <SelectItem value="Người giám hộ">Người giám hộ</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium">Số điện thoại của phụ huynh/người giám hộ</Label>
                                            <Input 
                                                value={parent.phone_number}
                                                onChange={(e) => {
                                                    const newParents = [...parentsInfo];
                                                    newParents[index].phone_number = e.target.value;
                                                    setParentsInfo(newParents);
                                                }}
                                                placeholder="0XXXXXXXXX"
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium">Email của phụ huynh/người giám hộ</Label>
                                            <div className="flex gap-2 mt-1">
                                                <Input 
                                                    type="email"
                                                    value={parent.email}
                                                    onChange={(e) => {
                                                        const newParents = [...parentsInfo];
                                                        newParents[index].email = e.target.value;
                                                        setParentsInfo(newParents);
                                                    }}
                                                    placeholder="email@example.com"
                                                />
                                                <Button 
                                                    size="sm" 
                                                    variant="ghost"
                                                    onClick={() => setParentsInfo(parentsInfo.filter((_, i) => i !== index))}
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                    <Button variant="outline" onClick={onClose} disabled={saving}>
                        Hủy
                    </Button>
                    <Button onClick={handleSaveAll} disabled={saving}>
                        {saving ? (
                            <>
                                <span className="animate-spin mr-2">⏳</span>
                                Đang lưu...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Lưu tất cả
                            </>
                        )}
                    </Button>
                </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
