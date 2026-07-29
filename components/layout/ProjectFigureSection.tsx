import type { ReactNode } from "react";
import WideContainer from "@/components/layout/WideContainer";

interface ProjectFigureSectionProps {
  children: ReactNode;
  className?: string;
}

export default function ProjectFigureSection({
  children,
  className = "",
}: ProjectFigureSectionProps) {
  return (
    <section className={`border-y border-border bg-soft-paper/30 py-section-y-figure ${className}`}>
      <WideContainer>
        <div className="mx-auto w-full max-w-[min(100%,96rem)]">{children}</div>
      </WideContainer>
    </section>
  );
}
