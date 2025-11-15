
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/ProductCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice: number;
  media: { id: string; url: string; hint: string; type: string }[];
  category: string;
  status: string;
  isFeatured: boolean;
}

export default function ShopPageContent({ company = 'ppv' as 'ppv' | 'digiworldadda', status = 'active' as 'active' | 'all', limit = 12 }: { company?: 'ppv' | 'digiworldadda'; status?: 'active' | 'all'; limit?: number }) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategory ? [initialCategory] : []);
  const [priceRange, setPriceRange] = useState<number[]>([0]);

  useEffect(() => {
    fetchProducts();
  }, [company, status, limit]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`/api/products?status=${status}&company=${company}&limit=${encodeURIComponent(String(limit))}`);
      const result = await response.json();
      
      if (result.success) {
        setProducts(result.data);
        // Extract unique categories
        const uniqueCategories = [...new Set(result.data.map((p: Product) => p.category))] as string[];
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const maxPrice = useMemo(() => {
    if (products.length === 0) return 0;
    const numericPrices = products
      .map((p) => Number(p.price))
      .filter((n) => Number.isFinite(n) && n >= 0);
    if (numericPrices.length === 0) return 0;
    const m = Math.max(...numericPrices);
    return Math.ceil(m / 10) * 10;
  }, [products]);

  useEffect(() => {
    if (maxPrice > 0) setPriceRange([maxPrice]);
  }, [maxPrice]);
  
  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setSelectedCategories(prev => prev.includes(category) ? prev : [...prev, category]);
    }
  }, [searchParams]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product: Product) => {
      const categoryMatch =
        selectedCategories.length === 0 ||
        selectedCategories.includes(product.category);
      const currentCap = priceRange?.[0];
      const applyPrice = Number.isFinite(currentCap) && currentCap > 0;
      const productPrice = Number(product.price);
      const priceMatch = !applyPrice || (Number.isFinite(productPrice) && productPrice <= currentCap);
      return categoryMatch && priceMatch;
    });
  }, [products, selectedCategories, priceRange]);

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([maxPrice]);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-headline">Shop All Products</h1>
        <p className="text-lg text-muted-foreground mt-2">Find your next creative asset.</p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Filters</CardTitle>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category: string) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={category}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => handleCategoryChange(category)}
                      />
                      <Label htmlFor={category} className="cursor-pointer">{category}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Price Range</h3>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={maxPrice}
                  step={1}
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                  <span>Rs 0</span>
                  <span>Rs {priceRange[0].toFixed(0)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* Products Grid */}
        <main className="lg:col-span-3">
          {loading ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product: Product) => (
                <ProductCard 
                  key={product._id} 
                  product={{
                    id: product.slug,
                    name: product.name,
                    price: product.price,
                    media: product.media,
                    category: product.category,
                    isFeatured: product.isFeatured
                  }} 
                  company={company}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
                <h3 className="text-2xl font-semibold">No Products Found</h3>
                <p className="text-muted-foreground mt-2">Try adjusting your filters.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
