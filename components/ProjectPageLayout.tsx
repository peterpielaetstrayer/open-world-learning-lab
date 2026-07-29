import type { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import WideContainer from "@/components/layout/WideContainer";

interface ProjectPageLayoutProps {
  masthead: ReactNode;
  lead?: ReactNode;
  figure?: ReactNode;
  children: ReactNode;
  related?: ReactNode;
}

export default function ProjectPageLayout({
  masthead,
  lead,
  figure,
  children,
  related,
}: ProjectPageLayoutProps) {
  return (
    <>
      <Header />
      <main>
        {masthead}
        {lead && (
          <div className="border-b border-border bg-page py-8 md:py-10">
            <WideContainer>
              <div className="max-w-reading">{lead}</div>
            </WideContainer>
          </div>
        )}
        {figure}
        <div className="py-12 md:py-16 lg:py-20">
          <WideContainer>
            <div className="max-w-reading prose-content space-y-12">{children}</div>
            {related && <div className="mt-16 max-w-3xl">{related}</div>}
          </WideContainer>
        </div>
      </main>
      <Footer />
    </>
  );
}

function ContentSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="font-serif text-section-title text-ink mb-5">{title}</h2>
      <div className="space-y-4 text-body text-secondary leading-relaxed">{children}</div>
    </section>
  );
}

export { ContentSection };
