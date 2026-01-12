-- =====================================================
-- AUTO-CREATE STUDENT PROFILE TRIGGER
-- Tự động tạo student profile khi user có role = STUDENT
-- =====================================================

-- Step 1: Tạo function để tự động tạo student profile
CREATE OR REPLACE FUNCTION auto_create_student_profile()
RETURNS TRIGGER AS $$
BEGIN
    -- Chỉ tạo student profile nếu role là STUDENT
    IF NEW.role = 'STUDENT' THEN
        -- Insert vào bảng students với user_id từ users
        INSERT INTO students (user_id)
        VALUES (NEW.id)
        ON CONFLICT (user_id) DO NOTHING;  -- Tránh duplicate nếu đã tồn tại

        RAISE NOTICE 'Auto-created student profile for user: %', NEW.id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 2: Tạo trigger chạy sau khi INSERT user mới
DROP TRIGGER IF EXISTS trigger_auto_create_student_profile ON users;
CREATE TRIGGER trigger_auto_create_student_profile
    AFTER INSERT ON users
    FOR EACH ROW
    EXECUTE FUNCTION auto_create_student_profile();

-- =====================================================
-- BACKFILL MISSING STUDENT PROFILES
-- Tạo student profile cho các user STUDENT hiện tại chưa có
-- =====================================================

-- Xem có bao nhiêu users thiếu student profile
SELECT
    COUNT(*) as missing_student_profiles
FROM users u
LEFT JOIN students s ON u.id = s.user_id
WHERE u.role = 'STUDENT'
  AND s.user_id IS NULL;

-- Tạo student profile cho các user thiếu (BACKFILL)
INSERT INTO students (user_id)
SELECT u.id
FROM users u
LEFT JOIN students s ON u.id = s.user_id
WHERE u.role = 'STUDENT'
  AND s.user_id IS NULL
ON CONFLICT (user_id) DO NOTHING;

-- Verify kết quả
SELECT
    u.id,
    u.email,
    u.full_name,
    u.role,
    u.created_at,
    CASE
        WHEN s.user_id IS NOT NULL THEN '✅ Có student profile'
        ELSE '❌ Thiếu student profile'
    END as status
FROM users u
LEFT JOIN students s ON u.id = s.user_id
WHERE u.role = 'STUDENT'
ORDER BY u.created_at DESC
LIMIT 20;

-- =====================================================
-- MONITORING QUERIES
-- =====================================================

-- 1. Kiểm tra tổng quan
SELECT
    u.role,
    COUNT(*) as total_users,
    COUNT(s.user_id) as users_with_student_profile,
    COUNT(*) - COUNT(s.user_id) as missing_profiles
FROM users u
LEFT JOIN students s ON u.id = s.user_id
GROUP BY u.role;

-- 2. Chi tiết users thiếu student profile
SELECT
    u.id,
    u.email,
    u.full_name,
    u.created_at,
    CASE
        WHEN u.created_at > NOW() - INTERVAL '1 hour' THEN '🔴 Vừa tạo (< 1 giờ)'
        WHEN u.created_at > NOW() - INTERVAL '1 day' THEN '🟡 Hôm nay'
        ELSE '🟢 Cũ hơn 1 ngày'
    END as age
FROM users u
LEFT JOIN students s ON u.id = s.user_id
WHERE u.role = 'STUDENT'
  AND s.user_id IS NULL
ORDER BY u.created_at DESC;

-- =====================================================
-- ROLLBACK (Nếu cần xóa trigger)
-- =====================================================

/*
-- Xóa trigger
DROP TRIGGER IF EXISTS trigger_auto_create_student_profile ON users;

-- Xóa function
DROP FUNCTION IF EXISTS auto_create_student_profile();
*/

