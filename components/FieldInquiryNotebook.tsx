"use client";

import { useState } from "react";

const prompts = [
  { key: "notice", label: "01 / Notice", question: "What did you actually observe?", placeholder: "I notice…" },
  { key: "question", label: "02 / Question", question: "What do you wonder, and what do you predict?", placeholder: "I wonder… I predict…" },
  { key: "evidence", label: "03 / Investigate", question: "What did you find? What might challenge your guess?", placeholder: "I compared… An alternative is…" },
  { key: "explain", label: "04 / Explain", question: "What can you explain in your own words?", placeholder: "My current explanation is…" },
  { key: "return", label: "05 / Return", question: "What remains uncertain? What would you revisit?", placeholder: "Next I want to test…" },
] as const;

type NoteKey = (typeof prompts)[number]["key"];
type Notes = Record<NoteKey, string>;

const blank: Notes = { notice: "", question: "", evidence: "", explain: "", return: "" };

/** No network requests, localStorage, autosave, cookies or analytics. */
export default function FieldInquiryNotebook() {
  const [notes, setNotes] = useState<Notes>(blank);
  const hasContent = prompts.some((prompt) => notes[prompt.key].trim() !== "");

  function saveAsText() {
    if (!hasContent) return;
    const lines = [
      "OPEN WORLD LEARNING LAB — MY FIELD NOTE",
      "A personal, ungraded inquiry",
      "",
      ...prompts.flatMap((prompt) => [
        prompt.label + " — " + prompt.question,
        notes[prompt.key].trim() || "(not recorded)",
        "",
      ]),
      "Return: Try recalling the explanation before looking at these notes.",
    ];
    const url = URL.createObjectURL(new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "owll-personal-field-note.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border-strong bg-card shadow-[0_20px_55px_rgba(16,38,32,.08)]">
      <div className="border-b border-[#496759] bg-deep-field p-6 text-on-dark sm:p-9">
        <p className="font-mono text-metadata uppercase tracking-widest text-[#c6dcca]">Field notebook / Optional</p>
        <h2 className="mt-3 font-serif text-page-title text-[#f2efe6]">Make a record of your inquiry.</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#e0e9e0]">
          Type here or use a paper notebook. Notice first, then investigate, explain, and decide what deserves another look.
        </p>
        <p className="mt-5 border-l-2 border-[#e2cb91] pl-4 text-sm leading-relaxed text-[#f1ebd6]">
          <strong>Private by design.</strong> What you type stays in this tab. Nothing is sent to OWLL or saved on a server. Download your notes before reloading or closing this page.
        </p>
      </div>
      <div className="grid gap-5 p-5 sm:p-9 md:grid-cols-2">
        {prompts.map((prompt) => (
          <div key={prompt.key} className={prompt.key === "return" ? "md:col-span-2" : ""}>
            <label htmlFor={"field-" + prompt.key} className="block">
              <span className="font-mono text-metadata uppercase tracking-widest text-water">{prompt.label}</span>
              <span className="mt-2 block text-sm font-medium leading-relaxed text-ink">{prompt.question}</span>
            </label>
            <textarea
              id={"field-" + prompt.key}
              rows={3}
              maxLength={3000}
              placeholder={prompt.placeholder}
              value={notes[prompt.key]}
              onChange={(event) => setNotes((current) => ({ ...current, [prompt.key]: event.target.value }))}
              className="mt-3 block min-h-28 w-full resize-y rounded-lg border border-border-strong bg-page p-4 text-sm leading-relaxed text-ink placeholder:text-quiet/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-water"
            />
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border bg-soft-paper/40 p-5 sm:px-9">
        <p className="max-w-sm text-xs leading-relaxed text-secondary">
          No account or tracking. A download creates a plain-text file on your device. Avoid entering sensitive details on a shared device.
        </p>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={saveAsText} disabled={!hasContent}
            className="inline-flex min-h-11 items-center rounded-full bg-moss px-5 py-3 text-sm font-medium text-on-dark hover:bg-deep-field disabled:cursor-not-allowed disabled:opacity-45">
            Download my field note ↓
          </button>
          <button type="button" onClick={() => setNotes(blank)} disabled={!hasContent}
            className="inline-flex min-h-11 items-center rounded-full border border-border-strong px-5 py-3 text-sm font-medium text-ink hover:bg-page disabled:cursor-not-allowed disabled:opacity-45">
            Clear this tab
          </button>
        </div>
      </div>
    </div>
  );
}
