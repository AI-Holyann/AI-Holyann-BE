// src/lib/data.ts
import {Users, ShieldCheck, Lightbulb, Infinity as InfinityIcon} from 'lucide-react';

export type DocumentType = 'transcript' | 'certificate' | 'letter' | 'essay' | 'other';

export const BRAND_COLORS = {
    primaryGradient: "bg-gradient-to-r from-[var(--brand-cyan)] to-[var(--brand-blue)]",
    textGradient: "bg-clip-text text-transparent bg-gradient-to-r from-[var(--brand-cyan)] to-[var(--brand-blue)]",
    accent: "bg-[var(--accent-alt)]",
};

export const NAV_LINKS = [
    {name: "Giới Thiệu", href: "#gioi-thieu"},
    {name: "Điểm Nổi Bật", href: "#diem-noi-bat"},
    {name: "Thành Tích", href: "#thanh-tich"},
    {name: "Dịch Vụ", href: "#dich-vu"},
    {name: "Trải Nghiệm", href: "#trai-nghiem"},
];

export const CORE_VALUES = [
    {
        icon: Users,
        title: "Nhân - Con Người",
        desc: "Tôn trọng sự khác biệt, nuôi dưỡng sự bản lĩnh, chính trực và đồng hành để mỗi cá nhân phát triển thành phiên bản sâu sắc nhất.",
    },
    {
        icon: ShieldCheck,
        title: "Đức - Trách Nhiệm",
        desc: "Giữ vững tinh thần đạo đức trong mọi quyết định, lấy lợi ích lâu dài của học viên làm trung tâm.",
    },
    {
        icon: Lightbulb,
        title: "Tạo - Sáng Tạo",
        desc: "Khuyến khích tư duy sáng tạo, dám thử nghiệm và luôn không ngừng cải tiến để phù hợp với tiềm năng đặc thù.",
    },
    {
        icon: InfinityIcon,
        title: "Bền - Bền Vững",
        desc: "Cùng nhau kiến tạo những giá trị bền vững cho tổ chức và cộng đồng.",
    },
];

export const HIGHLIGHTS = [
    {
        title: "Sự Sát Sao - Đồng Hành",
        desc: "Kết nối 3 chiều Học viên - Phụ huynh - Cố vấn. Không để học viên 'đi một mình' trong bất kỳ bước nào.",
    },
    {
        title: "Hỗ Trợ Toàn Diện 360",
        desc: "Hỗ trợ từ học thuật, kỹ năng, tư duy, hồ sơ đến tâm lý. Giải đáp mọi vấn đề trước - trong - sau du học.",
    },
    {
        title: "Mô Hình Nhiều Cố Vấn",
        desc: "Mỗi học viên được hướng dẫn bởi nhiều Cố vấn chuyên môn để nhận được góc nhìn đa chiều và tối ưu hóa hành trình.",
    },
    {
        title: "Đội Ngũ Năng Động",
        desc: "Giàu kinh nghiệm săn học bổng TOP đầu thế giới. Đề cao tư duy đổi mới và sẵn sàng 'cháy' hết mình vì học viên.",
    },
];

export const TESTIMONIALS = [
    {
        name: "Nguyễn Hoàng Phương Thảo",
        school: "Đại học USF, Hoa Kỳ",
        quote: "Chị dẫn em đi từng bước một, từ sửa idea, đến chau chuốt câu từ... Câu chuyện và trải nghiệm của em vẫn được thể hiện một cách chân thật nhất qua bài luận.",
        img: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=200&h=200&auto=format&fit=crop",
    },
    {
        name: "Hồ Minh Quang",
        school: "Purdue Fort Wayne, Hoa Kỳ",
        quote: "Chính các chị đã giúp mình vực dậy niềm tin vào bản thân và dám 'cháy' hết mình để theo đuổi đam mê. Em xin cảm ơn các chị nhiều ạ.",
        img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&h=200&auto=format&fit=crop",
    },
    {
        name: "Nguyễn Đức Mạnh",
        school: "Đại học PolyU, HongKong",
        quote: "Thật sự em đã rất bất ngờ về sự hỗ trợ rất nhiệt tình... Cảm ơn chị vì nhiều đêm sửa luận tới gần sáng do lệch múi giờ.",
        img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&h=200&auto=format&fit=crop",
    },
    {
        name: "Đỗ Ngọc Bảo Anh",
        school: "Đại học Yonsei, Hàn Quốc",
        quote: "Cố vấn Holyann nhiệt tình, tận tâm, chu đáo. Bài giảng cũng chất lượng, đi đúng từng phần, đúng trọng tâm.",
        img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&h=200&auto=format&fit=crop",
    }
];


export interface Document {
    id: string;
    name: string;
    type: DocumentType;
    uploadDate: string;
    size: string;
    url: string;
}

export interface StudentProfile {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatarUrl: string;
    address: string;
    dob: string;

    // Academic Info
    gpa: number;
    gpaScale: number;
    englishLevel: string; // e.g., "IELTS 7.5"
    satScore?: number;

    // Lists
    extracurriculars: Activity[];
    achievements: string[];
    documents: Document[];

    // Target
    targetMajor: string;
    targetCountry: string;
}

export interface Activity {
    id: string;
    title: string;
    role: string;
    year: string;
    description: string;
}
