
'use client';
import type { Innovation } from '@/lib/types';
import { cn } from "@/lib/utils";
import { Lightbulb, Bot, ShieldCheck, Zap, Briefcase, Rocket, Settings, Heart } from "lucide-react";
import React from 'react';

const iconMap: { [key: string]: React.ReactNode } = {
  'default': <Lightbulb />,
  '1': <Bot />,
  '2': <ShieldCheck />,
  '3': <Zap />,
  '4': <Briefcase />,
  '5': <Rocket />,
  '6': <Settings />,
  '7': <Heart />,
};


interface InnovationSectionProps {
  innovations: Innovation[];
}

export default function InnovationSection({ innovations }: InnovationSectionProps) {
  return (
    <section id="innovation" className="py-20 sm:py-28">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-center font-headline sm:text-4xl">Innovation Lab</h2>
        <p className="mt-4 text-lg text-center text-muted-foreground max-w-2xl mx-auto">
            At the forefront of research and development, we explore emerging technologies that will shape tomorrow.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 relative z-10 py-10 max-w-7xl mx-auto">
            {innovations.map((feature, index) => (
                <Feature key={feature.id} {...feature} index={index} />
            ))}
        </div>
      </div>
    </section>
  );
}

const Feature = ({
  id,
  title,
  description,
  index,
}: {
  id: string;
  title: string;
  description: string;
  index: number;
}) => {
  const totalFeatures = 3; // Assuming 3 features for grid layout
  return (
    <div
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
        {iconMap[id] || iconMap.default}
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
    </div>
  );
};
