import type { Metadata } from "next";
import Studio from "@/features/space-designer-v02/Studio";

export const metadata: Metadata = {
  title: "Space Designer Studio v0.2 | OWLL",
  description: "Explore a learning-environment design research tool. Private prototype, not a commercial service.",
  robots: { index: false, follow: false },
};

export default function SpaceDesignerStudioPage() {
  return <Studio />;
}
