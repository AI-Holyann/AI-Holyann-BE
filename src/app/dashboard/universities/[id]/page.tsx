"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import AuthHeader from "@/components/dashboard/AuthHeader";
import {
  ArrowLeft,
  MapPin,
  GraduationCap,
  Award,
  Building2,
  Calendar,
  ExternalLink,
  FileText,
  Sparkles,
  Clock,
  Globe,
} from "lucide-react";

interface Scholarship {
  id: string;
  name: string;
  description: string | null;
  deadline: string | null;
  url_web: string | null;
}

interface Faculty {
  id: string;
  name: string;
  description: string | null;
  type: string | null;
  url_web: string | null;
}

interface UniversityDetail {
  id: string;
  name: string;
  country: string | null;
  description: string | null;
  detail_information: string | null;
  deadline: {
    ED?: string;
    RD?: string;
    EA?: string;
  } | null;
  requirements: string | null;
  status: string | null;
  rank: number | null;
  url_link: string | null;
  image_display_url: string | null;
  scholarships: Scholarship[];
  faculties: Faculty[];
}

export default function UniversityDetailPage() {
  const router = useRouter();
  const params = useParams();
  const universityId = params.id as string;

  const [university, setUniversity] = useState<UniversityDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (universityId) {
      fetchUniversityDetail();
    }
  }, [universityId]);

  const fetchUniversityDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/universities/${universityId}`);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch university details");
      }

      setUniversity(result.data);
    } catch (error: any) {
      console.error("Error fetching university details:", error);
      toast.error("Không thể tải thông tin trường đại học", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <>
        <AuthHeader />
        <main className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300 pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-indigo-200 dark:border-indigo-800 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin"></div>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (!university) {
    return (
      <>
        <AuthHeader />
        <main className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300 pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-20">
              <GraduationCap className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Không tìm thấy thông tin trường đại học
              </p>
              <button
                onClick={() => router.push("/dashboard/universities")}
                className="mt-4 px-6 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
              >
                Quay lại danh sách
              </button>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <AuthHeader />
      <main className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Quay lại</span>
          </button>

          {/* University Header */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 mb-8">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Image */}
              {university.image_display_url && (
                <div className="w-full md:w-64 h-48 rounded-xl overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex-shrink-0">
                  <img
                    src={university.image_display_url}
                    alt={university.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">
                      {university.name}
                    </h1>
                    <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                      {university.country && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{university.country}</span>
                        </div>
                      )}
                      {university.rank && (
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                          <span className="font-semibold">Rank #{university.rank}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {university.url_link && (
                    <a
                      href={university.url_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
                    >
                      <Globe className="w-4 h-4" />
                      <span className="text-sm font-medium">Website</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>

                {university.description && (
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {university.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Detail Information */}
              {university.detail_information && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    Thông Tin Chi Tiết
                  </h2>
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                      {university.detail_information}
                    </p>
                  </div>
                </div>
              )}

              {/* Requirements */}
              {university.requirements && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    Yêu Cầu Đầu Vào
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {university.requirements}
                  </p>
                </div>
              )}

              {/* Faculties */}
              {university.faculties.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    Các Khoa ({university.faculties.length})
                  </h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    {university.faculties.map((faculty) => (
                      <div
                        key={faculty.id}
                        className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600"
                      >
                        <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">
                          {faculty.name}
                        </h3>
                        {faculty.type && (
                          <span className="inline-block px-2 py-1 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded text-xs font-semibold mb-2">
                            {faculty.type}
                          </span>
                        )}
                        {faculty.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                            {faculty.description}
                          </p>
                        )}
                        {faculty.url_web && (
                          <a
                            href={faculty.url_web}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                          >
                            Xem thêm <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Deadlines */}
              {university.deadline && Object.keys(university.deadline).length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-red-600 dark:text-red-400" />
                    Deadline
                  </h2>
                  <div className="space-y-3">
                    {university.deadline.ED && (
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-red-700 dark:text-red-300">Early Decision (ED)</span>
                          <span className="text-sm text-red-600 dark:text-red-400 font-medium">
                            {formatDate(university.deadline.ED)}
                          </span>
                        </div>
                      </div>
                    )}
                    {university.deadline.EA && (
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-blue-700 dark:text-blue-300">Early Action (EA)</span>
                          <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                            {formatDate(university.deadline.EA)}
                          </span>
                        </div>
                      </div>
                    )}
                    {university.deadline.RD && (
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-green-700 dark:text-green-300">Regular Decision (RD)</span>
                          <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                            {formatDate(university.deadline.RD)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Scholarships */}
              {university.scholarships.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    Học Bổng ({university.scholarships.length})
                  </h2>
                  <div className="space-y-4">
                    {university.scholarships.map((scholarship) => (
                      <div
                        key={scholarship.id}
                        className="p-4 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800"
                      >
                        <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">
                          {scholarship.name}
                        </h3>
                        {scholarship.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                            {scholarship.description}
                          </p>
                        )}
                        {scholarship.deadline && (
                          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 mb-2">
                            <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                            <span className="font-semibold">Deadline:</span>
                            <span>{formatDate(scholarship.deadline)}</span>
                          </div>
                        )}
                        {scholarship.url_web && (
                          <a
                            href={scholarship.url_web}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-yellow-700 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-300 font-medium"
                          >
                            Xem thông tin <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
