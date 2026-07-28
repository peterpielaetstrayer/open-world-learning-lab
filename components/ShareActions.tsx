"use client";

import { useCallback, useState } from "react";

interface ShareActionsProps {
  title?: string;
  showPrint?: boolean;
  className?: string;
}

export default function ShareActions({
  title = "Open World Learning Lab",
  showPrint = false,
  className = "",
}: ShareActionsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  }, []);

  const handleShare = useCallback(async () => {
    const shareTitle = typeof document !== "undefined" ? document.title : title;
    if (navigator.share) {
      try {
        await navigator.share({ title: shareTitle, url: window.location.href });
      } catch {
        /* user cancelled */
      }
    } else {
      handleCopy();
    }
  }, [title, handleCopy]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`} data-print-hide="true">
      <button
        type="button"
        onClick={handleCopy}
        className="btn-tactile inline-flex items-center gap-2 rounded-full border border-sand-dark/60 bg-card px-4 py-2 text-sm text-foreground hover:border-tahoe/40 focus-visible:rounded-full"
      >
        Copy link
      </button>

      <button
        type="button"
        onClick={handleShare}
        className="btn-tactile inline-flex items-center gap-2 rounded-full border border-sand-dark/60 bg-card px-4 py-2 text-sm text-foreground hover:border-tahoe/40 focus-visible:rounded-full"
      >
        Share
      </button>

      {showPrint && (
        <button
          type="button"
          onClick={handlePrint}
          className="btn-tactile inline-flex items-center gap-2 rounded-full border border-sand-dark/60 bg-card px-4 py-2 text-sm text-foreground hover:border-tahoe/40 focus-visible:rounded-full"
        >
          Print / Save as PDF
        </button>
      )}

      <span
        role="status"
        aria-live="polite"
        className={`text-sm text-pine transition-opacity ${copied ? "opacity-100" : "opacity-0 sr-only"}`}
      >
        {copied ? "Link copied to clipboard" : ""}
      </span>
    </div>
  );
}
