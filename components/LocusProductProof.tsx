import Link from "next/link";

const stages = [
  {n:"01",phase:"Attend",headline:"Begin with the world",body:"Record an initial explanation, put the phone away, and look for details before deciding what they mean.",truth:"Attention precedes explanation."},
  {n:"02",phase:"Capture",headline:"Keep three observations",body:"Save what you noticed and the surrounding context as three quick Captures, without completing a long form in the field.",truth:"A Capture is not yet Evidence."},
  {n:"03",phase:"Evidence",headline:"Defend one interpretation",body:"Select the strongest Capture. State the claim, consider another explanation, and name what could weaken your reasoning.",truth:"Claims stay open to revision."},
  {n:"04",phase:"Re-entry",headline:"Retrieve before you review",body:"Explain what you understand without rereading. Finish the session, return later, and recall before the original record appears.",truth:"Continuity is a question to test."},
] as const;

export default function LocusProductProof() {
  return (
    <section id="locus-product-proof" aria-labelledby="locus-proof-title" className="overflow-hidden rounded-2xl border border-border bg-[#112e25] text-[#f1f0e4] shadow-[0_20px_52px_rgba(20,42,31,.12)]">
      <div className="p-6 sm:p-9 lg:p-10">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#98b19a]/30 pb-5 font-mono text-[11px] uppercase tracking-widest text-[#cbd8c8]">
          <span>Product evidence / v0.1.1</span><span>Adult field-test app</span>
        </div>
        <div className="mt-8 grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,.72fr)] md:items-end">
          <div>
            <h2 id="locus-proof-title" className="font-serif text-[clamp(2.4rem,4vw,4.2rem)] leading-[1.04] tracking-[-.04em]">
              The learning loop <em className="text-[#dbc894]">is real.</em>
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-[#e1e8dd]">
              Not a simulated app mockup. LOCUS currently runs one complete adult field-test encounter,
              from attention and observations through evidence, reflection, and later retrieval.
            </p>
          </div>
          <div className="rounded-xl border border-[#9caf95]/50 bg-[#254737] p-5">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#d5c48b]">Try the actual deployed application</p>
            <h3 className="mt-3 font-serif text-xl text-[#f8f5eb]">Water Fingerprints</h3>
            <p className="mt-3 text-xs leading-relaxed text-[#d9e5d7]">
              No account. Records live in the testing browser, and the app can export JSON.
              For offline use, first open the app while connected.
            </p>
            <a href="https://locus-blond.vercel.app/" target="_blank" rel="noopener noreferrer"
              className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#e6d3a8] px-5 py-3 text-center text-sm font-semibold text-[#203528] hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
              Open working LOCUS ↗
            </a>
          </div>
        </div>
        <div className="mt-10 flex flex-wrap items-baseline justify-between gap-3">
          <h3 className="font-serif text-2xl text-[#f4f2e8]">Four moments you can verify</h3>
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#ccdccc]">Guided walkthrough / Actual implemented stages</span>
        </div>
        <ol className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {stages.map(stage=>(
            <li key={stage.n} className="rounded-xl border border-[#90ab92]/40 bg-[#284738]/55 p-5">
              <p className="border-b border-[#acc2a8]/25 pb-3 font-mono text-[11px] uppercase tracking-wider text-[#dccb98]">{stage.n} / {stage.phase}</p>
              <h4 className="mt-4 font-serif text-xl text-[#f2f1e5]">{stage.headline}</h4>
              <p className="mt-3 text-sm leading-relaxed text-[#d6e5d6]">{stage.body}</p>
              <p className="mt-4 border-l-2 border-[#d7bb79] pl-3 text-xs italic text-[#e3d4af]">{stage.truth}</p>
            </li>
          ))}
        </ol>
        <p className="mt-5 text-xs leading-relaxed text-[#d6e2d3]">
          This is an editorial explanation of the functioning flow, not application screenshots or
          results from a participant study. Re-entry requires finishing a session first.
        </p>
      </div>
      <div className="border-t border-[#94ac95]/30 bg-[#183a2d] p-6 sm:p-9 lg:p-10">
        <h3 className="font-serif text-2xl text-[#f4f2e8]">Built, in review, and not yet built.</h3>
        <div className="mt-5 grid gap-5 sm:grid-cols-3">
          <div className="border-t border-[#92a991]/50 pt-4">
            <p className="font-mono text-[11px] uppercase tracking-wider text-[#dbca93]">01 / Working today</p>
            <p className="mt-3 text-sm leading-relaxed text-[#deeadb]">Three Captures, distinct Evidence, explanations from memory, reflection, local drafts, JSON export, and later retrieval.</p>
          </div>
          <div className="border-t border-[#92a991]/50 pt-4">
            <p className="font-mono text-[11px] uppercase tracking-wider text-[#dbca93]">02 / In review</p>
            <p className="mt-3 text-sm leading-relaxed text-[#deeadb]">A browser-local backup restore workflow and creator-to-learner handoff research. Not live in the linked application.</p>
          </div>
          <div className="border-t border-[#92a991]/50 pt-4">
            <p className="font-mono text-[11px] uppercase tracking-wider text-[#dbca93]">03 / Not established</p>
            <p className="mt-3 text-sm leading-relaxed text-[#deeadb]">Cloud sync, live AI, unified Creator Studio, safeguarding for youth, and independently demonstrated educational outcomes.</p>
          </div>
        </div>
        <p className="mt-7 border-t border-[#92a991]/30 pt-5 text-sm leading-relaxed text-[#d5e5d3]">
          Curious about the place-based learning design behind this field test?
          {" "}<Link href="/work/first-landing" className="font-semibold text-[#e9d3a0] underline underline-offset-4 hover:text-white">Explore the First Landing project →</Link>
        </p>
      </div>
    </section>
  );
}
