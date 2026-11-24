"use client";

import { useState, type FormEvent } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";

type CourseModule = { id: string; title: string; module_number: number; is_published: boolean };

export function ModuleEditor({ supabase, courseId, modules, refresh }: {
  supabase: SupabaseClient;
  courseId: string;
  modules: CourseModule[];
  refresh: () => Promise<void>;
}) {
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [position, setPosition] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  function choose(id: string) {
    const selected = modules.find(item => item.id === id);
    setId(id);
    setTitle(selected?.title ?? "");
    setPosition(selected ? String(selected.module_number) : "");
    setStatus("");
    setError("");
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setStatus("");
    setError("");
    const moduleNumber = Number(position);
    if (!title.trim() || !Number.isInteger(moduleNumber) || moduleNumber < 1 || moduleNumber > 20) {
      setError("Enter a title and a whole-number position from 1 to 20.");
      return;
    }
    if (modules.some(item => item.id !== id && item.module_number === moduleNumber)) {
      setError("That position is already in use. Choose an unused position.");
      return;
    }

    setBusy(true);
    const values = { title: title.trim(), module_number: moduleNumber };
    try {
      const result = id
        ? await supabase.from("pll_modules").update(values).eq("id", id).eq("course_id", courseId).select("id").single()
        : await supabase.from("pll_modules").insert({ ...values, course_id: courseId }).select("id").single();
      if (result.error) throw new Error(result.error.code === "23505"
        ? "That position was just taken. Choose an unused position."
        : result.error.message);
      setId(result.data.id);
      await refresh();
      setStatus(id ? "Module updated." : "Draft module created. You can add a lesson below.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The module could not be saved.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="studio-work studio-panel" aria-labelledby="module-editor-heading">
      <h2 id="module-editor-heading">Modules</h2>
      {status && <p role="status" className="form-success">{status}</p>}
      {error && <p role="alert" className="form-error">{error}</p>}
      <form onSubmit={save}>
        <fieldset disabled={busy}>
          <legend>Create or edit a module</legend>
          <label htmlFor="edit-module">Module</label>
          <select id="edit-module" value={id} onChange={event => choose(event.target.value)}>
            <option value="">Create a module</option>
            {modules.map(item => (
              <option key={item.id} value={item.id}>
                {item.module_number}. {item.title}{item.is_published ? "" : " (draft)"}
              </option>
            ))}
          </select>
          <label htmlFor="module-title">Title</label>
          <input id="module-title" required maxLength={180} value={title}
            onChange={event => setTitle(event.target.value)} />
          <label htmlFor="module-position">Position in course</label>
          <input id="module-position" type="number" required min={1} max={20} step={1}
            value={position} onChange={event => setPosition(event.target.value)} />
          <div className="studio-actions">
            <button className="feedback-button" type="submit">{busy ? "Saving…" : "Save module"}</button>
          </div>
        </fieldset>
      </form>
    </section>
  );
}
