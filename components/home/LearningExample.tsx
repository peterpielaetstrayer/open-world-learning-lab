"use client";

import { useState } from "react";
import Link from "next/link";
import { learningExamples } from "@/content/learning-examples";

export default function LearningExample() {
  const [context, setContext] =
    useState<keyof typeof learningExamples>("mountain");
  const example = learningExamples[context];
  return (
    <section
      id="experience"
      className="experience-section"
      aria-labelledby="experience-title"
    >
      <div className="shell">
        <div className="experience-heading">
          <div>
            <p className="eyebrow">
              <span className="index">02</span> A small window into the
              possibility
            </p>
            <h2 id="experience-title">Everywhere, a way in.</h2>
          </div>
          <p>
            A mountain. A shoreline. A moment at home.
            <br />
            Follow an observation into a question of your own.
          </p>
        </div>
        <div className="example-layout">
          <div className="example-context">
            <div
              className="context-controls"
              role="group"
              aria-label="Choose an illustrative learning context"
            >
              <button
                type="button"
                onClick={() => setContext("mountain")}
                aria-pressed={context === "mountain"}
              >
                Mountain
              </button>
              <button
                type="button"
                onClick={() => setContext("shoreline")}
                aria-pressed={context === "shoreline"}
              >
                Shoreline
              </button>
              <button
                type="button"
                onClick={() => setContext("everyday")}
                aria-pressed={context === "everyday"}
              >
                Everyday
              </button>
            </div>
            <div className="scene" aria-hidden="true">
              <svg viewBox="0 0 600 340" focusable="false">
                <g
                  style={{
                    display: context === "mountain" ? undefined : "none",
                  }}
                >
                  <path
                    d="M0 238L135 45L217 172L329 25L600 290V340H0Z"
                    fill="#aebcaa"
                  />
                  <path
                    d="M95 103L135 45L177 110L145 93L128 108Z M275 101L329 25L397 108L347 85L323 102L303 85Z"
                    fill="#f2efe6"
                  />
                  <path
                    d="M0 284L133 174L266 278L437 141L600 265V340H0Z"
                    fill="#6c8775"
                  />
                  <path
                    d="M0 318Q170 258 340 315T600 285V340H0Z"
                    fill="#385d55"
                  />
                  <path
                    d="M212 207Q289 107 378 191"
                    stroke="#f2efe6"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="5 8"
                  />
                  <circle cx="285" cy="156" r="8" fill="#d1a24f" />
                  <path d="M285 156L353 92H440" stroke="#17201d" fill="none" />
                </g>
                <g
                  style={{
                    display: context === "shoreline" ? undefined : "none",
                  }}
                >
                  <path
                    d="M0 105Q125 172 270 118T600 150V340H0Z"
                    fill="#9bb6b1"
                  />
                  <path
                    d="M0 176Q145 244 315 169T600 207V340H0Z"
                    fill="#2f6672"
                  />
                  <path
                    d="M0 238Q164 320 337 229T600 267M0 273Q164 345 337 262T600 300"
                    fill="none"
                    stroke="#cbd9d1"
                    strokeWidth="2"
                  />
                  <path
                    d="M0 155Q147 220 300 151T600 183"
                    fill="none"
                    stroke="#9b6848"
                    strokeDasharray="4 6"
                    strokeWidth="3"
                  />
                  <circle cx="280" cy="157" r="8" fill="#d1a24f" />
                  <path d="M280 157L347 81H450" fill="none" stroke="#17201d" />
                </g>
                <g
                  style={{
                    display: context === "everyday" ? undefined : "none",
                  }}
                >
                  <path
                    d="M90 30V240H330V30Z"
                    fill="#ccd4bd"
                    stroke="#526b50"
                  />
                  <path
                    d="M210 30V240M90 130H330"
                    stroke="#526b50"
                    strokeWidth="5"
                  />
                  <path d="M0 270H600V340H0Z" fill="#b8ad95" />
                  <path d="M270 270L440 318H565L380 270Z" fill="#667b69" />
                  <path d="M310 270V166" stroke="#526b50" strokeWidth="5" />
                  <path
                    d="M310 212Q245 185 259 156Q317 158 310 212M313 188Q372 181 360 144Q306 146 313 188"
                    fill="#526b50"
                  />
                  <path d="M278 239H345L334 278H290Z" fill="#9b6848" />
                  <circle cx="446" cy="306" r="7" fill="#d1a24f" />
                </g>
              </svg>
              <span className="scene-number">
                LEARNING EXAMPLE <span id="scene-number">{example.number}</span>
              </span>
            </div>
            <p className="sample-label">
              ILLUSTRATIVE SCENARIO · EXPLORE THE APPROACH
            </p>
            <h3 id="context-title">{example.title}</h3>
            <p id="context-intro">{example.intro}</p>
            <p className="origin-note">
              The Tahoe origin imagined a whole place as a learning environment.
              Phones, cameras and future wearable interfaces could help connect
              experience and reflection.
            </p>
          </div>
          <div className="inquiry" aria-live="polite" aria-atomic="true">
            <p className="eyebrow">An inquiry can unfold like this</p>
            <ol>
              <li>
                <span className="step-no">01</span>
                <div>
                  <h4>Notice</h4>
                  <p id="notice">{example.notice}</p>
                </div>
              </li>
              <li>
                <span className="step-no">02</span>
                <div>
                  <h4>Ask</h4>
                  <p id="ask">{example.ask}</p>
                </div>
              </li>
              <li>
                <span className="step-no">03</span>
                <div>
                  <h4>Investigate &amp; explain</h4>
                  <p id="investigate">{example.investigate}</p>
                </div>
              </li>
              <li>
                <span className="step-no">04</span>
                <div>
                  <h4>Return</h4>
                  <p id="return">{example.return}</p>
                </div>
              </li>
            </ol>
            <div className="knowledge-link">
              <span>KNOWLEDGE CONNECTION</span>
              <p id="concepts">{example.concepts}</p>
            </div>
            <p className="example-boundary">
              These examples illustrate a design approach. Choose safe
              observations appropriate to your setting and support needs.
            </p>
          </div>
        </div>
        <div className="try-strip">
          <div>
            <strong>Start with something around you.</strong>
            <p>The published ten-minute inquiry is available now.</p>
          </div>
          <Link className="button light" href="/start">
            Try the field inquiry <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
