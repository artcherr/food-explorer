import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import HeaderSearch from "@/components/HeaderSearch";

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "Food Explorer Lite",
  description: "Cuisine carousels & dish details — Next.js App Router demo",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="bg-[#0b0b0c] text-white">
        <header className="sticky top-0 z-20 backdrop-blur bg-black/70 border-b border-white/10">
          <div className="mx-auto max-w-[1200px] px-[25px] py-4 flex items-center justify-between">
            <Link
              href="/"
              aria-label="Перейти на главную — Food Explorer"
              className="text-xl font-semibold hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white/30 rounded"
            >
              🍽️ Food Explorer
            </Link>

            <HeaderSearch />
          </div>
        </header>

        <main className="mx-auto max-w-[1200px] px-[25px] py-8">{children}</main>

        <footer className="border-t border-white/10 mt-12">
          <div className="mx-auto max-w-[1200px] px-[25px] py-6 text-sm text-white/60 text-center">
            © {new Date().getFullYear()} Food Explorer Lite
          </div>
        </footer>
      </body>
    </html>
  );
}
