import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "NextBlog - Modern Blog Platform",
    template: "%s | NextBlog"
  },
  description:
    "A modern blog built with Next.js 14, TypeScript, TypeORM and SQLite",
  keywords: ["blog", "nextjs", "typescript", "programming"],
  authors: [{ name: "NextBlog" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "NextBlog"
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-slate-50">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
