
import type { Venture } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { FadeIn } from '../fade-in';
import { Rocket } from 'lucide-react';

interface VenturesSectionProps {
  ventures: Venture[];
}

export default function VenturesSection({ ventures }: VenturesSectionProps) {
  return (
    <section id="ventures" className="py-20 sm:py-28 bg-white dark:bg-gray-950">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <h2 className="text-3xl font-bold tracking-tight text-center font-headline sm:text-4xl">Our Ventures</h2>
          <p className="mt-4 text-lg text-center text-muted-foreground max-w-2xl mx-auto">
            We invest in and build companies that are shaping the future of technology and society.
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
                    <div className="flex items-center gap-4">
                       <div className="bg-primary/10 p-3 rounded-full">
                         <Rocket className="h-6 w-6 text-primary" />
                       </div>
                       <CardTitle className="font-headline text-lg">{venture.name}</CardTitle>
                    </div>
                   </CardHeader>
                  <CardContent className="flex-grow flex flex-col">
                    <CardDescription className="flex-grow">{venture.description}</CardDescription>
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
