"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function WelcomeSection() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight"
          >
            Chào mừng đến với Holyann Explore
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-white/90 mb-8 text-lg md:text-xl font-medium"
          >
            Nền tảng AI hàng đầu cho du học và định cư
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/login"
              className="px-8 py-3.5 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all shadow-lg hover:-translate-y-1 hover:shadow-xl"
            >
              Đăng nhập
            </Link>
            <Link
              href="/register"
              className="px-8 py-3.5 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all"
            >
              Đăng ký
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
