
'use client';
import type { Service } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';

interface ServicesSectionProps {
  services: Service[];
}

export default function ServicesSection({ services }: ServicesSectionProps) {
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
        id="services" 
        className="py-20 sm:py-28 bg-secondary"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div variants={itemVariants}>
          <h2 className="text-3xl font-bold tracking-tight text-center font-headline sm:text-4xl">Our Services</h2>
          <p className="mt-4 text-lg text-center text-muted-foreground max-w-2xl mx-auto">
            We provide a range of services to foster innovation and drive growth.
          </p>
        </motion.div>
        
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
          {services.map((service, index) => {
            const serviceImage = PlaceHolderImages.find(p => p.id === service.imageId);
            return (
              <motion.div
                key={service.id}
                variants={itemVariants}
                whileHover={{ scale: 1.03, y: -5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Card className="overflow-hidden h-full flex flex-col transition-shadow duration-300 hover:shadow-xl">
                  {serviceImage && (
                    <div className="aspect-video relative">
                      <Image
                        src={serviceImage.imageUrl}
                        alt={serviceImage.description}
                        data-ai-hint={serviceImage.imageHint}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                   <CardHeader>
                    <div className="flex items-center gap-4">
                       <div className="bg-primary/10 p-3 rounded-full">
                         <Briefcase className="h-6 w-6 text-primary" />
                       </div>
                       <CardTitle className="font-headline text-lg">{service.name}</CardTitle>
                    </div>
                   </CardHeader>
                  <CardContent className="flex-grow flex flex-col">
                    <CardDescription className="flex-grow">{service.description}</CardDescription>
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
