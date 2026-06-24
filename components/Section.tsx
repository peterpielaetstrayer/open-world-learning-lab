import { ReactNode } from "react";

interface SectionProps {
  id: string;
  title?: string;
  subtitle?: string;
  intro?: string;
  children: ReactNode;
  className?: string;
  variant?: "default" | "sand" | "white" | "dark";
}

const variantStyles = {
  default: "bg-background",
  sand: "bg-sand/40",
  white: "bg-card",
  dark: "bg-foreground text-background",
};

export default function Section({
  id,
  title,
  subtitle,
  intro,
  children,
  className = "",
  variant = "default",
}: SectionProps) {
  return (
    <section
      id={id}
      className={`py-20 md:py-28 ${variantStyles[variant]} ${className}`}
    >
      <div className="mx-auto max-w-6xl px-6">
        {(title || subtitle || intro) && (
          <header className="mb-12 md:mb-16 max-w-3xl">
            {title && (
              <h2
                className={`font-serif text-3xl md:text-4xl lg:text-[2.75rem] leading-tight tracking-tight ${
                  variant === "dark" ? "text-background" : "text-foreground"
                }`}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p
                className={`mt-4 text-lg md:text-xl leading-relaxed ${
                  variant === "dark" ? "text-sand" : "text-tahoe"
                }`}
              >
                {subtitle}
              </p>
            )}
            {intro && (
              <p
                className={`mt-6 text-base md:text-lg leading-relaxed ${
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
  );
}
