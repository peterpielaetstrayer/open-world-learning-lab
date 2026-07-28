export interface FieldNoteSpecimenData {
  observation: string;
  initialQuestion: string;
  evidence: { label: string; value: string }[];
  mentorPrompt: string;
  revisedExplanation: string;
  possibleArtifact: string;
  reflection: string;
  disclaimer?: string;
}

const defaultSpecimen: FieldNoteSpecimenData = {
  observation: "The waterline appears higher on one side of the path.",
  initialQuestion:
    "Is the difference caused by tide, elevation, wind, drainage, or something else?",
  evidence: [
    { label: "Time", value: "Tuesday, 9:14 a.m." },
    { label: "Location", value: "North trail bend, approximate" },
    { label: "Sketch", value: "Field sketch placeholder" },
    { label: "Weather", value: "Light wind from the east; overcast" },
    { label: "Measurement", value: "Relative height noted; no instrument" },
  ],
  mentorPrompt:
    "What evidence would help you distinguish between a temporary condition and a persistent pattern?",
  revisedExplanation:
    "Sample explanation: the difference may reflect tidal timing combined with slight elevation change along the path. Further observation at different times would help confirm.",
  possibleArtifact: "Annotated field-guide entry comparing waterline marks across visits.",
  reflection:
    "On returning, the learner might notice whether the pattern holds at low tide, after rain, or during different wind conditions.",
  disclaimer:
    "Illustrative specimen — not actual learner data. Shown to demonstrate how a Field Note might move through inquiry.",
};

interface FieldNoteSpecimenProps {
  data?: FieldNoteSpecimenData;
  className?: string;
}

export default function FieldNoteSpecimen({
  data = defaultSpecimen,
  className = "",
}: FieldNoteSpecimenProps) {
  return (
    <article
      className={`field-note-specimen rounded-lg border border-border bg-soft-paper/30 overflow-hidden ${className}`}
      aria-labelledby="field-note-specimen-title"
    >
      <header className="border-b border-border px-5 py-4 md:px-6">
        <p className="font-mono text-metadata text-quiet">Field Note · Specimen</p>
        <h3 id="field-note-specimen-title" className="mt-1 font-serif text-section-title text-ink">
          Illustrative observation record
        </h3>
        {data.disclaimer && (
          <p className="mt-2 text-sm text-secondary italic">{data.disclaimer}</p>
        )}
      </header>

      <div className="divide-y divide-border">
        <section className="px-5 py-4 md:px-6">
          <h4 className="font-mono text-metadata text-water">Observation</h4>
          <p className="mt-2 text-body text-ink">{data.observation}</p>
        </section>

        <section className="px-5 py-4 md:px-6">
          <h4 className="font-mono text-metadata text-water">Initial question</h4>
          <p className="mt-2 text-body text-ink">{data.initialQuestion}</p>
        </section>

        <section className="px-5 py-4 md:px-6">
          <h4 className="font-mono text-metadata text-water">Evidence</h4>
          <dl className="mt-3 grid gap-2 sm:grid-cols-2">
            {data.evidence.map((item) => (
              <div key={item.label} className="rounded-md border border-border/60 bg-page/60 px-3 py-2">
                <dt className="font-mono text-[0.65rem] text-quiet">{item.label}</dt>
                <dd className="mt-0.5 text-sm text-ink">{item.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="px-5 py-4 md:px-6 bg-moss/5">
          <h4 className="font-mono text-metadata text-moss">Mentor prompt</h4>
          <p className="mt-2 text-body text-ink italic">{data.mentorPrompt}</p>
        </section>

        <section className="px-5 py-4 md:px-6">
          <h4 className="font-mono text-metadata text-water">Revised explanation</h4>
          <p className="mt-2 text-body text-secondary">{data.revisedExplanation}</p>
        </section>

        <section className="px-5 py-4 md:px-6">
          <h4 className="font-mono text-metadata text-water">Possible artifact</h4>
          <p className="mt-2 text-body text-ink">{data.possibleArtifact}</p>
        </section>

        <section className="px-5 py-4 md:px-6">
          <h4 className="font-mono text-metadata text-water">Reflection</h4>
          <p className="mt-2 text-body text-secondary">{data.reflection}</p>
        </section>
      </div>
    </article>
  );
}
