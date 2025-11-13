"use client";

import type { Product } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import Link from 'next/link';

interface ProductsSectionProps {
  products: Product[];
  showSeeMore?: boolean;
}

export default function ProductsSection({ products, showSeeMore = false }: ProductsSectionProps) {
  const sectionVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1], when: 'beforeChildren', staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.33, 1, 0.68, 1] } },
  };

  return (
    <motion.section id="products" className="py-20 sm:py-28 bg-secondary overflow-hidden" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: 'easeOut' }} viewport={{ once: true }} className="text-center">
          <h2 className="text-3xl font-bold tracking-tight font-headline sm:text-4xl">Our Products</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our product offerings designed to accelerate your business growth.
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
          {products.map((product) => {
            const phImage = PlaceHolderImages.find((p) => p.id === product.imageId);
            const customImageUrl = product.imageUrl && product.imageUrl.trim() !== '' ? product.imageUrl : undefined;
            return (
              <Link href={`/products/${product.slug}`} key={product.id} className="block">
                <motion.div variants={itemVariants} whileHover={{ scale: 1.05, y: -5 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }} className="h-full">
                  <Card className="overflow-hidden h-full flex flex-col rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 bg-background">
                    {(customImageUrl || phImage) && (
                      <div className="aspect-video relative overflow-hidden">
                        <motion.div className="absolute inset-0" initial={{ scale: 1.2 }} whileInView={{ scale: 1 }} transition={{ duration: 1.2, ease: 'easeOut' }} viewport={{ once: true }}>
                          {customImageUrl ? (
                            <Image src={customImageUrl} alt={product.name} fill className="object-cover" />
                          ) : (
                            <Image src={phImage!.imageUrl} alt={phImage!.description} data-ai-hint={phImage!.imageHint} fill className="object-cover" />
                          )}
                        </motion.div>
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <motion.div initial={{ rotate: -20, opacity: 0 }} whileInView={{ rotate: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }} viewport={{ once: true }} className="bg-primary/10 p-3 rounded-full">
                          <Briefcase className="h-6 w-6 text-primary" />
                        </motion.div>
                        <CardTitle className="font-headline text-lg">{product.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col">
                      <CardDescription className="flex-grow text-muted-foreground">{product.description}</CardDescription>
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
