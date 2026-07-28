import { technologyHorizons } from "@/content/shared";
import PullQuote from "./PullQuote";

export default function FutureHorizon() {
  return (
    <div>
      <div className="grid gap-6 lg:grid-cols-3">
        <article className="card-premium p-6 md:p-7">
          <p className="field-label text-pine">Today</p>
          <ul className="mt-4 space-y-2">
            {technologyHorizons.today.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-sm text-muted leading-relaxed"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-pine" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </article>

        <article className="card-premium p-6 md:p-7 border-tahoe/20">
          <p className="field-label text-tahoe">Emerging Prototype</p>
          <ul className="mt-4 space-y-2">
            {technologyHorizons.emerging.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-sm text-muted leading-relaxed"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-tahoe" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </article>

        <article className="card-premium p-6 md:p-7 border-dashed border-sand-dark/50 bg-sand/10">
          <p className="field-label text-stone">Future Horizon</p>
          <ul className="mt-4 space-y-2">
            {technologyHorizons.future.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-sm text-muted leading-relaxed"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-stone/60" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </article>
      </div>

      <p className="mt-10 text-center text-sm text-muted max-w-2xl mx-auto leading-relaxed">
        The future interface may change. The educational principle should not: technology must deepen attention to reality rather than compete with it.
      </p>

      <PullQuote>The point is not more screen time. The point is better attention.</PullQuote>
    </div>
  );
}
