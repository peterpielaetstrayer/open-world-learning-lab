"use client";

import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import Link from "next/link";
import {
  exportBlueprint, initialBrief, makeGuidedPlan, positiveArea,
  type DesignConcept, type StudioBrief, type StudioPlan,
} from "./model";
import styles from "./Studio.module.css";

type AIStatus = { analysis: boolean; rendering: boolean; mode: string };
type Panel = "person" | "room" | "priorities";
type ImageMap = Partial<Record<"A" | "B", string>>;

function Heading({ tag, title, description }: { tag: string; title: string; description?: string }) {
  return <div className={styles.fieldHeading}>
    <span className={styles.kicker}>{tag}</span>
    <h2>{title}</h2>
    {description && <p>{description}</p>}
  </div>;
}
function TextField({ label, value, onChange, placeholder, multiline = false }: {
  label: string; value: string; onChange: (value: string) => void; placeholder?: string; multiline?: boolean;
}) {
  return <label className={styles.field}>
    <span>{label}</span>
    {multiline
      ? <textarea value={value} onChange={e => onChange(e.target.value.slice(0, 900))} rows={3} placeholder={placeholder} />
      : <input value={value} onChange={e => onChange(e.target.value.slice(0, 900))} placeholder={placeholder} />}
  </label>;
}
function RadioSet<T extends string>({ label, value, options, onChange }: {
  label: string; value: T; options: { value: T; label: string }[]; onChange: (value: T) => void;
}) {
  return <fieldset className={styles.fieldset}>
    <legend>{label}</legend>
    <div className={styles.pills}>
      {options.map(opt => <label key={opt.value} className={styles.pill} data-active={value === opt.value}>
        <input type="radio" name={label} checked={value === opt.value} onChange={() => onChange(opt.value)} />
        {opt.label}
      </label>)}
    </div>
  </fieldset>;
}

async function compressPhoto(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw Error("Choose an image file.");
  if (file.size > 12 * 1024 * 1024) throw Error("Choose a photo smaller than 12 MB.");
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1400 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) { bitmap.close(); throw Error("This browser cannot prepare the photo."); }
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const url = canvas.toDataURL("image/jpeg", 0.72);
  if (url.length > 2_800_000) throw Error("Photo is too large after resizing. Try a smaller image.");
  return url;
}

const panelList: { value: Panel; title: string; sub: string }[] = [
  { value: "person", title: "The learner", sub: "Interests and ambitions" },
  { value: "room", title: "The existing room", sub: "Photo and constraints" },
  { value: "priorities", title: "Design direction", sub: "How the room should work" },
];

export default function Studio() {
  const [brief, setBrief] = useState<StudioBrief>(initialBrief);
  const [panel, setPanel] = useState<Panel>("person");
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState("");
  const [consent, setConsent] = useState(false);
  const [aiStatus, setAiStatus] = useState<AIStatus>({ analysis: false, rendering: false, mode: "research-preview" });
  const [aiPlan, setAiPlan] = useState<StudioPlan | null>(null);
  const [active, setActive] = useState<"A" | "B">("A");
  const [images, setImages] = useState<ImageMap>({});
  const [showAfter, setShowAfter] = useState(true);
  const [feedbackDraft, setFeedbackDraft] = useState("");
  const [busy, setBusy] = useState<"analysis" | "render" | null>(null);
  const [message, setMessage] = useState("");
  const [usedRenders, setUsedRenders] = useState(0);

  useEffect(() => {
    let open = true;
    fetch("/api/space-designer-v02/status", { cache: "no-store" })
      .then(r => r.json()).then(s => { if (open) setAiStatus({
        analysis: s.analysis === true, rendering: s.rendering === true, mode: "research-preview",
      }); })
      .catch(() => { if (open) setMessage("Couldn't check AI configuration. Guided design still works."); });
    return () => { open = false; };
  }, []);

  const guidedPlan = useMemo(() => makeGuidedPlan(brief, Boolean(photo)), [brief, photo]);
  const plan = aiPlan ?? guidedPlan;
  const concept: DesignConcept = plan.concepts.find(c => c.id === active) ?? plan.concepts[0];
  const area = positiveArea(brief);
  const rendered = images[concept.id];
  const showRender = showAfter && Boolean(rendered);

  function update<K extends keyof StudioBrief>(key: K, value: StudioBrief[K]) {
    setBrief(current => ({ ...current, [key]: value }));
    setAiPlan(null);
    setImages({});
    setMessage("");
  }
  function updateDimensions(key: "width" | "length", value: string) {
    setBrief(current => ({ ...current, dimensions: { ...current.dimensions, [key]: value.slice(0, 12) } }));
    setAiPlan(null);
    setImages({});
  }
  async function onPhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setMessage("");
    try {
      const data = await compressPhoto(file);
      setPhoto(data);
      setPhotoName(file.name);
      setConsent(false);
      setAiPlan(null);
      setImages({});
      setPanel("room");
      setMessage("Photo prepared locally. No photo has been sent to a server.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not read this image.");
    }
  }
  async function analyze(nextBrief: StudioBrief = brief) {
    if (!consent) { setMessage("Please check the AI-processing consent box first."); return; }
    if (!aiStatus.analysis) { setMessage("AI analysis is not enabled in this preview. The guided concepts remain available."); return; }
    setBusy("analysis"); setMessage("");
    try {
      const response = await fetch("/api/space-designer-v02/analyze", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brief: nextBrief, photo, consent: true }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Analysis could not be completed.");
      if (!Array.isArray(payload.concepts) || payload.concepts.length !== 2 || payload.source !== "ai") throw Error("Invalid AI design response.");
      setAiPlan(payload as StudioPlan);
      setImages({});
      setActive("A");
      setMessage("AI created two design directions. Review the uncertainties before selecting a concept.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Analysis failed. Your guided draft is unchanged.");
    } finally { setBusy(null); }
  }
  async function renderConcept() {
    if (!photo) { setMessage("Add a photo of your real room to create a room transformation."); setPanel("room"); return; }
    if (!consent) { setMessage("Please check AI-processing consent first."); return; }
    if (!aiStatus.rendering) { setMessage("AI rendering is not enabled in this preview. The room concept plan remains usable."); return; }
    if (usedRenders >= 3) { setMessage("This browser session has reached its three-render budget."); return; }
    setBusy("render"); setMessage("");
    try {
      const res = await fetch("/api/space-designer-v02/render", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photo, consent: true, brief, renderPrompt: concept.renderPrompt, revision: brief.feedback }),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || "Image rendering failed.");
      if (typeof payload.image !== "string" || !payload.image.startsWith("data:image/jpeg;base64,")) throw Error("Invalid image response.");
      setImages(old => ({ ...old, [concept.id]: payload.image }));
      setUsedRenders(n => n + 1);
      setShowAfter(true);
      setMessage("Concept image generated. It is illustrative and not dimensionally accurate.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not generate an image.");
    } finally { setBusy(null); }
  }
  function applyFeedback() {
    if (!feedbackDraft.trim()) return;
    const next = { ...brief, feedback: feedbackDraft.trim().slice(0, 650) };
    setBrief(next);
    setAiPlan(null);
    setImages({});
    setFeedbackDraft("");
    setMessage("Your revision is now incorporated into the guided design. Use AI analysis to regenerate reasoning, or render the updated concept if enabled.");
  }
  function downloadBlueprint() {
    const text = exportBlueprint(brief, plan, concept);
    const file = new Blob([text], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url; a.download = "OWLL-Space-Designer-v02-Blueprint.md";
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }
  function downloadImage() {
    if (!rendered) return;
    const a = document.createElement("a");
    a.href = rendered; a.download = "OWLL-room-concept-" + concept.id + ".jpg";
    document.body.append(a); a.click(); a.remove();
  }

  return <div className={styles.app}>
    <header className={styles.topbar} data-print-hide="true">
      <Link href="/" className={styles.wordmark}>OWLL <span>/ LAB</span></Link>
      <nav className={styles.topnav} aria-label="Studio navigation">
        <Link href="/learning-environments">Learning Environments</Link>
        <Link href="/lab/space-designer">v0.1 archive</Link>
        <span className={styles.private}><span aria-hidden="true">◈</span> Research preview</span>
      </nav>
    </header>

    <section className={styles.masthead}>
      <div>
        <span className={styles.eyebrow}>FIELD NOTE 002 / INTERACTIVE RESEARCH TOOL</span>
        <h1>Space Designer <em>Studio.</em></h1>
        <p>What if your surroundings were designed around how you learn, not just how you live?</p>
      </div>
      <div className={styles.statusCapsule}>
        <span className={styles.dot} data-ready={aiStatus.analysis}/>
        <strong>{aiStatus.analysis ? "AI analysis available" : "Guided concept mode"}</strong>
        <small>{aiStatus.rendering ? "AI photo transformations enabled" : "AI image editing not yet configured"}</small>
      </div>
    </section>

    <main className={styles.shell}>
      <aside className={styles.rail} data-print-hide="true">
        <div className={styles.railLabel}>DESIGN INTAKE / 01—03</div>
        <div className={styles.railSteps}>
          {panelList.map((item,i) => (
            <button type="button" key={item.value} onClick={() => setPanel(item.value)}
              className={styles.step} aria-current={panel === item.value ? "step" : undefined}
              data-selected={panel === item.value}>
              <span className={styles.stepNumber}>0{i+1}</span>
              <span><strong>{item.title}</strong><small>{item.sub}</small></span>
              <span className={styles.stepArrow}>↗</span>
            </button>
          ))}
        </div>

        <div className={styles.intake}>
          {panel === "person" && <>
            <Heading tag="LEARNER PROFILE" title="Begin with a person." description="What should be easier to explore, practice, create, or finish?" />
            <RadioSet label="Who will use this space?" value={brief.audience} options={[
              { value: "adult", label: "Adult" }, { value: "teen", label: "Teen" }, { value: "family", label: "Family" },
            ]} onChange={v => update("audience", v)}/>
            <TextField label="What do you want to learn or create?" value={brief.goals} multiline
              placeholder="e.g., Research, writing, robotics, art, or a lifelong learning studio..."
              onChange={v => update("goals", v)}/>
            <TextField label="What currently gets in the way?" value={brief.obstacles} multiline
              placeholder="e.g., No dedicated workspace, clutter, too many open projects..."
              onChange={v => update("obstacles", v)}/>
            <button className={styles.next} onClick={() => setPanel("room")}>Continue to your room <span>→</span></button>
          </>}

          {panel === "room" && <>
            <Heading tag="SPATIAL PROFILE" title="Begin with what exists." description="A real photo is a starting point, not a measured floor plan."/>
            <label className={styles.upload}>
              <span className={styles.uploadIcon}>⌗</span>
              <strong>{photo ? "Replace room photograph" : "Choose room photograph"}</strong>
              <small>{photo ? photoName : "Resized locally • JPG/PNG and supported phone images • 12 MB max"}</small>
              <input type="file" accept="image/*" onChange={onPhoto}/>
            </label>
            {photo && <button className={styles.textButton} onClick={() => {setPhoto(null); setPhotoName("");setConsent(false);setImages({});setAiPlan(null);}}>Remove photo</button>}
            <div className={styles.dimensions}>
              <TextField label="Width · feet" value={brief.dimensions.width} placeholder="12" onChange={v => updateDimensions("width",v)}/>
              <TextField label="Length · feet" value={brief.dimensions.length} placeholder="14" onChange={v => updateDimensions("length",v)}/>
            </div>
            <div className={styles.measureNote}>{area ? "Approximate floor area: " + area + " sq ft" : "Add both dimensions to calculate approximate area."}</div>
            <label className={styles.field}><span>Daylight</span>
              <select value={brief.lighting} onChange={e => update("lighting",e.target.value as StudioBrief["lighting"])}>
                <option value="bright">Bright / mostly daylight</option>
                <option value="mixed">Mixed / adjustable</option>
                <option value="dim">Limited daylight</option>
              </select>
            </label>
            <TextField label="What must stay?" value={brief.keep} onChange={v => update("keep",v)} placeholder="Existing desk, shelves, white wall..."/>
            <TextField label="Constraints and openings" value={brief.roomConstraints} onChange={v => update("roomConstraints",v)} multiline
              placeholder="Door location, windows, outlets, rental rules, mobility access..."/>
            <button className={styles.next} onClick={() => setPanel("priorities")}>Choose design priorities <span>→</span></button>
          </>}

          {panel === "priorities" && <>
            <Heading tag="LEARNING DESIGN" title="Decide what matters." description="Different learning activities should create genuinely different spatial decisions." />
            <RadioSet label="Primary learning mode" value={brief.focus} options={[
              { value: "research", label: "Study" }, { value: "making", label: "Make" }, { value: "exploration", label: "Explore" },
            ]} onChange={v => update("focus",v)}/>
            <RadioSet label="Technology relationship" value={brief.technology} options={[
              { value: "quiet", label: "Analog-first" }, { value: "balanced", label: "Balanced" }, { value: "immersive", label: "Display-forward" },
            ]} onChange={v => update("technology",v)}/>
            <label className={styles.field}><span>Budget planning band</span>
              <select value={brief.budget} onChange={e => update("budget",e.target.value)}>
                <option>Under $5,000</option>
                <option>$5,000–$10,000</option>
                <option>$10,000–$20,000</option>
                <option>$20,000+</option>
              </select>
            </label>
            <p className={styles.explainer}>This band is not an estimate, quote, or commitment to purchase equipment.</p>
          </>}
        </div>
        <div className={styles.privacyConsent}>
          <label>
            <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)}/>
            <span>I own or have permission to share the room image and consent to sending my room photo and design answers to the configured AI provider <strong>only when I click an AI action.</strong> I understand concept images may alter room geometry.</span>
          </label>
          <p>Without an AI action, photos and draft answers stay in this browser tab. AI processing is optional.</p>
        </div>
      </aside>

      <section className={styles.workspace}>
        <div className={styles.workspaceHead}>
          <div>
            <span className={styles.eyebrow}>LIVE CONCEPT WORKSPACE</span>
            <h2>Your room, reimagined.</h2>
            <p>Explore meaningful alternatives, then move toward a buildable brief.</p>
          </div>
          <span className={styles.version}>CONCEPT / NOT TO SCALE</span>
        </div>

        <div className={styles.conceptTabs} role="tablist" aria-label="Learning environment design directions">
          {plan.concepts.map(c => (
            <button type="button" role="tab" aria-selected={active === c.id} key={c.id} onClick={() => setActive(c.id)}
              data-active={active === c.id}>
              <span className={styles.conceptNo}>0{c.id === "A" ? "1" : "2"} /</span>
              <span><strong>{c.name}</strong><small>{c.subtitle}</small></span>
            </button>
          ))}
        </div>

        <div className={styles.stage}>
          <div className={styles.stageMeta}>
            <span>{photo ? (showRender ? "AI CONCEPT RENDER / EDITED PHOTO" : "ORIGINAL ROOM / LOCAL PHOTO") : "CONCEPT STUDY / ABSTRACT ZONING"}</span>
            <span>{area ? area + " SQ FT · USER MEASURED" : "MEASUREMENTS PENDING"}</span>
          </div>
          <div className={styles.stageArt}>
            {photo ? <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className={styles.roomPhoto} src={showRender ? rendered : photo} alt={showRender ? "AI concept edit of the uploaded room; illustrative only" : "Original room photograph uploaded locally"}/>
              {rendered && <div className={styles.beforeAfter} data-print-hide="true">
                <button aria-pressed={!showAfter} onClick={() => setShowAfter(false)} data-active={!showAfter}>Original</button>
                <button aria-pressed={showAfter} onClick={() => setShowAfter(true)} data-active={showAfter}>Concept</button>
              </div>}
            </> : <div className={styles.abstractRoom}>
              <div className={styles.abstractWindow}><span>DAYLIGHT</span></div>
              <div className={styles.diagram}>
                {concept.zones.map((z,i) => <div className={styles.diagramZone} key={z.name}>
                  <small>{String(i+1).padStart(2,"0")}</small><strong>{z.name}</strong><span>{z.purpose}</span>
                </div>)}
              </div>
              <div className={styles.abstractLabel}>A space for {brief.focus === "research" ? "clear thinking" : brief.focus === "making" ? "creative practice" : "curious exploration"}.</div>
            </div>}
            <div className={styles.artBottom}><span>OWLL · LEARNING ENVIRONMENT RESEARCH</span><span>{photo ? (rendered ? "ILLUSTRATIVE / UNVERIFIED" : "SOURCE PHOTO") : "SPATIAL DIAGRAM / UNVERIFIED"}</span></div>
          </div>
          <div className={styles.stageActions} data-print-hide="true">
            <button disabled={Boolean(busy) || !aiStatus.rendering || !photo || !consent || usedRenders >= 3}
              onClick={renderConcept} className={styles.renderBtn}>
              {busy === "render" ? "Rendering concept…" : rendered ? "Regenerate this concept" : "✧ Render this room concept"}
            </button>
            {rendered && <button className={styles.ghostBtn} onClick={downloadImage}>↓ Save image</button>}
            <span className={styles.costNote}>{!aiStatus.rendering ? "AI rendering not configured" : !photo ? "Room photo required" : "Up to three images per browser session; provider charges apply"}</span>
          </div>
        </div>

        <div className={styles.contentGrid}>
          <div className={styles.designCard}>
            <div className={styles.cardHeading}><span className={styles.eyebrow}>THE DESIGN RATIONALE</span><span>{plan.source === "ai" ? "AI ASSISTED" : "GUIDED TEMPLATE"}</span></div>
            <h3>{concept.name}</h3>
            <p>{concept.rationale}</p>
            <div className={styles.zoneList}>
              {concept.zones.map((zone,i) => <div key={i}>
                <span className={styles.zoneIndex}>{String(i+1).padStart(2,"0")}</span>
                <div><strong>{zone.name}</strong><small>{zone.purpose}</small><p>{zone.reason}</p></div>
              </div>)}
            </div>
          </div>
          <div className={styles.insightStack}>
            <div className={styles.insightCard}>
              <span className={styles.eyebrow}>WHY THIS COULD WORK</span>
              <ul>{concept.features.map((f,i) => <li key={i}><span>✳</span>{f}</li>)}</ul>
            </div>
            <div className={styles.insightCard}>
              <span className={styles.eyebrow}>DESIGN TRADEOFFS</span>
              <ul>{concept.tradeoffs.map((f,i) => <li key={i}><span>↗</span>{f}</li>)}</ul>
            </div>
            <div className={styles.insightCard}>
              <span className={styles.eyebrow}>WHAT WE STILL DON'T KNOW</span>
              <ul>{plan.uncertain.slice(0,3).map((f,i) => <li key={i}><span>?</span>{f}</li>)}</ul>
            </div>
          </div>
        </div>

        <div className={styles.assistant}>
          <div className={styles.assistantTitle}><span className={styles.aiMark}>✧</span><div><strong>Design with OWLL</strong><small>Review, inquire, refine</small></div></div>
          <div className={styles.assistantBody}>
            <p className={styles.assistantHello}>Your goals inform the arrangement, not just the aesthetic. Choose a question or describe a change you want to explore.</p>
            <div className={styles.questions}>
              {plan.questions.slice(0,3).map((q,i) => <button key={i} onClick={() => setFeedbackDraft(q)}>{q} ↗</button>)}
            </div>
            <label htmlFor="revision" className={styles.revisionLabel}>What would you change about the space?</label>
            <div className={styles.revision}>
              <textarea id="revision" rows={2} value={feedbackDraft} onChange={e => setFeedbackDraft(e.target.value.slice(0,650))}
                placeholder="Keep my existing desk, create more wall space for research, and add a flexible maker area..."/>
              <button onClick={applyFeedback} disabled={!feedbackDraft.trim() || Boolean(busy)}>Apply revision →</button>
            </div>
            {brief.feedback && <div className={styles.lastRevision}>Current revision: {brief.feedback}</div>}
            <div className={styles.assistantFooter}>
              <button className={styles.aiAnalyze} disabled={Boolean(busy) || !aiStatus.analysis || !consent} onClick={() => analyze()}>
                {busy === "analysis" ? "Analyzing room and learner…" : "✧ Ask AI to analyze & redesign"}
              </button>
              <span>{aiStatus.analysis ? (consent ? "AI will process submitted inputs after you click" : "Consent required before AI processing")
                : "Configure preview AI credentials to enable real analysis. Guided concepts already work."}</span>
            </div>
            {message && <p className={styles.message} role="status" aria-live="polite">{message}</p>}
          </div>
        </div>

        <div className={styles.blueprint}>
          <div>
            <span className={styles.eyebrow}>THE DELIVERABLE</span>
            <h2>A Learning Environment Blueprint</h2>
            <p>Save the learner's intention, room constraints, two design alternatives, uncertainties, and next planning steps. This is a concept brief, not an installation quote.</p>
          </div>
          <div className={styles.blueprintActions}>
            <button onClick={downloadBlueprint}>↓ Download blueprint</button>
            <button onClick={() => window.print()}>Print / PDF ↗</button>
          </div>
        </div>
        <div className={styles.footerNote}>OWLL / Space Designer Studio v0.2 · Research prototype only. AI-generated concepts are illustrative and may change geometry. No purchase, contractor, or learning-outcome guarantees.</div>
      </section>
    </main>
  </div>;
}
