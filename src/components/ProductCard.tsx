
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Pencil } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Minimal product type used by this card (compatible with both DB and mock data)
type Product = {
  id?: string;
  slug?: string;
  name: string;
  price: number;
  media: Array<{ url: string; hint?: string }>;
  category: string;
  isFeatured?: boolean;
};

type ProductCardProps = {
  product: Product;
  company?: 'ppv' | 'digiworldadda';
};

export function ProductCard({ product, company }: ProductCardProps) {
  const router = useRouter();
  // Handle both database products (slug) and mock products (id)
  const base = product.slug ? `/shop/${product.slug}` : `/shop/${product.id}`;
  const productLink = company ? `${base}?company=${company}` : base;
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('ppv_user') : null;
      if (raw) {
        const u = JSON.parse(raw);
        setIsAdmin(u?.role === 'admin');
      }
    } catch {}
  }, []);

  const editId = product.slug || product.id;
  const editLink = editId ? `/admin/products/${editId}/edit${company ? `?company=${company}` : ''}` : '#';
  
  return (
    <Link href={productLink} className="block h-full w-full group">
        <Card className="overflow-hidden h-full transition-shadow duration-300 hover:shadow-xl border-0 bg-transparent shadow-none">
            <div className="aspect-square relative overflow-hidden rounded-lg">
            <motion.div whileHover={{ scale: 1.05 }} className="h-full w-full">
                <Image
                    src={product.media[0].url}
                    alt={product.name}
                    fill
                    className="object-cover bg-secondary"
                    data-ai-hint={product.media[0].hint}
                />
            </motion.div>
            {product.isFeatured && <Badge className="absolute top-3 left-3">Featured</Badge>}
            {isAdmin && editId && (
              <Button
                size="icon"
                variant="secondary"
                className="absolute top-3 right-3 z-10 h-8 w-8"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  router.push(editLink);
                }}
                aria-label="Edit product"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            <div className="absolute top-0 right-0 bottom-0 left-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex items-end p-4">
                <div className="w-full">
                    <p className="text-white/80 text-sm mb-1">{product.category}</p>
                    <h3 className="font-semibold text-lg truncate h-7 text-white">
                        {product.name}
                    </h3>
                    <div className="flex items-center justify-between mt-2">
                        <p className="font-bold text-lg text-white">Rs {product.price.toFixed(2)}</p>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Button size="sm">
                                <ShoppingCart className="w-4 h-4 mr-2"/>
                                View
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </Card>
    </Link>
  );
}
