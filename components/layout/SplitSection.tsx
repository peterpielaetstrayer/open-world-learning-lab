import type { ReactNode } from "react";

interface SplitSectionProps {
  children: ReactNode;
  reverse?: boolean;
  className?: string;
  visual?: ReactNode;
}

export default function SplitSection({
  children,
  reverse = false,
  className = "",
  visual,
}: SplitSectionProps) {
  return (
    <div
      className={`grid gap-10 lg:gap-16 items-center lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] ${reverse ? "lg:[&>*:first-child]:order-2" : ""} ${className}`}
    >
      <div className="min-w-0">{children}</div>
      {visual && <div className="min-w-0">{visual}</div>}
    </div>
  );
}
