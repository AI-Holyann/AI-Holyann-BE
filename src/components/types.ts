export type DocumentType = 'transcript' | 'certificate' | 'letter' | 'essay' | 'other';

export interface Extracurricular {
    id: string;
    title: string;
    role: string;
    year: string;
    description: string;
}

export interface Document {
    id: string;
    name: string;
    type: DocumentType;
    uploadDate: string;
    size: string;
}

export interface StudentProfile {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    dob: string;
    avatarUrl: string;
    gpa: number;
    gpaScale: number;
    englishLevel: string;
    satScore?: number;
    targetMajor: string;
    targetCountry: string;
    extracurriculars: Extracurricular[];
    achievements: string[];
    documents: Document[];
}

export interface SwotItem {
    id: string;
    text: string;
    category: 'strength' | 'weakness' | 'opportunity' | 'threat';
}

export interface StrategyItem {
    title: string;
    description: string;
}

export interface SwotData {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
    strategicAdvice: StrategyItem[];
    scores: {
        academic: number;
        extracurricular: number;
        skills: number;
        language: number;
    }
}

export interface Task {
    id: string;
    title: string;
    deadline: string;
    isCompleted: boolean;
    category?: string; // e.g., "Hồ sơ học thuật", "Tài liệu cần thiết"
    stageId: number;

    // New fields for file upload feature
    requiresFile?: boolean;    // Does this task require a file upload?
    uploadedFile?: string;     // Name of the uploaded file (if any)
    feedback?: string;         // Mentor feedback
}

export interface Stage {
    id: number;
    name: string;
    description: string;
    isUnlocked: boolean;
}

export type TestType = 'MBTI' | 'GRIT' | 'RIASEC';

export interface Question {
    id: number;
    text: string;
    type: TestType;
    // For MBTI
    optionA?: string;
    optionB?: string;
    dimension?: string; // E.g., 'EI', 'SN', 'TF', 'JP'

    // For RIASEC
    category?: string; // R, I, A, S, E, C

    // For Grit
    reverseScore?: boolean; // Some Grit questions are reverse coded
}


export interface TestResult {
    type: TestType;
    scores: Record<string, number>; // e.g. { 'R': 15, 'I': 20 } or { 'Grit': 4.5 }
    rawLabel?: string; // e.g., "ENTJ" or "High Grit"
    description?: string;
}

export interface MajorRecommendation {
    name: string; // Tên ngành học
    category: string; // Phân loại: STEM, Arts, Business, etc.
    matchReason: string; // Lý do phù hợp với tính cách
    careerPaths: string[]; // Các con đường sự nghiệp
    requiredSkills: string[]; // Kỹ năng cần thiết
    matchPercentage: number; // Độ phù hợp (0-100)
}

