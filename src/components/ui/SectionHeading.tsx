"use client";
import React from "react";
import { motion } from "framer-motion";
import { BRAND_COLORS } from "../../lib/data";

export default function SectionHeading({
  children,
  subtitle,
  dark = false,
}: {
  children: React.ReactNode;
  subtitle?: string;
  dark?: boolean;
}) {
  const textColor = dark ? "text-slate-900" : "text-blue-600";

  return (
    <div className="text-center mb-12">
      {subtitle && (
        <motion.span
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={`uppercase tracking-wider font-bold text-sm mb-3 block ${BRAND_COLORS.textGradient}`}
        >
          {subtitle}
        </motion.span>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className={`text-3xl md:text-4xl lg:text-5xl font-extrabold ${textColor} mb-4 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent`}
      >
        {children}
      </motion.h2>
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
        className="w-24 h-1.5 bg-gradient-to-r from-blue-400 via-blue-600 to-cyan-500 mx-auto mt-4 rounded-full"
      />
    </div>
  );
}
