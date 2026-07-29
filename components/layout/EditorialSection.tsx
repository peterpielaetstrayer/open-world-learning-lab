import type { ReactNode } from "react";
import WideContainer from "./WideContainer";

interface EditorialSectionProps {
  id?: string;
  children: ReactNode;
  className?: string;
  variant?: "default" | "soft" | "dark" | "field";
  spacing?: "major" | "compact";
}

const variants = {
  default: "bg-page",
  soft: "bg-soft-paper/40 texture-grid",
  dark: "bg-deep-field text-on-dark",
  field: "bg-soft-paper/30 texture-contour",
};

const spacingClasses = {
  major: "py-section-y",
  compact: "py-section-y-compact",
};

export default function EditorialSection({
  id,
  children,
  className = "",
  variant = "default",
  spacing = "major",
}: EditorialSectionProps) {
  return (
    <section
      id={id}
      className={`scroll-mt-[4.5rem] md:scroll-mt-32 ${spacingClasses[spacing]} ${variants[variant]} ${className}`}
    >
      <WideContainer>{children}</WideContainer>
    </section>
  );
}
