import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LearningExample from "@/components/home/LearningExample";
import LearningLoopDiagram from "@/components/diagrams/LearningLoopDiagram";
import { guardrails } from "@/content/shared";
import "./home.css";

export { homeMetadata as metadata } from "@/lib/metadata";

export default function Home() {
  return (
    <>
      <a className="owll-skip" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main" className="owll-home" tabIndex={-1}>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">
              Independent research &amp; design for the future of learning
            </p>
            <h1 id="hero-title">
              What if the world
              <br />
              helped us become
              <br />
              <em>more capable?</em>
            </h1>
            <p className="hero-intro">
              Open World Learning Lab explores how people learn, develop agency,
              and make meaning through the world around them.
            </p>
            <p className="hero-detail">
              An early-stage initiative bringing research, learning experiences
              and emerging technology into conversation.
            </p>
            <div className="actions">
              <Link className="button" href="#research">
                Explore the lab <span aria-hidden="true">↓</span>
              </Link>
              <Link className="text-action" href="#experience">
                Begin with a question <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
          <figure className="hero-art">
            <Image
              src="/visuals/owll/homepage-learning-landscape.png"
              width={1536}
              height={1024}
              sizes="(max-width: 760px) 100vw, 55vw"
              fetchPriority="high"
              alt="Conceptual field atlas showing a learner on a coastal path, with observations and returning routes connecting the landscape."
            />
            <figcaption>
              <span>FIELD ATLAS / 001</span>
              <span>Experience becomes an opening for inquiry.</span>
            </figcaption>
          </figure>
        </section>

        <div id="thesis" className="thesis-band">
          <p>
            The world is the curriculum.
            <br />
            <span>Human agency is the purpose.</span>
          </p>
          <p>
            From an everyday question to a lifelong pursuit.
            <br />
            From a first observation to something worth understanding.
          </p>
        </div>

        <section
          id="research"
          className="section shell"
          aria-labelledby="research-title"
        >
          <div className="section-heading">
            <p className="eyebrow">
              <span className="index">01</span> The questions behind the work
            </p>
            <div>
              <h2 id="research-title">
                A lab begins
                <br />
                with an open question.
              </h2>
              <p>
                Learning reaches across minds, relationships, places and
                technologies. OWLL is developing a research and design practice
                around the conditions that help people become thoughtful,
                capable and increasingly self-directed.
              </p>
            </div>
          </div>
          <div className="questions">
            <article>
              <span className="topic">AGENCY &amp; INTELLIGENCE</span>
              <h3>When does help make us more independent?</h3>
              <p>
                Explore how human and AI guidance can support judgment,
                productive effort and learning that lasts.
              </p>
              <Link href="#work">
                See the questions in practice <span aria-hidden="true">↗</span>
              </Link>
            </article>
            <article>
              <span className="topic">ENVIRONMENTS &amp; EXPERIENCE</span>
              <h3>What can a place invite us to notice?</h3>
              <p>
                Investigate how the settings we inhabit can open routes into
                knowledge, practice and meaningful creation.
              </p>
              <Link href="#experience">
                Explore a learning example <span aria-hidden="true">↗</span>
              </Link>
            </article>
            <article>
              <span className="topic">CONTINUITY &amp; OWNERSHIP</span>
              <h3>How can learning travel with a person?</h3>
              <p>
                Design ways to keep questions, evidence and understanding
                connected across experiences and institutions.
              </p>
              <Link href="#locus">
                Meet the LOCUS initiative <span aria-hidden="true">↗</span>
              </Link>
            </article>
          </div>
        </section>

        <LearningExample />

        <section
          id="learning-loop"
          className="shell learning-model"
          aria-label="The Open-World Learning Loop"
        >
          <details>
            <summary>Explore the full learning model</summary>
            <p>
              A design model connecting experience, inquiry, practice,
              mentorship, creation, reflection and return.
            </p>
            <LearningLoopDiagram />
          </details>
        </section>

        <section
          id="work"
          className="section shell"
          aria-labelledby="work-title"
        >
          <div className="section-heading">
            <p className="eyebrow">
              <span className="index">03</span> Work in the open
            </p>
            <div>
              <h2 id="work-title">
                From possibility
                <br />
                to something we can examine.
              </h2>
              <p>
                Questions become designs. Designs become prototypes. What
                happens next should inform what we build. This is a growing
                record of the work and its open questions.
              </p>
            </div>
          </div>
          <div className="work-ledger">
            <article className="work-entry">
              <div className="work-type">
                <span>TECHNOLOGY &amp; LEARNING</span>
                <span className="status">Prototype</span>
              </div>
              <div className="work-body">
                <h3>LOCUS</h3>
                <p>
                  A learner-owned system for connecting questions, experiences,
                  evidence and future learning.
                </p>
                <details>
                  <summary>Examine the work</summary>
                  <dl>
                    <dt>Question</dt>
                    <dd>
                      What helps a person return to an inquiry with
                      understanding they can use?
                    </dd>
                    <dt>Documented basis</dt>
                    <dd>
                      The early learner field-test implementation supports a
                      small learning loop, records in the same browser, later
                      re-entry and export. This describes prototype
                      functionality.
                    </dd>
                    <dt>Still open</dt>
                    <dd>
                      Whether the approach improves durable learning, how it
                      serves different learners, and how continuity works across
                      contexts and devices.
                    </dd>
                  </dl>
                </details>
                <Link href="#locus">
                  Explore the initiative <span aria-hidden="true">→</span>
                </Link>
              </div>
              <span className="work-id">OWLL / 01</span>
            </article>
            <article className="work-entry">
              <div className="work-type">
                <span>PLACE &amp; INQUIRY</span>
                <span className="status">Design + prototype</span>
              </div>
              <div className="work-body">
                <h3>Water Writes the Landscape</h3>
                <p>
                  First Landing and coastal Virginia provide a setting to
                  investigate how water shapes land, life and human choices.
                </p>
                <details>
                  <summary>Examine the work</summary>
                  <dl>
                    <dt>Question</dt>
                    <dd>
                      How can an encounter with a place become sustained inquiry
                      and an explanation grounded in evidence?
                    </dd>
                    <dt>Documented basis</dt>
                    <dd>
                      The First Landing dossier preserves a six-week design
                      sketch and describes a related eight-stop Journey Studio
                      prototype.
                    </dd>
                    <dt>Still open</dt>
                    <dd>
                      Field usability, learner outcomes, facilitation needs and
                      transfer to other places.
                    </dd>
                  </dl>
                  <p>
                    A small Coastal Inquiry Lab is being considered for summer
                    2027. Its host, site, participation model, funding and
                    readiness remain in planning.
                  </p>
                </details>
                <Link href="/work/first-landing">
                  Read the current dossier <span aria-hidden="true">↗</span>
                </Link>
              </div>
              <span className="work-id">OWLL / 02</span>
            </article>
            <article className="work-entry">
              <div className="work-type">
                <span>ENVIRONMENTS &amp; DESIGN</span>
                <span className="status">Early concept</span>
              </div>
              <div className="work-body">
                <h3>Places for learning</h3>
                <p>
                  Exploring how physical spaces, human support and thoughtful
                  technology could make room for attention, inquiry and
                  creation.
                </p>
                <details>
                  <summary>Examine the work</summary>
                  <dl>
                    <dt>Question</dt>
                    <dd>
                      What changes when a learning environment is designed
                      around the person and the activity?
                    </dd>
                    <dt>Documented basis</dt>
                    <dd>
                      An early public research direction and conceptual learning
                      zones.
                    </dd>
                    <dt>Still open</dt>
                    <dd>
                      Which changes are useful, accessible and sustainable in
                      everyday settings.
                    </dd>
                  </dl>
                </details>
                <Link href="/learning-environments">
                  Explore the concept <span aria-hidden="true">↗</span>
                </Link>
              </div>
              <span className="work-id">OWLL / 03</span>
            </article>
          </div>
          <div className="evidence-foot">
            <p>
              <strong>Evidence matters.</strong> A prototype shows what can be
              built. Observing use and studying learning are further steps.
            </p>
            <Link href="/releases">Browse public releases ↗</Link>
          </div>
        </section>

        <section
          id="locus"
          className="locus-section"
          aria-labelledby="locus-title"
        >
          <div className="shell locus-grid">
            <div>
              <p className="eyebrow">
                <span className="index">04</span> An initiative within OWLL
              </p>
              <h2 id="locus-title">
                A learning life
                <br />
                with continuity.
              </h2>
              <p className="large-copy">
                LOCUS is being developed to help people carry meaningful
                learning across experiences, people and time.
              </p>
              <p>
                A structured Journey can offer guidance. Open Explore can begin
                with a question of your own. Both should leave you with
                something to return to, examine and build upon.
              </p>
              <Link className="text-action" href="/work/locus">
                Read the LOCUS initiative dossier ↗
              </Link>
            </div>
            <div className="continuity-plate">
              <p className="plate-top">OWLL / LEARNING SYSTEMS</p>
              <div className="mode-pair">
                <div>
                  Structured Journeys<small>A designed path</small>
                </div>
                <div>
                  Open Explore<small>Your own starting point</small>
                </div>
              </div>
              <div className="converge" aria-hidden="true">
                <span></span>
                <span></span>
              </div>
              <div className="thread-center">
                <span className="eyebrow">A shared learning thread</span>
                <strong>Question · evidence · understanding</strong>
                <p>With people, practice and reflection along the way.</p>
              </div>
              <div className="thread-return">
                <span aria-hidden="true">↳</span> Return, recall, revise{" "}
                <span aria-hidden="true">↗</span>
              </div>
              <p className="plate-caption">
                Conceptual relationship · The long-term aim is a record the
                learner can inspect, correct and control.
              </p>
            </div>
          </div>
          <div className="shell locus-bottom">
            <p>
              Future product experiences may have their own home. Here, the
              focus is the purpose, research questions and progress behind the
              initiative.
            </p>
            <details>
              <summary>On the horizon</summary>
              <p>
                An inspectable Learner Atlas, a Family Learning Navigator,
                creator tools and spatial interfaces could extend this work.
                Their scope and value remain questions for design and testing.
              </p>
            </details>
          </div>
        </section>

        <section
          id="about"
          className="section shell about-grid"
          aria-labelledby="about-title"
        >
          <div>
            <p className="eyebrow">
              <span className="index">05</span> An enduring home for inquiry
            </p>
            <h2 id="about-title">
              Rooted in the world.
              <br />
              Open to what comes next.
            </h2>
          </div>
          <div>
            <p className="large-copy">
              OWLL began with a possibility in Tahoe. What if the mountain,
              lake, trail and community could form a connected learning
              environment?
            </p>
            <p>
              That question has grown into a wider ambition for an independent
              research and design institute, with the creative and
              entrepreneurial capacity to develop tools, experiences and new
              educational models.
            </p>
            <p>
              Today, OWLL is an early-stage initiative founded by Peter
              Pielaet-Strayer. Its organizational form is still evolving. Human
              agency, mentorship, intellectual openness and evidence guide the
              direction.
            </p>
            <div className="actions">
              <Link href="/about">About the lab and its founder ↗</Link>
              <Link href="/work/open-world-tahoe">The Tahoe origin ↗</Link>
            </div>
          </div>
        </section>

        <section
          id="guardrails"
          className="section shell"
          aria-labelledby="guardrails-title"
        >
          <p className="eyebrow">The conditions for responsible exploration</p>
          <h2 id="guardrails-title">
            More possibility. Human judgment at the center.
          </h2>
          <div className="questions">
            {guardrails.map((principle) => (
              <article key={principle.title}>
                <h3>{principle.title}</h3>
                <p>{principle.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="participate" className="participate">
          <div className="shell">
            <p className="eyebrow">There is more than one way into the work</p>
            <h2>
              Bring a question.
              <br />
              <em>Find a connection.</em>
            </h2>
            <div className="participation-paths">
              <Link href="/start">
                <span>FOR THE CURIOUS</span>
                <strong>Try a learning experience</strong>
                <p>
                  Start alone, with family, or alongside someone you learn with.
                </p>
                <b aria-hidden="true">↗</b>
              </Link>
              <Link href="#work">
                <span>FOR THOSE WHO WANT TO LOOK CLOSER</span>
                <strong>Examine the work</strong>
                <p>Explore a question, prototype or emerging direction.</p>
                <b aria-hidden="true">↗</b>
              </Link>
              <Link href="/contact">
                <span>FOR POSSIBLE COLLABORATORS</span>
                <strong>Start a conversation</strong>
                <p>
                  Bring an educational, research, community or technology
                  perspective.
                </p>
                <b aria-hidden="true">↗</b>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
