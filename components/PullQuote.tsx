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
    <blockquote className="relative my-10 md:my-14 border-l-4 border-l-water/40 pl-6 md:pl-8 py-2">
      <p className="font-serif text-xl md:text-2xl leading-snug text-ink max-w-reading">
        {children}
      </p>
      {attribution && (
        <footer className="mt-5 text-sm text-quiet">{attribution}</footer>
      )}
    </blockquote>
  );
}
