import type { ReactNode } from "react";

interface ReadingColumnProps {
  children: ReactNode;
  className?: string;
  wide?: boolean;
}

export default function ReadingColumn({
  children,
  className = "",
  wide = false,
}: ReadingColumnProps) {
  return (
    <div
      className={`${wide ? "max-w-[820px]" : "max-w-reading"} ${className}`}
    >
      {children}
    </div>
  );
}
