import {Question, StudentProfile, TestType} from '@/components/types';

// Import questions từ các file riêng
import {RIASEC_QUESTIONS_V2} from '@/data/riasec-questions';
import {GRIT_QUESTIONS_SORTED} from '@/data/grit-questions';
import {MBTI_QUESTIONS_SORTED} from '@/data/mbti-questions';

// Mock Student Profile based on the screenshot
export const STUDENT_PROFILE: StudentProfile = {
    id: "HS001",
    name: "Nguyễn Văn A",
    email: "a.nguyen@example.com",
    phone: "0123456789",
    address: "Hà Nội, Việt Nam",
    dob: "2005-01-15",
    avatarUrl: "https://picsum.photos/200/200",
    gpa: 3.8,
    gpaScale: 4.0,
    englishLevel: "IELTS 7.5",
    targetMajor: "Computer Science",
    targetCountry: "USA",
    extracurriculars: [
        {
            id: "1",
            title: "Chủ tịch Câu lạc bộ Lập trình",
            role: "Chủ tịch",
            year: "2024",
            description: "Quản lý 50+ thành viên, tổ chức workshop và hackathon"
        }
    ],
    achievements: ["Huy chương Vàng Toán học Quốc tế", "Giải Nhất Hackathon 2024"],
    documents: []
};

// ============================================
// MAIN QUESTIONS - Dùng cho production
// ============================================

// RIASEC questions - 48 câu Có/Không tiếng Việt
export const RIASEC_QUESTIONS: Question[] = RIASEC_QUESTIONS_V2;

// GRIT questions - 12 câu Likert Scale đầy đủ
export const GRIT_QUESTIONS: Question[] = GRIT_QUESTIONS_SORTED;

// MBTI questions - 60 câu Likert Scale
export const MBTI_QUESTIONS: Question[] = MBTI_QUESTIONS_SORTED;

// ============================================
// LEGACY QUESTIONS - Giữ lại cho tham khảo
// ============================================

// Extracted from PDF - RIASEC (Holland Code) - Legacy
export const RIASEC_QUESTIONS_LEGACY: Question[] = [
    {id: 1, type: 'RIASEC', text: "Test the quality of parts before shipment", category: 'R'},
    {id: 2, type: 'RIASEC', text: "Lay brick or tile", category: 'R'},
    {id: 3, type: 'RIASEC', text: "Work on an offshore oil-drilling rig", category: 'R'},
    {id: 10, type: 'RIASEC', text: "Study animal behavior", category: 'I'},
    {id: 11, type: 'RIASEC', text: "Do research on plants or animals", category: 'I'},
    {id: 13, type: 'RIASEC', text: "Conduct biological research", category: 'I'},
    {id: 19, type: 'RIASEC', text: "Design artwork for magazines", category: 'A'},
    {id: 20, type: 'RIASEC', text: "Write a song", category: 'A'},
    {id: 21, type: 'RIASEC', text: "Write books or plays", category: 'A'},
    {id: 29, type: 'RIASEC', text: "Help people with family-related problems", category: 'S'},
    {id: 31, type: 'RIASEC', text: "Teach children how to read", category: 'S'},
    {id: 33, type: 'RIASEC', text: "Sell restaurant franchises to individuals", category: 'E'},
    {id: 39, type: 'RIASEC', text: "Sell houses", category: 'E'},
    {id: 41, type: 'RIASEC', text: "Generate the monthly payroll checks for an office", category: 'C'},
    {id: 44, type: 'RIASEC', text: "Maintain employee records", category: 'C'},
];

// Extracted from PDF - Grit Scale - Legacy (7 câu)
export const GRIT_QUESTIONS_LEGACY: Question[] = [
    {
        id: 101,
        type: 'GRIT',
        text: "Tôi thường hoàn thành những gì mình đã bắt đầu.",
        reverseScore: false
    },
    {
        id: 102,
        type: 'GRIT',
        text: "Đôi khi các ý tưởng và dự án mới khiến tôi xao lãng và không còn chú ý đến những ý tưởng trước đó.",
        reverseScore: true
    },
    {id: 103, type: 'GRIT', text: "Những điều tôi quan tâm thay đổi qua từng năm.", reverseScore: true},
    {id: 104, type: 'GRIT', text: "Tôi không nản lòng trước những khó khăn.", reverseScore: false},
    {
        id: 105,
        type: 'GRIT',
        text: "Tôi bị cuốn hút bởi một ý tưởng hoặc dự án nào đó trong một thời gian ngắn, rồi tôi lại dần mất đi hứng thú.",
        reverseScore: true
    },
    {id: 106, type: 'GRIT', text: "Tôi là người chăm chỉ.", reverseScore: false},
    {
        id: 107,
        type: 'GRIT',
        text: "Tôi thường lập mục tiêu này nhưng rồi lại chọn theo đuổi mục tiêu khác.",
        reverseScore: true
    },
];

// Extracted from PDF - MBTI (Simplified for Demo) - Legacy
export const MBTI_QUESTIONS_LEGACY: Question[] = [
    {
        id: 201,
        type: 'MBTI',
        dimension: 'EI',
        text: "Bạn thích:",
        optionA: "Gặp gỡ nhiều người mới",
        optionB: "Ở nhà hoặc gặp gỡ với bạn thân"
    },
    {
        id: 202,
        type: 'MBTI',
        dimension: 'EI',
        text: "Trong các cuộc giao tiếp, bạn là người:",
        optionA: "Bắt đầu cho cuộc nói chuyện.",
        optionB: "Chỉ nói khi người khác bắt chuyện."
    },
    {
        id: 203,
        type: 'MBTI',
        dimension: 'TF',
        text: "Bạn đánh giá sự việc dựa trên:",
        optionA: "Ý nghĩa, giá trị",
        optionB: "Tính logic"
    },
    {
        id: 204,
        type: 'MBTI',
        dimension: 'JP',
        text: "Bạn là người có tác phong:",
        optionA: "Thong thả, thoải mái",
        optionB: "Nhanh nhẹn, đúng giờ"
    },
    {
        id: 205,
        type: 'MBTI',
        dimension: 'SN',
        text: "Bạn thích các sự việc xảy ra:",
        optionA: "Có chọn lựa và suy tính",
        optionB: "Một cách tự nhiên"
    },
    {
        id: 206,
        type: 'MBTI',
        dimension: 'TF',
        text: "Bạn là người thế nào:",
        optionA: "Là người có cái đầu lạnh",
        optionB: "Là người có trái tim ấm"
    }
];

// ============================================
// TEST DESCRIPTIONS
// ============================================

export const TEST_DESCRIPTIONS = {
    MBTI: {
        title: "MBTI (Myers-Briggs)",
        desc: "Khám phá 16 nhóm tính cách để hiểu rõ điểm mạnh, điểm yếu và môi trường làm việc phù hợp.",
        color: "bg-blue-500"
    },
    RIASEC: {
        title: "Sở thích nghề nghiệp (Holland)",
        desc: "Xác định nhóm ngành nghề phù hợp dựa trên 6 nhóm sở thích: Thực tế, Nghiên cứu, Nghệ thuật, Xã hội, Quản lý, Nghiệp vụ.",
        color: "bg-emerald-500"
    },
    GRIT: {
        title: "Đánh giá nghị lực (GRIT)",
        desc: "Đo lường sự kiên trì và đam mê với mục tiêu dài hạn của bạn.",
        color: "bg-purple-500"
    }
};

