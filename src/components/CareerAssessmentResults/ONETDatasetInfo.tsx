"use client";

import React from "react";
import { ExternalLink, Database, Info } from "lucide-react";

export function ONETDatasetInfo() {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
      <div className="flex items-start gap-3">
        <div className="shrink-0 mt-0.5">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
            <Database className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
              Về dữ liệu nghề nghiệp
            </h4>
          </div>
          <p className="text-xs text-gray-700 dark:text-gray-300 mb-2 leading-relaxed">
            Dữ liệu nghề nghiệp được phân tích dựa trên{" "}
            <span className="font-medium text-blue-700 dark:text-blue-400">
              O*NET Database
            </span>
            , hệ thống thông tin nghề nghiệp toàn diện của Bộ Lao động Hoa Kỳ, 
            cung cấp thông tin chi tiết về hàng nghìn nghề nghiệp.
          </p>
          <a
            href="https://www.onetcenter.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            <span>Tìm hiểu thêm về O*NET</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
