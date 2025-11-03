
'use client';
import type { Innovation } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

interface InnovationSectionProps {
  innovations: Innovation[];
}

export default function InnovationSection({ innovations }: InnovationSectionProps) {

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };
  
  return (
    <motion.section 
      id="innovation" 
      className="py-20 sm:py-28"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div variants={itemVariants}>
          <h2 className="text-3xl font-bold tracking-tight text-center font-headline sm:text-4xl">Innovation Lab</h2>
          <p className="mt-4 text-lg text-center text-muted-foreground max-w-2xl mx-auto">
            At the forefront of research and development, we explore emerging technologies that will shape tomorrow.
          </p>
        </motion.div>
        
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {innovations.map((innovation) => {
            const innovationImage = PlaceHolderImages.find(p => p.id === innovation.imageId);
            return (
              <motion.div
                key={innovation.id}
                variants={itemVariants}
                whileHover={{ scale: 1.03, y: -5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
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
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
