import type { ReactNode } from "react";

interface VisualSectionProps {
  children: ReactNode;
  className?: string;
}

export default function VisualSection({ children, className = "" }: VisualSectionProps) {
  return (
    <div className={`-mx-5 sm:-mx-6 lg:-mx-8 xl:mx-0 ${className}`}>
      {children}
    </div>
  );
}
