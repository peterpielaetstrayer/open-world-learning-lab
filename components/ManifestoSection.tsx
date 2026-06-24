import { ReactNode } from "react";

interface ManifestoSectionProps {
  id?: string;
  title: string;
  children: ReactNode;
  variant?: "paper" | "sand" | "slate" | "interface";
  className?: string;
}

const variantStyles = {
  paper: "bg-background",
  sand: "bg-sand/30 pattern-topo",
  slate: "bg-slate-deep text-background",
  interface: "section-interface",
};

export default function ManifestoSection({
  id,
  title,
  children,
  variant = "paper",
  className = "",
}: ManifestoSectionProps) {
  const isDark = variant === "slate";

  return (
    <section
      id={id}
      className={`py-16 md:py-24 ${variantStyles[variant]} ${className}`}
    >
      <div className="mx-auto max-w-3xl px-6">
        <header className="mb-8 md:mb-10">
          <p className={`field-label mb-3 ${isDark ? "text-sand/50" : ""}`}>
            Manifesto
          </p>
          <h2
            className={`font-serif text-2xl md:text-3xl lg:text-4xl leading-tight tracking-tight ${
              isDark ? "text-background" : "text-foreground"
            }`}
          >
            {title}
          </h2>
        </header>
        <div
          className={`space-y-5 text-base md:text-lg leading-relaxed ${
            isDark ? "text-sand/85" : "text-muted"
          }`}
        >
          {children}
        </div>
      </div>
    </section>
  );
}
