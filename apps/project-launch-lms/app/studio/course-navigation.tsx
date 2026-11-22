import { LessonText, getResourceUrl } from "./lesson-text";
import type { CourseActivity, CriterionScore, LearnerSubmission, PublishedFeedback, RubricCriterion } from "@/lib/course-types";
import { activityExpectsResponse } from "./activity-order";

export type CourseSection = "home" | "modules" | "assignments" | "feedback" | "resources" | "discussions" | "quiz" | "evaluation" | "manage";
export type CourseModule = { id: string; title: string; module_number: number; is_published: boolean };

export function CourseHome({ description, modules, activities, submissions, feedback, instructor, criteria = [], onOpen, onModules }: {
  description: string; modules: CourseModule[]; activities: CourseActivity[];
  submissions: LearnerSubmission[]; feedback: PublishedFeedback[]; instructor: boolean; criteria?: RubricCriterion[];
  onOpen: (id: string) => void; onModules: () => void;
}) {
  const ordered = modules.flatMap(item => activities.filter(activity => activity.module_id === item.id));
  const submittedActivityIds = new Set(submissions.map(item => item.activity_id));
  const responseActivities = ordered.filter(item => activityExpectsResponse(item, criteria));
  const beginning = ordered[0];
  const submittedCount = responseActivities.filter(item => submittedActivityIds.has(item.id)).length;
  const reviewedCount = submissions.filter(item => feedback.some(review => review.submission_id === item.id && review.published_at)).length;
  return (
    <section className="course-dashboard" aria-labelledby="course-home-heading">
      <div className="course-welcome">
        <p className="eyebrow">Project Launch Lab · Your learning studio</p>
        <h2 id="course-home-heading">Start with curiosity. Leave with a next move.</h2>
        <p className="course-home-lead">You will choose a project direction that matters to you, plan a realistic first step, and learn from what happens. You do not need a perfect idea or a successful outcome to do meaningful work.</p>
        {description && <div className="course-description"><LessonText text={description} headingLevel={3} /></div>}
        <div className="studio-actions">
          {beginning && <button type="button" className="feedback-button" onClick={() => submittedCount ? onModules() : onOpen(beginning.id)}>
            {instructor ? "Open first activity" : submittedCount ? "Open module pathway" : "Begin exploring"}
          </button>}
          <button type="button" className="secondary-button" onClick={onModules}>View the module map</button>
        </div>
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

export function CourseOutline({ modules, activities, criteria, selectedId, onOpen }: {
  modules: CourseModule[]; activities: CourseActivity[]; criteria: RubricCriterion[];
  selectedId: string; onOpen: (id: string) => void;
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
                  <span>{activity.slug === "launch-portfolio" ? "Assessment on hold" : criteria.some(criterion => criterion.activity_id === activity.id) ? "Assignment" : "Lesson"}
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

export function AssignmentList({ activities, criteria, submissions, feedback, scores = [], onOpen, showFeedback }: {
  activities: CourseActivity[]; criteria: RubricCriterion[]; submissions: LearnerSubmission[];
  feedback: PublishedFeedback[]; scores?: CriterionScore[]; onOpen: (id: string) => void; showFeedback: boolean;
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
        const portfolioOnHold = activity.slug === "launch-portfolio";
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

export function CourseResources({ activities }: { activities: CourseActivity[] }) {
  const resources = activities.flatMap(activity => {
    const urls = [...new Set(activity.instructions.split(/\r?\n/)
      .map(line => getResourceUrl(line.trim())?.href).filter((url): url is string => Boolean(url)))];
    return urls.map(url => ({ activity, url }));
  });
  return (
    <section aria-labelledby="resources-heading">
      <h2 id="resources-heading">Resources</h2>
      <p>These resources are also linked from their lessons.</p>
      {resources.map(({ activity, url }) => <article className="assignment-card" key={activity.id + url}>
        <h3>{activity.title}</h3>
        <a className="back-link" href={url} target="_blank" rel="noopener noreferrer">
          Open {new URL(url).hostname} (opens in new tab)
        </a>
      </article>)}
      {resources.length === 0 && <p>Resources will appear here when they are added to published lessons.</p>}
    </section>
  );
}
