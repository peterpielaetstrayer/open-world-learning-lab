"use client";

import { useState, type FormEvent } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { CourseActivity, RubricCriterion } from "@/lib/course-types";

type CriterionInput = { id: string; title: string; description: string; points: string };

export function RubricEditor({ supabase, activities, criteria, refresh }: {
  supabase: SupabaseClient;
  activities: CourseActivity[];
  criteria: RubricCriterion[];
  refresh: () => Promise<void>;
}) {
  const [activityId, setActivityId] = useState("");
  const [rows, setRows] = useState<CriterionInput[]>([]);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const activity = activities.find(item => item.id === activityId);

  function chooseActivity(id: string) {
    setActivityId(id);
    setRows(criteria.filter(item => item.activity_id === id).map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      points: String(item.maximum_points),
    })));
    setStatus("");
    setError("");
  }

  function editRow(id: string, field: "title" | "description" | "points", value: string) {
    setRows(previous => previous.map(row => row.id === id ? { ...row, [field]: value } : row));
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!activity || activity.is_published || rows.length === 0 || busy) return;
    setBusy(true);
    setStatus("");
    setError("");
    try {
      const result = await supabase.rpc("pll_save_draft_rubric", {
        p_activity_id: activity.id,
        p_criteria: rows.map(row => ({
          title: row.title.trim(), description: row.description.trim(), points: Number(row.points),
        })),
      });
      if (result.error) throw new Error(result.error.message);
      await refresh();
      setStatus("Rubric saved. Publish the assignment when it is ready for learners.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The rubric could not be saved.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="studio-work studio-panel" aria-labelledby="rubric-editor-heading">
      <h2 id="rubric-editor-heading">Assignment rubrics</h2>
      <p>Save the assignment as a draft in the lesson editor, then add the criteria learners will see before submitting.</p>
      {status && <p className="form-success" role="status">{status}</p>}
      {error && <p className="form-error" role="alert">{error}</p>}
      <form onSubmit={save}>
        <label htmlFor="rubric-activity">Assignment</label>
        <select id="rubric-activity" value={activityId} disabled={busy}
          onChange={event => chooseActivity(event.target.value)}>
          <option value="">Choose an assignment</option>
          {activities.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}
        </select>
        {activity?.is_published && <p>Published rubric. To revise a rubric before anyone submits, save the assignment as a draft first.</p>}
        {activity && (
          <fieldset disabled={busy || activity.is_published}>
            <legend>Scoring criteria</legend>
            {rows.map((row, index) => (
              <div className="criterion-editor" key={row.id}>
                <label htmlFor={`rubric-title-${row.id}`}>Criterion {index + 1} title</label>
                <input id={`rubric-title-${row.id}`} required maxLength={180} value={row.title}
                  onChange={event => editRow(row.id, "title", event.target.value)} />
                <label htmlFor={`rubric-description-${row.id}`}>What successful work shows</label>
                <textarea id={`rubric-description-${row.id}`} rows={2} maxLength={4000} value={row.description}
                  onChange={event => editRow(row.id, "description", event.target.value)} />
                <label htmlFor={`rubric-points-${row.id}`}>Maximum points</label>
                <input id={`rubric-points-${row.id}`} type="number" required min="0.01" max="1000" step="0.01"
                  value={row.points} onChange={event => editRow(row.id, "points", event.target.value)} />
                <button type="button" className="text-button" onClick={() => setRows(previous => previous.filter(item => item.id !== row.id))}>
                  Remove criterion {index + 1}
                </button>
              </div>
            ))}
            <div className="studio-actions">
              <button type="button" className="secondary-button" disabled={rows.length >= 20} onClick={() => {
                const id = crypto.randomUUID();
                setRows(previous => [...previous, { id, title: "", description: "", points: "" }]);
              }}>Add criterion</button>
              <button type="submit" className="feedback-button" disabled={rows.length === 0}>{busy ? "Saving…" : "Save rubric"}</button>
            </div>
          </fieldset>
        )}
      </form>
    </section>
  );
}