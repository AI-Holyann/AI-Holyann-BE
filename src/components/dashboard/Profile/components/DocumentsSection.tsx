"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  GraduationCap,
  Target,
  UploadCloud,
  Trash2,
  File,
} from "lucide-react";
import { StudentProfile, DocumentType } from "../../../types";
import { StatusBadge } from "./StatusBadge";

interface DocumentsSectionProps {
  profile: StudentProfile;
  isComplete: boolean;
  onUploadDocument: (file: File, type: DocumentType) => void;
  onDeleteDocument: (id: string) => void;
}

export const DocumentsSection: React.FC<DocumentsSectionProps> = ({
  profile,
  isComplete,
  onUploadDocument,
  onDeleteDocument,
}) => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedDocType, setSelectedDocType] =
    useState<DocumentType>("transcript");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUploadDocument(e.target.files[0], selectedDocType);
    }
  };

  const triggerUpload = (type: DocumentType) => {
    setSelectedDocType(type);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const getDocTypeName = (type: DocumentType) => {
    switch (type) {
      case "transcript":
        return "Bảng điểm";
      case "certificate":
        return "Chứng chỉ";
      case "letter":
        return "Thư giới thiệu";
      case "essay":
        return "Bài luận";
      case "other":
        return "File khác";
      default:
        return "Khác";
    }
  };

  return (
    <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center bg-gray-50 dark:bg-slate-900">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <FileText
            className="text-gray-600 dark:text-slate-400"
            size={20}
          />
          TÀI LIỆU ĐÍNH KÈM
        </h3>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/dashboard/profile/schools")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg text-sm font-semibold hover:from-blue-600 hover:to-cyan-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <GraduationCap size={16} />
            Trường mục tiêu
          </button>
          <button
            onClick={() => router.push("/dashboard/profile/improve")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg text-sm font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <Target size={16} />
            Cải thiện hồ sơ
          </button>
          <StatusBadge isComplete={isComplete} />
        </div>
      </div>

      <div className="p-6">
        {/* Upload Area */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
          <button
            onClick={() => triggerUpload("transcript")}
            className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-blue-200 dark:border-blue-800 rounded-xl bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group"
          >
            <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center mb-2 shadow-sm text-blue-500 dark:text-blue-400 group-hover:scale-110 transition-transform">
              <UploadCloud size={20} />
            </div>
            <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">
              Tải lên Bảng điểm
            </span>
          </button>
          <button
            onClick={() => triggerUpload("certificate")}
            className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-purple-200 dark:border-purple-800 rounded-xl bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors group"
          >
            <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center mb-2 shadow-sm text-purple-500 dark:text-purple-400 group-hover:scale-110 transition-transform">
              <UploadCloud size={20} />
            </div>
            <span className="text-xs font-semibold text-purple-700 dark:text-purple-300">
              Tải lên Chứng chỉ
            </span>
          </button>
          <button
            onClick={() => triggerUpload("letter")}
            className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-green-200 dark:border-green-800 rounded-xl bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors group"
          >
            <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center mb-2 shadow-sm text-green-500 dark:text-green-400 group-hover:scale-110 transition-transform">
              <UploadCloud size={20} />
            </div>
            <span className="text-xs font-semibold text-green-700 dark:text-green-300">
              Thư giới thiệu
            </span>
          </button>
          <button
            onClick={() => triggerUpload("essay")}
            className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-orange-200 dark:border-orange-800 rounded-xl bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors group"
          >
            <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center mb-2 shadow-sm text-orange-500 dark:text-orange-400 group-hover:scale-110 transition-transform">
              <UploadCloud size={20} />
            </div>
            <span className="text-xs font-semibold text-orange-700 dark:text-orange-300">
              Bài luận mẫu
            </span>
          </button>
          <button
            onClick={() => triggerUpload("other")}
            className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors group"
          >
            <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center mb-2 shadow-sm text-gray-600 dark:text-slate-400 group-hover:scale-110 transition-transform">
              <UploadCloud size={20} />
            </div>
            <span className="text-xs font-semibold text-gray-700 dark:text-slate-300">
              File khác
            </span>
          </button>
        </div>

        {/* Document List */}
        <div className="border dark:border-slate-700 rounded-xl overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
            <thead className="bg-gray-50 dark:bg-slate-900">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider"
                >
                  Tên tài liệu
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider"
                >
                  Loại
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider"
                >
                  Ngày tải lên
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider"
                >
                  Kích thước
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Hành động</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
              {profile.documents.length > 0 ? (
                profile.documents.map((doc) => (
                  <tr
                    key={doc.id}
                    className="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="shrink-0 h-8 w-8 rounded bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-gray-500 dark:text-slate-400">
                          <File size={16} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-slate-200">
                            {doc.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-slate-200">
                        {getDocTypeName(doc.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">
                      {doc.uploadDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">
                      {doc.size}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => onDeleteDocument(doc.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-sm text-gray-400 dark:text-slate-500"
                  >
                    Chưa có tài liệu nào được tải lên. Hãy chọn các mục ở trên
                    để thêm tài liệu.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
