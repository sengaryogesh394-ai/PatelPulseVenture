// 'use client';

// import Image from 'next/image';
// import Link from 'next/link';
// import { useEffect, useRef } from 'react';
// import { motion } from 'framer-motion';
// import gsap from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';

// gsap.registerPlugin(ScrollTrigger);

// const fallbackBlogs = [
//   {
//     id: 1,
//     title: 'Harnessing the Power of AI in Modern Business',
//     excerpt:
//       'Artificial Intelligence is reshaping industries by improving efficiency, automation, and customer experiences. Here’s how you can stay ahead of the curve.',
//     image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
//     link: '/blog/ai-business',
//   },
//   {
//     id: 2,
//     title: 'Sustainable Innovation: The Future of Technology',
//     excerpt:
//       'Sustainability isn’t just a buzzword. Learn how companies are integrating eco-friendly practices into their tech strategies for long-term growth.',
//     image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
//     link: '/blog/sustainability-tech',
//   },
//   {
//     id: 3,
//     title: 'Design Thinking: A Creative Approach to Problem Solving',
//     excerpt:
//       'Discover how design thinking empowers teams to innovate, empathize with users, and craft impactful solutions that truly resonate.',
//     image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80',
//     link: '/blog/design-thinking',
//   },
//   {
//     id: 4,
//     title: 'Digital Marketing Strategies for 2025',
//     excerpt:
//       'Explore cutting-edge digital marketing techniques—from AI-driven analytics to influencer collaborations—that are transforming the online landscape.',
//     image: 'https://images.unsplash.com/photo-1522205408450-add114ad53fe?auto=format&fit=crop&w=800&q=80',
//     link: '/blog/digital-marketing-2025',
//   },
//   {
//     id: 5,
//     title: 'The Art of Web Development in 2025',
//     excerpt:
//       'Modern web development is more than just code — it’s about performance, accessibility, and user-first design. Here’s what developers need to know this year.',
//     image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
//     link: '/blog/web-development-2025',
//   },
//   {
//     id: 6,
//     title: 'Building Scalable Apps: A Developer’s Guide',
//     excerpt:
//       'From architecture patterns to cloud integration, learn how to design and build apps that grow with your business and handle millions of users effortlessly.',
//     image: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=800&q=80',
//     link: '/blog/app-development-guide',
//   },
// ];

// export default function BlogPage() {
//   const sectionRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const ctx = gsap.context(() => {
//       // Fade-in for the section header
//       gsap.from('.blog-header', {
//         y: 50,
//         opacity: 0,
//         duration: 1,
//         ease: 'power3.out',
//         scrollTrigger: {
//           trigger: '.blog-header',
//           start: 'top 80%',
//         },
//       });

//       // Animate each blog card on scroll
//       gsap.utils.toArray('.blog-card').forEach((card: any, i) => {
//         gsap.from(card, {
//           opacity: 0,
//           y: 60,
//           duration: 0.8,
//           delay: i * 0.1,
//           ease: 'power2.out',
//           scrollTrigger: {
//             trigger: card,
//             start: 'top 85%',
//           },
//         });
//       });
//     }, sectionRef);

//     return () => ctx.revert();
//   }, []);

//   return (
//     <section ref={sectionRef} className="relative min-h-screen bg-background py-20 px-6 sm:px-10 lg:px-20 overflow-hidden">
//       {/* Floating background animation */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 0.15, scale: [1, 1.2, 1], rotate: [0, 10, 0] }}
//         transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
//         className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-400/20 via-purple-400/10 to-pink-300/10 blur-3xl"
//       />

//       {/* Section Header */}
//       <div className="max-w-6xl mx-auto text-center mb-16 relative z-10 blog-header">
//         <motion.h1
//           initial={{ opacity: 0, y: 40 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           className="text-4xl sm:text-5xl font-bold mb-4"
//         >
//           Our Latest Insights
//         </motion.h1>
//         <p className="text-muted-foreground max-w-2xl mx-auto">
//           Stay updated with Patel Pulse Ventures. Read the latest blogs on technology, innovation, and business strategy.
//         </p>
//       </div>

//       {/* Blog Cards */}
//       <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 relative z-10">
//         {blogs.map((blog, index) => (
//           <motion.div
//             key={blog.id}
//             className="blog-card rounded-2xl overflow-hidden shadow-lg bg-card border border-border hover:shadow-2xl transition-all duration-300 flex flex-col group"
//             whileHover={{ y: -8 }}
//           >
//             <div className="relative w-full h-56 overflow-hidden">
//               <motion.div
//                 whileHover={{ scale: 1.1 }}
//                 transition={{ duration: 0.6, ease: 'easeOut' }}
//                 className="w-full h-full"
//               >
//                 <Image
//                   src={blog.image}
//                   alt={blog.title}
//                   fill
//                   className="object-cover"
//                 />
//               </motion.div>
//             </div>

//             <div className="p-6 flex flex-col flex-1">
//               <h2 className="text-xl font-semibold mb-3 text-foreground">{blog.title}</h2>
//               <p className="text-muted-foreground flex-1 mb-6">{blog.excerpt}</p>

//               <Link
//                 href={blog.link}
//                 className="inline-block mt-auto text-primary font-medium hover:underline transition-all"
//               >
//                 Read More →
//               </Link>
//             </div>
//           </motion.div>
//         ))}
//       </div>
//     </section>
//   );
// }

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const fallbackBlogs = [
  {
    id: 1,
    title: 'Harnessing the Power of AI in Modern Business',
    excerpt:
      'Artificial Intelligence is reshaping industries by improving efficiency, automation, and customer experiences. Here’s how you can stay ahead of the curve.',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
    link: '/blog/ai-business',
  },
  {
    id: 2,
    title: 'Sustainable Innovation: The Future of Technology',
    excerpt:
      'Sustainability isn’t just a buzzword. Learn how companies are integrating eco-friendly practices into their tech strategies for long-term growth.',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
    link: '/blog/sustainability-tech',
  },
  {
    id: 3,
    title: 'Design Thinking: A Creative Approach to Problem Solving',
    excerpt:
      'Discover how design thinking empowers teams to innovate, empathize with users, and craft impactful solutions that truly resonate.',
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80',
    link: '/blog/design-thinking',
  },
  {
    id: 4,
    title: 'Digital Marketing Strategies for 2025',
    excerpt:
      'Explore cutting-edge digital marketing techniques—from AI-driven analytics to influencer collaborations—that are transforming the online landscape.',
    image: 'https://images.unsplash.com/photo-1522205408450-add114ad53fe?auto=format&fit=crop&w=800&q=80',
    link: '/blog/digital-marketing-2025',
  },
  {
    id: 5,
    title: 'The Art of Web Development in 2025',
    excerpt:
      'Modern web development is more than just code — it’s about performance, accessibility, and user-first design. Here’s what developers need to know this year.',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
    link: '/blog/web-development-2025',
  },
  {
    id: 6,
    title: 'Building Scalable Apps: A Developer’s Guide',
    excerpt:
      'From architecture patterns to cloud integration, learn how to design and build apps that grow with your business and handle millions of users effortlessly.',
    image: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=800&q=80',
    link: '/blog/app-development-guide',
  },
];

export default function BlogPage() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [blogs, setBlogs] = useState<Array<{ _id?: string; title: string; excerpt: string; image?: string; slug?: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.blog-header', {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.blog-header',
          start: 'top 80%',
        },
      });

      gsap.utils.toArray('.blog-card').forEach((card: any, i) => {
        gsap.from(card, {
          opacity: 0,
          y: 60,
          duration: 0.8,
          delay: i * 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Fetch real blogs from API
  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const res = await fetch('/api/blog');
        const json = await res.json();
        if (!ignore && json?.success && Array.isArray(json.data)) {
          const list = json.data.map((b: any) => ({
            _id: b._id,
            title: b.title || 'Untitled',
            excerpt: b.excerpt || b.summary || '',
            image: b.imageUrl || b.coverImage || b.image || b.thumbnail,
            slug: b.slug,
          }));
          setBlogs(list);
        }
      } catch {
        // ignore, will use fallback
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, []);

  const items = useMemo(() => {
    if (blogs.length) return blogs; // show all
    return fallbackBlogs;
  }, [blogs]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-background py-20 px-6 sm:px-10 lg:px-20 overflow-hidden"
    >
      {/* Floating background animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15, scale: [1, 1.2, 1], rotate: [0, 10, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-400/20 via-purple-400/10 to-pink-300/10 blur-3xl"
      />

      {/* Section Header */}
      <div className="max-w-6xl mx-auto text-center mb-16 relative z-10 blog-header">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl font-bold mb-4"
        >
          Our Latest Insights
        </motion.h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Stay updated with Patel Pulse Ventures. Read the latest blogs on technology, innovation,
          and business strategy.
        </p>
      </div>

      {/* Blog Cards */}
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 relative z-10">
        {items.map((blog: any, idx: number) => (
          <Link key={blog._id || blog.id || idx} href={blog.slug ? `/blog/${blog.slug}` : (blog.link || '/blog')} className="group">
            <motion.div
              className="blog-card rounded-2xl overflow-hidden shadow-lg bg-card border border-border hover:shadow-2xl transition-all duration-300 flex flex-col cursor-pointer"
              whileHover={{ y: -8 }}
            >
              <div className="relative w-full h-56 overflow-hidden">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="w-full h-full"
                >
                  {blog.image ? (
                    <Image src={blog.image} alt={blog.title} fill className="object-cover" unoptimized loader={({ src }) => src} />
                  ) : (
                    <div className="w-full h-full bg-muted" />
                  )}
                </motion.div>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <h2 className="text-xl font-semibold mb-3 text-foreground group-hover:text-primary transition-colors">
                  {blog.title}
                </h2>
                <p className="text-muted-foreground flex-1 mb-6">{blog.excerpt}</p>

                <span className="inline-block mt-auto text-primary font-medium hover:underline transition-all">
                  Read More →
                </span>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </section>
  );
}
