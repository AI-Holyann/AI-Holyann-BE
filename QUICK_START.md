# 🚀 Hướng Dẫn Sử Dụng Hệ Thống Phân Quyền - Nhanh

## ✅ Đã Triển Khai Xong

Hệ thống phân quyền với **3 vai trò** đã được triển khai đầy đủ:

### 📁 Files Đã Tạo/Sửa:

#### 1. **Core System**

- ✅ `src/contexts/AuthContext.tsx` - Quản lý authentication và roles
- ✅ `src/components/auth/RoleGuard.tsx` - Bảo vệ routes theo role
- ✅ `types.ts` - Type definitions cho User và UserRole

#### 2. **Authentication Pages**

- ✅ `src/app/login/page.tsx` - Trang đăng nhập với role selection
- ✅ `src/app/register/page.tsx` - Trang đăng ký với role selection
- ✅ `src/components/dashboard/Login.tsx` - Login form component
- ✅ `src/components/dashboard/Register.tsx` - Register form component

#### 3. **Dashboard Pages**

- ✅ `src/app/dashboard/page.tsx` - User dashboard (tất cả roles)
- ✅ `src/app/dashboard/mentor/page.tsx` - Mentor dashboard
- ✅ `src/app/dashboard/admin/page.tsx` - Admin dashboard
- ✅ `src/components/dashboard/MentorDashboard.tsx` - Mentor UI
- ✅ `src/components/dashboard/AdminDashboard.tsx` - Admin UI

---

## 🎯 Test Ngay

### Bước 1: Mở Browser

Truy cập: **http://localhost:3000** (hoặc 3001 nếu port 3000 đang dùng)

### Bước 2: Đăng Ký/Đăng Nhập

#### Test User Role (Học viên)

1. Vào `/register` hoặc `/login`
2. Điền thông tin
3. Chọn **"Học viên"** trong dropdown "Loại tài khoản"
4. Submit → Tự động redirect tới `/dashboard`
5. ✅ Chỉ truy cập được `/dashboard`

#### Test Mentor Role

1. Vào `/register` hoặc `/login`
2. Điền thông tin
3. Chọn **"Mentor"** trong dropdown
4. Submit → Tự động redirect tới `/dashboard/mentor`
5. ✅ Truy cập được `/dashboard` và `/dashboard/mentor`
6. ❌ Không truy cập được `/dashboard/admin`

#### Test Admin Role

1. Vào `/register` hoặc `/login`
2. Điền thông tin
3. Chọn **"Quản trị viên"** trong dropdown
4. Submit → Tự động redirect tới `/dashboard/admin`
5. ✅ Truy cập được TẤT CẢ routes

---

## 🔒 Cách Hoạt Động

### Auto Redirect Logic

```
User Login → Check Role → Redirect:
├─ user → /dashboard
├─ mentor → /dashboard/mentor
└─ admin → /dashboard/admin
```

### Route Protection

```
Truy cập route không được phép → RoleGuard → Redirect về dashboard phù hợp
```

---

## 🎨 UI Features

### 🟢 User Dashboard (`/dashboard`)

- Thông tin cơ bản
- Tin tức mới nhất
- Thành tích
- Liên hệ & kết nối

### 🟣 Mentor Dashboard (`/dashboard/mentor`)

- **Header**: Purple gradient với thống kê tổng quan
- **Stats Cards**: Tổng học viên, Hoàn thành, Đang xử lý
- **Danh sách học viên**:
    - Avatar, tên, email
    - Progress bar (tiến độ %)
    - Status badge (Hoạt động/Chờ xử lý)
- **Lịch tư vấn**: Upcoming sessions với thời gian
- **Quick Actions**:
    - Tạo báo cáo 📄
    - Tin nhắn 💬
    - Tài liệu 📚
    - Thống kê 📊

### 🔴 Admin Dashboard (`/dashboard/admin`)

- **Header**: Red gradient với navigation tabs
- **Tabs**: Overview | Users | Mentors | System
- **Stats Cards**:
    - Tổng người dùng: 2,847 (+12%)
    - Mentors: 42 (+5%)
    - Khóa học: 156 (+8%)
    - Doanh thu: ₫125M (+15%)
- **User Table**:
    - Danh sách người dùng mới
    - Role badges (User/Mentor/Admin)
    - Status (Active/Pending)
    - Actions (Edit/Delete)
- **System Logs**:
    - Real-time activity log
    - Color-coded by type (info/success/warning/error)
- **Quick Actions**:
    - Thêm user/mentor 👥
    - Quản lý khóa học 📚
    - Doanh thu 💰
    - Cài đặt ⚙️
    - Backup 💾

---

## 📝 Code Examples

### Sử dụng Role Check trong Component

```typescript
import { useAuth } from '@/contexts/AuthContext'

function MyComponent() {
    const { user, hasRole } = useAuth()
    
    return (
        <div>
            <h1>Hello {user?.name}</h1>
            
            {hasRole('admin') && (
                <button>Admin Only Button</button>
            )}
            
            {hasRole(['mentor', 'admin']) && (
                <button>Mentor & Admin Button</button>
            )}
        </div>
    )
}
```

### Bảo vệ một Page

```typescript
import RoleGuard from '@/components/auth/RoleGuard'

export default function MentorOnlyPage() {
    return (
        <RoleGuard allowedRoles={['mentor', 'admin']}>
            <YourComponent />
        </RoleGuard>
    )
}
```

---

## 🔧 Customization

### Thêm Role Mới

1. **Update AuthContext.tsx**:

```typescript
export type UserRole = 'user' | 'mentor' | 'admin' | 'teacher';
```

2. **Update Login/Register**:
   Thêm option mới trong dropdown

3. **Tạo Dashboard mới**:
   Ví dụ: `src/app/dashboard/teacher/page.tsx`

4. **Update Redirect Logic**:
   Thêm case mới trong login/register pages

### Thay đổi Mock Data

- **Mentor Dashboard**: Edit `src/components/dashboard/MentorDashboard.tsx`
    - Line ~8: `students` array
    - Line ~15: `upcomingSessions` array

- **Admin Dashboard**: Edit `src/components/dashboard/AdminDashboard.tsx`
    - Line ~8: `stats` array
    - Line ~15: `recentUsers` array
    - Line ~21: `systemLogs` array

---

## ⚠️ Lưu Ý Quan Trọng

1. **LocalStorage**: Session được lưu trong localStorage (dev only)
2. **Mock Data**: Tất cả dữ liệu hiện tại là static/mock
3. **No Backend**: Chưa có API integration
4. **No Validation**: Password không được hash/encrypt
5. **TypeScript Errors**: Nếu IDE báo lỗi, restart TypeScript server

---

## 🎉 Next Steps

### Phát triển tiếp:

- [ ] **Backend Integration**: Connect với API thực
- [ ] **Database**: Lưu users, roles vào DB
- [ ] **JWT Authentication**: Implement token-based auth
- [ ] **Protected API Routes**: Middleware cho API
- [ ] **Role Management UI**: Admin có thể thay đổi role của users
- [ ] **Permissions**: Fine-grained permissions (không chỉ roles)
- [ ] **Audit Log**: Track admin actions
- [ ] **Email Verification**: Xác thực email khi đăng ký

### UI Improvements:

- [ ] **Responsive**: Tối ưu mobile
- [ ] **Loading States**: Skeleton loaders
- [ ] **Error Handling**: User-friendly error messages
- [ ] **Toast Notifications**: Success/error toasts
- [ ] **Dark Mode Toggle**: Theme switcher

---

## 🆘 Troubleshooting

### Lỗi TypeScript Cache

```bash
# Xóa cache và rebuild
rm -rf .next
npm run build
```

### Port đã được sử dụng

```bash
# Kill process trên port 3000
npx kill-port 3000
npm run dev
```

### Không redirect đúng

1. Clear localStorage: `localStorage.clear()`
2. Refresh browser
3. Đăng nhập lại

---

## 📞 Cần Giúp?

Nếu có vấn đề, check:

1. ✅ Build thành công: `npm run build`
2. ✅ Không có TypeScript errors
3. ✅ Browser console không có errors
4. ✅ LocalStorage có `user` object với `role` field

---

**Tóm lại**: Hệ thống phân quyền đã hoàn thành và sẵn sàng sử dụng! 🎊

Để test ngay: Mở http://localhost:3000, vào `/login`, chọn role và test thử! 🚀

