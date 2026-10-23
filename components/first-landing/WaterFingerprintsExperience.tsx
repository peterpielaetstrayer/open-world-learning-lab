"use client";

import { useState } from "react";
import Link from "next/link";

type ClueId = "line" | "ridges" | "grass";
type Stage = 0 | 1 | 2 | 3;
const clues = [
  {
    id: "line" as ClueId,
    number: "01",
    title: "A line of shells",
    label: "A strand above the water",
    x: "44%", y: "76%",
    question: "Why might shells and plant fragments collect in a narrow band above the wet sand?",
    scene: "A band of shells and plant material lies farther inland than the water in this illustration.",
    comparison: "A strand line can mark material carried or redistributed by water, but the image alone does not establish when the line formed. Wind, storm conditions, and human activity may also matter.",
    nextTest: "Photograph or sketch a second, safe vantage point, compare the band with the present shoreline, and check local tide and weather records.",
  },
  {
    id: "ridges" as ClueId,
    number: "02",
    title: "Patterns in the sand",
    label: "Small, repeated ridges",
    x: "70%", y: "82%",
    question: "What could have formed these repeated ridges, and what would help you tell?",
    scene: "Narrow ridges run across an exposed sandy surface in this illustration.",
    comparison: "Moving water and moving air can both create ripples. Their shape alone may not identify the cause. Grain size, orientation, wetness, surrounding conditions, and observations over time could help.",
    nextTest: "Compare nearby wet and dry patches without disturbing habitat; record ridge direction and consider wind and water movement.",
  },
  {
    id: "grass" as ClueId,
    number: "03",
    title: "Grass at the dune edge",
    label: "Plants behind a sand rise",
    x: "85%", y: "73%",
    question: "How might vegetation and moving sediment change one another over time?",
    scene: "Small grasses are shown growing along a raised, sandy edge.",
    comparison: "Coastal vegetation can slow moving sand and help trap sediment, while burial, storms, salt, and human disturbance can affect the plants. One illustration cannot reconstruct that history.",
    nextTest: "Observe changes across existing access routes without walking on dunes, and compare trustworthy descriptions of dune vegetation over time.",
  },
] as const;

const possibleClaims = [
  "Moving water carried or rearranged material.",
  "Wind moved or sorted the sand and debris.",
  "Living things or human activity affected the pattern.",
  "Several processes may contribute; I cannot tell yet.",
] as const;
const confidenceLevels = ["Low", "Medium", "High"] as const;
const steps = ["Notice", "Interpret", "Check evidence", "Recall"] as const;

export default function WaterFingerprintsExperience() {
  const [clueId, setClueId] = useState<ClueId>("line");
  const [stage, setStage] = useState<Stage>(0);
  const [furthest, setFurthest] = useState<Stage>(0);
  const [observation, setObservation] = useState("");
  const [claim, setClaim] = useState("");
  const [alternative, setAlternative] = useState("");
  const [initialConfidence, setInitialConfidence] = useState("Low");
  const [evidenceNote, setEvidenceNote] = useState("");
  const [revisedConfidence, setRevisedConfidence] = useState("Unchanged");
  const [recall, setRecall] = useState("");
  const [showNotes, setShowNotes] = useState(false);
  const clue = clues.find((item) => item.id === clueId) ?? clues[0];

  function moveTo(value: Stage) {
    setStage(value);
    if (value > furthest) setFurthest(value);
  }

  function selectClue(nextId: ClueId) {
    if (clueId === nextId) return;
    setClueId(nextId);
    setObservation("");
    setClaim("");
    setAlternative("");
    setInitialConfidence("Low");
    setEvidenceNote("");
    setRevisedConfidence("Unchanged");
    setRecall("");
    setShowNotes(false);
    setStage(0);
    setFurthest(0);
  }

  function exportNotes() {
    const lines = [
      "OPEN WORLD LEARNING LAB / FIRST LANDING",
      "WATER FINGERPRINTS — PERSONAL INQUIRY RECORD",
      "Illustrative composite scenario, not actual observations recorded at First Landing",
      "",
      "Clue: " + clue.title,
      "Scene: " + clue.scene,
      "Your observation: " + (observation || "(left blank)"),
      "Your initial explanation: " + (claim || "(left blank)"),
      "Alternative considered: " + (alternative || "(left blank)"),
      "Initial confidence: " + initialConfidence,
      "Comparison offered: " + clue.comparison,
      "Your evidence response: " + (evidenceNote || "(left blank)"),
      "Confidence revision: " + revisedConfidence,
      "Your retrieval explanation: " + (recall || "(left blank)"),
      "Next possible test: " + clue.nextTest,
      "",
      "A single illustrated pattern cannot prove its cause. Seek firsthand observations and reliable sources.",
    ];
    const url = URL.createObjectURL(new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "owll-water-fingerprints-field-note.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#c1cbbd] bg-[#f6f4ed] shadow-[0_18px_64px_rgba(15,43,31,.08)]">
      <header className="bg-[#123229] px-5 py-7 text-[#f3f1e5] sm:px-10 sm:py-9 lg:px-12">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#a8beaa]/30 pb-4 font-mono text-[11px] uppercase tracking-[.16em] text-[#c8d8ca]">
          <span>Field investigation / Water Fingerprints</span><span>Study plate 01 · Illustrative</span>
        </div>
        <div className="mt-7 grid gap-6 md:grid-cols-[1fr_270px] md:items-end">
          <div>
            <h2 className="font-serif text-[clamp(2.8rem,5.2vw,5.6rem)] font-normal leading-[.98] tracking-[-.045em]">
              What does the water <em className="text-[#d8c28d]">leave behind?</em>
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#e1e9dc]">
              Look for a clue. Make a tentative explanation. Compare it with another possibility. Then try to explain it again from memory.
            </p>
          </div>
          <div className="border-l-2 border-[#d8c28d] pl-5 text-sm leading-relaxed text-[#c8d8ca]">
            <span className="block font-mono text-[10px] uppercase tracking-widest text-[#d8c28d]">Learning architecture</span>
            <span className="mt-2 block">Attend → Capture → Interpret → Check → Retrieve</span>
            <span className="mt-2 block text-xs">A working website inquiry, separate from the LOCUS application.</span>
          </div>
        </div>
      </header>

      <div className="relative isolate overflow-hidden bg-[#9dbbbb]">
        <div className="relative aspect-[5/4] min-h-[290px] w-full sm:aspect-[16/8] sm:min-h-[360px]">
          <svg aria-hidden="true" viewBox="0 0 1200 630" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
            <defs>
              <linearGradient id="fp-sky" x2="0" y2="1">
                <stop offset="0%" stopColor="#a8c5bc" />
                <stop offset="69%" stopColor="#d9d6b7" />
                <stop offset="100%" stopColor="#e5d4ae" />
              </linearGradient>
              <linearGradient id="fp-water" x2="0" y2="1">
                <stop offset="0%" stopColor="#639296" />
                <stop offset="100%" stopColor="#295b66" />
              </linearGradient>
              <linearGradient id="fp-beach" x2="0" y2="1">
                <stop offset="0%" stopColor="#e1d7b6" />
                <stop offset="100%" stopColor="#bda985" />
              </linearGradient>
              <linearGradient id="fp-dune" x2="0" y2="1">
                <stop offset="0%" stopColor="#c6b692" />
                <stop offset="100%" stopColor="#9b9974" />
              </linearGradient>
              <pattern id="fp-grain" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="5" cy="7" r="1" fill="#806e55" opacity=".16" />
                <circle cx="19" cy="16" r=".7" fill="#6c6554" opacity=".13" />
              </pattern>
            </defs>
            <rect width="1200" height="630" fill="url(#fp-sky)" />
            <path d="M0 182 C160 153 320 185 492 160 S845 175 1200 156 V260 H0Z" fill="#93aaa1" opacity=".48"/>
            <path d="M0 223 C207 209 313 220 492 212 S878 229 1200 203 V422 H0Z" fill="url(#fp-water)"/>
            {Array.from({length: 18}, (_,i) => (
              <path key={i} d={"M"+(i*91-150)+" "+(258+i%4*27)+" q 120 -9 260 0"} stroke="#d8e2cf" strokeWidth={i%4===0?2:1} opacity=".24" fill="none"/>
            ))}
            <path d="M0 354 C226 385 346 342 555 380 S930 435 1200 354 L1200 630 H0Z" fill="url(#fp-beach)"/>
            <path d="M0 354 C226 385 346 342 555 380 S930 435 1200 354" fill="none" stroke="#eef1d5" strokeWidth="11" opacity=".77"/>
            <path d="M0 392 C190 421 362 378 553 422 S930 475 1200 398" fill="none" stroke="#f0e0bc" strokeWidth="3" opacity=".75"/>
            <path d="M0 470 C255 443 381 490 587 482 S942 494 1200 448" fill="none" stroke="#927d65" strokeWidth="7" strokeDasharray="3 13" strokeLinecap="round" opacity=".75"/>
            <path d="M0 483 C255 457 381 503 587 494 S942 505 1200 463" fill="none" stroke="#eee1c5" strokeWidth="2" opacity=".9"/>
            <path d="M0 560 Q260 483 490 552 T990 552 T1280 504" fill="none" stroke="#8e8069" strokeWidth="2" opacity=".4"/>
            <path d="M0 584 Q260 506 490 575 T990 574 T1280 523" fill="none" stroke="#8e8069" strokeWidth="2" opacity=".4"/>
            <path d="M660 630 C776 556 791 426 921 355 S1103 380 1200 317 V630Z" fill="url(#fp-dune)"/>
            <path d="M660 630 C776 556 791 426 921 355 S1103 380 1200 317" fill="none" stroke="#d8ccaa" strokeWidth="4" opacity=".8"/>
            <path d="M0 354 C226 385 346 342 555 380 S930 435 1200 354 V630 H0Z" fill="url(#fp-grain)" opacity=".8"/>
            {Array.from({length: 16},(_,i)=>{
              const x=880+(i*37)%320, y=395+(i%4)*24;
              return <g key={i} opacity=".7" stroke="#3e6254" strokeWidth="3" strokeLinecap="round" fill="none">
                <path d={"M"+x+" "+(y+55)+" q -10 -30 -7 -58"}/>
                <path d={"M"+x+" "+(y+55)+" q 14 -30 20 -52"}/>
                <path d={"M"+x+" "+(y+55)+" q -24 -16 -31 -22"}/>
              </g>;
            })}
            <g fill="none" stroke="#90765b" opacity=".75">
              <ellipse cx="412" cy="466" rx="8" ry="3" transform="rotate(-24 412 466)"/>
              <ellipse cx="468" cy="473" rx="5" ry="2" transform="rotate(23 468 473)"/>
              <ellipse cx="520" cy="481" rx="8" ry="3"/>
              <ellipse cx="615" cy="492" rx="5" ry="3"/>
            </g>
          </svg>
          <div className="absolute left-4 top-4 z-10 rounded-md border border-[#e5e5d2]/40 bg-[#102620]/85 px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-[#f2efe6] sm:left-7 sm:top-6">
            Chesapeake Bay / Conceptual cross-section
          </div>
          <div className="absolute bottom-4 left-4 z-10 max-w-[55%] text-[10px] leading-relaxed text-[#123229] sm:bottom-6 sm:left-7 sm:max-w-xs">
            Stylized composite, not a photograph, site map, elevation survey, or record of field measurements.
          </div>
          {clues.map((item) => (
            <button
              key={item.id}
              type="button"
              disabled={stage !== 0}
              aria-pressed={clueId===item.id}
              aria-label={"Select clue: " + item.title}
              onClick={()=>selectClue(item.id)}
              style={{left:item.x,top:item.y}}
              className={"absolute z-20 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[3px] shadow-[0_6px_18px_rgba(0,0,0,.25)] transition-transform focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-[#123229] disabled:cursor-default sm:size-12 " +
                (clueId===item.id?"scale-110 border-[#ead9a7] bg-[#15382f] text-white":"border-[#f5f0d8] bg-[#f6f0d6] text-[#123229] hover:scale-110")}
            >
              <span className="font-mono text-xs font-semibold">{item.number}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid border-b border-[#ced3c6] bg-[#e7e4d7] sm:grid-cols-3">
        {clues.map((item)=>(
          <button key={item.id} type="button" disabled={stage!==0}
            onClick={()=>selectClue(item.id)} aria-pressed={clueId===item.id}
            className={"min-h-16 border-b border-[#cdd2c3] p-4 text-left focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#2f6672] sm:border-b-0 sm:border-r disabled:cursor-default " +
              (clueId===item.id?"bg-[#f6f4ed] text-[#123229]":"text-[#47594e] hover:bg-[#f1eee2]")}>
            <span className="font-mono text-[10px] uppercase tracking-widest">{item.number} / Observation lens</span>
            <span className="mt-1 block font-serif text-lg">{item.title}</span>
          </button>
        ))}
      </div>

      <div className="px-5 py-7 sm:px-10 sm:py-10 lg:px-12">
        <nav aria-label="Inquiry stages" className="grid grid-cols-4 gap-2">
          {steps.map((label,index)=>(
            <button key={label} type="button" disabled={index>furthest} onClick={()=>moveTo(index as Stage)}
              aria-current={stage===index?"step":undefined}
              className={"min-h-14 border-t-[3px] pt-3 text-left text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-water " +
                (stage===index?"border-[#2f6672] font-semibold text-[#17201d]":index<=furthest?"border-[#7d9382] text-[#526355] hover:text-[#17201d]":"border-[#cbd0c6] text-[#69776a] disabled:cursor-not-allowed")}>
              <span className="mb-1 block font-mono text-[10px]">0{index+1}</span>{label}
            </button>
          ))}
        </nav>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,.72fr)] lg:gap-14">
          <div className="min-w-0" key={stage}>
            {stage===0&&<>
              <p className="font-mono text-xs uppercase tracking-widest text-[#2f6672]">Encounter / Notice before explaining</p>
              <h3 className="mt-3 font-serif text-[clamp(1.9rem,3vw,2.9rem)] leading-tight text-[#17201d]">{clue.title}</h3>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#45564d]">{clue.scene}</p>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#526355]">Choose any clue. Describe a feature, position, color, shape, or relationship you can actually see. You may also think or speak your answer instead of typing.</p>
              <label htmlFor="fp-observation" className="mt-7 block text-sm font-semibold text-[#17201d]">What do you notice in this illustration?</label>
              <textarea id="fp-observation" value={observation} rows={4} maxLength={2000} onChange={e=>setObservation(e.target.value)}
                placeholder="I notice a narrow band of material above the current shoreline…"
                className="mt-3 block w-full rounded-xl border border-[#9dac9d] bg-white/80 p-4 text-base text-[#17201d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f6672]" />
              <button onClick={()=>moveTo(1)} className="mt-6 inline-flex min-h-12 items-center rounded-full bg-[#123229] px-6 py-3 text-sm font-semibold text-white hover:bg-[#2a564a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2f6672]">
                Move to explanations <span aria-hidden="true" className="ml-3">→</span>
              </button>
            </>}

            {stage===1&&<>
              <p className="font-mono text-xs uppercase tracking-widest text-[#2f6672]">Interpret / Hold more than one possibility</p>
              <h3 className="mt-3 font-serif text-[clamp(1.9rem,3vw,2.9rem)] leading-tight text-[#17201d]">{clue.question}</h3>
              <fieldset className="mt-7">
                <legend className="text-sm font-semibold text-[#17201d]">Which explanation seems most plausible to you right now?</legend>
                <div className="mt-3 space-y-2">
                  {possibleClaims.map((option)=>(
                    <label key={option} className={"flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm leading-relaxed " +
                      (claim===option?"border-[#2f6672] bg-[#e7eee7] text-[#17201d]":"border-[#ccd3c6] bg-white/50 text-[#45564d]")}>
                      <input className="mt-1 size-4 accent-[#2f6672]" type="radio" name="first-claim" checked={claim===option} onChange={()=>setClaim(option)}/>
                      {option}
                    </label>
                  ))}
                </div>
              </fieldset>
              <label htmlFor="fp-alternative" className="mt-6 block text-sm font-semibold text-[#17201d]">What is one alternative explanation you should not ignore?</label>
              <textarea id="fp-alternative" rows={3} value={alternative} onChange={e=>setAlternative(e.target.value)} maxLength={1800}
                placeholder="An alternative is… The scene alone cannot rule it out because…"
                className="mt-3 block w-full rounded-xl border border-[#9dac9d] bg-white/80 p-4 text-base text-[#17201d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f6672]" />
              <fieldset className="mt-6">
                <legend className="text-sm font-semibold text-[#17201d]">How confident are you in this first interpretation?</legend>
                <div className="mt-3 flex flex-wrap gap-3">
                  {confidenceLevels.map((level)=>(
                    <label key={level} className={"cursor-pointer rounded-full border px-4 py-2 text-sm " +(initialConfidence===level?"border-[#2f6672] bg-[#dce8dc]":"border-[#a9b6a6]")}>
                      <input type="radio" name="fp-confidence" value={level} checked={initialConfidence===level} onChange={()=>setInitialConfidence(level)} className="mr-2 accent-[#2f6672]"/>{level}
                    </label>
                  ))}
                </div>
              </fieldset>
              <button disabled={!claim} onClick={()=>moveTo(2)}
                className="mt-7 inline-flex min-h-12 items-center rounded-full bg-[#123229] px-6 py-3 text-sm font-semibold text-white hover:bg-[#2a564a] disabled:cursor-not-allowed disabled:opacity-45">
                Compare evidence <span aria-hidden="true" className="ml-3">→</span>
              </button>
            </>}

            {stage===2&&<>
              <p className="font-mono text-xs uppercase tracking-widest text-[#2f6672]">Evidence / Revise, do not simply confirm</p>
              <h3 className="mt-3 font-serif text-[clamp(1.9rem,3vw,2.9rem)] leading-tight text-[#17201d]">A second look changes the question.</h3>
              <div className="mt-6 border-l-[3px] border-[#b39259] bg-[#ece7d7] px-5 py-5">
                <p className="font-mono text-[11px] uppercase tracking-widest text-[#735e34]">Interpretive evidence card / Not a field measurement</p>
                <p className="mt-3 text-base leading-relaxed text-[#293b31]">{clue.comparison}</p>
              </div>
              <p className="mt-6 text-sm leading-relaxed text-[#45564d]">Compare this information with your first explanation. A plausible cause is not the same as proof of that cause.</p>
              <label htmlFor="fp-evidence" className="mt-6 block text-sm font-semibold text-[#17201d]">What does this evidence support, and what remains unresolved?</label>
              <textarea id="fp-evidence" rows={4} value={evidenceNote} onChange={e=>setEvidenceNote(e.target.value)} maxLength={2000}
                placeholder="The pattern is consistent with… but another possible cause is…"
                className="mt-3 block w-full rounded-xl border border-[#9dac9d] bg-white/80 p-4 text-base text-[#17201d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f6672]" />
              <fieldset className="mt-6">
                <legend className="text-sm font-semibold text-[#17201d]">After comparing, how would you revise your confidence?</legend>
                <div className="mt-3 flex flex-wrap gap-3">
                  {["Lower","Unchanged","Higher"].map(level=>(
                    <label key={level} className={"cursor-pointer rounded-full border px-4 py-2 text-sm " +(revisedConfidence===level?"border-[#2f6672] bg-[#dce8dc]":"border-[#a9b6a6]")}>
                      <input type="radio" name="fp-revised-confidence" checked={revisedConfidence===level} onChange={()=>setRevisedConfidence(level)} className="mr-2 accent-[#2f6672]"/>{level}
                    </label>
                  ))}
                </div>
              </fieldset>
              <button onClick={()=>{setShowNotes(false);moveTo(3);}}
                className="mt-7 inline-flex min-h-12 items-center rounded-full bg-[#123229] px-6 py-3 text-sm font-semibold text-white hover:bg-[#2a564a]">
                Explain from memory <span aria-hidden="true" className="ml-3">→</span>
              </button>
            </>}

            {stage===3&&<>
              <p className="font-mono text-xs uppercase tracking-widest text-[#2f6672]">Return / Retrieval before rereading</p>
              <h3 className="mt-3 font-serif text-[clamp(1.9rem,3vw,2.9rem)] leading-tight text-[#17201d]">What do you understand now?</h3>
              <p className="mt-4 text-sm leading-relaxed text-[#45564d]">Without looking back at your earlier answers, try to reconstruct your explanation. What was your clue? What might have caused it? What would you test next?</p>
              <label htmlFor="fp-recall" className="mt-7 block text-sm font-semibold text-[#17201d]">Reconstruct your explanation before you look back</label>
              <textarea id="fp-recall" rows={5} value={recall} onChange={e=>setRecall(e.target.value)} maxLength={2500}
                placeholder="What I remember… A possible cause… Another explanation… What I would check…"
                className="mt-3 block w-full rounded-xl border border-[#9dac9d] bg-white/80 p-4 text-base text-[#17201d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f6672]" />
              <button type="button" onClick={()=>setShowNotes(v=>!v)}
                className="mt-5 min-h-11 rounded-full border border-[#819c88] px-5 py-2 text-sm font-medium text-[#184236] hover:bg-[#e0e9df]">
                {showNotes?"Hide original notes":"Reveal original notes"}
              </button>
              {showNotes&&<div className="mt-5 space-y-4 rounded-xl border border-[#c0ccbc] bg-[#e8eee6] p-5 text-sm text-[#253f33]">
                <div><p className="font-mono text-[10px] uppercase tracking-widest">Initial observation</p><p className="mt-1 whitespace-pre-wrap">{observation||"(Not typed)"}</p></div>
                <div><p className="font-mono text-[10px] uppercase tracking-widest">Initial explanation / Confidence</p><p className="mt-1">{claim||"(Not selected)"} / {initialConfidence}</p></div>
                <div><p className="font-mono text-[10px] uppercase tracking-widest">Alternative</p><p className="mt-1 whitespace-pre-wrap">{alternative||"(Not typed)"}</p></div>
                <div><p className="font-mono text-[10px] uppercase tracking-widest">Evidence / Confidence revision</p><p className="mt-1 whitespace-pre-wrap">{evidenceNote||"(Not typed)"} / {revisedConfidence}</p></div>
              </div>}
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <button type="button" onClick={exportNotes} className="inline-flex min-h-12 items-center rounded-full bg-[#123229] px-6 py-3 text-sm font-semibold text-white hover:bg-[#2a564a]">
                  Download inquiry record ↓
                </button>
                <Link href="/work/locus" className="inline-flex min-h-11 items-center text-sm font-semibold text-[#2b685c] hover:underline">
                  How LOCUS preserves learning ↗
                </Link>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-[#526355]">Your responses remain in this browser tab only. OWLL does not collect these answers; download before leaving if you want to keep them. This immediate exercise is not evidence of durable learning or spaced retrieval.</p>
            </>}
          </div>

          <aside className="self-start border-t border-[#d1d8cc] pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-1">
            <p className="font-mono text-xs uppercase tracking-widest text-[#2f6672]">Field guide / Research habits</p>
            <h4 className="mt-3 font-serif text-[1.7rem] leading-tight text-[#123229]">{stage===0?"See before you explain":stage===1?"Treat explanations as provisional":stage===2?"Compare evidence, not just answers":"Your next encounter"}</h4>
            <p className="mt-4 text-sm leading-relaxed text-[#45564d]">
              {stage===0?"The illustration is a starting point for thinking, not a real photograph. Every good investigation begins by distinguishing observation from interpretation.":
               stage===1?"Multiple processes can shape the same shoreline. The aim is to produce a defensible explanation, not to choose a 'winning' answer.":
               stage===2?"Additional information may strengthen a possibility without ruling out competing explanations. Consider what would genuinely distinguish them.":
               "The illustrated exercise ends here. If a real-world inquiry follows, collect direct evidence safely, check credible sources, and return later before rereading your notes."}
            </p>
            <div className="mt-7 border-t border-[#d1d8cc] pt-6">
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#2f6672]">A meaningful next test</p>
              <p className="mt-3 font-serif text-lg leading-snug text-[#24392c]">{clue.nextTest}</p>
              <p className="mt-3 text-xs leading-relaxed text-[#526355]">Observe only from permitted, accessible areas. Do not enter sensitive dune habitats, cross safety barriers, or disturb wildlife.</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
