"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { User, GraduationCap, Sparkles } from "lucide-react";

export const ProfileNavigation: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const navigationItems = [
    { name: "Hồ Sơ", href: "/dashboard/profile", icon: User },
    {
      name: "Trường Mục Tiêu",
      href: "/dashboard/profile/schools",
      icon: GraduationCap,
    },
    {
      name: "Cải Thiện Hồ Sơ",
      href: "/dashboard/profile/improve",
      icon: Sparkles,
    },
  ];

  return (
    <div className="mb-6">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-2">
        <div className="flex items-center gap-2">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = pathname === item.href;
            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className={`
                  flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200
                  ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                      : "text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white"
                  }
                `}
              >
                <IconComponent size={18} />
                {item.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
