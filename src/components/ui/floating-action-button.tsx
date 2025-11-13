'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface FloatingAction {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  color: string;
}

interface FloatingActionButtonProps {
  actions: FloatingAction[];
}

export function FloatingActionButton({ actions }: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Action buttons */}
      <div className={cn(
        "flex flex-col-reverse gap-3 mb-4 transition-all duration-300 transform",
        isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4 pointer-events-none"
      )}>
        {actions.map((action, index) => (
          <Button
            key={action.label}
            asChild
            size="lg"
            className={cn(
              "rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 text-white border-0",
              action.color,
              "animate-in slide-in-from-bottom-2 fade-in-0"
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <Link href={action.href} onClick={() => setIsOpen(false)}>
              <action.icon className="w-5 h-5 mr-2" />
              {action.label}
            </Link>
          </Button>
        ))}
      </div>

      {/* Main FAB */}
      <Button
        size="lg"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "rounded-full w-14 h-14 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0",
          isOpen && "rotate-45"
        )}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Plus className="w-6 h-6" />
        )}
      </Button>
    </div>
  );
}
