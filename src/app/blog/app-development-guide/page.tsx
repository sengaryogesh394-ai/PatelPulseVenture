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
          Building Scalable Apps: A Developer’s Guide
        </h1>
        <p className="text-muted-foreground text-lg">
          Learn the principles of scalable app architecture, from modular design to cloud integration
          and performance optimization.
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
            src="https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=1000&q=80"
            alt="App Development Guide"
            fill
            className="object-cover"
          />
        </motion.div>

        <div className="prose dark:prose-invert max-w-none text-left">
          <p>
            Scalability is the backbone of modern app development. As user bases grow, apps must
            handle increasing loads without compromising performance or reliability.
          </p>
          <p>
            Techniques like microservices, load balancing, caching, and asynchronous processing
            enable developers to build resilient, high-performance systems. Cloud-native architectures
            and containerization (Docker, Kubernetes) further simplify deployment and scaling.
          </p>
          <p>
            The best scalable apps are not just about speed—they’re designed for adaptability.
            With smart monitoring, modular updates, and continuous delivery, developers can
            evolve their products to meet user demands dynamically.
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
