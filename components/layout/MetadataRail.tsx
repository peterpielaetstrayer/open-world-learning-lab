import type { ReactNode } from "react";

interface MetadataRailProps {
  children: ReactNode;
  className?: string;
}

export default function MetadataRail({ children, className = "" }: MetadataRailProps) {
  return (
    <aside
      className={`rounded-lg border border-border bg-soft-paper/50 p-5 text-sm text-secondary ${className}`}
      aria-label="Project metadata"
    >
      {children}
    </aside>
  );
}
