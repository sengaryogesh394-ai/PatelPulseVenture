
'use client';

import * as React from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/theme-toggle';
import { Logo } from '@/components/ui/logo';

const navLinks = [
  { href: '/services', label: 'Our Services' },
  { href: '/innovation', label: 'Innovation Lab' },
  { href: '/testimonials', label: 'Testimonials' },
  { href: '/team', label: 'Team' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b border-transparent transition-all duration-300',
        isScrolled ? 'border-border bg-background/80 backdrop-blur-lg' : 'bg-background'
      )}
    >
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Logo className="h-8 w-auto" />
          <span className="font-headline hidden sm:inline-block">Patel Pulse Ventures</span>
        </Link>

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
          <Link
            href="/admin"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Admin
          </Link>
        </nav>

        <div className="flex items-center gap-2">
           <ThemeToggle />
           <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="flex flex-col gap-4 p-4">
                <Link href="/" className="flex items-center gap-2 font-bold text-lg" onClick={() => setMobileMenuOpen(false)}>
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
                   <Link
                    href="/admin"
                    className="text-base font-medium text-muted-foreground transition-colors hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin
                  </Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
