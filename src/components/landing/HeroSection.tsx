"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plane, GraduationCap } from "lucide-react";
import { BRAND_COLORS } from "../../lib/data";
import Link from "next/link";
import Image from "next/image";
import AnimatedText from "../ui/AnimatedText";

export default function HeroSection() {
  const studentImages = [
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop", // Diverse students
    "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&h=600&fit=crop", // Students studying
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop", // Group of students
    "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&h=600&fit=crop", // University students
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=600&fit=crop", // Study abroad
  ];

  const [heroImage, setHeroImage] = useState<string>(studentImages[0]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  // Preload image when heroImage changes
  useEffect(() => {
    setImageLoaded(false);
    const img = new window.Image();
    img.src = heroImage;
    img.onload = () => setImageLoaded(true);
    img.onerror = () => setImageLoaded(true); // Still show placeholder on error
  }, [heroImage]);

  // Auto-change image every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % studentImages.length;
        setHeroImage(studentImages[nextIndex]);
        return nextIndex;
      });
    }, 5000); // 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative pt-20 pb-12 md:pt-32 md:pb-20 lg:pt-40 lg:pb-24 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-100/40 via-cyan-100/20 to-transparent opacity-60 skew-x-12 translate-x-20 z-0 hidden md:block"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-6 md:gap-8 lg:gap-12">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 text-center lg:text-left order-2 lg:order-1"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-wider mb-6 shadow-sm`}
            >
              <Plane className="w-4 h-4 rotate-45" /> Future by Design
            </motion.div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight text-slate-900 mb-4 md:mb-6 break-words">
              <div className="block mb-1 md:mb-2">
                <AnimatedText text="Vẽ Đường Tương Lai" delay={0.2} />
              </div>
              <div className="block">
                <AnimatedText
                  text="Định Hình Ngày Mai"
                  className={BRAND_COLORS.textGradient}
                  delay={0.8}
                />
              </div>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="text-base sm:text-lg md:text-xl text-slate-600 mb-6 md:mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0"
            >
              Holyann Explore trao cho bạn một chiếc chìa khóa vạn năng để bạn
              có thể tự tin mở cánh cửa tương lai và kiến tạo thành công rực rỡ
              của riêng mình.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start w-full sm:w-auto"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto"
              >
                <Link
                  href="/dashboard"
                  className={`${BRAND_COLORS.primaryGradient} text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold shadow-lg hover:shadow-blue-500/50 transition-all hover:-translate-y-1 inline-flex items-center justify-center gap-2 w-full sm:w-auto text-sm sm:text-base`}
                >
                  Khám Phá Ngay
                  <Plane className="w-4 h-4" />
                </Link>
              </motion.div>
              <motion.button
                onClick={() =>
                  document
                    .getElementById("gioi-thieu")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-slate-700 bg-white border-2 border-slate-200 hover:bg-slate-50 hover:border-blue-400 hover:shadow-lg transition-all w-full sm:w-auto text-sm sm:text-base"
              >
                Tìm Hiểu Thêm
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-full lg:w-1/2 relative order-1 lg:order-2 mb-6 lg:mb-0"
          >
            <motion.div
              className="relative aspect-[4/3] sm:aspect-square lg:aspect-[4/3] rounded-2xl md:rounded-3xl overflow-hidden shadow-xl md:shadow-2xl bg-slate-200 group cursor-pointer hover:shadow-2xl"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-slate-900/20 to-transparent z-10 group-hover:from-slate-900/40 group-hover:via-slate-900/15 transition-all duration-300"></div>
              <motion.div
                className="absolute inset-0"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <AnimatePresence mode="wait">
                  {imageLoaded && (
                    <motion.div
                      key={heroImage}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={heroImage}
                        alt="Học sinh du học"
                        fill
                        className="object-cover group-hover:brightness-110 transition-all duration-300"
                        priority
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw"
                        unoptimized
                        onLoad={() => setImageLoaded(true)}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src =
                            "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop";
                          setImageLoaded(true); // Still show image even on error
                        }}
                      />
                    </motion.div>
                  )}
                  {!imageLoaded && (
                    <div className="absolute inset-0 bg-slate-200 animate-pulse" />
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>

            {/* Floating Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20, x: -20 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              whileHover={{
                scale: 1.05,
                y: -5,
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
              className="group absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 lg:-bottom-6 lg:-left-6 bg-white p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl z-20 max-w-[280px] sm:max-w-xs hidden sm:block border border-slate-100 cursor-pointer transition-all duration-300 hover:border-blue-300"
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <motion.div
                  className="bg-gradient-to-br from-amber-100 to-amber-200 p-2 sm:p-2.5 rounded-full shadow-sm"
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <GraduationCap className="text-amber-600 w-4 h-4 sm:w-5 sm:h-5" />
                </motion.div>
                <span className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-blue-600 transition-colors duration-300">
                  Săn Học Bổng
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Đồng hành chinh phục các trường TOP đầu thế giới.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
