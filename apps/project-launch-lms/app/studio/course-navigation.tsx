import { LessonText, getResourceUrl } from "./lesson-text";
import type { CourseActivity, LearnerSubmission, PublishedFeedback, RubricCriterion } from "@/lib/course-types";

export type CourseSection = "home" | "modules" | "assignments" | "feedback" | "resources" | "discussions" | "quiz" | "evaluation" | "manage";
export type CourseModule = { id: string; title: string; module_number: number; is_published: boolean };

export function CourseHome({ description, modules, activities, onOpen, onModules }: {
  description: string; modules: CourseModule[]; activities: CourseActivity[];
  onOpen: (id: string) => void; onModules: () => void;
}) {
  const first = modules.flatMap(item => activities.filter(activity => activity.module_id === item.id))[0];
  return (
    <section aria-labelledby="course-home-heading">
      <h2 id="course-home-heading">Start here</h2>
      {description && <LessonText text={description} />}
      <p>Follow the modules in order. Open each lesson for instructions and resources.
        Before submitting an assignment, read its rubric. Return to Feedback to see your saved work and published review.</p>
      <div className="studio-actions">
        {first && <button type="button" className="feedback-button" onClick={() => onOpen(first.id)}>Start the course</button>}
        <button type="button" className="secondary-button" onClick={onModules}>Browse modules</button>
      </div>
      <ol className="course-outline">
        {modules.map(item => <li key={item.id}>
          <h3>{item.title}</h3>
          <p>{activities.filter(activity => activity.module_id === item.id).length} lessons and assignments
            {!item.is_published && " · Draft module"}</p>
        </li>)}
      </ol>
      {modules.length === 0 && <p>The instructor has not published any modules yet.</p>}
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
                  <span>{criteria.some(criterion => criterion.activity_id === activity.id) ? "Assignment" : "Lesson"}
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

export function AssignmentList({ activities, criteria, submissions, feedback, onOpen, showFeedback }: {
  activities: CourseActivity[]; criteria: RubricCriterion[]; submissions: LearnerSubmission[];
  feedback: PublishedFeedback[]; onOpen: (id: string) => void; showFeedback: boolean;
}) {
  const assignments = activities.filter(activity => criteria.some(item => item.activity_id === activity.id));
  return (
    <section aria-labelledby="assignment-list-heading">
      <h2 id="assignment-list-heading">{showFeedback ? "Your work and feedback" : "Assignments"}</h2>
      {assignments.length === 0 && <p>No published assignments are available yet.</p>}
      {assignments.map(activity => {
        const submission = submissions.find(item => item.activity_id === activity.id);
        const review = feedback.find(item => item.submission_id === submission?.id && item.published_at);
        const maximum = criteria.filter(item => item.activity_id === activity.id)
          .reduce((total, item) => total + Number(item.maximum_points), 0);
        return <article key={activity.id} className="assignment-card">
          <h3><button type="button" className="text-button" onClick={() => onOpen(activity.id)}>{activity.title}</button></h3>
          <p>{maximum} points{!activity.is_published && " · Draft"}</p>
          {submission ? <p>Submitted {new Date(submission.submitted_at).toLocaleString()}{review ? " · Feedback available" : " · Awaiting review"}</p>
            : <p>Ready for your response</p>}
          {showFeedback && review && <LessonText text={review.summary} />}
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
