import { ReactNode } from "react";

interface PullQuoteProps {
  children: ReactNode;
  attribution?: string;
  variant?: "light" | "dark";
}

export default function PullQuote({
  children,
  attribution,
  variant = "light",
}: PullQuoteProps) {
  if (variant === "dark") {
    return (
      <blockquote className="relative my-12 md:my-16 -mx-6 md:mx-0">
        <div className="bg-slate-deep text-background px-6 md:px-10 py-10 md:py-14 pattern-topo">
          <p className="field-label text-sand/50 mb-4">Field note</p>
          <p className="font-serif text-2xl md:text-3xl leading-snug tracking-tight text-background max-w-3xl">
            {children}
          </p>
          {attribution && (
            <footer className="mt-6 text-sm text-sand/60">{attribution}</footer>
          )}
        </div>
      </blockquote>
    );
  }

  return (
    <blockquote className="relative my-10 md:my-14 card-premium glass-panel px-8 md:px-10 py-8 md:py-10 border-l-4 border-l-tahoe/40">
      <div
        className="absolute top-4 right-6 text-5xl font-serif text-tahoe/15 leading-none select-none"
        aria-hidden="true"
      >
        &ldquo;
      </div>
      <p className="relative font-serif text-xl md:text-2xl leading-snug text-foreground max-w-2xl">
        {children}
      </p>
      {attribution && (
        <footer className="mt-5 text-sm text-stone">{attribution}</footer>
      )}
    </blockquote>
  );
}
