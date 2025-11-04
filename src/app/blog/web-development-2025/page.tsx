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
          The Art of Web Development in 2025
        </h1>
        <p className="text-muted-foreground text-lg">
          From AI-generated layouts to WebAssembly and edge computing — web development in 2025
          is faster, smarter, and more immersive than ever.
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
            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1000&q=80"
            alt="Web Development 2025"
            fill
            className="object-cover"
          />
        </motion.div>

        <div className="prose dark:prose-invert max-w-none text-left">
          <p>
            The future of web development is defined by automation, performance, and personalization.
            Frameworks like Next.js and SvelteKit are simplifying complex builds, while AI tools are
            generating layouts, content, and even code.
          </p>
          <p>
            Progressive Web Apps (PWAs), real-time rendering, and micro frontends are now industry standards.
            Combined with edge deployment and serverless computing, developers can achieve near-instant load times.
          </p>
          <p>
            The web is becoming more fluid and human—adapting to user behavior through data-driven,
            accessible, and inclusive design.
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
