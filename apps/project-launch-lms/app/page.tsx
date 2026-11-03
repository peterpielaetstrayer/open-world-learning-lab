import DecisionLab from "./decision-lab";

const modules = [
  {
    id: "discover",
    index: "01",
    eyebrow: "Module one",
    title: "Discover & Define",
    description:
      "Explore what matters to you, compare possibilities, and shape one clear direction.",
    steps: ["Find a starting point", "Judge relevance, feasibility & scope", "Formulate a direction"],
    outcome: "Your Project Direction Brief",
  },
  {
    id: "launch",
    index: "02",
    eyebrow: "Module two",
    title: "Plan & Launch",
    description:
      "Create a realistic plan, attempt a small first action, and learn from the evidence.",
    steps: ["Plan the smallest meaningful test", "Critique and adjust", "Act, reflect & decide"],
    outcome: "Your Launch Portfolio",
  },
] as const;

export default function Home() {
  return (
    <>
      <a className="skip" href="#main">Skip to main content</a>
      <header className="site-header">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">✳</span>
          <div>
            <strong>Project Launch Lab</strong>
            <span className="brand-sub">Open World Learning Lab · Design preview</span>
          </div>
        </div>
        <nav aria-label="Course sections">
          <a href="#pathway">Learning path</a>
          <a href="#decision-lab">Practice</a>
          <a href="#about">About</a>
          <a href="/login">Enter studio</a>
        </nav>
      </header>
      <main id="main">
        <section className="hero page-wrap" aria-labelledby="hero-title">
          <div className="hero-content">
            <p className="eyebrow">A learning studio for your next idea</p>
            <h1 id="hero-title">Curiosity is a beginning.<br /><em>What will you do with it?</em></h1>
            <p className="lead">
              You don&apos;t need a perfect idea or a grand plan. Start with a question that matters,
              examine what is possible, and take one meaningful step.
            </p>
            <a className="primary-link" href="#pathway">
              Explore the learning path <span aria-hidden="true">↗</span>
            </a>
            <p className="preview-note">
              <strong>Development preview:</strong> This page demonstrates the proposed course interface.
              It does not yet save work, enroll students, or award grades.
            </p>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="art-kicker">FIELD NOTE / 001</div>
            <div className="art-ring art-ring-1" />
            <div className="art-ring art-ring-2" />
            <div className="art-core">?</div>
            <div className="art-caption">Observe → Choose → Test → Learn</div>
          </div>
        </section>

        <section id="pathway" className="pathway">
          <div className="page-wrap">
            <div className="section-intro">
              <p className="eyebrow">The path</p>
              <h2>Two modules. One project that begins with you.</h2>
              <p>Each module builds on the last. What matters is your reasoning and the evidence you gather—not how impressive your final presentation looks.</p>
            </div>
            <div className="module-grid">
              {modules.map((module) => (
                <article className="module-card" id={module.id} key={module.id}>
                  <div className="module-top">
                    <span className="module-index">{module.index}</span>
                    <span className="state">Curriculum in development</span>
                  </div>
                  <p className="eyebrow">{module.eyebrow}</p>
                  <h3>{module.title}</h3>
                  <p>{module.description}</p>
                  <ol>
                    {module.steps.map((step) => <li key={step}>{step}</li>)}
                  </ol>
                  <div className="module-output">
                    <span>Your evidence of learning</span>
                    <strong>{module.outcome}</strong>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="decision-lab" className="practice page-wrap">
          <div className="section-intro">
            <p className="eyebrow">Try one decision</p>
            <h2>A good first step gives you something to learn from.</h2>
            <p>Here is a short example of the decision-making practice we&apos;re designing into the course.</p>
          </div>
          <DecisionLab />
        </section>

        <section id="about" className="endnote">
          <div className="page-wrap endnote-grid">
            <div>
              <p className="eyebrow">The principle</p>
              <h2>Build the learner&apos;s judgment,<br />not just the artifact.</h2>
            </div>
            <p>
              Project Launch Lab is a proposed introductory experience within Open World Learning
              Lab&apos;s Studio Pathway. The complete course will include original instructional media,
              accessible readings, peer discussion, facilitator feedback, graded assignments,
              and a documented first-action attempt. This preview is not the completed LMS.
            </p>
          </div>
        </section>
      </main>
      <footer className="site-footer page-wrap">
        <span>Project Launch Lab · From Curiosity to Action</span>
        <span>Open World Learning Lab · Prototype</span>
      </footer>
    </>
  );
}
