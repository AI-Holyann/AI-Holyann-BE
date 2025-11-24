"use client"
import Image from 'next/image'
import {useState} from 'react'

interface LoginProps {
    onLogin: (email: string, name: string) => void
}

export default function Login({onLogin}: LoginProps) {
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    })

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        // Simulate login - in real app, this would validate credentials
        const name = loginData.email.split('@')[0] // Simple name extraction
        onLogin(loginData.email, name)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value
        })
    }

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4">
            <div className="w-full max-w-6xl min-h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col lg:flex-row">
                {/* Left side - University Image */}
                <div className="w-full lg:w-1/2 relative h-64 lg:h-auto">
                    <Image
                        src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=600&fit=crop"
                        alt="University Campus"
                        fill
                        className="object-cover"
                        loading="eager"
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-8 left-8 text-white">
                        <h2 className="text-3xl font-bold mb-2">Holyann Explore</h2>
                        <p className="text-lg opacity-90">Your Gateway to Global Education</p>
                    </div>
                </div>

                {/* Right side - Login Form */}
                <div className="w-full lg:w-1/2 p-6 lg:p-12 pb-16 flex flex-col justify-center overflow-y-auto">
                    <div className="max-w-sm mx-auto w-full">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Đăng Nhập</h1>
                            <p className="text-gray-600">Đăng nhập để tiếp tục hành trình du học của bạn</p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={loginData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    placeholder="Nhập email của bạn"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Mật khẩu
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={loginData.password}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    placeholder="Nhập mật khẩu của bạn"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                            >
                                Đăng Nhập
                            </button>
                        </form>

                        <p className="mt-6 text-center text-sm text-gray-600">
                            Chưa có tài khoản?{' '}
                            <a href="/register" className="text-blue-600 hover:underline">
                                Đăng ký ngay
                            </a>
                        </p>

                        {/* Social Login Options */}
                        <div className="mt-8">
                            <div className="relative mb-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">Hoặc đăng nhập nhanh</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                    </svg>
                                    <span className="text-sm font-medium text-gray-700">Tiếp tục với Google</span>
                                </button>
                                
                                <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                    <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                    </svg>
                                    <span className="text-sm font-medium text-gray-700">Tiếp tục với Facebook</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}