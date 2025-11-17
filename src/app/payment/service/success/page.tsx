"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ServicePaymentSuccessPage() {
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const url = new URL(window.location.href);
    const serviceId = url.searchParams.get("serviceId");
    if (!serviceId) {
      setError("Missing serviceId in URL");
      setLoading(false);
      return;
    }
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/services/${serviceId}`);
        const json = await res.json();
        if (!json.success) throw new Error(json.error || "Failed to load service");
        setService(json.data);
      } catch (e: any) {
        setError(e.message || "Failed to load service");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <div className="text-green-600 text-5xl">✓</div>
        <h1 className="text-3xl font-bold">Payment Successful</h1>
        {loading ? (
          <p className="text-muted-foreground">Loading service details...</p>
        ) : error ? (
          <p className="text-destructive">{error}</p>
        ) : (
          <div className="space-y-2">
            <p className="text-muted-foreground">Thank you for purchasing:</p>
            <h2 className="text-xl font-semibold">{service?.name}</h2>
            <p className="text-sm text-muted-foreground max-w-prose mx-auto">{service?.description}</p>
          </div>
        )}
        <div className="flex items-center justify-center gap-3 pt-4">
          <Link href="/">
            <button className="px-5 py-2 rounded-lg bg-gray-100 hover:bg-gray-200">Back to Home</button>
          </Link>
          {service?.slug && (
            <Link href={`/services/${service.slug}`}>
              <button className="px-5 py-2 rounded-lg bg-primary text-white hover:bg-primary/90">View Service</button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
