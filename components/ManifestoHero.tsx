import Link from "next/link";

export default function ManifestoHero() {
  return (
    <section className="hero-field-map relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <svg
          className="absolute inset-0 h-full w-full opacity-40"
          viewBox="0 0 1200 600"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
        >
          <ellipse cx="900" cy="280" rx="200" ry="130" stroke="rgba(74,124,155,0.1)" strokeWidth="1" />
          <ellipse cx="900" cy="280" rx="150" ry="98" stroke="rgba(74,124,155,0.07)" strokeWidth="1" />
          <path
            d="M700 220 C780 180 920 200 980 280 C1040 360 1000 420 900 450 C800 480 720 440 690 360 C660 280 680 230 700 220 Z"
            fill="rgba(74,124,155,0.06)"
            stroke="rgba(74,124,155,0.12)"
            strokeWidth="1"
          />
          <path
            d="M100 450 C250 350 400 380 600 280 C800 180 950 220 1100 120"
            stroke="rgba(138,130,120,0.18)"
            strokeWidth="1"
            strokeDasharray="6 8"
          />
          <circle cx="900" cy="300" r="4" fill="rgba(74,124,155,0.35)" />
          <circle cx="600" cy="280" r="3.5" fill="rgba(45,90,71,0.35)" />
        </svg>
        <p className="absolute top-8 left-6 font-mono text-[0.6rem] text-stone/40 tracking-[0.2em] hidden sm:block">
          MANIFESTO · OWL-2025
        </p>
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-6 py-20 md:py-28 lg:py-32 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-tahoe/25 bg-white/50 backdrop-blur-sm px-4 py-1.5 text-xs font-medium tracking-wide text-tahoe uppercase shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-pine" aria-hidden="true" />
          Open-world education manifesto
        </span>

        <h1 className="mt-8 font-serif text-4xl sm:text-5xl md:text-6xl leading-[1.08] tracking-tight text-foreground">
          Not a Metaverse School
        </h1>

        <p className="mt-6 text-lg md:text-xl leading-relaxed text-tahoe max-w-2xl mx-auto">
          A manifesto for open-world education, real places, human mentorship,
          and technology that returns learning to reality.
        </p>

        <p className="mt-8 text-base md:text-lg leading-relaxed text-muted max-w-2xl mx-auto">
          Open World Learning Lab begins from a simple conviction: the future of
          education should not be built by pulling students further away from
          the world. It should help them see the world more clearly.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Link
            href="/"
            className="btn-tactile inline-flex w-full sm:w-auto items-center justify-center rounded-full border border-sand-dark/80 bg-white/60 backdrop-blur-sm px-7 py-3.5 text-sm font-medium text-foreground hover:border-tahoe/40"
          >
            Return to homepage
          </Link>
          <Link
            href="/#meta-academy"
            className="btn-tactile inline-flex w-full sm:w-auto items-center justify-center rounded-full bg-pine px-7 py-3.5 text-sm font-medium text-white hover:bg-pine-light shadow-md shadow-pine/15"
          >
            Explore Meta Academy Tahoe
          </Link>
        </div>

        <p className="mt-12 font-serif text-lg md:text-xl text-foreground italic">
          The goal is not more screen time.{" "}
          <span className="text-tahoe not-italic">The goal is better attention.</span>
        </p>
      </div>
    </section>
  );
}
