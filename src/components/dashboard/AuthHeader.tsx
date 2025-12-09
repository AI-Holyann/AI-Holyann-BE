'use client'

import Link from 'next/link'
import {useAuth} from '@/contexts/AuthContext'
import {useState, useEffect} from 'react'
import {usePathname} from 'next/navigation'

export default function AuthHeader() {
    const {user, logout, isAuthenticated} = useAuth()
    const pathname = usePathname()

    // Determine initial theme safely on first render
    const getInitialDark = () => {
        try {
            const theme = localStorage.getItem('theme')
            if (theme === 'dark') return true
            if (theme === 'light') return false
            return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
        } catch (e) {
            return false
        }
    }

    // State quản lý chế độ tối
    const [isDarkMode, setIsDarkMode] = useState<boolean>(() => getInitialDark())

    // Effect: Sync document class when isDarkMode changes
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }

        // persist preference
        try {
            localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')
        } catch (e) {
            // noop
        }
    }, [isDarkMode])

    // Hàm chuyển đổi
    const toggleTheme = () => {
        setIsDarkMode((prev) => !prev)
    }

    return (
        <header
            className="bg-gradient-to-r from-primary to-secondary text-primary-foreground px-8 py-4 shadow-md flex justify-between items-center sticky top-0 z-50 transition-colors duration-300">

            {/* 1. LOGO KHU VỰC */}
            <div className="flex items-center gap-3">
                <Link href="/dashboard" className="flex items-center gap-3 group">
                    <div
                        className="relative w-10 h-10 md:w-12 md:h-12 bg-primary-foreground/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-primary-foreground/20">
                        {/* Logo Icon */}
                        <i className="fas fa-paper-plane text-accent text-lg md:text-xl transform -rotate-12 group-hover:scale-110 transition-transform"></i>
                    </div>

                    {/* Typography Logo */}
                    <div className="flex flex-col justify-center leading-none">
                        <span
                            className="font-heading font-extrabold text-lg md:text-xl tracking-wider text-primary-foreground group-hover:text-accent transition-colors">
                            HOLYANN
                        </span>
                        <span
                            className="font-heading font-medium text-[0.6rem] md:text-[0.7rem] tracking-[0.3em] text-primary-foreground/90 uppercase">
                            Explore
                        </span>
                    </div>
                </Link>
            </div>

            {/* 2. NAVIGATION */}
            <nav className="hidden md:flex items-center gap-8">
                {[
                    {name: 'DASHBOARD', href: '/dashboard'},
                    {name: 'HỒ SƠ', href: '/dashboard/profile'},
                    {name: 'CHECKLIST', href: '/checklist'},
                    {name: 'MỤC TIÊU', href: '/dashboard/profile/schools'},
                    {name: 'TRAO ĐỔI', href: '/dashboard/chat'},
                    {name: 'CÀI ĐẶT', href: '/settings'},
                ].map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={`
                            font-heading text-sm font-semibold tracking-wide transition-all duration-300 relative py-1
                            ${pathname === item.href || (item.href === '/dashboard' && pathname === '/dashboard')
                            ? 'text-primary-foreground after:w-full'
                            : 'text-primary-foreground/80 hover:text-primary-foreground after:w-0 hover:after:w-full'
                        }
                            after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-accent after:transition-all after:duration-300
                        `}
                    >
                        {item.name}
                    </Link>
                ))}
            </nav>

            {/* 3. USER ACTION & THEME TOGGLE */}
            <div className="flex items-center gap-4">

                {/* NÚT CHUYỂN ĐỔI THEME (MỚI THÊM) */}
                <button
                    onClick={toggleTheme}
                    className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-all border border-primary-foreground/10 hover:border-accent group"
                    title={isDarkMode ? "Chuyển sang chế độ Sáng" : "Chuyển sang chế độ Tối"}
                >
                    {isDarkMode ? (
                        // Icon Mặt trời (cho chế độ tối -> bấm để sáng)
                        <i className="fas fa-sun text-accent text-lg group-hover:rotate-90 transition-transform"></i>
                    ) : (
                        // Icon Mặt trăng (cho chế độ sáng -> bấm để tối)
                        <i className="fas fa-moon text-primary-foreground text-lg group-hover:-rotate-12 transition-transform"></i>
                    )}
                </button>

                {/* Phân cách */}
                <div className="h-6 w-[1px] bg-primary-foreground/20 hidden md:block"></div>

                {isAuthenticated ? (
                    <div className="flex items-center gap-3 pl-2">
                        <div className="text-right hidden lg:block">
                            <p className="text-xs text-white font-sans">XIN CHÀO,</p>
                            <p className="text-sm font-bold font-heading text-primary-foreground max-w-[100px] truncate">{user?.name}</p>
                        </div>

                        <div className="relative group cursor-pointer">
                            <div
                                className="w-10 h-10 bg-primary-foreground/20 rounded-full flex items-center justify-center text-primary-foreground font-bold border-2 border-primary-foreground/30 shadow-lg group-hover:border-accent transition-colors">
                                {user?.name.charAt(0).toUpperCase()}
                            </div>

                            <div
                                className="absolute right-0 top-full mt-2 w-32 bg-popover dark:bg-card rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right text-foreground">
                                <button
                                    onClick={logout}
                                    className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-destructive/10 dark:hover:bg-destructive/20 rounded-lg font-medium"
                                >
                                    <i className="fas fa-sign-out-alt mr-2"></i> Logout
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex gap-3 pl-2">
                        <Link
                            href="/login"
                            className="hidden md:block px-5 py-2 text-sm font-heading font-bold text-primary-foreground hover:text-accent transition-colors"
                        >
                            Đăng nhập
                        </Link>
                        <Link
                            href="/register"
                            className="px-6 py-2 text-sm font-heading font-bold bg-accent text-accent-foreground rounded-full shadow-lg hover:bg-accent/90 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
                        >
                            Đăng ký <i className="fas fa-arrow-right text-xs"></i>
                        </Link>
                    </div>
                )}
            </div>
        </header>
    )
}
