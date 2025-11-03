
'use client';

import * as React from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";
import Image from 'next/image';

interface TeamMember {
  name: string;
  image: string;
}

export interface AnimatedTeamSectionProps {
  title: string;
  description: string;
  members: { name: string, image: string, role?: string, link?: string }[];
  className?: string;
}

const TeamSection = React.forwardRef<
  HTMLDivElement,
  AnimatedTeamSectionProps
>(({ title, description, members, className, ...props }, ref) => {
  return (
    <section
      id="team"
      ref={ref}
      className={cn("w-full py-20 lg:py-28 bg-secondary", className)}
      {...props}
    >
      <div className="container mx-auto flex flex-col items-center text-center px-4">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-3 font-headline">
          {title}
        </h2>
        <p className="max-w-3xl text-muted-foreground md:text-xl">
          {description}
        </p>
      </div>
      <div className="mt-12 md:mt-24 max-w-5xl mx-auto">
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {members.map((member, index) => (
                  <div key={index} className="group overflow-hidden">
                      <Image className="h-96 w-full rounded-md object-cover object-top grayscale transition-all duration-500 hover:grayscale-0 group-hover:h-[22.5rem] group-hover:rounded-xl" src={member.image} alt={member.name} width="826" height="1239" />
                      <div className="px-2 pt-2 sm:pb-0 sm:pt-4">
                          <div className="flex justify-between">
                              <h3 className="text-title text-base font-medium transition-all duration-500 group-hover:tracking-wider">{member.name}</h3>
                              <span className="text-xs">_0{index + 1}</span>
                          </div>
                          <div className="mt-1 flex items-center justify-between">
                              <span className="text-muted-foreground inline-block translate-y-6 text-sm opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">{member.role}</span>
                              <a href={member.link} className="group-hover:text-primary-600 dark:group-hover:text-primary-400 inline-block translate-y-8 text-sm tracking-wide opacity-0 transition-all duration-500 hover:underline group-hover:translate-y-0 group-hover:opacity-100">
                                  {' '}
                                  Linktree
                              </a>
                          </div>
                      </div>
                  </div>
              ))}
          </div>
      </div>
    </section>
  );
});

TeamSection.displayName = "TeamSection";

export default TeamSection;
