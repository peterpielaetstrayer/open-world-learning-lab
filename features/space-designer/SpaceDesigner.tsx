"use client";

import { useEffect, useMemo, useState, type ChangeEvent, type ReactNode } from "react";
import Link from "next/link";
import {
  audienceName,
  blueprintMarkdown,
  budgetName,
  formatUSD,
  makeConcepts,
  priorityName,
  proposedBudget,
  roomArea,
  startingBrief,
  technologyName,
  type Audience,
  type Brief,
  type Budget,
  type Light,
  type Priority,
  type Technology,
} from "./design-engine";
import styles from "./SpaceDesigner.module.css";

const stages = [
  { label: "The learner", note: "Who is this for?" },
  { label: "The space", note: "What can we work with?" },
  { label: "Your priorities", note: "What should it support?" },
  { label: "Design directions", note: "Explore possibilities" },
  { label: "Blueprint", note: "Take the next step" },
] as const;

function Choice<T extends string>({
  value,
  current,
  title,
  description,
  onChoose,
}: {
  value: T;
  current: T;
  title: string;
  description?: string;
  onChoose: (value: T) => void;
}) {
  return (
    <label className={
      "flex min-h-20 cursor-pointer items-start gap-3 rounded-xl border px-4 py-4 transition-colors " +
      (current === value
        ? "border-water bg-water/8 shadow-[inset_0_0_0_1px_rgba(47,102,114,.18)]"
        : "border-border bg-white/50 hover:border-water/50")
    }>
      <input
        type="radio"
        name={["family", "teen", "adult"].includes(current) ? "audience" : ["create", "research", "explore"].includes(current) ? "priority" : ["minimal", "balanced", "immersive"].includes(current) ? "technology" : "budget"}
        checked={current === value}
        onChange={() => onChoose(value)}
        className="mt-1 h-4 w-4 shrink-0 accent-[#2f6672]"
      />
      <span>
        <span className="block text-sm font-semibold leading-snug text-ink">{title}</span>
        {description && <span className="mt-1 block text-xs leading-relaxed text-secondary">{description}</span>}
      </span>
    </label>
  );
}

function Field({ children, label, id, hint }: {
  children: ReactNode;
  label: string;
  id: string;
  hint?: string;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-semibold text-ink">{label}</label>
      {children}
      {hint && <p className="text-xs leading-relaxed text-quiet">{hint}</p>}
    </div>
  );
}

const fieldClasses = "w-full min-h-12 rounded-lg border border-border-strong bg-white/80 px-4 py-3 text-sm text-ink placeholder:text-quiet/70 focus:border-water focus:outline-none focus:ring-2 focus:ring-water/15";
const buttonPrimary = "inline-flex min-h-12 items-center justify-center rounded-full bg-deep-field px-6 py-3 text-sm font-semibold text-on-dark transition-colors hover:bg-water disabled:cursor-not-allowed disabled:opacity-40";
const buttonSecondary = "inline-flex min-h-12 items-center justify-center rounded-full border border-border-strong bg-white/65 px-5 py-3 text-sm font-medium text-ink hover:border-water/50";

function ZoneDiagram({ zones, measured }: {
  zones: { name: string; purpose: string }[];
  measured: string;
}) {
  return (
    <div className={styles.diagram} role="img" aria-label={"Illustrative, not-to-scale room diagram showing: " + zones.map((z) => z.name).join(", ")}>
      <div className={styles.diagramTop}>
        <span>CONCEPTUAL ZONING / NOT TO SCALE</span>
        <span>{measured}</span>
      </div>
      <div className={styles.diagramGrid} aria-hidden="true">
        {zones.map((zone, index) => (
          <div key={zone.name} className={styles.zone}>
            <span className={styles.zoneIndex}>0{index + 1}</span>
            <strong>{zone.name}</strong>
            <span>{zone.purpose}</span>
          </div>
        ))}
      </div>
      <div className={styles.diagramFoot}>
        <span>Circulation, openings, and equipment placement require measurement.</span>
        <span>OWLL / 001</span>
      </div>
    </div>
  );
}

export default function SpaceDesigner() {
  const [stage, setStage] = useState(0);
  const [furthestStage, setFurthestStage] = useState(0);
  const [brief, setBrief] = useState<Brief>({ ...startingBrief });
  const [selected, setSelected] = useState(0);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string>("");
  const [photoError, setPhotoError] = useState("");
  const concepts = useMemo(() => makeConcepts(brief), [brief]);
  const budget = useMemo(() => proposedBudget(brief), [brief]);
  const area = roomArea(brief);
  const activeConcept = concepts[selected] ?? concepts[0];

  useEffect(() => {
    return () => {
      if (photoUrl) URL.revokeObjectURL(photoUrl);
    };
  }, [photoUrl]);

  function update<K extends keyof Brief>(key: K, value: Brief[K]) {
    setBrief((current) => ({ ...current, [key]: value }));
  }

  function goTo(index: number) {
    if (index < 0 || index > 4 || index > furthestStage) return;
    setStage(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function next() {
    const newStage = Math.min(stage + 1, 4);
    setStage(newStage);
    setFurthestStage((old) => Math.max(old, newStage));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function back() {
    setStage((old) => Math.max(0, old - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function reset() {
    setBrief({ ...startingBrief });
    setSelected(0);
    setPhotoUrl(null);
    setPhotoName("");
    setPhotoError("");
    setStage(0);
    setFurthestStage(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function choosePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    event.target.value = "";
    if (!file.type.startsWith("image/")) {
      setPhotoError("Choose an image file (JPG, PNG, HEIC if your browser supports it, etc.).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setPhotoError("Choose a photo under 10 MB. It stays in your browser.");
      return;
    }
    setPhotoUrl(URL.createObjectURL(file));
    setPhotoName(file.name);
    setPhotoError("");
  }

  function download() {
    const markdown = blueprintMarkdown(brief, activeConcept);
    const url = URL.createObjectURL(new Blob([markdown], { type: "text/markdown;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "OWLL-Learning-Blueprint-v0.1.md";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const dims = area !== null
    ? (Number(brief.roomWidth) + " × " + Number(brief.roomLength) + " ft · " + area.toFixed(0) + " sq ft")
    : "Measurements pending";

  return (
    <div className={styles.root}>
      <section className={styles.hero} data-print-hide="true">
        <div className="mx-auto max-w-[1320px] px-5 pb-9 pt-12 sm:px-6 lg:px-8 lg:pb-12">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link href="/learning-environments" className="text-sm text-on-dark/65 transition-colors hover:text-on-dark">← Learning Environments</Link>
            <span className="rounded-full border border-on-dark/20 px-3 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.17em] text-on-dark/75">Lab prototype / v0.1</span>
          </div>
          <p className="mt-9 font-mono text-xs uppercase tracking-[0.23em] text-on-dark/55">OWLL / Design exploration</p>
          <h1 className="mt-4 max-w-3xl font-serif text-[clamp(2.65rem,5.2vw,5.1rem)] leading-[1.08] tracking-tight">
            Design a space for <em className="font-normal text-[#d2c4a1]">how you learn.</em>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-on-dark/70 sm:text-lg">
            Start with a person, not a product. Explore a more intentional environment for thinking, making, and growing.
          </p>
          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-xs text-on-dark/60">
            <span>✧ Rule-based concept generator</span>
            <span>✧ No accounts or payments</span>
            <span>✧ Photos stay in your browser</span>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1320px] px-5 pb-20 pt-8 sm:px-6 lg:px-8 lg:pt-12">
        <div className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-sediment/20 bg-[#f9eee0] px-4 py-3 text-xs leading-relaxed text-secondary" data-print-hide="true">
          <p><strong>Research prototype:</strong> Suggestions are simulated from your choices, not AI-generated, spatially verified, or available to purchase. No information is submitted to a server.</p>
        </div>

        <div className={styles.workspace}>
          <aside className={styles.sidebar} data-print-hide="true" aria-label="Design progress">
            <div className="rounded-2xl border border-border bg-white/55 p-5">
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-quiet">Your design journey</p>
              <ol className="mt-5 space-y-1">
                {stages.map((item, index) => {
                  const available = index <= furthestStage;
                  const current = stage === index;
                  return (
                    <li key={item.label}>
                      <button type="button" disabled={!available} onClick={() => goTo(index)}
                        aria-current={current ? "step" : undefined}
                        className={
                          "flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors " +
                          (current ? "bg-deep-field text-on-dark" : available ? "text-secondary hover:bg-soft-paper" : "cursor-not-allowed text-quiet/55")
                        }>
                        <span className={"flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-mono text-xs " + (current ? "border-on-dark/40" : "border-border-strong")}>
                          {index < furthestStage ? "✓" : "0" + (index + 1)}
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-medium">{item.label}</span>
                          <span className={"block text-[0.68rem] " + (current ? "text-on-dark/65" : "text-quiet")}>{item.note}</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
              <div className="mt-5 border-t border-border pt-4">
                <p className="font-mono text-[0.65rem] uppercase tracking-wider text-quiet">Working draft</p>
                <p className="mt-2 text-sm font-medium">{priorityName[brief.priority]}</p>
                <p className="mt-1 text-xs text-secondary">{dims}</p>
                <p className="mt-1 text-xs text-secondary">{budgetName[brief.budget]}</p>
              </div>
            </div>
            <button type="button" onClick={reset} className="mt-4 px-3 text-xs text-quiet underline underline-offset-4 hover:text-ink">Reset this exploration</button>
          </aside>

          <div className="min-w-0">
            <div className="mb-6 flex items-center justify-between gap-3 lg:hidden" data-print-hide="true">
              <span className="font-mono text-xs text-water">STEP {stage + 1} / 05</span>
              <span className="text-xs text-secondary">{stages[stage].label}</span>
              <button type="button" onClick={reset} className="text-xs text-water underline underline-offset-4">Reset</button>
            </div>
            <div className={styles.panel}>
              {stage === 0 && (
                <section aria-labelledby="learner-heading" className={styles.panelContent}>
                  <p className={styles.eyebrow}>01 / Starting with the learner</p>
                  <h2 id="learner-heading" className={styles.heading}>Who is this space for?</h2>
                  <p className={styles.intro}>A meaningful environment begins with curiosity, habits, and the work someone wants to do, rather than the furniture they want to buy.</p>
                  <fieldset className="mt-8">
                    <legend className={styles.legend}>Select the primary learner</legend>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <Choice<Audience> value="family" current={brief.audience} title="A child or family" description="Shared curiosity and growth" onChoose={(v) => update("audience", v)} />
                      <Choice<Audience> value="teen" current={brief.audience} title="A teen" description="Agency, passions, projects" onChoose={(v) => update("audience", v)} />
                      <Choice<Audience> value="adult" current={brief.audience} title="An adult learner" description="Focus, creation, research" onChoose={(v) => update("audience", v)} />
                    </div>
                  </fieldset>
                  <div className="mt-7 grid gap-5 sm:grid-cols-2">
                    <Field id="learner-name" label="Learner or project name" hint="Optional. A nickname is fine; avoid sensitive personal information.">
                      <input id="learner-name" value={brief.learner} onChange={(e) => update("learner", e.target.value)} maxLength={80} placeholder="e.g., My learning headquarters" className={fieldClasses}/>
                    </Field>
                    <Field id="learner-challenge" label="What's currently getting in the way?">
                      <input id="learner-challenge" value={brief.challenge} onChange={(e) => update("challenge", e.target.value)} maxLength={250} placeholder="e.g., Distractions, lack of work space" className={fieldClasses}/>
                    </Field>
                  </div>
                  <div className="mt-5">
                    <Field id="learner-interests" label="What are they curious about?" hint="Subjects, hobbies, questions, or projects.">
                      <textarea id="learner-interests" rows={3} value={brief.interests} onChange={(e) => update("interests", e.target.value)} maxLength={700} placeholder="e.g., Robotics, science, writing, AI, art..." className={fieldClasses + " resize-y"}/>
                    </Field>
                  </div>
                </section>
              )}

              {stage === 1 && (
                <section aria-labelledby="room-heading" className={styles.panelContent}>
                  <p className={styles.eyebrow}>02 / The existing environment</p>
                  <h2 id="room-heading" className={styles.heading}>Every space has possibilities.</h2>
                  <p className={styles.intro}>A photograph can help start a conversation. Real planning requires measurements and a human review of the room&apos;s constraints.</p>
                  <div className="mt-8 grid gap-6 md:grid-cols-2">
                    <div>
                      <p className={styles.legend}>Room photograph <span className="font-normal text-quiet">(optional)</span></p>
                      <div className={styles.photoBox}>
                        {photoUrl ? (
                          <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={photoUrl} alt="Local preview of selected room photograph" className={styles.photoPreview}/>
                            <span className={styles.photoCaption}>{photoName}</span>
                          </>
                        ) : (
                          <div className="px-5 text-center">
                            <span aria-hidden="true" className="text-4xl text-moss">⌑</span>
                            <p className="mt-3 font-serif text-xl text-ink">Picture the possibilities.</p>
                            <p className="mt-2 text-xs text-quiet">A window, a wall, a corner. Start wherever you are.</p>
                          </div>
                        )}
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        <label className={buttonSecondary + " cursor-pointer"}>
                          {photoUrl ? "Replace photo" : "Choose a photo"}
                          <input type="file" accept="image/*" className="sr-only" onChange={choosePhoto} aria-label="Choose a room photograph"/>
                        </label>
                        {photoUrl && <button type="button" className="text-xs text-secondary underline" onClick={() => {setPhotoUrl(null); setPhotoName("");}}>Remove</button>}
                      </div>
                      {photoError && <p role="alert" className="mt-2 text-xs text-red-700">{photoError}</p>}
                      <p className="mt-3 text-xs leading-relaxed text-quiet">Image preview stays in this browser tab, is not analyzed, and is not included in the blueprint. Max 10 MB.</p>
                    </div>
                    <div className="space-y-5">
                      <div className="grid grid-cols-2 gap-3">
                        <Field id="room-width" label="Room width (ft)">
                          <input id="room-width" type="number" min="1" max="100" step="0.5" inputMode="decimal" value={brief.roomWidth} onChange={(e) => update("roomWidth", e.target.value)} placeholder="12" className={fieldClasses}/>
                        </Field>
                        <Field id="room-length" label="Room length (ft)">
                          <input id="room-length" type="number" min="1" max="100" step="0.5" inputMode="decimal" value={brief.roomLength} onChange={(e) => update("roomLength", e.target.value)} placeholder="14" className={fieldClasses}/>
                        </Field>
                      </div>
                      <div className="rounded-lg bg-soft-paper px-4 py-3 text-sm text-secondary" aria-live="polite">{area ? "Approximate floor area: " + area.toFixed(1) + " square feet." : "Add dimensions to estimate floor area. We won't infer measurements from an image."}</div>
                      <Field id="room-light" label="Daylight conditions">
                        <select id="room-light" value={brief.light} onChange={(e) => update("light", e.target.value as Light)} className={fieldClasses}>
                          <option value="bright">Bright / plenty of daylight</option>
                          <option value="mixed">Mixed / adjustable</option>
                          <option value="dim">Dim / limited daylight</option>
                        </select>
                      </Field>
                      <Field id="room-existing" label="What do you already own?">
                        <textarea id="room-existing" rows={2} maxLength={400} value={brief.existing} onChange={(e) => update("existing", e.target.value)} placeholder="Desk, shelving, projector, books..." className={fieldClasses + " resize-y"}/>
                      </Field>
                      <Field id="room-notes" label="Room constraints" hint="Windows, doors, outlets, rental restrictions, accessibility needs (without personal medical details), or immovable furniture.">
                        <textarea id="room-notes" rows={3} maxLength={600} value={brief.roomNotes} onChange={(e) => update("roomNotes", e.target.value)} placeholder="e.g., Rented room, cannot drill into the wall" className={fieldClasses + " resize-y"}/>
                      </Field>
                    </div>
                  </div>
                </section>
              )}

              {stage === 2 && (
                <section aria-labelledby="priority-heading" className={styles.panelContent}>
                  <p className={styles.eyebrow}>03 / Your design priorities</p>
                  <h2 id="priority-heading" className={styles.heading}>What should the room make easier?</h2>
                  <p className={styles.intro}>The most important design choices follow the learning activities. Technology is a supporting tool, not the goal.</p>
                  <fieldset className="mt-8">
                    <legend className={styles.legend}>Primary purpose</legend>
                    <div className="grid gap-3">
                      <Choice<Priority> value="create" current={brief.priority} title="Making and completing projects" description="Building, composing, coding, prototyping, finishing" onChoose={(v) => {update("priority", v);setSelected(0);}}/>
                      <Choice<Priority> value="research" current={brief.priority} title="Deep study and research" description="Reading, mapping ideas, focused work, synthesis" onChoose={(v) => {update("priority", v);setSelected(0);}}/>
                      <Choice<Priority> value="explore" current={brief.priority} title="Exploration and curiosity" description="Following questions, experimenting, discovering interests" onChoose={(v) => {update("priority", v);setSelected(0);}}/>
                    </div>
                  </fieldset>
                  <fieldset className="mt-8">
                    <legend className={styles.legend}>Role of technology</legend>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <Choice<Technology> value="minimal" current={brief.technology} title="Analog-first" description="Tools support attention quietly" onChoose={(v) => update("technology", v)}/>
                      <Choice<Technology> value="balanced" current={brief.technology} title="Balanced" description="Physical and digital together" onChoose={(v) => update("technology", v)}/>
                      <Choice<Technology> value="immersive" current={brief.technology} title="Display-forward" description="Visual research and large surfaces" onChoose={(v) => update("technology", v)}/>
                    </div>
                  </fieldset>
                  <fieldset className="mt-8">
                    <legend className={styles.legend}>Overall planning budget</legend>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {(["under5", "5to10", "10to20", "over20"] as Budget[]).map((v) => (
                        <Choice<Budget> key={v} value={v} current={brief.budget} title={budgetName[v]} onChoose={(choice) => update("budget", choice)}/>
                      ))}
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-quiet">This is a planning band, not an offer or a price quote.</p>
                  </fieldset>
                  <div className="mt-7">
                    <Field id="priority-notes" label="Anything else the space should support?" hint="Optional: flexibility, social learning, sensory comfort, family routines, or long-term ambitions.">
                      <textarea id="priority-notes" rows={3} maxLength={700} value={brief.notes} onChange={(e) => update("notes", e.target.value)} placeholder="I want a space that can evolve as projects change..." className={fieldClasses + " resize-y"}/>
                    </Field>
                  </div>
                </section>
              )}

              {stage === 3 && (
                <section aria-labelledby="concept-heading" className={styles.panelContent}>
                  <p className={styles.eyebrow}>04 / Exploring possibilities</p>
                  <h2 id="concept-heading" className={styles.heading}>Three directions. Your space.</h2>
                  <p className={styles.intro}>Concepts are generated from a transparent template library, with your preferred focus shown first. They are not AI imagery, measured floor plans, or verified layouts.</p>
                  <div className="mt-7 grid gap-3 sm:grid-cols-3" role="group" aria-label="Choose a design direction">
                    {concepts.map((concept, index) => (
                      <button key={concept.id} type="button" aria-pressed={selected === index} onClick={() => setSelected(index)}
                        className={
                          "rounded-xl border p-4 text-left transition-colors " +
                          (selected === index ? "border-water bg-water/8 shadow-[inset_0_0_0_1px_rgba(47,102,114,.18)]" : "border-border bg-white/50 hover:border-water/40")
                        }>
                        <span className="font-mono text-[0.65rem] tracking-wider text-quiet">0{index + 1} / CONCEPT</span>
                        <span className="mt-2 block font-serif text-xl leading-tight">{concept.name}</span>
                        <span className="mt-2 block text-xs text-secondary">{concept.tagline}</span>
                        <span className="mt-4 block text-xs font-semibold text-water">{selected === index ? "● Selected direction" : "View direction →"}</span>
                      </button>
                    ))}
                  </div>
                  <div className="mt-8 grid gap-6 xl:grid-cols-[1.07fr_.93fr]">
                    <ZoneDiagram zones={activeConcept.zones} measured={dims}/>
                    <div>
                      <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-water">Concept narrative</p>
                      <h3 className="mt-3 font-serif text-3xl">{activeConcept.name}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-secondary">{activeConcept.summary}</p>
                      <h4 className="mt-6 text-sm font-semibold text-ink">Suggested features</h4>
                      <ul className="mt-3 space-y-3">
                        {activeConcept.features.map((feature) => (
                          <li key={feature} className="flex gap-3 text-sm leading-relaxed text-secondary">
                            <span className="mt-0.5 text-water" aria-hidden="true">✧</span>{feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="mt-6 rounded-lg border border-sediment/20 bg-[#f8eee4] px-5 py-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-sediment">Design tradeoff</p>
                    <p className="mt-2 text-sm leading-relaxed text-secondary">{activeConcept.tradeoff}</p>
                  </div>
                </section>
              )}

              {stage === 4 && (
                <section aria-labelledby="blueprint-heading" className={styles.panelContent}>
                  <div className={styles.printHeading}>
                    <p className={styles.eyebrow}>OWLL / Exploratory blueprint 001</p>
                    <h2 id="blueprint-heading" className={styles.heading}>Your learning blueprint.</h2>
                    <p className={styles.intro}>A first design hypothesis, ready to refine through measurements, research, and real-world testing.</p>
                  </div>
                  <div className="mt-7 flex flex-wrap gap-3" data-print-hide="true">
                    <button type="button" className={buttonPrimary} onClick={download}>↓ Download blueprint (.md)</button>
                    <button type="button" className={buttonSecondary} onClick={() => window.print()}>Print / Save as PDF</button>
                  </div>
                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    <div className={styles.summaryCard}>
                      <p className={styles.eyebrow}>Learner / intention</p>
                      <h3 className="mt-2 font-serif text-2xl">{brief.learner.trim() || audienceName[brief.audience]}</h3>
                      <p className="mt-3 text-sm text-secondary">{priorityName[brief.priority]}</p>
                      <p className="mt-1 text-sm text-secondary">{technologyName[brief.technology]}</p>
                    </div>
                    <div className={styles.summaryCard}>
                      <p className={styles.eyebrow}>Environment / constraints</p>
                      <h3 className="mt-2 font-serif text-2xl">{dims}</h3>
                      <p className="mt-3 text-sm text-secondary">Lighting: {brief.light}</p>
                      <p className="mt-1 text-sm text-secondary">Planning band: {budgetName[brief.budget]}</p>
                    </div>
                  </div>
                  <h3 className="mt-9 font-serif text-3xl">{activeConcept.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-secondary">{activeConcept.summary}</p>
                  <div className="mt-6">
                    <ZoneDiagram zones={activeConcept.zones} measured={dims}/>
                  </div>
                  <div className="mt-8 grid gap-7 md:grid-cols-2">
                    <div>
                      <h4 className={styles.legend}>Design features</h4>
                      <ul className="mt-4 space-y-3 text-sm leading-relaxed text-secondary">
                        {activeConcept.features.map((feature) => <li key={feature}>• {feature}</li>)}
                      </ul>
                      <h4 className="mt-7 text-sm font-semibold">Learning intention</h4>
                      <p className="mt-2 text-sm leading-relaxed text-secondary">{brief.interests || "Not yet specified"}</p>
                      <h4 className="mt-5 text-sm font-semibold">Known constraints</h4>
                      <p className="mt-2 text-sm leading-relaxed text-secondary">{brief.roomNotes || "Not yet specified"}</p>
                    </div>
                    <div>
                      <h4 className={styles.legend}>Illustrative budget allocation</h4>
                      <p className="mt-2 font-serif text-3xl">{formatUSD(budget.total)}</p>
                      <p className="mt-1 text-xs leading-relaxed text-quiet">A placeholder allocation within your chosen budget band. Not a quote.</p>
                      <dl className="mt-4 divide-y divide-border">
                        {budget.lines.map((line) => (
                          <div key={line.name} className="flex justify-between gap-3 py-2 text-xs">
                            <dt className="text-secondary">{line.name}</dt><dd className="font-semibold tabular-nums">{formatUSD(line.amount)}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  </div>
                  <div className="mt-9 rounded-xl bg-soft-paper p-6">
                    <h4 className="font-serif text-xl">Before building anything</h4>
                    <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-secondary">
                      <li>Validate measurements, windows, outlets, clearances, and mounting restrictions.</li>
                      <li>Test learning routines with current furniture and tools first.</li>
                      <li>Check accessible layouts, wiring safety, child safety where applicable, and installation requirements.</li>
                      <li>Get actual product prices and qualified professional advice before purchasing or installing.</li>
                    </ol>
                  </div>
                  <p className="mt-7 text-xs leading-relaxed text-quiet">
                    Exploratory research artifact only. Not architectural, electrical, educational, financial, or installation advice. No guaranteed outcomes. Suggestions are rule-based, not AI-generated.
                  </p>
                </section>
              )}

              <div className={styles.panelFooter} data-print-hide="true">
                {stage > 0 ? (
                  <button type="button" className={buttonSecondary} onClick={back}>← Previous</button>
                ) : <span className="text-xs text-quiet">Your exploration is private to this browser tab.</span>}
                {stage < 4 ? (
                  <button type="button" className={buttonPrimary} onClick={next}>
                    {stage === 2 ? "Explore design directions →" : stage === 3 ? "Create blueprint →" : "Continue →"}
                  </button>
                ) : (
                  <button type="button" className={buttonSecondary} onClick={() => goTo(3)}>← Compare concepts</button>
                )}
              </div>
            </div>
            <p className="mt-5 text-center text-xs leading-relaxed text-quiet" data-print-hide="true">
              OWLL is researching personalized learning environments. This prototype neither stores submissions nor analyzes photographs and is not a commercial offering.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
