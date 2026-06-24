export default function Hero() {
  return (
    <section className="pattern-topo relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28 lg:py-32">
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

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <a
                href="#meta-academy"
                className="inline-flex items-center justify-center rounded-full bg-pine px-7 py-3 text-sm font-medium text-white hover:bg-pine-light transition-colors"
              >
                Explore Meta Academy Tahoe
              </a>
              <a
                href="#framework"
                className="inline-flex items-center justify-center rounded-full border border-sand-dark bg-card px-7 py-3 text-sm font-medium text-foreground hover:border-tahoe/40 transition-colors"
              >
                Read the framework
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-tahoe/10 via-transparent to-pine/10 blur-2xl" />
            <div className="relative rounded-2xl border border-sand-dark/60 bg-card shadow-lg shadow-foreground/5 overflow-hidden">
              <div className="border-b border-sand-dark/40 bg-sand/30 px-5 py-3 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-tahoe/40" />
                <span className="h-2.5 w-2.5 rounded-full bg-sand-dark" />
                <span className="h-2.5 w-2.5 rounded-full bg-pine/30" />
                <span className="ml-3 text-xs font-mono text-stone tracking-wide">
                  mission preview
                </span>
              </div>

              <div className="p-6 md:p-8 space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-stone">
                      Location
                    </p>
                    <p className="mt-1 font-serif text-xl text-foreground">
                      Tahoe
                    </p>
                  </div>
                  <span className="rounded-full bg-pine/10 px-3 py-1 text-xs font-medium text-pine">
                    Live
                  </span>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-stone">
                    Mission
                  </p>
                  <p className="mt-1 font-serif text-2xl text-tahoe">
                    The Flip
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-stone mb-2">
                    Concepts
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["Momentum", "Torque", "Rotation", "Feedback"].map(
                      (concept) => (
                        <span
                          key={concept}
                          className="rounded-md bg-sand/60 px-2.5 py-1 text-xs text-foreground"
                        >
                          {concept}
                        </span>
                      ),
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-sand-dark/40">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-stone">
                      Participants
                    </p>
                    <p className="mt-1 text-sm text-muted leading-snug">
                      Local explorers + global learners
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-stone">
                      Artifact
                    </p>
                    <p className="mt-1 text-sm text-muted leading-snug">
                      Field guide / reflection / analysis
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
