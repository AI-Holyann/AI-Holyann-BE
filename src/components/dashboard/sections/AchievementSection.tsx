"use client";
import { motion } from "framer-motion";
import { GraduationCap, Globe } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

export default function AchievementSection() {
  return (
    <div className="h-full">
      <SectionHeading subtitle="Thành Tựu" dark={true}>
        Thành Tựu Nổi Bật
      </SectionHeading>
      <div className="grid grid-cols-2 gap-4 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-800 dark:to-slate-700 rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100 dark:border-slate-600 text-center"
          >
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg mx-auto mb-3">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-1">
              2,500+
            </div>
            <div className="text-slate-600 dark:text-slate-300 text-sm font-medium">
              học viên trúng tuyển
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 border border-cyan-100 dark:border-slate-600 text-center"
          >
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg mx-auto mb-3">
              <Globe className="w-7 h-7 text-white" />
            </div>
            <div className="text-4xl font-extrabold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-1">
              15+
            </div>
            <div className="text-slate-600 dark:text-slate-300 text-sm font-medium">
              Quốc gia hỗ trợ
            </div>
          </motion.div>
        </div>
      </div>
  );
}
