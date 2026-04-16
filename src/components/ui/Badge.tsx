import type { ReactNode } from "react";
import type { ColorSet } from "@/helpers/colors";

interface BadgeProps {
  colorSet: ColorSet;
  children: ReactNode;
  className?: string;
}

export function Badge({ colorSet, children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${colorSet.bg} ${colorSet.border} ${colorSet.text} ${className}`}
    >
      {children}
    </span>
  );
}
