// filepath: d:\holyann-ai-web\src\data\riasec-questions.ts
import {Question} from '@/components/types';

/**
 * Bộ câu hỏi RIASEC (Holland Codes) - Trắc nghiệm Xu hướng Nghề nghiệp
 * Phiên bản: 1.0
 * Tổng số câu hỏi: 48
 * Loại câu trả lời: Có/Không (boolean)
 *
 * 6 nhóm nghề nghiệp (Holland Codes):
 * - R (Realistic): Thực tế - 8 câu
 * - I (Investigative): Nghiên cứu - 8 câu
 * - A (Artistic): Nghệ thuật - 8 câu
 * - S (Social): Xã hội - 8 câu
 * - E (Enterprising): Kinh doanh - 8 câu
 * - C (Conventional): Hành chính - 8 câu
 */

export type RIASECCategory = 'R' | 'I' | 'A' | 'S' | 'E' | 'C';

export interface RIASECQuestion extends Question {
    category: RIASECCategory;
}

export interface RIASECCategoryInfo {
    name: string;
    name_vi: string;
    description: string;
    color: string;
    careers: string[];
}

export const RIASEC_CATEGORIES: Record<RIASECCategory, RIASECCategoryInfo> = {
    'R': {
        name: 'Realistic',
        name_vi: 'Thực tế',
        description: 'Thích làm việc với đồ vật, máy móc, công cụ',
        color: 'bg-orange-500',
        careers: ['Kỹ sư cơ khí', 'Thợ điện', 'Kiến trúc sư', 'Phi công', 'Nông nghiệp', 'Xây dựng']
    },
    'I': {
        name: 'Investigative',
        name_vi: 'Nghiên cứu',
        description: 'Thích phân tích, nghiên cứu, giải quyết vấn đề',
        color: 'bg-blue-500',
        careers: ['Nhà khoa học', 'Bác sĩ', 'Lập trình viên', 'Nhà nghiên cứu', 'Dược sĩ', 'Kỹ sư phần mềm']
    },
    'A': {
        name: 'Artistic',
        name_vi: 'Nghệ thuật',
        description: 'Thích sáng tạo, thiết kế, biểu diễn',
        color: 'bg-purple-500',
        careers: ['Họa sĩ', 'Nhạc sĩ', 'Nhà thiết kế', 'Đạo diễn', 'Nhà văn', 'Nhiếp ảnh gia']
    },
    'S': {
        name: 'Social',
        name_vi: 'Xã hội',
        description: 'Thích giúp đỡ, giảng dạy, hỗ trợ người khác',
        color: 'bg-green-500',
        careers: ['Giáo viên', 'Y tá', 'Nhân viên xã hội', 'Tư vấn viên', 'HR', 'Bác sĩ tâm lý']
    },
    'E': {
        name: 'Enterprising',
        name_vi: 'Kinh doanh',
        description: 'Thích thuyết phục, lãnh đạo, bán hàng',
        color: 'bg-red-500',
        careers: ['Doanh nhân', 'Quản lý', 'Luật sư', 'Marketing', 'Sales', 'Chính trị gia']
    },
    'C': {
        name: 'Conventional',
        name_vi: 'Hành chính',
        description: 'Thích tổ chức, quản lý dữ liệu, làm theo quy trình',
        color: 'bg-yellow-500',
        careers: ['Kế toán', 'Thư ký', 'Ngân hàng', 'Hành chính', 'Kiểm toán', 'Phân tích dữ liệu']
    }
};

export const RIASEC_QUESTIONS_V2: RIASECQuestion[] = [
    // === R (Realistic) - Thực tế - 8 câu ===
    {id: 1, type: 'RIASEC', text: "Kiểm tra chất lượng các bộ phận trước khi giao hàng", category: 'R'},
    {id: 2, type: 'RIASEC', text: "Xây gạch hoặc lát gạch", category: 'R'},
    {id: 3, type: 'RIASEC', text: "Làm việc trên giàn khoan dầu ngoài khơi", category: 'R'},
    {id: 4, type: 'RIASEC', text: "Lắp ráp các linh kiện điện tử", category: 'R'},
    {id: 5, type: 'RIASEC', text: "Vận hành máy mài trong nhà máy", category: 'R'},
    {id: 6, type: 'RIASEC', text: "Sửa một vòi nước bị hỏng", category: 'R'},
    {id: 7, type: 'RIASEC', text: "Lắp ráp sản phẩm trong nhà máy", category: 'R'},
    {id: 8, type: 'RIASEC', text: "Lắp đặt sàn trong nhà ở", category: 'R'},

    // === I (Investigative) - Nghiên cứu - 8 câu ===
    {id: 9, type: 'RIASEC', text: "Nghiên cứu cấu trúc cơ thể con người", category: 'I'},
    {id: 10, type: 'RIASEC', text: "Nghiên cứu hành vi của động vật", category: 'I'},
    {id: 11, type: 'RIASEC', text: "Thực hiện nghiên cứu về thực vật hoặc động vật", category: 'I'},
    {id: 12, type: 'RIASEC', text: "Phát triển một phương pháp hoặc quy trình điều trị y tế mới", category: 'I'},
    {id: 13, type: 'RIASEC', text: "Tiến hành nghiên cứu sinh học", category: 'I'},
    {id: 14, type: 'RIASEC', text: "Nghiên cứu cá voi và các loài sinh vật biển khác", category: 'I'},
    {id: 15, type: 'RIASEC', text: "Làm việc trong phòng thí nghiệm sinh học", category: 'I'},
    {id: 16, type: 'RIASEC', text: "Lập bản đồ đáy đại dương", category: 'I'},

    // === A (Artistic) - Nghệ thuật - 8 câu ===
    {id: 17, type: 'RIASEC', text: "Chỉ huy hoặc dẫn dắt một dàn hợp xướng", category: 'A'},
    {id: 18, type: 'RIASEC', text: "Đạo diễn một vở kịch", category: 'A'},
    {id: 19, type: 'RIASEC', text: "Thiết kế hình ảnh nghệ thuật cho tạp chí", category: 'A'},
    {id: 20, type: 'RIASEC', text: "Sáng tác một bài hát", category: 'A'},
    {id: 21, type: 'RIASEC', text: "Viết sách hoặc kịch bản", category: 'A'},
    {id: 22, type: 'RIASEC', text: "Chơi một nhạc cụ", category: 'A'},
    {id: 23, type: 'RIASEC', text: "Biểu diễn các pha nguy hiểm cho phim hoặc chương trình truyền hình", category: 'A'},
    {id: 24, type: 'RIASEC', text: "Thiết kế bối cảnh sân khấu cho các vở kịch", category: 'A'},

    // === S (Social) - Xã hội - 8 câu ===
    {id: 25, type: 'RIASEC', text: "Tư vấn hướng nghiệp cho mọi người", category: 'S'},
    {id: 26, type: 'RIASEC', text: "Làm tình nguyện tại một tổ chức phi lợi nhuận", category: 'S'},
    {id: 27, type: 'RIASEC', text: "Giúp đỡ những người gặp vấn đề với ma túy hoặc rượu", category: 'S'},
    {id: 28, type: 'RIASEC', text: "Hướng dẫn một cá nhân thực hiện bài tập thể dục", category: 'S'},
    {id: 29, type: 'RIASEC', text: "Giúp đỡ những người gặp vấn đề liên quan đến gia đình", category: 'S'},
    {id: 30, type: 'RIASEC', text: "Giám sát các hoạt động của trẻ em tại trại hè", category: 'S'},
    {id: 31, type: 'RIASEC', text: "Dạy trẻ em cách đọc", category: 'S'},
    {id: 32, type: 'RIASEC', text: "Giúp đỡ người cao tuổi trong các sinh hoạt hằng ngày", category: 'S'},

    // === E (Enterprising) - Kinh doanh - 8 câu ===
    {id: 33, type: 'RIASEC', text: "Bán nhượng quyền thương hiệu nhà hàng cho cá nhân", category: 'E'},
    {id: 34, type: 'RIASEC', text: "Bán hàng tại cửa hàng bách hóa", category: 'E'},
    {id: 35, type: 'RIASEC', text: "Quản lý hoạt động của khách sạn", category: 'E'},
    {id: 36, type: 'RIASEC', text: "Điều hành tiệm làm đẹp hoặc tiệm cắt tóc", category: 'E'},
    {id: 37, type: 'RIASEC', text: "Quản lý một bộ phận trong công ty lớn", category: 'E'},
    {id: 38, type: 'RIASEC', text: "Quản lý cửa hàng quần áo", category: 'E'},
    {id: 39, type: 'RIASEC', text: "Bán nhà", category: 'E'},
    {id: 40, type: 'RIASEC', text: "Điều hành cửa hàng đồ chơi", category: 'E'},

    // === C (Conventional) - Hành chính - 8 câu ===
    {id: 41, type: 'RIASEC', text: "Lập bảng lương hằng tháng cho văn phòng", category: 'C'},
    {id: 42, type: 'RIASEC', text: "Kiểm kê vật tư bằng máy tính cầm tay", category: 'C'},
    {id: 43, type: 'RIASEC', text: "Sử dụng phần mềm máy tính để tạo hóa đơn cho khách hàng", category: 'C'},
    {id: 44, type: 'RIASEC', text: "Quản lý hồ sơ nhân viên", category: 'C'},
    {id: 45, type: 'RIASEC', text: "Tính toán và ghi chép dữ liệu thống kê và các số liệu khác", category: 'C'},
    {id: 46, type: 'RIASEC', text: "Sử dụng máy tính cầm tay", category: 'C'},
    {id: 47, type: 'RIASEC', text: "Xử lý các giao dịch ngân hàng của khách hàng", category: 'C'},
    {id: 48, type: 'RIASEC', text: "Ghi chép hồ sơ xuất nhập hàng", category: 'C'},
];

/**
 * Tính điểm RIASEC từ câu trả lời
 * @param answers - Object chứa id câu hỏi và câu trả lời (true = Có, false = Không)
 * @returns Object chứa điểm cho mỗi category và Holland Code
 */
export function calculateRIASECResult(answers: Record<number, boolean>): {
    scores: Record<RIASECCategory, number>;
    percentages: Record<RIASECCategory, number>;
    hollandCode: string;
    topThree: { category: RIASECCategory; score: number; info: RIASECCategoryInfo }[];
    dominantType: RIASECCategory;
} {
    const scores: Record<RIASECCategory, number> = {R: 0, I: 0, A: 0, S: 0, E: 0, C: 0};
    const maxPerCategory = 8; // 8 câu hỏi mỗi category

    // Tính điểm cho mỗi category
    RIASEC_QUESTIONS_V2.forEach(question => {
        const answer = answers[question.id];
        if (answer === true) {
            scores[question.category]++;
        }
    });

    // Tính phần trăm
    const percentages: Record<RIASECCategory, number> = {
        R: Math.round((scores.R / maxPerCategory) * 100),
        I: Math.round((scores.I / maxPerCategory) * 100),
        A: Math.round((scores.A / maxPerCategory) * 100),
        S: Math.round((scores.S / maxPerCategory) * 100),
        E: Math.round((scores.E / maxPerCategory) * 100),
        C: Math.round((scores.C / maxPerCategory) * 100),
    };

    // Sắp xếp để lấy top 3
    const sortedCategories = (Object.entries(scores) as [RIASECCategory, number][])
        .sort(([, a], [, b]) => b - a);

    const topThree = sortedCategories.slice(0, 3).map(([category, score]) => ({
        category,
        score,
        info: RIASEC_CATEGORIES[category]
    }));

    // Holland Code = 3 chữ cái đầu của top 3 categories
    const hollandCode = topThree.map(t => t.category).join('');
    const dominantType = topThree[0].category;

    return {
        scores,
        percentages,
        hollandCode,
        topThree,
        dominantType
    };
}

/**
 * Mô tả chi tiết cho các Holland Code phổ biến
 */
export const HOLLAND_CODE_DESCRIPTIONS: Record<string, {
    title: string;
    description: string;
    careers: string[];
    strengths: string[];
    workEnvironment: string;
}> = {
    'RIA': {
        title: 'Kỹ sư Sáng tạo',
        description: 'Bạn thích kết hợp giữa công việc thực hành với nghiên cứu và sáng tạo.',
        careers: ['Kỹ sư thiết kế', 'Kiến trúc sư', 'Nhà phát minh', 'Kỹ sư phần mềm'],
        strengths: ['Tư duy logic', 'Sáng tạo', 'Kỹ năng thực hành'],
        workEnvironment: 'Môi trường kết hợp giữa lab và workshop'
    },
    'RIS': {
        title: 'Kỹ thuật viên Y tế',
        description: 'Bạn thích công việc kỹ thuật kết hợp với việc giúp đỡ người khác.',
        careers: ['Kỹ thuật viên y tế', 'Vật lý trị liệu', 'Kỹ thuật viên nha khoa'],
        strengths: ['Khéo tay', 'Quan tâm người khác', 'Cẩn thận'],
        workEnvironment: 'Bệnh viện, phòng khám'
    },
    'RIE': {
        title: 'Kỹ sư Quản lý',
        description: 'Bạn thích công việc kỹ thuật với cơ hội lãnh đạo và kinh doanh.',
        careers: ['Quản lý kỹ thuật', 'Giám đốc sản xuất', 'Doanh nhân công nghệ'],
        strengths: ['Kỹ năng kỹ thuật', 'Lãnh đạo', 'Quyết đoán'],
        workEnvironment: 'Nhà máy, công ty công nghệ'
    },
    'RIC': {
        title: 'Kỹ thuật viên Phân tích',
        description: 'Bạn thích công việc kỹ thuật với số liệu và quy trình rõ ràng.',
        careers: ['Kiểm soát chất lượng', 'Kỹ thuật viên lab', 'Phân tích kỹ thuật'],
        strengths: ['Cẩn thận', 'Chính xác', 'Tuân thủ quy trình'],
        workEnvironment: 'Phòng lab, nhà máy'
    },
    'IAS': {
        title: 'Nhà Khoa học Xã hội',
        description: 'Bạn thích nghiên cứu với khía cạnh sáng tạo và hỗ trợ người khác.',
        careers: ['Nhà tâm lý học', 'Nhà xã hội học', 'Nghiên cứu sinh hành vi'],
        strengths: ['Phân tích', 'Đồng cảm', 'Sáng tạo'],
        workEnvironment: 'Đại học, viện nghiên cứu, bệnh viện'
    },
    'IAE': {
        title: 'Doanh nhân Sáng tạo',
        description: 'Bạn thích kết hợp nghiên cứu với sáng tạo và kinh doanh.',
        careers: ['Startup founder', 'Giám đốc sáng tạo', 'Nhà phát triển sản phẩm'],
        strengths: ['Đổi mới', 'Tư duy kinh doanh', 'Sáng tạo'],
        workEnvironment: 'Startup, agency sáng tạo'
    },
    'ASE': {
        title: 'Nhà Truyền thông Sáng tạo',
        description: 'Bạn thích sáng tạo kết hợp với làm việc với người và kinh doanh.',
        careers: ['Marketing Director', 'Event Manager', 'PR Manager', 'Content Creator'],
        strengths: ['Sáng tạo', 'Giao tiếp', 'Thuyết phục'],
        workEnvironment: 'Agency, media company'
    },
    'SEC': {
        title: 'Quản lý Nhân sự',
        description: 'Bạn thích làm việc với người và quản lý theo quy trình.',
        careers: ['HR Manager', 'Training Manager', 'Quản lý hành chính'],
        strengths: ['Kỹ năng người', 'Tổ chức', 'Tuân thủ quy trình'],
        workEnvironment: 'Văn phòng, doanh nghiệp'
    },
    'ECS': {
        title: 'Quản lý Kinh doanh',
        description: 'Bạn thích kinh doanh với quy trình rõ ràng và làm việc với người.',
        careers: ['Sales Manager', 'Branch Manager', 'Quản lý cửa hàng'],
        strengths: ['Lãnh đạo', 'Tổ chức', 'Kỹ năng bán hàng'],
        workEnvironment: 'Cửa hàng, chi nhánh, văn phòng bán hàng'
    },
    'CES': {
        title: 'Quản trị Văn phòng',
        description: 'Bạn thích tổ chức công việc, kinh doanh và hỗ trợ người khác.',
        careers: ['Office Manager', 'Executive Assistant', 'Quản lý vận hành'],
        strengths: ['Tổ chức', 'Giao tiếp', 'Quản lý'],
        workEnvironment: 'Văn phòng công ty'
    },
    // Thêm các code phổ biến khác
    'SAE': {
        title: 'Giáo dục & Đào tạo',
        description: 'Bạn thích giảng dạy, hỗ trợ người học với phương pháp sáng tạo.',
        careers: ['Giáo viên', 'Trainer', 'Coach', 'Giảng viên đại học'],
        strengths: ['Truyền đạt', 'Sáng tạo', 'Kiên nhẫn'],
        workEnvironment: 'Trường học, trung tâm đào tạo'
    },
    'AIR': {
        title: 'Thiết kế Kỹ thuật',
        description: 'Bạn thích sáng tạo kết hợp với nghiên cứu và thực hành.',
        careers: ['Industrial Designer', 'UX Designer', 'Product Designer'],
        strengths: ['Sáng tạo', 'Phân tích', 'Kỹ năng thực hành'],
        workEnvironment: 'Studio thiết kế, công ty công nghệ'
    },
    'SIA': {
        title: 'Tư vấn Sáng tạo',
        description: 'Bạn thích giúp đỡ người khác thông qua nghiên cứu và sáng tạo.',
        careers: ['Art Therapist', 'Career Counselor', 'Music Therapist'],
        strengths: ['Đồng cảm', 'Sáng tạo', 'Phân tích'],
        workEnvironment: 'Bệnh viện, trung tâm tư vấn'
    },
    'EAS': {
        title: 'Lãnh đạo Sáng tạo',
        description: 'Bạn thích dẫn dắt đội nhóm trong các dự án sáng tạo.',
        careers: ['Creative Director', 'Producer', 'Art Director'],
        strengths: ['Lãnh đạo', 'Sáng tạo', 'Giao tiếp'],
        workEnvironment: 'Agency, studio, media company'
    },
    'ICR': {
        title: 'Nhà Phân tích Kỹ thuật',
        description: 'Bạn thích nghiên cứu với dữ liệu và công việc thực hành.',
        careers: ['Data Scientist', 'Research Engineer', 'Technical Analyst'],
        strengths: ['Phân tích', 'Logic', 'Kỹ năng kỹ thuật'],
        workEnvironment: 'Lab, công ty công nghệ'
    },
};

/**
 * Lấy mô tả cho Holland Code, hỗ trợ cả trường hợp không có mô tả sẵn
 */
export function getHollandCodeDescription(code: string): {
    title: string;
    description: string;
    careers: string[];
    strengths: string[];
    workEnvironment: string;
} {
    // Nếu có mô tả sẵn
    if (HOLLAND_CODE_DESCRIPTIONS[code]) {
        return HOLLAND_CODE_DESCRIPTIONS[code];
    }

    // Tạo mô tả động dựa trên các category
    const categories = code.split('') as RIASECCategory[];
    const categoryInfos = categories.map(c => RIASEC_CATEGORIES[c]);

    const allCareers = categoryInfos.flatMap(info => info.careers.slice(0, 2));
    const title = categoryInfos.map(info => info.name_vi).join(' - ');

    return {
        title: `${title}`,
        description: `Bạn có xu hướng kết hợp: ${categoryInfos.map(info => info.description.toLowerCase()).join(', ')}.`,
        careers: [...new Set(allCareers)].slice(0, 6),
        strengths: categoryInfos.map(info => info.name_vi),
        workEnvironment: 'Môi trường linh hoạt phù hợp với đa dạng sở thích'
    };
}

