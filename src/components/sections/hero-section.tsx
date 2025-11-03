import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';
import { FadeIn } from '../fade-in';

export default function HeroSection() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-background');

  return (
    <section className="relative h-[80vh] min-h-[500px] w-full flex items-center justify-center text-center text-white">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          data-ai-hint={heroImage.imageHint}
          fill
          className="object-cover"
          priority
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
      <div className="absolute inset-0 bg-primary/40" />

      <FadeIn className="relative z-10 flex flex-col items-center px-4">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl font-headline">
          Innovating the Future
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-primary-foreground/80 md:text-xl">
          Pate Pulse Venture is a technology and venture innovation firm dedicated to building and scaling the next generation of groundbreaking companies.
        </p>
        <div className="mt-10 flex gap-4">
          <Button asChild size="lg" className="rounded-full">
            <Link href="#ventures">Explore Our Work</Link>
          </Button>
          <Button asChild variant="secondary" size="lg" className="rounded-full">
            <Link href="#contact">Get in Touch</Link>
          </Button>
        </div>
      </FadeIn>
    </section>
  );
}
