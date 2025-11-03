import Link from 'next/link';
import { Zap, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg mb-2">
              <Zap className="h-6 w-6 text-primary" />
              <span className="font-headline">Pate Pulse Venture</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm">
              Fueling the next wave of technological innovation and venture excellence.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">Navigate</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="#services" className="text-sm text-muted-foreground hover:text-primary">Services</Link></li>
              <li><Link href="#innovation" className="text-sm text-muted-foreground hover:text-primary">Innovation</Link></li>
              <li><Link href="#team" className="text-sm text-muted-foreground hover:text-primary">Team</Link></li>
              <li><Link href="#contact" className="text-sm text-muted-foreground hover:text-primary">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">Connect</h3>
            <div className="mt-4 flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary"><span className="sr-only">Twitter</span><Twitter className="h-6 w-6" /></a>
              <a href="#" className="text-muted-foreground hover:text-primary"><span className="sr-only">LinkedIn</span><Linkedin className="h-6 w-6" /></a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} Pate Pulse Venture. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
