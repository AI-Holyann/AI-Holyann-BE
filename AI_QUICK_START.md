# Quick Start: AI Profile Analysis

## 🚀 Cách Sử Dụng Nhanh

### 1. Khởi động Django Server
```bash
cd d:\server-ai\holyann
python manage.py runserver
```

### 2. Khởi động Next.js Web (terminal khác)
```bash
cd d:\holyann-ai-web
npm run dev
```

### 3. Truy cập & Test
1. Mở browser: http://localhost:3000
2. Đăng nhập vào hệ thống
3. Vào trang **Profile**
4. Click button **"Phân tích hồ sơ AI"** (màu tím-xanh)
5. Xem kết quả phân tích SWOT, Spike, Regional Scores

## ⚙️ Configuration

File `.env.local`:
```bash
DJANGO_API_URL=http://localhost:8000
```

## 📊 Kết Quả Phân Tích

Modal hiển thị:
- ✅ **Spike Analysis**: Điểm nổi bật của hồ sơ
- 💪 **SWOT**: Strengths, Weaknesses, Opportunities, Threats
- 🌍 **Regional Scores**: US, UK, Canada, Australia compatibility scores
- 💡 **Recommendations**: Khuyến nghị cải thiện

## 🔧 Troubleshooting

**Lỗi connection**: Django server chưa chạy → Run `python manage.py runserver`  
**Lỗi validation**: Thiếu dữ liệu → Nhập đầy đủ GPA, awards, projects trong form

## 📁 Files

- API Route: `src/app/api/students/[student_id]/analyze-profile/route.ts`
- Modal: `src/components/ProfileAnalysisModal.tsx`
- Button: `src/components/dashboard/Profile/ProfilePage.tsx`
- Docs: `AI_PROFILE_ANALYSIS_INTEGRATION.md`

---

**Status**: ✅ Ready to use
