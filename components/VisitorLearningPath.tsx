import Link from "next/link";

const paths = [
  {
    number: "01",
    heading: "Start with a question",
    eyebrow: "Everyday inquiry / Free",
    detail: "Notice something familiar, make a prediction, compare evidence, and record your thinking in your own words.",
    href: "/start",
    action: "Try a question from your own world",
    annotation: "Works with paper or an optional private text notebook",
    tone: "paper",
  },
  {
    number: "02",
    heading: "Enter an illustrated place",
    eyebrow: "First Landing / Conceptual encounter",
    detail: "Explore a coastal clue, hold competing explanations, review a cautious evidence card, and recall before rereading.",
    href: "/work/first-landing/field-experience",
    action: "Investigate Water Fingerprints",
    annotation: "A designed composite scene, not field measurements",
    tone: "water",
  },
  {
    number: "03",
    heading: "See what continuity adds",
    eyebrow: "LOCUS / Adult field-test app",
    detail: "Understand how the separate working application captures evidence in a real setting and asks you to return later.",
    href: "/work/locus",
    action: "Explore the working LOCUS app",
    annotation: "No accounts or data transfer between these experiences",
    tone: "forest",
  },
] as const;

export default function VisitorLearningPath() {
  return (
    <section id="learning-path" aria-labelledby="learning-path-title" className="scroll-mt-24">
      <div className="mb-8 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,.65fr)] md:items-end">
        <div>
          <p className="font-mono text-metadata uppercase tracking-widest text-water">A route through this lab / Three distinct experiences</p>
          <h2 id="learning-path-title" className="mt-3 max-w-3xl font-serif text-page-title text-ink">
            Don&apos;t just read about open-world learning. <em>Try it.</em>
          </h2>
        </div>
        <p className="max-w-lg text-sm leading-relaxed text-secondary">
          These are choices, not prerequisites. Begin with an everyday question, follow a
          carefully illustrated investigation, or inspect the separate LOCUS prototype.
        </p>
      </div>

      <ol className="grid gap-4 lg:grid-cols-3">
        {paths.map((item) => (
          <li key={item.number} className="min-w-0">
            <article className={"relative flex h-full flex-col overflow-hidden rounded-xl border border-border-strong p-6 sm:p-7 " +
              (item.tone === "forest" ? "bg-[#18382d] text-[#f3f0e6]" :
               item.tone === "water" ? "bg-[#e5ede8] text-ink" : "bg-card text-ink")}>
              <div className={"relative flex items-center justify-between gap-3 border-b pb-4 font-mono text-[11px] uppercase tracking-widest " +
                (item.tone === "forest" ? "border-[#8eaa91]/35 text-[#dfd1a5]" : "border-border-strong text-water")}>
                <span>{item.number} / Waypoint</span>
                <span aria-hidden="true">↗</span>
              </div>
              <p className={"relative mt-6 font-mono text-[10px] uppercase tracking-widest " +
                (item.tone === "forest" ? "text-[#d9c998]" : "text-water")}>{item.eyebrow}</p>
              <h3 className="relative mt-3 font-serif text-[clamp(1.6rem,2.3vw,2.15rem)] leading-snug">{item.heading}</h3>
              <p className={"relative mt-4 flex-1 text-sm leading-relaxed " +
                (item.tone === "forest" ? "text-[#dfe8dd]" : "text-secondary")}>{item.detail}</p>
              <Link href={item.href} className={"relative mt-7 inline-flex min-h-12 items-center justify-center rounded-full px-4 py-3 text-center text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 " +
                (item.tone === "forest"
                  ? "bg-[#e8d5a8] text-[#203b2e] hover:bg-white focus-visible:outline-white"
                  : "bg-moss text-on-dark hover:bg-deep-field focus-visible:outline-water")}>
                {item.action} <span aria-hidden="true" className="ml-2">→</span>
              </Link>
              <p className={"relative mt-4 text-xs leading-relaxed " +
                (item.tone === "forest" ? "text-[#cfdfcd]" : "text-quiet")}>{item.annotation}</p>
            </article>
          </li>
        ))}
      </ol>
      <p className="mt-5 max-w-4xl border-l-2 border-water/50 pl-4 text-xs leading-relaxed text-quiet">
        These experiences share an educational approach, not a common learner account or
        data pipeline. Save or export any notes before leaving a page. The LOCUS field test is
        for adult exploration, not a production youth program.
      </p>
    </section>
  );
}
