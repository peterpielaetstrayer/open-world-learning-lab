import type { ReactNode } from "react";

interface ConceptNoticeProps {
  children: ReactNode;
  variant?: "default" | "warning";
  className?: string;
}

export default function ConceptNotice({
  children,
  variant = "default",
  className = "",
}: ConceptNoticeProps) {
  return (
    <aside
      className={`rounded-lg border p-4 md:p-6 ${
        variant === "warning"
          ? "border-sediment/30 bg-sediment/5"
          : "border-water/25 bg-water/[0.04]"
      } ${className}`}
      role="note"
    >
      <p className="font-mono text-metadata mb-2 text-water">Status notice</p>
      <p className="text-sm text-secondary leading-relaxed">{children}</p>
    </aside>
  );
}
