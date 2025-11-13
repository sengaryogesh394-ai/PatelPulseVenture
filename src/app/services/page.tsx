
'use client';

import { useState, useEffect } from 'react';
import ServicesSection from '@/components/sections/services-section';
import { getServices } from '@/lib/services-api';
import type { Service } from '@/lib/types';

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const servicesData = await getServices();
        // Filter to show only active services on the public website
        const activeServices = servicesData.filter(service => 
          (service.status || 'active') === 'active'
        );
        setServices(activeServices);
      } catch (error) {
        console.error('Error fetching services:', error);
        // Fallback to empty array if API fails
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ServicesSection services={services} />
    </>
  );
}
