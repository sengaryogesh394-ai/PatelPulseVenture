'use client';

import { useEffect, useState } from 'react';
import ProductsSection from '@/components/sections/products-section';
import { getProducts } from '@/lib/products-api';
import type { Product } from '@/lib/types';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        const active = data.filter((p) => (p.status || 'active') === 'active');
        setProducts(active);
      } catch (err) {
        console.error('Error fetching products:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  return <ProductsSection products={products} />;
}
