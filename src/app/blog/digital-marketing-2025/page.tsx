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
          Digital Marketing Strategies for 2025
        </h1>
        <p className="text-muted-foreground text-lg">
          Explore the trends reshaping digital marketing—from AI-driven personalization to immersive brand experiences.
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
            src="https://images.unsplash.com/photo-1522205408450-add114ad53fe?auto=format&fit=crop&w=1000&q=80"
            alt="Digital Marketing 2025"
            fill
            className="object-cover"
          />
        </motion.div>

        <div className="prose dark:prose-invert max-w-none text-left">
          <p>
            The digital marketing landscape in 2025 is defined by hyper-personalization and interactive storytelling.
            AI and machine learning are enabling marketers to predict user behavior and deliver customized experiences
            in real time.
          </p>
          <p>
            Short-form video, augmented reality ads, and voice search optimization are driving engagement.
            Meanwhile, ethical data practices and transparent content strategies are becoming essential
            for earning consumer trust.
          </p>
          <p>
            The brands that combine creativity with data-driven precision will dominate the marketing space
            in the coming years.
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
