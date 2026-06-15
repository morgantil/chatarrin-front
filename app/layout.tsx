import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700', '900'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Don Chatarrin — Marketplace de metales reciclables',
  description: 'Comprá y vendé metales reciclables en Argentina. Aluminio, cobre, hierro, bronce y más.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning className={inter.variable}>
      <body className="min-h-screen flex flex-col font-sans">
        <Providers>
          <Navbar />
          <main className="flex-1 container mx-auto px-4">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
