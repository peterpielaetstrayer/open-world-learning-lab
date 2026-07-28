import type { ReactNode } from "react";
import WideContainer from "./WideContainer";

interface EditorialSectionProps {
  id?: string;
  children: ReactNode;
  className?: string;
  variant?: "default" | "soft" | "dark" | "field";
}

const variants = {
  default: "bg-page",
  soft: "bg-soft-paper/40 texture-grid",
  dark: "bg-deep-field text-on-dark",
  field: "bg-soft-paper/30 texture-contour",
};

export default function EditorialSection({
  id,
  children,
  className = "",
  variant = "default",
}: EditorialSectionProps) {
  return (
    <section
      id={id}
      className={`scroll-mt-28 md:scroll-mt-32 py-section-y ${variants[variant]} ${className}`}
    >
      <WideContainer>{children}</WideContainer>
    </section>
  );
}
