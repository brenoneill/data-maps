import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  interactive?: boolean;
}

export function Card({
  children,
  interactive = false,
  className = "",
  ...props
}: CardProps) {
  return (
    <div
      className={`rounded-xl border border-gray-800 bg-gray-900 ${
        interactive
          ? "cursor-pointer transition-all hover:border-gray-700 hover:bg-gray-800/80 hover:shadow-lg hover:shadow-black/20"
          : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
