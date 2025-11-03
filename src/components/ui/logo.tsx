import { cn } from "@/lib/utils";
import Image from 'next/image';
import React from "react";

export const Logo = ({ className }: { className?: string }) => (
  <Image
    src="/logo.svg"
    alt="Patel Pulse Ventures Logo"
    width={150}
    height={56}
    className={cn("h-14 w-auto", className)}
  />
);
