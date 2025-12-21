# Hệ Thống Phân Quyền - Holyann AI Web

## Tổng Quan

Hệ thống phân quyền với 3 vai trò (roles):

- **User (Học viên)**: Truy cập dashboard cơ bản, checklist, tests
- **Mentor**: Quản lý học viên, tư vấn, theo dõi tiến độ
- **Admin**: Quản trị toàn bộ hệ thống

## Cấu Trúc Mới

### 1. AuthContext (`src/contexts/AuthContext.tsx`)

- Thêm `UserRole` type: 'user' | 'mentor' | 'admin'
- Interface `User` có thêm field `role`
- Function `login` nhận thêm parameter `role`
- Helper function `hasRole` để kiểm tra quyền

### 2. RoleGuard Component (`src/components/auth/RoleGuard.tsx`)

- Bảo vệ routes theo role
- Tự động redirect đến dashboard phù hợp
- Loading state khi kiểm tra quyền

### 3. Dashboard Pages

#### User Dashboard (`/dashboard`)

- Protected by RoleGuard: ['user', 'mentor', 'admin']
- Hiển thị thông tin cơ bản, tin tức, thành tích

#### Mentor Dashboard (`/dashboard/mentor`)

- Protected by RoleGuard: ['mentor', 'admin']
- Quản lý học viên
- Lịch tư vấn
- Thống kê tiến độ học viên
- Thao tác nhanh

#### Admin Dashboard (`/dashboard/admin`)

- Protected by RoleGuard: ['admin']
- Quản lý người dùng
- Quản lý mentors
- Thống kê hệ thống
- System logs
- Doanh thu

### 4. Login & Register

- Thêm dropdown chọn vai trò
- Tự động redirect đến dashboard phù hợp sau đăng nhập/đăng ký

## Sử Dụng

### Đăng Nhập/Đăng Ký

```typescript
// Trong Login/Register component
const handleLogin = (email: string, name: string, role: UserRole) => {
    login(email, name, role)
    // Auto redirect based on role
}
```

### Kiểm Tra Role

```typescript
// Trong component
import { useAuth } from '@/contexts/AuthContext'

function MyComponent() {
    const { user, hasRole } = useAuth()
    
    if (hasRole('admin')) {
        // Admin only code
    }
    
    if (hasRole(['mentor', 'admin'])) {
        // Mentor and Admin code
    }
}
```

### Bảo Vệ Route

```typescript
import RoleGuard from '@/components/auth/RoleGuard'

export default function ProtectedPage() {
    return (
        <RoleGuard allowedRoles={['admin']}>
            <YourComponent />
        </RoleGuard>
    )
}
```

## Routes Mới

- `/dashboard` - User dashboard (tất cả roles)
- `/dashboard/mentor` - Mentor dashboard (mentor, admin)
- `/dashboard/admin` - Admin control panel (admin only)
- `/login` - Đăng nhập với role selection
- `/register` - Đăng ký với role selection

## Auto Redirect Logic

Sau khi đăng nhập/đăng ký, hệ thống tự động redirect:

- **User** → `/dashboard`
- **Mentor** → `/dashboard/mentor`
- **Admin** → `/dashboard/admin`

Nếu user cố truy cập route không có quyền, RoleGuard sẽ redirect về dashboard phù hợp.

## Testing

1. Đăng ký/Đăng nhập với role **User**
    - Kiểm tra chỉ có thể truy cập `/dashboard`

2. Đăng ký/Đăng nhập với role **Mentor**
    - Kiểm tra có thể truy cập `/dashboard` và `/dashboard/mentor`
    - Không thể truy cập `/dashboard/admin`

3. Đăng ký/Đăng nhập với role **Admin**
    - Có thể truy cập tất cả routes

## Features Chính

### Mentor Dashboard

- 📊 Thống kê học viên (24 tổng, 18 hoàn thành, 6 đang xử lý)
- 👥 Danh sách học viên với progress bar
- 📅 Lịch tư vấn sắp tới
- ⚡ Thao tác nhanh (Tạo báo cáo, Tin nhắn, Tài liệu, Thống kê)

### Admin Dashboard

- 📈 Tổng quan hệ thống (Users, Mentors, Courses, Revenue)
- 👤 Quản lý người dùng mới
- 📝 System logs với filters
- ⚙️ Quản lý nhanh (Add user, Add mentor, Courses, Revenue, Settings, Backup)
- 🎨 Tabs navigation (Overview, Users, Mentors, System)

## Lưu Ý

- Dữ liệu hiện tại là mock data để demo
- Cần tích hợp với backend API thực tế
- LocalStorage được sử dụng để lưu session
- Cần implement logout functionality đầy đủ
- Có thể mở rộng thêm roles nếu cần (vd: 'superadmin', 'teacher', etc.)

## TODO

- [ ] Tích hợp API backend
- [ ] Implement real authentication (JWT, OAuth, etc.)
- [ ] Add role management trong admin panel
- [ ] Permission-based UI rendering
- [ ] Audit logs cho admin actions
- [ ] Email verification cho new users
- [ ] Two-factor authentication

