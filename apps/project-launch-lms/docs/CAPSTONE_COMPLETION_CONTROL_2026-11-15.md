# Project Launch Lab — Capstone Completion Control and Learner Journey

**Baseline:** November 15, 2026. **Status:** working implementation control, not a claim of formal course completion.
**Scope:** Two-module high-school introduction to the proposed longer OWLL Studio Pathway, *not* the entire 12-week pathway.
**Design authority:** Dr. Lisa Evans-approved LDT 560 Learning Design Blueprint, LDT 555 Module 1 work, actual LDT 560 assignment prompts/rubrics, and the live implementation. Preserve the approved original Google Doc; record proposed refinements here pending Peter's review.

## Definition of done

A student can sign in as an invited learner, understand the purpose and outcomes, complete both modules in an intentional order, make meaningful project decisions, receive useful formative feedback, safely attempt a first action (or honestly document a genuine obstacle), submit authentic graded work, understand assessment results, and identify a next step. An instructor can provide those responses without impersonating a learner. A reviewer can access a stable learner-safe experience. All required outcomes, media, discussions, assessments, accessibility, and evaluation features are present and verified with evidence. A passing code build alone does not meet this definition.

## Learner-facing narrative

| Moment | Student does | Observable evidence | Feedback/decision | Current evidence |
| --- | --- | --- | --- | --- |
| 0. Orientation and diagnostic | Learns course purpose, outcomes, choices, safety/privacy norms; names two interests, recalls a planning experience, judges example directions, estimates confidence | Entry diagnostic and confidence baseline, ungraded | Immediate response/guide to common misconceptions; choices remain learner-owned | Course welcome exists; diagnostic and specific feedback not verified |
| 1. Discover | Sees worked examples of curiosity becoming a feasible focused question; identifies interests and questions | Two candidate directions | Examples and criteria highlight relevance, feasibility, scope | M1 practice instructions exist; media/examples and MLO display not audited complete |
| 2. Compare and decide | Tries Project Launch Gauntlet; explains tradeoffs between two directions; optionally discusses alternatives | Reasoned comparison and direction choice | Scenario feedback and facilitator/peer response; AI optional, no AI required | Gauntlet linked; graded and ungraded activities exist; ungraded output/feedback path is incomplete |
| 3. Direction Brief | Submits a focused choice, personal purpose, feasibility/scope reasoning, tradeoff and open question | Graded Direction Brief | Three x 10-point rubric and narrative feedback | Rubric & submission UI exist; no real learner/instructor E2E test |
| 4. Plan | Examines Maya's worked safe first test; builds feasible bounded action plan with resources, constraints and checkpoints | Draft plan and First Move Card | Scenario-choice explanations and critique protocol | Maya interactive/audio exists; plan hand-in and guaranteed feedback incomplete |
| 5. Feedback and revision | Critiques a plan, asks for feedback, then improves one element or justifies retaining it | Before/after decision with rationale | Facilitator formative response and, optionally, peer comments | Forums exist; no posts or verified ungraded formative feedback |
| 6. Attempt or honest obstacle | Safely tries a small informative step or documents a real barrier; captures non-sensitive evidence | Attempt/obstacle record | Interpret what happened without rewarding mere success | Required in M2 assignment text; operational evidence untested |
| 7. Launch Portfolio | Submits plan, rationale, resources, attempt/obstacle, evidence, feedback response and next step | Graded portfolio | Four criteria x 15-point rubric (60 total), narrative feedback | Assignment exists; **current DB rubric is 3 x 10 = 30**, misaligned |
| 8. Check understanding and transfer | Answers ten scenario questions with explanations, reflects on transferable decisions, rates confidence again and commits to next step | Knowledge check, exit confidence, transfer intention | Correct/incorrect feedback, self-report separated from graded achievement | Ten questions and survey implemented; actual attempts zero and exit/transfer linkage incomplete |
| 9. Evaluate course | Gives Level 1 reaction feedback without affecting grade | Reaction survey | Instructor design revision | Evaluation interface exists; no attempts; privacy/copy QA needed |

### Outcomes-to-evidence crosswalk

- **M1.1 Identify** interests/questions → orientation/diagnostic plus comparison practice and Direction Brief.
- **M1.2 Evaluate** candidate directions for relevance, feasibility and scope → Gauntlet explanations plus Direction Brief's judgment/tradeoff.
- **M1.3 Formulate** a focused project direction → Direction Brief.
- **M2.1 Develop** a feasible launch plan with milestones, resources, constraints and safe bounded first action → First Move Card and Launch Portfolio.
- **M2.2 Evaluate** draft against purpose/feasibility/evidence and **justify** revision or informed retention → facilitator critique response and portfolio revision rationale.
- **M2.3 Attempt** action or document genuine obstacle, interpret evidence/feedback, and **justify** next step → action/obstacle log and Launch Portfolio.
- **CLO4/5 wording:** faculty suggests separating compound cognitive operations. Propose wording in a derivative, do not silently change approved blueprint.

## Compliance and QA register

Legend: **DESIGNED** = in approved blueprint; **CODED** = source implementation seen; **DATA** = Supabase records seen; **TESTED** = independently verified scenario; **GAP** = missing or discrepant; **UNKNOWN** = receipt/live prompt not verified.

| ID | Acceptance criterion / proof needed | Observed status | Priority | Next action |
| --- | --- | --- | --- | --- |
| GOV-01 | All LDT 555/560 outcomes and blueprint events mapped to student evidence | DESIGNED; map now recorded; final independent check pending | P0 | Audit exact blueprint against this file |
| GOV-02 | Two-module scope and learner agency preserved | DESIGNED; CODED two modules | P0 | No scope creep to 12-week pathway |
| GOV-03 | Faculty staging LA4.1 with activity, assignment, reflection | Draft prepared; **not submitted** | P0 Nov 16 | Verify readings, Peter approves first-person reflection, paste to Canvas |
| GOV-04 | M5/M6/7 instructions, exact prompts, due dates, rubric verified from Canvas | Partial course history only | P0 | Obtain/verify live Canvas requirements and receipts |
| NAV-01 | Course title, description, prerequisites/date policy, home/welcome, instructor contact/bio, overview | CODED basic welcome only; rest partial/unknown | P1 | Add authentic contact/overview or transparent placeholders for approval |
| NAV-02 | Every module has an intro, learning outcomes, ordered lessons, readings/media, wrap-up and transfer | DESIGNED; CODED basic activity list | P1 | Add complete instructional narrative and module closure |
| INT-01 | Entry diagnostic: two interests, prior plan, comparison, proposed first action, confidence | GAP | P0 | Define non-graded response and feedback |
| INT-02 | M1 worked media/example and corrective explanations, including low-resource route | Partial Gauntlet; original M1 media not verified | P1 | Author concise accessible original example/media and transcript |
| INT-03 | M1 practice yields a saved learner output + formative facilitator response | **GAP: form UI hidden when no rubric** | P0 | Add ungraded response and feedback flow; E2E test |
| INT-04 | M1 Direction Brief graded by 3×10 criteria | CODED/DATA; not E2E tested | P0 | Full role test and content review |
| INT-05 | M2 worked example & interactive Maya scenario, accessible audio/transcript | CODED/ DATA; visual QA pending | P1 | Verify captions/text and accessible keyboard, semantic feedback |
| INT-06 | M2 First Move Card and critique have learner submission + formative facilitator feedback | **GAP: form UI hidden when no rubric** | P0 | Same mechanism as INT-03; require actual response |
| INT-07 | M2 Launch Portfolio four criteria ×15 =60 with feedback-revision evidence | **GAP: current DB 3×10 =30** | P0 | Align rubric after staging/design signoff; version migration |
| INT-08 | Forum for course questions and structured peer comparison | CODED; no posts/test evidence | P1 | Verify roles, reply isolation, safe discussion norms |
| INT-09 | Ten-question graded scenario quiz provides feedback for correct/incorrect | CODED/DATA 10; no attempts | P0 | Authenticated attempt, score, explanation and retry-policy QA |
| INT-10 | Level 1 course reaction survey, entry/exit confidence, next-step commitment distinct from graded outcomes | Survey CODED; diagnostic/exit link missing | P1 | Add and distinguish self-reports |
| INT-11 | Meaningful choice: no mandatory AI, payment, public post, stranger contact, sensitive disclosure or unsafe action | DESIGNED; text audit incomplete | P0 | Safety/accessibility copy pass, test alternative route |
| LMS-01 | Invitation-only Auth, facilitator/learner roles and cross-user isolation | CODED + partial database role checks; **not browser E2E** | P0 | Synthetic A/B/C accounts, separate sessions and RLS tests |
| LMS-02 | Learner saves/reopens drafts, final submission persists, feedback is visible | CODED; no real records | P0 | Test all four activity outputs |
| LMS-03 | Facilitator can publish formative feedback without a graded rubric | **GAP** | P0 | Design secure no-score review path; verify actual result |
| LMS-04 | Rubric sums, immutable submissions, bounded scores, no cross-course leaks | Partial code/DB checks | P0 | Test with distinct sessions and records |
| LMS-05 | Relative pacing and assessment due-date presentation works for asynchronous enrollment | **DATA: all due_at are null** | P1 | Decide cohort calendar vs relative pacing before setting dates |
| LMS-06 | Student reviewer access without admin leakage or public launch | Not verified | P0 Nov 27 target | Obtain acceptance + perform reviewer role rehearsal |
| QA-01 | Mobile, keyboard-only, headings, contrast, media alternative, plain-language accessible paths | Partial implementation only | P0 | Conduct manual accessibility test and log evidence |
| QA-02 | Learner-facing content/link validation and no broken optional tools | Partial | P1 | Complete click-through on phone/desktop |
| QA-03 | Code lint, types and production build on current branch | Earlier CI pass; recheck every change | P0 | Automate branch build and record SHA |
| QA-04 | Real person can finish journey start-to-finish, including a safe obstacle alternative | No evidence yet | P0 | Synthetic learner walkthrough + facilitator review |
| QA-05 | Design scorecard, action plan, reviewer observations and corrections | Not verified | P0 Nov 30 | Create QA log and evidence table |
| FINAL-01 | Portfolio grading link remains Academic Portfolio View, stable and accessible | Previously set; current link/access not reverified | P1 | Link audit + peer review receipt |
| FINAL-02 | Recorded 7–10 minute capstone showcase and competency assessment | Future deliverables | P2 Dec 7 (verify) | Script after LMS outcome/evidence is stable |
| OWLL-01 | Distinguish capstone-complete experience from future LOCUS/OWLL product roadmap | Scope guarded | P2 after Nov 30 | Keep backlog separately; no extra prerequisite features |

## Critical-path order and stop/go gates

1. **Nov 15–16 — Protect submission.** Verify LA4.1 exact readings/prompt, obtain Peter's voice/approval for reflection, submit as Canvas text entry and capture receipt. Audit course requirements without editing faculty-approved blueprint.
2. **Build slice A — M1.** A learner or reviewer can understand module outcomes, take an entry diagnostic, compare two ideas, submit formative reasoning, receive facilitator feedback, submit Direction Brief and receive scored review.
3. **Build slice B — M2.** Learner works through Maya and safe planning scaffold, submits First Move Card, gets facilitator critique, revises/retains, attempts first action or documents genuine obstacle, submits 60-point Launch Portfolio and receives scored review.
4. **Evaluation slice.** Ten-item quiz with usable explanations, confidence comparison/next-step transfer and non-graded reaction survey; preserve difference between performance and self-report.
5. **Quality gate.** Three separate synthetic Auth identities, each role and isolation matrix, one full learner journey, keyboard/phone/screen-reader checks, stable reviewer access. Do not assert completeness based on table counts or CI alone.
6. **Nov 23/27/30 gates.** Assessment/evaluation submission; reviewer-ready access; finished coherent two-module course + QA scorecard and revision plan. Verify live Canvas details.
7. **Dec 7 final.** Showcase video and competency assessment after evidence has stabilized.

### Change control

- Source implementation lives only on `feat/project-launch-lms-foundation-2026-11-03` / draft PR #15. No merge to public OWLL website and no unapproved deployment.
- Approved blueprint Google Doc remains an immutable reference. All faculty suggested outcome/citation refinements are tracked as proposals until Peter agrees to a derivative update.
- Never use real minors' information in development tests.
- After each change: source review → type/build verification → isolated role/interaction test → record expected/actual evidence and remaining risk.
- A coded feature is not labeled tested until someone has exercised it with realistic data and the result was observed.
- Staging of LA4.1 is not evidence of Canvas submission; track receipt separately.

## Evidence log (start)

- 2026-11-15: GitHub PR #15 source inspected: `app/studio/page.tsx`, navigation, Maya widget, types, README, test plan. Four published activity records, two published module records, ten quiz questions and current rubric totals observed in Supabase earlier this day; all learner submission/feedback/quiz/evaluation record counts zero. Last complete CI pass reported in prior project history, not re-run at this checkpoint.
- 2026-11-15: LA4.1 authored as a local four-page review DOCX and saved to ChatGPT Library; not approved/submitted.
- Next entry: live Canvas receipt and rubric verification; followed by formative-response engineering design and tests.
