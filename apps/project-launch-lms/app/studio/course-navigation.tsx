import { CourseMedia } from "./course-media";
import { LessonText, getResourceUrl } from "./lesson-text";
import type { CourseActivity, CriterionScore, LearnerSubmission, PublishedFeedback, RubricCriterion } from "@/lib/course-types";
import { activityExpectsResponse } from "./activity-order";

export type CourseSection = "home" | "modules" | "assignments" | "feedback" | "resources" | "discussions" | "quiz" | "evaluation" | "manage";
export type CourseModule = { id: string; title: string; module_number: number; is_published: boolean };

export function CourseHome({ description, modules, activities, submissions, feedback, instructor, criteria = [], onOpen, onModules, review = false }: {
  description: string; modules: CourseModule[]; activities: CourseActivity[];
  submissions: LearnerSubmission[]; feedback: PublishedFeedback[]; instructor: boolean; criteria?: RubricCriterion[]; review?: boolean;
  onOpen: (id: string) => void; onModules: () => void;
}) {
  const ordered = modules.flatMap(item => activities.filter(activity => activity.module_id === item.id));
  const submittedActivityIds = new Set(submissions.map(item => item.activity_id));
  const responseActivities = ordered.filter(item => activityExpectsResponse(item, criteria));
  const beginning = ordered[0];
  const hasOrientation = activities.some(activity => activity.slug === "module-one-introduction");
  const submittedCount = responseActivities.filter(item => submittedActivityIds.has(item.id)).length;
  const reviewedCount = submissions.filter(item => feedback.some(review => review.submission_id === item.id && review.published_at)).length;
  return (
    <section className="course-dashboard" aria-labelledby="course-home-heading">
      <div className="course-welcome">
        <p className="eyebrow">Project Launch Lab · Your learning studio</p>
        <h2 id="course-home-heading">Start with curiosity. Leave with a next move.</h2>
        <p className="course-home-lead">You will choose a project direction that matters to you, plan a realistic first step, and learn from what happens. You do not need a perfect idea or a successful outcome to do meaningful work.</p>
        <div className="studio-actions">
          {beginning && <button type="button" className="feedback-button" onClick={() => submittedCount ? onModules() : onOpen(beginning.id)}>
            {instructor ? "Open first activity" : submittedCount ? "Open module pathway" : "Begin exploring"}
          </button>}
          <button type="button" className="secondary-button" onClick={onModules}>View the module map</button>
        </div>
        <p className="course-small"><strong>Getting started:</strong> Follow the module pathway in order. You can return to readings and examples whenever you need them. Use Resources for worksheets and Discussions for course questions.</p>
        {description && <div className="course-description"><LessonText text={description} headingLevel={3} /></div>}
        {hasOrientation && <>
          <p><strong>Welcome to Project Launch Lab.</strong> Start with something you are curious about. I will guide you through examples and practice, but the project direction and decisions are yours. Read the module introduction first, and return to the examples whenever you need support.</p>
          <CourseMedia item="overview" review={review} />
          <section aria-labelledby="course-help-heading">
            <h3 id="course-help-heading">Meet your facilitator</h3>
            <p>Peter Pielaet-Strayer designed Project Launch Lab for his University of San Diego Learning Design and Technology capstone. His work focuses on helping learners explore interests, make decisions, and start projects they care about.</p>
            {review ? <p>This is a read-only faculty review of published instruction. Enrolled learners can use Discussions and private response areas in the authenticated course.</p> : <p>To contact your facilitator, open Discussions and choose Course questions for general help with directions, access, or the next step. Use your assignment response to ask project-specific questions and Feedback to read your facilitator’s published comments. Leave personal details out of discussion posts.</p>}
          </section>
        </>}

      </div>

      <section className="course-how" aria-labelledby="course-outcomes-heading">
        <h3 id="course-outcomes-heading">What you will learn</h3>
        <p className="course-small">These are the six course learning outcomes from the academic design. You will build toward them through examples, practice, feedback, and project work. No prior project-building experience or AI tools are required.</p>
        <ol>
          <li>Identify possible starting points for learner-directed projects and define relevance, feasibility, scope, milestones, constraints and feedback checkpoints.</li>
          <li>Evaluate possible project directions using personal relevance, feasibility and scope, explaining a meaningful tradeoff.</li>
          <li>Formulate a personally selected project direction that is specific, manageable and supported by a reasoned rationale.</li>
          <li>Analyze and evaluate a proposed launch plan for alignment among purpose, milestones, resources, constraints and evidence from a first test.</li>
          <li>Develop, attempt and adjust a feasible launch plan using evidence from a safe, bounded first action and actionable feedback.</li>
          <li>Explain why a personally chosen direction matters and identify a credible next step and support for continued effort.</li>
        </ol>
        <p className="course-small">For a first action that is not safe or feasible to attempt, you may document a genuine barrier, the preparation you completed, and a justified next move. Never invent an attempt to finish an assignment.</p>
      </section>

      {!instructor && ordered.length > 0 && (
        <div className="course-activity-status" aria-label="Your course work status">
          <p><strong>{submittedCount}</strong><span>of {responseActivities.length} requested responses shared</span></p>
          <p><strong>{reviewedCount}</strong><span>facilitator reviews published</span></p>
          <p className="course-status-caution">These counts track shared responses and feedback—not mastery or completion of reading lessons. Follow the module map in order so you encounter instruction before assessments.</p>
        </div>
      )}

      <section aria-labelledby="journey-heading" className="course-journey">
        <div className="course-section-heading">
          <p className="eyebrow">The learning journey</p>
          <h3 id="journey-heading">Two modules. One project you choose.</h3>
        </div>
        <ol className="course-journey-grid">
          {modules.map(item => {
            const items = ordered.filter(activity => activity.module_id === item.id);
            const completed = items.filter(activity => submittedActivityIds.has(activity.id)).length;
            const title = item.module_number === 1 ? "Discover & Define" : item.module_number === 2 ? "Plan & Launch" : item.title;
            const purpose = item.module_number === 1
              ? "Explore your curiosity, compare directions, and explain a focused choice."
              : item.module_number === 2
                ? "Plan a safe first test, examine evidence or a real barrier, and choose a next move."
                : "Practice the skills and decisions in this module.";
            const first = items[0];
            return <li className="course-journey-card" key={item.id}>
              <p className="course-module-counter">Module {item.module_number}</p>
              <h4>{title}</h4>
              <p>{purpose}</p>
              <p className="course-module-status">{items.length} activities{!instructor ? ` · ${completed} responses shared` : ""}
                {!item.is_published && " · Draft"}</p>
              {first && <button type="button" className="text-button" onClick={() => onOpen(first.id)}>
                Explore this module <span aria-hidden="true">→</span>
              </button>}
            </li>;
          })}
        </ol>
        {modules.length === 0 && <p>The instructor has not published any modules yet.</p>}
      </section>

      {hasOrientation && <section aria-labelledby="course-assessment-heading" className="course-how">
        <h3 id="course-assessment-heading">What you will create and share</h3>
        <p>Use the examples and ungraded practice to prepare your own work. The two project assignments are separate records: your first choice in Module 1 becomes the starting point for planning in Module 2.</p>
        {[
          { slug: "project-direction-brief", detail: "Module 1 · Day 7. Explain two possibilities, your decision and one remaining question." },
          { slug: "launch-portfolio", detail: "Module 2 · Day 7. Show your plan, feedback, a genuine first attempt or documented barrier, and your next decision." },
        ].map(item => {
          const activity = activities.find(candidate => candidate.slug === item.slug);
          if (!activity) return null;
          const points = criteria.filter(criterion => criterion.activity_id === activity.id)
            .reduce((sum, criterion) => sum + Number(criterion.maximum_points), 0);
          return <article key={item.slug} className="assignment-card">
            <h4>{activity.title}{points > 0 ? ` · ${points} points` : ""}</h4>
            <p>{item.detail}</p>
            <button type="button" className="text-button" onClick={() => onOpen(activity.id)}>Review directions and criteria</button>
          </article>;
        })}
        <p>Share the comparison and First Move Card by Day 3 of their respective modules for formative feedback. Day 1 begins when the facilitator opens the module. At the end, complete the knowledge quiz and the separate ungraded course evaluation.</p>
      </section>}

      <section aria-labelledby="how-heading" className="course-how">
        <h3 id="how-heading">How your work moves forward</h3>
        <ol>
          <li><strong>Learn and practice.</strong> Use examples and feedback to understand your options. It is fine to change your mind.</li>
          <li><strong>Save, then share.</strong> Drafts can be revised. A final response goes to your facilitator and cannot be edited afterward.</li>
          <li><strong>Act or document a barrier.</strong> A safe, informative attempt—or an honest explanation of what stopped it—both count as evidence.</li>
          <li><strong>Review and decide.</strong> Read published feedback alongside each activity. Graded assignments show their criteria before submission.</li>
        </ol>
      </section>

      <aside aria-labelledby="safety-heading" className="course-safety">
        <h3 id="safety-heading">Your project, your pace, your privacy</h3>
        <p>You do not need to buy anything, travel, contact strangers, post publicly, share sensitive information, or use AI. If a first action needs permission or is unsafe, choose a smaller alternative or explain the obstacle. Ask a trusted adult or facilitator when you need support.</p>
        <p className="course-small">Practice activities are ungraded. A rubric is shown only where an assignment is scored. Work is shared with your facilitator when you choose to submit it.</p>
      </aside>
    </section>
  );
}

/** Orientation only: sequence position is not completion or mastery. */
export function LessonContext({ modules, activities, activity, criteria }: {
  modules: CourseModule[]; activities: CourseActivity[]; activity: CourseActivity; criteria: RubricCriterion[];
}) {
  const module = modules.find(item => item.id === activity.module_id);
  const lessons = activities.filter(item => item.module_id === activity.module_id);
  const position = lessons.findIndex(item => item.id === activity.id);
  if (!module || position < 0) return null;
  const kind = criteria.some(item => item.activity_id === activity.id) ? "Graded assignment"
    : activityExpectsResponse(activity, criteria) ? "Practice and feedback" : "Instruction";
  return <div className="lesson-context">
    <p className="eyebrow">Module {module.module_number} · {module.title}</p>
    <p className="course-small">Activity {position + 1} of {lessons.length} in this module · {kind}</p>
  </div>;
}

export function CourseOutline({ modules, activities, criteria, selectedId, portfolioOpen = false, onOpen }: {
  modules: CourseModule[]; activities: CourseActivity[]; criteria: RubricCriterion[];
  selectedId: string; portfolioOpen?: boolean; onOpen: (id: string) => void;
}) {
  return (
    <nav aria-label="Module lessons" className="course-outline">
      {modules.length === 0 && <p>No published modules are available yet.</p>}
      {modules.map(item => (
        <section key={item.id} className="module-outline">
          <h3>{item.module_number}. {item.title}</h3>
          {!item.is_published && <p className="form-note">Draft module</p>}
          <ul>
            {activities.filter(activity => activity.module_id === item.id).map(activity => (
              <li key={activity.id}>
                <button type="button" aria-current={selectedId === activity.id ? "page" : undefined}
                  onClick={() => onOpen(activity.id)}>
                  {activity.title}
                  <span>{activity.slug === "launch-portfolio" && !portfolioOpen ? "Assessment on hold" : criteria.some(criterion => criterion.activity_id === activity.id) ? "Assignment" : activityExpectsResponse(activity, criteria) ? "Practice · share response" : "Lesson"}
                    {!activity.is_published && " · Draft"}</span>
                </button>
              </li>
            ))}
          </ul>
          {!activities.some(activity => activity.module_id === item.id) && <p className="form-note">Lessons will appear here when available.</p>}
        </section>
      ))}
    </nav>
  );
}

export function AssignmentList({ activities, criteria, submissions, feedback, scores = [], portfolioOpen = false, onOpen, showFeedback }: {
  activities: CourseActivity[]; criteria: RubricCriterion[]; submissions: LearnerSubmission[];
  feedback: PublishedFeedback[]; scores?: CriterionScore[]; portfolioOpen?: boolean; onOpen: (id: string) => void; showFeedback: boolean;
}) {
  const assignments = activities.filter(activity => showFeedback
    ? activityExpectsResponse(activity, criteria)
    : criteria.some(item => item.activity_id === activity.id));
  return (
    <section aria-labelledby="assignment-list-heading">
      <h2 id="assignment-list-heading">{showFeedback ? "Your work and feedback" : "Assignments"}</h2>
      {assignments.length === 0 && <p>No published assignments are available yet.</p>}
      {assignments.map(activity => {
        const submission = submissions.find(item => item.activity_id === activity.id);
        const review = feedback.find(item => item.submission_id === submission?.id && item.published_at);
        const maximum = criteria.filter(item => item.activity_id === activity.id)
          .reduce((total, item) => total + Number(item.maximum_points), 0);
        const assignmentCriteria = criteria.filter(item => item.activity_id === activity.id);
        const matchingScores = review ? assignmentCriteria.map(criterion =>
          scores.find(score => score.submission_id === review.submission_id && score.criterion_id === criterion.id)) : [];
        const total = matchingScores.length > 0 && matchingScores.every(score => score !== undefined)
          ? matchingScores.reduce((sum, score) => sum + Number(score?.awarded_points ?? 0), 0)
          : null;
        const portfolioOnHold = activity.slug === "launch-portfolio" && !portfolioOpen;
        return <article key={activity.id} className="assignment-card">
          <h3><button type="button" className="text-button" onClick={() => onOpen(activity.id)}>{activity.title}</button></h3>
          <p>{portfolioOnHold ? "Assessment on hold · rubric under review" : maximum > 0 ? `${maximum} points` : "Ungraded practice"}{!activity.is_published && " · Draft"}</p>
          {submission ? <p>Submitted {new Date(submission.submitted_at).toLocaleString()}{review ? " · Feedback available" : " · Awaiting review"}</p>
            : portfolioOnHold ? <p>You may save a draft; final submission and grading are not available until the assessment is approved.</p>
            : <p>Ready for your response</p>}
          {showFeedback && review && <p className="prewrap">{review.summary}</p>}
          {review && !portfolioOnHold && total !== null && <p><strong>Score:</strong> {total} / {maximum} points</p>}
        </article>;
      })}
    </section>
  );
}

const moduleTargets: Readonly<Record<string, string>> = {
  "direction-comparison": "Module 1, Day 3. Share your comparison for formative feedback.",
  "project-direction-brief": "Module 1, Day 7. Submit your brief after considering feedback on your comparison.",
  "first-move-card": "Module 2, Day 3. Share your card for facilitator feedback.",
  "first-move-revision": "Module 2, Day 5. Complete your response after facilitator feedback arrives.",
  "launch-portfolio": "Module 2, Day 7. Submit after you have considered the feedback and documented a safe attempt or barrier.",
};

export function ActivityPacing({ slug }: { slug: string }) {
  const target = moduleTargets[slug];
  return target ? <p className="form-note"><strong>Module pacing:</strong> {target} Day 1 begins when your facilitator opens the module. Follow any schedule your facilitator shares.</p> : null;
}

export function CourseResources({ activities, onOpen, review = false }: { activities: CourseActivity[]; onOpen?: (id: string) => void; review?: boolean }) {
  const resources = activities.flatMap(activity => {
    const urls = [...new Set(activity.instructions.split(/\r?\n/)
      .map(line => getResourceUrl(line.trim())?.href).filter((url): url is string => Boolean(url)))];
    return urls.map(url => ({ activity, url }));
  });
  return (
    <section aria-labelledby="resources-heading">
      <h2 id="resources-heading">Resources</h2>
      <p>These resources support work in both modules. Return to the assigned readings before applying the decision lenses or planning your first move.</p>
      <section aria-labelledby="assigned-readings-heading">
        <h3 id="assigned-readings-heading">Assigned readings</h3>
        {[
          { slug: "module-one-introduction", title: "Three Lenses, One Decision", description: "Module 1 · Relevance, feasibility, scope, and tradeoffs." },
          { slug: "module-two-introduction", title: "An Informative First Move", description: "Module 2 · Purpose, milestones, constraints, and evidence." },
        ].map(reading => {
          const activity = activities.find(item => item.slug === reading.slug);
          if (!activity) return null;
          return <article className="assignment-card" key={reading.slug}>
            <h4>{reading.title}</h4><p>{reading.description}</p>
            {onOpen ? <button type="button" className="secondary-button" onClick={() => onOpen(activity.id)}>Read in module</button> : <p>Find this reading in {activity.title}.</p>}
          </article>;
        })}
      </section>
      {activities.some(activity => activity.slug === "project-direction-lesson") && <section aria-labelledby="optional-resources-heading">
        <h3 id="optional-resources-heading">Optional enrichment</h3>
        <p>These resources are not required viewing or reading. Use them if they help you think about your own project.</p>
        <article className="assignment-card">
          <h4>Picking Your Topic Is Research!</h4>
          <p>NC State University Libraries · An example of narrowing an idea after checking available information. The publisher provides a transcript.</p>
          <a className="back-link" href="https://www.lib.ncsu.edu/videos/picking-your-topic-is-research" target="_blank" rel="noopener noreferrer">Video and transcript (opens in a new tab)</a>
        </article>
      </section>}
      <h3>Worksheets and external practice</h3>
      {activities.some(activity => activity.slug === "module-one-introduction") && <ul>
        <li><a className="back-link" href={review ? "/review-materials/project-launch-worksheets.txt" : "/resources/project-launch-worksheets.txt"} download>Download the project worksheets and first-action checklist (plain text)</a></li>
      </ul>}
      {resources.map(({ activity, url }) => <article className="assignment-card" key={activity.id + url}>
        <h3>{activity.title}</h3>
        <a className="back-link" href={url} target="_blank" rel="noopener noreferrer">
          {new URL(url).hostname === "project-launch-gauntlet.vercel.app" ? "Open Project Launch Gauntlet" : `Open ${new URL(url).hostname}`} (opens in new tab)
        </a>
      </article>)}
      {resources.length === 0 && <p>Resources will appear here when they are added to published lessons.</p>}
    </section>
  );
}
