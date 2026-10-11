import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Learning Environments | OWLL",
  description: "Exploring the design of physical and digital environments for inquiry, creativity, and lifelong learning.",
  robots: { index: false, follow: false },
};

const layers = [
  { number: "01", title: "Understand the learner", detail: "Goals, interests, habits, strengths, constraints, and agency." },
  { number: "02", title: "Design the environment", detail: "Purposeful zones, adaptable furniture, displays, tools, and access." },
  { number: "03", title: "Activate the experience", detail: "Projects, learning workflows, reflection, and real-world connection." },
];

export default function LearningEnvironmentsPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-deep-field text-on-dark">
          <div className="pointer-events-none absolute -right-24 -top-20 h-[28rem] w-[28rem] rounded-full border border-on-dark/10" aria-hidden="true" />
          <div className="pointer-events-none absolute right-8 top-20 h-[19rem] w-[19rem] rounded-full border border-on-dark/10" aria-hidden="true" />
          <div className="mx-auto max-w-[1320px] px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-on-dark/60">OWLL / exploratory research</p>
            <h1 className="mt-7 max-w-3xl font-serif text-[clamp(2.9rem,6vw,5.5rem)] leading-[1.05] tracking-tight">
              A space for who you are becoming.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-on-dark/75">
              Could the spaces where we live become better environments for inquiry,
              creative work, and lifelong learning? OWLL is exploring how physical
              environments and digital tools might work together to support human agency.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link href="/lab/space-designer/studio" className="inline-flex min-h-12 items-center rounded-full bg-field-paper px-6 font-medium text-ink hover:bg-soft-paper">
                Explore Space Designer Studio v0.2 <span aria-hidden="true" className="ml-2">↗</span>
              </Link>
              <span className="text-sm text-on-dark/60">Private concept explorer · no purchasing</span>
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-[1320px] px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-water">A human-centered system</p>
          <h2 className="mt-4 max-w-2xl font-serif text-page-title">More than a room. A learning ecosystem.</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {layers.map((layer) => (
              <article key={layer.number} className="card-premium p-7">
                <span className="font-mono text-sm text-water">{layer.number}</span>
                <h3 className="mt-6 font-serif text-2xl">{layer.title}</h3>
                <p className="mt-3 text-sm text-secondary">{layer.detail}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="bg-soft-paper">
          <div className="mx-auto max-w-[1320px] px-5 py-16 sm:px-6 lg:px-8">
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-water">Pilot 001</p>
                <h2 className="mt-3 font-serif text-page-title">The first laboratory is a real room.</h2>
                <p className="mt-5 text-secondary">The proposed Peter OS Learning Headquarters is the first design-research pilot. Before offering installations or AI-assisted room design commercially, we are testing the assessment, experience design, and documentation workflow.</p>
              </div>
              <div className="rounded-xl border border-border bg-page p-8">
                <p className="font-mono text-xs uppercase tracking-widest text-quiet">Research status</p>
                <h3 className="mt-3 font-serif text-2xl">Prototype, not a service launch.</h3>
                <p className="mt-3 text-sm text-secondary">This page presents a potential direction. OWLL is not currently offering a turnkey learning-room installation service, taking orders, or making outcome guarantees.</p>
                <Link href="/lab/space-designer/studio" className="mt-6 inline-block text-sm font-medium text-water hover:text-moss">Open Space Designer Studio →</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
