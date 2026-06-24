export default function Hero() {
  return (
    <section className="hero-field-map relative overflow-hidden">
      {/* Field-map atmosphere layer */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <svg
          className="absolute inset-0 h-full w-full opacity-[0.55]"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
        >
          {/* Topographic contours */}
          <ellipse cx="1050" cy="380" rx="320" ry="200" stroke="rgba(74,124,155,0.12)" strokeWidth="1" />
          <ellipse cx="1050" cy="380" rx="260" ry="165" stroke="rgba(74,124,155,0.1)" strokeWidth="1" />
          <ellipse cx="1050" cy="380" rx="200" ry="128" stroke="rgba(74,124,155,0.08)" strokeWidth="1" />
          <ellipse cx="1050" cy="380" rx="140" ry="90" stroke="rgba(45,90,71,0.08)" strokeWidth="1" />
          <ellipse cx="280" cy="620" rx="180" ry="110" stroke="rgba(45,90,71,0.07)" strokeWidth="1" />
          <ellipse cx="280" cy="620" rx="130" ry="80" stroke="rgba(45,90,71,0.05)" strokeWidth="1" />

          {/* Abstract lake / shoreline */}
          <path
            d="M820 280 C920 220 1080 240 1140 320 C1200 400 1160 500 1060 540 C960 580 840 560 780 480 C720 400 740 320 820 280 Z"
            fill="rgba(74,124,155,0.06)"
            stroke="rgba(74,124,155,0.14)"
            strokeWidth="1.25"
          />
          <path
            d="M860 340 C940 310 1020 330 1060 390 C1100 450 1060 490 980 500 C900 510 840 470 830 410 C820 350 840 320 860 340 Z"
            fill="rgba(74,124,155,0.04)"
            stroke="rgba(74,124,155,0.08)"
            strokeWidth="0.75"
          />

          {/* Expedition route */}
          <path
            d="M180 720 C320 580 480 640 680 480 C880 320 1040 360 1200 220"
            stroke="rgba(138,130,120,0.22)"
            strokeWidth="1.25"
            strokeDasharray="6 8"
          />

          {/* Mission marker dots */}
          <circle cx="1060" cy="400" r="4" fill="rgba(74,124,155,0.35)" />
          <circle cx="1060" cy="400" r="8" stroke="rgba(74,124,155,0.2)" strokeWidth="1" />
          <circle cx="680" cy="480" r="3.5" fill="rgba(45,90,71,0.35)" />
          <circle cx="1200" cy="220" r="3.5" fill="rgba(138,130,120,0.4)" />
          <circle cx="320" cy="580" r="3" fill="rgba(74,124,155,0.25)" />

          {/* Coordinate crosshairs */}
          <line x1="60" y1="60" x2="60" y2="90" stroke="rgba(138,130,120,0.2)" strokeWidth="1" />
          <line x1="45" y1="75" x2="75" y2="75" stroke="rgba(138,130,120,0.2)" strokeWidth="1" />
          <line x1="1380" y1="840" x2="1380" y2="870" stroke="rgba(138,130,120,0.2)" strokeWidth="1" />
          <line x1="1365" y1="855" x2="1395" y2="855" stroke="rgba(138,130,120,0.2)" strokeWidth="1" />
        </svg>

        <p className="absolute top-6 left-6 font-mono text-[0.6rem] text-stone/50 tracking-widest hidden sm:block">
          39°05&apos;48&quot;N 120°01&apos;55&quot;W
        </p>
        <p className="absolute bottom-8 right-6 font-mono text-[0.6rem] text-stone/40 tracking-widest hidden sm:block">
          ELEV. 6,225 FT · OPEN-WORLD SECTOR
        </p>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-20 md:py-28 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <span className="inline-block rounded-full border border-tahoe/30 bg-tahoe/5 px-4 py-1.5 text-xs font-medium tracking-wide text-tahoe uppercase">
              Open-source education design project
            </span>

            <h1 className="mt-6 font-serif text-4xl md:text-5xl lg:text-[3.25rem] leading-[1.1] tracking-tight text-foreground">
              Turn the real world into a rigorous learning environment.
            </h1>

            <p className="mt-6 text-lg md:text-xl leading-relaxed text-muted max-w-xl">
              Open World Learning Lab is an open-source education design project
              exploring how place-based learning, human mentorship, AI glasses,
              live exploration, and thoughtful learning design can make knowledge
              feel alive again.
            </p>

            <p className="mt-4 text-sm text-stone italic max-w-lg">
              Not a metaverse school. A real-world academy model powered by
              emerging tools.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <a
                href="#meta-academy"
                className="btn-tactile inline-flex w-full sm:w-auto items-center justify-center rounded-full bg-pine px-7 py-3.5 text-sm font-medium text-white hover:bg-pine-light"
              >
                Explore Meta Academy Tahoe
              </a>
              <a
                href="#framework"
                className="btn-tactile inline-flex w-full sm:w-auto items-center justify-center rounded-full border border-sand-dark bg-card/90 backdrop-blur-sm px-7 py-3.5 text-sm font-medium text-foreground hover:border-tahoe/40"
              >
                Read the framework
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-tahoe/10 via-transparent to-pine/10 blur-2xl" />

            {/* Route accent leading to card */}
            <svg
              className="absolute -left-6 top-1/2 hidden lg:block -translate-y-1/2 opacity-30"
              width="40"
              height="80"
              viewBox="0 0 40 80"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M0 40 C10 20 20 60 40 40"
                stroke="rgba(74,124,155,0.5)"
                strokeWidth="1"
                strokeDasharray="3 4"
              />
              <circle cx="40" cy="40" r="3" fill="rgba(45,90,71,0.5)" />
            </svg>

            <div className="relative rounded-2xl border border-sand-dark/60 bg-card/95 backdrop-blur-sm shadow-lg shadow-foreground/5 overflow-hidden card-lift">
              <div className="border-b border-sand-dark/40 bg-sand/30 px-5 py-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-tahoe/40" />
                  <span className="h-2.5 w-2.5 rounded-full bg-sand-dark" />
                  <span className="h-2.5 w-2.5 rounded-full bg-pine/30" />
                  <span className="ml-2 field-label">mission · active</span>
                </div>
                <span className="font-mono text-[0.6rem] text-stone/70">
                  OWL-001
                </span>
              </div>

              <div className="p-6 md:p-8 space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="field-label">Location</p>
                    <p className="mt-1 font-serif text-xl text-foreground">
                      Tahoe
                    </p>
                    <p className="mt-0.5 font-mono text-[0.65rem] text-stone/70">
                      6,225 ft · clear · 42°F
                    </p>
                  </div>
                  <span className="rounded-full bg-pine/10 px-3 py-1 text-xs font-medium text-pine border border-pine/20">
                    Live
                  </span>
                </div>

                <div>
                  <p className="field-label">Mission</p>
                  <p className="mt-1 font-serif text-2xl text-tahoe">
                    The Flip
                  </p>
                </div>

                {/* Field observation row */}
                <div className="rounded-lg border border-dashed border-tahoe/20 bg-tahoe/[0.03] px-4 py-3">
                  <p className="field-label text-tahoe/70">Field observation</p>
                  <p className="mt-1 text-sm text-muted leading-snug">
                    Rotation stalls at apex — torque and timing need review on
                    replay.
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <p className="field-label">Concepts</p>
                    <span className="rounded-full bg-pine/10 px-2 py-0.5 text-[0.6rem] font-medium uppercase tracking-wider text-pine">
                      concept unlocked
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["Momentum", "Torque", "Rotation", "Feedback"].map(
                      (concept) => (
                        <span
                          key={concept}
                          className="rounded-md bg-sand/60 px-2.5 py-1 text-xs text-foreground border border-sand-dark/30"
                        >
                          {concept}
                        </span>
                      ),
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-sand-dark/40">
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
                    <p className="mt-1 text-[0.65rem] font-mono text-tahoe/70">
                      reflection loop · pending
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
