'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import type { Testimonial } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface AnimatedTestimonialsProps {
  testimonials: Testimonial[];
  autoplay?: boolean;
}

const AnimatedTestimonials = ({ testimonials, autoplay = true }: AnimatedTestimonialsProps) => {
  const [active, setActive] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [rotations, setRotations] = useState<string[]>([]);

  useEffect(() => {
    setIsClient(true);
    setRotations(testimonials.map(() => `${Math.floor(Math.random() * 16) - 8}deg`));
  }, [testimonials]);

  const handleNext = useCallback(() => {
    setActive((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    if (!autoplay || !isClient) return;
    const interval = setInterval(handleNext, 5000);
    return () => clearInterval(interval);
  }, [autoplay, handleNext, isClient]);

  const isActive = (index: number) => index === active;

  if (!isClient) {
    return null; // Or a loading skeleton
  }

  return (
    <section id="testimonials" className="py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight text-center font-headline sm:text-4xl">What Our Clients Say</h2>
            <p className="mt-4 text-lg text-center text-muted-foreground max-w-2xl mx-auto">
                We are trusted by leading companies and visionary founders.
            </p>
            <div className="relative grid grid-cols-1 gap-y-12 md:grid-cols-2 md:gap-x-20 mt-16">
                {/* Image Section */}
                <div className="flex items-center justify-center">
                    <div className="relative h-80 w-full max-w-xs">
                    <AnimatePresence>
                        {testimonials.map((testimonial, index) => {
                        const testimonialImage = PlaceHolderImages.find(p => p.id === testimonial.imageId);
                        return (
                            <motion.div
                                key={testimonial.id}
                                initial={{ opacity: 0, scale: 0.9, y: 50, rotate: rotations[index] || '0deg' }}
                                animate={{
                                    opacity: isActive(index) ? 1 : 0.5,
                                    scale: isActive(index) ? 1 : 0.9,
                                    y: isActive(index) ? 0 : 20,
                                    zIndex: isActive(index) ? testimonials.length : testimonials.length - Math.abs(index - active),
                                    rotate: isActive(index) ? '0deg' : rotations[index] || '0deg',
                                }}
                                exit={{ opacity: 0, scale: 0.9, y: -50 }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                                className="absolute inset-0 origin-bottom"
                                style={{ perspective: '1000px' }}
                            >
                                {testimonialImage && (
                                    <Image
                                        src={testimonialImage.imageUrl}
                                        alt={testimonial.name}
                                        width={500}
                                        height={500}
                                        draggable={false}
                                        className="h-full w-full rounded-3xl object-cover shadow-2xl"
                                    />
                                )}
                            </motion.div>
                        )})}
                    </AnimatePresence>
                    </div>
                </div>

                {/* Text and Controls Section */}
                <div className="flex flex-col justify-center py-4">
                <AnimatePresence mode="wait">
                    <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="flex flex-col justify-between"
                    >
                        <div>
                            <h3 className="text-2xl font-bold text-foreground">
                                {testimonials[active].name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {testimonials[active].role}
                            </p>
                            <motion.p className="mt-8 text-lg text-muted-foreground">
                                &quot;{testimonials[active].quote}&quot;
                            </motion.p>
                        </div>
                    </motion.div>
                </AnimatePresence>
                <div className="flex gap-4 pt-12">
                    <button
                    onClick={handlePrev}
                    aria-label="Previous testimonial"
                    className="group flex h-10 w-10 items-center justify-center rounded-full bg-secondary transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    >
                    <ArrowLeft className="h-5 w-5 text-foreground transition-transform duration-300 group-hover:-translate-x-1" />
                    </button>
                    <button
                    onClick={handleNext}
                    aria-label="Next testimonial"
                    className="group flex h-10 w-10 items-center justify-center rounded-full bg-secondary transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    >
                    <ArrowRight className="h-5 w-5 text-foreground transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                </div>
                </div>
            </div>
        </div>
    </section>
  );
};


export default function TestimonialSection({ testimonials }: { testimonials: Testimonial[] }) {
    return <AnimatedTestimonials testimonials={testimonials} />;
}
