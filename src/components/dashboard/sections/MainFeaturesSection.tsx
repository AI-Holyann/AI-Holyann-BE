"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  FileText,
  Brain,
  GraduationCap,
  MessageCircle,
  FileEdit,
  ArrowRight,
} from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

export default function MainFeaturesSection() {
  const features = [
    {
      id: 1,
      title: "Phân tích hồ sơ cá nhân",
      description: "Đánh giá SWOT và phân tích điểm mạnh, điểm yếu của bạn",
      icon: FileText,
      href: "/dashboard/profile",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
    },
    {
      id: 2,
      title: "Khám phá bản thân",
      description: "Làm 3 bài test: RIASEC, MBTI, Grit Scale để hiểu rõ bản thân",
      icon: Brain,
      href: "/dashboard/tests",
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
    },
    {
      id: 3,
      title: "Gợi ý trường học",
      description: "Top trường DREAM, MATCH, SAFETY phù hợp với profile của bạn",
      icon: GraduationCap,
      href: "/dashboard/profile/schools",
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50",
    },
    {
      id: 4,
      title: "Trao đổi với mentor",
      description: "Chat trực tiếp với mentor để nhận tư vấn chuyên sâu",
      icon: MessageCircle,
      href: "/dashboard/chat",
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-50 to-red-50",
    },
    {
      id: 5,
      title: "Cải thiện hồ sơ",
      description: "Cải thiện CV và luận văn với AI hỗ trợ",
      icon: FileEdit,
      href: "/dashboard/profile/improve",
      gradient: "from-indigo-500 to-blue-500",
      bgGradient: "from-indigo-50 to-blue-50",
    },
  ];

  return (
    <section className="py-12 bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/30 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4">
        <SectionHeading subtitle="Chức Năng" dark={true}>
          Tính Năng Chính
        </SectionHeading>
        <p className="text-center text-slate-600 dark:text-slate-300 mb-8 text-base max-w-2xl mx-auto">
          Khám phá các công cụ mạnh mẽ giúp bạn xây dựng hồ sơ du học hoàn hảo
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-7xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative bg-white dark:bg-slate-700 rounded-xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 dark:border-slate-600 overflow-hidden h-full flex flex-col"
              >
                {/* Background gradient on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-0 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity duration-300`}
                />

                <div className="relative z-10 flex flex-col h-full">
                  {/* Icon */}
                  <div
                    className={`w-14 h-14 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg mx-auto`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-center">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-xs mb-4 leading-relaxed text-center flex-grow">
                    {feature.description}
                  </p>

                  {/* Quick Access Button */}
                  <Link
                    href={feature.href}
                    className="inline-flex items-center justify-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:gap-3 transition-all mt-auto"
                  >
                    Truy cập
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
