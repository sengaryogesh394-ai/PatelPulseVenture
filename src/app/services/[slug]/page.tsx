import { notFound } from 'next/navigation';
import ServiceDetailSection from '@/components/sections/service-detail-section';
import connectDB from '@/lib/mongodb';
import Service from '@/models/Service';

export const dynamic = 'force-dynamic';

export default async function ServicePage({ params }: { params: { slug: string } }) {
  await connectDB();
  const doc = await Service.findOne({ slug: params.slug }).lean();

  if (!doc) {
    notFound();
  }

  // Normalize to plain object matching the public Service type
  const d: any = doc as any;
  const service = {
    id: (d._id || d.id)?.toString?.() || d.id,
    name: d.name,
    slug: d.slug,
    description: d.description,
    priceFrom: typeof d.priceFrom === 'number' ? d.priceFrom : undefined,
    priceTo: typeof d.priceTo === 'number' ? d.priceTo : undefined,
    imageId: d.imageId,
    imageUrl: d.imageUrl || '',
    longDescription: d.longDescription,
    details: d.details || [],
    status: d.status || 'active',
  };

  return <ServiceDetailSection service={service} />;
}
