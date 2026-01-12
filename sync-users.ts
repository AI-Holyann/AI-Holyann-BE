/**
 * Script kiểm tra và đồng bộ users giữa Supabase và Local DB (Prisma)
 * Run: npx ts-node sync-users.ts
 */

import { PrismaClient, UserRole } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';

const prisma = new PrismaClient();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

interface User {
    id: string;
    email: string;
    full_name: string;
    role: string;
    auth_provider: string;
    password_hash?: string;
    avatar_url?: string;
    auth_provider_id?: string;
    is_active: boolean;
    created_at?: Date;
    updated_at?: Date;
}

async function syncUsersFromSupabaseToLocal() {
    console.log('🔄 Starting user sync from Supabase to Local DB...\n');

    try {
        // 1. Lấy tất cả users từ Supabase
        const { data: supabaseUsers, error } = await supabase
            .from('users')
            .select('*')
            .eq('is_active', true);

        if (error) {
            console.error('❌ Error fetching users from Supabase:', error);
            return;
        }

        if (!supabaseUsers || supabaseUsers.length === 0) {
            console.log('⚠️  No users found in Supabase');
            return;
        }

        console.log(`✅ Found ${supabaseUsers.length} users in Supabase\n`);

        // 2. Đồng bộ từng user vào Local DB
        let syncedCount = 0;
        let skippedCount = 0;
        let errorCount = 0;

        for (const user of supabaseUsers as User[]) {
            try {
                // Check if user already exists in Local DB
                const existingUser = await prisma.users.findUnique({
                    where: { id: user.id }
                });

                if (existingUser) {
                    console.log(`⏭️  Skipping user (already exists): ${user.email}`);
                    skippedCount++;
                    continue;
                }

                // Create user in Local DB
                await prisma.users.create({
                    data: {
                        id: user.id,
                        email: user.email,
                        full_name: user.full_name,
                        password_hash: user.password_hash,
                        role: user.role as UserRole,
                        auth_provider: user.auth_provider || 'LOCAL',
                        auth_provider_id: user.auth_provider_id,
                        avatar_url: user.avatar_url,
                        is_active: user.is_active
                    }
                });

                console.log(`✅ Synced user: ${user.email} (${user.id})`);
                syncedCount++;

                // If user is STUDENT, check and create student profile
                if (user.role === 'STUDENT') {
                    const existingStudent = await prisma.students.findUnique({
                        where: { user_id: user.id }
                    });

                    if (!existingStudent) {
                        await prisma.students.create({
                            data: { user_id: user.id }
                        });
                        console.log(`  ✅ Created student profile for: ${user.email}`);
                    }
                }

            } catch (error: any) {
                console.error(`❌ Error syncing user ${user.email}:`, error.message);
                errorCount++;
            }
        }

        console.log('\n========================================');
        console.log('SYNC SUMMARY:');
        console.log(`✅ Successfully synced: ${syncedCount} users`);
        console.log(`⏭️  Skipped (already exist): ${skippedCount} users`);
        console.log(`❌ Errors: ${errorCount} users`);
        console.log('========================================\n');

        // 3. Verify sync
        console.log('🔍 Verifying sync...');
        const localUserCount = await prisma.users.count();
        console.log(`📊 Total users in Local DB: ${localUserCount}`);
        console.log(`📊 Total users in Supabase: ${supabaseUsers.length}`);

        if (localUserCount === supabaseUsers.length) {
            console.log('✅ Sync verification passed! Databases are in sync.');
        } else {
            console.log('⚠️  Warning: User counts do not match. Some users may not have been synced.');
        }

    } catch (error) {
        console.error('❌ Fatal error during sync:', error);
    } finally {
        await prisma.$disconnect();
    }
}

async function checkUserById(userId: string) {
    console.log(`\n🔍 Checking user: ${userId}`);
    console.log('========================================');

    // Check in Supabase
    const { data: supabaseUser, error: supabaseError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

    console.log('📍 Supabase:');
    if (supabaseError) {
        console.log(`  ❌ Not found: ${supabaseError.message}`);
    } else if (supabaseUser) {
        console.log(`  ✅ Found: ${supabaseUser.email}`);
        console.log(`     Role: ${supabaseUser.role}`);
        console.log(`     Provider: ${supabaseUser.auth_provider}`);
    }

    // Check in Local DB
    console.log('\n📍 Local DB (Prisma):');
    try {
        const localUser = await prisma.users.findUnique({
            where: { id: userId }
        });

        if (!localUser) {
            console.log('  ❌ Not found');
        } else {
            console.log(`  ✅ Found: ${localUser.email}`);
            console.log(`     Role: ${localUser.role}`);
            console.log(`     Provider: ${localUser.auth_provider}`);
        }
    } catch (error: any) {
        console.log(`  ❌ Error: ${error.message}`);
    }

    console.log('========================================\n');
    await prisma.$disconnect();
}

// Main execution
const args = process.argv.slice(2);

if (args.length > 0 && args[0] === '--check') {
    const userId = args[1];
    if (!userId) {
        console.error('❌ Please provide a user ID to check');
        console.log('Usage: npx ts-node sync-users.ts --check <USER_ID>');
        process.exit(1);
    }
    checkUserById(userId);
} else {
    syncUsersFromSupabaseToLocal();
}

