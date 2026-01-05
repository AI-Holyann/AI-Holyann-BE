'use client'
import {useState} from 'react'
import {useRouter} from 'next/navigation'
import {RegisterData, LoginData, AuthResponse} from '@/lib/types/auth.types'
import {AuthProvider} from '@/contexts/AuthContext'
import {useAuthContext} from '@/contexts/AuthContext'

interface UseAuthOptions {
    skipRedirect?: boolean
}

const normalizeRole = (role?: string) => {
    switch (role?.toUpperCase()) {
        case 'ADMIN':
            return 'admin'
        case 'MENTOR':
            return 'mentor'
        default:
            return 'user'
    }
}

const mapUserForStorage = (user: AuthResponse['user']) => {
    if (!user) return null
    return {
        id: user.id,
        user_id: user.id,  // Alias for compatibility
        email: user.email,
        full_name: user.full_name,
        name: user.full_name || user.email,
        role: normalizeRole(user.role as any),
        avatar_url: user.avatar_url,
        image: user.avatar_url  // NextAuth compatibility
    }
}

export function useAuth(options: UseAuthOptions = {}) {
    const {skipRedirect} = options
    const router = useRouter()
    const authContext = useAuthContext()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    /**
     * Đăng ký
     */
    const register = async (data: RegisterData): Promise<AuthResponse> => {
        setLoading(true)
        setError(null)

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })

            const result: AuthResponse = await response.json()

            if (!result.success) {
                setError(result.message || 'Đăng ký thất bại')
            } else if (result.token && result.user) {
                const storedUser = mapUserForStorage(result.user)
                localStorage.setItem('auth_token', result.token)
                storedUser && localStorage.setItem('user', JSON.stringify(storedUser))

                // Lưu session data để tương thích với NextAuth
                const sessionData = {
                    user: {
                        id: result.user.id,
                        user_id: result.user.id,
                        email: result.user.email,
                        name: result.user.full_name,
                        full_name: result.user.full_name,
                        role: result.user.role,
                        image: result.user.avatar_url,
                        accessToken: result.token
                    }
                }
                localStorage.setItem('session', JSON.stringify(sessionData))

                // ✅ Cập nhật AuthContext ngay lập tức
                authContext.login(
                    result.user.email,
                    result.user.full_name || result.user.email,
                    normalizeRole(result.user.role) as any,
                    result.user.avatar_url
                )

                if (!skipRedirect) {
                    router.push('/dashboard')
                }
            }

            return result
        } catch (_error) {
            const errorMessage = 'Đã xảy ra lỗi khi đăng ký'
            setError(errorMessage)
            return {
                success: false,
                message: errorMessage,
            }
        } finally {
            setLoading(false)
        }
    }

    /**
     * Đăng nhập
     */
    const login = async (data: LoginData): Promise<AuthResponse> => {
        setLoading(true)
        setError(null)

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })

            const result: AuthResponse = await response.json()

            if (!result.success) {
                setError(result.message || 'Đăng nhập thất bại')
            } else if (result.token && result.user) {
                const storedUser = mapUserForStorage(result.user)
                localStorage.setItem('auth_token', result.token)
                storedUser && localStorage.setItem('user', JSON.stringify(storedUser))

                // Lưu session data để tương thích với NextAuth
                const sessionData = {
                    user: {
                        id: result.user.id,
                        user_id: result.user.id,
                        email: result.user.email,
                        name: result.user.full_name,
                        full_name: result.user.full_name,
                        role: result.user.role,
                        image: result.user.avatar_url,
                        accessToken: result.token
                    }
                }
                localStorage.setItem('session', JSON.stringify(sessionData))

                // ✅ Cập nhật AuthContext ngay lập tức
                authContext.login(
                    result.user.email,
                    result.user.full_name || result.user.email,
                    normalizeRole(result.user.role) as any,
                    result.user.avatar_url
                )

                if (!skipRedirect) {
                    router.push('/dashboard')
                }
            }

            return result
        } catch (_error) {
            const errorMessage = 'Đã xảy ra lỗi khi đăng nhập'
            setError(errorMessage)
            return {
                success: false,
                message: errorMessage,
            }
        } finally {
            setLoading(false)
        }
    }

    /**
     * Đăng xuất
     */
    const logout = () => {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
        localStorage.removeItem('session')
        // ✅ Cập nhật AuthContext ngay lập tức
        authContext.logout()
        router.push('/login')
    }

    /**
     * Lấy token hiện tại
     */
    const getToken = (): string | null => {
        if (typeof window === 'undefined') return null
        return localStorage.getItem('auth_token')
    }

    /**
     * Lấy user hiện tại
     */
    const getCurrentUser = () => {
        if (typeof window === 'undefined') return null
        const userStr = localStorage.getItem('user')
        return userStr ? JSON.parse(userStr) : null
    }

    /**
     * Xác thực token
     */
    const verifyToken = async (): Promise<AuthResponse> => {
        const token = getToken()
        if (!token) {
            return {
                success: false,
                message: 'Chưa đăng nhập',
            }
        }

        try {
            const response = await fetch('/api/auth/verify', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })

            const result: AuthResponse = await response.json()

            if (!result.success) {
                logout()
            }

            return result
        } catch (_error) {
            logout()
            return {
                success: false,
                message: 'Token không hợp lệ',
            }
        }
    }

    return {
        register,
        login,
        logout,
        verifyToken,
        getToken,
        getCurrentUser,
        loading,
        error,
    }
}
