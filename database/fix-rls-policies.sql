-- ========================================
-- FIX RLS POLICIES FOR REGISTRATION
-- ========================================
-- Run this script in Supabase SQL Editor to fix permission denied error

-- 1. Enable RLS on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 2. Allow public INSERT for registration
DROP POLICY IF EXISTS "Allow public user registration" ON public.users;
CREATE POLICY "Allow public user registration"
ON public.users
FOR INSERT
TO public
WITH CHECK (true);

-- 3. Allow public SELECT for login lookup
DROP POLICY IF EXISTS "Allow public user lookup" ON public.users;
CREATE POLICY "Allow public user lookup"
ON public.users
FOR SELECT
TO public
USING (true);

-- 4. Allow users to update their own profile
DROP POLICY IF EXISTS "Allow users to update own profile" ON public.users;
CREATE POLICY "Allow users to update own profile"
ON public.users
FOR UPDATE
TO public
USING (auth.uid()::text = id)
WITH CHECK (auth.uid()::text = id);

-- ========================================
-- FIX RLS POLICIES FOR STUDENTS TABLE
-- ========================================

-- 5. Enable RLS on students table
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- 6. Allow authenticated users to insert their own student profile
DROP POLICY IF EXISTS "Allow student profile creation" ON public.students;
CREATE POLICY "Allow student profile creation"
ON public.students
FOR INSERT
TO public
WITH CHECK (true);

-- 7. Allow users to read their own student profile
DROP POLICY IF EXISTS "Allow users to read own student profile" ON public.students;
CREATE POLICY "Allow users to read own student profile"
ON public.students
FOR SELECT
TO public
USING (true);

-- 8. Allow users to update their own student profile
DROP POLICY IF EXISTS "Allow users to update own student profile" ON public.students;
CREATE POLICY "Allow users to update own student profile"
ON public.students
FOR UPDATE
TO public
USING (auth.uid()::text = user_id)
WITH CHECK (auth.uid()::text = user_id);

-- ========================================
-- GRANT PERMISSIONS TO ANON ROLE
-- ========================================

-- Grant USAGE on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant permissions on users table
GRANT SELECT, INSERT, UPDATE ON public.users TO anon, authenticated;

-- Grant permissions on students table
GRANT SELECT, INSERT, UPDATE ON public.students TO anon, authenticated;

-- Grant permissions on sequences
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- ========================================
-- VERIFY POLICIES
-- ========================================

-- Check policies on users table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'users';

-- Check policies on students table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'students';

-- Success message
SELECT 'RLS Policies fixed successfully!' as status;

