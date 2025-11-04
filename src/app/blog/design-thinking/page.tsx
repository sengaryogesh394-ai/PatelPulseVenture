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
          Design Thinking: A Creative Approach to Problem Solving
        </h1>
        <p className="text-muted-foreground text-lg">
          Learn how design thinking helps teams innovate through empathy, experimentation, and collaboration.
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
            src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1000&q=80"
            alt="Design Thinking"
            fill
            className="object-cover"
          />
        </motion.div>

        <div className="prose dark:prose-invert max-w-none text-left">
          <p>
            Design thinking is not just a method—it’s a mindset. It encourages creative problem solving
            by focusing on the needs of users first. Teams use it to break down complex problems through
            empathy, ideation, prototyping, and testing.
          </p>
          <p>
            This approach brings together diverse perspectives, helping organizations build more human-centered
            solutions. Whether in software, education, or healthcare, design thinking bridges the gap
            between innovation and usability.
          </p>
          <p>
            By fostering a culture of experimentation, teams can unlock innovation that truly resonates with users.
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
