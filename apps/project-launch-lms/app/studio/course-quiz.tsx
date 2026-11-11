"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";

type Question = { position: number; prompt: string; options: string[] };
type AnswerFeedback = { position: number; selected: number; correct: boolean; explanation: string };
type Attempt = { score: number; feedback: AnswerFeedback[]; submitted_at: string };

export function CourseQuiz({ supabase, courseId, identity, instructor, preview }: {
  supabase: SupabaseClient; courseId: string; identity: string; instructor: boolean; preview: boolean;
}) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const questionsRequest = supabase.from("pll_quiz_questions")
          .select("position,prompt,options").eq("course_id", courseId).order("position");
        const attemptRequest = supabase.from("pll_quiz_attempts")
          .select("score,feedback,submitted_at").eq("course_id", courseId);
        const [questionResult, attemptResult] = await Promise.all([
          questionsRequest, preview ? null : instructor ? attemptRequest : attemptRequest.eq("learner_id", identity),
        ]);
        if (questionResult.error) throw new Error(questionResult.error.message);
        if (attemptResult?.error) throw new Error(attemptResult.error.message);
        if (active) {
          setQuestions(questionResult.data as Question[]);
          setAttempts((attemptResult?.data ?? []) as Attempt[]);
        }
      } catch (cause) {
        if (active) setError(cause instanceof Error ? cause.message : "The quiz could not be loaded.");
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => { active = false; };
  }, [supabase, courseId, identity, instructor, preview]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (instructor || preview || saving || attempts.length || questions.length !== 10 ||
      questions.some(question => !answers[question.position])) return;
    setSaving(true);
    setError("");
    try {
      const result = await supabase.rpc("pll_submit_quiz", {
        p_course_id: courseId, p_answers: questions.map(question => answers[question.position]),
      });
      if (result.error && result.error.code !== "23505") throw new Error(result.error.message);
      const receipt = await supabase.from("pll_quiz_attempts").select("score,feedback,submitted_at")
        .eq("course_id", courseId).eq("learner_id", identity).single();
      if (receipt.error) throw new Error("The result could not be loaded. Refresh to check your submission.");
      setAttempts([receipt.data as Attempt]);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The quiz could not be submitted.");
    } finally {
      setSaving(false);
    }
  }

  const attempt = !instructor && attempts[0];
  return <section className="studio-work" aria-labelledby="quiz-heading">
    <h2 id="quiz-heading">Project Launch knowledge check</h2>
    {loading && <p role="status">Loading quiz…</p>}
    {error && <p className="form-error" role="alert">{error}</p>}
    {!loading && !error && questions.length !== 10 && <p>The quiz is not available for this course yet.</p>}
    {!loading && questions.length === 10 && <>
      {instructor && !preview && <p>{attempts.length} submitted · Average {attempts.length
        ? `${(attempts.reduce((sum, item) => sum + item.score, 0) / attempts.length).toFixed(1)} / 10`
        : "pending"}</p>}
      {attempt && <p className="form-success" role="status">Your score: {attempt.score} / 10</p>}
      {!attempt && !instructor && !preview && <p>Answer all ten questions. After submitting, you’ll see your score and an explanation for each answer.</p>}
      <form onSubmit={submit}>
        {questions.map(question => {
          const feedback = attempt ? attempt.feedback.find(item => item.position === question.position) : undefined;
          return <fieldset key={question.position} className="criterion-editor" disabled={saving || Boolean(attempt) || instructor || preview}>
            <legend>{question.position}. {question.prompt}</legend>
            <div className="options">
              {question.options.map((option, index) => <label className="option" key={option}>
                <input type="radio" required name={`quiz-${question.position}`}
                  checked={(feedback?.selected ?? answers[question.position]) === index + 1}
                  onChange={() => setAnswers(previous => ({ ...previous, [question.position]: index + 1 }))} />
                <span>{option}</span>
              </label>)}
            </div>
            {feedback && <p className="feedback"><strong>{feedback.correct ? "Correct." : "Incorrect."}</strong> {feedback.explanation}</p>}
          </fieldset>;
        })}
        {!attempt && !instructor && !preview && <button className="feedback-button" type="submit" disabled={saving}>
          {saving ? "Submitting…" : "Submit quiz"}
        </button>}
      </form>
    </>}
  </section>;
}
