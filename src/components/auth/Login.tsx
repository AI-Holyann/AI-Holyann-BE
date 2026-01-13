"use client";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useAuth } from "@/hooks/useAuth";
import { LoginData } from "@/lib/types/auth.types";

export default function Login() {
  const router = useRouter();
  const { login: loginUser, loading, error } = useAuth();

  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // useAuth hook sẽ tự động cập nhật AuthContext và redirect
    await loginUser(loginData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev: LoginData) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGoogleSignIn = async () => {
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (error) {
      console.error("Google sign in error:", error);
      setErrorMessage("Đăng nhập Google thất bại");
    }
  };

  return (
    <div className="w-full max-w-5xl bg-white dark:bg-card rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100 dark:border-white/10 transition-all duration-300">
      {/* LEFT SIDE - IMAGE */}
      <div className="w-full md:w-1/2 relative h-64 md:h-auto min-h-[400px] md:min-h-[600px] overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse flex items-center justify-center z-0">
            <div className="text-gray-400 text-sm">Đang tải hình ảnh...</div>
          </div>
        )}
        {imageLoaded && (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-primary/20 mix-blend-multiply z-10"></div>
            <div className="absolute bottom-8 left-8 right-8 text-white z-20">
              <h2 className="text-3xl font-heading font-bold mb-2 text-white">
                Holyann Explore
              </h2>
              <p className="text-lg opacity-90 font-sans">
                Chào mừng bạn trở lại!
              </p>
            </div>
          </>
        )}
        <Image
          src="/images/auth/left.jpg"
          alt="Students studying"
          fill
          className={`object-cover transition-opacity duration-300 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          loading="eager"
          priority
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoaded(false)}
        />
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white dark:bg-card transition-colors overflow-y-auto">
        <div className="max-w-md mx-auto w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-heading font-bold text-primary dark:text-sky-400 mb-2">
              Đăng Nhập
            </h1>
            <p className="text-muted-foreground">
              Tiếp tục hành trình du học của bạn
            </p>
          </div>

          {/* Error Message */}
          {(errorMessage || error) && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl mb-4">
              {errorMessage || error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-foreground mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={loginData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-muted/30 dark:bg-muted/50 border border-input rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-white"
                placeholder="name@example.com"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-foreground mb-2"
              >
                Mật khẩu
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={loginData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-muted/30 dark:bg-muted/50 border border-input rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-white"
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-primary bg-muted border-border rounded focus:ring-2 focus:ring-primary"
                />
                <span className="ml-2 text-sm text-muted-foreground">
                  Ghi nhớ đăng nhập
                </span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-accent hover:underline font-medium"
              >
                Quên mật khẩu?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-heading font-bold py-3.5 px-4 rounded-xl shadow-lg hover:shadow-primary/30 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Đang xử lý..." : "Đăng Nhập"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Chưa có tài khoản?{" "}
            <Link
              href="/register"
              className="text-accent hover:underline font-bold"
            >
              Đăng ký ngay
            </Link>
          </p>

          {/* Google Sign In */}
          <div className="mt-8">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-border rounded-xl hover:bg-muted transition-colors dark:text-white group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                className="w-5 h-5 group-hover:scale-110 transition-transform"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="font-medium text-sm">Đăng nhập với Google</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
