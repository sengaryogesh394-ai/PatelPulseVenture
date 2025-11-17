'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Briefcase, 
  FolderOpen, 
  Users, 
  FileText, 
  LogOut,
  Menu,
  X,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { FloatingActionButton } from '@/components/ui/floating-action-button';

const sidebarItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Services',
    href: '/admin/services',
    icon: Briefcase,
  },
  {
    title: 'Projects',
    href: '/admin/projects',
    icon: FolderOpen,
  },
  {
    title: 'Team',
    href: '/admin/team',
    icon: Users,
  },
  {
    title: 'Blogs',
    href: '/admin/blogs',
    icon: FileText,
  },
  {
    title: 'Products',
    href: '/admin/products',
    icon: Briefcase,
  },
  {
    title: 'Reviews',
    href: '/admin/reviews',
    icon: FileText,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ username: string } | null>(null);
  const isLoginPage = pathname === '/admin/login';
  const logout = () => {
    try { localStorage.removeItem('ppv_user'); } catch {}
    router.replace('/admin/login');
  };

  // Guard: only allow admins, otherwise redirect to admin login
  useEffect(() => {
    if (isLoginPage) return; // Do not guard the login page itself
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('ppv_user') : null;
      if (!raw) {
        router.replace('/admin/login');
        return;
      }
      const u = JSON.parse(raw);
      if (u?.role !== 'admin') {
        router.replace('/admin/login');
        return;
      }
      setUser({ username: u.name || u.email || 'admin' });
    } catch {
      router.replace('/admin/login');
    }
  }, [router, pathname, isLoginPage]);

  // Quick actions for floating button
  const quickActions = [
    { icon: Briefcase, label: 'Add Service', href: '/admin/services/new', color: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700' },
    { icon: FolderOpen, label: 'New Project', href: '/admin/projects/new', color: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700' },
    { icon: Users, label: 'Add Member', href: '/admin/team/new', color: 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700' },
    { icon: FileText, label: 'Write Post', href: '/admin/blogs/new', color: 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700' },
  ];

  // Render bare page without sidebar/header on login page
  if (isLoginPage) {
    return (
      <div className="min-h-screen">
        {children}
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-r border-slate-700/50 transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 shadow-2xl',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-slate-700/50">
            <Link href="/admin" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-white group-hover:text-blue-300 transition-colors duration-300">Admin Panel</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group relative overflow-hidden',
                    isActive
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30 shadow-lg'
                      : 'text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-slate-700/50 hover:to-slate-600/50 hover:border hover:border-slate-600/50'
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className={cn(
                    "w-5 h-5 transition-all duration-300",
                    isActive 
                      ? "text-blue-400 drop-shadow-sm" 
                      : "group-hover:text-blue-300 group-hover:scale-110"
                  )} />
                  <span className="relative z-10">{item.title}</span>
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-slate-700/50 bg-gradient-to-r from-slate-800/50 to-slate-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 px-3 py-2 bg-slate-700/30 rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-white">{user?.username || 'Admin'}</span>
              </div>
              <div className="flex items-center gap-2">
               
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={logout}
                  className="hidden md:inline-flex"
                >
                  Logout
                </Button>
               
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-gradient-to-r from-white via-slate-50 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-6 shadow-sm">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-300"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div className="hidden lg:block">
              <h2 className="text-lg font-semibold bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
                Welcome to Admin Dashboard
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-full border border-green-200 dark:border-green-700">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-green-700 dark:text-green-300">System Online</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-purple-100/20 dark:from-blue-900/10 dark:via-transparent dark:to-purple-900/10 pointer-events-none"></div>
          <div className="relative z-10">
            {children}
          </div>
        </main>
      </div>

      {/* Floating Action Button */}
     
    </div>
  );
}
