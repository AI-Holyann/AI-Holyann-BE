# 🌟 Holyann AI Web - Du Học & Định Cư

Platform AI hỗ trợ du học và định cư toàn diện.

## 🎊 UPDATES

### ✅ **Latest Fixes (Jan 9, 2026)**
- 🔧 Fixed "permission denied" error when creating student profiles
- 🔧 Fixed "Unknown argument passion_score" in GRIT test submission
- 🔧 Fixed GRIT passion/perseverance scores displaying as 0 in charts
- 📚 See: [FIX_TEST_ERRORS_SUMMARY.md](./FIX_TEST_ERRORS_SUMMARY.md)

### 🎯 **Test Navigation Features**
- ✅ Navigate between questions freely with Previous/Next buttons
- ✅ Jump to any question using the Question List Panel
- ✅ Edit answers anytime before submitting
- ✅ Visual progress tracking with colored indicators
- 📖 Full guide: [NAVIGATION_USER_GUIDE.md](./NAVIGATION_USER_GUIDE.md)

---

## 🎊 NEW: Hệ Thống Phân Quyền (Role-Based Authentication)

Hệ thống phân quyền 3 vai trò đã được triển khai hoàn chỉnh:

### 👥 3 Vai Trò

- 👤 **User (Học viên)** → `/dashboard` - Dashboard cơ bản, checklist, tests
- 👨‍🏫 **Mentor** → `/dashboard/mentor` - Quản lý học viên, tư vấn, theo dõi tiến độ
- 👨‍💼 **Admin** → `/dashboard/admin` - Quản trị toàn bộ hệ thống

### 📚 Tài Liệu Chi Tiết

Vui lòng đọc các file documentation sau:

1. **[SUMMARY.md](./SUMMARY.md)** ⭐ **BẮT ĐẦU TẠI ĐÂY** - Tóm tắt toàn bộ
2. **[QUICK_START.md](./QUICK_START.md)** - Hướng dẫn nhanh + Troubleshooting
3. **[ROLE_SYSTEM_README.md](./ROLE_SYSTEM_README.md)** - Tài liệu kỹ thuật
4. **[CHANGELOG.md](./CHANGELOG.md)** - Lịch sử thay đổi
5. **[CHECKLIST.md](./CHECKLIST.md)** - Checklist testing

### 🚀 Chạy Thử Ngay

```bash
# Install dependencies (nếu chưa)
npm install

# Chạy development server
npm run dev

# Mở trình duyệt
# → http://localhost:3000
# → Vào /login
# → Chọn role (User/Mentor/Admin)
# → Test các dashboard!
```

### ✨ Features

- ✅ Đăng nhập/Đăng ký với chọn role
- ✅ Auto-redirect dựa trên role
- ✅ Route protection với RoleGuard
- ✅ 3 Dashboard UI riêng biệt
- ✅ Dark mode support
- ✅ Responsive design
- ✅ Mock data sẵn có để demo

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Font Awesome
- **State Management**: React Context API
- **Authentication**: Role-Based Access Control (RBAC)

---

## 📦 Project Structure

```
holyann-ai-web/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── dashboard/
│   │   │   ├── page.tsx       # User dashboard
│   │   │   ├── mentor/
│   │   │   │   └── page.tsx   # Mentor dashboard
│   │   │   └── admin/
│   │   │       └── page.tsx   # Admin dashboard
│   │   ├── login/
│   │   └── register/
│   ├── components/
│   │   ├── auth/
│   │   │   └── RoleGuard.tsx  # Route protection
│   │   └── dashboard/
│   │       ├── MentorDashboard.tsx
│   │       └── AdminDashboard.tsx
│   └── contexts/
│       └── AuthContext.tsx     # Auth state management
├── SUMMARY.md                  # ⭐ Start here!
├── QUICK_START.md
├── ROLE_SYSTEM_README.md
├── CHANGELOG.md
└── CHECKLIST.md
```

---

## 🎯 Routes

### Public Routes

- `/` - Landing page
- `/login` - Đăng nhập (với role selection)
- `/register` - Đăng ký (với role selection)

### Protected Routes (Authenticated)

- `/dashboard` - User dashboard (all roles)
- `/dashboard/mentor` - Mentor dashboard (mentor, admin only)
- `/dashboard/admin` - Admin dashboard (admin only)
- `/dashboard/profile` - User profile
- `/dashboard/tests` - Tests & assessments
- `/checklist` - Study abroad checklist

---

## 🔒 Authentication Flow

```
1. User → /login → Choose Role → Submit
2. AuthContext.login(email, name, role)
3. Save to localStorage
4. Auto redirect based on role:
   - user → /dashboard
   - mentor → /dashboard/mentor
   - admin → /dashboard/admin
5. RoleGuard protects routes
6. Unauthorized access → redirect to appropriate dashboard
```

---

## 💻 Development

### Prerequisites

- Node.js 18+
- npm hoặc yarn

### Setup

```bash
# Clone repository
git clone [repository-url]

# Install dependencies
npm install

# Run development server
npm run dev

# Open browser
# http://localhost:3000
```

### Build

```bash
# Production build
npm run build

# Start production server
npm start
```

### Lint & Format

```bash
# Run ESLint
npm run lint

# Type check
npx tsc --noEmit
```

---

## 📝 Notes

### Lưu Ý Quan Trọng

1. ⚠️ **Không push trực tiếp lên main branch**
2. ⚠️ Dữ liệu hiện tại là **mock data** cho demo
3. ⚠️ Cần tích hợp **backend API** thực tế
4. ⚠️ **LocalStorage** được dùng cho session (dev only)
5. ⚠️ Password không được **hash/encrypt**

### Production Checklist

- [ ] Integrate backend API
- [ ] Implement JWT authentication
- [ ] Add database storage
- [ ] Hash passwords
- [ ] Add email verification
- [ ] Setup CI/CD
- [ ] Add monitoring & logging
- [ ] Security audit

---

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m 'Add some feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Create Pull Request

---

## 📄 License

Copyright © 2025 Holyann Explore. All rights reserved.

---

## 🆘 Support

Nếu gặp vấn đề:

1. Check **[QUICK_START.md](./QUICK_START.md)** → Troubleshooting
2. Check browser console → Xem errors
3. Run `npm run build` → Check build errors
4. Clear cache: `rm -rf .next` → Rebuild

---

**📌 Quan trọng**: Đọc **[SUMMARY.md](./SUMMARY.md)** để hiểu đầy đủ về hệ thống phân quyền!

**🚀 Happy Coding!**

