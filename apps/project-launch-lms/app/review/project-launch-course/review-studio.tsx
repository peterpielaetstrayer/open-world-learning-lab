"use client";

import { useMemo, useState } from "react";
import {
  ActivityPacing, AssignmentList, CourseHome, CourseOutline, CourseResources,
  type CourseSection
} from "@/app/studio/course-navigation";
import { CourseMedia } from "@/app/studio/course-media";
import { LessonText } from "@/app/studio/lesson-text";
import { LaunchPortfolioRubricReview } from "@/app/studio/launch-portfolio-rubric";
import { sortCourseActivities } from "@/app/studio/activity-order";
import { reviewCourseData } from "./review-course-data";
import type { CourseActivity, RubricCriterion } from "@/lib/course-types";

type ReviewSection = Extract<CourseSection, "home" | "modules" | "assignments" | "resources" | "discussions" | "quiz" | "evaluation">;
const modules = reviewCourseData.modules;
const activities: CourseActivity[] = reviewCourseData.activities;
const criteria: RubricCriterion[] = reviewCourseData.criteria;
const quiz = reviewCourseData.quiz;
const survey = [
  "The course explained what I would be able to do.",
  "I could find the next activity without help.",
  "The resources were readable and easy to use.",
  "The Gauntlet helped me compare possible projects.",
  "The Direction Brief helped me choose a focused project.",
  "First Move Studio helped me design a useful first test.",
  "Feedback helped me make or justify a change.",
  "The assignment criteria made expectations clear.",
  "I could complete the work with the resources available to me.",
  "I can apply this approach to a project outside this course.",
  "What would make this course better? (Optional)"
];

const nav: { id: ReviewSection; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "modules", label: "Modules" },
  { id: "assignments", label: "Assignments" },
  { id: "resources", label: "Resources" },
  { id: "discussions", label: "Discussions" },
  { id: "quiz", label: "Quiz" },
  { id: "evaluation", label: "Evaluation" }
];

export function ReviewStudio() {
  const orderedActivities = useMemo(
    () => modules.flatMap(module =>
      sortCourseActivities(activities.filter(activity => activity.module_id === module.id), criteria)),
    []
  );
  const [section, setSection] = useState<ReviewSection>("home");
  const [selectedId, setSelectedId] = useState("");
  const selected = orderedActivities.find(activity => activity.id === selectedId);
  const selectedCriteria = criteria.filter(item => item.activity_id === selectedId);
  const portfolio = selected?.slug === "launch-portfolio";
  const selectedIndex = selected ? orderedActivities.findIndex(item => item.id === selectedId) : -1;

  function openActivity(id: string) {
    setSelectedId(id);
    setSection("modules");
    window.scrollTo({ top: 0, behavior: "instant" });
  }
  function openSection(id: ReviewSection) {
    setSection(id);
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  return (
    <main id="review-main" className="page-wrap studio-container faculty-review">
      <div className="studio-top">
        <div>
          <p className="eyebrow">Open World Learning Lab · Faculty review</p>
          <h1>{reviewCourseData.title}</h1>
          <p className="course-small">Read-only view of the published Project Launch Lab instructional experience.</p>
        </div>
        <p className="review-status" role="status">Course review · No sign-in required</p>
      </div>
      <p className="preview-banner review-banner">
        <strong>Faculty review mode.</strong> This uses the same module navigation, lesson renderer, media and interactive learning
        components as the enrolled OWLL course. You may inspect and try guided practice, but work is not submitted, graded,
        saved to a learner account or shared with the facilitator. Private discussions, submissions, grading, answer keys,
        and administrative controls are excluded.
      </p>
      <div className="course-layout">
        <nav className="course-navigation" aria-label="Course navigation">
          {nav.map(item =>
            <button key={item.id} type="button" aria-current={section === item.id ? "page" : undefined}
              onClick={() => openSection(item.id)}>{item.label}</button>
          )}
        </nav>
        <div className="course-content">
          {section === "home" && <CourseHome
            description={reviewCourseData.description} modules={modules}
            activities={orderedActivities} submissions={[]} feedback={[]}
            instructor={true} review={true} criteria={criteria}
            onOpen={openActivity} onModules={() => openSection("modules")} />}
          {section === "modules" && <div className="module-reader">
            <CourseOutline modules={modules} activities={orderedActivities} criteria={criteria}
              selectedId={selectedId} portfolioOpen={false} onOpen={openActivity} />
            <section className="studio-work" aria-label="Lesson content">
              {!selected && <div className="studio-panel"><h2>Choose a lesson</h2>
                <p>Begin with Module 1 or select any activity from the module pathway to review its instructional content.</p>
                <button type="button" className="feedback-button" onClick={() => openActivity(orderedActivities[0].id)}>Begin Module 1</button>
              </div>}
              {selected && <div className="studio-panel">
                <h2>{selected.title}</h2>
                <ActivityPacing slug={selected.slug} />
                <LessonText key={selected.id} text={selected.instructions} review={true} headingLevel={3} />
                {selectedCriteria.length > 0 && <section aria-label="Assignment rubric">
                  <h3>How your work will be evaluated</h3>
                  <ul>{selectedCriteria.map(item =>
                    <li key={item.id}><strong>{item.title} ({item.maximum_points} points)</strong> — {item.description}</li>)}
                  </ul>
                  {portfolio && <LaunchPortfolioRubricReview onHold={true} />}
                  <p className="form-note">Scoring and submissions are unavailable in faculty review mode.</p>
                </section>}
              </div>}
              {selectedIndex >= 0 && <nav className="studio-actions review-lesson-controls" aria-label="Lesson navigation">
                <button type="button" className="secondary-button" disabled={selectedIndex === 0}
                  onClick={() => openActivity(orderedActivities[selectedIndex - 1].id)}>Previous lesson</button>
                <button type="button" className="feedback-button"
                  onClick={() => selectedIndex < orderedActivities.length - 1
                    ? openActivity(orderedActivities[selectedIndex + 1].id)
                    : openSection("assignments")}>
                  {selectedIndex < orderedActivities.length - 1 ? "Next lesson" : "Review assignments"}
                </button>
              </nav>}
            </section>
          </div>}
          {section === "assignments" && <section aria-label="Assignment and rubric review">
            <AssignmentList activities={orderedActivities} criteria={criteria} submissions={[]}
              feedback={[]} scores={[]} portfolioOpen={false} onOpen={openActivity} showFeedback={false} />
            <h2>Launch Portfolio · 60-point rubric</h2>
            <p>Four criteria, each worth 15 points, with published performance descriptors. The assessment remains under its existing scoring hold.</p>
            <LaunchPortfolioRubricReview onHold={true} />
            <p className="form-note">Select an assignment above to see the authentic learner directions in its module.</p>
          </section>}
          {section === "resources" && <section aria-labelledby="review-resources-heading">
            <h2 id="review-resources-heading">Course resources</h2>
            <p>Approved instructional media with captions, transcripts, and a blank working checklist.</p>
            <CourseMedia item="overview" review={true} />
            <CourseMedia item="direction" review={true} />
            <CourseMedia item="firstmove" review={true} />
            <p><a href="/review-materials/project-launch-worksheets.txt" target="_blank" rel="noopener noreferrer">
              Open blank Project Launch worksheets and first-action checklist</a></p>
            <CourseResources activities={orderedActivities} />
          </section>}
          {section === "discussions" && <section aria-labelledby="review-discussions-heading">
            <h2 id="review-discussions-heading">Facilitated discussions</h2>
            <p>The enrolled course includes Course questions and peer exchange spaces. Their purpose is to support learner
              questions, feedback and reflection. Actual discussion posts and participant identities are private and not shown here.</p>
          </section>}
          {section === "quiz" && <section aria-labelledby="review-quiz-heading">
            <h2 id="review-quiz-heading">Learning assessment · Kirkpatrick Level 2</h2>
            <p>Knowledge is checked through ten authored questions. Skills are assessed through the Direction Brief, First Move practice, and Launch Portfolio. Attitudes, confidence, willingness to revise, and commitment are explored in Your Next Move.</p>
            <h3>Knowledge check · 10 questions</h3>
            <p>Choose the answer that best reflects the learning in Project Launch Lab. These are read-only assessment previews; correct answers, response data and scoring are not exposed.</p>
            <ol className="review-questions">
              {quiz.map(question => <li key={question.position}>
                <strong>{question.prompt}</strong>
                <ol type="A">{question.options.map((option, index) => <li key={index}>{option}</li>)}</ol>
              </li>)}
            </ol>
            <h3>Attitudes, confidence & commitment · Your Next Move</h3>
            <p>Ungraded reflection following the Level 2 knowledge and performance assessments.</p>
            <ol>
              <li>How confident are you that you could narrow a big idea to one first action that fits your time and resources? Rate 1–5 and explain your rating.</li>
              <li>If a small test gives an unexpected result, how willing would you be to revisit your plan? Rate 1–5 and identify a barrier to revision.</li>
              <li>Which next move feels realistic within the next week? Choose a safe first action, ask for feedback or permission, identify a resource or barrier, or reconsider your direction. Name a small step or explain a genuine barrier.</li>
              <li>A club wants to create a huge mural, has one hour, and lacks permission to paint a wall. What would you check first to find a relevant, feasible, focused way to learn something?</li>
            </ol>
            <button type="button" className="secondary-button" onClick={() => {
              const reflection = orderedActivities.find(item => item.slug === "your-next-move-reflection");
              if (reflection) openActivity(reflection.id);
            }}>Open the interactive reflection in Module 2</button>
          </section>}
          {section === "evaluation" && <section aria-labelledby="review-evaluation-heading">
            <h2 id="review-evaluation-heading">Course evaluation · Kirkpatrick Level 1</h2>
            <p>This end-of-course survey asks learners how useful, understandable, accessible and applicable their learning experience was.
              The first ten questions use a five-point agreement rating; the final question is optional and open-ended.</p>
            <ol className="review-questions">
              {survey.map((prompt, index) => <li key={index}>
                <strong>{prompt}</strong>
                <p className="course-small">{index < 10 ? "Rating: 1 = strongly disagree · 5 = strongly agree" : "Optional open-ended feedback"}</p>
              </li>)}
            </ol>
            <p className="form-note">Faculty review mode does not collect responses. The actual course evaluation is available to enrolled learners.</p>
          </section>}
        </div>
      </div>
    </main>
  );
}
