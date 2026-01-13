"use client";
import React from "react";
import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";

const regions = [
  {
    name: "Hoa Kỳ",
    universities: [
      "Purdue Fort Wayne",
      "Sewanee",
      "DePauw University",
      "The College of Wooster",
    ],
  },
  {
    name: "Châu Á",
    universities: [
      "PolyU (HongKong)",
      "Yonsei (Hàn Quốc)",
      "HKUST",
      "National Tsing Hua",
    ],
  },
  {
    name: "Việt Nam",
    universities: [
      "VinUniversity",
      "Fulbright University",
      "RMIT",
      "British University (BUV)",
    ],
  },
  {
    name: "Châu Âu/Khác",
    universities: [
      "Univ. din București",
      "Bocconi University",
      "University of Greenwich",
      "Monash University",
    ],
  },
];

export default function AchievementsSection() {
  return (
    <section
      id="thanh-tich"
      className="py-20 bg-slate-900 text-white overflow-hidden"
    >
      <div className="container mx-auto px-4 text-center">
        <SectionHeading subtitle="Holie shinning stars" dark={false}>
          Dấu Ấn Thành Công
        </SectionHeading>
        <p className="text-slate-400 mb-12 max-w-2xl mx-auto">
          Học viên của chúng tôi đã chinh phục các học bổng và trường đại học
          danh giá trên toàn cầu.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 text-sm md:text-base font-semibold">
          {regions.map((region, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{
                scale: 1.05,
                y: -5,
              }}
              className="group flex flex-col gap-4 p-4 rounded-xl hover:bg-slate-800/50 transition-all duration-300 cursor-pointer"
            >
              <motion.span
                whileHover={{ scale: 1.1 }}
                className="text-blue-400 font-bold uppercase text-xs mb-2 tracking-widest border-b border-blue-900/50 pb-2 group-hover:border-blue-500 group-hover:text-cyan-400 transition-colors duration-300"
              >
                {region.name}
              </motion.span>
              {region.universities.map((university, uIdx) => (
                <motion.p
                  key={uIdx}
                  whileHover={{
                    x: 5,
                    color: "#60a5fa",
                  }}
                  className="text-slate-300 group-hover:text-slate-200 transition-colors duration-300 cursor-pointer"
                >
                  {university}
                </motion.p>
              ))}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
