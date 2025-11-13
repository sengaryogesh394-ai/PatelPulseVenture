'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  Database,
  Filter,
} from 'lucide-react';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { 
  getProducts, 
  deleteProduct, 
  toggleProductStatus, 
  seedProducts, 
  resetProducts 
} from '@/lib/products-api';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function ProductsManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchProductsList = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProducts();
      setProducts(data);
      setFiltered(data);
    } catch (err) {
      setError('Failed to fetch products');
      console.error(err);
      setProducts([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsList();
  }, []);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const q = term.toLowerCase();
    setFiltered(
      products.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
    );
  };

  const handleDelete = async (productId: string, name: string) => {
    const confirmed = window.confirm(`Delete "${name}"? This cannot be undone.`);
    if (!confirmed) return;
    try {
      setError(null);
      await deleteProduct(productId);
      alert(`Product "${name}" deleted.`);
      await fetchProductsList();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to delete product';
      setError(msg);
      alert(`Error: ${msg}`);
    }
  };

  const handleToggleStatus = async (productId: string) => {
    try {
      setError(null);
      setTogglingId(productId);
      await toggleProductStatus(productId);
      await fetchProductsList();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to toggle product status';
      setError(msg);
      alert(`Error: ${msg}`);
    } finally {
      setTogglingId(null);
    }
  };

  const handleSeed = async () => {
    try {
      setLoading(true);
      await seedProducts();
      await fetchProductsList();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to seed products');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    const confirmed = window.confirm('This will reset and reseed all products. Continue?');
    if (!confirmed) return;
    try {
      setLoading(true);
      await resetProducts();
      await fetchProductsList();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset products');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 relative isolate pb-32">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Products Management
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">
            Manage your product offerings.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSeed} disabled={loading} variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
            {loading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Database className="w-4 h-4 mr-2" />}
            Seed Products
          </Button>
          <Button onClick={handleReset} disabled={loading} variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50">
            {loading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Database className="w-4 h-4 mr-2" />}
            Reset & Seed
          </Button>
          <Button onClick={fetchProductsList} disabled={loading} variant="outline" className="border-green-200 text-green-600 hover:bg-green-50">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-lg text-slate-600">Loading products...</span>
        </div>
      )}

      {!loading && (
        <Card className="relative z-10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Products</CardTitle>
                <CardDescription>View and manage all products</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search products..." value={searchTerm} onChange={(e) => handleSearch(e.target.value)} className="pl-8 w-64" />
                </div>
                <Button variant="outline" size="icon" title="Filters disabled for now">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pb-8">
            <div className="overflow-x-auto pb-12">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Details Count</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div className="font-semibold">{product.name}</div>
                          <div className="text-sm text-muted-foreground">ID: {product.id}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-md">
                          <p className="text-sm line-clamp-2">{product.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{product.details?.length || 0} sections</Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleStatus(product.id)}
                          disabled={togglingId === product.id}
                          className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 ${
                            (product.status || 'active') === 'active'
                              ? 'bg-green-100 text-green-800 hover:bg-green-200 border border-green-300'
                              : 'bg-red-100 text-red-800 hover:bg-red-200 border border-red-300'
                          } ${togglingId === product.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}`}
                        >
                          {togglingId === product.id ? (
                            <>
                              <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                              Updating...
                            </>
                          ) : (
                            <>
                              <div className={`w-2 h-2 rounded-full mr-2 ${
                                (product.status || 'active') === 'active' ? 'bg-green-500' : 'bg-red-500'
                              }`} />
                              {(product.status || 'active') === 'active' ? 'Active' : 'Inactive'}
                            </>
                          )}
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2 relative z-30 pointer-events-auto">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/products/${product.slug}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          {/* Edit page not implemented yet; keep hidden to avoid broken link */}
                          {/* <Button variant="ghost" size="icon" asChild>
                            <Link href={`/admin/products/${product.id}/edit`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button> */}
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDelete(product.id, product.name)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="h-32" />
    </div>
  );
}
