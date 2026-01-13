"use client";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

export default function LatestNewsSection() {
  const newsItems = [
    "Deadline học bổng Mỹ - Fall 2024",
    "Sự kiện Triển lãm Du học Anh Quốc",
    "Kinh nghiệm phỏng vấn Visa J-1",
  ];

  return (
    <div className="h-full">
      <SectionHeading subtitle="Thông Tin" dark={true}>
        Thông Tin Mới Nhất
      </SectionHeading>
      <div className="mt-6">
        <div className="flex flex-col gap-3">
            {newsItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -3, scale: 1.02 }}
                className="bg-white dark:bg-slate-700 rounded-lg p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-600 cursor-pointer group flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-slate-600 flex items-center justify-center group-hover:bg-blue-500 transition-colors shrink-0">
                  <Clock className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <p className="text-slate-900 dark:text-white font-semibold text-xs group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex-1">
                  {item}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
  );
}
