"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ActivityPacing, LessonContext, CourseHome, CourseOutline, AssignmentList, CourseResources, type CourseSection } from "./course-navigation";
import { CourseQuiz } from "./course-quiz";
import { Discussions } from "./discussions";
import { CourseEvaluation } from "./course-evaluation";
import { ModuleEditor } from "./module-editor";
import { LessonText } from "./lesson-text";
import { LessonEditor } from "./lesson-editor";
import { RubricEditor } from "./rubric-editor";
import { academicLaunchPortfolioPointBands, compareLaunchPortfolioRubric, LaunchPortfolioPreparation, LaunchPortfolioRubricReview } from "./launch-portfolio-rubric";
import { sortCourseActivities, activityExpectsResponse } from "./activity-order";
import { browserSupabase } from "@/lib/supabase-browser";
import type {
  CourseMembership, CourseActivity, LearnerDraft, LearnerSubmission,
  RubricCriterion, PublishedFeedback, CriterionScore
} from "@/lib/course-types";

type LoadState = "loading" | "signed-out" | "unenrolled" | "ready" | "unconfigured" | "error";

export default function StudioPage() {
  const supabase = useMemo(() => {
    try { return browserSupabase(); }
    catch { return null; }
  }, []);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [section, setSection] = useState<CourseSection>("home");
  const [studentPreview, setStudentPreview] = useState(false);
  const [courseDescription, setCourseDescription] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [identity, setIdentity] = useState("");
  const [membership, setMembership] = useState<CourseMembership | null>(null);
  const [activities, setActivities] = useState<CourseActivity[]>([]);
  const [modules, setModules] = useState<{ id: string; title: string; module_number: number; is_published: boolean }[]>([]);
  const [drafts, setDrafts] = useState<LearnerDraft[]>([]);
  const [submissions, setSubmissions] = useState<LearnerSubmission[]>([]);
  const [feedbackRows, setFeedbackRows] = useState<PublishedFeedback[]>([]);
  const [criteria, setCriteria] = useState<RubricCriterion[]>([]);
  const [scores, setScores] = useState<CriterionScore[]>([]);
  const [portfolioOpen, setPortfolioOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState("");
  const [response, setResponse] = useState("");
  const [structuredDirty, setStructuredDirty] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [pointInputs, setPointInputs] = useState<Record<string, string>>({});
  const [noteInputs, setNoteInputs] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    if (!supabase) { setLoadState("unconfigured"); return; }
    const selectedCourseId = new URLSearchParams(window.location.search).get("course");
    if (!selectedCourseId) { window.location.replace("/courses"); return; }
    try {
      const userResult = await supabase.auth.getUser();
      if (userResult.error || !userResult.data.user) {
        setLoadState("signed-out");
        return;
      }
      const currentUser = userResult.data.user;
      setIdentity(currentUser.id);
      const membershipResult = await supabase
        .from("pll_memberships")
        .select("course_id,user_id,member_role")
        .eq("course_id", selectedCourseId)
        .eq("user_id", currentUser.id)
        .maybeSingle();
      if (membershipResult.error) throw membershipResult.error;
      const currentMembership = membershipResult.data as CourseMembership | null;
      if (!currentMembership) {
        setLoadState("unenrolled");
        return;
      }
      setMembership(currentMembership);
      const courseId = currentMembership.course_id;
      const courseResult = await supabase.from("pll_courses").select("title,description").eq("id", courseId).single();
      if (courseResult.error) throw new Error(courseResult.error.message);
      setCourseTitle(courseResult.data.title);
      setCourseDescription(courseResult.data.description);
      const [moduleResult, activityResult, draftResult, submissionResult, feedbackResult, criteriaResult, scoresResult, portfolioResult] =
        await Promise.all([
          supabase.from("pll_modules").select("id,title,module_number,is_published")
            .eq("course_id", courseId).order("module_number"),
          supabase.from("pll_activities")
            .select("id,course_id,module_id,title,slug,instructions,is_published")
            .eq("course_id", courseId).order("title"),
          supabase.from("pll_drafts")
            .select("id,activity_id,learner_id,response_text,updated_at")
            .eq("course_id", courseId),
          supabase.from("pll_submissions")
            .select("id,activity_id,course_id,learner_id,response_text,submitted_at")
            .eq("course_id", courseId).order("submitted_at", { ascending: false }),
          supabase.from("pll_feedback")
            .select("id,submission_id,summary,published_at")
            .eq("course_id", courseId),
          supabase.from("pll_rubric_criteria")
            .select("id,activity_id,course_id,position,title,description,maximum_points")
            .eq("course_id", courseId).order("position"),
          supabase.from("pll_rubric_scores")
            .select("id,submission_id,criterion_id,awarded_points,criterion_note")
            .eq("course_id", courseId),
          supabase.rpc("pll_portfolio_is_open", { p_course_id: courseId })
        ]);
      for (const result of [moduleResult, activityResult, draftResult, submissionResult, feedbackResult, criteriaResult, scoresResult]) {
        if (result.error) throw result.error;
      }
      setModules(moduleResult.data ?? []);
      setActivities((activityResult.data ?? []) as CourseActivity[]);
      setDrafts((draftResult.data ?? []) as LearnerDraft[]);
      setSubmissions((submissionResult.data ?? []) as LearnerSubmission[]);
      setFeedbackRows((feedbackResult.data ?? []) as PublishedFeedback[]);
      setCriteria((criteriaResult.data ?? []) as RubricCriterion[]);
      setScores((scoresResult.data ?? []) as CriterionScore[]);
      setPortfolioOpen(!portfolioResult.error && portfolioResult.data === true);
      setLoadState("ready");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not load the course.");
      setLoadState("error");
    }
  }, [supabase]);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => { if (!cancelled) void refresh(); });
    return () => { cancelled = true; };
  }, [refresh]);

  const isInstructor = membership?.member_role === "facilitator";
  const visibleModules = modules.filter(item => !studentPreview || item.is_published);
  const visibleActivities = activities.filter(activity => !studentPreview ||
    (activity.is_published && visibleModules.some(item => item.id === activity.module_id)));
  const orderedActivities = visibleModules.flatMap(item => sortCourseActivities(
    visibleActivities.filter(activity => activity.module_id === item.id), criteria
  ));
  const readableActivity = visibleActivities.find(activity => activity.id === selectedActivity);
  const ownSubmissions = submissions.filter(item => item.learner_id === identity);

  const activeActivity = activities.find((activity) => activity.id === selectedActivity);
  const activeDraft = drafts.find((draft) => draft.activity_id === activeActivity?.id && draft.learner_id === identity);
  const finalSubmission = submissions.find(
    (submission) => submission.activity_id === activeActivity?.id && submission.learner_id === identity
  );
  const finalFeedback = feedbackRows.find((feedback) => feedback.submission_id === finalSubmission?.id);
  const assignedCriteria = criteria.filter((criterion) => criterion.activity_id === activeActivity?.id);
  const reviewSubmission = submissions.find((submission) => submission.id === selectedSubmission);
  const reviewActivity = activities.find((activity) => activity.id === reviewSubmission?.activity_id);
  const reviewCriteria = criteria.filter((criterion) => criterion.activity_id === reviewSubmission?.activity_id);
  const existingReview = feedbackRows.find((feedback) => feedback.submission_id === selectedSubmission);
  // Keep Portfolio submission and scoring held until the assessment is approved for release.
  // This is a UI safeguard, not a substitute for server-side release controls.
  const portfolioAssignmentRubric = activeActivity?.slug === "launch-portfolio" ? compareLaunchPortfolioRubric(assignedCriteria) : null;
  const portfolioRubricComparison = reviewActivity?.slug === "launch-portfolio" ? compareLaunchPortfolioRubric(reviewCriteria) : null;
  const portfolioSubmissionOnHold = portfolioAssignmentRubric !== null && !(portfolioOpen && portfolioAssignmentRubric.matchesAcademicDraft);
  const portfolioReviewOnHold = portfolioRubricComparison !== null && !(portfolioOpen && portfolioRubricComparison.matchesAcademicDraft);

  useEffect(() => {
    if (section !== "modules" || !selectedActivity) return;
    const heading = document.getElementById("studio-lesson-title");
    heading?.focus({ preventScroll: true });
    heading?.scrollIntoView?.({ block: "start", behavior: "instant" });
  }, [section, selectedActivity]);

  const unsavedResponse = !isInstructor && !!activeActivity && !finalSubmission &&
    response !== (activeDraft?.response_text ?? "");

  useEffect(() => {
    if (!unsavedResponse && !structuredDirty) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [unsavedResponse, structuredDirty]);

  function canLeaveResponse() {
    if (busy) return false;
    return !(unsavedResponse || structuredDirty) || window.confirm("You have unsaved changes in your course work. Leave without saving? Choose Cancel to keep working or save your draft first.");
  }

  function chooseActivity(id: string) {
    setStructuredDirty(false);
    setSelectedActivity(id);
    const matching = drafts.find((draft) => draft.activity_id === id && draft.learner_id === identity);
    setResponse(matching?.response_text ?? "");
    setNotice("");
    setError("");
  }

  function chooseSubmission(id: string) {
    setSelectedSubmission(id);
    const previous = feedbackRows.find((feedback) => feedback.submission_id === id);
    setReviewText(previous?.summary ?? "");
    const stored = scores.filter((item) => item.submission_id === id);
    setPointInputs(Object.fromEntries(stored.map((item) => [item.criterion_id, String(item.awarded_points)])));
    setNoteInputs(Object.fromEntries(stored.map((item) => [item.criterion_id, item.criterion_note])));
    setNotice("");
    setError("");
  }

  async function saveDraft() {
    if (!supabase || !membership || !activeActivity || !identity || finalSubmission) return;
    setBusy(true); setError(""); setNotice("");
    try {
      if (activeDraft) {
        const { error: dbError } = await supabase.from("pll_drafts")
          .update({ response_text: response, updated_at: new Date().toISOString() })
          .eq("id", activeDraft.id);
        if (dbError) throw dbError;
      } else {
        const { error: dbError } = await supabase.from("pll_drafts")
          .insert({
            activity_id: activeActivity.id,
            course_id: membership.course_id,
            learner_id: identity,
            response_text: response
          });
        if (dbError) throw dbError;
      }
      await refresh();
      setNotice("Your draft was saved.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Draft could not be saved.");
    } finally { setBusy(false); }
  }

  async function submitFinal() {
    if (!supabase || !membership || !activeActivity || !identity || finalSubmission) return;
    if (portfolioSubmissionOnHold) {
      setError("Launch Portfolio final submission is temporarily on hold while the academic rubric and faculty review are reconciled. You can still save a draft.");
      return;
    }
    if (!response.trim()) { setError("Please write your explanation before submitting."); return; }
    if (structuredDirty) { setError("Save your structured activity draft before sharing the final response."); return; }
    if (!window.confirm("Submit this response for facilitator review? Final submissions cannot be edited.")) return;
    setBusy(true); setError(""); setNotice("");
    try {
      const { error: dbError } = await supabase.from("pll_submissions").insert({
        activity_id: activeActivity.id,
        course_id: membership.course_id,
        learner_id: identity,
        response_text: response.trim()
      });
      if (dbError) throw dbError;
      await refresh();
      setNotice("Your response was submitted successfully.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Submission failed.");
    } finally { setBusy(false); }
  }

  async function publishReview() {
    if (!supabase || !reviewSubmission) return;
    if (portfolioReviewOnHold) {
      setError("Launch Portfolio scoring is on hold pending rubric reconciliation and faculty approval. No scores were published.");
      return;
    }
    if (!reviewText.trim()) { setError("Add written feedback before publishing."); return; }
    const rubricScores = reviewCriteria.map((criterion) => ({
      criterion_id: criterion.id,
      points: Number(pointInputs[criterion.id]),
      note: noteInputs[criterion.id] ?? ""
    }));
    if (rubricScores.some((value, i) =>
      pointInputs[value.criterion_id]?.trim() === "" ||
      pointInputs[value.criterion_id] === undefined ||
      !Number.isFinite(value.points) || value.points < 0 ||
      value.points > reviewCriteria[i].maximum_points ||
      (portfolioRubricComparison !== null && !academicLaunchPortfolioPointBands.some(points => points === value.points))
    )) {
      setError("Give each rubric criterion a valid score within its maximum.");
      return;
    }
    const formative = reviewCriteria.length === 0;
    if (!window.confirm(formative
      ? "Publish this ungraded feedback to the learner?"
      : "Publish the rubric scores and written feedback to this learner?")) return;
    setBusy(true); setError(""); setNotice("");
    try {
      const { error: publishError } = formative
        ? await supabase.rpc("pll_publish_formative_feedback", {
          p_submission_id: reviewSubmission.id,
          p_summary: reviewText.trim()
        })
        : await supabase.rpc("pll_publish_review", {
          p_submission_id: reviewSubmission.id,
          p_summary: reviewText.trim(),
          p_scores: rubricScores
        });
      if (publishError) throw publishError;
      await refresh();
      setNotice(formative ? "Your formative feedback is now available to the learner."
        : "All rubric scores and feedback were published together.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The review was not published.");
    } finally { setBusy(false); }
  }

  async function signOut() {
    if (!supabase || !canLeaveResponse()) return;
    await supabase.auth.signOut();
    setMembership(null);
    window.location.replace("/login");
  }

  if (loadState === "loading") return <StudioFrame><p>Opening your studio…</p></StudioFrame>;
  if (loadState === "unconfigured") return <StudioFrame><p role="alert">The secure LMS is not yet configured for this deployment. Set the public Supabase URL and publishable key.</p></StudioFrame>;
  if (loadState === "signed-out") return <StudioFrame><h1>Welcome back.</h1><p>Sign in to see your course and feedback.</p><Link href="/login" className="primary-link">Sign in <span aria-hidden="true">↗</span></Link></StudioFrame>;
  if (loadState === "unenrolled") return <StudioFrame><h1>Course access unavailable</h1><p>Your account does not have access to this course.</p><button type="button" onClick={signOut} className="text-button">Sign out</button></StudioFrame>;
  if (loadState === "error") return <StudioFrame><p role="alert" className="form-error">{error}</p><button type="button" onClick={() => void refresh()} className="feedback-button">Try again</button></StudioFrame>;
  if (!membership) return null;

  function openActivity(id: string) {
    if (id !== selectedActivity) {
      if (!canLeaveResponse()) return;
      chooseActivity(id);
    }
    setSection("modules");
  }

  function openSection(next: CourseSection) {
    if (next === section) return;
    if (!canLeaveResponse()) return;
    if (unsavedResponse) setResponse(activeDraft?.response_text ?? "");
    setStructuredDirty(false);
    setSection(next);
  }

  function togglePreview() {
    setStudentPreview(previous => !previous);
    setSection("home");
    setSelectedActivity("");
    setNotice("");
    setError("");
  }

  const sectionLinks = [{ id: "home", label: "Home" }, { id: "modules", label: "Modules" }, { id: "assignments", label: "Assignments" }, { id: "resources", label: "Resources" }, { id: "discussions", label: "Discussions" }, { id: "quiz", label: "Quiz" }, { id: "evaluation", label: "Evaluation" }, { id: "feedback", label: isInstructor && !studentPreview ? "Review submissions" : "Feedback" }, ...(isInstructor && !studentPreview ? [{ id: "manage", label: "Edit course" }] : [])];

  return (
    <StudioFrame>
      <div className="studio-top">
        <div>
          <p className="eyebrow">{isInstructor ? "Instructor" : "Student"}</p>
          <h1>{courseTitle}</h1>
        </div>
        <div className="studio-actions">
          {isInstructor && <button type="button" className="secondary-button" onClick={togglePreview}>
            {studentPreview ? "Exit Student Preview" : "Student Preview"}
          </button>}
          <Link href="/account" className="text-button" onClick={event => { if (!canLeaveResponse()) event.preventDefault(); }}>Account settings</Link>
          <button className="text-button" onClick={signOut} type="button">Sign out</button>
        </div>
      </div>
      {studentPreview && <p role="status" className="preview-banner">
        Student Preview · Published course content. Use a Student account to test submissions and grades.
      </p>}
      {notice && <p role="status" className="form-success">{notice}</p>}
      {error && <p role="alert" className="form-error">{error}</p>}
      <div className="course-layout">
        <nav aria-label="Course navigation" className="course-navigation">
          {sectionLinks.map(item => <button key={item.id} type="button"
            aria-current={section === item.id ? "page" : undefined}
            onClick={() => openSection(item.id as CourseSection)}>{item.label}</button>)}
        </nav>
        <div className="course-content">
          {section === "home" && <CourseHome description={courseDescription} modules={visibleModules}
            activities={orderedActivities} submissions={ownSubmissions} criteria={criteria}
            feedback={feedbackRows} instructor={isInstructor} onOpen={openActivity} onModules={() => openSection("modules")} />}
          {section === "modules" && (
            <div className="module-reader">
              <CourseOutline modules={visibleModules} activities={orderedActivities} criteria={criteria}
                selectedId={selectedActivity} portfolioOpen={portfolioOpen} onOpen={openActivity} />
              <section className="studio-work" aria-label="Lesson content">
                {!readableActivity && <p>Choose a lesson from the module list.</p>}
          {activeActivity && readableActivity && (
            <div className="studio-panel">
              <h3 id="studio-lesson-title" tabIndex={-1}>{activeActivity.title}</h3>
              <LessonContext modules={visibleModules} activities={orderedActivities} activity={activeActivity} criteria={criteria} />
              {orderedActivities.some(activity => activity.slug === "module-one-introduction") &&
                <ActivityPacing slug={activeActivity.slug} />}
              <LessonText key={activeActivity.id} text={activeActivity.instructions}
                finalized={Boolean(finalSubmission) && !isInstructor} onStructuredDirty={setStructuredDirty}
                lessonProgress={!isInstructor ? {
                  courseId: membership.course_id,
                  activityId: activeActivity.id,
                  learnerId: identity
                } : undefined}
                onPrepareResponse={!isInstructor && !finalSubmission ? (prepared) => {
                  if (prepared.length > 20000) {
                    window.alert("This lesson draft exceeds the 20,000-character course response limit. Shorten it before preparing a course response, and keep a private copy if needed.");
                    return false;
                  }
                  if (response.trim() && !window.confirm("Replace the text in your course response box with this lesson work? Save any draft you want to keep first.")) return false;
                  setResponse(prepared);
                  return true;
                } : undefined} />
              {portfolioAssignmentRubric && <LaunchPortfolioPreparation />}
              {assignedCriteria.length > 0 && !portfolioAssignmentRubric && <>
              <h4>How your work will be evaluated</h4>
              <ul>{assignedCriteria.map(c => <li key={c.id}><strong>{c.title} ({c.maximum_points} points)</strong> — {c.description}</li>)}</ul></>}
              {portfolioSubmissionOnHold && <p className="preview-banner" role="status">
                <strong>Launch Portfolio submission on hold.</strong> {portfolioAssignmentRubric?.matchesAcademicDraft
                  ? "The academic 60-point rubric is configured. Final submissions and scores are awaiting release approval."
                  : "The obsolete rubric is hidden while the academic 60-point rubric is being configured."} {!isInstructor && "You may work on your response and save a draft, but final submission is unavailable."}
              </p>}
              {portfolioAssignmentRubric && (portfolioAssignmentRubric.matchesAcademicDraft || (isInstructor && !studentPreview)) &&
                <LaunchPortfolioRubricReview onHold={portfolioSubmissionOnHold} />}
              {!isInstructor && (finalSubmission ? (
                <>
                  <p className="form-success">Submitted {new Date(finalSubmission.submitted_at).toLocaleString()}.</p>
                  <h4>{assignedCriteria.length > 0 ? "Your submitted explanation" : "Your shared practice reflection"}</h4>
                  <p className="prewrap">{finalSubmission.response_text}</p>
                  {finalFeedback?.published_at ? (
                    <div className="review-output">
                      <h4>{assignedCriteria.length > 0 ? "Facilitator feedback and scores" : "Facilitator feedback (ungraded)"}</h4>
                      <p className="prewrap">{finalFeedback.summary}</p>
                      {assignedCriteria.length > 0 && <ul>{scores.filter(s => s.submission_id === finalSubmission.id).map(s => {
                        const criterion = assignedCriteria.find(c => c.id === s.criterion_id);
                        return <li key={s.id}><strong>{criterion?.title ?? "Criterion"}: {s.awarded_points}/{criterion?.maximum_points ?? "?"}</strong> {s.criterion_note}</li>;
                      })}</ul>}
                    </div>
                  ) : <p>Feedback will appear here when your facilitator publishes it.</p>}
                </>
              ) : (
                <>
                  {assignedCriteria.length === 0 && <p className="form-note">{activityExpectsResponse(activeActivity, criteria)
                     ? "Ungraded practice. You can save a working reflection or share it for facilitator feedback. Sharing is final; you can keep revising a saved draft until then. Only share what you feel comfortable putting in your course record."
                     : "This is instructional material or guided practice; no final shared response is required. Use the next lesson when ready. You may save optional notes or share a question, but sharing creates a final course record."}</p>}
                  <label htmlFor="learner-response">{assignedCriteria.length > 0 ? "Your project reasoning or response" : "Your practice reflection or question for feedback"}</label>
                  <textarea id="learner-response" value={response} onChange={(e) => setResponse(e.target.value)}
                    rows={9} maxLength={20000} placeholder="Explain your choices, constraints, and what you would do next…" />
                  {unsavedResponse && <p className="form-note">Unsaved response changes. Save draft before leaving if you want to keep them.</p>}
                  {structuredDirty && <p className="form-note" role="status">Save your structured activity draft above before sharing your final response.</p>}
                  <div className="studio-actions">
                    <button disabled={busy} type="button" onClick={() => void saveDraft()} className="secondary-button">
                      {busy ? "Working…" : "Save draft"}
                    </button>
                    <button disabled={busy || !response.trim() || portfolioSubmissionOnHold || structuredDirty} type="button" onClick={() => void submitFinal()} className="feedback-button">
                      {assignedCriteria.length > 0 ? "Submit final response" : "Share with facilitator (final)"}
                    </button>
                  </div>
                </>
              ))}
              {isInstructor && assignedCriteria.length > 0 && <p className="form-note">Use a Student account to save and submit work for this assignment.</p>}
            </div>
          )}

                {readableActivity && <nav className="studio-actions" aria-label="Lesson navigation">
                  {orderedActivities.findIndex(item => item.id === selectedActivity) > 0 && (
                    <button type="button" className="secondary-button" onClick={() => {
                      const index = orderedActivities.findIndex(item => item.id === selectedActivity);
                      openActivity(orderedActivities[index - 1].id);
                    }}>Previous lesson</button>
                  )}
                  {orderedActivities.findIndex(item => item.id === selectedActivity) < orderedActivities.length - 1 && (
                    <button type="button" className="feedback-button" onClick={() => {
                      const index = orderedActivities.findIndex(item => item.id === selectedActivity);
                      openActivity(orderedActivities[index + 1].id);
                    }}>Next lesson</button>
                  )}
                </nav>}
              </section>
            </div>
          )}
          {section === "assignments" && <AssignmentList activities={orderedActivities} criteria={criteria}
            submissions={isInstructor ? [] : ownSubmissions} feedback={feedbackRows} scores={scores} portfolioOpen={portfolioOpen} onOpen={openActivity} showFeedback={false} />}
          {section === "feedback" && (isInstructor && !studentPreview ? (
        <section className="studio-work" aria-labelledby="reviews-heading">
          <h2 id="reviews-heading">Learner submissions</h2>
          {submissions.length === 0 ? <p>No learner submissions yet. Shared learner work will appear here when it is ready for review.</p> : (
            <>
              <label htmlFor="submission-choice">Submission to review</label>
              <select id="submission-choice" value={selectedSubmission} onChange={e => chooseSubmission(e.target.value)}>
                <option value="">Choose a submission</option>
                {submissions.map(s => <option key={s.id} value={s.id}>
                  {activities.find(a=>a.id===s.activity_id)?.title ?? "Activity"} · learner {s.learner_id.slice(0,8)} · {new Date(s.submitted_at).toLocaleDateString()}
                </option>)}
              </select>
            </>
          )}
          {reviewSubmission && (
            <div className="studio-panel">
              <h3>{reviewActivity?.title ?? "Assignment review"}</h3>
              {portfolioReviewOnHold && <div className="preview-banner" role="status">
                <strong>Launch Portfolio scoring on hold.</strong> Faculty review of the assessment contract is still pending. The academic design proposes four criteria totaling 60 points; this configured rubric totals {portfolioRubricComparison?.actualTotal ?? "unknown"} points.
                {portfolioRubricComparison?.matchesAcademicDraft && <span> Even a matching draft rubric cannot be used for grading until the academic approval gate is closed.</span>}
                <p>No grade can be published through this draft interface while the hold is active.</p>
              </div>}
              <p className="eyebrow">Learner explanation</p>
              <p className="prewrap">{reviewSubmission.response_text}</p>
              {reviewCriteria.length > 0 ? <h4>Score each criterion</h4> : <p className="form-note">Ungraded practice. Respond to the learner&apos;s reasoning with specific, useful feedback. This activity has no points or rubric score.</p>}
              {reviewCriteria.map(c => (
                <div className="criterion-editor" key={c.id}>
                  <label htmlFor={`score-${c.id}`}>{c.title} — maximum {c.maximum_points} points</label>
                  <p>{c.description}</p>
                  {portfolioRubricComparison ? (
                    <select id={`score-${c.id}`} disabled={portfolioReviewOnHold}
                      value={pointInputs[c.id] ?? ""} onChange={e => setPointInputs(prev => ({...prev, [c.id]: e.target.value}))}>
                      <option value="">Select a performance level</option>
                      {academicLaunchPortfolioPointBands.map(points => <option key={points} value={points}>{points} points</option>)}
                    </select>
                  ) : <input type="number" min="0" max={c.maximum_points} step="0.01" id={`score-${c.id}`}
                    value={pointInputs[c.id] ?? ""} onChange={e => setPointInputs(prev=>({...prev,[c.id]:e.target.value}))} />}
                  <label htmlFor={`note-${c.id}`}>Criterion feedback (optional)</label>
                  <textarea id={`note-${c.id}`} rows={2} maxLength={4000}
                    value={noteInputs[c.id] ?? ""} onChange={e => setNoteInputs(prev=>({...prev,[c.id]:e.target.value}))} />
                </div>
              ))}
              <label htmlFor="review-summary">{reviewCriteria.length > 0 ? "Overall feedback" : "Formative feedback"}</label>
              <textarea id="review-summary" rows={5} maxLength={12000} value={reviewText}
                onChange={e => setReviewText(e.target.value)}
                placeholder="Explain the reasoning the learner demonstrated and identify a useful next step." />
              <div className="studio-actions">
                <button type="button" className="feedback-button" disabled={busy || !reviewText.trim() || portfolioReviewOnHold}
                  onClick={() => void publishReview()}>
                  {busy ? "Publishing…" : existingReview?.published_at ? "Update published review" : reviewCriteria.length === 0 ? "Publish formative feedback" : "Publish complete review"}
                </button>
              </div>
              {existingReview?.published_at && <p className="form-success">Review last published {new Date(existingReview.published_at).toLocaleString()}.</p>}
            </div>
          )}
        </section>
          ) : <AssignmentList activities={orderedActivities} criteria={criteria} submissions={ownSubmissions}
            feedback={feedbackRows} scores={scores} portfolioOpen={portfolioOpen} onOpen={openActivity} showFeedback={true} />)}
          {section === "resources" && <CourseResources activities={orderedActivities} onOpen={openActivity} />}
          {section === "discussions" && supabase && <Discussions supabase={supabase}
            courseId={membership.course_id} identity={identity} preview={studentPreview} />}
          {section === "quiz" && supabase && <CourseQuiz supabase={supabase}
            courseId={membership.course_id} identity={identity} instructor={isInstructor} preview={studentPreview} />}
          {section === "evaluation" && supabase && <CourseEvaluation supabase={supabase}
            courseId={membership.course_id} instructor={isInstructor} preview={studentPreview} />}
          {section === "manage" && isInstructor && !studentPreview && supabase && <>
            <h2>Edit course</h2>
            <ModuleEditor supabase={supabase} courseId={membership.course_id} modules={modules} refresh={refresh} />
            <LessonEditor supabase={supabase} courseId={membership.course_id} activities={activities}
              modules={modules} refresh={refresh} />
            <RubricEditor supabase={supabase} activities={activities} criteria={criteria} refresh={refresh} />
          </>}
        </div>
      </div>
    </StudioFrame>
  );
}

function StudioFrame({children}: {children: React.ReactNode}) {
  return (
    <>
      <a className="skip" href="#studio-main">Skip to studio content</a>
      <header className="site-header">
        <div className="brand"><span className="brand-mark" aria-hidden="true">✳</span>
          <div><strong>Open World Learning Lab</strong></div>
        </div>
        <nav aria-label="Navigation"><Link href="/courses">My Courses</Link></nav>
      </header>
      <main className="page-wrap studio-container" id="studio-main" tabIndex={-1}>{children}</main>
    </>
  );
}
