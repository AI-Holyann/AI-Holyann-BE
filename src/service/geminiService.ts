import {GoogleGenAI, Type} from "@google/genai";
import {SwotData, StudentProfile, TestResult, MajorRecommendation} from "../components/types";

// Mock data to simulate the "existing profile" context mentioned by the user
export const MOCK_STUDENT_PROFILE: StudentProfile = {
    id: "STU001",
    name: "Nguyễn Văn A",
    email: "nguyenvana@email.com",
    phone: "0123456789",
    address: "Hà Nội, Việt Nam",
    dob: "2004-01-15",
    avatarUrl: "https://api.dicebear.com/9.x/notionists/svg?seed=Felix",
    gpa: 3.8,
    gpaScale: 4.0,
    englishLevel: "IELTS 7.5",
    targetMajor: "Computer Science",
    targetCountry: "Canada",
    extracurriculars: [
        {
            id: "1",
            title: "Chủ tịch Câu lạc bộ Lập trình",
            role: "Chủ tịch",
            year: "2024",
            description: "Quản lý 50+ thành viên, tổ chức workshop và hackathon"
        }
    ],
    achievements: [
        "Huy chương Vàng Toán học Quốc tế",
        "Giải Nhất Hackathon 2024"
    ],
    documents: []
};

export const generateSwotAnalysis = async (profile: StudentProfile): Promise<SwotData> => {
    // Check for API key strictly as per guidelines
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;
    if (!apiKey) {
        throw new Error("API Key is missing. Please provide a valid NEXT_PUBLIC_API_KEY in the environment.");
    }

    const ai = new GoogleGenAI({apiKey});

    const prompt = `
    Phân tích hồ sơ học sinh sau đây cho mục tiêu du học (Ngành: ${profile.targetMajor} tại ${profile.targetCountry}).
    
    Thông tin hồ sơ:
    - GPA: ${profile.gpa}/${profile.gpaScale}
    - Trình độ Tiếng Anh: ${profile.englishLevel}
    - Các hoạt động ngoại khóa: ${profile.extracurriculars.map(e => e.title).join(", ")}
    - Các thành tích: ${profile.achievements.join(", ")}

    Hãy tạo một bản phân tích SWOT chi tiết và đưa ra lời khuyên chiến lược cụ thể bằng TIẾNG VIỆT.
    Đồng thời đánh giá điểm số (thang 1-100) cho 4 khía cạnh: học thuật, hoạt động ngoại khóa, kỹ năng mềm, và ngoại ngữ dựa trên hồ sơ này.
  `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    strengths: {
                        type: Type.ARRAY,
                        items: {type: Type.STRING},
                        description: "Danh sách 3-5 điểm mạnh nội tại nổi bật (Tiếng Việt)."
                    },
                    weaknesses: {
                        type: Type.ARRAY,
                        items: {type: Type.STRING},
                        description: "Danh sách 3-5 điểm yếu hoặc lĩnh vực cần cải thiện (Tiếng Việt)."
                    },
                    opportunities: {
                        type: Type.ARRAY,
                        items: {type: Type.STRING},
                        description: "Các cơ hội bên ngoài phù hợp với ngành học và quốc gia mục tiêu (Tiếng Việt)."
                    },
                    threats: {
                        type: Type.ARRAY,
                        items: {type: Type.STRING},
                        description: "Các thách thức bên ngoài như cạnh tranh, visa, văn hóa (Tiếng Việt)."
                    },
                    strategicAdvice: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                title: {type: Type.STRING, description: "Tiêu đề chiến lược ngắn gọn (Tiếng Việt)"},
                                description: {
                                    type: Type.STRING,
                                    description: "Mô tả chi tiết hành động cần làm (Tiếng Việt)"
                                }
                            }
                        },
                        description: "3 bước chiến lược hành động cụ thể."
                    },
                    scores: {
                        type: Type.OBJECT,
                        properties: {
                            academic: {type: Type.INTEGER},
                            extracurricular: {type: Type.INTEGER},
                            skills: {type: Type.INTEGER},
                            language: {type: Type.INTEGER}
                        }
                    }
                }
            }
        }
    });

    if (response.text) {
        return JSON.parse(response.text) as SwotData;
    }

    throw new Error("Failed to generate analysis.");
};

// Major recommendations function - based purely on personality test results
export const getMajorRecommendations = async (
    testResult: TestResult
): Promise<MajorRecommendation[]> => {
    // Check for API key
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;
    if (!apiKey) {
        throw new Error("API Key is missing. Please provide a valid NEXT_PUBLIC_API_KEY in the environment.");
    }

    const ai = new GoogleGenAI({apiKey});
    const model = "gemini-2.5-flash";

    // Construct a prompt context focused on personality-major matching
    const context = `
    Bạn là chuyên gia tư vấn định hướng nghề nghiệp chuyên nghiệp.
    
    Kết quả kiểm tra tính cách của học sinh:
    - Loại test: ${testResult.type}
    - Kết quả: ${testResult.rawLabel || "N/A"}
    - Điểm số chi tiết: ${JSON.stringify(testResult.scores)}
    - Mô tả: ${testResult.description || "N/A"}
    
    Nhiệm vụ:
    Dựa HOÀN TOÀN vào kết quả test tính cách này, hãy đề xuất 5 ngành học phù hợp nhất.
    
    Yêu cầu:
    - KHÔNG phụ thuộc vào ngành học hay quốc gia mong muốn trước đó
    - Phân tích sâu về tính cách và đưa ra lý do cụ thể tại sao ngành học phù hợp
    - Đề xuất các con đường sự nghiệp cụ thể
    - Liệt kê kỹ năng cần thiết
    - Đánh giá độ phù hợp (%)
    - Trả lời bằng TIẾNG VIỆT
    
    Ví dụ phân tích:
    - Với MBTI INTJ: Phù hợp với Computer Science vì thích hệ thống, logic, giải quyết vấn đề phức tạp
    - Với RIASEC cao về I (Investigative): Phù hợp với nghiên cứu khoa học, phân tích dữ liệu
    - Với Grit cao: Phù hợp với các ngành đòi hỏi kiên trì như Y khoa, Luật, Nghiên cứu
  `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: context,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: {
                                type: Type.STRING,
                                description: "Tên ngành học bằng tiếng Việt"
                            },
                            category: {
                                type: Type.STRING,
                                description: "Phân loại: STEM, Nghệ thuật, Kinh doanh, Nhân văn, Khoa học xã hội, v.v."
                            },
                            matchReason: {
                                type: Type.STRING,
                                description: "Lý do cụ thể tại sao ngành này phù hợp với tính cách (150-200 từ)"
                            },
                            careerPaths: {
                                type: Type.ARRAY,
                                items: {type: Type.STRING},
                                description: "3-5 con đường sự nghiệp cụ thể"
                            },
                            requiredSkills: {
                                type: Type.ARRAY,
                                items: {type: Type.STRING},
                                description: "4-6 kỹ năng quan trọng cần có"
                            },
                            matchPercentage: {
                                type: Type.INTEGER,
                                description: "Độ phù hợp từ 0-100"
                            }
                        },
                        required: ["name", "category", "matchReason", "careerPaths", "requiredSkills", "matchPercentage"]
                    }
                }
            }
        });

        const jsonText = response.text || "[]";
        const recommendations = JSON.parse(jsonText) as MajorRecommendation[];

        // Sort by matchPercentage descending
        return recommendations.sort((a, b) => b.matchPercentage - a.matchPercentage);

    } catch (error) {
        console.error("Error fetching major recommendations from Gemini:", error);
        return [];
    }
};

// CV Scanning with AI
export const scanCVWithAI = async (cvText: string): Promise<StudentProfile | null> => {
    // Check for API key
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;
    if (!apiKey) {
        throw new Error("API Key is missing. Please provide a valid NEXT_PUBLIC_API_KEY in the environment.");
    }

    const ai = new GoogleGenAI({apiKey});
    const model = "gemini-2.5-flash";

    const context = `
    Bạn là một AI chuyên trích xuất thông tin từ CV/Resume.
    
    Nội dung CV:
    ${cvText}
    
    Nhiệm vụ:
    Hãy phân tích và trích xuất TẤT CẢ thông tin có trong CV để tạo profile hoàn chỉnh.
    
    Yêu cầu:
    - Trích xuất chính xác thông tin cá nhân, học vấn, kinh nghiệm, kỹ năng
    - Tự động điền thông tin còn thiếu bằng giá trị hợp lý
    - Tạo ID ngẫu nhiên
    - Phân tích và tạo danh sách extracurriculars từ kinh nghiệm/hoạt động
    - Trích xuất achievements từ giải thưởng, chứng chỉ
    - Trả về JSON đầy đủ theo schema
  `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: context,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        id: {type: Type.STRING, description: "Generate random ID like 'STU' + 6 digits"},
                        name: {type: Type.STRING, description: "Họ và tên đầy đủ"},
                        email: {type: Type.STRING, description: "Email"},
                        phone: {type: Type.STRING, description: "Số điện thoại"},
                        address: {type: Type.STRING, description: "Địa chỉ"},
                        dob: {type: Type.STRING, description: "Ngày sinh format YYYY-MM-DD"},
                        avatarUrl: {
                            type: Type.STRING,
                            description: "Use default: https://api.dicebear.com/9.x/notionists/svg?seed=Felix"
                        },
                        gpa: {type: Type.NUMBER, description: "GPA/điểm trung bình"},
                        gpaScale: {type: Type.NUMBER, description: "Thang điểm (thường là 4.0 hoặc 10.0)"},
                        englishLevel: {type: Type.STRING, description: "Trình độ tiếng Anh (IELTS/TOEFL)"},
                        satScore: {type: Type.INTEGER, description: "SAT score nếu có"},
                        targetMajor: {type: Type.STRING, description: "Ngành học mong muốn"},
                        targetCountry: {type: Type.STRING, description: "Quốc gia mong muốn du học"},
                        extracurriculars: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    id: {type: Type.STRING},
                                    title: {type: Type.STRING, description: "Tên hoạt động"},
                                    role: {type: Type.STRING, description: "Vai trò"},
                                    year: {type: Type.STRING, description: "Năm tham gia"},
                                    description: {type: Type.STRING, description: "Mô tả chi tiết"}
                                }
                            }
                        },
                        achievements: {
                            type: Type.ARRAY,
                            items: {type: Type.STRING},
                            description: "Danh sách thành tích, giải thưởng"
                        },
                        documents: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    id: {type: Type.STRING},
                                    name: {type: Type.STRING},
                                    type: {type: Type.STRING},
                                    uploadDate: {type: Type.STRING},
                                    size: {type: Type.STRING}
                                }
                            },
                            description: "Leave empty array []"
                        }
                    },
                    required: ["id", "name", "email", "phone", "address", "dob", "avatarUrl", "gpa", "gpaScale",
                        "englishLevel", "targetMajor", "targetCountry", "extracurriculars", "achievements", "documents"]
                }
            }
        });

        const jsonText = response.text || "{}";
        const profile = JSON.parse(jsonText) as StudentProfile;

        return profile;

    } catch (error) {
        console.error("Error scanning CV with Gemini AI:", error);
        return null;
    }
};

