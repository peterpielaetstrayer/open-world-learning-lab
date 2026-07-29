import Link from "next/link";
import VisualPlate from "@/components/visual/VisualPlate";
import WideContainer from "@/components/layout/WideContainer";

const heroLabels = ["Place", "Field Notes", "Inquiry", "Creation", "Return"];

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="pointer-events-none absolute inset-0 texture-contour" aria-hidden="true" />

      <WideContainer className="relative py-10 md:py-20 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] lg:gap-12 xl:gap-16 items-center">
          <div className="max-w-reading">
            <p className="font-mono text-metadata text-water leading-relaxed">
              Independent early-stage education research, design, and prototype development.
            </p>

            <h1 className="mt-4 font-serif text-display text-ink text-balance">
              Learning should begin with the world.
            </h1>

            <p className="mt-5 text-body-lg text-secondary leading-relaxed">
              Open World Learning Lab develops place-based learning journeys, mentor-supported structures, intelligent tools, and cumulative learning systems that help learners turn curiosity and lived experience into knowledge, skill, and meaningful work.
            </p>

            <div className="mt-7 flex flex-col gap-2.5 sm:flex-row sm:gap-3">
              <Link
                href="/contact"
                className="btn-tactile inline-flex min-h-11 w-full sm:w-auto items-center justify-center rounded-full bg-moss px-7 py-3 text-sm font-medium text-on-dark hover:bg-moss/90"
              >
                Start a Conversation
              </Link>
              <Link
                href="/work"
                className="btn-tactile inline-flex min-h-11 w-full sm:w-auto items-center justify-center rounded-full border border-border bg-page/80 px-7 py-3 text-sm font-medium text-ink hover:border-water/40"
              >
                Explore the Work
              </Link>
            </div>
          </div>

          <VisualPlate
            assetKey="homepage-learning-landscape"
            theme="owll"
            variant="hero"
            priority
            overlayLabels={heroLabels}
            showCaption={false}
            frameClassName="!aspect-[4/3] sm:!aspect-[3/2] lg:!aspect-[1536/1024] max-h-[min(42vh,22rem)] sm:max-h-none"
          />
        </div>
      </WideContainer>
    </section>
  );
}
