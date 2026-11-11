"use client";

import { useState, type FormEvent } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { LessonText } from "./lesson-text";
import type { CourseActivity } from "@/lib/course-types";

type Module = { id: string; title: string; module_number: number; is_published: boolean };

export function LessonEditor({ supabase, courseId, activities, modules, refresh }: {
  supabase: SupabaseClient;
  courseId: string;
  activities: CourseActivity[];
  modules: Module[];
  refresh: () => Promise<void>;
}) {
  const [lessonId, setLessonId] = useState("");
  const [moduleId, setModuleId] = useState("");
  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [published, setPublished] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const selectedModule = modules.find(item => item.id === moduleId);

  function selectLesson(id: string) {
    const lesson = activities.find(item => item.id === id);
    setLessonId(id);
    setModuleId(lesson?.module_id ?? "");
    setTitle(lesson?.title ?? "");
    setInstructions(lesson?.instructions ?? "");
    setPublished(lesson?.is_published ?? false);
    setError("");
    setStatus("");
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || !selectedModule || !title.trim() || !instructions.trim()) return;
    setBusy(true);
    setError("");
    setStatus("");
    try {
      const values = { title: title.trim(), instructions: instructions.trim(), is_published: published };
      const result = lessonId
        ? await supabase.from("pll_activities").update(values)
          .eq("id", lessonId).eq("course_id", courseId).select("id").single()
        : await supabase.from("pll_activities").insert({
          ...values, course_id: courseId, module_id: selectedModule.id, slug: crypto.randomUUID()
        }).select("id").single();
      if (result.error) throw new Error(result.error.message);
      setLessonId(result.data.id);
      await refresh();
      setStatus(published ? "Lesson saved and published." : "Draft saved.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The lesson could not be saved.");
    } finally {
      setBusy(false);
    }
  }

  async function publishModule() {
    if (!selectedModule || busy) return;
    setBusy(true);
    setError("");
    setStatus("");
    try {
      const result = await supabase.from("pll_modules").update({ is_published: true })
        .eq("id", selectedModule.id).eq("course_id", courseId).select("id").single();
      if (result.error) throw new Error(result.error.message);
      await refresh();
      setStatus("Module published. Published lessons in this module are now visible to learners.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The module could not be published.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="studio-work studio-panel" aria-labelledby="lesson-editor-heading">
      <h2 id="lesson-editor-heading">Lesson editor</h2>
      {status && <p role="status" className="form-success">{status}</p>}
      {error && <p role="alert" className="form-error">{error}</p>}
      <form onSubmit={save}>
        <fieldset disabled={busy}>
          <legend>Lesson details</legend>
          <label htmlFor="edit-lesson">Lesson</label>
          <select id="edit-lesson" value={lessonId} onChange={event => selectLesson(event.target.value)}>
            <option value="">Create a lesson</option>
            {activities.map(lesson => <option key={lesson.id} value={lesson.id}>{lesson.title}</option>)}
          </select>
          <label htmlFor="lesson-module">Module</label>
          <select id="lesson-module" required disabled={Boolean(lessonId)} value={moduleId}
            onChange={event => { setModuleId(event.target.value); setPublished(false); }}>
            <option value="">Choose a module</option>
            {modules.map(item => <option key={item.id} value={item.id}>
              {item.module_number}. {item.title}{item.is_published ? "" : " (draft)"}
            </option>)}
          </select>
          {selectedModule && !selectedModule.is_published && (
            <button type="button" className="text-button" onClick={() => void publishModule()}>
              Publish module
            </button>
          )}
          <label htmlFor="lesson-title">Title</label>
          <input id="lesson-title" required maxLength={180} value={title}
            onChange={event => setTitle(event.target.value)} />
          <label htmlFor="lesson-instructions">Lesson instructions</label>
          <textarea id="lesson-instructions" required rows={8} maxLength={20000} value={instructions}
            onChange={event => setInstructions(event.target.value)} />
          <label htmlFor="lesson-visibility">Visibility</label>
          <select id="lesson-visibility" value={published ? "published" : "draft"}
            onChange={event => setPublished(event.target.value === "published")}>
            <option value="draft">Draft</option>
            <option value="published" disabled={!selectedModule?.is_published}>Published</option>
          </select>
          <div className="studio-actions">
            <button className="feedback-button" type="submit">Save lesson</button>
          </div>
        </fieldset>
      </form>
      <details>
        <summary>Preview lesson text</summary>
        <h3>{title || "Untitled lesson"}</h3>
        <LessonText text={instructions} />
      </details>
    </section>
  );
}
