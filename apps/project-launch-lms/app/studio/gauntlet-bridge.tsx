export const GAUNTLET_URL = "https://project-launch-gauntlet.vercel.app/";

export function GauntletBridge() {
  return <section aria-labelledby="gauntlet-bridge-heading" className="direction-insight">
    <p className="eyebrow">Module 1 · Apply what you learned · Optional simulation</p>
    <h3 id="gauntlet-bridge-heading">Challenge a project decision in the Gauntlet</h3>
    <p>
      You have practiced relevance, feasibility and scope. The Project Launch Gauntlet
      presents five other learners&apos; project decisions. Choose, read the explanation,
      and notice a tradeoff that changes what a learner could realistically try.
      The Gauntlet’s meaning, doability and focus correspond to our course lenses:
      relevance, feasibility and scope.
    </p>
    <p>
      <a className="back-link" href={GAUNTLET_URL} target="_blank" rel="noopener noreferrer">
        Open Project Launch Gauntlet (opens in a new tab)
      </a>
    </p>
    <p>
      Return to <strong>this course tab</strong> after the game. The Gauntlet does not
      automatically send choices or readiness scores to this course, and its score
      is not a course grade. You do not need to report a score.
    </p>
    <details>
      <summary>Use the text-only alternative or review a practice decision</summary>
      <p>
        Devon wants to share stories about a neighborhood park. One option is to
        interview strangers and publish their photographs right away. Another is to
        make a one-page plan using public information or original sketches, then
        ask a trusted adult about permission before any public outreach.
      </p>
      <p>
        Which first step better balances relevance (meaning), feasibility (doability)
        and scope (focus)? Decide for yourself: what is gained or postponed, and
        what permission or evidence is still needed?
      </p>
      <details>
        <summary>Compare your reasoning with an example</summary>
        <p>A private one-page draft preserves Devon&apos;s purpose, avoids immediate public outreach,
          and keeps the first attempt focused. It can reveal gaps in available information,
          but it cannot establish what neighbors think. Devon would still need appropriate
          permission and a safe plan before contacting anyone.</p>
      </details>
      <p>You can also skip this example and complete the personal comparison in the course.</p>
    </details>
    <p>
      <strong>Back in the course:</strong> Compare two of your own directions below.
      You may also record one insight from the Gauntlet or text example. That
      observation is optional; your own reasoned comparison is the learning task.
    </p>
  </section>;
}
