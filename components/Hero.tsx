export default function Hero() {
  return (
    <section className="hero-field-map relative overflow-hidden min-h-[90vh] flex flex-col justify-center">
      {/* Atmospheric glow orbs */}
      <div className="hero-glow w-[500px] h-[400px] bg-tahoe/20 top-[-10%] right-[-5%]" aria-hidden="true" />
      <div className="hero-glow w-[350px] h-[350px] bg-pine/15 bottom-[-5%] left-[-8%]" aria-hidden="true" />

      {/* Field-map SVG layer */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
        >
          {/* Layered contours */}
          <ellipse cx="1050" cy="380" rx="340" ry="210" stroke="rgba(74,124,155,0.1)" strokeWidth="1" />
          <ellipse cx="1050" cy="380" rx="280" ry="175" stroke="rgba(74,124,155,0.08)" strokeWidth="1" />
          <ellipse cx="1050" cy="380" rx="220" ry="138" stroke="rgba(74,124,155,0.07)" strokeWidth="0.75" />
          <ellipse cx="1050" cy="380" rx="160" ry="100" stroke="rgba(45,90,71,0.07)" strokeWidth="0.75" />
          <ellipse cx="1050" cy="380" rx="100" ry="62" stroke="rgba(45,90,71,0.05)" strokeWidth="0.75" />
          <ellipse cx="260" cy="640" rx="200" ry="120" stroke="rgba(45,90,71,0.06)" strokeWidth="0.75" />
          <ellipse cx="260" cy="640" rx="145" ry="88" stroke="rgba(45,90,71,0.04)" strokeWidth="0.75" />

          {/* Lake silhouette */}
          <path
            d="M800 290 C900 225 1080 245 1150 330 C1220 415 1180 520 1060 560 C940 600 820 575 760 490 C700 405 720 330 800 290 Z"
            fill="rgba(74,124,155,0.07)"
            stroke="rgba(74,124,155,0.16)"
            strokeWidth="1.25"
          />
          <path
            d="M850 350 C930 318 1010 340 1055 400 C1100 460 1060 505 970 515 C880 525 820 480 812 420 C804 360 825 335 850 350 Z"
            fill="rgba(74,124,155,0.05)"
            stroke="rgba(74,124,155,0.1)"
            strokeWidth="0.75"
          />

          {/* Expedition route */}
          <path
            d="M160 740 C300 600 460 660 680 500 C900 340 1060 380 1260 200"
            stroke="rgba(138,130,120,0.2)"
            strokeWidth="1.25"
            strokeDasharray="8 10"
          />

          {/* Mission pins */}
          <circle cx="1060" cy="400" r="5" fill="rgba(74,124,155,0.4)" />
          <circle cx="1060" cy="400" r="10" stroke="rgba(74,124,155,0.18)" strokeWidth="1" />
          <circle cx="680" cy="500" r="4" fill="rgba(45,90,71,0.4)" />
          <circle cx="680" cy="500" r="9" stroke="rgba(45,90,71,0.15)" strokeWidth="1" />
          <circle cx="1260" cy="200" r="4" fill="rgba(138,130,120,0.45)" />
          <circle cx="300" cy="600" r="3.5" fill="rgba(74,124,155,0.3)" />

          {/* Crosshairs */}
          <g stroke="rgba(138,130,120,0.18)" strokeWidth="1">
            <line x1="48" y1="48" x2="48" y2="80" />
            <line x1="32" y1="64" x2="64" y2="64" />
            <line x1="1392" y1="832" x2="1392" y2="864" />
            <line x1="1376" y1="848" x2="1408" y2="848" />
          </g>
        </svg>

        {/* Animated pins overlay */}
        <span className="mission-pin mission-pin-pulse bg-tahoe/60 text-tahoe top-[42%] left-[73%] hidden md:block" />
        <span className="mission-pin mission-pin-pulse bg-pine/60 text-pine top-[55%] left-[47%] hidden md:block [animation-delay:1s]" />
        <span className="mission-pin mission-pin-pulse bg-stone/50 text-stone top-[22%] left-[87%] hidden lg:block [animation-delay:2s]" />

        <p className="absolute top-8 left-6 font-mono text-[0.6rem] text-stone/45 tracking-[0.2em] hidden sm:block">
          39°05&apos;48&quot;N · 120°01&apos;55&quot;W
        </p>
        <p className="absolute bottom-10 right-6 font-mono text-[0.6rem] text-stone/40 tracking-[0.15em] hidden sm:block">
          ELEV. 6,225 FT · SECTOR OWL-0
        </p>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-16 md:py-24 lg:py-28 w-full">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Copy column */}
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-tahoe/25 bg-white/50 backdrop-blur-sm px-4 py-1.5 text-xs font-medium tracking-wide text-tahoe uppercase shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-pine mission-pin-pulse" aria-hidden="true" />
              Open-source education design project
            </span>

            <h1 className="mt-7 font-serif text-[2.1rem] sm:text-4xl md:text-5xl lg:text-[3.2rem] leading-[1.08] tracking-tight text-foreground">
              Turn the real world into a rigorous learning environment.
            </h1>

            <p className="mt-6 text-base sm:text-lg md:text-xl leading-relaxed text-muted">
              Open World Learning Lab is an open-source education design project
              exploring how place-based learning, human mentorship, AI glasses,
              live exploration, and thoughtful learning design can make knowledge
              feel alive again.
            </p>

            <p className="mt-5 text-sm text-stone italic border-l-2 border-tahoe/25 pl-4">
              Not a metaverse school. A real-world academy model powered by
              emerging tools.
            </p>

            <div className="mt-9 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <a
                href="#meta-academy"
                className="btn-tactile inline-flex w-full sm:w-auto items-center justify-center rounded-full bg-pine px-7 py-3.5 text-sm font-medium text-white hover:bg-pine-light shadow-md shadow-pine/20"
              >
                Explore Meta Academy Tahoe
              </a>
              <a
                href="#framework"
                className="btn-tactile inline-flex w-full sm:w-auto items-center justify-center rounded-full border border-sand-dark/80 bg-white/60 backdrop-blur-sm px-7 py-3.5 text-sm font-medium text-foreground hover:border-tahoe/40 hover:bg-white/80"
              >
                Read the framework
              </a>
            </div>
          </div>

          {/* Mission preview — glass panel */}
          <div className="relative lg:pl-4">
            <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-tahoe/15 via-transparent to-pine/12 blur-3xl opacity-80" aria-hidden="true" />

            <svg
              className="absolute -left-4 top-1/2 hidden lg:block -translate-y-1/2 opacity-40"
              width="48"
              height="96"
              viewBox="0 0 48 96"
              fill="none"
              aria-hidden="true"
            >
              <path d="M0 48 C12 28 24 68 48 48" stroke="rgba(74,124,155,0.6)" strokeWidth="1" strokeDasharray="4 5" />
              <circle cx="48" cy="48" r="4" fill="rgba(45,90,71,0.5)" />
            </svg>

            <div className="glass-panel relative rounded-2xl overflow-hidden card-lift">
              {/* Inner highlight strip */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" aria-hidden="true" />

              <div className="border-b border-sand-dark/30 bg-gradient-to-r from-sand/40 to-tahoe/[0.04] px-5 py-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-tahoe/50" />
                  <span className="h-2 w-2 rounded-full bg-sand-dark/80" />
                  <span className="h-2 w-2 rounded-full bg-pine/40" />
                  <span className="ml-2 field-label text-tahoe/80">mission · active</span>
                </div>
                <span className="font-mono text-[0.6rem] text-stone/60 tracking-wider">
                  OWL-001
                </span>
              </div>

              <div className="p-6 md:p-7 space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="field-label">Location</p>
                    <p className="mt-1 font-serif text-xl text-foreground">Tahoe</p>
                    <p className="mt-0.5 font-mono text-[0.65rem] text-stone/65 tracking-wide">
                      6,225 ft · clear · 42°F
                    </p>
                  </div>
                  <span className="rounded-full bg-pine/10 px-3 py-1 text-xs font-medium text-pine border border-pine/25 shadow-sm">
                    Live
                  </span>
                </div>

                <div className="rounded-xl border border-sand-dark/30 bg-background/50 p-4 card-premium-inner">
                  <p className="field-label">Mission</p>
                  <p className="mt-1 font-serif text-2xl text-tahoe">The Flip</p>
                </div>

                <div className="rounded-xl border border-dashed border-tahoe/25 bg-tahoe/[0.04] px-4 py-3.5">
                  <p className="field-label text-tahoe/70">Field observation</p>
                  <p className="mt-1.5 text-sm text-muted leading-snug">
                    Rotation stalls at apex — torque and timing need review on replay.
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <p className="field-label">Concepts</p>
                    <span className="rounded-full bg-pine/10 px-2.5 py-0.5 text-[0.6rem] font-medium uppercase tracking-wider text-pine border border-pine/15">
                      concept unlocked
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["Momentum", "Torque", "Rotation", "Feedback"].map((concept) => (
                      <span
                        key={concept}
                        className="rounded-lg bg-white/70 px-2.5 py-1 text-xs text-foreground border border-sand-dark/30 shadow-sm"
                      >
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-sand-dark/30">
                  <div>
                    <p className="field-label">Participants</p>
                    <p className="mt-1 text-sm text-muted leading-snug">
                      Local explorers + global learners
                    </p>
                  </div>
                  <div>
                    <p className="field-label">Artifact</p>
                    <p className="mt-1 text-sm text-muted leading-snug">
                      Field guide / reflection / analysis
                    </p>
                    <p className="mt-1.5 inline-flex items-center gap-1.5 rounded-md bg-tahoe/[0.06] px-2 py-0.5 font-mono text-[0.62rem] text-tahoe/80 tracking-wide">
                      <span className="h-1 w-1 rounded-full bg-tahoe/50" aria-hidden="true" />
                      artifact pending
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
