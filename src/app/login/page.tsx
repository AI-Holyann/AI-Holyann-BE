'use client'
import {useEffect} from 'react'
import {useAuth, UserRole} from '@/contexts/AuthContext'
import {useRouter, usePathname} from 'next/navigation'
import Login from '@/components/dashboard/Login'
import Loading from '@/components/dashboard/Loading'

export default function LoginPage() {
    const {login, isAuthenticated, user, authReady} = useAuth()
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        if (!authReady) return

        if (isAuthenticated && user) {
            let target = '/dashboard'
            switch (user.role) {
                case 'admin':
                    target = '/dashboard/admin'
                    break
                case 'mentor':
                    target = '/dashboard/mentor'
                    break
                case 'user':
                default:
                    target = '/dashboard'
                    break
            }
            if (pathname !== target) {
                router.replace(target)
            }
        }
    }, [authReady, isAuthenticated, user, router, pathname])

    const handleLogin = (email: string, name: string, role: UserRole) => {
        login(email, name, role)
    }

    if (!authReady) {
        return <Loading message="Đang kiểm tra quyền truy cập..."/>
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 p-4">
            <Login onLogin={handleLogin}/>
        </div>
    )
}
