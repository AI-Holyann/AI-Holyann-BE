"use client";
import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import FadeInView from "@/components/ui/FadeInView";
import SectionHeading from "@/components/ui/SectionHeading";

import { HIGHLIGHTS } from "../../lib/data";

export default function HighlightsSection() {
  return (
    <section id="diem-noi-bat" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <SectionHeading subtitle="Tại Sao Chọn Chúng Tôi">
          Điểm Nổi Bật
        </SectionHeading>

        <div className="grid md:grid-cols-2 gap-8">
          {HIGHLIGHTS.map((item, idx) => (
            <FadeInView key={idx} delay={idx * 0.1}>
              <motion.div
                whileHover={{
                  scale: 1.02,
                  y: -5,
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="group flex gap-5 p-6 bg-white rounded-2xl shadow-sm h-full border border-transparent hover:border-blue-200 cursor-pointer"
              >
                <motion.div
                  className="shrink-0"
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <CheckCircle2 className="w-8 h-8 text-[var(--brand-cyan)] group-hover:text-[var(--brand-blue)] transition-colors duration-300" />
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors duration-300">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            </FadeInView>
          ))}
        </div>
      </div>
    </section>
  );
}
