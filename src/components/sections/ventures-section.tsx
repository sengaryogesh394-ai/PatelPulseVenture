import type { Venture } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ExternalLink } from 'lucide-react';
import { FadeIn } from '../fade-in';

interface VenturesSectionProps {
  ventures: Venture[];
}

export default function VenturesSection({ ventures }: VenturesSectionProps) {
  return (
    <section id="ventures" className="py-20 sm:py-28 bg-secondary">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <h2 className="text-3xl font-bold tracking-tight text-center font-headline sm:text-4xl">Our Ventures</h2>
          <p className="mt-4 text-lg text-center text-muted-foreground max-w-2xl mx-auto">
            We partner with visionary founders to build category-defining companies.
          </p>
        </FadeIn>
        
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
          {ventures.map((venture, index) => {
            const ventureImage = PlaceHolderImages.find(p => p.id === venture.imageId);
            return (
              <FadeIn key={venture.id} delay={index * 150}>
                <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  {ventureImage && (
                    <div className="aspect-video relative">
                      <Image
                        src={ventureImage.imageUrl}
                        alt={ventureImage.description}
                        data-ai-hint={ventureImage.imageHint}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="font-headline">{venture.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col">
                    <CardDescription className="flex-grow">{venture.description}</CardDescription>
                    <Button asChild variant="link" className="p-0 h-auto mt-4 self-start">
                      <Link href={venture.website}>
                        Visit Website <ExternalLink className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
