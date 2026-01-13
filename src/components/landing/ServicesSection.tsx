"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Lightbulb, GraduationCap, Plane } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading"; // Đảm bảo đường dẫn này đúng
import { BRAND_COLORS } from "../../lib/data"; // Đảm bảo đường dẫn này đúng

export default function ServicesSection() {
  const [activeServiceTab, setActiveServiceTab] = useState<
    "comprehensive" | "essay"
  >("comprehensive");

  // Dữ liệu 3 giai đoạn của Gói Toàn Diện
  const comprehensivePhases = [
    {
      title: "Giai đoạn 1: Tư vấn định hướng & Xây dựng lộ trình",
      items: [
        "Tư vấn 1-1 hàng tuần (45-60 phút/buổi), khai thác và đánh giá tổng quan hồ sơ.",
        "Làm bài test tính cách/nghề nghiệp, định hướng ngành và quốc gia du học.",
        "Xây dựng danh sách trường mục tiêu & chiến lược cải thiện hồ sơ học thuật/ngoại khóa.",
      ],
    },
    {
      title: "Giai đoạn 2: Hoàn thiện hồ sơ & Viết luận",
      items: [
        "Hướng dẫn xây dựng HĐNK, Portfolio và phát triển ý tưởng bài luận (Personal Statement).",
        "Sửa bài luận chính & luận phụ không giới hạn (Brainstorming, Edit, Proofread).",
        "Hỗ trợ thư giới thiệu (LOR), chứng minh tài chính và luyện phỏng vấn thử (Mock Interview).",
        "Hoàn thiện và nộp đơn ứng tuyển (Application Form).",
      ],
    },
    {
      title: "Giai đoạn 3: Hỗ trợ sau trúng tuyển",
      items: [
        "Tư vấn chọn trường nhập học tối ưu nhất.",
        "Hỗ trợ thủ tục xin Visa, đặt vé máy bay và tìm nhà ở.",
        "Hướng dẫn hành trang trước khi bay (Pre-departure).",
      ],
    },
  ];

  return (
    <section id="dich-vu" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeading subtitle="Giải Pháp Của Chúng Tôi" dark={true}>
          Dịch Vụ Cung Cấp
        </SectionHeading>

        {/* Tab Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-slate-100 p-1 rounded-full flex gap-2">
            <button
              onClick={() => setActiveServiceTab("comprehensive")}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                activeServiceTab === "comprehensive"
                  ? "bg-white shadow text-blue-600"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Gói Toàn Diện 1-1
            </button>
            <button
              onClick={() => setActiveServiceTab("essay")}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                activeServiceTab === "essay"
                  ? "bg-white shadow text-blue-600"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Gói Sửa Luận (Lẻ)
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {activeServiceTab === "comprehensive" ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden"
            >
              {/* --- HEADER SECTION --- */}
              <div className={`p-8 ${BRAND_COLORS.primaryGradient}`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-cyan-100">
                      Gói Tư Vấn Toàn Diện 1-1
                    </h3>
                    <p className="text-white opacity-90 text-sm md:text-base font-medium">
                      Đồng hành 1-1 trong vòng 1 năm (8 - 16 tháng) cho 1 kỳ
                      tuyển sinh.
                    </p>
                  </div>
                  <div className="hidden md:block">
                    <GraduationCap
                      size={64}
                      className="text-white opacity-30"
                    />
                  </div>
                </div>
                <div className="mt-4 inline-block text-xs font-semibold uppercase tracking-wider text-white">
                  Áp dụng cho: Vùng A (Mỹ), Vùng B (Châu Á), Vùng C (Âu, Úc,
                  Canada)
                </div>
              </div>

              {/* --- BODY SECTION (3 PHASES) --- */}
              <div className="p-8 bg-slate-50/50">
                <div className="space-y-8 relative">
                  {/* Vertical Line for Timeline Effect (Optional) */}
                  <div className="absolute left-[15px] top-4 bottom-0 w-0.5 bg-slate-200 hidden md:block"></div>

                  {comprehensivePhases.map((phase, index) => (
                    <div key={index} className="relative md:pl-10">
                      {/* Number/Dot Badge */}
                      <div className="hidden md:flex absolute left-0 top-0 w-8 h-8 rounded-full bg-white border-4 border-blue-100 items-center justify-center font-bold text-blue-600 text-sm z-10 shadow-sm">
                        {index + 1}
                      </div>

                      <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <span className="md:hidden bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                          GĐ {index + 1}
                        </span>
                        {phase.title}
                      </h4>

                      <ul className="space-y-3">
                        {phase.items.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-3 text-sm text-slate-600 leading-relaxed"
                          >
                            <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* --- FOOTER/PRICING NOTE --- */}
              <div className="p-8 border-t border-slate-100 bg-white text-center">
                <p className="text-slate-500 text-sm mb-6 italic">
                  * Chi phí linh hoạt dựa trên số lượng trường (3 - 20 trường)
                  và vùng địa lý.
                </p>
                <button
                  className={`${BRAND_COLORS.primaryGradient} text-white px-10 py-4 rounded-full font-bold shadow-lg hover:shadow-blue-500/30 transition-all hover:-translate-y-1 w-full md:w-auto`}
                >
                  Đăng Ký Nhận Báo Giá Chi Tiết
                </button>
              </div>
            </motion.div>
          ) : (
            // Gói Lẻ Sửa Luận (Giữ nguyên hoặc cập nhật nhẹ)
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden"
            >
              <div className="p-8 bg-slate-900 text-white flex justify-between items-center flex-wrap gap-4">
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-white">
                    Gói Lẻ Sửa Luận Chính
                  </h3>
                  <p className="text-white opacity-80">
                    Dành cho bạn đã có hồ sơ, cần tối ưu bài luận.
                  </p>
                </div>
                <div className="text-3xl font-bold text-amber-400">
                  16.500.000 VNĐ
                </div>
              </div>
              <div className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-amber-500" /> Khám Phá
                      & Ý Tưởng
                    </h4>
                    <ul className="space-y-3 text-sm text-slate-600">
                      <li className="flex gap-2">
                        <CheckCircle2
                          size={16}
                          className="text-blue-500 mt-1"
                        />{" "}
                        Làm bài test cá nhân (Sở thích, tính cách).
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2
                          size={16}
                          className="text-blue-500 mt-1"
                        />{" "}
                        Cố vấn 1-1 phân tích và chọn hướng viết.
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2
                          size={16}
                          className="text-blue-500 mt-1"
                        />{" "}
                        Gợi ý 5 ý tưởng bài luận độc đáo.
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-blue-500" /> Hoàn
                      Thiện
                    </h4>
                    <ul className="space-y-3 text-sm text-slate-600">
                      <li className="flex gap-2">
                        <CheckCircle2
                          size={16}
                          className="text-blue-500 mt-1"
                        />{" "}
                        Lên dàn ý chi tiết cho ý tưởng tốt nhất.
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2
                          size={16}
                          className="text-blue-500 mt-1"
                        />
                        <b>Sửa không giới hạn</b> (nội dung, logic).
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2
                          size={16}
                          className="text-blue-500 mt-1"
                        />{" "}
                        Đảm bảo dấu ấn cá nhân "Future by Design".
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="mt-8 text-center pt-8 border-t border-slate-100">
                  <button
                    className={`${BRAND_COLORS.primaryGradient} text-white px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl`}
                  >
                    Đăng Ký Gói Sửa Luận
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
