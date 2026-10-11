import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SpaceDesigner from "@/features/space-designer/SpaceDesigner";

export const metadata: Metadata = {
  title: "Space Designer | OWLL Lab",
  description: "Explore a private, simulated prototype for designing a personalized learning environment.",
  robots: { index: false, follow: false },
};

export default function SpaceDesignerPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="flex-1">
        <SpaceDesigner />
      </main>
      <Footer />
    </>
  );
}
