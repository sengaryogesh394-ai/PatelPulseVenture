'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Package, 
  ShoppingCart,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  ExternalLink
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Link from 'next/link';

export default function ProductsManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [company, setCompany] = useState<'ppv' | 'digiworldadda'>('ppv');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [counts, setCounts] = useState({ ppv: 0, digi: 0 });

  // Import from Digiworldadda state
  const [importOpen, setImportOpen] = useState(false);
  const [digiProducts, setDigiProducts] = useState<any[]>([]);
  const [digiLoading, setDigiLoading] = useState(false);
  const [digiError, setDigiError] = useState<string | null>(null);
  const [selectedDigiIds, setSelectedDigiIds] = useState<string[]>([]);
  const [digiSearch, setDigiSearch] = useState('');
  const [importing, setImporting] = useState(false);

  // Stats derived from fetched counts
  const stats = [
    {
      title: 'Total Products',
      value: counts.ppv + counts.digi,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'PPV Products',
      value: counts.ppv,
      icon: ShoppingCart,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Digiworldadda Products',
      value: counts.digi,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Featured Products',
      value: products.filter(p => p.isFeatured).length,
      icon: Eye,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    }
  ];

  const handlePlatformSelect = (platform: 'ppv' | 'digiworldadda') => {
    setIsDialogOpen(false);
    // Navigate to the appropriate new product page (propagate company)
    window.location.href = `/admin/products/new?company=${platform}`;
  };

  // Fetch list for selected company
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/products?company=${company}&status=all&limit=100`);
        const json = await res.json();
        if (!json.success) throw new Error(json.error || 'Failed to load products');
        setProducts(Array.isArray(json.data) ? json.data : []);
      } catch (e: any) {
        setError(e.message || 'Failed to load products');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [company]);

  // Load Digiworldadda products when import dialog opens
  useEffect(() => {
    if (!importOpen) return;
    const load = async () => {
      setDigiLoading(true);
      setDigiError(null);
      try {
        const res = await fetch('/api/products?company=digiworldadda&status=all&limit=all');
        const json = await res.json();
        if (!json.success) throw new Error(json.error || 'Failed to load Digiworldadda products');
        setDigiProducts(Array.isArray(json.data) ? json.data : []);
      } catch (e: any) {
        setDigiError(e.message || 'Failed to load Digiworldadda products');
        setDigiProducts([]);
      } finally {
        setDigiLoading(false);
      }
    };
    load();
  }, [importOpen]);

  const toggleSelectDigi = (id: string) => {
    setSelectedDigiIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const filteredDigi = digiProducts.filter((p) => {
    if (!digiSearch) return true;
    const q = digiSearch.toLowerCase();
    return (
      (p.name || '').toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q)
    );
  });

  const handleImportSelected = async () => {
    if (selectedDigiIds.length === 0) return;
    setImporting(true);
    try {
      for (const id of selectedDigiIds) {
        const src = digiProducts.find((p: any) => p._id === id);
        if (!src) continue;
        const productData = {
          name: src.name,
          description: src.description,
          price: src.price,
          originalPrice: src.originalPrice ?? src.price,
          category: src.category || 'General',
          status: src.status || 'active',
          stock: src.stock ?? 999,
          isFeatured: !!src.isFeatured,
          tags: Array.isArray(src.tags) ? src.tags.join(', ') : (src.tags || ''),
          downloadLink: src.downloadLink || '',
          media: Array.isArray(src.media) ? src.media : [],
          features: Array.isArray(src.features) ? src.features : [],
          compatibility: src.compatibility || undefined,
          promotion: src.promotion || undefined,
          promotionalHeader: src.promotionalHeader || undefined,
          productBenefits: src.productBenefits || undefined,
        } as any;

        const resp = await fetch('/api/products?company=ppv', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData),
        });
        const resJson = await resp.json();
        if (!resJson.success) {
          throw new Error(resJson.error || 'Failed to import a product');
        }
      }
      // refresh PPV list
      setCompany('ppv');
      setImportOpen(false);
      setSelectedDigiIds([]);
      // trigger refetch for PPV
      const res = await fetch(`/api/products?company=ppv&status=all&limit=100`);
      const json = await res.json();
      if (json.success) setProducts(Array.isArray(json.data) ? json.data : []);
    } catch (e) {
      alert((e as any)?.message || 'Import failed');
    } finally {
      setImporting(false);
    }
  };

  // Fetch counts for both collections
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [ppvRes, digiRes] = await Promise.all([
          fetch('/api/products?company=ppv&status=all&limit=1'),
          fetch('/api/products?company=digiworldadda&status=all&limit=1'),
        ]);
        const [ppvJson, digiJson] = await Promise.all([ppvRes.json(), digiRes.json()]);
        setCounts({
          ppv: ppvJson?.pagination?.total || (Array.isArray(ppvJson?.data) ? ppvJson.data.length : 0),
          digi: digiJson?.pagination?.total || (Array.isArray(digiJson?.data) ? digiJson.data.length : 0),
        });
      } catch {
        // Silent; keep defaults
      }
    };
    fetchCounts();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-border pb-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Products Management</h1>
                <p className="text-muted-foreground">Manage your digital products for PPV and Digiworldadda</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Choose Platform
                  </DialogTitle>
                  <DialogDescription>Select which platform you want to create a product for.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Button
                    onClick={() => handlePlatformSelect('ppv')}
                    className="h-20 flex-col gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  >
                    <div className="text-lg font-semibold">For PPV</div>
                    <div className="text-xs opacity-90">Patel Pulse Venture Products</div>
                  </Button>
                  <Button
                    onClick={() => handlePlatformSelect('digiworldadda')}
                    className="h-20 flex-col gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                  >
                    <div className="text-lg font-semibold">For Digiworldadda</div>
                    <div className="text-xs opacity-90">Digital World Products</div>
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">{stat.title}</CardTitle>
              <div className={`flex h-8 w-8 items-center justify-center rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900">{stat.value}</div>
              <p className="text-xs text-blue-600 mt-1">{stat.value === 1 ? 'Product' : 'Products'}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Products */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
          <div className="flex items-center gap-2">
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              {company === 'ppv' ? 'PPV Products' : 'Digiworldadda Products'}
            </CardTitle>
            <Badge variant="secondary" className="ml-2">{products.length}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Button variant={company === 'ppv' ? 'default' : 'outline'} size="sm" onClick={() => setCompany('ppv')}>PPV</Button>
            <Button variant={company === 'digiworldadda' ? 'default' : 'outline'} size="sm" onClick={() => setCompany('digiworldadda')}>Digiworldadda</Button>
            {company === 'ppv' && (
              <Dialog open={importOpen} onOpenChange={setImportOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">Import from Digiworldadda</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Import Digiworldadda Products to PPV</DialogTitle>
                    <DialogDescription>Select one or more products to import as PPV products.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-3">
                    <input type="text" placeholder="Search Digiworldadda products..." className="w-full rounded-md border px-3 py-2 text-sm" value={digiSearch} onChange={(e) => setDigiSearch(e.target.value)} />
                    {digiError && <div className="text-sm text-red-600">{digiError}</div>}
                    {digiLoading ? (
                      <div className="text-sm text-muted-foreground py-6">Loading...</div>
                    ) : (
                      <div className="max-h-80 overflow-auto border rounded-md">
                        {filteredDigi.length === 0 ? (
                          <div className="p-4 text-sm text-muted-foreground">No products</div>
                        ) : (
                          <ul className="divide-y">
                            {filteredDigi.map((p: any) => (
                              <li key={p._id} className="flex items-start gap-3 p-3">
                                <input type="checkbox" className="mt-1" checked={selectedDigiIds.includes(p._id)} onChange={() => toggleSelectDigi(p._id)} />
                                <div className="flex-1">
                                  <div className="font-medium text-sm">{p.name}</div>
                                  <div className="text-xs text-muted-foreground">{p.category} • ₹{p.price}</div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setImportOpen(false)}>Cancel</Button>
                      <Button onClick={handleImportSelected} disabled={importing || selectedDigiIds.length === 0}>{importing ? 'Importing...' : `Import Selected (${selectedDigiIds.length})`}</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {error && <div className="text-sm text-red-600 py-4">{error}</div>}
          {!loading && products.length === 0 && !error && (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold text-foreground">No products found</h3>
              <p className="mt-1 text-sm text-muted-foreground">Get started by creating your first digital product.</p>
            </div>
          )}

          {loading ? (
            <div className="py-10 text-center text-sm text-muted-foreground">Loading products...</div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p: any) => (
                <Card key={p._id} className="hover:shadow-md transition">
                  <CardHeader className="pb-3 flex flex-row items-start justify-between gap-2">
                    <div>
                      <CardTitle className="text-base">{p.name}</CardTitle>
                      <CardDescription>{p.category}</CardDescription>
                    </div>
                    <Badge variant="secondary">{company === 'ppv' ? 'PPV' : 'Digiworldadda'}</Badge>
                  </CardHeader>
                  <CardContent className="flex items-center justify-between">
                    <div className="text-sm">
                      <div className="font-semibold">₹{p.price}</div>
                      <div className="text-muted-foreground">{p.status}</div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/admin/products/${p._id}`}>
                        <Button variant="outline" size="icon"><Eye className="h-4 w-4" /></Button>
                      </Link>
                      <Link href={`/admin/products/${p._id}/edit`}>
                        <Button variant="outline" size="icon"><Edit className="h-4 w-4" /></Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
