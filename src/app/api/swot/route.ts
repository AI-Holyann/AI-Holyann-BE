import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";
import { SwotData, StudentProfile } from "@/components/types";

export async function POST(request: NextRequest) {
  try {
    const profile: StudentProfile = await request.json();

    // Check for API key
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "API Key is missing. Please provide a valid API_KEY in the environment.",
        },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
    Phân tích hồ sơ học sinh sau đây cho mục tiêu du học (Ngành: ${
      profile.targetMajor
    } tại ${profile.targetCountry}).
    
    Thông tin hồ sơ:
    - GPA: ${profile.gpa}/${profile.gpaScale}
    - Trình độ Tiếng Anh: ${profile.englishLevel}
    - Các hoạt động ngoại khóa: ${profile.extracurriculars
      .map((e) => e.title)
      .join(", ")}
    - Các thành tích: ${profile.achievements.join(", ")}

    Hãy tạo một bản phân tích SWOT chi tiết và đưa ra lời khuyên chiến lược cụ thể bằng TIẾNG VIỆT.
    Đồng thời đánh giá điểm số (thang 1-100) cho 4 khía cạnh: học thuật, hoạt động ngoại khóa, kỹ năng mềm, và ngoại ngữ dựa trên hồ sơ này.
  `;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description:
                "Danh sách 3-5 điểm mạnh nội tại nổi bật (Tiếng Việt).",
            },
            weaknesses: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description:
                "Danh sách 3-5 điểm yếu hoặc lĩnh vực cần cải thiện (Tiếng Việt).",
            },
            opportunities: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description:
                "Các cơ hội bên ngoài phù hợp với ngành học và quốc gia mục tiêu (Tiếng Việt).",
            },
            threats: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description:
                "Các thách thức bên ngoài như cạnh tranh, visa, văn hóa (Tiếng Việt).",
            },
            strategicAdvice: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: {
                    type: Type.STRING,
                    description: "Tiêu đề chiến lược ngắn gọn (Tiếng Việt)",
                  },
                  description: {
                    type: Type.STRING,
                    description:
                      "Mô tả chi tiết hành động cần làm (Tiếng Việt)",
                  },
                },
                required: ["title", "description"],
              },
              description: "3 bước chiến lược hành động cụ thể.",
            },
            scores: {
              type: Type.OBJECT,
              properties: {
                academic: {
                  type: Type.INTEGER,
                  description: "Điểm học thuật (1-100)",
                },
                extracurricular: {
                  type: Type.INTEGER,
                  description: "Điểm hoạt động ngoại khóa (1-100)",
                },
                skills: {
                  type: Type.INTEGER,
                  description: "Điểm kỹ năng mềm (1-100)",
                },
                language: {
                  type: Type.INTEGER,
                  description: "Điểm ngoại ngữ (1-100)",
                },
              },
              required: ["academic", "extracurricular", "skills", "language"],
              description: "Điểm đánh giá cho 4 khía cạnh",
            },
          },
          required: [
            "strengths",
            "weaknesses",
            "opportunities",
            "threats",
            "strategicAdvice",
            "scores",
          ],
        },
      },
    });

    if (response.text) {
      const swotData: SwotData = JSON.parse(response.text);
      return NextResponse.json(swotData, { status: 200 });
    }

    return NextResponse.json(
      { error: "Failed to generate analysis." },
      { status: 500 }
    );
  } catch (error) {
    console.error("SWOT Analysis Error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
