
// 'use client';
// import type { Service } from '@/lib/types';
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
// import Image from 'next/image';
// import { PlaceHolderImages } from '@/lib/placeholder-images';
// import { motion } from 'framer-motion';
// import { Briefcase } from 'lucide-react';
// import Link from 'next/link';

// interface ServicesSectionProps {
//   services: Service[];
// }

// export default function ServicesSection({ services }: ServicesSectionProps) {
//     const sectionVariants = {
//     hidden: { opacity: 0, y: 50 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.2 } },
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
//   };
//   return (
//     <motion.section 
//         id="services" 
//         className="py-20 sm:py-28 bg-secondary"
//         variants={sectionVariants}
//         initial="hidden"
//         whileInView="visible"
//         viewport={{ once: true, amount: 0.2 }}
//     >
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//         <motion.div variants={itemVariants}>
//           <h2 className="text-3xl font-bold tracking-tight text-center font-headline sm:text-4xl">Our Services</h2>
//           <p className="mt-4 text-lg text-center text-muted-foreground max-w-2xl mx-auto">
//             We provide a range of services to foster innovation and drive growth.
//           </p>
//         </motion.div>
        
//         <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
//           {services.map((service, index) => {
//             const serviceImage = PlaceHolderImages.find(p => p.id === service.imageId);
//             return (
//                 <Link href={`/services/${service.slug}`} key={service.id} className="block">
//                     <motion.div
//                         variants={itemVariants}
//                         whileHover={{ scale: 1.03, y: -5 }}
//                         transition={{ type: 'spring', stiffness: 300 }}
//                         className="h-full"
//                     >
//                         <Card className="overflow-hidden h-full flex flex-col transition-shadow duration-300 hover:shadow-xl">
//                         {serviceImage && (
//                             <div className="aspect-video relative">
//                             <Image
//                                 src={serviceImage.imageUrl}
//                                 alt={serviceImage.description}
//                                 data-ai-hint={serviceImage.imageHint}
//                                 fill
//                                 className="object-cover"
//                             />
//                             </div>
//                         )}
//                         <CardHeader>
//                             <div className="flex items-center gap-4">
//                             <div className="bg-primary/10 p-3 rounded-full">
//                                 <Briefcase className="h-6 w-6 text-primary" />
//                             </div>
//                             <CardTitle className="font-headline text-lg">{service.name}</CardTitle>
//                             </div>
//                         </CardHeader>
//                         <CardContent className="flex-grow flex flex-col">
//                             <CardDescription className="flex-grow">{service.description}</CardDescription>
//                         </CardContent>
//                         </Card>
//                     </motion.div>
//               </Link>
//             );
//           })}
//         </div>
//       </div>
//     </motion.section>
//   );
// }

'use client';
import type { Service } from '@/lib/types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import Link from 'next/link';

interface ServicesSectionProps {
  services: Service[];
}

export default function ServicesSection({ services }: ServicesSectionProps) {
  const sectionVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1],
        when: 'beforeChildren',
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = (index: number) => {
    const directions = [
      { x: -100, y: 0 },
      { x: 100, y: 0 },
      { x: 0, y: 100 },
      { x: 0, y: -100 },
    ];
    const dir = directions[index % directions.length];
    return {
      hidden: { opacity: 0, ...dir },
      visible: {
        opacity: 1,
        x: 0,
        y: 0,
        transition: {
          duration: 0.8,
          ease: [0.33, 1, 0.68, 1],
        },
      },
    };
  };

  return (
    <motion.section
      id="services"
      className="py-20 sm:py-28 bg-secondary overflow-hidden"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }} // 👈 animation triggers only when 30% of the section is visible
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight font-headline sm:text-4xl">
            Our Services
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            We provide a range of digital services to help your business grow and innovate.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
          {services.map((service, index) => {
            const serviceImage = PlaceHolderImages.find(
              (p) => p.id === service.imageId
            );
            return (
              <Link href={`/services/${service.slug}`} key={service.id} className="block">
                <motion.div
                  variants={itemVariants(index)}
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="h-full"
                >
                  <Card className="overflow-hidden h-full flex flex-col rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 bg-background">
                    {serviceImage && (
                      <div className="aspect-video relative overflow-hidden">
                        <motion.div
                          className="absolute inset-0"
                          initial={{ scale: 1.2 }}
                          whileInView={{ scale: 1 }}
                          transition={{ duration: 1.2, ease: 'easeOut' }}
                          viewport={{ once: true }}
                        >
                          <Image
                            src={serviceImage.imageUrl}
                            alt={serviceImage.description}
                            data-ai-hint={serviceImage.imageHint}
                            fill
                            className="object-cover"
                          />
                        </motion.div>
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <motion.div
                          initial={{ rotate: -20, opacity: 0 }}
                          whileInView={{ rotate: 0, opacity: 1 }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                          viewport={{ once: true }}
                          className="bg-primary/10 p-3 rounded-full"
                        >
                          <Briefcase className="h-6 w-6 text-primary" />
                        </motion.div>
                        <CardTitle className="font-headline text-lg">
                          {service.name}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col">
                      <CardDescription className="flex-grow text-muted-foreground">
                        {service.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
