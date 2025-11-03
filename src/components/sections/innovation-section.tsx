
'use client';
import { cn } from "@/lib/utils";
import { Lightbulb, Bot, ShieldCheck, Zap, Briefcase, Rocket, Settings, Heart } from "lucide-react";
import React from 'react';
import { motion } from 'framer-motion';

const IconEaseInOut = () => <Lightbulb />;

const features = [
    {
      title: "Decentralized Ledger Technology",
      description: "Exploring novel applications of blockchain for secure, transparent, and efficient data management across industries.",
      icon: <Bot />,
    },
    {
      title: "AI-Driven Drug Discovery",
      description: "Utilizing machine learning models to accelerate the identification and development of new pharmaceuticals.",
      icon: <IconEaseInOut />,
    },
    {
      title: "Next-Gen IoT Security",
      description: "Building robust security protocols for the Internet of Things to protect against emerging cyber threats.",
      icon: <ShieldCheck />,
    },
    {
      title: "100% Uptime guarantee",
      description: "We just cannot be taken down by anyone.",
      icon: <Zap />,
    },
    {
      title: "Multi-tenant Architecture",
      description: "You can simply share passwords instead of buying new seats",
      icon: <Briefcase />,
    },
    {
      title: "24/7 Customer Support",
      description:
        "We are available a 100% of the time. Atleast our AI Agents are.",
      icon: <Rocket />,
    },
    {
      title: "Money back guarantee",
      description:
        "If you donot like our services, we will convince you to like us.",
      icon: <Settings />,
    },
    {
      title: "And everything else",
      description: "We deliver on our promises and exceed expectations.",
      icon: <Heart />,
    },
  ];

export default function InnovationSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  return (
    <section id="innovation" className="py-20 sm:py-28">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-center font-headline sm:text-4xl">Innovation Lab</h2>
        <p className="mt-4 text-lg text-center text-muted-foreground max-w-2xl mx-auto">
            At the forefront of research and development, we explore emerging technologies that will shape tomorrow.
        </p>
        <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10 max-w-7xl mx-auto"
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
  );
}

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
      className={cn(
        "flex flex-col lg:border-r py-10 relative group/feature dark:border-neutral-800",
        (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
         index < totalFeatures && "lg:border-b dark:border-neutral-800"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-secondary to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-secondary to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-primary">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-border group-hover/feature:bg-primary transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-foreground">
          {title}
        </span>
      </div>
      <p className="text-sm text-muted-foreground max-w-xs relative z-10 px-10">
        {description}
      </p>
    </motion.div>
  );
};
