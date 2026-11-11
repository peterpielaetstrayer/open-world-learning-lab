"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";

const questions = [
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
];

type Response = { ratings: number[]; comments: string; submitted_at: string };

export function CourseEvaluation({ supabase, courseId, instructor, preview }: {
  supabase: SupabaseClient; courseId: string; instructor: boolean; preview: boolean;
}) {
  const [responses, setResponses] = useState<Response[]>([]);
  const [ratings, setRatings] = useState<number[]>(Array(questions.length).fill(0));
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(!preview);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (preview) return;
    let active = true;
    void (async () => {
      try {
        const result = await supabase.from("pll_course_evaluations")
          .select("ratings,comments,submitted_at").eq("course_id", courseId).order("submitted_at");
        if (result.error) throw new Error(result.error.message);
        if (active) setResponses(result.data as Response[]);
      } catch (cause) {
        if (active) setError(cause instanceof Error ? cause.message : "Evaluations could not be loaded.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [supabase, courseId, preview]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (preview || instructor || saving || responses.length || ratings.some(value => value < 1)) return;
    setSaving(true);
    setError("");
    try {
      const result = await supabase.from("pll_course_evaluations")
        .insert({ course_id: courseId, ratings, comments: comments.trim() })
        .select("ratings,comments,submitted_at").single();
      if (result.error) throw new Error(result.error.code === "23505"
        ? "An evaluation was already submitted. Refresh to see your receipt." : result.error.message);
      setResponses([result.data as Response]);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Your evaluation could not be saved.");
    } finally {
      setSaving(false);
    }
  }

  return <section className="studio-work" aria-labelledby="evaluation-heading">
    <h2 id="evaluation-heading">Course evaluation</h2>
    {loading && <p role="status">Loading evaluation…</p>}
    {error && <p className="form-error" role="alert">{error}</p>}
    {!loading && instructor && !preview && <>
      <p>{responses.length} {responses.length === 1 ? "response" : "responses"}</p>
      {responses.length > 0 && <>
        <p>Average rating for each statement, out of 5.</p>
        <ol>{questions.map((question, index) => <li key={question}>
          {question} <strong>{(responses.reduce((total, response) => total + response.ratings[index], 0) / responses.length).toFixed(1)}</strong>
        </li>)}</ol>
        {responses.filter(response => response.comments).map((response, index) =>
          <p className="prewrap" key={index}>{response.comments}</p>)}
      </>}
    </>}
    {!loading && (!instructor || preview) && (responses.length > 0
      ? <p className="form-success" role="status">Your evaluation was submitted. Thank you for your feedback.</p>
      : <form onSubmit={submit}>
        <p>Choose how much you agree with each statement. Your feedback helps the instructor improve the course.</p>
        <fieldset disabled={preview || saving || loading}>
          <legend>Rate the course</legend>
          {questions.map((question, index) => <div key={question}>
            <label htmlFor={`rating-${index}`}>{question}</label>
            <select id={`rating-${index}`} required value={ratings[index] || ""} onChange={event => {
              const value = Number(event.target.value);
              setRatings(previous => previous.map((rating, i) => i === index ? value : rating));
            }}>
              <option value="">Choose a rating</option>
              <option value="1">1 · Strongly disagree</option>
              <option value="2">2 · Disagree</option>
              <option value="3">3 · Neutral</option>
              <option value="4">4 · Agree</option>
              <option value="5">5 · Strongly agree</option>
            </select>
          </div>)}
          <label htmlFor="evaluation-comments">What would make this course better? (Optional)</label>
          <textarea id="evaluation-comments" rows={4} value={comments} maxLength={4000}
            onChange={event => setComments(event.target.value)} />
          <div className="studio-actions">
            <button type="submit" className="feedback-button">{saving ? "Submitting…" : "Submit evaluation"}</button>
          </div>
        </fieldset>
      </form>)}
  </section>;
}
