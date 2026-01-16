"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import AuthHeader from "@/components/dashboard/AuthHeader";
import {
  Search,
  MapPin,
  GraduationCap,
  Award,
  Building2,
  Filter,
  X,
  ExternalLink,
  Sparkles,
} from "lucide-react";

interface University {
  id: string;
  name: string;
  country: string | null;
  description: string | null;
  rank: number | null;
  status: string | null;
  url_link: string | null;
  image_display_url: string | null;
  scholarships_count: number;
  faculties_count: number;
}

export default function UniversitiesPage() {
  const router = useRouter();
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [countries, setCountries] = useState<string[]>([]);

  useEffect(() => {
    fetchUniversities();
  }, [selectedCountry]);

  const fetchUniversities = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCountry) {
        params.append("country", selectedCountry);
      }

      const response = await fetch(`/api/universities?${params.toString()}`);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch universities");
      }

      setUniversities(result.data || []);
      
      // Extract unique countries
      const uniqueCountries = Array.from(
        new Set(
          result.data
            .map((u: University) => u.country)
            .filter((c: string | null) => c !== null)
        )
      ) as string[];
      setCountries(uniqueCountries.sort());
    } catch (error: any) {
      console.error("Error fetching universities:", error);
      toast.error("Không thể tải danh sách trường", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredUniversities = universities.filter((uni) => {
    const matchesSearch =
      !searchQuery ||
      uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      uni.country?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <>
      <AuthHeader />
      <main className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
                  Danh Sách Trường Đại Học
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Khám phá các trường đại học phù hợp với bạn
                </p>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm trường đại học..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <select
                  value={selectedCountry || ""}
                  onChange={(e) =>
                    setSelectedCountry(e.target.value || null)
                  }
                  className="appearance-none pl-4 pr-10 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent cursor-pointer"
                >
                  <option value="">Tất cả quốc gia</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
                <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5 pointer-events-none" />
              </div>
              {selectedCountry && (
                <button
                  onClick={() => setSelectedCountry(null)}
                  className="px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Xóa bộ lọc
                </button>
              )}
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Tìm thấy <span className="font-bold text-indigo-600 dark:text-indigo-400">{filteredUniversities.length}</span> trường đại học
            </p>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-indigo-200 dark:border-indigo-800 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin"></div>
            </div>
          ) : filteredUniversities.length === 0 ? (
            <div className="text-center py-20">
              <GraduationCap className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Không tìm thấy trường đại học nào
              </p>
            </div>
          ) : (
            /* Universities Grid */
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredUniversities.map((uni) => (
                <div
                  key={uni.id}
                  onClick={() => router.push(`/dashboard/universities/${uni.id}`)}
                  className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group overflow-hidden"
                >
                  {/* University Image */}
                  {uni.image_display_url && (
                    <div className="relative w-full h-40 mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30">
                      <img
                        src={uni.image_display_url}
                        alt={uni.name}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                  )}

                  {/* University Info */}
                  <div className="mb-4">
                    <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                      {uni.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span>{uni.country || "N/A"}</span>
                    </div>
                    {uni.rank && (
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-lg text-xs font-bold">
                        <Sparkles className="w-3 h-3" />
                        Rank #{uni.rank}
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Award className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <span className="font-semibold">{uni.scholarships_count}</span>
                      <span className="text-xs">học bổng</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="font-semibold">{uni.faculties_count}</span>
                      <span className="text-xs">khoa</span>
                    </div>
                  </div>

                  {/* View Details Link */}
                  <div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">
                      Xem chi tiết
                    </span>
                    <ExternalLink className="w-4 h-4 text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
