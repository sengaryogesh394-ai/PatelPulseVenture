import { cn } from "@/lib/utils";
import React from "react";

export const Logo = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 152 44"
    className={cn("text-foreground", className)}
  >
    <g fill="none" fillRule="evenodd">
      <path
        fill="currentColor"
        d="M0 44V0h14.55v16.14h15.3V0h14.55v44H29.85V27.86H14.55v16.13H0Z"
      />
      <path
        className="text-primary"
        fill="currentColor"
        d="M51.8 44V0h14.55v16.14h15.3V0h14.55v44H81.65V27.86H66.35v16.13H51.8Z"
      />
      <path
        fill="currentColor"
        d="m109.11 44-16.5-44h16.27l7.22 22.39L123.28 0h16.27l-16.5 44H109.1Z"
      />
    </g>
  </svg>
);
