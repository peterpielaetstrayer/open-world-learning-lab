"use client";

interface PrintButtonProps {
  label?: string;
  className?: string;
}

export default function PrintButton({
  label = "Print / Save as PDF",
  className = "",
}: PrintButtonProps) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className={`btn-tactile inline-flex items-center gap-2 rounded-full border border-sand-dark/60 bg-card px-4 py-2 text-sm text-foreground hover:border-tahoe/40 focus-visible:rounded-full ${className}`}
      data-print-hide="true"
    >
      {label}
    </button>
  );
}
