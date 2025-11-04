'use client';
import { cn } from "@/lib/utils";
import {
  Lightbulb,
  Bot,
  ShieldCheck,
  Zap,
  Briefcase,
  Rocket,
  Settings,
  Heart,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";

const IconEaseInOut = () => <Lightbulb />;

const features = [
  {
    title: "Decentralized Ledger Technology",
    description:
      "Exploring novel applications of blockchain for secure, transparent, and efficient data management across industries.",
    icon: <Bot />,
  },
  {
    title: "AI-Driven Drug Discovery",
    description:
      "Utilizing machine learning models to accelerate the identification and development of new pharmaceuticals.",
    icon: <IconEaseInOut />,
  },
  {
    title: "Next-Gen IoT Security",
    description:
      "Building robust security protocols for the Internet of Things to protect against emerging cyber threats.",
    icon: <ShieldCheck />,
  },
  {
    title: "100% Uptime Guarantee",
    description: "We just cannot be taken down by anyone.",
    icon: <Zap />,
  },
  {
    title: "Multi-tenant Architecture",
    description:
      "You can simply share passwords instead of buying new seats.",
    icon: <Briefcase />,
  },
  {
    title: "24/7 Customer Support",
    description:
      "We are available 100% of the time. At least our AI Agents are.",
    icon: <Rocket />,
  },
  {
    title: "Money Back Guarantee",
    description:
      "If you don’t like our services, we will convince you to like us.",
    icon: <Settings />,
  },
  {
    title: "And Everything Else",
    description: "We deliver on our promises and exceed expectations.",
    icon: <Heart />,
  },
];

export default function InnovationSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  return (
    <>
      {/* ---------------- Innovation Section ---------------- */}
      <section
        id="innovation"
        className="py-20 sm:py-28 bg-background relative overflow-hidden"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-center font-headline sm:text-4xl">
            Innovation Lab
          </h2>
          <p className="mt-4 text-lg text-center text-muted-foreground max-w-2xl mx-auto">
            At the forefront of research and development, we explore emerging
            technologies that will shape tomorrow.
          </p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10 mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {features.map((feature, index) => (
              <Feature key={feature.title} {...feature} index={index} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ---------------- Counter Section ---------------- */}
      <section id="counters" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: false }} // <-- allows repeat animation when re-entering view
          >
            {counters.map((item, index) => (
              <CounterCard key={index} item={item} index={index} />
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}

/* ---------------- Feature Card ---------------- */
const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  const totalFeatures = 4;
  const featureVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={featureVariants}
      whileHover={{
        scale: 1.05,
        backgroundColor: "var(--primary-foreground)",
        transition: { duration: 0.4 },
      }}
      className={cn(
        "relative flex flex-col items-start justify-start py-10 px-8 rounded-2xl border dark:border-neutral-800 shadow-sm transition-all duration-300 bg-card/60 backdrop-blur-sm group hover:shadow-2xl hover:bg-primary/10",
        (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
        index < totalFeatures && "lg:border-b dark:border-neutral-800"
      )}
    >
      <motion.div
        whileHover={{
          y: -6,
          rotate: 5,
          transition: { type: "spring", stiffness: 250 },
        }}
        className="mb-5 relative z-10 p-3 rounded-full bg-primary/10 text-primary shadow-inner"
      >
        {icon}
      </motion.div>

      <div className="text-lg font-semibold mb-2 relative z-10 text-foreground group-hover:text-primary transition-colors duration-300">
        {title}
      </div>

      <p className="text-sm text-muted-foreground relative z-10 leading-relaxed">
        {description}
      </p>

      <motion.div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </motion.div>
  );
};

/* ---------------- Counter Card with Animated Numbers ---------------- */
const CounterCard = ({
  item,
  index,
}: {
  item: { icon: string; count: number; title: string };
  index: number;
}) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.4 }); // triggers each time visible
  const controls = useAnimation();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      controls.start({count: item.count, transition: { duration: 2 } });
    } else {
      setCount(0); // reset when leaving viewport
    }
  }, [isInView]);

  useEffect(() => {
    let start = 0;
    if (isInView) {
      const end = item.count;
      const duration = 2000; // ms
      const stepTime = 20;
      const increment = end / (duration / stepTime);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          start = end;
          clearInterval(timer);
        }
        setCount(Math.floor(start));
      }, stepTime);
      return () => clearInterval(timer);
    }
  }, [isInView, item.count]);

  return (
    <motion.div
      ref={ref}
      className="flex flex-col items-center justify-center space-y-4"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2 }}
    >
      <div className="bg-white dark:bg-neutral-900 rounded-full p-4 shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105">
        <img
          src={item.icon}
          alt={item.title}
          className="w-12 h-12 object-contain"
        />
      </div>
      <h2 className="text-4xl font-extrabold text-primary">{count}+</h2>
      <p className="text-lg font-medium text-foreground">{item.title}</p>
    </motion.div>
  );
};

/* ---------------- Counter Data ---------------- */
const counters = [
  {
    icon: "https://seduloussoftech.com/assets/img/trophy.png",
    count: 150,
    title: "Completed Projects",
  },
  {
    icon: "https://seduloussoftech.com/assets/img/happy.png",
    count: 100,
    title: "Happy Clients",
  },
  {
    icon: "https://seduloussoftech.com/assets/img/map.png",
    count: 10,
    title: "Countries Served",
  },
  {
    icon: "https://seduloussoftech.com/assets/img/time.png",
    count: 8,
    title: "Years of Experience",
  },
];
