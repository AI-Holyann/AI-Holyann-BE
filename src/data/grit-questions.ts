// filepath: d:\holyann-ai-web\src\data\grit-questions.ts
import {Question} from '@/components/types';

/**
 * Bộ câu hỏi GRIT Scale - Thang đo Nghị lực (Angela Duckworth)
 * Phiên bản: 1.0
 * Tổng số câu hỏi: 12
 * Loại câu trả lời: Likert Scale 5 mức độ
 *
 * Thang điểm:
 * 1: Rất không giống tôi
 * 2: Không giống tôi lắm
 * 3: Trung lập
 * 4: Khá giống tôi
 * 5: Rất giống tôi
 *
 * 2 thành phần chính:
 * - Passion (Đam mê): Câu 2, 3, 5, 7, 8, 11 (6 câu - đảo ngược điểm)
 * - Perseverance (Kiên trì): Câu 1, 4, 6, 9, 10, 12 (6 câu - tính điểm thuận)
 */

export type GritComponent = 'passion' | 'perseverance';

export interface GritQuestion extends Question {
    component: GritComponent;
    reverse: boolean; // true = đảo ngược điểm (6 - answer)
}

export interface GritComponentInfo {
    name: string;
    name_vi: string;
    description: string;
    reverse_scored: boolean;
}

export const GRIT_LIKERT_SCALE = {
    1: 'Rất không giống tôi',
    2: 'Không giống tôi lắm',
    3: 'Trung lập',
    4: 'Khá giống tôi',
    5: 'Rất giống tôi'
} as const;

export const GRIT_COMPONENTS: Record<GritComponent, GritComponentInfo> = {
    'passion': {
        name: 'Passion',
        name_vi: 'Đam mê',
        description: 'Tính nhất quán trong sở thích và mục tiêu',
        reverse_scored: true
    },
    'perseverance': {
        name: 'Perseverance',
        name_vi: 'Kiên trì',
        description: 'Khả năng kiên trì nỗ lực',
        reverse_scored: false
    }
};

export const GRIT_QUESTIONS_V2: GritQuestion[] = [
    // === Perseverance (Kiên trì) - 6 câu - Tính điểm thuận ===
    {
        id: 1,
        type: 'GRIT',
        text: "Tôi đã vượt qua những khó khăn để chinh phục thử thách quan trọng.",
        component: 'perseverance',
        reverse: false
    },
    {
        id: 4,
        type: 'GRIT',
        text: "Tôi không nản lòng trước những khó khăn.",
        component: 'perseverance',
        reverse: false
    },
    {
        id: 6,
        type: 'GRIT',
        text: "Tôi là người chăm chỉ.",
        component: 'perseverance',
        reverse: false
    },
    {
        id: 9,
        type: 'GRIT',
        text: "Tôi hoàn thành những việc mình đề ra.",
        component: 'perseverance',
        reverse: false
    },
    {
        id: 10,
        type: 'GRIT',
        text: "Tôi từng hoàn thành một mục tiêu đòi hỏi nỗ lực trong nhiều năm.",
        component: 'perseverance',
        reverse: false
    },
    {
        id: 12,
        type: 'GRIT',
        text: "Tôi cần mẫn.",
        component: 'perseverance',
        reverse: false
    },

    // === Passion (Đam mê) - 6 câu - Đảo ngược điểm ===
    {
        id: 2,
        type: 'GRIT',
        text: "Đôi khi các ý tưởng và dự án mới khiến tôi xao lãng và không còn chú ý đến những ý tưởng trước đó.",
        component: 'passion',
        reverse: true
    },
    {
        id: 3,
        type: 'GRIT',
        text: "Những điều tôi quan tâm thay đổi qua từng năm.",
        component: 'passion',
        reverse: true
    },
    {
        id: 5,
        type: 'GRIT',
        text: "Tôi bị cuốn hút bởi một ý tưởng hoặc dự án nào đó trong một thời gian ngắn, rồi tôi lại dần mất đi hứng thú.",
        component: 'passion',
        reverse: true
    },
    {
        id: 7,
        type: 'GRIT',
        text: "Tôi thường lập mục tiêu này nhưng rồi lại chọn theo đuổi mục tiêu khác.",
        component: 'passion',
        reverse: true
    },
    {
        id: 8,
        type: 'GRIT',
        text: "Tôi khó tập trung vào các dự án mà thường phải mất hơn vài tháng để hoàn thành.",
        component: 'passion',
        reverse: true
    },
    {
        id: 11,
        type: 'GRIT',
        text: "Cứ mỗi vài tháng, tôi lại quan tâm theo đuổi các mục tiêu mới.",
        component: 'passion',
        reverse: true
    },
];

// Sắp xếp câu hỏi theo thứ tự ID (để hiển thị đúng thứ tự khi làm bài)
export const GRIT_QUESTIONS_SORTED = [...GRIT_QUESTIONS_V2].sort((a, b) => a.id - b.id);

export interface GritLevel {
    min: number;
    max: number;
    level: string;
    level_en: string;
    description: string;
    color: string;
}

export const GRIT_LEVELS: GritLevel[] = [
    {
        min: 1.0,
        max: 2.5,
        level: 'Thấp',
        level_en: 'Low',
        description: 'Cần phát triển thêm nghị lực và sự kiên trì. Bạn có thể dễ bị phân tâm bởi các mục tiêu mới và gặp khó khăn trong việc duy trì nỗ lực dài hạn.',
        color: 'text-red-600 bg-red-50'
    },
    {
        min: 2.5,
        max: 3.5,
        level: 'Trung bình',
        level_en: 'Moderate',
        description: 'Có nghị lực ở mức độ cơ bản. Bạn có khả năng kiên trì trong một số tình huống nhưng vẫn cần cải thiện sự tập trung vào mục tiêu dài hạn.',
        color: 'text-yellow-600 bg-yellow-50'
    },
    {
        min: 3.5,
        max: 4.2,
        level: 'Khá',
        level_en: 'Good',
        description: 'Có nghị lực tốt trong việc theo đuổi mục tiêu. Bạn có thể duy trì đam mê và nỗ lực trong thời gian dài, đặc biệt với những điều quan trọng.',
        color: 'text-blue-600 bg-blue-50'
    },
    {
        min: 4.2,
        max: 5.0,
        level: 'Cao',
        level_en: 'High',
        description: 'Có nghị lực xuất sắc, kiên trì theo đuổi mục tiêu dài hạn. Bạn là người có khả năng vượt qua khó khăn và duy trì đam mê bền bỉ.',
        color: 'text-green-600 bg-green-50'
    }
];

/**
 * Tính điểm Grit từ câu trả lời
 * @param answers - Object chứa id câu hỏi và điểm (1-5)
 * @returns Object chứa điểm tổng, điểm từng thành phần và đánh giá
 */
export function calculateGritResult(answers: Record<number, number>): {
    gritScore: number;
    passionScore: number;
    perseveranceScore: number;
    level: GritLevel;
    passionLevel: GritLevel;
    perseveranceLevel: GritLevel;
    breakdown: {
        passion: { raw: number; adjusted: number; count: number };
        perseverance: { raw: number; adjusted: number; count: number };
    };
} {
    let passionTotal = 0;
    let passionCount = 0;
    let perseveranceTotal = 0;
    let perseveranceCount = 0;

    GRIT_QUESTIONS_SORTED.forEach(question => {
        const answer = answers[question.id];
        if (answer === undefined || answer === null) return;

        // Đảo ngược điểm nếu cần (6 - answer để chuyển 1->5, 2->4, 3->3, 4->2, 5->1)
        const adjustedScore = question.reverse ? (6 - answer) : answer;

        if (question.component === 'passion') {
            passionTotal += adjustedScore;
            passionCount++;
        } else {
            perseveranceTotal += adjustedScore;
            perseveranceCount++;
        }
    });

    // Tính điểm trung bình cho mỗi thành phần
    const passionScore = passionCount > 0 ? passionTotal / passionCount : 0;
    const perseveranceScore = perseveranceCount > 0 ? perseveranceTotal / perseveranceCount : 0;

    // Điểm Grit tổng = trung bình của 2 thành phần
    const gritScore = (passionScore + perseveranceScore) / 2;

    // Xác định mức độ
    const getLevel = (score: number): GritLevel => {
        for (const level of GRIT_LEVELS) {
            if (score >= level.min && score < level.max) {
                return level;
            }
        }
        // Trường hợp điểm = 5.0 (max)
        return GRIT_LEVELS[GRIT_LEVELS.length - 1];
    };

    return {
        gritScore: parseFloat(gritScore.toFixed(2)),
        passionScore: parseFloat(passionScore.toFixed(2)),
        perseveranceScore: parseFloat(perseveranceScore.toFixed(2)),
        level: getLevel(gritScore),
        passionLevel: getLevel(passionScore),
        perseveranceLevel: getLevel(perseveranceScore),
        breakdown: {
            passion: {
                raw: passionTotal,
                adjusted: parseFloat(passionScore.toFixed(2)),
                count: passionCount
            },
            perseverance: {
                raw: perseveranceTotal,
                adjusted: parseFloat(perseveranceScore.toFixed(2)),
                count: perseveranceCount
            }
        }
    };
}

/**
 * Mô tả chi tiết về Grit và ý nghĩa
 */
export const GRIT_INFO = {
    title: 'Grit Scale',
    title_vi: 'Thang đo Nghị lực',
    author: 'Angela Duckworth',
    description: `Grit (Nghị lực) là sự kết hợp của đam mê và kiên trì hướng tới các mục tiêu dài hạn. 
    Theo nghiên cứu của Angela Duckworth, Grit là một trong những yếu tố quan trọng nhất 
    để dự đoán thành công, thậm chí còn hơn cả IQ hay tài năng bẩm sinh.`,
    components_description: {
        passion: `Đam mê (Passion) không chỉ là sự hứng thú nhất thời, mà là khả năng duy trì 
        sự quan tâm và cam kết với một mục tiêu hoặc lĩnh vực trong thời gian dài. 
        Những người có điểm cao ở phần này thường có sở thích ổn định và không dễ bị phân tâm.`,
        perseverance: `Kiên trì (Perseverance) là khả năng tiếp tục nỗ lực bất chấp khó khăn, 
        thất bại hay sự nhàm chán. Những người có điểm cao ở phần này là những người làm việc 
        chăm chỉ và không bỏ cuộc dễ dàng.`
    },
    tips_to_improve: [
        'Xác định mục tiêu dài hạn rõ ràng và có ý nghĩa với bạn',
        'Chia mục tiêu lớn thành các bước nhỏ có thể đo lường được',
        'Tạo thói quen luyện tập có chủ đích (deliberate practice)',
        'Học cách đối mặt với thất bại như một phần của quá trình học',
        'Tìm kiếm mentor hoặc cộng đồng có cùng mục tiêu',
        'Ghi nhật ký theo dõi tiến độ và phản ánh về quá trình',
        'Phát triển tư duy phát triển (growth mindset)',
        'Kết nối mục tiêu với giá trị cốt lõi của bản thân'
    ],
    relevance_to_study_abroad: `Grit đặc biệt quan trọng cho việc du học vì:
    - Quá trình chuẩn bị hồ sơ đòi hỏi nỗ lực liên tục trong nhiều tháng
    - Việc thích nghi với môi trường mới cần sự kiên nhẫn và quyết tâm
    - Học tập ở nước ngoài đòi hỏi khả năng vượt qua nhiều thử thách
    - Các trường đại học top thường tìm kiếm học sinh có Grit cao`
};

