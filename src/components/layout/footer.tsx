
import Link from 'next/link';
import { Rocket, Twitter, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg mb-2">
              <Rocket className="h-6 w-6 text-primary" />
              <span className="font-headline">Pate Pulse Venture</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm">
              Fueling the next wave of technological innovation and venture excellence.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="#services" className="text-sm text-muted-foreground hover:text-primary">Services</Link></li>
              <li><Link href="#innovation" className="text-sm text-muted-foreground hover:text-primary">Innovation</Link></li>
              <li><Link href="#testimonials" className="text-sm text-muted-foreground hover:text-primary">Testimonials</Link></li>
              <li><Link href="#team" className="text-sm text-muted-foreground hover:text-primary">Team</Link></li>
              <li><Link href="#contact" className="text-sm text-muted-foreground hover:text-primary">Contact</Link></li>
            </ul>
          </div>
           <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">Contact Us</h3>
            <ul className="mt-4 space-y-3 text-sm">
                <li className="flex items-start gap-2 text-muted-foreground">
                    <MapPin className="h-5 w-5 shrink-0 text-primary" />
                    <span>123 Innovation Drive, Tech City, 12345</span>
                </li>
                 <li className="flex items-start gap-2 text-muted-foreground">
                    <Mail className="h-5 w-5 shrink-0 text-primary" />
                    <a href="mailto:contact@patepulse.com" className="hover:text-primary">contact@patepulse.com</a>
                </li>
                 <li className="flex items-start gap-2 text-muted-foreground">
                    <Phone className="h-5 w-5 shrink-0 text-primary" />
                    <a href="tel:+1234567890" className="hover:text-primary">(123) 456-7890</a>
                </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">Follow Us</h3>
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
