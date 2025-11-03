
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { applicationDevelopmentServices, topServices } from '@/lib/app-development-data';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Code, Smartphone, Globe, Settings, ShoppingCart, Search, Cloud, FlaskConical } from 'lucide-react';
import { motion } from 'framer-motion';

const iconMap: { [key: string]: React.ReactNode } = {
  'Website Development': <Globe className="w-8 h-8" />,
  'Mobile app Development': <Smartphone className="w-8 h-8" />,
  'Software Development': <Code className="w-8 h-8" />,
  'Digital marketing Services': <ShoppingCart className="w-8 h-8" />,
  'Afiliated Marketing Services': <Settings className="w-8 h-8" />,
  'SEM/SEM': <Search className="w-8 h-8" />,
  'Cloud & DevOps': <Cloud className="w-8 h-8" />,
  'Software Testing': <FlaskConical className="w-8 h-8" />,
};

const ServiceCard = ({ title, description }: { title: string; description: string }) => {
  return (
    <motion.div
      className="w-full"
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <Card className="bg-card/90 backdrop-blur-sm shadow-lg text-center transition-shadow duration-300 cursor-pointer h-full">
        <CardHeader className="items-center">
          <div className="text-primary mb-3">
            <div className="text-4xl mb-2">{iconMap[title] || <Code className="w-8 h-8" />}</div>
          </div>
          <CardTitle className="text-primary font-semibold text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function ApplicationDevelopmentSection() {
  const centerImage = PlaceHolderImages.find(p => p.id === 'headphone-image');

  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.section 
      id="application-development" 
      className="py-20 sm:py-28 bg-secondary/50"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="text-center mb-12" variants={itemVariants}>
          <h2 className="text-3xl font-bold tracking-tight font-headline sm:text-4xl text-primary">
            Application Development Stages
          </h2>
        </motion.div>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-6xl mx-auto"
          variants={sectionVariants}
        >
          <motion.div className="flex flex-col gap-8" variants={itemVariants}>
            {applicationDevelopmentServices.slice(0, 2).map(service => (
              <ServiceCard key={service.title} {...service} />
            ))}
          </motion.div>

          <motion.div className="flex justify-center items-center" variants={itemVariants}>
            {centerImage && (
              <Image
                src={centerImage.imageUrl}
                alt={centerImage.description}
                width={400}
                height={400}
                data-ai-hint={centerImage.imageHint}
                className="transition-transform duration-300 ease-in-out transform hover:scale-105 rounded-full shadow-2xl"
              />
            )}
          </motion.div>

          <motion.div className="flex flex-col gap-8" variants={itemVariants}>
            {applicationDevelopmentServices.slice(2, 4).map(service => (
              <ServiceCard key={service.title} {...service} />
            ))}
          </motion.div>
        </motion.div>
        
        <motion.div className="text-center my-20" variants={itemVariants}>
          <h2 className="text-3xl font-bold tracking-tight font-headline sm:text-4xl text-primary">
            Top Services
          </h2>
        </motion.div>

         <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-6xl mx-auto"
          variants={sectionVariants}
        >
          <motion.div className="flex flex-col gap-8" variants={itemVariants}>
            {topServices.slice(0, 2).map(service => (
              <ServiceCard key={service.title} {...service} />
            ))}
          </motion.div>

           <motion.div className="hidden md:block" />

          <motion.div className="flex flex-col gap-8" variants={itemVariants}>
            {topServices.slice(2, 4).map(service => (
              <ServiceCard key={service.title} {...service} />
            ))}
          </motion.div>
        </motion.div>

      </div>
    </motion.section>
  );
}
