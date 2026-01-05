import NextAuth, {NextAuthOptions} from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import {AuthService} from '@/lib/services/auth.service'

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        }),
    ],
    callbacks: {
        async signIn({user, account}) {
            if (!account || !user.email) {
                console.error('❌ [NextAuth] Missing account or email');
                return false;
            }

            try {
                console.log('🔵 [NextAuth] Processing OAuth signin:', {
                    email: user.email,
                    provider: account.provider,
                    name: user.name
                });

                const provider = account.provider.toUpperCase() as 'GOOGLE' | 'FACEBOOK';
                const result = await AuthService.oauthLogin(
                    user.email,
                    user.name || user.email,
                    provider,
                    account.providerAccountId,
                    user.image || undefined
                );

                console.log('📊 [NextAuth] OAuth login result:', {
                    success: result.success,
                    hasToken: !!result.token,
                    userId: result.user?.id
                });

                if (result.success && result.token) {
                    // Lưu token và thông tin user vào user object để sử dụng trong session
                    user.accessToken = result.token;
                    user.role = result.user?.role;
                    user.id = result.user?.id;  // User ID từ database
                    user.full_name = result.user?.full_name;
                    console.log('✅ [NextAuth] User will be logged in:', {
                        email: user.email,
                        id: user.id,
                        role: user.role
                    });
                } else {
                    console.error('❌ [NextAuth] OAuth login failed:', result.message);
                }

                return result.success;
            } catch (error: any) {
                console.error('❌ [NextAuth] Exception in signIn callback:', {
                    message: error.message,
                    stack: error.stack
                });
                return false;
            }
        },
        async jwt({token, user}) {
            if (user) {
                token.accessToken = user.accessToken
                token.role = user.role
                token.id = user.id
                token.full_name = user.name
            }
            return token
        },
        async session({session, token}) {
            if (session.user) {
                session.user.accessToken = token.accessToken as string
                session.user.role = token.role as string
                session.user.id = token.id as string
                session.user.user_id = token.id as string  // Alias for compatibility
                session.user.full_name = token.full_name as string
            }
            return session
        },
    },
    pages: {
        signIn: '/login',
        error: '/login',
    },
    secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export {handler as GET, handler as POST}

