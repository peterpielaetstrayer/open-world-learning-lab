import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WideContainer from "@/components/layout/WideContainer";
import WaterFingerprintsExperience from "@/components/first-landing/WaterFingerprintsExperience";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Water Fingerprints — A First Landing Field Inquiry",
  description:
    "Try an illustrated Chesapeake Bay shoreline investigation: notice, compare explanations, examine evidence, and recall what you learned. A free OWLL concept demonstration.",
  path: "/work/first-landing/field-experience",
});

export default function FieldExperiencePage() {
  return (
    <>
      <Header />
      <main className="bg-field-paper">
        <section className="border-b border-border py-9 sm:py-12">
          <WideContainer>
            <nav aria-label="Breadcrumb" className="flex flex-wrap gap-2 font-mono text-[11px] uppercase tracking-widest text-quiet">
              <Link href="/" className="hover:text-water">OWLL</Link>
              <span aria-hidden="true">/</span>
              <Link href="/work/first-landing" className="hover:text-water">First Landing</Link>
              <span aria-hidden="true">/</span>
              <span className="text-ink">Field inquiry</span>
            </nav>
            <div className="mt-8 grid items-end gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,.6fr)]">
              <div>
                <p className="font-mono text-xs uppercase tracking-[.16em] text-water">OWLL / Experience prototype 01</p>
                <h1 className="mt-4 max-w-3xl font-serif text-[clamp(3rem,5vw,5.4rem)] leading-[1.02] tracking-[-.04em] text-ink">
                  A place becomes <em>a question.</em>
                </h1>
                <p className="mt-5 max-w-2xl text-body-lg leading-relaxed text-secondary">
                  Around the Chesapeake Bay, water, wind, sand and living things continually interact.
                  Explore a small illustrated shoreline, then try investigating how one pattern may have formed.
                </p>
              </div>
              <div className="border-l-2 border-moss pl-5 text-sm leading-relaxed text-secondary">
                <p className="font-mono text-xs uppercase tracking-widest text-water">Try it now / 5–10 minutes</p>
                <p className="mt-3">No account, equipment, travel, or field access required. An optional personal record can be downloaded as text.</p>
                <p className="mt-3 text-xs">
                  This is a synthetic educational exercise, not a photograph, ecological dataset,
                  completed park study, or evaluated learner intervention.
                </p>
              </div>
            </div>
          </WideContainer>
        </section>

        <section aria-label="Water Fingerprints illustrated investigation" className="py-9 sm:py-14 lg:py-20">
          <WideContainer>
            <WaterFingerprintsExperience />
          </WideContainer>
        </section>

        <section className="border-t border-border bg-soft-paper/40 py-12 sm:py-16">
          <WideContainer>
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
              <div className="max-w-reading">
                <p className="font-mono text-xs uppercase tracking-widest text-water">What you just experienced</p>
                <h2 className="mt-4 font-serif text-page-title text-ink">An inquiry, not an answer machine.</h2>
                <p className="mt-5 text-base leading-relaxed text-secondary">
                  The exercise asks you to attend to a setting, preserve an observation, propose more
                  than one cause, evaluate evidence and reconstruct an explanation. You do the intellectual work.
                </p>
                <p className="mt-4 text-base leading-relaxed text-secondary">
                  The complete OWLL First Landing program is still a proposed learning architecture.
                  This is one small interactive illustration of a method, not a claim that a six-week
                  program or field pilot has already happened.
                </p>
              </div>
              <div className="max-w-reading border-t border-border-strong pt-7 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
                <p className="font-mono text-xs uppercase tracking-widest text-water">Where LOCUS enters</p>
                <h2 className="mt-4 font-serif text-section-title text-ink">A learning moment worth keeping.</h2>
                <p className="mt-4 text-sm leading-relaxed text-secondary">
                  This website demonstration holds responses only in your current tab and offers a text
                  download. The separate LOCUS v0.1.1 adult field-test app implements a narrow real-world
                  thread with captures, evidence, reflection and later retrieval.
                </p>
                <p className="mt-4 text-sm leading-relaxed text-secondary">
                  These two interfaces are not connected. LOCUS does not yet provide a production-ready
                  learning platform, cloud account syncing, or independently validated learning outcomes.
                </p>
                <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
                  <Link href="/work/locus" className="inline-flex min-h-11 items-center text-sm font-semibold text-water hover:text-moss">
                    Understand the LOCUS product →
                  </Link>
                  <a href="https://locus-blond.vercel.app/" target="_blank" rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center text-sm font-semibold text-water hover:text-moss">
                    Open the separate adult field-test app ↗
                  </a>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-quiet">
                  Starting LOCUS creates a new session in that application. It does not import
                  the notes or decisions from this illustrative experience.
                </p>
              </div>
            </div>
          </WideContainer>
        </section>

        <section className="py-12 sm:py-16">
          <WideContainer>
            <div className="max-w-4xl">
              <p className="font-mono text-xs uppercase tracking-widest text-water">Scientific and geographic context</p>
              <h2 className="mt-4 font-serif text-section-title text-ink">Inspired by a real, changing place.</h2>
              <p className="mt-4 text-sm leading-relaxed text-secondary">
                Virginia State Parks documents the Chesapeake Bay shoreline, dunes, maritime forest,
                and wetland environments at First Landing State Park. Shoreline patterns can have
                multiple causes, so the illustration deliberately avoids treating one visible clue as proof.
                The scene is an original conceptual composite, not copied park photography or survey data.
              </p>
              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <a className="min-h-11 content-center text-water hover:underline"
                  href="https://www.dcr.virginia.gov/state-parks/first-landing" target="_blank" rel="noopener noreferrer">
                  Virginia State Parks / First Landing ↗
                </a>
                <a className="min-h-11 content-center text-water hover:underline"
                  href="https://www.dcr.virginia.gov/state-parks/blog/5-ways-to-experience-first-landing-state-park"
                  target="_blank" rel="noopener noreferrer">
                  Park environments and programs ↗
                </a>
              </div>
              <p className="mt-5 text-xs leading-relaxed text-quiet">
                Educational concept demonstration by OWLL. Not affiliated with or endorsed by Virginia State Parks.
                Respect park rules and use designated access points when exploring an actual shoreline.
              </p>
              <Link href="/work/first-landing" className="mt-8 inline-flex min-h-11 items-center text-sm font-semibold text-water hover:text-moss">
                ← Return to the First Landing project
              </Link>
            </div>
          </WideContainer>
        </section>
      </main>
      <Footer />
    </>
  );
}
