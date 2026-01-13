"use client";

import React from "react";
import { StudentProfile, DocumentType } from "../../types";
import { ProfileNavigation } from "./components/ProfileNavigation";
import { ProfileHeader } from "./components/ProfileHeader";
import { PersonalInfoCard } from "./components/PersonalInfoCard";
import { RadarChartCard } from "./components/RadarChartCard";
import { AcademicInfoSection } from "./components/AcademicInfoSection";
import { ActivitiesSection } from "./components/ActivitiesSection";
import { DocumentsSection } from "./components/DocumentsSection";

interface ProfilePageProps {
  profile: StudentProfile;
  onEditClick: () => void;
  onUploadDocument: (file: File, type: DocumentType) => void;
  onDeleteDocument: (id: string) => void;
  onAnalyzeProfile?: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  profile,
  onEditClick,
  onUploadDocument,
  onDeleteDocument,
  onAnalyzeProfile,
}) => {
  // Chart data
  const chartData = [
    {
      subject: "Học thuật",
      A: (profile.gpa / profile.gpaScale) * 100,
      fullMark: 100,
    },
    { subject: "Ngoại ngữ", A: 85, fullMark: 100 },
    {
      subject: "Hoạt động",
      A: Math.min(profile.extracurriculars.length * 20, 100),
      fullMark: 100,
    },
    {
      subject: "Thành tích",
      A: Math.min(profile.achievements.length * 25, 100),
      fullMark: 100,
    },
    { subject: "Kỹ năng mềm", A: 70, fullMark: 100 },
  ];

  // Helper checks for status
  const isPersonalComplete = Boolean(
    profile.name &&
      profile.email &&
      profile.phone &&
      profile.address &&
      profile.dob
  );
  const isAcademicComplete = Boolean(
    profile.gpa && profile.englishLevel && profile.targetMajor
  );
  const isActivitiesComplete =
    profile.extracurriculars.length > 0 && profile.achievements.length > 0;
  const isDocumentsComplete = profile.documents.length >= 2;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ProfileNavigation />

      <ProfileHeader
        onEditClick={onEditClick}
        onAnalyzeProfile={onAnalyzeProfile}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ================= LEFT COLUMN: PERSONAL INFO (3 cols) ================= */}
        <div className="lg:col-span-4 space-y-6">
          <PersonalInfoCard profile={profile} isComplete={isPersonalComplete} />

          <RadarChartCard profile={profile} chartData={chartData} />
        </div>

        {/* ================= RIGHT COLUMN: DETAILED SECTIONS (9 cols) ================= */}
        <div className="lg:col-span-8 space-y-8">
          <AcademicInfoSection
            profile={profile}
            isComplete={isAcademicComplete}
          />

          <ActivitiesSection
            profile={profile}
            isComplete={isActivitiesComplete}
          />

          <DocumentsSection
            profile={profile}
            isComplete={isDocumentsComplete}
            onUploadDocument={onUploadDocument}
            onDeleteDocument={onDeleteDocument}
          />
        </div>
      </div>
    </div>
  );
};
