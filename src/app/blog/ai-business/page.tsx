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
          Harnessing the Power of AI in Modern Business
        </h1>
        <p className="text-muted-foreground text-lg">
          Artificial Intelligence is reshaping industries by improving efficiency, automation,
          and customer experiences. Here’s how you can stay ahead of the curve.
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
            src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1000&q=80"
            alt="AI in Business"
            fill
            className="object-cover"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="prose dark:prose-invert max-w-none text-left"
        >
          <p>
            Artificial Intelligence (AI) is no longer a futuristic concept—it’s the core engine of
            digital transformation. Businesses across industries are adopting AI to enhance productivity,
            streamline decision-making, and unlock data-driven insights.
          </p>

          <p>
            From personalized customer experiences to predictive analytics, AI tools help organizations
            operate smarter and faster. The integration of AI-driven automation reduces repetitive workloads,
            allowing human creativity to shine where it matters most.
          </p>

          <p>
            As we move into 2025 and beyond, AI ethics, data privacy, and explainability will become critical
            pillars for responsible innovation. The companies that balance automation with empathy will lead
            the future of intelligent business.
          </p>

          <div className="mt-10">
            <Link
              href="/blog"
              className="text-primary font-semibold hover:underline"
            >
              ← Back to Blogs
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
