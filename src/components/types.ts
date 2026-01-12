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
        leadership: number;
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
    linkTo?: string;           // Link to navigate when task is clicked (for test tasks)
}

export interface Stage {
    id: number;
    name: string;
    description: string;
    isUnlocked: boolean;
}

export type TestType = 'MBTI' | 'GRIT' | 'RIASEC';

export type MBTIDimension = 'E/I' | 'S/N' | 'T/F' | 'J/P';
export type GritComponent = 'passion' | 'perseverance';

// Legacy interface for backward compatibility
export interface Question {
    id: number;
    text: string;
    type: TestType;

    // For MBTI
    optionA?: string;
    optionB?: string;
    dimension?: string | MBTIDimension;
    positiveDirection?: boolean;

    // For RIASEC
    category?: string;

    // For GRIT
    component?: GritComponent;
    reverse?: boolean;
}

export interface TestQuestion {
    id: string;
    question: string;
    reverse?: boolean; // true = reverse score (6 - answer)


// Specific test question types with id field
    // For MBTI (Legacy - A/B options)
export interface MBTIQuestion {
    id: number;
    type: TestType;
    text: string;
    dimension: MBTIDimension;
    positiveDirection: boolean;
}

export interface RIASECQuestion {
}

export interface GritQuestion {
    id: number;
    text: string;
    component: GritComponent;
}

// Test Result interface
export interface TestResult {
    type: TestType;
    scores: Record<string, number>;
    rawLabel: string;
    description: string;
}

// Major Recommendation interface
export interface MajorRecommendation {
    name: string;
    category: string;
    matchReason: string;
    careerPaths: string[];
    requiredSkills: string[];
    matchPercentage?: number;
}