'use client';
import type { Testimonial } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

interface TestimonialSectionProps {
  testimonials: Testimonial[];
}

export default function TestimonialSection({ testimonials }: TestimonialSectionProps) {
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.section
      id="testimonials"
      className="py-20 sm:py-28"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div variants={sectionVariants}>
          <h2 className="text-3xl font-bold tracking-tight text-center font-headline sm:text-4xl">What Our Clients Say</h2>
          <p className="mt-4 text-lg text-center text-muted-foreground max-w-2xl mx-auto">
            We are trusted by leading companies and visionary founders.
          </p>
        </motion.div>

        <motion.div className="mt-16" variants={sectionVariants}>
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {testimonials.map((testimonial) => {
                const testimonialImage = PlaceHolderImages.find(p => p.id === testimonial.imageId);
                return (
                  <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-4 h-full">
                      <Card className="h-full flex flex-col justify-between p-6 bg-secondary/50">
                        <CardContent className="p-0">
                          <Quote className="w-8 h-8 text-primary mb-4" />
                          <p className="text-muted-foreground italic">&quot;{testimonial.quote}&quot;</p>
                        </CardContent>
                        <div className="mt-6 flex items-center gap-4">
                          {testimonialImage && (
                            <Avatar className="w-14 h-14 border-2 border-primary">
                              <AvatarImage src={testimonialImage.imageUrl} alt={testimonial.name} data-ai-hint={testimonialImage.imageHint} />
                              <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                          )}
                          <div>
                            <p className="font-semibold text-foreground">{testimonial.name}</p>
                            <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </motion.div>
      </div>
    </motion.section>
  );
}
