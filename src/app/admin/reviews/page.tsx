'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle2, XCircle, Trash2, RefreshCw } from 'lucide-react';

interface Review {
  _id: string;
  productId: string;
  customerName: string;
  customerEmail: string;
  rating: number;
  title: string;
  comment: string;
  helpful: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export default function AdminReviewsPage() {
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [authorized, setAuthorized] = useState(true);

  // Simple client-side admin guard via localStorage (aligns with current app pattern)
  useEffect(() => {
    try {
      const raw = localStorage.getItem('ppv_user');
      if (!raw) { setAuthorized(false); return; }
      const user = JSON.parse(raw);
      if (user?.role !== 'admin') setAuthorized(false);
    } catch {
      setAuthorized(false);
    }
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', String(limit));
      if (statusFilter !== 'all') params.set('status', statusFilter);
      const res = await fetch(`/api/reviews?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setReviews(json.data);
        setTotal(json.pagination?.total || json.data?.length || 0);
      }
    } catch (e) {
      console.error('Failed to fetch reviews', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, page, limit]);

  const filtered = useMemo(() => {
    if (!search.trim()) return reviews;
    const s = search.toLowerCase();
    return reviews.filter(r =>
      r.customerName.toLowerCase().includes(s) ||
      r.customerEmail.toLowerCase().includes(s) ||
      r.title.toLowerCase().includes(s) ||
      r.comment.toLowerCase().includes(s) ||
      r.productId.toLowerCase().includes(s)
    );
  }, [reviews, search]);

  const doAction = async (id: string, action: 'approve' | 'reject' | 'delete') => {
    setActionLoading(id + action);
    try {
      let res;
      if (action === 'delete') {
        res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
      } else {
        const nextStatus = action === 'approve' ? 'approved' : 'rejected';
        res = await fetch(`/api/reviews/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: nextStatus })
        });
      }
      const json = await res.json();
      if (json.success) {
        fetchReviews();
      } else {
        console.error('Action failed', json.error);
      }
    } catch (e) {
      console.error('Action error', e);
    } finally {
      setActionLoading(null);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));

  if (!authorized) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-2">Access restricted</h1>
        <p className="text-muted-foreground mb-4">You need an admin account to view reviews.</p>
        <div className="flex items-center justify-center gap-2">
          <Link href="/auth/login"><Button variant="outline">Login</Button></Link>
          <Link href="/"><Button>Go Home</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Reviews</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchReviews}>
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-center gap-3">
              <Select value={statusFilter} onValueChange={(v: any) => { setPage(1); setStatusFilter(v); }}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Search reviews..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-64"
              />
            </div>
            <div className="text-sm text-muted-foreground">Page {page} of {totalPages} • {total} total</div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground">
              <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Loading reviews...
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">No reviews found.</div>
          ) : (
            <div className="space-y-4">
              {filtered.map((r) => (
                <div key={r._id} className="border rounded-lg p-4 flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{r.customerName}</span>
                      <span className="text-xs text-muted-foreground">{r.customerEmail}</span>
                      <Badge variant={r.status === 'approved' ? 'default' : r.status === 'pending' ? 'secondary' : 'destructive'}>
                        {r.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">Product: {r.productId}</div>
                    <div className="flex items-center gap-2 text-yellow-500 text-sm">
                      {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                    </div>
                    <div className="font-medium">{r.title}</div>
                    <div className="text-sm text-muted-foreground">{r.comment}</div>
                    <div className="text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {r.status !== 'approved' && (
                      <Button size="sm" onClick={() => doAction(r._id, 'approve')} disabled={actionLoading === r._id + 'approve'}>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        {actionLoading === r._id + 'approve' ? 'Approving...' : 'Approve'}
                      </Button>
                    )}
                    {r.status !== 'rejected' && (
                      <Button size="sm" variant="outline" onClick={() => doAction(r._id, 'reject')} disabled={actionLoading === r._id + 'reject'}>
                        <XCircle className="w-4 h-4 mr-2" />
                        {actionLoading === r._id + 'reject' ? 'Rejecting...' : 'Reject'}
                      </Button>
                    )}
                    <Button size="sm" variant="destructive" onClick={() => doAction(r._id, 'delete')} disabled={actionLoading === r._id + 'delete'}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      {actionLoading === r._id + 'delete' ? 'Deleting...' : 'Delete'}
                    </Button>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              <div className="flex items-center justify-between pt-2">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</Button>
                <div className="text-sm">Page {page} / {totalPages}</div>
                <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
