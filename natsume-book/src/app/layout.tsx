import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
  title: "夏目友人帐 · 友人之庭",
  description: "一个关于《夏目友人帐》的温柔小站",
};

const nav = [
  { href: "/", label: "首页" },
  { href: "/characters", label: "角色" },
  { href: "/episodes", label: "剧集" },
  { href: "/guestbook", label: "友人帐" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <header className="sticky top-0 z-30 border-b border-black/5 bg-white/85 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <Link href="/" className="text-sm font-semibold tracking-wide text-amber-800">
              友人之庭
            </Link>
            <nav className="flex items-center gap-4 text-sm text-zinc-700">
              {nav.map((item) => (
                <Link key={item.href} href={item.href} className="hover:text-amber-700">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
