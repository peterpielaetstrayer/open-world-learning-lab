"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { LessonEditor } from "./lesson-editor";
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
  const [identity, setIdentity] = useState("");
  const [membership, setMembership] = useState<CourseMembership | null>(null);
  const [activities, setActivities] = useState<CourseActivity[]>([]);
  const [modules, setModules] = useState<{ id: string; title: string; module_number: number; is_published: boolean }[]>([]);
  const [drafts, setDrafts] = useState<LearnerDraft[]>([]);
  const [submissions, setSubmissions] = useState<LearnerSubmission[]>([]);
  const [feedbackRows, setFeedbackRows] = useState<PublishedFeedback[]>([]);
  const [criteria, setCriteria] = useState<RubricCriterion[]>([]);
  const [scores, setScores] = useState<CriterionScore[]>([]);
  const [selectedActivity, setSelectedActivity] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState("");
  const [response, setResponse] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [pointInputs, setPointInputs] = useState<Record<string, string>>({});
  const [noteInputs, setNoteInputs] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    if (!supabase) { setLoadState("unconfigured"); return; }
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
        .limit(1)
        .maybeSingle();
      if (membershipResult.error) throw membershipResult.error;
      const currentMembership = membershipResult.data as CourseMembership | null;
      if (!currentMembership) {
        setLoadState("unenrolled");
        return;
      }
      setMembership(currentMembership);
      const courseId = currentMembership.course_id;
      const [moduleResult, activityResult, draftResult, submissionResult, feedbackResult, criteriaResult, scoresResult] =
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
            .eq("course_id", courseId)
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

  function chooseActivity(id: string) {
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
    if (!response.trim()) { setError("Please write your explanation before submitting."); return; }
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
    if (!reviewText.trim()) { setError("Add written feedback before publishing."); return; }
    const rubricScores = reviewCriteria.map((criterion) => ({
      criterion_id: criterion.id,
      points: Number(pointInputs[criterion.id]),
      note: noteInputs[criterion.id] ?? ""
    }));
    if (rubricScores.length === 0 || rubricScores.some((value, i) =>
      pointInputs[value.criterion_id]?.trim() === "" ||
      pointInputs[value.criterion_id] === undefined ||
      !Number.isFinite(value.points) || value.points < 0 ||
      value.points > reviewCriteria[i].maximum_points
    )) {
      setError("Give each rubric criterion a valid score within its maximum.");
      return;
    }
    if (!window.confirm("Publish the rubric scores and written feedback to this learner?")) return;
    setBusy(true); setError(""); setNotice("");
    try {
      const { error: publishError } = await supabase.rpc("pll_publish_review", {
        p_submission_id: reviewSubmission.id,
        p_summary: reviewText.trim(),
        p_scores: rubricScores
      });
      if (publishError) throw publishError;
      await refresh();
      setNotice("All rubric scores and feedback were published together.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The review was not published.");
    } finally { setBusy(false); }
  }

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    setMembership(null);
    setLoadState("signed-out");
  }

  if (loadState === "loading") return <StudioFrame><p>Opening your studio…</p></StudioFrame>;
  if (loadState === "unconfigured") return <StudioFrame><p role="alert">The secure LMS is not yet configured for this deployment. Set the public Supabase URL and publishable key.</p></StudioFrame>;
  if (loadState === "signed-out") return <StudioFrame><h1>Welcome back.</h1><p>Sign in to see your course and feedback.</p><Link href="/login" className="primary-link">Sign in <span aria-hidden="true">↗</span></Link></StudioFrame>;
  if (loadState === "unenrolled") return <StudioFrame><h1>Enrollment pending.</h1><p>Your account is signed in but hasn&apos;t been enrolled in this course. Contact the facilitator. Learners cannot enroll themselves.</p><button type="button" onClick={signOut} className="text-button">Sign out</button></StudioFrame>;
  if (loadState === "error") return <StudioFrame><p role="alert" className="form-error">{error}</p><button type="button" onClick={() => void refresh()} className="feedback-button">Try again</button></StudioFrame>;
  if (!membership) return null;

  return (
    <StudioFrame>
      <div className="studio-top">
        <div>
          <p className="eyebrow">Learning studio / {membership.member_role === "learner" ? "Learner" : "Facilitator"}</p>
          <h1>{membership.member_role === "learner" ? "Your work, your next step." : "Facilitator review."}</h1>
          <p>{membership.member_role === "learner"
            ? "Explain your thinking, save a draft, and submit it when you're ready."
            : "Review project decisions against transparent criteria and return useful feedback."}</p>
        </div>
        <button className="text-button" onClick={signOut} type="button">Sign out</button>
      </div>
      {notice && <p role="status" className="form-success">{notice}</p>}
      {error && <p role="alert" className="form-error">{error}</p>}
      {membership.member_role === "facilitator" && supabase && (
        <LessonEditor supabase={supabase} courseId={membership.course_id} activities={activities}
          modules={modules} refresh={refresh} />
      )}
      {membership.member_role === "learner" ? (
        <section aria-labelledby="work-heading" className="studio-work">
          <h2 id="work-heading">Choose a learning activity</h2>
          {activities.length === 0 && <p>Activities are not published yet. Your facilitator will make them available when ready.</p>}
          {activities.length > 0 && (
            <>
              <label htmlFor="activity-choice">Activity</label>
              <select id="activity-choice" value={selectedActivity} onChange={(e) => chooseActivity(e.target.value)}>
                <option value="">Choose an activity</option>
                {activities.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
              </select>
            </>
          )}
          {activeActivity && (
            <div className="studio-panel">
              <h3>{activeActivity.title}</h3>
              <p className="prewrap">{activeActivity.instructions}</p>
              <h4>How your work will be evaluated</h4>
              {assignedCriteria.length === 0 ? <p>Rubric criteria are being prepared.</p> :
              <ul>{assignedCriteria.map(c => <li key={c.id}><strong>{c.title} ({c.maximum_points} points)</strong> — {c.description}</li>)}</ul>}
              {finalSubmission ? (
                <>
                  <p className="form-success">Submitted {new Date(finalSubmission.submitted_at).toLocaleString()}.</p>
                  <h4>Your submitted explanation</h4>
                  <p className="prewrap">{finalSubmission.response_text}</p>
                  {finalFeedback?.published_at ? (
                    <div className="review-output">
                      <h4>Facilitator feedback</h4>
                      <p className="prewrap">{finalFeedback.summary}</p>
                      <ul>{scores.filter(s => s.submission_id === finalSubmission.id).map(s => {
                        const criterion = assignedCriteria.find(c => c.id === s.criterion_id);
                        return <li key={s.id}><strong>{criterion?.title ?? "Criterion"}: {s.awarded_points}/{criterion?.maximum_points ?? "?"}</strong> {s.criterion_note}</li>;
                      })}</ul>
                    </div>
                  ) : <p>Feedback will appear here when your facilitator publishes it.</p>}
                </>
              ) : (
                <>
                  <label htmlFor="learner-response">Your project reasoning or response</label>
                  <textarea id="learner-response" value={response} onChange={(e) => setResponse(e.target.value)}
                    rows={9} maxLength={20000} placeholder="Explain your choices, constraints, and what you would do next…" />
                  <div className="studio-actions">
                    <button disabled={busy} type="button" onClick={() => void saveDraft()} className="secondary-button">
                      {busy ? "Working…" : "Save draft"}
                    </button>
                    <button disabled={busy || !response.trim()} type="button" onClick={() => void submitFinal()} className="feedback-button">
                      Submit final response
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </section>
      ) : (
        <section className="studio-work" aria-labelledby="reviews-heading">
          <h2 id="reviews-heading">Learner submissions</h2>
          {submissions.length === 0 ? <p>No learner submissions yet. The platform uses synthetic demonstration accounts until reviewer access is configured.</p> : (
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
              <p className="eyebrow">Learner explanation</p>
              <p className="prewrap">{reviewSubmission.response_text}</p>
              <h4>Score each criterion</h4>
              {reviewCriteria.map(c => (
                <div className="criterion-editor" key={c.id}>
                  <label htmlFor={`score-${c.id}`}>{c.title} — maximum {c.maximum_points} points</label>
                  <p>{c.description}</p>
                  <input type="number" min="0" max={c.maximum_points} step="0.5" id={`score-${c.id}`}
                    value={pointInputs[c.id] ?? ""} onChange={e => setPointInputs(prev=>({...prev,[c.id]:e.target.value}))} />
                  <label htmlFor={`note-${c.id}`}>Criterion feedback (optional)</label>
                  <textarea id={`note-${c.id}`} rows={2} maxLength={4000}
                    value={noteInputs[c.id] ?? ""} onChange={e => setNoteInputs(prev=>({...prev,[c.id]:e.target.value}))} />
                </div>
              ))}
              <label htmlFor="review-summary">Overall feedback</label>
              <textarea id="review-summary" rows={5} maxLength={12000} value={reviewText}
                onChange={e => setReviewText(e.target.value)}
                placeholder="Explain the reasoning the learner demonstrated and identify a useful next step." />
              <div className="studio-actions">
                <button type="button" className="feedback-button" disabled={busy || reviewCriteria.length===0}
                  onClick={() => void publishReview()}>
                  {busy ? "Publishing…" : existingReview?.published_at ? "Update published review" : "Publish complete review"}
                </button>
              </div>
              {existingReview?.published_at && <p className="form-success">Review last published {new Date(existingReview.published_at).toLocaleString()}.</p>}
            </div>
          )}
        </section>
      )}
      <p className="form-note studio-note">Development build: learner and facilitator flows must pass live Auth, RLS and role-isolation tests before release. Only synthetic demonstration accounts are permitted during testing.</p>
    </StudioFrame>
  );
}

function StudioFrame({children}: {children: React.ReactNode}) {
  return (
    <>
      <a className="skip" href="#studio-main">Skip to studio content</a>
      <header className="site-header">
        <div className="brand"><span className="brand-mark" aria-hidden="true">✳</span>
          <div><strong>Project Launch Lab</strong><span className="brand-sub">Open World Learning Lab · Development</span></div>
        </div>
        <nav aria-label="Navigation"><Link href="/">Course overview</Link><Link href="/studio">My studio</Link></nav>
      </header>
      <main className="page-wrap studio-container" id="studio-main">{children}</main>
    </>
  );
}
