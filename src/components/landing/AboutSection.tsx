"use client";
import React from "react";
import { Globe, MapPin } from "lucide-react";
import FadeInView from "../../components/ui/FadeInView"; // Đường dẫn tương đối đã sửa
import SectionHeading from "../../components/ui/SectionHeading"; // Đường dẫn tương đối đã sửa
import { CORE_VALUES, BRAND_COLORS } from "../../lib/data"; // Đường dẫn tương đối đã sửa

export default function AboutSection() {
  return (
    <section id="gioi-thieu" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeading subtitle="Về Chúng Tôi">
          Sứ Mệnh & Giá Trị
        </SectionHeading>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          {/* Text Content */}
          <FadeInView>
            <h3 className="text-2xl font-bold mb-4 text-slate-800">
              Ý Nghĩa Tên Gọi
            </h3>
            <ul className="space-y-4 text-slate-600">
              <li className="flex gap-4">
                <span className="font-bold text-[var(--brand-blue)] min-w-[80px]">
                  HOLYANN:
                </span>
                {/* Đã thay "Holy" và "Ann" thành &quot;...&quot; */}
                <span>
                  Kết hợp từ &quot;Holy&quot; (thiêng liêng, uy tín) và
                  &quot;Ann&quot; (tinh tế, tận tâm). Thể hiện cam kết chất
                  lượng chuẩn mực.
                </span>
              </li>
              <li className="flex gap-4">
                <span className="font-bold text-[var(--brand-cyan)] min-w-[80px]">
                  EXPLORE:
                </span>
                <span>
                  Tinh thần học hỏi không ngừng, tối ưu hóa cơ hội phát triển cá
                  nhân và hội nhập quốc tế.
                </span>
              </li>
            </ul>
            <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-l-4 border-[var(--brand-blue)]">
              <p className="text-slate-700 leading-relaxed italic">
                <span className="font-bold text-[var(--brand-blue)]">
                  &quot;Holyann Explore&quot;
                </span>{" "}
                là kim chỉ nam cho chúng tôi để giúp học sinh, sinh viên không
                chỉ phát triển bản thân mà còn có thể tự tin hội nhập, tiếp cận
                với những cơ hội trên phạm vi quốc tế.
              </p>
            </div>
          </FadeInView>

          {/* Cards Content */}
          <FadeInView delay={0.2}>
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 relative overflow-hidden">
              <div className="relative z-10">
                <h4 className="font-bold text-xl mb-2 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-[var(--tw-blue-500)]" /> Tầm
                  Nhìn
                </h4>
                {/* Đã thêm &quot; vào đầu và cuối câu */}
                <p className="text-slate-600 mb-6 italic">
                  &quot;Dẫn đầu trong lĩnh vực cung cấp dịch vụ về các chương
                  trình học tập và trải nghiệm quốc tế.&quot;
                </p>

                <h4 className="font-bold text-xl mb-2 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[var(--accent)]" /> Sứ Mệnh
                </h4>
                {/* Đã thêm &quot; vào đầu và cuối câu */}
                <p className="text-slate-600 italic">
                  &quot;Trở thành người bạn đồng hành sát sao, xây dựng cộng
                  đồng kết nối để học viên học hỏi từ người đi trước.&quot;
                </p>
              </div>
            </div>
          </FadeInView>
        </div>

        {/* Core Values Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CORE_VALUES.map((val, idx) => (
            <FadeInView key={idx} delay={idx * 0.1}>
              <div className="group p-6 rounded-xl bg-white border border-slate-100 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 h-full">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform ${BRAND_COLORS.primaryGradient}`}
                >
                  <val.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-3 text-slate-900">
                  {val.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {val.desc}
                </p>
              </div>
            </FadeInView>
          ))}
        </div>
      </div>
    </section>
  );
}
