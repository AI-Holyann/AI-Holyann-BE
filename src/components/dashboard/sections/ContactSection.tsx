"use client";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

export default function ContactSection() {
  const socials = [
    { name: "facebook", color: "#1877F2" },
    { name: "instagram", color: "#E4405F" },
    { name: "linkedin", color: "#0077B5" },
    { name: "twitter", color: "#1DA1F2" },
  ];

  return (
    <div className="h-full">
      <SectionHeading subtitle="Liên Hệ" dark={true}>
        Kết Nối Với Chúng Tôi
      </SectionHeading>
      <div className="mt-6">
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 rounded-xl p-5 shadow-lg border border-slate-200 dark:border-slate-600"
          >
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-600" />
              Thông Tin Liên Hệ
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-white mb-0.5">
                    Địa chỉ:
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Tầng 12, Tòa nhà TechHub, 11 Duy Tân, Cầu Giấy, HN
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-white mb-0.5">
                    Hotline:
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    1900 123 456
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-white mb-0.5">
                    Email:
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    support@holyann.vn
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
