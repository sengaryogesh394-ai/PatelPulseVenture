import Link from 'next/link';
import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';
import Service from '@/models/Service';
import Product from '@/models/Product';
import PPVProduct from '@/models/ProductPPV';
import DigiProduct from '@/models/ProductDigi';

const BASE_URL = 'https://www.patelpulseventures.com';

export default async function SitemapPage() {
  await connectDB();

  const [blogs, services, coreProducts, ppvProducts, digiProducts] = await Promise.all([
    Blog.find({ status: 'published' }).select('slug').lean(),
    Service.find({ status: 'active' }).select('slug').lean(),
    Product.find({ status: 'active' }).select('_id').lean(),
    PPVProduct.find({ status: 'active' }).select('_id').lean(),
    DigiProduct.find({ status: 'active' }).select('_id').lean(),
  ]);

  const staticLinks = [
    '/',
    '/about',
    '/contact',
    '/shop',
    '/blog',
    '/services',
    '/projects',
    '/team',
    '/innovation',
    '/digiworldadda',
    '/lead',
    '/privacy-policy',
    '/terms-and-conditions',
    '/refund-policy',
    '/shipping-policy',
    '/testimonials',
    '/profile',
    '/purchases',
  ];

  const dynamicBlogLinks = (blogs as any[]).map((b) => `/blog/${b.slug}`);
  const dynamicServiceLinks = (services as any[]).map((s) => `/services/${s.slug}`);
  const allProducts: any[] = [
    ...(coreProducts as any[]),
    ...(ppvProducts as any[]),
    ...(digiProducts as any[]),
  ];
  const dynamicProductLinks = allProducts.map((p) => `/shop/${p._id.toString()}`);

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 md:py-16">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">Sitemap</h1>
      <p className="text-gray-600 mb-8">
        Below are all public pages of <span className="font-semibold">{BASE_URL}</span>, grouped into
        static and dynamic sections.
      </p>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Static Pages</h2>
        <ul className="space-y-2 text-blue-700 underline break-all">
          {staticLinks.map((path) => (
            <li key={path}>
              <Link href={path}>{`${BASE_URL}${path}`}</Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Dynamic Pages</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Blog Posts</h3>
            {dynamicBlogLinks.length === 0 ? (
              <p className="text-gray-500 text-sm">No published blog posts yet.</p>
            ) : (
              <ul className="space-y-1 text-blue-700 underline break-all">
                {dynamicBlogLinks.map((url) => (
                  <li key={url}>
                    <Link href={url}>{`${BASE_URL}${url}`}</Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Services</h3>
            {dynamicServiceLinks.length === 0 ? (
              <p className="text-gray-500 text-sm">No active services yet.</p>
            ) : (
              <ul className="space-y-1 text-blue-700 underline break-all">
                {dynamicServiceLinks.map((url) => (
                  <li key={url}>
                    <Link href={url}>{`${BASE_URL}${url}`}</Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Products</h3>
            {dynamicProductLinks.length === 0 ? (
              <p className="text-gray-500 text-sm">No active products yet.</p>
            ) : (
              <ul className="space-y-1 text-blue-700 underline break-all">
                {dynamicProductLinks.map((url) => (
                  <li key={url}>
                    <Link href={url}>{`${BASE_URL}${url}`}</Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
