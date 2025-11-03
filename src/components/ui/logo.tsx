import { cn } from "@/lib/utils";
import Image from 'next/image';
import React from "react";

export const Logo = ({ className }: { className?: string }) => (
  <img
    src="/logo.png"
    alt="Patel Pulse Ventures Logo"
    className={cn("h-10 w-auto", className)}
  />
);
