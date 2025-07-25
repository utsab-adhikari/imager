'use client';

import './globals.css';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { Toaster } from 'react-hot-toast';
import Link from 'next/link';
import { FaHome } from 'react-icons/fa';
import Footer from '@/components/Footer';
import { SessionProvider } from 'next-auth/react';

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isIndex, setIsIndex] = useState(false);

  useEffect(() => {
    setIsIndex(pathname === '/' || pathname === '/slide');
  }, [pathname]);

  return (
    <html>
      <body className="flex min-h-screen flex-col bg-[#0f1117] text-white font-sans">
        <SessionProvider>
          <SidebarProvider>
            <div className="flex w-full flex-1">
              {/* Sidebar + Sidebar Toggle */}
              <AppSidebar />
              <SidebarTrigger className="fixed z-30 top-3 left-3 md:left-2" />

              {/* Back Button (when not on home/slide) */}
              {!isIndex && (
                <button
                  onClick={() => router.back()}
                  className="fixed z-30 top-16 md:top-4 left-3 md:left-64 bg-[#1c1e26] text-white hover:text-lime-300 hover:bg-[#22252e] p-2 rounded-full shadow-sm transition"
                >
                  <IoMdArrowRoundBack size={22} />
                </button>
              )}

              <div className="flex flex-1 flex-col bg-black/90 relative">
                {/* Toast */}
                <Toaster
                  position="bottom-center"
                  toastOptions={{
                    style: {
                      background: '#1c1e26',
                      color: '#d1fae5',
                      border: '1px solid #14532d',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
                    },
                  }}
                />

                {/* Main content */}
                <main className="flex flex-1 w-full min-h-screen px-2 sm:px-4">
                  <div className="w-full">{children}</div>
                </main>
                {/* Mobile Home Link */}
                {!isIndex && (
                  <div className="block md:hidden text-center my-6">
                    <Link
                      href="/"
                      className="inline-flex items-center gap-2 px-5 py-2 text-lime-400 hover:text-white border border-lime-600 hover:bg-lime-700 rounded-full transition-all"
                    >
                      <FaHome />
                      Home
                    </Link>
                  </div>
                )}


                {/* Footer */}
                <Footer />
              </div>
            </div>
          </SidebarProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
