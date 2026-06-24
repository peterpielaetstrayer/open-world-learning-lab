import { ReactNode } from "react";

interface SectionProps {
  id: string;
  title?: string;
  subtitle?: string;
  intro?: string;
  children: ReactNode;
  className?: string;
  variant?: "default" | "sand" | "white" | "slate" | "interface" | "dark";
  divider?: boolean;
}

const variantStyles = {
  default: "bg-background",
  sand: "bg-sand/40 pattern-topo",
  white: "bg-card",
  slate: "section-interface",
  interface: "section-interface",
  dark: "bg-slate-deep text-background",
};

export default function Section({
  id,
  title,
  subtitle,
  intro,
  children,
  className = "",
  variant = "default",
  divider = false,
}: SectionProps) {
  return (
    <>
      {divider && <div className="section-divider" aria-hidden="true" />}
      <section
        id={id}
        className={`scroll-mt-28 md:scroll-mt-32 py-20 md:py-28 lg:py-32 ${variantStyles[variant]} ${className}`}
      >
        <div className="mx-auto max-w-6xl px-6">
          {(title || subtitle || intro) && (
            <header className="mb-12 md:mb-16 max-w-3xl">
              {title && (
                <h2
                  className={`font-serif text-3xl md:text-4xl lg:text-[2.75rem] leading-[1.15] tracking-tight ${
                    variant === "dark" ? "text-background" : "text-foreground"
                  }`}
                >
                  {title}
                </h2>
              )}
              {subtitle && (
                <p
                  className={`mt-4 text-lg md:text-xl leading-relaxed max-w-2xl ${
                    variant === "dark" ? "text-sand" : "text-tahoe"
                  }`}
                >
                  {subtitle}
                </p>
              )}
              {intro && (
                <p
                  className={`mt-6 text-base md:text-lg leading-relaxed max-w-2xl ${
                    variant === "dark" ? "text-sand/80" : "text-muted"
                  }`}
                >
                  {intro}
                </p>
              )}
            </header>
          )}
          {children}
        </div>
      </section>
    </>
  );
}
