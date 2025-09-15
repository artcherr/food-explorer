import type { Metadata } from 'next';
import './globals.css';
import HeaderSearch from '@/components/HeaderSearch';

export const metadata: Metadata = {
  title: 'Food Explorer Lite',
  description: 'Cuisine carousels & dish details — Next.js App Router demo',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="bg-[#0b0b0c] text-white">
        <header className="sticky top-0 z-20 backdrop-blur bg-black/70 border-b border-white/10">
          <div className="mx-auto max-w-[1200px] px-[25px] py-4 flex items-center justify-between">
            <div className="text-xl font-semibold">🍽️ Food Explorer</div>
              <HeaderSearch />
          </div>
        </header>

        <main className="mx-auto max-w-[1200px] px-[25px] py-8">
          {children}
        </main>

        <footer className="border-t border-white/10 mt-12">
          <div className="mx-auto max-w-[1200px] px-[25px] py-6 text-sm text-white/60 text-center">
            © {new Date().getFullYear()} Food Explorer Lite
          </div>
        </footer>
      </body>
    </html>
  );
}
