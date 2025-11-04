'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function BlogPost() {
  return (
    <section className="min-h-screen bg-background py-20 px-6 sm:px-10 lg:px-32">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto text-center mb-16"
      >
        <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-foreground">
          Sustainable Innovation: The Future of Technology
        </h1>
        <p className="text-muted-foreground text-lg">
          Discover how sustainability and technology are merging to create eco-friendly innovations
          that redefine our digital future.
        </p>
      </motion.div>

      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-lg mb-10"
        >
          <Image
            src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1000&q=80"
            alt="Sustainable Technology"
            fill
            className="object-cover"
          />
        </motion.div>

        <div className="prose dark:prose-invert max-w-none text-left">
          <p>
            As the climate crisis becomes increasingly urgent, sustainability has moved from being
            an optional consideration to a global imperative. Technology companies are now embracing
            greener alternatives in product design, energy use, and manufacturing processes.
          </p>
          <p>
            From carbon-neutral data centers to recyclable hardware and green AI, sustainable innovation
            is transforming how technology is built and deployed. It’s not only about reducing carbon
            footprints but also creating technologies that positively impact communities and ecosystems.
          </p>
          <p>
            By aligning technological growth with environmental consciousness, we can build a more
            balanced and resilient digital ecosystem for generations to come.
          </p>

          <div className="mt-10">
            <Link href="/blog" className="text-primary font-semibold hover:underline">
              ← Back to Blogs
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
