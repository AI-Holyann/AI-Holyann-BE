import 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth' {
    interface User {
        accessToken?: string
        role?: string
        id?: string
        full_name?: string
    }

    interface Session {
        user: {
            name?: string | null
            email?: string | null
            image?: string | null
            accessToken?: string
            role?: string
            id?: string
            user_id?: string  // Alias for compatibility
            full_name?: string
        }
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        accessToken?: string
        role?: string
        id?: string
        full_name?: string
    }
}

