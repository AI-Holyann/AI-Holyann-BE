'use client'
import {useEffect} from 'react'
import {useAuth, UserRole} from '@/contexts/AuthContext'
import {useRouter, usePathname} from 'next/navigation'
import Loading from '@/components/dashboard/Loading'
import Register from '@/components/dashboard/Register'

export default function RegisterPage() {
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

    const handleRegister = (email: string, name: string, role: UserRole) => {
        login(email, name, role)
    }

    if (!authReady) {
        return <Loading message="Đang kiểm tra quyền truy cập..."/>
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 p-4">
            <Register onRegister={handleRegister}/>
        </div>
    )
}

