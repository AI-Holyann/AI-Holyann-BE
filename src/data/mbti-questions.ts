// filepath: d:\holyann-ai-web\src\data\mbti-questions.ts
import {Question} from '@/components/types';

/**
 * Bộ câu hỏi MBTI - Likert Scale 5 mức độ
 * Phiên bản: 1.0
 * Tổng số câu hỏi: 60
 *
 * Dimensions:
 * - E/I: Hướng ngoại / Hướng nội (Extraversion / Introversion)
 * - S/N: Giác quan / Trực giác (Sensing / Intuition)
 * - T/F: Suy nghĩ / Cảm xúc (Thinking / Feeling)
 * - J/P: Nguyên tắc / Linh hoạt (Judging / Perceiving)
 *
 * Thang điểm Likert:
 * 1: Rất không đồng ý
 * 2: Không đồng ý
 * 3: Trung lập
 * 4: Đồng ý
 * 5: Rất đồng ý
 */

export interface MBTIQuestion extends Question {
    dimension: 'E/I' | 'S/N' | 'T/F' | 'J/P';
    // Nếu true: điểm cao = chữ đầu (E, S, T, J)
    // Nếu false/undefined: điểm cao = chữ sau (I, N, F, P)
    positiveDirection?: boolean;
}

export const MBTI_LIKERT_SCALE = {
    1: 'Rất không đồng ý',
    2: 'Không đồng ý',
    3: 'Trung lập',
    4: 'Đồng ý',
    5: 'Rất đồng ý'
} as const;

export const MBTI_DIMENSIONS = {
    'E/I': 'Hướng ngoại / Hướng nội',
    'S/N': 'Giác quan / Trực giác',
    'T/F': 'Suy nghĩ / Cảm xúc',
    'J/P': 'Nguyên tắc / Linh hoạt'
} as const;

export const MBTI_QUESTIONS_V2: MBTIQuestion[] = [
    // === DIMENSION E/I ===
    {id: 1, type: 'MBTI', text: "Bạn thường xuyên kết bạn mới.", dimension: 'E/I', positiveDirection: true},
    {
        id: 5,
        type: 'MBTI',
        text: "Bạn thường giữ bình tĩnh, ngay cả dưới nhiều áp lực.",
        dimension: 'E/I',
        positiveDirection: false
    },
    {
        id: 6,
        type: 'MBTI',
        text: "Tại các sự kiện xã hội, bạn hiếm khi tự giới thiệu mình với người mới.",
        dimension: 'E/I',
        positiveDirection: false
    },
    {
        id: 10,
        type: 'MBTI',
        text: "Ngay cả một lỗi nhỏ cũng có thể khiến bạn nghi ngờ năng lực tổng thể của mình.",
        dimension: 'E/I',
        positiveDirection: false
    },
    {
        id: 11,
        type: 'MBTI',
        text: "Bạn cảm thấy thoải mái khi bắt đầu cuộc trò chuyện với người thú vị.",
        dimension: 'E/I',
        positiveDirection: true
    },
    {
        id: 15,
        type: 'MBTI',
        text: "Bạn hiếm khi lo lắng về việc tạo ấn tượng tốt.",
        dimension: 'E/I',
        positiveDirection: true
    },
    {
        id: 16,
        type: 'MBTI',
        text: "Bạn thích tham gia vào các hoạt động nhóm.",
        dimension: 'E/I',
        positiveDirection: true
    },
    {
        id: 20,
        type: 'MBTI',
        text: "Bạn thường lo lắng mọi thứ sẽ diễn ra tồi tệ.",
        dimension: 'E/I',
        positiveDirection: false
    },
    {
        id: 21,
        type: 'MBTI',
        text: "Bạn tránh vai trò lãnh đạo trong các thiết lập nhóm.",
        dimension: 'E/I',
        positiveDirection: false
    },
    {id: 25, type: 'MBTI', text: "Bạn thích xem mọi người tranh luận.", dimension: 'E/I', positiveDirection: true},
    {id: 26, type: 'MBTI', text: "Bạn có xu hướng tránh thu hút sự chú ý.", dimension: 'E/I', positiveDirection: false},
    {
        id: 31,
        type: 'MBTI',
        text: "Bạn thích ở gần người khác hơn là ở một mình.",
        dimension: 'E/I',
        positiveDirection: true
    },
    {
        id: 35,
        type: 'MBTI',
        text: "Bạn hiếm khi phải xem xét lại các quyết định của mình.",
        dimension: 'E/I',
        positiveDirection: true
    },
    {
        id: 36,
        type: 'MBTI',
        text: "Sau một tuần dài, bạn cần những sự kiện xã hội sôi nổi.",
        dimension: 'E/I',
        positiveDirection: true
    },
    {id: 40, type: 'MBTI', text: "Bạn hiếm khi cảm thấy bất an.", dimension: 'E/I', positiveDirection: true},
    {
        id: 41,
        type: 'MBTI',
        text: "Bạn tránh thực hiện các cuộc gọi điện thoại.",
        dimension: 'E/I',
        positiveDirection: false
    },
    {
        id: 43,
        type: 'MBTI',
        text: "Bạn là người khởi xướng các hoạt động giữa bạn bè.",
        dimension: 'E/I',
        positiveDirection: true
    },
    {id: 45, type: 'MBTI', text: "Bạn vẫn bị ám ảnh bởi những sai lầm cũ.", dimension: 'E/I', positiveDirection: false},
    {
        id: 50,
        type: 'MBTI',
        text: "Bạn lo lắng rằng mọi người cuối cùng sẽ thất vọng về bạn.",
        dimension: 'E/I',
        positiveDirection: false
    },
    {
        id: 51,
        type: 'MBTI',
        text: "Bạn thích công việc mà bạn làm một mình hầu hết thời gian.",
        dimension: 'E/I',
        positiveDirection: false
    },
    {
        id: 53,
        type: 'MBTI',
        text: "Bạn thích những nơi bận rộn hơn những nơi yên tĩnh.",
        dimension: 'E/I',
        positiveDirection: true
    },
    {id: 55, type: 'MBTI', text: "Bạn thường cảm thấy quá tải.", dimension: 'E/I', positiveDirection: false},
    {id: 57, type: 'MBTI', text: "Các chủ đề gây tranh cãi hấp dẫn bạn.", dimension: 'E/I', positiveDirection: true},
    {id: 60, type: 'MBTI', text: "Bạn cảm thấy tự tin mọi thứ sẽ ổn thỏa.", dimension: 'E/I', positiveDirection: true},

    // === DIMENSION S/N ===
    {
        id: 2,
        type: 'MBTI',
        text: "Bạn dành nhiều thời gian rảnh để khám phá các chủ đề ngẫu nhiên làm bạn hứng thú.",
        dimension: 'S/N',
        positiveDirection: false
    },
    {
        id: 12,
        type: 'MBTI',
        text: "Bạn không quan tâm đến việc giải thích hoặc phân tích các tác phẩm sáng tạo.",
        dimension: 'S/N',
        positiveDirection: true
    },
    {
        id: 17,
        type: 'MBTI',
        text: "Bạn thích những cuốn sách và bộ phim có cách giải thích mở (open-ended).",
        dimension: 'S/N',
        positiveDirection: false
    },
    {
        id: 19,
        type: 'MBTI',
        text: "Bạn quan tâm đến quá nhiều thứ đến mức việc lựa chọn trở nên khó khăn.",
        dimension: 'S/N',
        positiveDirection: false
    },
    {
        id: 22,
        type: 'MBTI',
        text: "Bạn nghĩ mình không phải là người có năng khiếu nghệ thuật.",
        dimension: 'S/N',
        positiveDirection: true
    },
    {
        id: 30,
        type: 'MBTI',
        text: "Bạn bị cuốn hút bởi những gì xảy ra sau khi chết.",
        dimension: 'S/N',
        positiveDirection: false
    },
    {
        id: 32,
        type: 'MBTI',
        text: "Bạn cảm thấy nhàm chán với các cuộc thảo luận mang tính lý thuyết cao.",
        dimension: 'S/N',
        positiveDirection: true
    },
    {id: 37, type: 'MBTI', text: "Bạn thích các bảo tàng nghệ thuật.", dimension: 'S/N', positiveDirection: false},
    {
        id: 42,
        type: 'MBTI',
        text: "Bạn dành nhiều thời gian để hiểu các quan điểm rất khác nhau.",
        dimension: 'S/N',
        positiveDirection: false
    },
    {
        id: 46,
        type: 'MBTI',
        text: "Bạn hiếm khi nghĩ về ý nghĩa của cuộc đời.",
        dimension: 'S/N',
        positiveDirection: true
    },
    {
        id: 52,
        type: 'MBTI',
        text: "Bạn nghĩ triết học trừu tượng là lãng phí thời gian.",
        dimension: 'S/N',
        positiveDirection: true
    },

    // === DIMENSION T/F ===
    {
        id: 3,
        type: 'MBTI',
        text: "Nhìn người khác khóc dễ làm bạn muốn khóc theo.",
        dimension: 'T/F',
        positiveDirection: false
    },
    {id: 8, type: 'MBTI', text: "Bạn là người rất giàu tình cảm.", dimension: 'T/F', positiveDirection: false},
    {id: 13, type: 'MBTI', text: "Bạn làm theo lý trí nhiều hơn trái tim.", dimension: 'T/F', positiveDirection: true},
    {
        id: 18,
        type: 'MBTI',
        text: "Hạnh phúc của bạn đến từ việc giúp đỡ người khác nhiều hơn là thành tựu của chính mình.",
        dimension: 'T/F',
        positiveDirection: false
    },
    {
        id: 23,
        type: 'MBTI',
        text: "Thế giới sẽ tốt hơn nếu mọi người lý trí hơn.",
        dimension: 'T/F',
        positiveDirection: true
    },
    {id: 27, type: 'MBTI', text: "Tâm trạng của bạn thay đổi nhanh chóng.", dimension: 'T/F', positiveDirection: false},
    {
        id: 28,
        type: 'MBTI',
        text: "Bạn mất kiên nhẫn với những người làm việc kém hiệu quả.",
        dimension: 'T/F',
        positiveDirection: true
    },
    {
        id: 33,
        type: 'MBTI',
        text: "Bạn thấy dễ dàng đồng cảm với những trải nghiệm khác nhau.",
        dimension: 'T/F',
        positiveDirection: false
    },
    {
        id: 38,
        type: 'MBTI',
        text: "Bạn gặp khó khăn trong việc hiểu cảm xúc của người khác.",
        dimension: 'T/F',
        positiveDirection: true
    },
    {
        id: 47,
        type: 'MBTI',
        text: "Cảm xúc của bạn điều khiển bạn nhiều hơn bạn điều khiển chúng.",
        dimension: 'T/F',
        positiveDirection: false
    },
    {
        id: 48,
        type: 'MBTI',
        text: "Bạn tránh làm người khác bẽ mặt ngay cả khi họ sai.",
        dimension: 'T/F',
        positiveDirection: false
    },
    {
        id: 54,
        type: 'MBTI',
        text: "Bạn có thể đoán cảm giác của ai đó ngay từ cái nhìn đầu tiên.",
        dimension: 'T/F',
        positiveDirection: false
    },
    {
        id: 58,
        type: 'MBTI',
        text: "Bạn từ bỏ cơ hội nếu người khác cần chúng hơn.",
        dimension: 'T/F',
        positiveDirection: false
    },

    // === DIMENSION J/P ===
    {
        id: 4,
        type: 'MBTI',
        text: "Bạn thường lập kế hoạch dự phòng cho một kế hoạch dự phòng.",
        dimension: 'J/P',
        positiveDirection: true
    },
    {
        id: 7,
        type: 'MBTI',
        text: "Bạn thích hoàn thành triệt để một dự án trước khi bắt đầu một dự án khác.",
        dimension: 'J/P',
        positiveDirection: true
    },
    {
        id: 9,
        type: 'MBTI',
        text: "Bạn thích sử dụng các công cụ tổ chức như lịch trình và danh sách.",
        dimension: 'J/P',
        positiveDirection: true
    },
    {
        id: 14,
        type: 'MBTI',
        text: "Bạn thích làm những gì mình cảm thấy tại thời điểm đó hơn là lên kế hoạch.",
        dimension: 'J/P',
        positiveDirection: false
    },
    {
        id: 24,
        type: 'MBTI',
        text: "Bạn thích làm việc nhà trước khi thư giãn.",
        dimension: 'J/P',
        positiveDirection: true
    },
    {id: 29, type: 'MBTI', text: "Bạn thường làm mọi thứ vào phút chót.", dimension: 'J/P', positiveDirection: false},
    {
        id: 34,
        type: 'MBTI',
        text: "Bạn trì hoãn các quyết định càng lâu càng tốt.",
        dimension: 'J/P',
        positiveDirection: false
    },
    {
        id: 39,
        type: 'MBTI',
        text: "Bạn thích có một danh sách việc cần làm cho mỗi ngày.",
        dimension: 'J/P',
        positiveDirection: true
    },
    {
        id: 44,
        type: 'MBTI',
        text: "Nếu bị gián đoạn, ưu tiên của bạn là quay lại kế hoạch.",
        dimension: 'J/P',
        positiveDirection: true
    },
    {
        id: 49,
        type: 'MBTI',
        text: "Phong cách làm việc của bạn là ngẫu hứng hơn là có tổ chức.",
        dimension: 'J/P',
        positiveDirection: false
    },
    {
        id: 56,
        type: 'MBTI',
        text: "Bạn hoàn thành công việc một cách có phương pháp mà không bỏ qua các bước.",
        dimension: 'J/P',
        positiveDirection: true
    },
    {
        id: 59,
        type: 'MBTI',
        text: "Bạn gặp khó khăn với thời hạn (deadlines).",
        dimension: 'J/P',
        positiveDirection: false
    },
];

// Sắp xếp lại theo thứ tự ID
export const MBTI_QUESTIONS_SORTED = [...MBTI_QUESTIONS_V2].sort((a, b) => a.id - b.id);

/**
 * Tính điểm MBTI từ câu trả lời
 * @param answers - Object chứa id câu hỏi và điểm (1-5)
 * @returns Object chứa điểm cho mỗi dimension và kết quả MBTI type
 */
export function calculateMBTIResult(answers: Record<number, number>): {
    scores: {
        E: number; I: number;
        S: number; N: number;
        T: number; F: number;
        J: number; P: number;
    };
    percentages: {
        E: number; I: number;
        S: number; N: number;
        T: number; F: number;
        J: number; P: number;
    };
    type: string;
    dimensions: {
        'E/I': { dominant: 'E' | 'I'; percentage: number };
        'S/N': { dominant: 'S' | 'N'; percentage: number };
        'T/F': { dominant: 'T' | 'F'; percentage: number };
        'J/P': { dominant: 'J' | 'P'; percentage: number };
    };
} {
    const scores = {E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0};
    const counts = {'E/I': 0, 'S/N': 0, 'T/F': 0, 'J/P': 0};

    MBTI_QUESTIONS_SORTED.forEach(question => {
        const answer = answers[question.id];
        if (answer === undefined) return;

        counts[question.dimension]++;
        const dimension = question.dimension;

        // Điểm từ 1-5, chuyển thành -2 đến +2 cho tính toán
        // positiveDirection = true: điểm cao nghiêng về chữ đầu (E, S, T, J)
        // positiveDirection = false: điểm cao nghiêng về chữ sau (I, N, F, P)

        if (question.positiveDirection) {
            // Điểm cao = thiên về chữ đầu
            if (dimension === 'E/I') {
                scores.E += answer;
                scores.I += (6 - answer);
            } else if (dimension === 'S/N') {
                scores.S += answer;
                scores.N += (6 - answer);
            } else if (dimension === 'T/F') {
                scores.T += answer;
                scores.F += (6 - answer);
            } else if (dimension === 'J/P') {
                scores.J += answer;
                scores.P += (6 - answer);
            }
        } else {
            // Điểm cao = thiên về chữ sau
            if (dimension === 'E/I') {
                scores.I += answer;
                scores.E += (6 - answer);
            } else if (dimension === 'S/N') {
                scores.N += answer;
                scores.S += (6 - answer);
            } else if (dimension === 'T/F') {
                scores.F += answer;
                scores.T += (6 - answer);
            } else if (dimension === 'J/P') {
                scores.P += answer;
                scores.J += (6 - answer);
            }
        }
    });

    // Tính phần trăm
    const totalEI = scores.E + scores.I;
    const totalSN = scores.S + scores.N;
    const totalTF = scores.T + scores.F;
    const totalJP = scores.J + scores.P;

    const percentages = {
        E: totalEI > 0 ? Math.round((scores.E / totalEI) * 100) : 50,
        I: totalEI > 0 ? Math.round((scores.I / totalEI) * 100) : 50,
        S: totalSN > 0 ? Math.round((scores.S / totalSN) * 100) : 50,
        N: totalSN > 0 ? Math.round((scores.N / totalSN) * 100) : 50,
        T: totalTF > 0 ? Math.round((scores.T / totalTF) * 100) : 50,
        F: totalTF > 0 ? Math.round((scores.F / totalTF) * 100) : 50,
        J: totalJP > 0 ? Math.round((scores.J / totalJP) * 100) : 50,
        P: totalJP > 0 ? Math.round((scores.P / totalJP) * 100) : 50,
    };

    // Xác định type
    const type =
        (scores.E >= scores.I ? 'E' : 'I') +
        (scores.S >= scores.N ? 'S' : 'N') +
        (scores.T >= scores.F ? 'T' : 'F') +
        (scores.J >= scores.P ? 'J' : 'P');

    const dimensions = {
        'E/I': {
            dominant: (scores.E >= scores.I ? 'E' : 'I') as 'E' | 'I',
            percentage: Math.max(percentages.E, percentages.I)
        },
        'S/N': {
            dominant: (scores.S >= scores.N ? 'S' : 'N') as 'S' | 'N',
            percentage: Math.max(percentages.S, percentages.N)
        },
        'T/F': {
            dominant: (scores.T >= scores.F ? 'T' : 'F') as 'T' | 'F',
            percentage: Math.max(percentages.T, percentages.F)
        },
        'J/P': {
            dominant: (scores.J >= scores.P ? 'J' : 'P') as 'J' | 'P',
            percentage: Math.max(percentages.J, percentages.P)
        },
    };

    return {scores, percentages, type, dimensions};
}

/**
 * Mô tả chi tiết cho từng loại MBTI
 */
export const MBTI_TYPE_DESCRIPTIONS: Record<string, {
    title: string;
    nickname: string;
    description: string;
    strengths: string[];
    weaknesses: string[];
    careers: string[];
}> = {
    'INTJ': {
        title: 'Nhà Chiến Lược',
        nickname: 'The Architect',
        description: 'Những nhà tư tưởng đầy sáng tạo với kế hoạch chi tiết cho mọi thứ.',
        strengths: ['Tư duy chiến lược', 'Độc lập', 'Quyết đoán', 'Tham vọng'],
        weaknesses: ['Quá tự tin', 'Thiếu kiên nhẫn', 'Khó thể hiện cảm xúc'],
        careers: ['Khoa học', 'Kỹ sư', 'Luật sư', 'Bác sĩ']
    },
    'INTP': {
        title: 'Nhà Tư Duy',
        nickname: 'The Logician',
        description: 'Những nhà sáng chế với khao khát kiến thức vô tận.',
        strengths: ['Phân tích logic', 'Sáng tạo', 'Khách quan', 'Cởi mở'],
        weaknesses: ['Hay lo lắng', 'Thiếu quyết đoán', 'Khó tuân thủ quy tắc'],
        careers: ['Lập trình viên', 'Nhà nghiên cứu', 'Kiến trúc sư', 'Giáo sư']
    },
    'ENTJ': {
        title: 'Nhà Chỉ Huy',
        nickname: 'The Commander',
        description: 'Những nhà lãnh đạo táo bạo, đầy tưởng tượng và ý chí mạnh mẽ.',
        strengths: ['Lãnh đạo', 'Tự tin', 'Hiệu quả', 'Chiến lược'],
        weaknesses: ['Thiếu kiên nhẫn', 'Kiêu ngạo', 'Khó chấp nhận thất bại'],
        careers: ['CEO', 'Doanh nhân', 'Luật sư', 'Quản lý']
    },
    'ENTP': {
        title: 'Người Tranh Luận',
        nickname: 'The Debater',
        description: 'Những nhà tư tưởng thông minh, tò mò, không thể cưỡng lại thử thách.',
        strengths: ['Sáng tạo', 'Thông minh', 'Tự tin', 'Năng động'],
        weaknesses: ['Hay tranh cãi', 'Không thực tế', 'Thiếu kiên nhẫn'],
        careers: ['Doanh nhân', 'Luật sư', 'Nhà tư vấn', 'Marketing']
    },
    'INFJ': {
        title: 'Người Ủng Hộ',
        nickname: 'The Advocate',
        description: 'Những người lý tưởng thầm lặng, đầy cảm hứng và mục đích.',
        strengths: ['Sáng tạo', 'Sâu sắc', 'Có nguyên tắc', 'Đam mê'],
        weaknesses: ['Nhạy cảm', 'Cầu toàn', 'Hay né tránh xung đột'],
        careers: ['Nhà tâm lý', 'Nhà văn', 'Cố vấn', 'Giáo viên']
    },
    'INFP': {
        title: 'Người Hòa Giải',
        nickname: 'The Mediator',
        description: 'Những người đầy thơ mộng, tử tế và vị tha.',
        strengths: ['Lý tưởng', 'Đồng cảm', 'Sáng tạo', 'Cởi mở'],
        weaknesses: ['Không thực tế', 'Quá lý tưởng', 'Tự phê bình'],
        careers: ['Nhà văn', 'Nghệ sĩ', 'Nhà tâm lý', 'Giáo viên']
    },
    'ENFJ': {
        title: 'Người Cho Đi',
        nickname: 'The Protagonist',
        description: 'Những nhà lãnh đạo lôi cuốn, truyền cảm hứng cho người khác.',
        strengths: ['Lôi cuốn', 'Đồng cảm', 'Đáng tin cậy', 'Vị tha'],
        weaknesses: ['Quá lý tưởng', 'Nhạy cảm với phê bình', 'Hay lo lắng'],
        careers: ['Giáo viên', 'HR', 'Nhà tư vấn', 'Chính trị gia']
    },
    'ENFP': {
        title: 'Người Truyền Cảm Hứng',
        nickname: 'The Campaigner',
        description: 'Những người nhiệt tình, sáng tạo và đầy năng lượng.',
        strengths: ['Tò mò', 'Nhiệt tình', 'Sáng tạo', 'Giao tiếp tốt'],
        weaknesses: ['Khó tập trung', 'Quá lý tưởng', 'Dễ bị căng thẳng'],
        careers: ['Diễn viên', 'Nhà báo', 'Marketing', 'Nhà tư vấn']
    },
    'ISTJ': {
        title: 'Người Thực Thi',
        nickname: 'The Logistician',
        description: 'Những người thực tế, đáng tin cậy và có trách nhiệm.',
        strengths: ['Đáng tin cậy', 'Kiên nhẫn', 'Thực tế', 'Trung thành'],
        weaknesses: ['Cứng nhắc', 'Khó thích nghi', 'Hay phán xét'],
        careers: ['Kế toán', 'Luật sư', 'Quân đội', 'Kỹ sư']
    },
    'ISFJ': {
        title: 'Người Bảo Vệ',
        nickname: 'The Defender',
        description: 'Những người bảo vệ tận tâm và ấm áp.',
        strengths: ['Đáng tin cậy', 'Kiên nhẫn', 'Tận tâm', 'Chu đáo'],
        weaknesses: ['Khiêm tốn quá mức', 'Khó từ chối', 'Nhạy cảm'],
        careers: ['Y tá', 'Giáo viên', 'Hành chính', 'Xã hội']
    },
    'ESTJ': {
        title: 'Người Điều Hành',
        nickname: 'The Executive',
        description: 'Những nhà quản lý xuất sắc, giỏi trong việc tổ chức.',
        strengths: ['Tổ chức', 'Tận tâm', 'Đáng tin cậy', 'Thực tế'],
        weaknesses: ['Cứng nhắc', 'Khó thư giãn', 'Hay phán xét'],
        careers: ['Quản lý', 'Luật sư', 'Thẩm phán', 'Tài chính']
    },
    'ESFJ': {
        title: 'Người Quan Tâm',
        nickname: 'The Consul',
        description: 'Những người chu đáo, quan tâm và phổ biến.',
        strengths: ['Trung thành', 'Chu đáo', 'Hòa đồng', 'Thực tế'],
        weaknesses: ['Hay lo lắng', 'Cần được công nhận', 'Nhạy cảm'],
        careers: ['Y tá', 'Giáo viên', 'HR', 'Xã hội']
    },
    'ISTP': {
        title: 'Người Khéo Léo',
        nickname: 'The Virtuoso',
        description: 'Những thợ thủ công táo bạo và thực tế.',
        strengths: ['Thực tế', 'Linh hoạt', 'Sáng tạo', 'Lý trí'],
        weaknesses: ['Khó cam kết', 'Thiếu kiên nhẫn', 'Không nhạy cảm'],
        careers: ['Kỹ sư', 'Cơ khí', 'Phi công', 'Thể thao']
    },
    'ISFP': {
        title: 'Người Phiêu Lưu',
        nickname: 'The Adventurer',
        description: 'Những nghệ sĩ linh hoạt, quyến rũ.',
        strengths: ['Quyến rũ', 'Nhạy cảm', 'Sáng tạo', 'Tò mò'],
        weaknesses: ['Khó dự đoán', 'Dễ bị căng thẳng', 'Thiếu tự tin'],
        careers: ['Nghệ sĩ', 'Nhạc sĩ', 'Nhiếp ảnh', 'Thiết kế']
    },
    'ESTP': {
        title: 'Người Hành Động',
        nickname: 'The Entrepreneur',
        description: 'Những người thông minh, năng động, nhanh nhạy.',
        strengths: ['Năng động', 'Thực tế', 'Quan sát', 'Táo bạo'],
        weaknesses: ['Thiếu kiên nhẫn', 'Mạo hiểm', 'Không nhạy cảm'],
        careers: ['Doanh nhân', 'Marketing', 'Thể thao', 'Môi giới']
    },
    'ESFP': {
        title: 'Người Trình Diễn',
        nickname: 'The Entertainer',
        description: 'Những người vui vẻ, nhiệt tình, yêu đời.',
        strengths: ['Vui vẻ', 'Thực tế', 'Quan sát', 'Hòa đồng'],
        weaknesses: ['Thiếu tập trung', 'Nhạy cảm', 'Tránh xung đột'],
        careers: ['Diễn viên', 'Ca sĩ', 'Sự kiện', 'Du lịch']
    }
};

