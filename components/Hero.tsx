import Link from "next/link";

const loopNodes = [
  { label: "Place", x: 15, y: 50, color: "pine" },
  { label: "Attention", x: 30, y: 25, color: "tahoe" },
  { label: "Field Notes", x: 50, y: 15, color: "tahoe" },
  { label: "Questions", x: 70, y: 25, color: "tahoe" },
  { label: "Inquiry", x: 85, y: 45, color: "pine" },
  { label: "Knowledge", x: 80, y: 70, color: "stone" },
  { label: "Practice", x: 60, y: 85, color: "stone" },
  { label: "Mentorship", x: 35, y: 85, color: "pine" },
  { label: "Creation", x: 15, y: 70, color: "tahoe" },
  { label: "Reflection", x: 50, y: 55, color: "stone" },
];

export default function Hero() {
  return (
    <section className="hero-field-map relative overflow-hidden min-h-[90vh] flex flex-col justify-center">
      <div className="hero-glow w-[500px] h-[400px] bg-tahoe/20 top-[-10%] right-[-5%]" aria-hidden="true" />
      <div className="hero-glow w-[350px] h-[350px] bg-pine/15 bottom-[-5%] left-[-8%]" aria-hidden="true" />

      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
        >
          <ellipse cx="1050" cy="380" rx="340" ry="210" stroke="rgba(74,124,155,0.1)" strokeWidth="1" />
          <ellipse cx="1050" cy="380" rx="220" ry="138" stroke="rgba(74,124,155,0.07)" strokeWidth="0.75" />
          <ellipse cx="260" cy="640" rx="200" ry="120" stroke="rgba(45,90,71,0.06)" strokeWidth="0.75" />
          <path
            d="M800 290 C900 225 1080 245 1150 330 C1220 415 1180 520 1060 560 C940 600 820 575 760 490 C700 405 720 330 800 290 Z"
            fill="rgba(74,124,155,0.07)"
            stroke="rgba(74,124,155,0.16)"
            strokeWidth="1.25"
          />
          <path
            d="M160 740 C300 600 460 660 680 500 C900 340 1060 380 1260 200"
            stroke="rgba(138,130,120,0.2)"
            strokeWidth="1.25"
            strokeDasharray="8 10"
          />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-16 md:py-24 lg:py-28 w-full">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-tahoe/25 bg-white/50 backdrop-blur-sm px-4 py-1.5 text-xs font-medium tracking-wide text-tahoe uppercase shadow-sm">
              Independent education design lab
            </span>

            <h1 className="mt-7 font-serif text-[2.1rem] sm:text-4xl md:text-5xl lg:text-[3.2rem] leading-[1.08] tracking-tight text-foreground">
              Learning should begin with the world.
            </h1>

            <p className="mt-6 text-base sm:text-lg md:text-xl leading-relaxed text-muted">
              Open World Learning Lab designs place-based learning journeys, mentor systems, and intelligent tools that help learners turn curiosity and lived experience into knowledge, skill, self-awareness, and meaningful work.
            </p>

            <p className="mt-5 text-sm text-stone border-l-2 border-tahoe/25 pl-4">
              Independent early-stage research and prototype development.
            </p>

            <div className="mt-9 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                href="/work"
                className="btn-tactile inline-flex w-full sm:w-auto items-center justify-center rounded-full bg-pine px-7 py-3.5 text-sm font-medium text-white hover:bg-pine-light shadow-md shadow-pine/20"
              >
                Explore Current Work
              </Link>
              <a
                href="#thesis"
                className="btn-tactile inline-flex w-full sm:w-auto items-center justify-center rounded-full border border-sand-dark/80 bg-white/60 backdrop-blur-sm px-7 py-3.5 text-sm font-medium text-foreground hover:border-tahoe/40 hover:bg-white/80"
              >
                Read the Open-World Thesis
              </a>
            </div>
          </div>

          <div className="relative lg:pl-4">
            <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-tahoe/15 via-transparent to-pine/12 blur-3xl opacity-80" aria-hidden="true" />

            <div className="glass-panel relative rounded-2xl overflow-hidden card-lift">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" aria-hidden="true" />

              <div className="border-b border-sand-dark/30 bg-gradient-to-r from-sand/40 to-tahoe/[0.04] px-5 py-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-tahoe/50" />
                  <span className="h-2 w-2 rounded-full bg-sand-dark/80" />
                  <span className="h-2 w-2 rounded-full bg-pine/40" />
                  <span className="ml-2 field-label text-tahoe/80">Concept model</span>
                </div>
                <span className="font-mono text-[0.6rem] text-stone/60 tracking-wider">
                  OWL-SYS-001
                </span>
              </div>

              <div className="p-6 md:p-7">
                <p className="field-label mb-4">Learning system visualization</p>

                <div className="relative aspect-[4/3] rounded-xl border border-sand-dark/30 bg-background/50 overflow-hidden">
                  <svg
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 400 300"
                    aria-hidden="true"
                  >
                    <circle cx="200" cy="150" r="100" fill="rgba(74,124,155,0.04)" stroke="rgba(74,124,155,0.12)" strokeWidth="1" strokeDasharray="4 4" />
                    <circle cx="200" cy="150" r="60" fill="rgba(45,90,71,0.04)" stroke="rgba(45,90,71,0.1)" strokeWidth="1" />
                    <path
                      d="M 80 150 Q 140 80 200 90 Q 260 80 320 150 Q 260 220 200 210 Q 140 220 80 150"
                      fill="none"
                      stroke="rgba(74,124,155,0.2)"
                      strokeWidth="1.5"
                      strokeDasharray="6 4"
                    />
                    {loopNodes.map((node, i) => {
                      const next = loopNodes[(i + 1) % loopNodes.length];
                      return (
                        <line
                          key={`line-${node.label}`}
                          x1={node.x * 4}
                          y1={node.y * 3}
                          x2={next.x * 4}
                          y2={next.y * 3}
                          stroke="rgba(138,130,120,0.15)"
                          strokeWidth="0.75"
                        />
                      );
                    })}
                    {loopNodes.map((node) => (
                      <g key={node.label}>
                        <circle cx={node.x * 4} cy={node.y * 3} r="4" fill="rgba(74,124,155,0.35)" />
                      </g>
                    ))}
                  </svg>

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center px-4">
                      <p className="field-label text-tahoe/70">Core loop</p>
                      <p className="font-serif text-lg text-foreground mt-1">World → Learner → Record</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {["Place", "Field Notes", "Inquiry", "Mentorship", "Creation", "Reflection", "Return"].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-lg bg-white/70 px-2.5 py-1 text-xs text-foreground border border-sand-dark/30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="mt-4 text-xs text-stone/70 leading-relaxed">
                  Conceptual diagram — not a live system. Learning moves between the world, the learner, human support, and a cumulative record.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
