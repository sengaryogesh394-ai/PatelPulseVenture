'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { applicationDevelopmentServices, topServices } from '@/lib/app-development-data';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Code, Smartphone, ShoppingCart, Search, Cloud, FlaskConical, Settings2, GitBranch } from 'lucide-react';
import { motion } from 'framer-motion';

const iconMap: { [key: string]: React.ReactNode } = {
  'Website Development': <Code className="w-8 h-8 text-blue-500" />,
  'Mobile app Development': <Smartphone className="w-8 h-8 text-blue-500" />,
  'Software Development': <GitBranch className="w-8 h-8 text-blue-500" />,
  'Digital marketing Services': <ShoppingCart className="w-8 h-8 text-blue-500" />,
  'Affiliated Marketing Services': <Settings2 className="w-8 h-8 text-blue-500" />,
  'SEM/SEM': <Search className="w-8 h-8 text-blue-500" />,
  'Cloud & DevOps': <Cloud className="w-8 h-8 text-blue-500" />,
  'Software Testing': <FlaskConical className="w-8 h-8 text-blue-500" />,
};

const ServiceCard = ({ title, description }: { title: string; description: string }) => {
  return (
    <motion.div
      className="w-full"
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <Card className="bg-card/90 backdrop-blur-sm shadow-lg text-left transition-shadow duration-300 cursor-pointer h-full">
        <CardHeader className="flex flex-row items-center gap-4">
           <div className="text-blue-500">
            {iconMap[title] || <Code className="w-8 h-8" />}
          </div>
          <CardTitle className="text-orange-500 font-semibold text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function ApplicationDevelopmentSection() {
  const centerImage = PlaceHolderImages.find(p => p.id === 'robot-lifecycle');

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
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <h2 className="text-3xl font-bold tracking-tight font-headline sm:text-4xl text-primary">
            Application Development stages
          </h2>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start max-w-7xl mx-auto">
          {/* Left Column */}
          <motion.div className="flex flex-col gap-8" variants={sectionVariants}>
            {applicationDevelopmentServices.map(service => (
              <motion.div key={service.title} variants={itemVariants}>
                <ServiceCard {...service} />
              </motion.div>
            ))}
          </motion.div>

          {/* Center Image */}
          <motion.div className="hidden lg:flex justify-center items-center h-full" variants={itemVariants}>
            {centerImage && (
              <Image
                src={centerImage.imageUrl}
                alt={centerImage.description}
                width={400}
                height={400}
                data-ai-hint={centerImage.imageHint}
                className="transition-transform duration-300 ease-in-out transform hover:scale-105"
              />
            )}
          </motion.div>

          {/* Right Column */}
          <motion.div className="flex flex-col gap-8" variants={sectionVariants}>
            {topServices.map(service => (
              <motion.div key={service.title} variants={itemVariants}>
                <ServiceCard {...service} />
              </motion.div>
            ))}
          </motion.div>
        </div>

      </div>
    </motion.section>
  );
}
