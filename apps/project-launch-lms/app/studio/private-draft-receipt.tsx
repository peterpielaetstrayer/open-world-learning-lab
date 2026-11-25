"use client";

type DraftState = {
  status: "preview" | "loading" | "ready" | "saving" | "error";
  dirty: boolean;
  savedOnce: boolean;
  error: string;
};

/** A local receipt next to a save control, including when that control is disabled. */
export function PrivateDraftReceipt({ draft }: { draft: DraftState }) {
  if (draft.status === "preview") return null;
  const saved = draft.status === "ready" && draft.savedOnce && !draft.dirty && !draft.error;
  const message = draft.status === "loading" ? "Loading saved fields…"
    : draft.status === "saving" ? "Saving your current fields…"
    : draft.status === "error" ? "Saved work could not be loaded. Refresh before editing."
    : draft.error ? "Save failed. Your current entries are still here; try saving again."
    : saved ? "✓ All current fields are saved privately."
    : draft.dirty ? "Changes have not been saved."
    : "Save whenever you need to pause.";
  return <div className="private-draft-receipt" data-saved={saved ? "true" : "false"}>
    <p role={draft.error ? "alert" : "status"}>{message}</p>
    {saved && <p className="form-note">You can leave and return to these fields. Nothing was shared by saving.</p>}
  </div>;
}
