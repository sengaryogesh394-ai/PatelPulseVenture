
import { services } from '@/lib/data';
import { notFound } from 'next/navigation';
import ServiceDetailSection from '@/components/sections/service-detail-section';

export async function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export default function ServicePage({ params }: { params: { slug: string } }) {
  const service = services.find((s) => s.slug === params.slug);

  if (!service) {
    notFound();
  }

  return <ServiceDetailSection service={service} />;
}
