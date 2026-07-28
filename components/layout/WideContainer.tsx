import type { ReactNode } from "react";

interface WideContainerProps {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article";
}

export default function WideContainer({
  children,
  className = "",
  as: Tag = "div",
}: WideContainerProps) {
  return (
    <Tag className={`mx-auto w-full max-w-[1320px] px-5 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </Tag>
  );
}
