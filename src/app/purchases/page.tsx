'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

interface User {
  _id?: string
  name: string
  email: string
  role?: string
}

interface Sale {
  _id: string
  productId: string
  productName: string
  productCategory: string
  productPrice: number
  downloadLink?: string
  orderId: string
  amount: number
  currency: string
  paymentStatus: 'pending' | 'success' | 'failed' | 'cancelled'
  orderStatus: 'created' | 'processing' | 'completed' | 'failed' | 'refunded'
  createdAt: string
}

export default function PurchasesPage() {
  const [user, setUser] = useState<User | null>(null)
  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const raw1 = localStorage.getItem('ppv_user')
      const raw2 = localStorage.getItem('user')
      const raw = raw1 || raw2
      if (raw) setUser(JSON.parse(raw))
    } catch {}
  }, [])

  useEffect(() => {
    const load = async () => {
      if (!user) return
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (user._id) params.set('userId', user._id)
        else params.set('email', user.email)
        const res = await fetch(`/api/sales?${params.toString()}`)
        const json = await res.json()
        if (json?.success && Array.isArray(json.data)) {
          setSales(json.data)
        } else {
          setSales([])
        }
      } catch {
        setSales([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user])

  if (!user) {
    return (
      <main className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-md rounded-xl border border-border bg-card p-8 text-center">
          <h1 className="mb-2 text-2xl font-semibold">You are not logged in</h1>
          <p className="mb-6 text-muted-foreground">Login to view your purchases</p>
          <Link href="/auth/login" className="inline-block rounded-md bg-primary px-4 py-2 text-white">Login</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Purchases</h1>
            <p className="text-muted-foreground">Order history for {user.email}</p>
          </div>
          <Link href="/profile" className="rounded-md border border-border px-4 py-2">Back to Profile</Link>
        </header>

        <section className="rounded-xl border border-border bg-card p-4 sm:p-6">
          {loading ? (
            <div className="py-16 text-center text-muted-foreground">Loading purchases...</div>
          ) : sales.length === 0 ? (
            <div className="py-16 text-center">
              <h2 className="text-xl font-semibold">No purchases yet</h2>
              <p className="text-muted-foreground">Your orders will appear here after successful payment.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border text-muted-foreground">
                  <tr>
                    <th className="py-3 pr-4">Date</th>
                    <th className="py-3 pr-4">Product</th>
                    <th className="py-3 pr-4">Amount</th>
                  
                    <th className="py-3 pr-4">Order</th>
                    <th className="py-3 pr-4">Download</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map((s) => (
                    <tr key={s._id} className="border-b border-border last:border-0">
                      <td className="py-3 pr-4 whitespace-nowrap">{new Date(s.createdAt).toLocaleString()}</td>
                      <td className="py-3 pr-4">
                        <div className="font-medium">{s.productName}</div>
                        <div className="text-xs text-muted-foreground">{s.productCategory}</div>
                      </td>
                      <td className="py-3 pr-4">₹{s.amount} {s.currency}</td>
                     
                      <td className="py-3 pr-4 text-xs">{s.orderId}</td>
                      <td className="py-3 pr-4">
                        {s.downloadLink ? (
                          <a href={s.downloadLink} target="_blank" rel="noopener noreferrer" className="rounded-md bg-primary px-3 py-1 text-white">Download</a>
                        ) : (
                          <span className="text-xs text-muted-foreground">N/A</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
