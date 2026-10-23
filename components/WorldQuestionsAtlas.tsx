"use client";

import { useState } from "react";
import Link from "next/link";

const scenes = [
  {
    title: "A changing shoreline", place: "WATER / LAND", symbol: "≈",
    notice: "Water leaves patterns in sand, soil, and stone.",
    question: "How can we tell water shaped a place, even when it is not moving?",
    investigate: "Compare two visible surfaces. What differs, and what else could explain those patterns?",
    make: "An annotated field sketch separating observation from interpretation.",
    next: "Try a coastal investigation",
    href: "/work/first-landing/field-experience",
    nextContext: "Opens a fictional illustrated shoreline inquiry; no travel required.",
  },
  {
    title: "A familiar kitchen", place: "HOME / SCIENCE", symbol: "◌",
    notice: "Droplets gather on the outside of a cold glass.",
    question: "Where does that water come from?",
    investigate: "Observe a cold glass over time. Compare your prediction with what happens and consider an alternative.",
    make: "A short explanation that identifies the evidence and its limits.",
    next: "Investigate something around you",
    href: "/start",
    nextContext: "Use the same approach with a real question from home.",
  },
  {
    title: "A moving shadow", place: "EVERYWHERE / PATTERNS", symbol: "✳",
    notice: "A shadow changes direction and length as time passes.",
    question: "What does its shape tell us about the light source?",
    investigate: "Compare a shadow at different times or use a lamp. Never look directly at the sun.",
    make: "A simple diagram and one new question to revisit.",
    next: "Explore your own shadow question",
    href: "/start",
    nextContext: "Use the free five-move field guide, no equipment required.",
  },
] as const;

export default function WorldQuestionsAtlas() {
  const [selected, setSelected] = useState(0);
  const scene = scenes[selected];
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#627c68] bg-deep-field text-on-dark shadow-[0_22px_65px_rgba(16,38,32,.12)]">
      <div className="pointer-events-none absolute inset-0 pattern-topo opacity-35" aria-hidden="true" />
      <div className="relative grid lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)]">
        <div className="border-b border-white/20 p-6 sm:p-10 lg:border-b-0 lg:border-r lg:p-12">
          <p className="font-mono text-metadata uppercase tracking-widest text-[#bed5c5]">Interactive field atlas / 001</p>
          <h2 className="mt-5 font-serif text-[clamp(2.25rem,4vw,4.2rem)] leading-[1.07] tracking-[-.03em]">
            Ordinary places. <em className="text-[#e2cb91]">Extraordinary questions.</em>
          </h2>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-[#d5e2d9]">
            The world is not divided into school subjects. Choose a place and discover the beginnings of an investigation.
          </p>
          <div className="mt-8 flex flex-col gap-2" role="group" aria-label="Choose an inquiry setting">
            {scenes.map((item, index) => (
              <button key={item.title} type="button" onClick={() => setSelected(index)}
                aria-pressed={selected === index}
                className={"flex min-h-14 items-center gap-4 rounded-lg border px-4 py-3 text-left transition-colors focus-visible:outline-[3px] focus-visible:outline-[#e2cb91] focus-visible:outline-offset-4 " +
                  (selected === index
                    ? "border-[#e2cb91] bg-[#f2efe6] text-[#17201d]"
                    : "border-white/25 bg-white/[.04] text-[#f2efe6] hover:border-white/65 hover:bg-white/10")}>
                <span className="font-mono text-xs opacity-75">0{index + 1}</span>
                <span className="flex-1 font-serif text-xl">{item.title}</span>
                <span aria-hidden="true" className="text-xl">{item.symbol}</span>
              </button>
            ))}
          </div>
          <p className="mt-5 text-xs leading-relaxed text-[#bed5c5]">Conceptual inquiries, not documented learner results or scientifically validated simulations.</p>
        </div>
        <div className="flex flex-col justify-between p-6 sm:p-10 lg:p-12">
          <div className="relative mb-8 flex h-40 items-center justify-center overflow-hidden rounded-xl border border-white/20 bg-[#244a40] sm:h-52" aria-hidden="true">
            <svg viewBox="0 0 600 210" className="h-full w-full" preserveAspectRatio="xMidYMid slice" fill="none">
              {Array.from({length: 9}, (_, index) => (
                <ellipse key={index} cx="300" cy="112" rx={50 + index * 34} ry={20 + index * 13}
                  stroke={index % 2 ? "#a3c5ae" : "#dec88e"} strokeWidth="1.3" opacity=".38" />
              ))}
              <path d="M-10 160 Q120 68 230 145 T460 137 T650 140" stroke="#dce9d8" strokeWidth="2" opacity=".65"/>
              <circle cx="300" cy="112" r="37" fill="#f2efe6" fillOpacity=".12" stroke="#e2cb91"/>
              <circle cx="300" cy="112" r="4" fill="#e2cb91"/>
              <path d="M300 55 V75 M300 149 V169 M245 112 H265 M335 112 H355" stroke="#e2cb91"/>
            </svg>
            <span className="absolute left-4 top-4 font-mono text-[10px] tracking-widest text-[#e3ebdf]">INQUIRY PLATE / 0{selected + 1}</span>
            <span className="absolute bottom-3 right-4 font-mono text-[10px] tracking-widest text-[#e3ebdf]">{scene.place}</span>
          </div>
          <div aria-live="polite" aria-atomic="true">
            <p className="font-mono text-metadata uppercase tracking-widest text-[#e2cb91]">Notice</p>
            <p className="mt-2 font-serif text-2xl leading-snug">{scene.notice}</p>
            <p className="mt-6 font-mono text-metadata uppercase tracking-widest text-[#e2cb91]">Question</p>
            <p className="mt-2 font-serif text-[clamp(1.5rem,2.4vw,2rem)] leading-snug">{scene.question}</p>
            <p className="mt-6 font-mono text-metadata uppercase tracking-widest text-[#e2cb91]">Investigate</p>
            <p className="mt-2 text-sm leading-relaxed text-[#d5e2d9]">{scene.investigate}</p>
            <div className="mt-6 border-t border-white/20 pt-5">
              <p className="font-mono text-metadata uppercase tracking-widest text-[#e2cb91]">A possible artifact</p>
              <p className="mt-2 text-sm leading-relaxed text-[#d5e2d9]">{scene.make}</p>
            </div>
          </div>
          <div className="mt-8 flex flex-col items-start gap-3">
            <Link href={scene.href} className="inline-flex min-h-11 items-center rounded-full bg-[#f2efe6] px-6 py-3 text-sm font-semibold text-[#17201d] hover:bg-[#e2dfcc] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e2cb91]">
              {scene.next} <span className="ml-2" aria-hidden="true">↗</span>
            </Link>
            <p className="text-xs leading-relaxed text-[#bed5c5]">{scene.nextContext}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
