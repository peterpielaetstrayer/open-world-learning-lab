"use client";

import { useState } from "react";
import Link from "next/link";
import { AssignmentList, CourseHome, CourseOutline, type CourseModule } from "../studio/course-navigation";
import { LessonText } from "../studio/lesson-text";
import type { CourseActivity, LearnerSubmission, PublishedFeedback, RubricCriterion } from "@/lib/course-types";

type PreviewSection = "home" | "modules" | "assignments" | "feedback";

const modules: CourseModule[] = [
  { id: "sample-m1", title: "Discover & Define", module_number: 1, is_published: true },
  { id: "sample-m2", title: "Plan & Launch", module_number: 2, is_published: true },
];

const activities: CourseActivity[] = [
  { id: "sample-practice", course_id: "synthetic-course", module_id: "sample-m1",
    slug: "gauntlet-practice", title: "Practice choosing a direction", is_published: true,
    instructions: "Compare two directions you genuinely care about. Look at relevance, feasibility and scope. Choose a tentative direction, explain one tradeoff and name what could change your mind.\n\nThis practice is ungraded. In the signed-in course you can save a response or share it privately with your facilitator." },
  { id: "sample-brief", course_id: "synthetic-course", module_id: "sample-m1",
    slug: "project-direction-brief", title: "Project Direction Brief", is_published: true,
    instructions: "Explain your project choice using personal relevance, practical constraints and a focused first question. Show that you considered another direction, accepted a tradeoff and can revise your plan when evidence changes." },
  { id: "sample-studio", course_id: "synthetic-course", module_id: "sample-m2",
    slug: "first-move-studio", title: "First Move Studio", is_published: true,
    instructions: "Make a First Move Card: a safe action, what you hope to learn, the materials or permissions you need, useful evidence and an alternative if conditions prevent your first attempt. Feedback is ungraded and should help you refine your plan." },
  { id: "sample-portfolio", course_id: "synthetic-course", module_id: "sample-m2",
    slug: "launch-portfolio", title: "Launch Portfolio", is_published: true,
    instructions: "Gather your project purpose, first-move plan, honest evidence of a safe attempt or documented barrier, feedback received and a reasoned next step.\n\nThe final academic rubric is under reconciliation. This design preview intentionally does not simulate a score for this task." },
];

const criteria: RubricCriterion[] = [
  { id: "sample-criterion-1", course_id: "synthetic-course", activity_id: "sample-brief", position: 1,
    title: "Personal relevance", description: "Owns and explains a meaningful direction", maximum_points: 10 },
  { id: "sample-criterion-2", course_id: "synthetic-course", activity_id: "sample-brief", position: 2,
    title: "Feasibility", description: "Considers actual resources, conditions and alternatives", maximum_points: 10 },
  { id: "sample-criterion-3", course_id: "synthetic-course", activity_id: "sample-brief", position: 3,
    title: "Scope and reasoning", description: "Compares, narrows and justifies a starting point", maximum_points: 10 },
];

const exampleSubmission: LearnerSubmission = {
  id: "fictional-submission", course_id: "synthetic-course", activity_id: "sample-practice",
  learner_id: "fictional-learner", submitted_at: "2026-11-18T12:00:00Z",
  response_text: "I could make a schoolwide art club, or try a short guide for one beginner. The guide seems easier to test with paper and pencils. I would revisit the choice if a friend found the instructions confusing.",
};

const exampleFeedback: PublishedFeedback = {
  id: "fictional-feedback", submission_id: "fictional-submission",
  summary: "You compared a broad direction with a smaller first test and used real constraints to justify the choice. What one observation would show whether the short guide helps a beginner?",
  published_at: "2026-11-18T13:00:00Z",
};

export function SyntheticStudio() {
  const [section, setSection] = useState<PreviewSection>("home");
  const [selectedId, setSelectedId] = useState<string>("");
  const [showExampleFeedback, setShowExampleFeedback] = useState(false);
  const submissions = showExampleFeedback ? [exampleSubmission] : [];
  const feedback = showExampleFeedback ? [exampleFeedback] : [];
  const selected = activities.find(activity => activity.id === selectedId);
  const selectedCriteria = criteria.filter(item => item.activity_id === selectedId);
  const chosenSubmission = submissions.find(item => item.activity_id === selectedId);
  const chosenFeedback = feedback.find(item => item.submission_id === chosenSubmission?.id);

  function openActivity(id: string) {
    setSelectedId(id);
    setSection("modules");
  }

  return (
    <main id="main-content" className="page-wrap studio-container">
      <div className="studio-top">
        <div>
          <p className="eyebrow">Private design review · fictional learner</p>
          <h1>Project Launch Lab</h1>
          <p>Explore the proposed learner-facing navigation and feedback presentation before testing real accounts.</p>
        </div>
        <Link href="/lesson-preview" className="primary-link">See the ten-screen lesson <span aria-hidden="true">↗</span></Link>
      </div>
      <div className="preview-banner" role="note">
        <strong>This is a design preview, not a signed-in course.</strong> All activity data and feedback here are fictional.
        Buttons only navigate this example; nothing you enter is saved, submitted or sent to Supabase.
        The actual studio and instructor workflow still require authentication and end-to-end acceptance testing.
      </div>
      <div className="studio-preview-switch" aria-label="Preview sample learner state">
        <span className="eyebrow">Preview state</span>
        <button type="button" className={!showExampleFeedback ? "feedback-button" : "secondary-button"}
          aria-pressed={!showExampleFeedback} onClick={() => setShowExampleFeedback(false)}>Starting learner</button>
        <button type="button" className={showExampleFeedback ? "feedback-button" : "secondary-button"}
          aria-pressed={showExampleFeedback} onClick={() => setShowExampleFeedback(true)}>Example with feedback</button>
      </div>
      <div className="course-layout">
        <nav aria-label="Demo course navigation" className="course-navigation">
          {(["home", "modules", "assignments", "feedback"] as const).map(value => (
            <button key={value} type="button" aria-current={section === value ? "page" : undefined}
              onClick={() => setSection(value)}>
              {value === "home" ? "Home" : value === "modules" ? "Modules" : value === "assignments" ? "Assignments" : "Feedback"}
            </button>
          ))}
        </nav>
        <div className="course-content">
          {section === "home" && <CourseHome description="A learner-owned pathway from a meaningful question to a manageable first move."
            modules={modules} activities={activities} submissions={submissions} feedback={feedback}
            instructor={false} onOpen={openActivity} onModules={() => setSection("modules")} />}
          {section === "modules" && <div className="module-reader">
            <CourseOutline modules={modules} activities={activities} criteria={criteria}
              selectedId={selectedId} onOpen={openActivity} />
            <section className="studio-work" aria-label="Sample lesson content">
              {!selected && <p>Choose an activity to see an example of the reading and response area.</p>}
              {selected && <article className="studio-panel">
                <p className="eyebrow">Illustrative activity copy</p>
                <h2>{selected.title}</h2>
                <LessonText text={selected.instructions} />
                {selectedCriteria.length > 0 && <section aria-labelledby="sample-rubric-heading">
                  <h3 id="sample-rubric-heading">How your work will be evaluated</h3>
                  <ul>{selectedCriteria.map(item => <li key={item.id}>{item.title} · {item.maximum_points} points</li>)}</ul>
                </section>}
                {chosenSubmission ? <div className="review-output">
                  <h3>Your example reflection</h3><p>{chosenSubmission.response_text}</p>
                  <h3>Fictional facilitator feedback (ungraded)</h3><p>{chosenFeedback?.summary}</p>
                </div> : <div className="preview-response">
                  <label htmlFor="sample-response">Your response (display only)</label>
                  <textarea id="sample-response" rows={5} readOnly
                    placeholder="In the real course, you can draft and privately submit your explanation here." />
                  <p className="form-note">Saving and sharing are disabled in this design preview; no learner record is created.</p>
                </div>}
                {selectedId === "sample-practice" && <p><Link className="back-link" href="/lesson-preview">
                  Open the separate interactive Project Direction Lesson prototype
                </Link></p>}
              </article>}
            </section>
          </div>}
          {section === "assignments" && <AssignmentList activities={activities} criteria={criteria}
            submissions={submissions} feedback={feedback} onOpen={openActivity} showFeedback={false} />}
          {section === "feedback" && <AssignmentList activities={activities} criteria={criteria}
            submissions={submissions} feedback={feedback} onOpen={openActivity} showFeedback={true} />}
        </div>
      </div>
    </main>
  );
}
