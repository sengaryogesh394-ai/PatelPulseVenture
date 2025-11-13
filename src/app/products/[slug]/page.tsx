import { notFound } from 'next/navigation';
import ProductDetailSection from '@/components/sections/product-detail-section';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';

export default async function ProductPage({ params }: { params: { slug: string } }) {
  await connectDB();
  const doc = await Product.findOne({ slug: params.slug }).lean();

  if (!doc) {
    notFound();
  }

  const product = {
    id: doc.id,
    name: doc.name,
    slug: doc.slug,
    description: doc.description,
    imageId: doc.imageId,
    imageUrl: doc.imageUrl || '',
    longDescription: doc.longDescription,
    details: doc.details || [],
    status: doc.status || 'active',
  };

  return <ProductDetailSection product={product} />;
}
