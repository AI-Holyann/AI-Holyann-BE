"use client";
import Login from "@/components/auth/Login";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 p-4 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/auth/bg.jpg"
          alt="Background"
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50/90 via-blue-50/80 to-gray-50/90"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full flex items-center justify-center">
        <Login />
      </div>
    </div>
  );
}
