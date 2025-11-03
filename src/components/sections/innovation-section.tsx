import type { Innovation } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Lightbulb } from 'lucide-react';
import { FadeIn } from '../fade-in';

interface InnovationSectionProps {
  innovations: Innovation[];
}

export default function InnovationSection({ innovations }: InnovationSectionProps) {
  return (
    <section id="innovation" className="py-20 sm:py-28">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <h2 className="text-3xl font-bold tracking-tight text-center font-headline sm:text-4xl">Innovation Lab</h2>
          <p className="mt-4 text-lg text-center text-muted-foreground max-w-2xl mx-auto">
            At the forefront of research and development, we explore emerging technologies that will shape tomorrow.
          </p>
        </FadeIn>
        
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {innovations.map((innovation, index) => {
            const innovationImage = PlaceHolderImages.find(p => p.id === innovation.imageId);
            return (
              <FadeIn key={innovation.id} delay={index * 150}>
                <Card className="h-full border-2 border-transparent hover:border-primary hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <Lightbulb className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="font-headline text-lg">{innovation.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{innovation.description}</p>
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
