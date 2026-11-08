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
              Open World Learning Lab investigates how learning can grow from
              the things people notice, care about and want to understand—and
              develops tools and experiences to help them take it further.
            </p>
            <p className="hero-detail">
              An independent lab in development, working across learning design,
              human development and emerging technology.
            </p>
            <div className="actions">
              <Link className="button" href="#research">
                Explore the lab <span aria-hidden="true">↓</span>
              </Link>
              <Link className="text-action" href="#experience">
                See learning in action <span aria-hidden="true">↗</span>
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
              <span>A LEARNING LANDSCAPE</span>
              <span>Concept illustration</span>
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
            Connecting lived experience with deep knowledge, <br /> deliberate
            practice and human guidance.
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
                What helps people become <br /> authors of their learning?
              </h2>
              <p>
                We investigate how guidance, environments and continuity can
                help people understand more deeply, create with purpose and
                direct their own learning.
              </p>
            </div>
          </div>
          <div className="questions">
            <article>
              <span className="topic">AGENCY &amp; INTELLIGENCE</span>
              <h3>When does guidance strengthen our own judgment?</h3>
              <p>
                What distinguishes support that helps someone think from
                assistance that takes over the thinking?
              </p>
              <Link href="#work">
                See the questions in practice <span aria-hidden="true">↗</span>
              </Link>
            </article>
            <article>
              <span className="topic">ENVIRONMENTS &amp; EXPERIENCE</span>
              <h3>How can our surroundings support deeper learning?</h3>
              <p>
                Explore how places, people and tools can invite attention,
                inquiry, practice and creation.
              </p>
              <Link href="#experience">
                Explore a learning example <span aria-hidden="true">↗</span>
              </Link>
            </article>
            <article>
              <span className="topic">CONTINUITY &amp; OWNERSHIP</span>
              <h3>How can learning travel with a person?</h3>
              <p>
                Connect questions, explanations and evidence across experiences,
                relationships and institutions.
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
            <summary>Explore the learning model</summary>
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
                What we’re building <br /> and investigating.
              </h2>
              <p>
                Explore the current projects, what exists today and the
                questions that remain open.
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
                  A prototype exploring how learners can keep control of their
                  questions, records and developing understanding.
                </p>
                <details>
                  <summary>Examine the work</summary>
                  <dl>
                    <dt>Question</dt>
                    <dd>
                      What helps a person return to an inquiry with
                      understanding they can use?
                    </dd>
                    <dt>What exists today</dt>
                    <dd>
                      The current learner prototype supports recording an
                      inquiry, returning to it in the same browser and exporting
                      notes. It is separate from the illustrative examples on
                      this website.
                    </dd>
                    <dt>Open questions</dt>
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
                    <dt>What exists today</dt>
                    <dd>
                      A six-week learning design and a related eight-stop
                      creator prototype. These are design artifacts, not a
                      completed field study.
                    </dd>
                    <dt>Open questions</dt>
                    <dd>
                      Field usability, learner outcomes, facilitation needs and
                      transfer to other places.
                    </dd>
                  </dl>
                  <p>
                    A small coastal learning pilot is being considered for
                    summer 2027. Its setting, participants and delivery plan
                    remain to be decided.
                  </p>
                </details>
                <Link href="/work/first-landing">
                  Explore First Landing <span aria-hidden="true">↗</span>
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
                <h3>Learning Environments</h3>
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
                    <dt>What exists today</dt>
                    <dd>
                      An initial design brief exploring spaces for focus,
                      inquiry, making and reflection.
                    </dd>
                    <dt>Open questions</dt>
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
              <strong>Built, tested, learned.</strong> We distinguish what has
              been built from what has been tested—and what remains unknown.
            </p>
            <div>
              <Link href="/releases/owll-at-a-glance">
                Read OWLL at a Glance ↗
              </Link>
              <p className="artifact-caption">
                Concept brief · July 28, 2026 · An earlier direction, preserved
                as the work evolves.
              </p>
              <Link href="/releases">All public releases →</Link>
            </div>
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
                Keep building on <br /> what you’ve learned.
              </h2>
              <p className="large-copy">
                LOCUS is being developed to help learners connect what they
                notice, investigate and create—and use that history to decide
                what to pursue next.
              </p>
              <p>
                Structured Journeys offer a designed starting point. Open
                Explore begins with a question of your own. Both can include
                guidance, practice and a record you can return to.
              </p>
              <Link className="text-action" href="/work/locus">
                Explore LOCUS ↗
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
                <span className="eyebrow">Your learning thread</span>
                <strong>Question · evidence · understanding</strong>
                <p>With people, practice and reflection along the way.</p>
              </div>
              <div className="thread-return">
                <span aria-hidden="true">↳</span> Return, recall, revise{" "}
                <span aria-hidden="true">↗</span>
              </div>
              <p className="plate-caption">
                Design model · A record becomes useful through explanation,
                feedback and return. Capturing an experience alone does not
                establish understanding.
              </p>
            </div>
          </div>
          <div className="shell locus-bottom">
            <p>
              Learner control is a design commitment: you should be able to
              inspect, correct, export and decide how to share your learning
              record.
            </p>
            <details>
              <summary>What could intelligence add?</summary>
              <p>
                The longer-term question is how a system could help you notice
                connections, revisit unfinished questions and choose useful next
                steps. These capabilities need design and testing; they are not
                a description of the current prototype.
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
              From Tahoe <br /> to a wider question.
            </h2>
          </div>
          <div>
            <p className="large-copy">
              OWLL began with a possibility in Tahoe. What if the mountain,
              lake, trail and community could form a connected learning
              environment?
            </p>
            <p>
              The original idea explored how wearable technology could connect
              an experience to questions, knowledge and human guidance. The
              ambition has grown beyond a single place or device.
            </p>
            <p>
              Founded by Peter Pielaet-Strayer, OWLL is developing toward an
              independent research and design institute. Over time, its work
              could grow into new tools, learning environments and independent
              ventures.
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
          <p className="eyebrow">Principles that guide the work</p>
          <h2 id="guardrails-title">Learning with agency and care.</h2>
          <details className="principles-detail">
            <summary>Read the principles</summary>
            <div className="questions">
              {" "}
              {guardrails.map((principle) => (
                <article key={principle.title}>
                  <h3>{principle.title}</h3>
                  <p>{principle.description}</p>
                </article>
              ))}{" "}
            </div>
          </details>{" "}
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
                <span>EXPLORE THE WORK</span>
                <strong>Examine the work</strong>
                <p>Explore a question, prototype or emerging direction.</p>
                <b aria-hidden="true">↗</b>
              </Link>
              <Link href="/contact">
                <span>COLLABORATE</span>
                <strong>Start a conversation</strong>
                <p>
                  Have a place, question or project worth exploring together?
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
