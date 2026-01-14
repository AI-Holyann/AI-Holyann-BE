import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider as OldAuthProvider } from "../contexts/AuthContext";
import AuthProvider from "@/components/auth/AuthProvider";
import { ToasterProvider } from "@/components/ToasterProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://holyann.com"
  ),
  title: {
    default: "Holyann Explore (HOEX) - Nền Tảng AI Hỗ Trợ Du Học Toàn Diện",
    template: "%s | Holyann Explore",
  },
  description:
    "Nền tảng AI hỗ trợ du học toàn diện với phân tích hồ sơ SWOT, bài test RIASEC/MBTI/Grit Scale, gợi ý trường DREAM/MATCH/SAFETY, tư vấn trực tiếp với mentor, và cải thiện CV/luận văn.",
  keywords: [
    "du học",
    "study abroad",
    "AI du học",
    "tư vấn du học",
    "học bổng",
    "RIASEC",
    "MBTI",
    "Grit Scale",
    "SWOT analysis",
    "Holyann",
    "HOEX",
    "du học Mỹ",
    "du học Châu Á",
    "du học Châu Âu",
  ],
  authors: [{ name: "HolyAnn Team" }],
  creator: "HolyAnn",
  publisher: "HolyAnn",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "/",
    siteName: "Holyann Explore",
    title: "Holyann Explore (HOEX) - Nền Tảng AI Hỗ Trợ Du Học Toàn Diện",
    description:
      "Nền tảng AI hỗ trợ du học toàn diện với phân tích hồ sơ SWOT, bài test RIASEC/MBTI/Grit Scale, gợi ý trường DREAM/MATCH/SAFETY, tư vấn trực tiếp với mentor, và cải thiện CV/luận văn.",
    images: [
      {
        url: "/images/logos/Logo_Holyann_ngang-removebg-preview.png",
        width: 1200,
        height: 630,
        alt: "Holyann Explore Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Holyann Explore (HOEX) - Nền Tảng AI Hỗ Trợ Du Học Toàn Diện",
    description:
      "Nền tảng AI hỗ trợ du học toàn diện với phân tích hồ sơ SWOT, bài test RIASEC/MBTI/Grit Scale, gợi ý trường DREAM/MATCH/SAFETY, tư vấn trực tiếp với mentor, và cải thiện CV/luận văn.",
    images: ["/images/logos/Logo_Holyann_ngang-removebg-preview.png"],
    creator: "@holyann",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/images/logos/Logo Holyann nhỏ.png",
    shortcut: "/images/logos/Logo Holyann nhỏ.png",
    apple: "/images/logos/Logo Holyann nhỏ.png",
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: "/",
  },
  category: "Education",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <link
          rel="icon"
          href="/images/logos/Logo Holyann nhỏ.png"
          type="image/png"
        />
        <link
          rel="apple-touch-icon"
          href="/images/logos/Logo Holyann nhỏ.png"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;700;900&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-display`}
      >
        <AuthProvider>
          <OldAuthProvider>{children}</OldAuthProvider>
        </AuthProvider>
        <ToasterProvider />
      </body>
    </html>
  );
}
