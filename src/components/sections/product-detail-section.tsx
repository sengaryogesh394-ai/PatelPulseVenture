'use client';

import type { Product } from '@/lib/types';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetailSection({ product }: ProductDetailProps) {
  const phImage = PlaceHolderImages.find((p) => p.id === product.imageId);
  const customImageUrl = product.imageUrl && product.imageUrl.trim() !== '' ? product.imageUrl : undefined;

  return (
    <div className="py-20 sm:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl font-bold tracking-tight text-center font-headline sm:text-5xl text-primary">{product.name}</h1>
          <p className="mt-6 text-lg text-center text-muted-foreground max-w-3xl mx-auto">{product.longDescription}</p>
        </motion.div>

        <motion.div className="mt-16" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
          {(customImageUrl || phImage) && (
            <div className="aspect-video relative rounded-xl overflow-hidden shadow-2xl">
              {customImageUrl ? (
                <Image src={customImageUrl} alt={product.name} fill sizes="(max-width: 768px) 100vw, 1200px" unoptimized loader={({ src }) => src} className="object-cover" />
              ) : (
                <Image src={phImage!.imageUrl} alt={product.name} data-ai-hint={phImage!.imageHint} fill sizes="(max-width: 768px) 100vw, 1200px" className="object-cover" />
              )}
            </div>
          )}
        </motion.div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-12">
          {product.details.map((detail, index) => (
            <motion.div key={detail.title} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5, delay: index * 0.1 }} whileHover={{ y: -5, scale: 1.02 }}>
              <Card className="h-full bg-secondary/50 transition-shadow duration-300 hover:shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold text-primary/90">{detail.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {detail.points.map((point) => (
                      <li key={point} className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{point}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
