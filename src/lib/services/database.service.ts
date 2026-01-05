import {supabase, supabaseAdmin} from '@/lib/supabase'
import {prisma} from '@/lib/prisma'
import {User, RegisterData, UserRole, AuthProvider} from '@/lib/types/auth.types'
import bcrypt from 'bcryptjs'
import {randomUUID} from 'crypto'

export class DatabaseService {
    /**
     * Đồng bộ dữ liệu vào Local Database với cơ chế retry
     */
    private static async syncToLocalDB(data: any, retries = 2): Promise<void> {
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                await prisma.users.create({
                    data
                });
                console.log(`✅ [DatabaseService] Synced to Local DB on attempt ${attempt}:`, data.id);
                return;
            } catch (error: any) {
                const errorMsg = error.message || '';
                // Nếu là circuit breaker, skip sau 1 attempt
                if (errorMsg.includes('Circuit breaker open') && attempt === 1) {
                    console.warn('⚠️ [DatabaseService] Local DB circuit breaker is open, skipping sync');
                    return;
                }
                console.error(`⚠️ [DatabaseService] Sync attempt ${attempt} failed:`, errorMsg);
                if (attempt === retries) {
                    console.error('❌ [DatabaseService] Failed to sync to Local DB after retries:', data.id);
                } else if (!errorMsg.includes('Circuit breaker open')) {
                    console.log('🔄 Retrying sync to Local DB...');
                }
            }
        }
    }

    /**
     * Tạo hồ sơ student mặc định với retry mechanism
     */
    private static async createStudentProfile(userId: string, retries = 2): Promise<void> {
        const studentData = {user_id: userId};
        console.log('📝 [DatabaseService] Creating student profile for:', userId);

        // 1. Supabase
        try {
            const {data: existingStudent} = await supabaseAdmin
                .from('students')
                .select('user_id')
                .eq('user_id', userId)
                .single();

            if (!existingStudent) {
                const {error: supabaseError} = await supabaseAdmin
                    .from('students')
                    .insert(studentData);

                if (supabaseError) {
                    console.error('❌ [DatabaseService] Failed to create student profile in Supabase:', supabaseError);
                } else {
                    console.log('✅ [DatabaseService] Student profile created in Supabase');
                }
            } else {
                console.log('ℹ️ [DatabaseService] Student profile already exists in Supabase');
            }
        } catch (error) {
            console.error('⚠️ [DatabaseService] Error checking/creating student in Supabase:', error);
        }

        // 2. Local DB (Prisma) với retry
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                // Check if student already exists
                const existingStudent = await prisma.students.findUnique({
                    where: {user_id: userId}
                });

                if (!existingStudent) {
                    await prisma.students.create({
                        data: studentData
                    });
                    console.log('✅ [DatabaseService] Student profile created in Local DB');
                } else {
                    console.log('ℹ️ [DatabaseService] Student profile already exists in Local DB');
                }
                return; // Success, exit retry loop
            } catch (error: any) {
                const errorMsg = error.message || '';

                // Skip retry for certain errors
                if (errorMsg.includes('Circuit breaker open') && attempt === 1) {
                    console.warn('⚠️ [DatabaseService] Local DB circuit breaker is open, skipping student profile creation');
                    return;
                }

                if (errorMsg.includes('Unique constraint failed')) {
                    console.log('ℹ️ [DatabaseService] Student profile already exists in Local DB (unique constraint)');
                    return;
                }

                console.error(`⚠️ [DatabaseService] Student profile creation attempt ${attempt} failed:`, errorMsg);

                if (attempt === retries) {
                    console.error('❌ [DatabaseService] Failed to create student profile in Local DB after retries');
                } else {
                    console.log('🔄 Retrying student profile creation...');
                    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s before retry
                }
            }
        }
    }

    /**
     * Tạo user mới trong database (đồng bộ cả Supabase và Local DB)
     */
    static async createUser(data: RegisterData): Promise<User | null> {
        try {
            console.log('🔍 [DatabaseService] Creating user with data:', {
                full_name: data.full_name,
                email: data.email,
                role: data.role || 'STUDENT'
            });

            // Hash password
            const hashedPassword = await bcrypt.hash(data.password, 10);
            console.log('✅ [DatabaseService] Password hashed successfully');

            const userId = randomUUID();
            const insertData = {
                id: userId,
                full_name: data.full_name,
                email: data.email,
                password_hash: hashedPassword,
                role: data.role || 'STUDENT',
                auth_provider: 'LOCAL',
                is_active: true
            };
            console.log('📦 [DatabaseService] Insert data:', insertData);

            // 1. Ghi vào Supabase
            const {data: supabaseUser, error: supabaseError} = await supabaseAdmin
                .from('users')
                .insert(insertData)
                .select()
                .single();

            if (supabaseError) {
                throw new Error(`Supabase insert failed: ${supabaseError.message}${supabaseError.code ? ` (code: ${supabaseError.code})` : ''}`);
            }

            console.log('✅ [DatabaseService] User created in Supabase:', supabaseUser?.id);

            // 2. Đồng bộ vào Local Database (Prisma) với retry
            await this.syncToLocalDB(insertData);

            // 3. Nếu là STUDENT, tạo hồ sơ student
            if (insertData.role === 'STUDENT') {
                await this.createStudentProfile(userId);
            }

            return supabaseUser as User;
        } catch (error: any) {
            console.error('❌ [DatabaseService] Exception in createUser:', {
                message: error.message,
                stack: error.stack
            });
            throw error;
        }
    }

    /**
     * Tạo user từ OAuth provider (Google, Facebook) - đồng bộ cả 2 DB
     */
    static async createOAuthUser(
        email: string,
        full_name: string,
        provider: AuthProvider,
        providerId: string,
        avatarUrl?: string
    ): Promise<User | null> {
        try {
            const userId = randomUUID();
            const userData = {
                id: userId,
                full_name,
                email,
                role: 'STUDENT' as UserRole,
                auth_provider: provider,
                auth_provider_id: providerId,
                avatar_url: avatarUrl,
                is_active: true
            };

            // 1. Ghi vào Supabase
            const {data: supabaseUser, error: supabaseError} = await supabaseAdmin
                .from('users')
                .insert(userData)
                .select()
                .single();

            if (supabaseError) {
                console.error('❌ [DatabaseService] Supabase error:', supabaseError);
                throw new Error(`Supabase insert failed: ${supabaseError.message}${supabaseError.code ? ` (code: ${supabaseError.code})` : ''}`);
            }

            console.log('✅ [DatabaseService] OAuth user created in Supabase:', supabaseUser?.id);

            // 2. Đồng bộ vào Local Database (Prisma) với retry
            await this.syncToLocalDB(userData);

            // 3. Tạo hồ sơ student (OAuth user mặc định là STUDENT)
            await this.createStudentProfile(userId);

            return supabaseUser as User;
        } catch (error: any) {
            console.error('❌ [DatabaseService] Exception in createOAuthUser:', {
                message: error.message,
                stack: error.stack
            });
            return null;
        }
    }

    /**
     * Tìm user theo email (ưu tiên Local DB, fallback Supabase)
     */
    static async findUserByEmail(email: string): Promise<User | null> {
        try {
            // 1. Thử tìm trong Local DB trước
            try {
                const localUser = await prisma.users.findFirst({
                    where: {
                        email: email,
                        is_active: true
                    }
                })

                if (localUser) {
                    console.log('✅ [DatabaseService] Found user in Local DB:', localUser.id)
                    return localUser as User
                }
            } catch (prismaError: any) {
                console.warn('⚠️ [DatabaseService] Local DB query failed, trying Supabase:', prismaError.message)
            }

            // 2. Fallback về Supabase
            const {data: user, error} = await supabase
                .from('users')
                .select('*')
                .eq('email', email)
                .eq('is_active', true)
                .single()

            if (error) {
                return null
            }

            // Đồng bộ user từ Supabase vào Local DB nếu tìm thấy
            if (user) {
                try {
                    await prisma.users.upsert({
                        where: {email: user.email},
                        update: {
                            full_name: user.full_name,
                            role: user.role,
                            avatar_url: user.avatar_url,
                            auth_provider: user.auth_provider,
                            is_active: user.is_active
                        },
                        create: {
                            id: user.id,
                            full_name: user.full_name,
                            email: user.email,
                            password_hash: user.password_hash,
                            role: user.role,
                            auth_provider: user.auth_provider || 'LOCAL',
                            auth_provider_id: user.auth_provider_id,
                            avatar_url: user.avatar_url,
                            is_active: user.is_active
                        }
                    })
                    console.log('✅ [DatabaseService] Synced user from Supabase to Local DB:', user.id)
                } catch (syncError: any) {
                    console.warn('⚠️ [DatabaseService] Failed to sync user to Local DB:', syncError.message)
                }
            }

            return user as User
        } catch (error) {
            console.error('Error in findUserByEmail:', error)
            return null
        }
    }

    /**
     * Tìm user theo ID (ưu tiên Local DB, fallback Supabase)
     */
    static async findUserById(id: string): Promise<User | null> {
        try {
            // 1. Thử tìm trong Local DB trước
            try {
                const localUser = await prisma.users.findFirst({
                    where: {
                        id: id,
                        is_active: true
                    }
                })

                if (localUser) {
                    console.log('✅ [DatabaseService] Found user by ID in Local DB:', localUser.id)
                    return localUser as User
                }
            } catch (prismaError: any) {
                console.warn('⚠️ [DatabaseService] Local DB query failed, trying Supabase:', prismaError.message)
            }

            // 2. Fallback về Supabase
            const {data: user, error} = await supabase
                .from('users')
                .select('*')
                .eq('id', id)
                .eq('is_active', true)
                .single()

            if (error) {
                return null
            }

            // Đồng bộ user từ Supabase vào Local DB nếu tìm thấy
            if (user) {
                try {
                    await prisma.users.upsert({
                        where: {id: user.id},
                        update: {
                            full_name: user.full_name,
                            email: user.email,
                            role: user.role,
                            avatar_url: user.avatar_url,
                            auth_provider: user.auth_provider,
                            is_active: user.is_active
                        },
                        create: {
                            id: user.id,
                            full_name: user.full_name,
                            email: user.email,
                            password_hash: user.password_hash,
                            role: user.role,
                            auth_provider: user.auth_provider || 'LOCAL',
                            auth_provider_id: user.auth_provider_id,
                            avatar_url: user.avatar_url,
                            is_active: user.is_active
                        }
                    })
                    console.log('✅ [DatabaseService] Synced user from Supabase to Local DB:', user.id)
                } catch (syncError: any) {
                    const errorMsg = syncError.message || '';
                    if (errorMsg.includes('Circuit breaker open')) {
                        console.warn('⚠️ [DatabaseService] Local DB circuit breaker open, using Supabase only');
                    } else {
                        console.warn('⚠️ [DatabaseService] Failed to sync user to Local DB:', errorMsg)
                    }
                }
            }

            return user as User
        } catch (error) {
            console.error('Error in findUserById:', error)
            return null
        }
    }

    /**
     * Xác thực password
     */
    static async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
        try {
            return await bcrypt.compare(plainPassword, hashedPassword)
        } catch (error) {
            console.error('Error verifying password:', error)
            return false
        }
    }

    /**
     * Cập nhật thông tin user
     */
    static async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
        try {
            const {data: user, error} = await supabase
                .from('users')
                .update(updates)
                .eq('id', id)
                .select()
                .single()

            if (error) {
                console.error('Error updating user:', error)
                return null
            }

            return user as User
        } catch (error) {
            console.error('Error in updateUser:', error)
            return null
        }
    }
}
