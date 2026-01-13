"use client";
import WelcomeSection from "./sections/WelcomeSection";
import AchievementSection from "./sections/AchievementSection";
import MainFeaturesSection from "./sections/MainFeaturesSection";
import LatestNewsSection from "./sections/LatestNewsSection";
import ContactSection from "./sections/ContactSection";
import PersonalizedRecommendationsSection from "./sections/PersonalizedRecommendationsSection";

interface DashboardProps {
  userName: string;
}

export default function Dashboard({ userName }: DashboardProps) {
  const isAuthenticated = userName !== "Khách";

  return (
    <div className="w-full flex flex-col font-sans">
      {!isAuthenticated && <WelcomeSection />}
      <MainFeaturesSection />
      {/* 4 sections trong 1 hàng (grid 2x2) */}
      <section className="py-12 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto">
            <div className="md:col-span-1 bg-white dark:bg-slate-900 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-600">
              <AchievementSection />
            </div>
            <div className="md:col-span-1 bg-slate-50 dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-600">
              <LatestNewsSection />
            </div>
            <div className="md:col-span-1 bg-white dark:bg-slate-900 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-600">
              <ContactSection />
            </div>
            <div className="md:col-span-1 bg-slate-50 dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-600">
              <PersonalizedRecommendationsSection />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
