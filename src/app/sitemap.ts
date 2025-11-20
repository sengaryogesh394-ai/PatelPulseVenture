import { MetadataRoute } from 'next';
import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';
import Service from '@/models/Service';
import Product from '@/models/Product';
import PPVProduct from '@/models/ProductPPV';
import DigiProduct from '@/models/ProductDigi';

const BASE_URL = 'https://www.patelpulseventures.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connectDB();

  const [blogs, services, coreProducts, ppvProducts, digiProducts] = await Promise.all([
    Blog.find({ status: 'published' }).select('slug updatedAt').lean(),
    Service.find({ status: 'active' }).select('slug updatedAt').lean(),
    Product.find({ status: 'active' }).select('_id updatedAt').lean(),
    PPVProduct.find({ status: 'active' }).select('_id updatedAt').lean(),
    DigiProduct.find({ status: 'active' }).select('_id updatedAt').lean(),
  ]);

  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/shop`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/services`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/projects`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE_URL}/team`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/innovation`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/digiworldadda`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/lead`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/privacy-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/terms-and-conditions`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/refund-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/shipping-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/testimonials`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/profile`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/purchases`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
  ];

  const blogRoutes: MetadataRoute.Sitemap = (blogs as any[]).map((blog) => ({
    url: `${BASE_URL}/blog/${blog.slug}`,
    lastModified: blog.updatedAt || now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const serviceRoutes: MetadataRoute.Sitemap = (services as any[]).map((service) => ({
    url: `${BASE_URL}/services/${service.slug}`,
    lastModified: service.updatedAt || now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const allProducts: any[] = [
    ...(coreProducts as any[]),
    ...(ppvProducts as any[]),
    ...(digiProducts as any[]),
  ];

  const productRoutes: MetadataRoute.Sitemap = allProducts.map((product) => ({
    url: `${BASE_URL}/shop/${product._id.toString()}`,
    lastModified: product.updatedAt || now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    ...staticRoutes,
    ...blogRoutes,
    ...serviceRoutes,
    ...productRoutes,
  ];
}
