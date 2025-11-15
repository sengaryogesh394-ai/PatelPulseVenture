// 'use client';

// import * as React from 'react';
// import Link from 'next/link';
// import { Menu } from 'lucide-react';
// import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

// import { cn } from '@/lib/utils';
// import { Button } from '@/components/ui/button';
// import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
// import { ThemeToggle } from '@/components/theme-toggle';
// import { Logo } from '@/components/ui/logo';
// import { DialogTitle } from '@/components/ui/dialog'; // ✅ Import DialogTitle from your shadcn dialog component

// const navLinks = [
//   { href: '/services', label: 'Our Services' },
//   { href: '/projects', label: 'Our Projects' },
//   { href: '/innovation', label: 'Innovation Lab' },
//   { href: '/testimonials', label: 'Testimonials' },
//   { href: '/team', label: 'Team' },
//   { href: '/contact', label: 'Contact' },
// ];

// export default function Header() {
//   const [isScrolled, setIsScrolled] = React.useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

//   React.useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 10);
//     };
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   return (
//     <header
//       className={cn(
//         'sticky top-0 z-50 w-full border-b border-transparent transition-all duration-300',
//         isScrolled ? 'border-border bg-background/80 backdrop-blur-lg' : 'bg-background'
//       )}
//     >
//       <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
//         <Link href="/" className="flex items-center gap-2 font-bold text-lg">
//           <Logo className="h-36 w-40" />
//         </Link>

//         <nav className="hidden md:flex md:items-center md:gap-6">
//           {navLinks.map((link) => (
//             <Link
//               key={link.href}
//               href={link.href}
//               className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
//             >
//               {link.label}
//             </Link>
//           ))}
//         </nav>

//         <div className="flex items-center gap-2">
//           <ThemeToggle />
//           <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
//             <SheetTrigger asChild>
//               <Button variant="ghost" size="icon" className="md:hidden">
//                 <Menu className="h-6 w-6" />
//                 <span className="sr-only">Open menu</span>
//               </Button>
//             </SheetTrigger>

//             {/* ✅ FIX: Added VisuallyHidden DialogTitle for accessibility */}
//             <SheetContent side="left">
//               <VisuallyHidden>
//                 <DialogTitle>Mobile Navigation Menu</DialogTitle>
//               </VisuallyHidden>

//               <div className="flex flex-col gap-4 p-4">
//                 <Link
//                   href="/"
//                   className="flex items-center gap-2 font-bold text-lg"
//                   onClick={() => setMobileMenuOpen(false)}
//                 >
//                   <Logo className="h-8 w-auto" />
//                   <span className="font-headline">Patel Pulse Ventures</span>
//                 </Link>
//                 <nav className="flex flex-col gap-4">
//                   {navLinks.map((link) => (
//                     <Link
//                       key={link.href}
//                       href={link.href}
//                       className="text-base font-medium text-muted-foreground transition-colors hover:text-primary"
//                       onClick={() => setMobileMenuOpen(false)}
//                     >
//                       {link.label}
//                     </Link>
//                   ))}
//                 </nav>
//               </div>
//             </SheetContent>
//           </Sheet>
//         </div>
//       </div>
//     </header>
//   );
// }

'use client';

import * as React from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/theme-toggle';
import { Logo } from '@/components/ui/logo';
import { DialogTitle } from '@/components/ui/dialog';


const navLinks = [
  { href: '/services', label: 'Our Services' },
  { href: '/projects', label: 'Our Projects' },
  { href: '/innovation', label: 'Innovation Lab' },
  { href: '/testimonials', label: 'Testimonials' },
  { href: '/team', label: 'Team' },
  { href: '/contact', label: 'Contact' },
  { href: '/shop', label: 'Shop' },
  { href: '/blog', label: 'Blogs' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [showHoverText, setShowHoverText] = React.useState(false);
  const [user, setUser] = React.useState<null | { id: string; email: string; name?: string; role?: string }>(null);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  React.useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const raw1 = localStorage.getItem('ppv_user');
        const raw2 = localStorage.getItem('user');
        const raw = raw1 || raw2;
        if (raw) setUser(JSON.parse(raw));
      }
    } catch {}
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem('ppv_user');
      localStorage.removeItem('user');
      setUser(null);
    } catch {}
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b border-transparent transition-all duration-300',
        isScrolled ? 'border-border bg-background/80 backdrop-blur-lg' : 'bg-background'
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Logo className="h-36 w-40" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4 relative">
          {/* Theme Toggle + Hover Text */}
          <div
            className="relative flex items-center"
            onMouseEnter={() => setShowHoverText(true)}
            onMouseLeave={() => setShowHoverText(false)}
          >
            <ThemeToggle />
           

          </div>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent side="left">
              <VisuallyHidden>
                <DialogTitle>Mobile Navigation Menu</DialogTitle>
              </VisuallyHidden>

              <div className="flex flex-col gap-4 p-4">
                <Link
                  href="/"
                  className="flex items-center gap-2 font-bold text-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Logo className="h-8 w-auto" />
                  <span className="font-headline">Patel Pulse Ventures</span>
                </Link>

                <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-base font-medium text-muted-foreground transition-colors hover:text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>

                {/* Auth/Profile actions - Mobile */}
                <div className="mt-6 flex flex-col gap-3">
                  {!user ? (
                    <>
                      <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full">Login</Button>
                      </Link>
                      <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)}>
                        <Button className="w-full">Register</Button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full">Profile</Button>
                      </Link>
                      <Link href="/purchases" onClick={() => setMobileMenuOpen(false)}>
                        <Button className="w-full">My Purchases</Button>
                      </Link>
                      <Button variant="destructive" className="w-full" onClick={() => { handleLogout(); setMobileMenuOpen(false); }}>Logout</Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
          {/* Auth/Profile actions - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            {!user ? (
              <>
                <Link href="/auth/login">
                  <Button variant="outline" size="sm">Login</Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm">Register</Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/profile">
                  <Button variant="ghost" size="sm">Profile</Button>
                </Link>
                <Link href="/purchases">
                  <Button variant="ghost" size="sm">My Purchases</Button>
                </Link>
                <span className="text-sm text-muted-foreground hidden lg:inline">Hi, {user.name || user.email}</span>
                <Button variant="outline" size="sm" onClick={handleLogout}>Logout</Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
