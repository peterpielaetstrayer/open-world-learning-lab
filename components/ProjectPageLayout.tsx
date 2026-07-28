import type { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Breadcrumbs from "./Breadcrumbs";
import ShareActions from "./ShareActions";
import ConceptNotice from "./ConceptNotice";

interface ProjectPageLayoutProps {
  title: string;
  breadcrumbs: { label: string; href?: string }[];
  metadata: ReactNode;
  statusNotice: string;
  children: ReactNode;
  related?: ReactNode;
}

export default function ProjectPageLayout({
  title,
  breadcrumbs,
  metadata,
  statusNotice,
  children,
  related,
}: ProjectPageLayoutProps) {
  return (
    <>
      <Header />
      <main className="py-12 md:py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-6">
          <Breadcrumbs items={breadcrumbs} />

          <header className="mt-8 mb-10">
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-tight tracking-tight text-foreground">
              {title}
            </h1>
          </header>

          <div className="mb-10">{metadata}</div>

          <ShareActions showPrint className="mb-10" />

          <ConceptNotice>{statusNotice}</ConceptNotice>

          <div className="mt-12 prose-content space-y-10">{children}</div>

          {related}
        </div>
      </main>
      <Footer />
    </>
  );
}
