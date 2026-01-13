"use client";

import React, { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { StudentProfile } from "../../types"; // Hãy đảm bảo đường dẫn này đúng với dự án của bạn

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: StudentProfile;
  onSave: (updatedProfile: StudentProfile) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onSave,
}) => {
  const [formData, setFormData] = useState<StudentProfile>(currentProfile);

  // Sync state when profile changes
  useEffect(() => {
    setFormData(currentProfile);
  }, [currentProfile]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAchievementChange = (index: number, value: string) => {
    const newAchievements = [...formData.achievements];
    newAchievements[index] = value;
    setFormData((prev) => ({ ...prev, achievements: newAchievements }));
  };

  const addAchievement = () => {
    setFormData((prev) => ({
      ...prev,
      achievements: [...prev.achievements, ""],
    }));
  };

  const removeAchievement = (index: number) => {
    const newAchievements = formData.achievements.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, achievements: newAchievements }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop with blur */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
        onClick={onClose}
      ></div>

      {/* Modal Panel */}
      <div className="relative inline-block align-middle bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:max-w-2xl w-full mx-4">
        <div className="bg-[var(--brand-blue)] px-4 py-3 sm:px-6 flex justify-between items-center">
          <h3
            className="text-lg leading-6 font-medium text-white"
            id="modal-title"
          >
            Cập nhật hồ sơ du học
          </h3>
          <button
            onClick={onClose}
            className="text-blue-200 hover:text-white focus:outline-none"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[80vh] overflow-y-auto">
          <div className="px-4 py-5 sm:p-6 space-y-6">
            {/* Academic Stats Section */}
            <div>
              <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Thông tin học thuật
              </h4>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="gpa"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    GPA (Thang 4.0)
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="gpa"
                      id="gpa"
                      step="0.01"
                      max="4.0"
                      required
                      value={formData.gpa}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-[var(--brand-blue)] focus:border-[var(--brand-blue)] block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md p-2 border"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="englishLevel"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Trình độ Ngoại ngữ
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="englishLevel"
                      id="englishLevel"
                      placeholder="VD: IELTS 7.5, TOEFL 100..."
                      required
                      value={formData.englishLevel}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-[var(--brand-blue)] focus:border-[var(--brand-blue)] block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 rounded-md p-2 border"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="satScore"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Điểm SAT (Nếu có)
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="satScore"
                      id="satScore"
                      value={formData.satScore || ""}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-[var(--brand-blue)] focus:border-[var(--brand-blue)] block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md p-2 border"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="targetMajor"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Ngành học dự kiến
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="targetMajor"
                      id="targetMajor"
                      value={formData.targetMajor}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-[var(--brand-blue)] focus:border-[var(--brand-blue)] block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md p-2 border"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4"></div>

            {/* Achievements Section */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Thành tích nổi bật
                </h4>
                <button
                  type="button"
                  onClick={addAchievement}
                  className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none"
                >
                  <Plus size={14} className="mr-1" /> Thêm
                </button>
              </div>

              <div className="space-y-3">
                {formData.achievements.map((ach, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={ach}
                      onChange={(e) =>
                        handleAchievementChange(index, e.target.value)
                      }
                      placeholder="VD: Giải Nhất học sinh giỏi..."
                      className="flex-1 shadow-sm focus:ring-[var(--brand-blue)] focus:border-[var(--brand-blue)] block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 rounded-md p-2 border"
                    />
                    <button
                      type="button"
                      onClick={() => removeAchievement(index)}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-2"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t dark:border-gray-700">
            <button
              type="submit"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-yellow-500 text-base font-medium text-white hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Lưu hồ sơ
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Hủy bỏ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
