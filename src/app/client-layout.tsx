'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  
  // Check if current path is admin
  const isAdminPage = pathname?.startsWith('/admin');

  if (isAdminPage) {
    // Admin pages: no header/footer, just the content
    return <>{children}</>;
  }

  // Regular pages: include header and footer
  return (
    <div className="relative flex min-h-dvh flex-col bg-background">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
