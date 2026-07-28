import type { ReactNode } from "react";

interface ConceptNoticeProps {
  children: ReactNode;
  variant?: "default" | "warning";
}

export default function ConceptNotice({
  children,
  variant = "default",
}: ConceptNoticeProps) {
  return (
    <aside
      className={`rounded-xl border p-5 md:p-6 ${
        variant === "warning"
          ? "border-stone/30 bg-stone/5"
          : "border-tahoe/25 bg-tahoe/[0.04]"
      }`}
      role="note"
    >
      <p className="field-label mb-2 text-tahoe/70">Status notice</p>
      <p className="text-sm text-muted leading-relaxed">{children}</p>
    </aside>
  );
}
