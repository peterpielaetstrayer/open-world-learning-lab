"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useRef } from "react";

interface VisualExpandDialogProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  triggerLabel?: string;
  className?: string;
}

export default function VisualExpandDialog({
  src,
  alt,
  width,
  height,
  triggerLabel = "View full visual",
  className = "",
}: VisualExpandDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  const close = useCallback(() => {
    dialogRef.current?.close();
    triggerRef.current?.focus();
  }, []);

  const open = useCallback(() => {
    dialogRef.current?.showModal();
    closeRef.current?.focus();
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleCancel = (event: Event) => {
      event.preventDefault();
      close();
    };

    dialog.addEventListener("cancel", handleCancel);
    return () => dialog.removeEventListener("cancel", handleCancel);
  }, [close]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={open}
        className={`btn-tactile inline-flex items-center gap-2 rounded-full border border-border bg-page px-4 py-2 text-sm font-medium text-ink hover:border-water/40 ${className}`}
        data-print-hide="true"
        aria-haspopup="dialog"
      >
        {triggerLabel}
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        className="fixed inset-0 z-50 m-0 h-full max-h-none w-full max-w-none border-0 bg-deep-field/90 p-0 backdrop:bg-deep-field/90 open:flex open:flex-col"
      >
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-on-dark/15 px-4 py-3 sm:px-6">
          <p id={titleId} className="font-mono text-metadata text-on-dark/80">
            {triggerLabel}
          </p>
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            className="btn-tactile inline-flex h-10 w-10 items-center justify-center rounded-full border border-on-dark/25 text-on-dark hover:bg-on-dark/10"
            aria-label="Close expanded visual"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <div className="flex flex-1 items-start justify-center overflow-auto p-4 sm:p-8">
          <figure className="w-full max-w-[min(100%,96rem)]">
            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              className="h-auto w-full rounded-lg border border-on-dark/20 bg-page"
              sizes="96vw"
              priority
            />
          </figure>
        </div>
      </dialog>
    </>
  );
}
