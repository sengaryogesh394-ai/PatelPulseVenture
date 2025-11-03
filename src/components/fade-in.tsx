'use client';

import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface FadeInProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  threshold?: number;
}

export function FadeIn({
  children,
  className,
  as: Component = 'div',
  delay = 0,
  threshold = 0.1,
  ...props
}: FadeInProps) {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );

    const { current } = domRef;
    if (current) {
      observer.observe(current);
    }

    return () => {
      if (current) {
        observer.unobserve(current);
      }
    };
  }, [threshold]);

  return (
    <Component
      className={cn(
        'transition-opacity duration-1000 ease-out',
        isVisible ? 'opacity-100' : 'opacity-0',
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
      ref={domRef}
      {...props}
    >
      {children}
    </Component>
  );
}
