"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { browserSupabase } from "@/lib/supabase-browser";
import type { LessonProgressIdentity } from "./project-direction-lesson";

type Status = "preview" | "loading" | "ready" | "saving" | "error";

/** Private, versioned learner work. This never creates a submitted response. */
export function usePrivateLessonDraft<T extends object>({
  progress, lessonKey, snapshot, restore, normalize, onDirty,
}: {
  progress?: LessonProgressIdentity;
  lessonKey: string;
  snapshot: T;
  restore: (value: T) => void;
  normalize: (raw: unknown) => T | null;
  onDirty?: (dirty: boolean) => void;
}) {
  const [status, setStatus] = useState<Status>(progress ? "loading" : "preview");
  const [rowId, setRowId] = useState<string | null>(null);
  const [saved, setSaved] = useState(() => JSON.stringify(snapshot));
  const [error, setError] = useState("");
  const fingerprint = JSON.stringify(snapshot);
  const dirty = Boolean(progress && (status === "ready" || status === "saving") && fingerprint !== saved);
  const courseId = progress?.courseId, activityId = progress?.activityId, learnerId = progress?.learnerId;

  useEffect(() => {
    if (!courseId || !activityId || !learnerId) return;
    let active = true;
    void (async () => {
      try {
        const result = await browserSupabase().from("pll_lesson_progress")
          .select("id,state").eq("course_id", courseId).eq("activity_id", activityId)
          .eq("learner_id", learnerId).eq("lesson_key", lessonKey).maybeSingle();
        if (!active) return;
        if (result.error) throw new Error(result.error.message);
        if (result.data) {
          const value = normalize(result.data.state);
          if (!value) throw new Error("Saved work has an unsupported format. Nothing has been overwritten.");
          restore(value);
          setSaved(JSON.stringify(value));
          setRowId(result.data.id);
        }
        setStatus("ready");
      } catch (cause) {
        if (active) {
          setError(cause instanceof Error ? cause.message : "Could not load saved work.");
          setStatus("error");
        }
      }
    })();
    return () => { active = false; };
  }, [courseId, activityId, learnerId, lessonKey, normalize, restore]);

  // Publish the gate before paint so a saved receipt and the parent Share
  // control never disagree for an intervening interaction.
  useLayoutEffect(() => {
    onDirty?.(dirty || status === "saving");
  }, [dirty, status, onDirty]);
  useLayoutEffect(() => () => onDirty?.(false), [onDirty]);

  async function save() {
    if (!courseId || !activityId || !learnerId || status !== "ready") return;
    setStatus("saving");
    setError("");
    try {
      const client = browserSupabase();
      const result = await (rowId
        ? client.from("pll_lesson_progress").update({ state: snapshot, updated_at: new Date().toISOString() })
          .eq("id", rowId).eq("course_id", courseId).eq("activity_id", activityId).eq("learner_id", learnerId).eq("lesson_key", lessonKey)
        : client.from("pll_lesson_progress").insert({ course_id: courseId, activity_id: activityId, learner_id: learnerId, lesson_key: lessonKey, state: snapshot }))
        .select("id").single();
      if (result.error) throw new Error(result.error.message);
      setRowId(result.data.id);
      setSaved(fingerprint);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Your work could not be saved. Keep this page open and try again.");
    } finally {
      setStatus("ready");
    }
  }

  return { status, dirty, savedOnce: Boolean(rowId), error, save };
}
