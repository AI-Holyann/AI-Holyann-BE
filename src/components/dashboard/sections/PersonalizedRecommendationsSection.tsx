"use client";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Award } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

export default function PersonalizedRecommendationsSection() {
  const recommendations = [
    {
      text: "Gợi ý lộ trình du học ngành Marketing",
      highlight: true,
      icon: BookOpen,
    },
    {
      text: "Top 5 học bổng cho sinh viên nghệ thuật",
      highlight: false,
      icon: Award,
    },
    {
      text: "Ebook: Bí quyết săn học bổng toàn phần",
      highlight: false,
      icon: BookOpen,
    },
  ];

  return (
    <div className="h-full">
      <SectionHeading subtitle="Gợi ý" dark={true}>
        Dành Cho Bạn
      </SectionHeading>
      <div className="mt-6">
        <div className="flex flex-col gap-3">
            {recommendations.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.a
                  key={idx}
                  href="#"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  whileHover={{ x: 3, scale: 1.02 }}
                  className="group relative flex items-center gap-3 w-full py-4 px-4 bg-white dark:bg-slate-700 rounded-lg text-slate-900 dark:text-white font-medium text-xs hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-600"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shrink-0">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="flex-1 text-left">
                    {item.highlight ? (
                      <>
                        Gợi ý lộ trình{" "}
                        <span className="font-bold text-blue-600 dark:text-blue-400">
                          du học ngành Marketing
                        </span>
                      </>
                    ) : (
                      item.text
                    )}
                  </span>
                  <ArrowRight className="w-4 h-4 text-blue-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0" />
                </motion.a>
              );
            })}
          </div>
        </div>
      </div>
  );
}
