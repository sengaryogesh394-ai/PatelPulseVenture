// 'use client';
// import Image from 'next/image';
// import { Button } from '@/components/ui/button';
// import { PlaceHolderImages } from '@/lib/placeholder-images';
// import Link from 'next/link';
// import { motion } from 'framer-motion';


// export default function HeroSection() {
//   const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-background');

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.3,
//       },
//     },
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
//   };

//   return (
//     <section className="relative h-[80vh] min-h-[500px] w-full flex items-center justify-center text-center text-white">
//       {heroImage && (
//         <Image
//           src={heroImage.imageUrl}
//           alt={heroImage.description}
//           data-ai-hint={heroImage.imageHint}
//           fill
//           className="object-cover"
//           priority
//         />
//       )}
//       <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
//       <div className="absolute inset-0 bg-primary/40" />

//       <motion.div
//         className="relative z-10 flex flex-col items-center px-4"
//         variants={containerVariants}
//         initial="hidden"
//         animate="visible"
//       >
//         <motion.h1
//           className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl font-headline"
//           variants={itemVariants}
//         >
//           Innovating the Future
//         </motion.h1>
//         <motion.p
//           className="mt-6 max-w-2xl text-lg text-primary-foreground/80 md:text-xl"
//           variants={itemVariants}
//         >
//           Patel Pulse Venture is a technology and venture innovation firm dedicated to building and scaling the next generation of groundbreaking companies.
//         </motion.p>
//         <motion.div className="mt-10 flex gap-4" variants={itemVariants}>
//           <Button asChild size="lg" className="rounded-full">
//             <Link href="/services">Explore Our Work</Link>
//           </Button>
//           <Button asChild variant="secondary" size="lg" className="rounded-full">
//             <Link href="/contact">Get in Touch</Link>
//           </Button>
//         </motion.div>
//       </motion.div>
//     </section>
//   );
// }

'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function HeroSection() {
  // 🖼️ Your background images (you can replace with any Unsplash or custom links)
  const heroImages = [

    {
      imageUrl: 'https://images.unsplash.com/photo-1562575214-da9fcf59b907?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxhYnN0cmFjdCUyMHRlY2hub2xvZ3l8ZW58MHx8fHwxNzYyMDkwMDExfDA&ixlib=rb-4.1.0&q=80&w=1080"',
      description: 'Creative design workspace',
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop',
      description: 'Modern office with developers working',
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop',
      description: 'Startup teamwork collaboration',
    },
    
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // ⏱️ Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  // 🎞️ Framer Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="relative h-[80vh] min-h-[500px] w-full flex items-center justify-center text-center text-white overflow-hidden">

      {/* 🖼️ Background Images with fade transition */}
      {heroImages.map((image, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: index === currentIndex ? 1 : 0 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <Image
            src={image.imageUrl}
            alt={image.description}
            fill
            className="object-cover"
            priority={index === 0}
          />
        </motion.div>
      ))}

      {/* 🖤 Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

      {/* ✨ Animated Hero Content */}
<motion.div
  className="relative z-10 flex flex-col items-center px-4"
  variants={containerVariants}
  initial="hidden"
  animate="visible"
>
  {/* Heading - slide from top */}
  <motion.h1
    className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl font-headline"
    initial={{ opacity: 0, y: -60 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1, ease: 'easeOut' }}
  >
    Innovating the Future
  </motion.h1>

  {/* Subheading - slide from bottom */}
  <motion.p
    className="mt-6 max-w-2xl text-lg text-white md:text-xl"
    initial={{ opacity: 0, y: 60 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
  >
    Patel Pulse Venture is a technology and venture innovation firm dedicated to building 
    the next generation of groundbreaking  Technologies.
  </motion.p>

  {/* Buttons - alternate left & right entrances */}
  <motion.div
    className="mt-10 flex gap-4"
    initial="hidden"
    animate="visible"
    variants={{
      visible: {
        transition: { staggerChildren: 0.3, delayChildren: 0.6 },
      },
    }}
  >
    <motion.div
      initial={{ opacity: 0, x: -80 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <Button asChild size="lg" className="rounded-full shadow-lg hover:scale-105 transition-transform duration-300">
        <Link href="/services">Explore Our Work</Link>
      </Button>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
    >
      <Button
        asChild
        variant="secondary"
        size="lg"
        className="rounded-full shadow-lg hover:scale-105 transition-transform duration-300"
      >
        <Link href="/contact">Get in Touch</Link>
      </Button>
    </motion.div>
  </motion.div>
</motion.div>

      {/* ⚪ Slider dots (optional, for navigation) */}
      <div className="absolute bottom-6 flex gap-2 justify-center w-full z-10">
        {heroImages.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-white scale-125' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
