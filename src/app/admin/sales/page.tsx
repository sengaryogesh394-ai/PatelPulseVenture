"use client";

import { useEffect, useMemo, useState } from "react";

interface SaleItem {
  _id: string;
  productId?: string;
  serviceId?: string;
  productName: string;
  productCategory: string; // 'Digital Product' | 'Service' | ...
  productPrice: number;
  downloadLink?: string;
  userId?: string;
  customerEmail: string;
  customerPhone?: string;
  orderId: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  amount: number;
  currency: string;
  paymentStatus: 'pending' | 'success' | 'failed' | 'cancelled';
  orderStatus: 'created' | 'processing' | 'completed' | 'failed' | 'refunded';
  createdAt: string;
}

export default function AdminSalesPage() {
  const [sales, setSales] = useState<SaleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [typeFilter, setTypeFilter] = useState<'all' | 'product' | 'service'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'pending' | 'failed' | 'cancelled'>('all');
  const [emailQuery, setEmailQuery] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const qs = emailQuery.trim() ? `email=${encodeURIComponent(emailQuery.trim())}` : 'all=1';
      const res = await fetch(`/api/sales?${qs}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Failed to fetch sales');
      setSales(json.data || []);
    } catch (e: any) {
      setError(e.message || 'Failed to fetch sales');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    return (sales || []).filter((s: SaleItem) => {
      if (typeFilter === 'product' && !!s.serviceId) return false;
      if (typeFilter === 'service' && !s.serviceId && s.productCategory !== 'Service') return false;
      if (statusFilter !== 'all' && s.paymentStatus !== statusFilter) return false;
      return true;
    });
  }, [sales, typeFilter, statusFilter]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Sales</h1>
          <p className="text-sm text-muted-foreground">All purchases across products and services</p>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col">
            <label className="text-xs font-semibold">Type</label>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as any)} className="border rounded-md px-3 py-2">
              <option value="all">All</option>
              <option value="product">Products</option>
              <option value="service">Services</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-semibold">Payment Status</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="border rounded-md px-3 py-2">
              <option value="all">All</option>
              <option value="success">Success</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-semibold">Customer Email</label>
            <div className="flex gap-2">
              <input value={emailQuery} onChange={(e) => setEmailQuery(e.target.value)} placeholder="user@email.com" className="border rounded-md px-3 py-2 min-w-[240px]" />
              <button onClick={load} className="px-4 py-2 rounded-md bg-primary text-white">Search</button>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-auto rounded-xl border">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3 text-sm font-semibold">Date</th>
              <th className="text-left p-3 text-sm font-semibold">Type</th>
              <th className="text-left p-3 text-sm font-semibold">Name</th>
              <th className="text-left p-3 text-sm font-semibold">Customer</th>
              <th className="text-left p-3 text-sm font-semibold">Amount</th>
              <th className="text-left p-3 text-sm font-semibold">Payment Status</th>
              <th className="text-left p-3 text-sm font-semibold">Order ID</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="p-6 text-center text-sm text-muted-foreground">Loading...</td></tr>
            ) : error ? (
              <tr><td colSpan={7} className="p-6 text-center text-red-600 text-sm">{error}</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} className="p-6 text-center text-sm text-muted-foreground">No sales found.</td></tr>
            ) : (
              filtered.map((s) => {
                const isService = !!s.serviceId || s.productCategory === 'Service';
                return (
                  <tr key={s._id} className="border-t">
                    <td className="p-3 text-sm">{new Date(s.createdAt).toLocaleString()}</td>
                    <td className="p-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${isService ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                        {isService ? 'Service' : 'Product'}
                      </span>
                    </td>
                    <td className="p-3 text-sm">{s.productName}</td>
                    <td className="p-3 text-sm">
                      <div className="flex flex-col">
                        <span>{s.customerEmail}</span>
                        {s.customerPhone ? <span className="text-xs text-gray-500">{s.customerPhone}</span> : null}
                      </div>
                    </td>
                    <td className="p-3 text-sm">₹{(s.amount || s.productPrice)?.toLocaleString?.() || s.amount}</td>
                    <td className="p-3 text-sm capitalize">{s.paymentStatus}</td>
                    <td className="p-3 text-xs text-gray-600">
                      <div className="flex flex-col">
                        <span>{s.razorpayOrderId || s.orderId}</span>
                        {s.razorpayPaymentId ? <span className="text-[10px] text-gray-400">{s.razorpayPaymentId}</span> : null}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
