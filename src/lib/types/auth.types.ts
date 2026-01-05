export type UserRole = 'STUDENT' | 'MENTOR' | 'ADMIN'
export type AuthProvider = 'LOCAL' | 'GOOGLE' | 'FACEBOOK'

export interface User {
    id: string
    full_name: string
    email: string
    password_hash?: string
    phone_number?: string
    role: UserRole
    auth_provider: AuthProvider
    auth_provider_id?: string
    avatar_url?: string
    is_active: boolean
    created_at: Date
}

export interface RegisterData {
    full_name: string
    email: string
    password: string
    role?: UserRole
}

export interface LoginData {
    email: string
    password: string
}

export interface AuthResponse {
    success: boolean
    message?: string
    user?: {
        id: string
        email: string
        full_name: string
        role: UserRole
        avatar_url?: string
    }
    token?: string
}

