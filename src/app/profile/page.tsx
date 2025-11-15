'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface User {
  _id?: string
  name: string
  email: string
  role?: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    try {
      const raw1 = localStorage.getItem('ppv_user')
      const raw2 = localStorage.getItem('user')
      const raw = raw1 || raw2
      if (raw) setUser(JSON.parse(raw))
    } catch {}
  }, [])

  if (!user) {
    return (
      <main className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-md rounded-xl border border-border bg-card p-8 text-center">
          <h1 className="mb-2 text-2xl font-semibold">You are not logged in</h1>
          <p className="mb-6 text-muted-foreground">Please login to view your profile</p>
          <Link href="/auth/login" className="inline-block rounded-md bg-primary px-4 py-2 text-white">Login</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-2xl space-y-6">
        <header>
          <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
          <p className="text-muted-foreground">Manage your account details</p>
        </header>

        <section className="rounded-xl border border-border bg-card p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Full name</p>
              <p className="text-lg font-medium">{user.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="text-lg font-medium">{user.email}</p>
            </div>
            {user.role && (
              <div>
                <p className="text-sm text-muted-foreground">Role</p>
                <p className="text-lg font-medium capitalize">{user.role}</p>
              </div>
            )}
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Purchases</h2>
              <p className="text-sm text-muted-foreground">View your order history</p>
            </div>
            <Link href="/purchases" className="rounded-md border border-border px-4 py-2">View all</Link>
          </div>
        </section>
      </div>
    </main>
  )
}
